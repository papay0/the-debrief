import { getAllTags, getPostsByTag } from "@/lib/posts";
import { ArticleList } from "@/components/article-list";
import { TagFilter } from "@/components/tag-filter";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  return {
    title: `Posts tagged "${tag}"`,
    description: `All articles about ${tag} on The Debrief.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const allTags = getAllTags();

  if (!allTags.includes(tag)) {
    notFound();
  }

  const posts = getPostsByTag(tag);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <TagFilter tags={allTags} activeTag={tag} />
      <div className="mt-6">
        <ArticleList posts={posts} />
      </div>
    </div>
  );
}
