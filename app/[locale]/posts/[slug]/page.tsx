import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr as frLocale } from "date-fns/locale/fr";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXContent } from "@/components/mdx-content";
import { ReadingProgress } from "@/components/reading-progress";
import { ScrollToAnchor } from "@/components/scroll-to-anchor";
import { AskChatGPT } from "@/components/ask-chatgpt";
import { locales, isValidLocale, localizeReadingTime } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/config";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const posts = getAllPosts(false, locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";
  const post = getPostBySlug(slug, false, locale);
  if (!post) return {};

  const ogImageUrl = `/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}`;

  const alternates: Record<string, string> = {};
  for (const l of locales) {
    const otherPost = getPostBySlug(slug, false, l);
    if (otherPost) {
      alternates[l] = l === "en" ? `${SITE_URL}/posts/${slug}` : `${SITE_URL}/${l}/posts/${slug}`;
    }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
    alternates: {
      languages: alternates,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";
  const post = getPostBySlug(slug, false, locale);
  if (!post) notFound();

  const dateFormat = locale === "fr" ? "d MMMM yyyy" : "MMMM d, yyyy";
  const dateLocale = locale === "fr" ? { locale: frLocale } : undefined;

  return (
    <>
      <ReadingProgress />
      <ScrollToAnchor />
      <article className="mx-auto max-w-2xl px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16">
        <header className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-semibold font-serif leading-[1.15]">{post.title}</h1>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <time dateTime={post.date} className="font-medium tabular-nums">
              {format(new Date(post.date), dateFormat, dateLocale)}
            </time>
            <span aria-hidden="true">&middot;</span>
            <span>{localizeReadingTime(post.readingTime, locale)}</span>
          </div>
        </header>

        <MDXContent source={post.content} />
      </article>
      <AskChatGPT slug={post.slug} locale={locale} />
    </>
  );
}
