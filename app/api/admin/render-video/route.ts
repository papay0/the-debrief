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
  const { props, format } = await request.json();

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

    const formats =
      format === "both" ? (["square", "vertical"] as const) : [format as "square" | "vertical"];

    const outputPaths: string[] = [];

    for (const fmt of formats) {
      const compositionId =
        fmt === "square" ? "ArticleVideoSquare" : "ArticleVideoVertical";

      const inputProps = convertAudioUrlsForRendering({
        ...props,
        format: fmt,
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

      outputPaths.push(outputPath);
    }

    // Return the first file (or we could zip both)
    const filePath = outputPaths[0];
    const fileBuffer = await readFile(filePath);

    // Clean up temp files
    for (const p of outputPaths) {
      unlink(p).catch(() => {});
    }

    const filename =
      format === "both"
        ? "article-video-square.mp4"
        : `article-video-${format}.mp4`;

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
