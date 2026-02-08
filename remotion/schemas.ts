import { z } from "zod-remotion";

export const captionSchema = z.object({
  text: z.string(),
  startMs: z.number(),
  endMs: z.number(),
});

export const sceneAudioSchema = z.object({
  audioUrl: z.string(),
  captions: z.array(captionSchema),
  durationInSeconds: z.number(),
});

export const sceneTitleSchema = z.object({
  type: z.literal("title"),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  narration: z.string().optional(),
  audio: sceneAudioSchema.optional(),
});

export const sceneContentSchema = z.object({
  type: z.literal("content"),
  heading: z.string(),
  bullets: z.array(z.string()),
  slideNumber: z.number(),
  totalSlides: z.number(),
  narration: z.string().optional(),
  audio: sceneAudioSchema.optional(),
});

export const sceneCTASchema = z.object({
  type: z.literal("cta"),
  slideNumber: z.number(),
  totalSlides: z.number(),
  narration: z.string().optional(),
  audio: sceneAudioSchema.optional(),
});

export const sceneSchema = z.discriminatedUnion("type", [
  sceneTitleSchema,
  sceneContentSchema,
  sceneCTASchema,
]);

export const articleVideoPropsSchema = z.object({
  scenes: z.array(sceneSchema),
  format: z.enum(["square", "vertical"]),
});

export type Caption = z.infer<typeof captionSchema>;
export type SceneAudio = z.infer<typeof sceneAudioSchema>;
export type SceneTitle = z.infer<typeof sceneTitleSchema>;
export type SceneContent = z.infer<typeof sceneContentSchema>;
export type SceneCTA = z.infer<typeof sceneCTASchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type ArticleVideoProps = z.infer<typeof articleVideoPropsSchema>;
