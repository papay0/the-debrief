import React from "react";
import { useCurrentFrame } from "remotion";
import { interpolate } from "remotion";
import type { MiniReelProps } from "../mini-reel-schemas";
import {
  MINI_REEL_GRADIENTS,
  MINI_REEL_FRAMES,
  REEL_COLORS,
  REEL_FONTS,
  FPS,
} from "../constants";

/**
 * MiniReel: A 3-4 second animated news card for Instagram Reels.
 * No audio. Just gradient + headline + TLDR + brand footer.
 * Designed to loop and be instantly scannable.
 *
 * Key design decisions:
 * - Headline visible from frame 0 (no empty start)
 * - Text fills the screen (centered vertically)
 * - Progress bar at bottom gives visual movement
 * - Large fonts like TLDR newsletter style
 */
export const MiniReel: React.FC<MiniReelProps> = ({
  headline,
  tldr,
  gradient,
}) => {
  const frame = useCurrentFrame();
  const bg = MINI_REEL_GRADIENTS[gradient];

  // ── Animations ──
  // Headline: visible immediately, tiny fade-in over 4 frames (barely noticeable)
  const headlineOpacity = interpolate(frame, [0, 4], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headlineY = interpolate(frame, [0, 6], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent line: draws from frame 0-10
  const accentLineScale = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // TLDR: appears very quickly after headline (frame 4-12)
  const tldrOpacity = interpolate(frame, [4, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tldrY = interpolate(frame, [4, 14], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Footer: fades in slightly after TLDR
  const footerOpacity = interpolate(frame, [12, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Typewriter for "The Debrief" ──
  const BRAND_TEXT = "The Debrief";
  const TYPEWRITER_START = 20; // start typing after footer fades in
  const CHARS_PER_FRAME = 0.35; // ~3 frames per character (matches website's ~95ms at 30fps)

  const typewriterCount = Math.min(
    Math.floor(Math.max(0, frame - TYPEWRITER_START) * CHARS_PER_FRAME),
    BRAND_TEXT.length
  );
  const typedText = BRAND_TEXT.slice(0, typewriterCount);
  const typewriterDone = typewriterCount >= BRAND_TEXT.length;
  const typewriterDoneFrame = TYPEWRITER_START + Math.ceil(BRAND_TEXT.length / CHARS_PER_FRAME);

  // Blinking cursor (toggles every 16 frames = ~530ms, same as website)
  const cursorBlink = Math.floor(frame / 16) % 2 === 0;
  // Cursor fades out ~1s after typing is done
  const cursorFadeStart = typewriterDoneFrame + FPS;
  const cursorOpacity = typewriterDone
    ? interpolate(frame, [cursorFadeStart, cursorFadeStart + 12], [0.9, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : cursorBlink ? 0.9 : 0;

  // Keystrike: the latest character gets a micro bounce
  const latestCharFrame = TYPEWRITER_START + Math.floor(typewriterCount / CHARS_PER_FRAME);
  const strikeProgress = interpolate(
    frame,
    [latestCharFrame, latestCharFrame + 4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );


  // Progress bar: fills over the full duration
  const progressWidth = interpolate(frame, [0, MINI_REEL_FRAMES], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Responsive headline size - as big as possible
  const headlineFontSize =
    headline.length > 60
      ? 100
      : headline.length > 45
        ? 120
        : headline.length > 30
          ? 140
          : 160;

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: bg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 64px",
      }}
    >
      {/* Noise overlay */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.04,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={3}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(74, 108, 247, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content - centered vertically */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Accent line */}
        <div
          style={{
            width: 100,
            height: 6,
            background: REEL_COLORS.accent,
            borderRadius: 3,
            marginBottom: 40,
            transform: `scaleX(${accentLineScale})`,
            transformOrigin: "left",
          }}
        />

        {/* Headline - BIG and visible immediately */}
        <div
          style={{
            fontFamily: REEL_FONTS.serif,
            fontWeight: 900,
            fontSize: headlineFontSize,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: REEL_COLORS.ink,
            marginBottom: 48,
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          {headline}
        </div>

        {/* TLDR - big and readable */}
        <div
          style={{
            fontFamily: REEL_FONTS.sans,
            fontSize: 56,
            lineHeight: 1.4,
            color: "rgba(245, 245, 240, 0.8)",
            fontWeight: 400,
            marginBottom: 56,
            opacity: tldrOpacity,
            transform: `translateY(${tldrY}px)`,
          }}
        >
          {tldr}
        </div>

        {/* Divider + Footer */}
        <div style={{ opacity: footerOpacity }}>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(245, 245, 240, 0.15)",
              marginBottom: 32,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: REEL_FONTS.serif,
                fontWeight: 700,
                fontSize: 46,
                color: "rgba(245, 245, 240, 0.6)",
                letterSpacing: "0.05em",
                display: "inline-flex",
                alignItems: "baseline",
                minHeight: "1.2em",
              }}
            >
              {typedText.split("").map((char, i) => {
                const isLatest = i === typewriterCount - 1 && !typewriterDone;
                // Keystrike: character pops in from slightly below, bounces up
                const charY = isLatest
                  ? interpolate(strikeProgress, [0, 0.5, 1], [2, -0.5, 0])
                  : 0;
                const charOpacity = isLatest
                  ? interpolate(strikeProgress, [0, 0.3], [0, 1], {
                      extrapolateRight: "clamp",
                    })
                  : 1;

                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      transform: `translateY(${charY}px)`,
                      opacity: charOpacity,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                );
              })}
              {/* Blinking cursor */}
              <span
                style={{
                  display: "inline-block",
                  width: 3,
                  height: "0.85em",
                  marginLeft: 6,
                  background: "rgba(245, 245, 240, 0.5)",
                  opacity: cursorOpacity,
                  verticalAlign: "baseline",
                }}
              />
            </span>
            <span
              style={{
                fontFamily: REEL_FONTS.sans,
                fontSize: 44,
                color: "rgba(245, 245, 240, 0.55)",
                fontWeight: 500,
              }}
            >
              the-debrief.ai
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "rgba(255, 255, 255, 0.06)",
          zIndex: 3,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progressWidth}%`,
            background: `linear-gradient(90deg, ${REEL_COLORS.accent}, rgba(74, 108, 247, 0.4))`,
            borderRadius: "0 3px 3px 0",
          }}
        />
      </div>
    </div>
  );
};
