import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const outputSchema = z.object({
  scenes: z.array(
    z.object({
      type: z.enum(["title", "content", "cta"]),
      title: z.string().optional(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      heading: z.string().optional(),
      bullets: z.array(z.string()).optional(),
      narration: z.string().describe(
        "Conversational narration text for TTS. 2-4 sentences. Expands on the visual content, not verbatim."
      ),
    })
  ),
});

export async function POST(request: Request) {
  const { title, description, tags, content } = await request.json();

  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-5-20250929"),
    schema: outputSchema,
    prompt: `You are writing a video script for The Debrief, a tech news account for non-technical people.

Article title: ${title}
Article description: ${description}
Tags: ${tags.join(", ")}

Full article:
${content}

Generate a video script with exactly 6 scenes. The video should be 60-90 seconds total.

SCENE STRUCTURE:
1. Scene 1 (type: "title"): Title card
   - title: Use the article title
   - description: Short subtitle (max 15 words)
   - tags: Use the article tags (first 3 only)
   - narration: A 2-sentence hook that makes people want to keep watching. Start with something attention-grabbing.

2. Scenes 2-5 (type: "content"): Four content slides telling the story
   - heading: Short punchy heading, max 6 words. No quotes, no colons.
   - bullets: Exactly 3 bullet points (8-15 words each)
   - narration: 2-3 sentences that expand conversationally on the bullets. Don't just read the bullets. Add context, explain things simply, make it feel like a friend explaining.

   The 4 content slides should follow this narrative arc:
   - What happened (the news/event)
   - How it works (simple explanation)
   - Why it matters (impact on regular people)
   - What to do (practical takeaway)

3. Scene 6 (type: "cta"): Call to action
   - narration: A brief 1-sentence sign-off like "Check out the full article on the-debrief.ai for the complete breakdown."

NARRATION STYLE:
- Sound like a smart friend explaining something, not a news anchor
- Use simple words. No jargon.
- Short sentences. Direct.
- Never use em-dashes. Use periods or commas instead.
- Never say "Here's what you need to know" or "Let's dive in" or similar AI cliche phrases
- Use concrete facts and numbers from the article
- Total narration across all scenes should take about 60-90 seconds when read aloud (roughly 150-200 words total)`,
  });

  return NextResponse.json(object);
}
