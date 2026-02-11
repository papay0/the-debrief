import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const outputSchema = z.object({
  keyword: z
    .string()
    .describe(
      "The single most eye-catching keyword or short phrase (1-3 words) for metadata. Should be the main topic name, product name, or concept. Examples: 'OpenClaw', 'Claude Code', 'Vibe Coding', 'GPT-5'. No articles or filler words."
    ),
  hook: z
    .string()
    .describe(
      "A provocative, scroll-stopping statement in 5-12 words that creates a curiosity gap. This becomes the cover text. Examples: 'This Free AI Was Secretly Stealing Passwords', 'Google Just Made Every Other AI Obsolete', 'The AI Tool Your Boss Doesn\\'t Want You to Find'. Must be intriguing enough to stop someone mid-scroll."
    ),
  instagramCaption: z
    .string()
    .describe(
      "Full Instagram caption with this structure: 1) Open with the hook statement, 2) 2-3 sentences of value/context from the article, 3) An engagement question to drive comments (e.g. 'Would you trust an AI with your passwords?'), 4) A CTA like 'Full breakdown on the-debrief.ai (link in bio)', 5) Leave hashtags out (they go in a separate field). About 150-250 words total."
    ),
  slides: z.array(
    z.object({
      heading: z.string().describe("Short punchy heading, max 6 words"),
      bullets: z.array(
        z.string().describe("One key point, 8-15 words, conversational tone")
      ),
      narration: z
        .string()
        .describe(
          "Conversational narration for TTS. 1-2 sentences. Expands on the bullets, not verbatim."
        ),
    })
  ),
  titleNarration: z
    .string()
    .describe(
      "A single punchy sentence hook narration for the title card that makes people want to keep watching."
    ),
  ctaNarration: z
    .string()
    .describe(
      'A brief 1-sentence sign-off narration for the CTA card, e.g. "Check out the full article on the-debrief.ai for the complete breakdown."'
    ),
  hashtags: z
    .string()
    .describe("Exactly 5 relevant hashtags as a single string, space-separated"),
  postingStrategy: z.array(
    z.object({
      step: z.number().describe("Step number, starting from 1"),
      title: z.string().describe("Short action title, e.g. 'Post the Reel'"),
      when: z
        .string()
        .describe(
          "Specific timing, e.g. 'Day 1 — Tuesday to Thursday, 11am-1pm'"
        ),
      platform: z.enum([
        "reel",
        "carousel",
        "story",
        "engagement",
        "cross-promo",
      ]),
      instructions: z
        .array(z.string())
        .describe(
          "Hyper-specific step-by-step instructions. Never vague. Include exact sticker types, poll options, reply templates, etc."
        ),
      copyText: z
        .string()
        .optional()
        .describe(
          "Exact text to copy-paste (e.g. a story caption, a comment reply template, a cross-promo message). Only include when there is specific text the user should paste."
        ),
    })
  ),
});

