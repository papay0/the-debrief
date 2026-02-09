import { getAllTags, getPostsByTag } from "@/lib/posts";
import { ArticleList } from "@/components/article-list";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TagFilter } from "@/components/tag-filter";
import { TagPageHeader } from "@/components/tag-page-header";
import { locales, isValidLocale, t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { locale: string; tag: string }[] = [];
  for (const locale of locales) {
    const tags = getAllTags(false, locale);
    for (const tag of tags) {
      params.push({ locale, tag });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, tag: rawTag } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";
  const tag = decodeURIComponent(rawTag);
  return {
    title: t(locale, "tags.postsTagged", { tag }),
    description: t(locale, "tags.postsTaggedDesc", { tag }),
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale: localeParam, tag: rawTag } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";
  const tag = decodeURIComponent(rawTag);
  const allTags = getAllTags(false, locale);

  if (!allTags.includes(tag)) {
    notFound();
  }

  const posts = getPostsByTag(tag, false, locale);

  return (
    <>
      <PageViewTracker slug={tag} locale={locale} pageType="tag" />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-8 sm:pt-14 pb-16 sm:pb-20">
        <TagFilter tags={allTags} activeTag={tag} locale={locale} />
        <TagPageHeader tag={tag} count={posts.length} locale={locale} />
        <div className="sm:mt-6">
          <ArticleList posts={posts} locale={locale} />
        </div>
      </div>
    </>
  );
}
