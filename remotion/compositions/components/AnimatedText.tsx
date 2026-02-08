import React from "react";
import { useSpringSlideUp } from "../../utils/animations";

interface AnimatedTextProps {
  children: React.ReactNode;
  startFrame: number;
  distance?: number;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  startFrame,
  distance = 40,
  style,
}) => {
  const { opacity, translateY } = useSpringSlideUp(startFrame, distance);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
