import React from "react";
import { COLORS, FONTS } from "../../constants";

interface MastheadProps {
  opacity?: number;
  centered?: boolean;
}

export const Masthead: React.FC<MastheadProps> = ({
  opacity = 1,
  centered = false,
}) => {
  if (centered) {
    return (
      <div
        style={{
          fontSize: 15,
          fontFamily: FONTS.sans,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: COLORS.ink,
          opacity,
          textAlign: "center",
        }}
      >
        The Debrief
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontFamily: FONTS.sans,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: COLORS.ink,
        }}
      >
        The Debrief
      </div>
      <div
        style={{
          fontSize: 14,
          fontFamily: FONTS.sans,
          fontWeight: 400,
          color: COLORS.muted,
          letterSpacing: "0.04em",
        }}
      >
        the-debrief.ai
      </div>
    </div>
  );
};
