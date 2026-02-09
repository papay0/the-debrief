import React from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS } from "../../constants";
import { useFadeIn, useDrawAcross, useSpringSlideUp } from "../../utils/animations";
import { Masthead } from "../components/Masthead";
import { AnimatedText } from "../components/AnimatedText";
import { SubtitleOverlay } from "../components/SubtitleOverlay";
import type { SceneTitle } from "../../schemas";

interface TitleSceneProps {
  scene: SceneTitle;
  format: "square" | "vertical";
}

export const TitleScene: React.FC<TitleSceneProps> = ({ scene, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isVertical = format === "vertical";

  // Animation timeline (in frames at 30fps)
  const mastheadOpacity = useFadeIn(0, 12);
  const ruleScale = useDrawAcross(8, 18);

  // Keyword: word-by-word spring entrance
  const keyword = scene.keyword || scene.title;
  const keywordWords = keyword.split(" ");

  const keywordLen = keyword.length;
  const fontSize = keywordLen > 20 ? 80 : keywordLen > 12 ? 110 : 140;

  const padding = isVertical ? "100px 80px 200px" : "100px";

  // URL fade-in
  const urlOpacity = useFadeIn(40, 15);

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
        padding,
        fontFamily: FONTS.serif,
      }}
    >
      {/* Masthead */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: isVertical ? 80 : 100,
          right: isVertical ? 80 : 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Masthead opacity={mastheadOpacity} centered />
      </div>

      {/* Rule under masthead */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: isVertical ? 80 : 100,
          right: isVertical ? 80 : 100,
          height: 1,
          background: COLORS.rule,
          transform: `scaleX(${ruleScale})`,
          transformOrigin: "left",
        }}
      />

      {/* Bold keyword - word by word */}
      <div
        style={{
          fontSize,
          fontWeight: 700,
          color: COLORS.ink,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          textAlign: "center",
          maxWidth: 880,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 14px",
        }}
      >
        {keywordWords.map((word, i) => {
          const startFrame = 18 + i * 3;
          const { opacity, translateY } = useSpringSlideUp(startFrame, 20);
          return (
            <span
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Accent divider */}
      <AnimatedText startFrame={30} distance={20}>
        <div
          style={{
            width: 48,
            height: 3,
            background: COLORS.accent,
            marginTop: 36,
            marginBottom: 28,
          }}
        />
      </AnimatedText>

      {/* URL */}
      <div
        style={{
          fontSize: 22,
          fontFamily: FONTS.sans,
          color: COLORS.muted,
          fontWeight: 400,
          letterSpacing: "0.04em",
          opacity: urlOpacity,
        }}
      >
        the-debrief.ai
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
