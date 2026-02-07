import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Locale } from '@/lib/i18n';

function getPostsDirectory(locale: Locale = "en"): string {
  return path.join(process.cwd(), 'content/posts', locale);
}

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  draft?: boolean;
  tags: string[];
  description: string;
  readingTime: string;
}

export interface Post extends PostMetadata {
  content: string;
}

function readPostsFromDir(directory: string, includeDrafts: boolean): PostMetadata[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs.readdirSync(directory).filter((file) =>
    (file.endsWith('.md') || file.endsWith('.mdx')) && !fs.statSync(path.join(directory, file)).isDirectory()
  );

  const posts: PostMetadata[] = [];

  files.forEach((fileName) => {
    const slug = fileName.replace(/\.(md|mdx)$/, '');
    const fullPath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    if (!includeDrafts && data.draft) {
      return;
    }

    const stats = readingTime(content);

    posts.push({
      slug,
      title: data.title,
      date: data.date,
      draft: data.draft || false,
      tags: data.tags || [],
      description: data.description || '',
      readingTime: stats.text,
    });
  });

  return posts;
}

export function getAllPosts(includeDrafts = false, locale: Locale = "en"): PostMetadata[] {
  const localePosts = readPostsFromDir(getPostsDirectory(locale), includeDrafts);

  // For non-English locales, merge with English posts as fallback
  if (locale !== "en") {
    const enPosts = readPostsFromDir(getPostsDirectory("en"), includeDrafts);
    const localeSlugs = new Set(localePosts.map((p) => p.slug));

    // Add English posts that don't have a translation
    for (const enPost of enPosts) {
      if (!localeSlugs.has(enPost.slug)) {
        localePosts.push(enPost);
      }
    }
  }

  return localePosts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string, includeDrafts = false, locale: Locale = "en"): Post | null {
  // Try the requested locale first, then fall back to English
  const localesToTry: Locale[] = locale === "en" ? ["en"] : [locale, "en"];

  for (const loc of localesToTry) {
    const postsDirectory = getPostsDirectory(loc);

    if (!fs.existsSync(postsDirectory)) {
      continue;
    }

    try {
      let fullPath = path.join(postsDirectory, `${slug}.mdx`);
      let fileContents: string;

      try {
        fileContents = fs.readFileSync(fullPath, 'utf8');
      } catch {
        fullPath = path.join(postsDirectory, `${slug}.md`);
        fileContents = fs.readFileSync(fullPath, 'utf8');
      }

      const { data, content } = matter(fileContents);

      if (!includeDrafts && data.draft) {
        continue;
      }

      const stats = readingTime(content);

      return {
        slug,
        title: data.title,
        date: data.date,
        draft: data.draft || false,
        tags: data.tags || [],
        description: data.description || '',
        readingTime: stats.text,
        content,
      };
    } catch {
      continue;
    }
  }

  return null;
}

export function getAllTags(includeDrafts = false, locale: Locale = "en"): string[] {
  const posts = getAllPosts(includeDrafts, locale);
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

export function getPostsByTag(tag: string, includeDrafts = false, locale: Locale = "en"): PostMetadata[] {
  return getAllPosts(includeDrafts, locale).filter((post) =>
    post.tags.includes(tag)
  );
}
