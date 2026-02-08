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

  // Title: word-by-word spring entrance
  const titleWords = scene.title.split(" ");

  const titleLen = scene.title.length;
  const fontSize = titleLen > 60 ? 66 : titleLen > 45 ? 76 : 84;

  const padding = isVertical ? "100px 80px 200px" : "100px 100px 140px";

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
        }}
      >
        <Masthead opacity={mastheadOpacity} />
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

      {/* Title - word by word */}
      <div
        style={{
          fontSize,
          fontWeight: 700,
          color: COLORS.ink,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          marginBottom: 32,
          maxWidth: 830,
          display: "flex",
          flexWrap: "wrap",
          gap: "0 14px",
        }}
      >
        {titleWords.map((word, i) => {
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

      {/* Description */}
      {scene.description && (
        <AnimatedText startFrame={40} distance={30}>
          <div
            style={{
              fontSize: isVertical ? 36 : 34,
              fontFamily: FONTS.sans,
              color: COLORS.muted,
              lineHeight: 1.55,
              maxWidth: 780,
            }}
          >
            {scene.description}
          </div>
        </AnimatedText>
      )}

      {/* Tags */}
      {scene.tags && scene.tags.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginTop: 44 }}>
          {scene.tags.map((tag, i) => {
            const tagStart = 55 + i * 6;
            const { opacity, translateY } = useSpringSlideUp(tagStart, 15);
            return (
              <div
                key={tag}
                style={{
                  padding: "8px 20px",
                  border: `1px solid ${COLORS.rule}`,
                  borderRadius: 100,
                  fontSize: 20,
                  fontFamily: FONTS.sans,
                  color: COLORS.muted,
                  fontWeight: 500,
                  opacity,
                  transform: `translateY(${translateY}px)`,
                }}
              >
                {tag}
              </div>
            );
          })}
        </div>
      )}

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
