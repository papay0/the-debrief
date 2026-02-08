import { Instagram } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Locale } from "@/lib/i18n"

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t py-6 sm:py-8 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Mobile: toggles + copyright */}
        <div className="flex flex-col items-center gap-4 sm:hidden">
          <div className="flex items-center gap-1">
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/the.debrief.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} The Debrief
            </p>
          </div>
        </div>
        {/* Desktop: copyright + instagram */}
        <div className="hidden sm:flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} The Debrief</p>
          <span className="text-border">·</span>
          <a
            href="https://instagram.com/the.debrief.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            Instagram
          </a>
        </div>
      </div>
    </footer>
  )
}
