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

type CaptionEntry = { text: string; startMs: number; endMs: number };

/**
 * Merge Whisper punctuation/contraction tokens with the preceding word
 * so that word boundaries match natural English words.
 * "don" + "'t" → "don't", "hello" + "," → "hello,"
 */
function mergeWhisperTokens(captions: CaptionEntry[]): CaptionEntry[] {
  const merged: CaptionEntry[] = [];

  for (const caption of captions) {
    const trimmed = caption.text.trim();
    if (!trimmed) continue;

    const shouldMerge =
      merged.length > 0 &&
      (/^[,.\!\?;:\)\]\}…]+$/.test(trimmed) ||
        /^'(t|s|re|ll|ve|d|m|n)$/i.test(trimmed));

    if (shouldMerge) {
      const prev = merged[merged.length - 1];
      prev.text = prev.text + trimmed;
      prev.endMs = caption.endMs;
    } else {
      merged.push({ text: trimmed, startMs: caption.startMs, endMs: caption.endMs });
    }
  }

  return merged;
}

/**
 * Align Whisper timestamps to the original narration text.
 *
 * We already know the exact text (we wrote the narration). Whisper sometimes
 * mishears words, mangles punctuation, or splits contractions. Instead of
 * showing Whisper's transcription, we show the original text and use Whisper
 * only for word-level timing.
 *
 * Algorithm:
 * 1. Split original text into words (whitespace-separated, punctuation attached).
 * 2. Merge Whisper tokens so word boundaries roughly match.
 * 3. Walk both lists with a two-pointer + lookahead alignment.
 * 4. For each original word, find its best Whisper match and take the timing.
 */
function alignToOriginalText(
  originalText: string,
  whisperCaptions: CaptionEntry[]
): CaptionEntry[] {
  const originalWords = originalText.match(/\S+/g) || [];
  const whisper = mergeWhisperTokens(whisperCaptions);

  if (originalWords.length === 0) return [];
  if (whisper.length === 0) return [];

  // Strip to bare letters/digits for comparison
  const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

  const result: CaptionEntry[] = [];
  let wi = 0; // whisper pointer

  for (let oi = 0; oi < originalWords.length; oi++) {
    const origNorm = norm(originalWords[oi]);

    if (wi >= whisper.length) {
      // Whisper ran out - extrapolate from the last known time
      const lastEnd = result.length > 0 ? result[result.length - 1].endMs : 0;
      result.push({ text: originalWords[oi], startMs: lastEnd, endMs: lastEnd + 250 });
      continue;
    }

    // Look ahead in whisper (up to 4) for a normalized match
    const LOOK = 4;
    let matchIdx = -1;
    for (let j = 0; j <= LOOK && wi + j < whisper.length; j++) {
      if (norm(whisper[wi + j].text) === origNorm) {
        matchIdx = wi + j;
        break;
      }
    }

    if (matchIdx >= 0) {
      // Matched - absorb any skipped Whisper words' time span
      result.push({
        text: originalWords[oi],
        startMs: whisper[wi].startMs,
        endMs: whisper[matchIdx].endMs,
      });
      wi = matchIdx + 1;
    } else {
      // No match in whisper lookahead. Check if whisper's current word
      // matches a *future* original word (whisper may have extra tokens).
      const whisperNorm = norm(whisper[wi].text);
      let skipWhisper = false;
      for (let j = 1; j <= LOOK && oi + j < originalWords.length; j++) {
        if (norm(originalWords[oi + j]) === whisperNorm) {
          skipWhisper = true;
          break;
        }
      }

      if (skipWhisper) {
        // Whisper has an extra word that doesn't exist in original.
        // Give the original word time between previous end and whisper's start.
        const prevEnd = result.length > 0 ? result[result.length - 1].endMs : whisper[wi].startMs;
        result.push({
          text: originalWords[oi],
          startMs: prevEnd,
          endMs: whisper[wi].startMs,
        });
        // Don't advance wi - it will match a later original word
      } else {
        // Can't align - pair them 1:1 anyway and move on
        result.push({
          text: originalWords[oi],
          startMs: whisper[wi].startMs,
          endMs: whisper[wi].endMs,
        });
        wi++;
      }
    }
  }

  return result;
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

    // Align Whisper's timestamps to the original narration text.
    // This gives us perfect subtitle text (from our narration) with
    // precise word-level timing (from Whisper).
    const captions = alignToOriginalText(
      text,
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
