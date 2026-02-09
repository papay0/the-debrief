// Design tokens - matches the IG generator editorial palette
export const COLORS = {
  bg: "#FAFAF7",
  ink: "#1A1A18",
  muted: "#8A8A82",
  accent: "#2B2B6E",
  rule: "#D4D4CC",
} as const;

export const FONTS = {
  serif: '"Source Serif 4", "Georgia", "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

export const FPS = 30;

// Scene durations in seconds
export const SCENE_DURATIONS = {
  title: 5,
  content: 8,
  cta: 4,
} as const;

// Transition duration in frames
export const TRANSITION_FRAMES = 15; // 0.5s at 30fps

// Dimensions
export const SQUARE = { width: 1080, height: 1080 } as const;
export const VERTICAL = { width: 1080, height: 1920 } as const;

// Subtitle styling
export const SUBTITLE = {
  fontSize: 40,
  lineHeight: 1.4,
  padding: 20,
  bottomOffset: 120,
  maxWidth: 900,
  highlightColor: "#FFFFFF",
  bgColor: "rgba(26, 26, 24, 0.85)",
  wordColor: "#FFFFFF",
  activeWordColor: "#FFD700",
} as const;

// Reel (9:16 vertical) design tokens - cinematic dark style
export const REEL_COLORS = {
  bg: "#0A0A0F",
  surface: "#14141F",
  ink: "#F5F5F0",
  muted: "#7A7A8A",
  accent: "#4A6CF7",
  accentGlow: "rgba(74, 108, 247, 0.15)",
} as const;

export const REEL_FONTS = {
  serif: '"Source Serif 4", "Georgia", "Times New Roman", serif',
  sans: '"Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

export const REEL_SUBTITLE = {
  fontSize: 44,
  lineHeight: 1.4,
  padding: 20,
  bottomOffset: 200,
  maxWidth: 920,
  highlightColor: "#FFFFFF",
  bgColor: "rgba(10, 10, 15, 0.5)",
  wordColor: "#FFFFFF",
  activeWordColor: "#4A6CF7",
  backdropBlur: "blur(8px)",
} as const;

export const REEL_TRANSITION_FRAMES = 10; // 0.33s at 30fps
