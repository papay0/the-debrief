import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { TypewriterTitle } from "@/components/typewriter-title"
import { localePath } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="mx-auto max-w-2xl flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href={localePath(locale, "/")} className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-td.png"
            alt="The Debrief"
            width={24}
            height={24}
            className="rounded"
          />
          <TypewriterTitle />
        </Link>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground"
            data-search-trigger
          >
            <Search className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
