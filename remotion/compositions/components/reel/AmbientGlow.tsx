import React from "react";
import { REEL_COLORS } from "../../../constants";
import { useFadeIn } from "../../../utils/animations";

interface AmbientGlowProps {
  startFrame?: number;
  /** Vertical position as percentage from top (default 35%) */
  top?: string;
}

/**
 * Radial gradient glow positioned behind content.
 * Creates a soft ambient light effect with the accent color.
 */
export const AmbientGlow: React.FC<AmbientGlowProps> = ({
  startFrame = 5,
  top = "35%",
}) => {
  const opacity = useFadeIn(startFrame, 20);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top,
          transform: "translate(-50%, -50%)",
          width: "120%",
          height: "60%",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, ${REEL_COLORS.accentGlow} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};
