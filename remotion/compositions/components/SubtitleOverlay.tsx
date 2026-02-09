import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Caption } from "../../schemas";
import { SUBTITLE, REEL_SUBTITLE, FONTS } from "../../constants";

interface SubtitleOverlayProps {
  captions: Caption[];
  format: "square" | "vertical";
}

/**
 * Renders word-by-word subtitle overlay synced to audio timestamps.
 * Words highlight as they are spoken, keeping the viewer engaged.
 */
export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  captions,
  format,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  if (captions.length === 0) return null;

  // Group captions into display chunks of ~6-8 words
  const chunks = groupCaptionsIntoChunks(captions, 7);

  // Find the active chunk (the one that contains the current time)
  const activeChunk = chunks.find(
    (chunk) =>
      currentTimeMs >= chunk[0].startMs &&
      currentTimeMs <= chunk[chunk.length - 1].endMs
  );

  if (!activeChunk) return null;

  const isReel = format === "vertical";
  const style = isReel ? REEL_SUBTITLE : SUBTITLE;
  const bottomOffset = isReel ? REEL_SUBTITLE.bottomOffset : SUBTITLE.bottomOffset;

  return (
    <div
      style={{
        position: "absolute",
        bottom: bottomOffset,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: `0 ${style.padding}px`,
      }}
    >
      <div
        style={{
          background: style.bgColor,
          borderRadius: 12,
          padding: "16px 28px",
          maxWidth: style.maxWidth,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4px 8px",
          ...(isReel
            ? { backdropFilter: REEL_SUBTITLE.backdropBlur, WebkitBackdropFilter: REEL_SUBTITLE.backdropBlur }
            : {}),
        }}
      >
        {activeChunk.map((caption, i) => {
          const isActive =
            currentTimeMs >= caption.startMs &&
            currentTimeMs <= caption.endMs;
          const isPast = currentTimeMs > caption.endMs;

          return (
            <span
              key={`${caption.startMs}-${i}`}
              style={{
                fontFamily: FONTS.sans,
                fontSize: style.fontSize,
                fontWeight: isActive ? 700 : 500,
                lineHeight: style.lineHeight,
                color: isActive
                  ? style.activeWordColor
                  : isPast
                    ? style.highlightColor
                    : "rgba(255,255,255,0.6)",
                transition: "none",
              }}
            >
              {caption.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Groups captions into chunks of approximately `size` words
 * so subtitles show a phrase at a time instead of one word.
 */
function groupCaptionsIntoChunks(
  captions: Caption[],
  size: number
): Caption[][] {
  const chunks: Caption[][] = [];
  for (let i = 0; i < captions.length; i += size) {
    chunks.push(captions.slice(i, i + size));
  }
  return chunks;
}
