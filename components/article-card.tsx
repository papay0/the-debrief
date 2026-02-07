import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import type { PostMetadata } from "@/lib/posts"

export function ArticleCard({ post }: { post: PostMetadata }) {
  return (
    <article className="py-5 sm:py-6">
      <Link href={`/posts/${post.slug}`} className="group block">
        <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </h2>
        <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-muted-foreground">
          <time dateTime={post.date}>
            {format(new Date(post.date), "MMM d, yyyy")}
          </time>
          <span aria-hidden="true">&middot;</span>
          <span>{post.readingTime}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {post.description}
        </p>
      </Link>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              <Badge variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
