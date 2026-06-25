#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import matterPackage from "gray-matter";

const matter = matterPackage.default ?? matterPackage;

const ROOT = process.cwd();
const TIME_ZONE = process.env.ARTICLE_TIMEZONE || "America/Los_Angeles";
const MODEL = process.env.ARTICLE_MODEL || "claude-sonnet-4-5-20250929";
const LOOKBACK_HOURS = Number(process.env.NEWS_LOOKBACK_HOURS || 48);
const FORCE =
  process.argv.includes("--force") || process.env.FORCE_DAILY_ARTICLE === "1";
const IS_SCHEDULED_RUN = process.env.GITHUB_EVENT_NAME === "schedule";

const GOOGLE_NEWS_QUERIES = [
  '"AI agents" OR "agentic AI"',
  '"OpenAI Codex" OR "Claude Code"',
  '"AI coding" OR "vibe coding"',
  '"AI safety" Anthropic OpenAI',
  '"MCP" "AI agents"',
  '(rumor OR reportedly OR leak) (OpenAI OR Anthropic OR "AI device")',
  '"AI security" agents',
];

const HACKER_NEWS_QUERIES = [
  "AI agents",
  "OpenAI Codex",
  "Claude Code",
  "AI safety",
  "MCP AI",
];

function getLocalParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value])
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
  };
}

function decodeEntities(value) {
  const entities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replace(/&([a-z]+);/gi, (_, name) => entities[name] || `&${name};`)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getXmlTag(item, tagName) {
  const match = item.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "the-debrief-daily-article/1.0",
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function fetchGoogleNews(query) {
  const search = `${query} when:${Math.ceil(LOOKBACK_HOURS / 24)}d`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    search
  )}&hl=en-US&gl=US&ceid=US:en`;
  const xml = await fetchText(url);
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];

  return items.map((match) => {
    const item = match[1];
    const sourceMatch = item.match(/<source[^>]*>([\s\S]*?)<\/source>/i);

    return {
      title: getXmlTag(item, "title"),
      url: getXmlTag(item, "link"),
      source: sourceMatch ? decodeEntities(sourceMatch[1]) : "Google News",
      publishedAt: getXmlTag(item, "pubDate"),
      summary: getXmlTag(item, "description"),
      query,
      type: "news",
    };
  });
}

async function fetchHackerNews(query) {
  const minTimestamp = Math.floor(
    (Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000) / 1000
  );
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(
    query
  )}&tags=story&numericFilters=created_at_i>${minTimestamp}`;
  const json = JSON.parse(await fetchText(url));

  return (json.hits || [])
    .filter((hit) => hit.title && (hit.url || hit.story_url))
    .map((hit) => ({
      title: hit.title,
      url: hit.url || hit.story_url,
      source: "Hacker News",
      publishedAt: hit.created_at,
      summary: `${hit.points || 0} points, ${hit.num_comments || 0} comments`,
      query,
      type: "discussion",
    }));
}

async function collectNews() {
  const batches = await Promise.allSettled([
    ...GOOGLE_NEWS_QUERIES.map(fetchGoogleNews),
    ...HACKER_NEWS_QUERIES.map(fetchHackerNews),
  ]);

  const seen = new Set();
  const items = [];

  for (const batch of batches) {
    if (batch.status === "rejected") {
      console.warn(`News fetch failed: ${batch.reason.message}`);
      continue;
    }

    for (const item of batch.value) {
      const key = `${item.title.toLowerCase()}|${item.source.toLowerCase()}`;
      if (!item.title || !item.url || seen.has(key)) {
        continue;
      }

      seen.add(key);
      items.push(item);
    }
  }

  return items.slice(0, 80);
}

