import React from "react";
import { REEL_COLORS } from "../../../constants";
import { useFadeIn } from "../../../utils/animations";
import { interpolate, useCurrentFrame } from "remotion";

interface ProgressBarProps {
  current: number;
  total: number;
  startFrame?: number;
}

/**
 * Full-width thin gradient progress bar at the bottom of content scenes.
 * Shows the current position in the video.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const opacity = useFadeIn(startFrame, 12);
  const fillProgress = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [0, current / total],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: 80,
        right: 80,
        height: 2,
        background: `${REEL_COLORS.muted}33`,
        borderRadius: 1,
        opacity,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${fillProgress * 100}%`,
          background: `linear-gradient(90deg, ${REEL_COLORS.accent}, ${REEL_COLORS.accent}88)`,
          borderRadius: 1,
        }}
      />
    </div>
  );
};
