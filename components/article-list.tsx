import { ArticleCard } from "@/components/article-card"
import type { PostMetadata } from "@/lib/posts"
import { t } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export function ArticleList({ posts, locale, showFeatured = false }: { posts: PostMetadata[]; locale: Locale; showFeatured?: boolean }) {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {t(locale, "posts.noArticles")}
      </p>
    )
  }

  const featured = showFeatured ? posts[0] : null
  const remaining = showFeatured ? posts.slice(1) : posts

  return (
    <div className="flex flex-col">
      {featured && (
        <ArticleCard post={featured} locale={locale} featured />
      )}
      {remaining.length > 0 && showFeatured && (
        <div className="mt-14 sm:mt-16 mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.15em] shrink-0">
              {locale === "fr" ? "Derniers articles" : "Latest"}
            </span>
            <div className="h-px bg-border flex-1" />
          </div>
        </div>
      )}
      {remaining.map((post) => (
        <ArticleCard key={post.slug} post={post} locale={locale} />
      ))}
    </div>
  )
}
