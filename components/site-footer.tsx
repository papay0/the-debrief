import { Instagram } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Locale } from "@/lib/i18n"

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-10 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pb-10">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} The Debrief
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://instagram.com/the.debrief.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  )
}
