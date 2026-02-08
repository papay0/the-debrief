import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { t, localePath } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

interface TagFilterProps {
  tags: string[]
  activeTag?: string
  locale: Locale
}

export function TagFilter({ tags, activeTag, locale }: TagFilterProps) {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <Link href={localePath(locale, "/")} className="shrink-0">
          <Badge
            variant={!activeTag ? "default" : "outline"}
            className="cursor-pointer transition-colors text-xs sm:text-sm rounded-sm"
          >
            {t(locale, "tags.all")}
          </Badge>
        </Link>
        {tags.map((tag) => (
          <Link key={tag} href={localePath(locale, `/tags/${tag}`)} className="shrink-0">
            <Badge
              variant={activeTag === tag ? "default" : "outline"}
              className="cursor-pointer transition-colors text-xs sm:text-sm rounded-sm"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
      {/* Edge fade mask for scroll hint on mobile */}
      <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
    </div>
  )
}
