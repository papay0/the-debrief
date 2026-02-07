import Link from "next/link"
import { X } from "lucide-react"

interface TagPageHeaderProps {
  tag: string
  count: number
}

export function TagPageHeader({ tag, count }: TagPageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-4 mb-2 border-b border-border sm:hidden">
      <div className="flex items-baseline gap-2.5 min-w-0">
        <span className="text-sm font-medium text-primary truncate">
          {tag}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          {count} {count === 1 ? "article" : "articles"}
        </span>
      </div>
      <Link
        href="/"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <X className="h-3 w-3" />
        Clear
      </Link>
    </div>
  )
}
