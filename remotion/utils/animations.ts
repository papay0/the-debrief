import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Fade in from 0 to 1 opacity over a duration.
 */
export function useFadeIn(startFrame: number, durationFrames = 15): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * Slide up animation that returns a translateY value (pixels).
 * Starts at `distance` and moves to 0.
 */
export function useSlideUp(
  startFrame: number,
  durationFrames = 20,
  distance = 40
): number {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [distance, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
}

/**
 * Spring-based slide up. Returns { opacity, translateY }.
 */
export function useSpringSlideUp(
  startFrame: number,
  distance = 40
): { opacity: number; translateY: number } {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200, stiffness: 100, mass: 0.5 },
  });

  return {
    opacity: progress,
    translateY: interpolate(progress, [0, 1], [distance, 0]),
  };
}

/**
 * Draw-across animation for horizontal rules.
 * Returns scaleX (0 -> 1).
 */
export function useDrawAcross(
  startFrame: number,
  durationFrames = 20
): number {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
}

/**
 * Pulse animation (scale between 1 and 1.15).
 */
export function usePulse(cycleFrames = 30): number {
  const frame = useCurrentFrame();
  const cycle = frame % cycleFrames;
  return interpolate(
    cycle,
    [0, cycleFrames / 2, cycleFrames],
    [1, 1.15, 1]
  );
}

/**
 * Typewriter effect. Returns how many characters to show.
 */
export function useTypewriter(
  text: string,
  startFrame: number,
  charsPerFrame = 0.8
): number {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  return Math.min(Math.floor(elapsed * charsPerFrame), text.length);
}
