import { ArticleCard } from "@/components/article-card"
import type { PostMetadata } from "@/lib/posts"

export function ArticleList({ posts }: { posts: PostMetadata[] }) {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No articles found.
      </p>
    )
  }

  return (
    <div className="divide-y">
      {posts.map((post) => (
        <ArticleCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