export async function POST(request: Request) {
  const { title, description, tags, content, date } = await request.json();

  const todayStr = new Date().toISOString().split("T")[0];

  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-5-20250929"),
    schema: outputSchema,
    prompt: `You are writing for The Debrief, a tech news account for non-technical people. Read this article carefully and match its voice exactly.

Today's date: ${todayStr}

Article title: ${title}
Article description: ${description}
Tags: ${tags.join(", ")}

TEMPORAL ACCURACY: The article may reference events, tweets, launches, or announcements with specific dates. Compare those dates to today's date and use correct time language:
- If something happened yesterday, say "just."
- If it happened weeks ago, say "a few weeks ago."
- If it happened months ago, say "months ago" or reference the specific month.
- If it happened a year or more ago, say "last year" / "over a year ago" / etc.
- NEVER say "just" for something that happened weeks or months ago.
- Read the actual dates in the article. Do not assume anything is recent just because you are reading it now.

Full article:
${content}

Generate content for exactly 3 slides PLUS narration for a title card and CTA card.

HOOK: Write a provocative 5-12 word statement that creates a curiosity gap. This is the cover image text that must stop someone mid-scroll. Think tabloid energy but factual. Examples: "This Free AI Was Secretly Stealing Passwords", "Google Just Made Every Other AI Obsolete".

INSTAGRAM CAPTION: Write a full Instagram caption with this structure:
1. Open with the hook statement
2. 2-3 sentences of value/context from the article
3. An engagement question to drive comments
4. A CTA: "Full breakdown on the-debrief.ai (link in bio)"
Do NOT include hashtags in the caption (they go in a separate field).

Each of the 3 slides needs:
- A short heading (max 6 words). No quotes, no colons.
- Exactly 3 bullet points (8-15 words each).
- A narration (1-2 sentences) that expands conversationally on the bullets. Don't just read the bullets aloud. Add context, explain things simply, make it feel like a friend explaining.

STYLE RULES for bullet points:
- Sound like a real person talking. Match the article's casual, direct tone.
- NEVER start with a dash or hyphen.
- NEVER use generic AI phrasing like "Here's what you need to know" or "Let's dive in."
- Use concrete facts, numbers, and specifics from the article.
- Write like you're texting a friend who asked "wait what happened?"

The 3 slides should tell a story in this arc:
1. What it is / what happened (the topic or event, with correct time framing based on the publish date)
2. Why it matters (impact on regular people)
3. What to do (practical takeaway)

NARRATION STYLE (for slide narration, titleNarration, and ctaNarration):
- Sound like a smart friend explaining something, not a news anchor
- Use simple words. No jargon.
- Short sentences. Direct.
- Never use em-dashes. Use periods or commas instead.
- Never say "Here's what you need to know" or "Let's dive in" or similar cliche phrases
- Use concrete facts and numbers from the article
- Total narration across all scenes should take about 40-60 seconds when read aloud (roughly 100-150 words total)
- IMPORTANT for TTS prosody: Use varied sentence lengths. Mix short punchy sentences with slightly longer ones.
- Use question marks for rhetorical questions (they trigger rising intonation in TTS).
- Use commas generously at natural pause points for better rhythm.
- End paragraphs with clear period-terminated statements (triggers falling intonation).
- Use exclamation marks sparingly for genuine emphasis.
- Avoid run-on sentences. Break them with periods or semicolons.

titleNarration: A single punchy sentence hook for the title card. Start with something attention-grabbing. One sentence only.
ctaNarration: A brief 1-sentence sign-off like "Check out the full article on the-debrief.ai for the complete breakdown."

HASHTAGS: Generate exactly 5 hashtags as a single space-separated string.
- 1-2 broad high-volume hashtags (e.g. #ai, #tech, #cybersecurity) for discovery
- 2-3 mid-size niche hashtags specific to the article topic
- ALL lowercase
- Only hashtags people actually search on Instagram

POSTING STRATEGY: You are a social media growth expert coaching a brand-new Instagram account (@the.debrief.ai, ~13 followers, tech news for non-technical people). Generate 6-8 hyper-specific posting steps that reference the actual hook, caption, hashtags, and article topic above.

Cover these types (use the platform field):
1. "reel" — When and how to post the Reel (best day/time, cover image selection, caption structure)
2. "carousel" — When and how to post the Carousel (timing relative to the reel, caption tips)
3. "story" (2 steps) — Two different Story ideas. Be EXTREMELY specific: name the exact sticker type (Poll, Quiz, Question Box, Slider, Add Yours), the exact question/options to use, and what text/image to pair it with. Never just say "post a story." Example: "Use the Poll sticker with the question 'Would you trust AI with your passwords?' and options 'Yes totally' / 'No way'"
4. "engagement" — Provide 3-4 exact comment reply templates the user can copy-paste when people comment. Tailor them to likely comments on this specific topic.
5. "cross-promo" — One cross-promotion idea (e.g. share to Threads, LinkedIn, or relevant communities) with exact text to post.

Rules:
- Be hyper-specific to THIS article. Reference the actual hook, topic, and key facts.
- Include exact timing (day of week, time range, timezone note).
- For Stories, always specify: which sticker, exact question text, exact poll/quiz options.
- For engagement, write actual reply templates, not generic advice.
- Include copyText whenever there is literal text the user should paste somewhere.
- Order steps chronologically (what to do first, second, etc.).`,
  });

  return NextResponse.json(object);
}
