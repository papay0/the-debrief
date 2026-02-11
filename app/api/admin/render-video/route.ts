import { NextResponse } from "next/server";
import path from "path";
import { readFile, unlink } from "fs/promises";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { SQUARE, VERTICAL, FPS } from "@/remotion/constants";

export const maxDuration = 300; // 5 minutes

/**
 * Convert API audio URLs back to staticFile-compatible paths for Remotion rendering.
 * During preview, audio is served via /api/admin/audio/scene-0.wav (because Next.js
 * dev server doesn't serve dynamically created files in public/).
 * During rendering, the Remotion bundle serves from public/ directly, so we need
 * the relative path like "audio/scene-0.wav".
 */
function convertAudioUrlsForRendering(props: Record<string, unknown>) {
  if (!props.scenes || !Array.isArray(props.scenes)) return props;

  return {
    ...props,
    scenes: props.scenes.map((scene: Record<string, unknown>) => {
      if (!scene.audio) return scene;
      const audio = scene.audio as Record<string, unknown>;
      const audioUrl = audio.audioUrl as string;
      if (audioUrl?.startsWith("/api/admin/audio/")) {
        const filename = audioUrl.replace("/api/admin/audio/", "");
        return {
          ...scene,
          audio: { ...audio, audioUrl: `audio/${filename}` },
        };
      }
      return scene;
    }),
  };
}

export async function POST(request: Request) {
  const { props, format, compositionId: explicitCompositionId } =
    await request.json();

  try {
    const entryPoint = path.join(process.cwd(), "remotion", "index.tsx");

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint,
      // Use webpack override for zod alias
      webpackOverride: (config) => {
        return {
          ...config,
          resolve: {
            ...config.resolve,
            alias: {
              ...(config.resolve?.alias || {}),
              "zod-remotion": path.join(
                process.cwd(),
                "node_modules",
                "zod-remotion",
                "lib",
                "index.js"
              ),
            },
          },
        };
      },
    });

    const compositionId =
      explicitCompositionId ||
      (format === "square" ? "ArticleVideoSquare" : "ArticleVideoVertical");

    // For MiniReel, props are passed directly (no audio URL conversion needed)
    const inputProps =
      compositionId === "MiniReel"
        ? props
        : convertAudioUrlsForRendering({
            ...props,
            format,
          });

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps,
    });

    const outputPath = path.join("/tmp", `${compositionId}-${Date.now()}.mp4`);

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps,
    });

    const fileBuffer = await readFile(outputPath);
    unlink(outputPath).catch(() => {});

    const filename = `article-video-${format === "square" ? "1x1" : "9x16"}.mp4`;

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown render error";
    console.error("Render error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
