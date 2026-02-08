import React from "react";
import { useSpringSlideUp } from "../../utils/animations";
import { COLORS, FONTS } from "../../constants";

interface AnimatedBulletProps {
  text: string;
  index: number;
  baseStartFrame: number;
  staggerFrames?: number;
  isVertical?: boolean;
}

export const AnimatedBullet: React.FC<AnimatedBulletProps> = ({
  text,
  index,
  baseStartFrame,
  staggerFrames = 15, // 0.5s at 30fps
  isVertical = false,
}) => {
  const startFrame = baseStartFrame + index * staggerFrames;
  const { opacity, translateY } = useSpringSlideUp(startFrame, 30);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: COLORS.accent,
          marginTop: isVertical ? 20 : 18,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontSize: isVertical ? 38 : 36,
          fontFamily: FONTS.sans,
          color: COLORS.ink,
          lineHeight: 1.55,
          maxWidth: 820,
          opacity: 0.8,
        }}
      >
        {text}
      </div>
    </div>
  );
};
