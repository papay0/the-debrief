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
    <div className="hidden sm:flex flex-wrap gap-2">
      <Link href={localePath(locale, "/")}>
        <Badge
          variant={!activeTag ? "default" : "secondary"}
          className="cursor-pointer transition-colors text-xs sm:text-sm"
        >
          {t(locale, "tags.all")}
        </Badge>
      </Link>
      {tags.map((tag) => (
        <Link key={tag} href={localePath(locale, `/tags/${tag}`)}>
          <Badge
            variant={activeTag === tag ? "default" : "secondary"}
            className="cursor-pointer transition-colors text-xs sm:text-sm"
          >
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
