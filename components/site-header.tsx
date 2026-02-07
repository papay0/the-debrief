import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { t, localePath } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n"

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="mx-auto max-w-3xl flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href={localePath(locale, "/")} className="text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors shrink-0">
            The Debrief
          </Link>
          <span className="text-sm text-muted-foreground truncate">
            {t(locale, "site.tagline")}
          </span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:w-auto sm:px-3 sm:gap-2 text-muted-foreground"
            data-search-trigger
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">{t(locale, "site.search")}</span>
            <kbd className="hidden sm:inline-flex pointer-events-none h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">&#8984;</span>K
            </kbd>
          </Button>
          <div className="hidden sm:flex items-center gap-0.5">
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
