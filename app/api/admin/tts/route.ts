import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import os from "os";
import {
  installWhisperCpp,
  transcribe,
  downloadWhisperModel,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
const WHISPER_VERSION = "1.5.5";
const WHISPER_MODEL = "base.en";

const HOME = os.homedir();
const KOKORO_MODEL = path.join(
  HOME,
  ".local/share/kokoro-tts/kokoro-v1.0.onnx"
);
const KOKORO_VOICES = path.join(
  HOME,
  ".local/share/kokoro-tts/voices-v1.0.bin"
);

function runCommand(
  command: string,
  args: string[],
  input?: string
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args);
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    if (input) {
      proc.stdin.write(input);
      proc.stdin.end();
    }

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Command "${command}" exited with code ${code}: ${stderr}`
          )
        );
      } else {
        resolve({ stdout, stderr });
      }
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to spawn "${command}": ${err.message}`));
    });
  });
}

// Ensure Whisper.cpp is installed (idempotent)
let whisperReady: Promise<void> | null = null;
function ensureWhisper(): Promise<void> {
  if (!whisperReady) {
    whisperReady = (async () => {
      await installWhisperCpp({
        to: WHISPER_PATH,
        version: WHISPER_VERSION,
        printOutput: false,
      });
      await downloadWhisperModel({
        model: WHISPER_MODEL,
        folder: WHISPER_PATH,
        printOutput: false,
      });
    })();
  }
  return whisperReady;
}

/**
 * Merge punctuation marks and contraction suffixes with the preceding word.
 * Whisper.cpp tokenizes "don't" as ["don", "'t"] and "hello," as ["hello", ","].
 * This merges them back so subtitles read naturally: "don't" and "hello,".
 */
function mergePunctuationTokens(
  captions: { text: string; startMs: number; endMs: number }[]
) {
  const merged: { text: string; startMs: number; endMs: number }[] = [];

  for (const caption of captions) {
    const trimmed = caption.text.trim();
    if (!trimmed) continue;

    const shouldMergeWithPrev =
      merged.length > 0 &&
      // Punctuation: , . ! ? ; : ) ] } ...
      (/^[,.\!\?;:\)\]\}…]+$/.test(trimmed) ||
        // Contraction suffixes: 't 's 're 'll 've 'd 'm 'n
        /^'(t|s|re|ll|ve|d|m|n)$/i.test(trimmed));

    if (shouldMergeWithPrev) {
      const prev = merged[merged.length - 1];
      prev.text = prev.text + trimmed; // no space before punctuation
      prev.endMs = caption.endMs;
    } else {
      merged.push({ text: trimmed, startMs: caption.startMs, endMs: caption.endMs });
    }
  }

  return merged;
}

export async function POST(request: Request) {
  const {
    text,
    sceneId,
    voice = "af_heart",
    language = "en-us",
    speed = 1.0,
  } = await request.json();

  if (!text || !sceneId) {
    return NextResponse.json(
      { error: "text and sceneId are required" },
      { status: 400 }
    );
  }

  try {
    // Ensure audio directory exists
    if (!existsSync(AUDIO_DIR)) {
      await mkdir(AUDIO_DIR, { recursive: true });
    }

    const wavPath = path.join(AUDIO_DIR, `${sceneId}.wav`);

    // Step 1: Generate TTS audio with Kokoro
    await runCommand(
      "kokoro-tts",
      [
        "-",
        wavPath,
        "--voice",
        voice,
        "--speed",
        String(speed),
        "--lang",
        language,
        "--model",
        KOKORO_MODEL,
        "--voices",
        KOKORO_VOICES,
      ],
      text
    );

    // Step 2: Convert to 16kHz 16-bit WAV for Whisper (required format)
    const whisperWavPath = path.join(AUDIO_DIR, `${sceneId}-16k.wav`);
    await runCommand("ffmpeg", [
      "-y",
      "-i",
      wavPath,
      "-ar",
      "16000",
      "-ac",
      "1",
      "-sample_fmt",
      "s16",
      whisperWavPath,
    ]);

    // Step 3: Ensure Whisper.cpp is installed
    await ensureWhisper();

    // Step 4: Transcribe with Whisper.cpp for precise word-level timestamps
    const whisperResult = await transcribe({
      inputPath: whisperWavPath,
      whisperPath: WHISPER_PATH,
      model: WHISPER_MODEL,
      tokenLevelTimestamps: true,
      whisperCppVersion: WHISPER_VERSION,
      printOutput: false,
    });

    // Step 5: Convert to Remotion Caption format
    const { captions: remotionCaptions } = toCaptions({
      whisperCppOutput: whisperResult,
    });

    // Post-process: merge punctuation and contractions with adjacent words.
    // Whisper.cpp tokenizes "isn't" as ["isn", "'t"] and "word," as ["word", ","]
    // which creates ugly spacing in subtitles.
    const captions = mergePunctuationTokens(
      remotionCaptions.map((c) => ({
        text: c.text,
        startMs: c.startMs,
        endMs: c.endMs,
      }))
    );

    // Calculate duration from the original audio
    // Use ffprobe to get exact duration
    const { stdout: durationStr } = await runCommand("ffprobe", [
      "-v",
      "quiet",
      "-show_entries",
      "format=duration",
      "-of",
      "csv=p=0",
      wavPath,
    ]);
    const durationInSeconds = parseFloat(durationStr.trim()) || 5;

    // Clean up the 16kHz temp file
    await runCommand("rm", ["-f", whisperWavPath]);

    // Return the audio URL via API route (Next.js dev server doesn't serve
    // dynamically created files in public/ without a restart)
    return NextResponse.json({
      audioUrl: `/api/admin/audio/${sceneId}.wav`,
      captions,
      durationInSeconds,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown TTS error";
    console.error("TTS error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
