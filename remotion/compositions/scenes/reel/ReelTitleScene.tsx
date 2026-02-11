import React from "react";
import { Audio, staticFile } from "remotion";
import { REEL_COLORS, REEL_FONTS } from "../../../constants";
import {
  useFadeIn,
  useDrawAcross,
  useSpringSlideUp,
} from "../../../utils/animations";
import { NoiseOverlay } from "../../components/reel/NoiseOverlay";
import { AmbientGlow } from "../../components/reel/AmbientGlow";
import { NarrationText } from "../../components/NarrationText";
import type { SceneTitle } from "../../../schemas";

interface ReelTitleSceneProps {
  scene: SceneTitle;
  format: "square" | "vertical";
}

export const ReelTitleScene: React.FC<ReelTitleSceneProps> = ({
  scene,
  format,
}) => {
  // Animation timeline - compressed for faster reveal
  const accentLineScale = useDrawAcross(2, 10);
  const wordmarkOpacity = useFadeIn(20, 12);
  const descriptionOpacity = useFadeIn(22, 12);

  // Use keyword (hook text) if available, otherwise fall back to title
  const keyword = scene.keyword || scene.title;
  const titleLines = splitIntoLines(keyword, 5);

  // Font sizing for longer hook text
  const keywordLen = keyword.length;
  const fontSize = keywordLen > 60 ? 56 : keywordLen > 45 ? 68 : keywordLen > 30 ? 80 : 96;

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
        alignItems: "center",
        fontFamily: REEL_FONTS.serif,
      }}
    >
      <NoiseOverlay />
      <AmbientGlow startFrame={5} top="35%" />

      {/* Title area - centered at ~35% from top */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {/* Accent line above title */}
        <div
          style={{
            width: 60,
            height: 2,
            background: REEL_COLORS.accent,
            marginBottom: 40,
            transform: `scaleX(${accentLineScale})`,
            transformOrigin: "center",
          }}
        />

        {/* Title - visible from frame 0 for instant readability */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 0,
          }}
        >
          {titleLines.map((line, i) => {
            const startFrame = i * 2;
            const { opacity, translateY } = useSpringSlideUp(startFrame, 15);
            return (
              <div
                key={i}
                style={{
                  fontSize,
                  fontWeight: 800,
                  color: REEL_COLORS.ink,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  opacity,
                  transform: `translateY(${translateY}px)`,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom area - wordmark + description (above the bottom 20% subtitle zone) */}
      <div
        style={{
          position: "absolute",
          bottom: 420,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {/* Narration with word-by-word highlighting (replaces static description) */}
        {(scene.narration || scene.description) && (
          <div style={{ marginBottom: 32, opacity: descriptionOpacity }}>
            <NarrationText
              narration={scene.narration || scene.description}
              captions={scene.audio?.captions || []}
              format={format}
              theme="dark"
            />
          </div>
        )}

        {/* Wordmark with flanking rules */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: wordmarkOpacity,
          }}
        >
          <div
            style={{
              width: 32,
              height: 1,
              background: REEL_COLORS.muted,
              opacity: 0.4,
            }}
          />
          <div
            style={{
              fontSize: 14,
              fontFamily: REEL_FONTS.sans,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: REEL_COLORS.muted,
            }}
          >
            The Debrief
          </div>
          <div
            style={{
              width: 32,
              height: 1,
              background: REEL_COLORS.muted,
              opacity: 0.4,
            }}
          />
        </div>
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

    </div>
  );
};

/**
 * Split a title string into lines of roughly `maxWordsPerLine` words.
 */
function splitIntoLines(text: string, maxWordsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    lines.push(words.slice(i, i + maxWordsPerLine).join(" "));
  }
  return lines;
}
