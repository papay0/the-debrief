import React from "react";
import { Audio, staticFile } from "remotion";
import { COLORS, FONTS } from "../../constants";
import { useFadeIn, useDrawAcross } from "../../utils/animations";
import { AnimatedText } from "../components/AnimatedText";
import { NarrationText } from "../components/NarrationText";
import type { SceneContent } from "../../schemas";

interface ContentSceneProps {
  scene: SceneContent;
  format: "square" | "vertical";
}

export const ContentScene: React.FC<ContentSceneProps> = ({ scene, format }) => {
  const isVertical = format === "vertical";

  // Animation timeline
  const ruleOpacity = useFadeIn(0, 10);
  const slideNumOpacity = useFadeIn(5, 10);
  const dividerScale = useDrawAcross(25, 15);

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
      {/* Top rule */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: isVertical ? 80 : 100,
          right: isVertical ? 80 : 100,
          height: 1,
          background: COLORS.rule,
          opacity: ruleOpacity,
        }}
      />

      {/* Slide number */}
      <div
        style={{
          fontSize: 14,
          fontFamily: FONTS.sans,
          color: COLORS.muted,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          marginBottom: 44,
          opacity: slideNumOpacity,
        }}
      >
        {String(scene.slideNumber).padStart(2, "0")} /{" "}
        {String(scene.totalSlides).padStart(2, "0")}
      </div>

      {/* Heading - slides from left */}
      <AnimatedText startFrame={8} distance={50}>
        <div
          style={{
            fontSize: isVertical ? 68 : 64,
            fontWeight: 700,
            color: COLORS.ink,
            lineHeight: 1.14,
            letterSpacing: "-0.02em",
            marginBottom: 40,
            maxWidth: 800,
          }}
        >
          {scene.heading}
        </div>
      </AnimatedText>

      {/* Accent divider */}
      <div
        style={{
          width: 40,
          height: 2,
          background: COLORS.accent,
          marginBottom: 40,
          transform: `scaleX(${dividerScale})`,
          transformOrigin: "left",
        }}
      />

      {/* Narration with word-by-word highlighting */}
      {(scene.narration || scene.bullets?.length > 0) && (
        <NarrationText
          narration={scene.narration || scene.bullets.join(". ") + "."}
          captions={scene.audio?.captions || []}
          format={format}
        />
      )}

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: isVertical ? 100 : 54,
          left: isVertical ? 80 : 100,
          right: isVertical ? 80 : 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontFamily: FONTS.sans,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            color: COLORS.muted,
            opacity: 0.6,
          }}
        >
          The Debrief
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6 }}>
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
      </div>

      {/* Audio */}
      {scene.audio?.audioUrl && (
        <Audio src={scene.audio.audioUrl.startsWith("/") ? scene.audio.audioUrl : staticFile(scene.audio.audioUrl)} />
      )}

    </div>
  );
};
