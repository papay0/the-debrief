import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../../constants";
import { useFadeIn, useTypewriter, usePulse, useDrawAcross } from "../../utils/animations";
import { Masthead } from "../components/Masthead";
import { SubtitleOverlay } from "../components/SubtitleOverlay";
import type { SceneCTA } from "../../schemas";

interface CTASceneProps {
  scene: SceneCTA;
  format: "square" | "vertical";
}

export const CTAScene: React.FC<CTASceneProps> = ({ scene, format }) => {
  const frame = useCurrentFrame();
  const isVertical = format === "vertical";

  const mastheadOpacity = useFadeIn(0, 15);
  const ctaText = "Read the full article";
  const charsToShow = useTypewriter(ctaText, 10, 1);
  const dividerScale = useDrawAcross(45, 15);
  const urlOpacity = useFadeIn(55, 15);
  const arrowPulse = usePulse(30);
  const arrowOpacity = useFadeIn(65, 15);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: COLORS.bg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 100,
        fontFamily: FONTS.serif,
      }}
    >
      {/* Masthead */}
      <div style={{ marginBottom: 64, opacity: mastheadOpacity }}>
        <Masthead centered />
      </div>

      {/* CTA text - typewriter effect */}
      <div
        style={{
          fontSize: isVertical ? 72 : 68,
          fontWeight: 700,
          color: COLORS.ink,
          textAlign: "center" as const,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: 28,
          minHeight: isVertical ? 180 : 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ctaText.slice(0, charsToShow)}
        {charsToShow < ctaText.length && (
          <span
            style={{
              opacity: frame % 16 < 8 ? 1 : 0,
              color: COLORS.accent,
            }}
          >
            |
          </span>
        )}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 48,
          height: 2,
          background: COLORS.accent,
          marginBottom: 32,
          transform: `scaleX(${dividerScale})`,
          transformOrigin: "center",
        }}
      />

      {/* URL */}
      <div
        style={{
          fontSize: 28,
          fontFamily: FONTS.sans,
          color: COLORS.muted,
          fontWeight: 400,
          marginBottom: 56,
          letterSpacing: "0.02em",
          opacity: urlOpacity,
        }}
      >
        the-debrief.ai
      </div>

      {/* Arrow up icon - pulsing */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `1.5px solid ${COLORS.rule}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: COLORS.muted,
          opacity: arrowOpacity,
          transform: `scale(${arrowPulse})`,
        }}
      >
        &#8593;
      </div>

      <div
        style={{
          fontSize: 13,
          fontFamily: FONTS.sans,
          color: COLORS.muted,
          marginTop: 14,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          opacity: arrowOpacity * 0.6,
        }}
      >
        Link in bio
      </div>

      {/* Bottom progress dots */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? 100 : 54,
          display: "flex",
          gap: 6,
        }}
      >
        {Array.from({ length: scene.totalSlides || 0 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === scene.slideNumber ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background:
                i + 1 === scene.slideNumber ? COLORS.accent : COLORS.rule,
            }}
          />
        ))}
      </div>

      {/* Audio */}
      {scene.audio?.audioUrl && (
        <Audio src={scene.audio.audioUrl.startsWith("/") ? scene.audio.audioUrl : staticFile(scene.audio.audioUrl)} />
      )}

      {/* Subtitles */}
      {scene.audio?.captions && scene.audio.captions.length > 0 && (
        <SubtitleOverlay captions={scene.audio.captions} format={format} />
      )}
    </div>
  );
};
