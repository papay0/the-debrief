import { ArticleCard } from "@/components/article-card"
import type { PostMetadata } from "@/lib/posts"
import { t } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export function ArticleList({ posts, locale }: { posts: PostMetadata[]; locale: Locale }) {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {t(locale, "posts.noArticles")}
      </p>
    )
  }

  return (
    <div className="divide-y">
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} locale={locale} />
      ))}
    </div>
  )
}
