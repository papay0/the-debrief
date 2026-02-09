import React from "react";

/**
 * Film grain noise overlay using SVG feTurbulence filter.
 * Renders at 4% opacity for subtle cinematic texture.
 */
export const NoiseOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.04,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <svg width="100%" height="100%">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
};
