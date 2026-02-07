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
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} The Debrief
          </p>
        </div>
        {/* Desktop: just copyright */}
        <div className="hidden sm:block text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} The Debrief</p>
        </div>
      </div>
    </footer>
  )
}
