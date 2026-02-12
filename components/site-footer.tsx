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
              href="https://x.com/thedebriefai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
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
