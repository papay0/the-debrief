import { z } from "zod-remotion";

export const miniReelPropsSchema = z.object({
  headline: z.string(),
  tldr: z.string(),
  gradient: z.enum(["ocean", "dusk", "emerald", "midnight", "ember"]),
});

export type MiniReelProps = z.infer<typeof miniReelPropsSchema>;
