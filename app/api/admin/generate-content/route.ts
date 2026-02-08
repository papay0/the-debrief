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
      narration: z
        .string()
        .describe(
          "Conversational narration for TTS. 2-3 sentences. Expands on the bullets, not verbatim."
        ),
    })
  ),
  titleNarration: z
    .string()
    .describe(
      "A 2-sentence hook narration for the title card that makes people want to keep watching."
    ),
  ctaNarration: z
    .string()
    .describe(
      'A brief 1-sentence sign-off narration for the CTA card, e.g. "Check out the full article on the-debrief.ai for the complete breakdown."'
    ),
  hashtags: z
    .string()
    .describe("5 relevant hashtags as a single string, space-separated"),
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

Generate content for exactly 4 slides PLUS narration for a title card and CTA card.

Each of the 4 slides needs:
- A short heading (max 6 words). No quotes, no colons.
- Exactly 3 bullet points (8-15 words each).
- A narration (2-3 sentences) that expands conversationally on the bullets. Don't just read the bullets aloud. Add context, explain things simply, make it feel like a friend explaining.

STYLE RULES for bullet points:
- Sound like a real person talking. Match the article's casual, direct tone.
- NEVER start with a dash or hyphen.
- NEVER use generic AI phrasing like "Here's what you need to know" or "Let's dive in."
- Use concrete facts, numbers, and specifics from the article.
- Write like you're texting a friend who asked "wait what happened?"

The 4 slides should tell a story in this arc:
1. What happened (the news/event)
2. How it works (simple explanation)
3. Why it matters (impact on regular people)
4. What to do (practical takeaway)

NARRATION STYLE (for slide narration, titleNarration, and ctaNarration):
- Sound like a smart friend explaining something, not a news anchor
- Use simple words. No jargon.
- Short sentences. Direct.
- Never use em-dashes. Use periods or commas instead.
- Never say "Here's what you need to know" or "Let's dive in" or similar cliche phrases
- Use concrete facts and numbers from the article
- Total narration across all scenes should take about 60-90 seconds when read aloud (roughly 150-200 words total)
- IMPORTANT for TTS prosody: Use varied sentence lengths. Mix short punchy sentences with slightly longer ones.
- Use question marks for rhetorical questions (they trigger rising intonation in TTS).
- Use commas generously at natural pause points for better rhythm.
- End paragraphs with clear period-terminated statements (triggers falling intonation).
- Use exclamation marks sparingly for genuine emphasis.
- Avoid run-on sentences. Break them with periods or semicolons.

titleNarration: A 2-sentence hook for the title card. Start with something attention-grabbing.
ctaNarration: A brief 1-sentence sign-off like "Check out the full article on the-debrief.ai for the complete breakdown."

HASHTAGS: Generate exactly 5 hashtags as a single space-separated string.
- 1-2 broad high-volume hashtags (e.g. #ai, #tech, #cybersecurity) for discovery
- 2-3 mid-size niche hashtags specific to the article topic
- ALL lowercase
- Only hashtags people actually search on Instagram`,
  });

  return NextResponse.json(object);
}
