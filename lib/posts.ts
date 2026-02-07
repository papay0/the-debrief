import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/posts');

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

export function getAllPosts(includeDrafts = false): PostMetadata[] {
  const files = fs.readdirSync(postsDirectory).filter((file) =>
    file.endsWith('.md') || file.endsWith('.mdx')
  );

  const posts: PostMetadata[] = [];

  files.forEach((fileName) => {
    const slug = fileName.replace(/\.(md|mdx)$/, '');
    const fullPath = path.join(postsDirectory, fileName);
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

  return posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string, includeDrafts = false): Post | null {
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
      return null;
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
    return null;
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

export function getPostsByTag(tag: string, includeDrafts = false): PostMetadata[] {
  return getAllPosts(includeDrafts).filter((post) =>
    post.tags.includes(tag)
  );
}