async function readPosts(locale) {
  const directory = path.join(ROOT, "content", "posts", locale);
  const files = await fs.readdir(directory);
  const posts = [];

  for (const file of files.filter((name) => name.endsWith(".mdx"))) {
    const fullPath = path.join(directory, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const parsed = matter(raw);
    posts.push({
      slug: file.replace(/\.mdx$/, ""),
      title: parsed.data.title,
      date: parsed.data.date,
      description: parsed.data.description,
      tags: parsed.data.tags || [],
      draft: Boolean(parsed.data.draft),
      content: parsed.content,
    });
  }

  return posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function buildStyleSample(posts) {
  return posts
    .filter((post) => !post.draft)
    .slice(0, 4)
    .map((post) => {
      const excerpt = post.content
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 1400);
      return [
        `Title: ${post.title}`,
        `Description: ${post.description}`,
        `Tags: ${post.tags.join(", ")}`,
        `Excerpt: ${excerpt}`,
      ].join("\n");
    })
    .join("\n\n---\n\n");
}

function buildPrompt({ today, enPosts, frPosts, newsItems }) {
  const existingTopics = enPosts
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      description: post.description,
      tags: post.tags,
      draft: post.draft,
    }))
    .slice(0, 20);

  return `Today is ${today} in ${TIME_ZONE}.

The Debrief publishes simple AI news for non-technical readers. Pick one article topic from the news candidates below that is:
- related to existing coverage: AI agents, AI coding, Claude Code, Codex, OpenClaw, MCP, AI safety, AI security, model/company rumors
- timely enough to feel like today's article
- specific enough to explain clearly
- not a duplicate of an existing post

Existing English posts:
${JSON.stringify(existingTopics, null, 2)}

English voice samples:
${buildStyleSample(enPosts)}

French voice samples:
${buildStyleSample(frPosts)}

News candidates:
${JSON.stringify(newsItems, null, 2)}

Return only valid JSON, with this exact shape:
{
  "status": "publish" | "skip",
  "reason": "short reason",
  "slug": "kebab-case-slug",
  "sources": [{"title": "source title", "url": "https://...", "source": "publication name"}],
  "en": {
    "title": "English title",
    "description": "English meta description",
    "tags": ["tag", "tag"],
    "body": "English MDX body only, no frontmatter"
  },
  "fr": {
    "title": "French title",
    "description": "French meta description",
    "tags": ["tag", "tag"],
    "body": "French MDX body only, no frontmatter"
  }
}

Writing rules:
- Start English with "## The Short Version".
- Start French with "## En bref".
- Write like the samples: short sections, clear explanations, casual but precise, a little personal when it helps.
- No em dashes. Use periods, commas, colons, or parentheses.
- Do not write like a press release or a generic AI newsletter.
- Explain jargon the first time it appears.
- Use inline markdown links to sources for every concrete claim that depends on reporting.
- Do not invent facts, dates, numbers, product names, quotes, or source links.
- If the news candidates are too thin or low quality, return status "skip".
- English and French should be equivalent but natural, not literal translations.
- Keep each article around 700 to 1,000 words.
- Use only MDX-safe markdown. No tables. No footnotes.`;
}

function extractJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Model response did not include a JSON object.");
    }

    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

function normalizeSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeBody(value) {
  return String(value || "")
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/[—–]/g, "-")
    .trim();
}

function formatFrontmatter({ title, date, description, tags, body }) {
  const safeTags = Array.isArray(tags) ? tags.slice(0, 5) : [];

  return [
    "---",
    `title: ${JSON.stringify(title)}`,
    `date: ${JSON.stringify(date)}`,
    `description: ${JSON.stringify(description)}`,
    `tags: ${JSON.stringify(safeTags)}`,
    "draft: false",
    "---",
    "",
    normalizeBody(body),
    "",
  ].join("\n");
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function writeArticle({ article, today }) {
  const slug = normalizeSlug(article.slug || article.en?.title || "");
  if (!slug) {
    throw new Error("Generated article did not include a usable slug.");
  }

  const enPath = path.join(ROOT, "content", "posts", "en", `${slug}.mdx`);
  const frPath = path.join(ROOT, "content", "posts", "fr", `${slug}.mdx`);

  if (!FORCE && ((await fileExists(enPath)) || (await fileExists(frPath)))) {
    console.log(`Post ${slug} already exists. Skipping.`);
    return false;
  }

  await fs.writeFile(
    enPath,
    formatFrontmatter({
      ...article.en,
      date: today,
      body: article.en.body,
    }),
    "utf8"
  );
  await fs.writeFile(
    frPath,
    formatFrontmatter({
      ...article.fr,
      date: today,
      body: article.fr.body,
    }),
    "utf8"
  );

  console.log(`Wrote content/posts/en/${slug}.mdx`);
  console.log(`Wrote content/posts/fr/${slug}.mdx`);
  return true;
}

async function main() {
  const { date: today, hour } = getLocalParts();

  if (IS_SCHEDULED_RUN && !FORCE && hour !== 8) {
    console.log(`Skipping: local hour is ${hour}, not 8 in ${TIME_ZONE}.`);
    return;
  }

  const [enPosts, frPosts] = await Promise.all([readPosts("en"), readPosts("fr")]);
  const hasPostToday = [...enPosts, ...frPosts].some(
    (post) => post.date === today && !post.draft
  );

  if (hasPostToday && !FORCE) {
    console.log(`A published post already exists for ${today}. Skipping.`);
    return;
  }

  const newsItems = await collectNews();
  if (newsItems.length === 0) {
    console.log("No news candidates found. Skipping.");
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required to generate a daily article.");
  }

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    temperature: 0.45,
    system:
      "You are the bilingual editor for The Debrief. You write factual AI news in the founder's casual, direct voice.",
    messages: [
      {
        role: "user",
        content: buildPrompt({ today, enPosts, frPosts, newsItems }),
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  const article = extractJson(text);
  if (article.status === "skip") {
    console.log(`Skipping: ${article.reason || "model chose not to publish"}`);
    return;
  }

  await writeArticle({ article, today });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
