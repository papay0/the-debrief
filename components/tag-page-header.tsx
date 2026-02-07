import Link from "next/link"
import { X } from "lucide-react"
import { t, localePath } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

interface TagPageHeaderProps {
  tag: string
  count: number
  locale: Locale
}

export function TagPageHeader({ tag, count, locale }: TagPageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-4 mb-2 border-b border-border sm:hidden">
      <div className="flex items-baseline gap-2.5 min-w-0">
        <span className="text-sm font-medium text-primary truncate">
          {tag}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          {count} {count === 1 ? t(locale, "tags.article") : t(locale, "tags.articles")}
        </span>
      </div>
      <Link
        href={localePath(locale, "/")}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <X className="h-3 w-3" />
        {t(locale, "tags.clear")}
      </Link>
    </div>
  )
}
