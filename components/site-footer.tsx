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
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.7 2.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
              </svg>
            </a>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  )
}
