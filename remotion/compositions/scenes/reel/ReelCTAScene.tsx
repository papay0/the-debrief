import React from "react";
import { Audio, staticFile, useCurrentFrame } from "remotion";
import { REEL_COLORS, REEL_FONTS } from "../../../constants";
import {
  useFadeIn,
  useDrawAcross,
  useTypewriter,
  useGlowPulse,
} from "../../../utils/animations";
import { NoiseOverlay } from "../../components/reel/NoiseOverlay";
import { AmbientGlow } from "../../components/reel/AmbientGlow";
import { SubtitleOverlay } from "../../components/SubtitleOverlay";
import type { SceneCTA } from "../../../schemas";

interface ReelCTASceneProps {
  scene: SceneCTA;
  format: "square" | "vertical";
}

export const ReelCTAScene: React.FC<ReelCTASceneProps> = ({
  scene,
  format,
}) => {
  const frame = useCurrentFrame();

  // Animation timeline
  const labelOpacity = useFadeIn(0, 12);
  const ctaText = "Read the full article";
  const charsToShow = useTypewriter(ctaText, 8, 1.2);
  const dividerScale = useDrawAcross(35, 12);
  const urlOpacity = useFadeIn(42, 12);
  const arrowOpacity = useFadeIn(50, 12);
  const glowPulse = useGlowPulse(50);

  // Glow ring spread oscillates 0-20px
  const glowSpread = glowPulse * 20;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: REEL_COLORS.bg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 80px 420px",
        fontFamily: REEL_FONTS.serif,
      }}
    >
      <NoiseOverlay />
      <AmbientGlow startFrame={0} top="50%" />

      {/* Label */}
      <div
        style={{
          fontSize: 13,
          fontFamily: REEL_FONTS.sans,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: REEL_COLORS.muted,
          marginBottom: 48,
          opacity: labelOpacity,
          zIndex: 2,
        }}
      >
        The Debrief
      </div>

      {/* CTA text - faster typewriter */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: REEL_COLORS.ink,
          textAlign: "center" as const,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: 32,
          minHeight: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {ctaText.slice(0, charsToShow)}
        {charsToShow < ctaText.length && (
          <span
            style={{
              opacity: frame % 16 < 8 ? 1 : 0,
              color: REEL_COLORS.accent,
            }}
          >
            |
          </span>
        )}
      </div>

      {/* Accent line */}
      <div
        style={{
          width: 48,
          height: 2,
          background: REEL_COLORS.accent,
          marginBottom: 32,
          transform: `scaleX(${dividerScale})`,
          transformOrigin: "center",
          zIndex: 2,
        }}
      />

      {/* URL */}
      <div
        style={{
          fontSize: 28,
          fontFamily: REEL_FONTS.sans,
          color: REEL_COLORS.muted,
          fontWeight: 400,
          marginBottom: 56,
          letterSpacing: "0.02em",
          opacity: urlOpacity,
          zIndex: 2,
        }}
      >
        the-debrief.ai
      </div>

      {/* Arrow with sonar-ping glow ring */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `1.5px solid ${REEL_COLORS.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: REEL_COLORS.accent,
          opacity: arrowOpacity,
          boxShadow: `0 0 ${glowSpread}px ${glowSpread / 2}px ${REEL_COLORS.accentGlow}`,
          zIndex: 2,
        }}
      >
        &#8593;
      </div>

      <div
        style={{
          fontSize: 13,
          fontFamily: REEL_FONTS.sans,
          color: REEL_COLORS.muted,
          marginTop: 14,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          opacity: arrowOpacity * 0.6,
          zIndex: 2,
        }}
      >
        Link in bio
      </div>

      {/* Audio */}
      {scene.audio?.audioUrl && (
        <Audio
          src={
            scene.audio.audioUrl.startsWith("/")
              ? scene.audio.audioUrl
              : staticFile(scene.audio.audioUrl)
          }
        />
      )}

      {/* Subtitles */}
      {scene.audio?.captions && scene.audio.captions.length > 0 && (
        <SubtitleOverlay captions={scene.audio.captions} format={format} />
      )}
    </div>
  );
};
