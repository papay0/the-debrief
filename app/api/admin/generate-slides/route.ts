import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const outputSchema = z.object({
  slides: z.array(
    z.object({
      heading: z.string().describe("Short punchy heading, max 6 words"),
      bullets: z.array(
        z.string().describe("One key point, 8-15 words, conversational tone")
      ),
    })
  ),
  hashtags: z
    .string()
    .describe("10-15 relevant hashtags as a single string, space-separated"),
});

export async function POST(request: Request) {
  const { title, description, tags, content } = await request.json();

  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-5-20250929"),
    schema: outputSchema,
    prompt: `You are writing for The Debrief, a tech news account for non-technical people. Read this article carefully and match its voice exactly.

Article title: ${title}
Article description: ${description}
Tags: ${tags.join(", ")}

Full article:
${content}

TASK 1: Generate exactly 4 carousel slides. Each slide needs:
- A short heading (max 6 words). No quotes, no colons.
- Exactly 3 bullet points (8-15 words each).

IMPORTANT STYLE RULES for bullet points:
- Sound like a real person talking. Match the article's casual, direct tone.
- NEVER start with a dash or hyphen.
- NEVER use generic AI phrasing like "Here's what you need to know" or "Let's dive in."
- Use concrete facts, numbers, and specifics from the article.
- Write like you're texting a friend who asked "wait what happened?"

The 4 slides should tell a story in order: what happened, how it works, why it matters, what to do.

TASK 2: Generate exactly 5 hashtags as a single space-separated string.
Strategy for maximum reach: pick a mix of:
- 1-2 broad high-volume hashtags (e.g. #AI, #tech, #cybersecurity) for discovery
- 2-3 mid-size niche hashtags specific to the article topic (e.g. #AIagents, #malware) where you can actually rank
- Avoid ultra-generic (#trending, #viral) and ultra-niche (nobody searches for them)
- Only hashtags people actually search on Instagram
- ALL lowercase (e.g. #ai not #AI, #cybersecurity not #CyberSecurity)`,
  });

  return NextResponse.json(object);
}
