import React from "react";
import { Audio, staticFile } from "remotion";
import { REEL_COLORS, REEL_FONTS } from "../../../constants";
import {
  useFadeIn,
  useDrawAcross,
  useSpringSlideUp,
  useSlideFromLeft,
} from "../../../utils/animations";
import { NoiseOverlay } from "../../components/reel/NoiseOverlay";
import { AmbientGlow } from "../../components/reel/AmbientGlow";
import { GhostNumber } from "../../components/reel/GhostNumber";
import { ProgressBar } from "../../components/reel/ProgressBar";
import { SubtitleOverlay } from "../../components/SubtitleOverlay";
import type { SceneContent } from "../../../schemas";

interface ReelContentSceneProps {
  scene: SceneContent;
  format: "square" | "vertical";
}

export const ReelContentScene: React.FC<ReelContentSceneProps> = ({
  scene,
  format,
}) => {
  // Animation timeline
  const headingSlide = useSlideFromLeft(5, 40);
  const accentUnderlineScale = useDrawAcross(8, 12);

  // Build narration text from bullets or narration field
  const narrationText = scene.narration || scene.bullets.join(". ") + ".";
  const sentences = splitIntoSentences(narrationText);

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
        justifyContent: "center",
        padding: "160px 80px 420px",
        fontFamily: REEL_FONTS.serif,
      }}
    >
      <NoiseOverlay />
      <AmbientGlow startFrame={3} top="45%" />

      {/* Ghost number */}
      <GhostNumber number={scene.slideNumber} startFrame={3} />

      {/* Heading label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 12,
          marginLeft: 4,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontFamily: REEL_FONTS.sans,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: REEL_COLORS.accent,
            opacity: headingSlide.opacity,
            transform: `translateX(${headingSlide.translateX}px)`,
          }}
        >
          {scene.heading}
        </div>
      </div>

      {/* Accent underline */}
      <div
        style={{
          width: 40,
          height: 2,
          background: REEL_COLORS.accent,
          marginBottom: 48,
          marginLeft: 4,
          transform: `scaleX(${accentUnderlineScale})`,
          transformOrigin: "left",
          zIndex: 2,
        }}
      />

      {/* Narration - sentence by sentence */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          zIndex: 2,
        }}
      >
        {sentences.map((sentence, i) => {
          const startFrame = 12 + i * 20;
          const { opacity, translateY } = useSpringSlideUp(startFrame, 25);
          return (
            <div
              key={i}
              style={{
                fontSize: 52,
                fontWeight: 500,
                color: REEL_COLORS.ink,
                lineHeight: 1.35,
                opacity,
                transform: `translateY(${translateY}px)`,
                maxWidth: 900,
              }}
            >
              {sentence}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <ProgressBar
        current={scene.slideNumber}
        total={scene.totalSlides}
        startFrame={15}
      />

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

/**
 * Split text into sentences. Handles common sentence endings.
 */
function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
