import { getAllPosts, getAllTags } from "@/lib/posts"
import { ArticleList } from "@/components/article-list"
import { TagFilter } from "@/components/tag-filter"
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
  const tags = getAllTags(false, locale)

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-2 pb-8 sm:py-10">
      <TagFilter tags={tags} locale={locale} />
      <div className="sm:mt-6">
        <ArticleList posts={posts} locale={locale} />
      </div>
    </div>
  )
}
