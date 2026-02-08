"use client";

import { Button } from "@/components/ui/button";
import {
  Loader2,
  Square,
  Smartphone,
  Download,
  RefreshCw,
} from "lucide-react";
import { VideoPlayerWrapper } from "./video-player-wrapper";
import type { ArticleVideoProps } from "@/remotion/schemas";

type Format = "square" | "vertical";

export function VideoSection({
  videoProps,
  format,
  hasAudio,
  ttsLoading,
  renderingFormat,
  onFormatChange,
  onRegenerateTTS,
  onRenderVideo,
}: {
  videoProps: ArticleVideoProps;
  format: Format;
  hasAudio: boolean;
  ttsLoading: boolean;
  renderingFormat: string | null;
  onFormatChange: (f: Format) => void;
  onRegenerateTTS: () => void;
  onRenderVideo: (f: "square" | "vertical" | "both") => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold font-serif text-foreground">
          Video Preview
        </h2>
        <div className="flex items-center gap-2">
          {/* Format toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => onFormatChange("square")}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                format === "square"
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <Square className="w-3 h-3" />
              1:1
            </button>
            <button
              onClick={() => onFormatChange("vertical")}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors border-l border-border cursor-pointer ${
                format === "vertical"
                  ? "bg-foreground text-background"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="w-3 h-3" />
              9:16
            </button>
          </div>

          {hasAudio && (
            <>
              <Button
                onClick={onRegenerateTTS}
                disabled={ttsLoading}
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                {ttsLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Regenerate Audio
                  </>
                )}
              </Button>
              <Button
                onClick={() => onRenderVideo(format)}
                disabled={!!renderingFormat}
                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                {renderingFormat === format ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rendering...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Render {format === "square" ? "1:1" : "9:16"} MP4
                  </>
                )}
              </Button>
              <Button
                onClick={() => onRenderVideo("both")}
                disabled={!!renderingFormat}
                variant="outline"
                className="cursor-pointer"
              >
                {renderingFormat === "both" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rendering Both...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Both
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Remotion Player */}
      <div className="rounded-xl border border-border bg-muted/30 p-6">
        <VideoPlayerWrapper props={videoProps} />
      </div>
    </section>
  );
}
