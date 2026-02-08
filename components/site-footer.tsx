import { Instagram } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NewsletterSubscribe } from "@/components/newsletter-subscribe"
import type { Locale } from "@/lib/i18n"

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-8 bg-muted/40">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-12 pb-[calc(2.5rem+env(safe-area-inset-bottom))] sm:pb-12">
        <NewsletterSubscribe locale={locale} />
        <div className="flex items-center justify-between mt-10 pt-0">
          <p className="text-xs text-muted-foreground/70">
            &copy; {new Date().getFullYear()} The Debrief
          </p>
          <div className="flex items-center gap-3.5 text-muted-foreground/70">
            <a
              href="https://instagram.com/the.debrief.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <Instagram className="size-3.5" />
            </a>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  )
}
