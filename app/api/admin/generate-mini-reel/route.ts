import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const outputSchema = z.object({
  headline: z
    .string()
    .describe(
      "A bold, attention-grabbing headline for the reel. MUST include the specific product, company, or topic name (e.g. 'Claude Code', 'GPT-5', 'OpenClaw'). Should be 3-8 words. Think newspaper front page: 'Claude Code Writes 4% of All Code', 'OpenAI Launches GPT-5', 'Google Bans AI Fakes'. NEVER use vague terms like 'AI Tool' or 'New App' when the article names a specific product. Use active verbs. No articles (a/an/the) unless essential."
    ),
  tldr: z
    .string()
    .describe(
      "A SHORT 2-sentence TLDR. Must fit on ~3 lines of a phone screen. First sentence: what happened. Second sentence: why it matters. Each sentence MUST be under 15 words. Total TLDR under 25 words. Be ruthlessly concise. No jargon."
    ),
  instagramCaption: z
    .string()
    .describe(
      "Short Instagram caption, MAX 60 words. Use newlines (\\n) to separate sections for readability. Structure:\\n1) Hook sentence (the headline as a sentence)\\n\\n2) 1-2 short sentences of context\\n\\n3) Engagement question\\n\\n4) 'Full breakdown on the-debrief.ai (link in bio)'. Keep it punchy. Nobody reads long captions. No hashtags."
    ),
  hashtags: z
    .string()
    .describe(
      "Exactly 5 relevant hashtags as a single space-separated string. 1-2 broad (e.g. #ai #tech), 2-3 niche. All lowercase."
    ),
});

export async function POST(request: Request) {
  const { title, description, tags, content, date } = await request.json();

  const todayStr = new Date().toISOString().split("T")[0];

  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-5-20250929"),
    schema: outputSchema,
    prompt: `You are writing for The Debrief, an AI/tech news account for non-technical people. Read this article and generate content for a short Instagram Reel (3-4 seconds, just text on screen, no audio).

Today's date: ${todayStr}
Article published: ${date}

Article title: ${title}
Article description: ${description}
Tags: ${tags.join(", ")}

Full article:
${content}

TEMPORAL ACCURACY: Compare the article's dates to today's date. Use correct time language:
- If something happened yesterday, say "just."
- If it happened weeks ago, say "a few weeks ago."
- If it happened months ago, say "months ago."
- NEVER say "just" for something that happened weeks or months ago.

HEADLINE: Write a bold 3-8 word headline. CRITICAL: Always include the specific product, company, or person name from the article. NEVER use vague terms like "AI Tool" or "New App" when there's a specific name. Think tabloid energy but factual. Use active verbs. No filler words. This needs to stop someone mid-scroll. Examples: "Claude Code Writes 4% of All Code", "Claude Gets a Conscience Update", "OpenClaw: AI That Takes Action".

TLDR: Write exactly 2 SHORT sentences that fit on ~3 lines of a phone screen. First: what happened. Second: why it matters. Each sentence MUST be under 15 words. Total under 25 words. Be ruthlessly concise. No jargon.

INSTAGRAM CAPTION: Keep it SHORT. Max 60 words. Nobody reads long captions.
Use \\n\\n between sections so it's scannable on mobile. Structure:

Hook sentence (headline as a sentence)

1-2 short sentences of context (the juiciest facts only)

Engagement question (one line)

Full breakdown on the-debrief.ai (link in bio)

No hashtags in the caption. No walls of text.

STYLE: Match the article's conversational tone. Short sentences. Direct. No em-dashes. No generic AI phrases like "Here's what you need to know."`,
  });

  return NextResponse.json(object);
}
