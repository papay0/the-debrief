import { getAllPosts } from "@/lib/posts"
import { ArticleList } from "@/components/article-list"
import { isValidLocale } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: localeParam } = await params
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en"
  const posts = getAllPosts(false, locale)

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-8 sm:pt-14 pb-16 sm:pb-20">
      <ArticleList posts={posts} locale={locale} showFeatured />
    </div>
  )
}
