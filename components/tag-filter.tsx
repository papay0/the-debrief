import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface TagFilterProps {
  tags: string[]
  activeTag?: string
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  return (
    <div className="hidden sm:flex flex-wrap gap-2">
      <Link href="/">
        <Badge
          variant={!activeTag ? "default" : "secondary"}
          className="cursor-pointer transition-colors text-xs sm:text-sm"
        >
          All
        </Badge>
      </Link>
      {tags.map((tag) => (
        <Link key={tag} href={`/tags/${tag}`}>
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
