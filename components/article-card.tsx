import Link from "next/link"
import { format } from "date-fns"
import { fr as frLocale } from "date-fns/locale/fr"
import type { PostMetadata } from "@/lib/posts"
import { localePath, localizeReadingTime } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export function ArticleCard({ post, locale, featured = false }: { post: PostMetadata; locale: Locale; featured?: boolean }) {
  const dateFormat = locale === "fr" ? "d MMM yyyy" : "MMM d, yyyy"
  const dateLocale = locale === "fr" ? { locale: frLocale } : undefined

  if (featured) {
    return (
      <article>
        <Link href={localePath(locale, `/posts/${post.slug}`)} className="group block">
          <h2 className="font-semibold font-serif text-foreground group-hover:text-foreground/60 transition-colors duration-200 text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.15]">
            {post.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {post.description}
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <time dateTime={post.date} className="tabular-nums">
              {format(new Date(post.date), dateFormat, dateLocale)}
            </time>
            <span aria-hidden="true" className="text-border">&middot;</span>
            <span>{localizeReadingTime(post.readingTime, locale)}</span>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="border-b border-border last:border-b-0">
      <Link href={localePath(locale, `/posts/${post.slug}`)} className="group block py-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={post.date} className="tabular-nums">
            {format(new Date(post.date), dateFormat, dateLocale)}
          </time>
        </div>
        <h2 className="font-semibold font-serif text-foreground group-hover:text-foreground/60 transition-colors duration-200 text-lg sm:text-xl leading-snug mt-1.5">
          {post.title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {post.description}
        </p>
      </Link>
    </article>
  )
}
