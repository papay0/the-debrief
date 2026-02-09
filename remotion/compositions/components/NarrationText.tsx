import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Caption } from "../../schemas";
import { COLORS, FONTS, REEL_COLORS, REEL_FONTS } from "../../constants";

interface NarrationTextProps {
  narration: string;
  captions: Caption[];
  format: "square" | "vertical";
  theme?: "light" | "dark";
}

/**
 * Renders narration text inline on the slide with word-by-word
 * karaoke-style highlighting synced to audio captions.
 *
 * - Current word: bold + accent color
 * - Past words: full opacity ink color
 * - Future words: dimmed (~0.3 opacity)
 */
export const NarrationText: React.FC<NarrationTextProps> = ({
  narration,
  captions,
  format,
  theme = "light",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;

  const isDark = theme === "dark";
  const colors = isDark ? REEL_COLORS : COLORS;
  const fonts = isDark ? REEL_FONTS : FONTS;
  const isVertical = format === "vertical";

  const fontSize = isDark ? 48 : isVertical ? 46 : 42;

  // If no captions, show narration as static text
  if (!captions || captions.length === 0) {
    return (
      <div
        style={{
          fontSize,
          fontFamily: fonts.serif,
          fontWeight: 500,
          color: colors.ink,
          lineHeight: 1.5,
          maxWidth: 900,
        }}
      >
        {narration}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px 10px",
        maxWidth: 900,
        lineHeight: 1.55,
      }}
    >
      {captions.map((caption, i) => {
        const isActive =
          currentTimeMs >= caption.startMs && currentTimeMs <= caption.endMs;
        const isPast = currentTimeMs > caption.endMs;

        return (
          <span
            key={`${caption.startMs}-${i}`}
            style={{
              fontFamily: fonts.serif,
              fontSize,
              fontWeight: isActive ? 700 : 500,
              color: isActive
                ? isDark
                  ? REEL_COLORS.accent
                  : COLORS.accent
                : colors.ink,
              opacity: isActive ? 1 : isPast ? 0.85 : 0.3,
            }}
          >
            {caption.text.trim()}
          </span>
        );
      })}
    </div>
  );
};
