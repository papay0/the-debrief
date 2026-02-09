import React from "react";
import { REEL_COLORS, REEL_FONTS } from "../../../constants";
import { useFadeIn } from "../../../utils/animations";

interface GhostNumberProps {
  number: number;
  startFrame?: number;
}

/**
 * Large faded slide number displayed in the top-left corner.
 * Rendered at 8% opacity as a background visual element.
 */
export const GhostNumber: React.FC<GhostNumberProps> = ({
  number,
  startFrame = 3,
}) => {
  const opacity = useFadeIn(startFrame, 12);

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        left: 80,
        fontSize: 120,
        fontFamily: REEL_FONTS.sans,
        fontWeight: 800,
        color: REEL_COLORS.ink,
        opacity: opacity * 0.08,
        lineHeight: 1,
        zIndex: 1,
      }}
    >
      {String(number).padStart(2, "0")}
    </div>
  );
};
