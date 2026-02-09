import Image from "next/image";
import Link from "next/link";
import { Sparkles, BarChart3, ArrowRight } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Site header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-2xl flex h-14 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo-td.svg"
              alt="The Debrief"
              width={24}
              height={24}
              className="rounded"
            />
            <span className="font-serif font-semibold text-sm tracking-tight">
              The Debrief
            </span>
          </Link>
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
            Admin
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14 sm:py-20">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
              Admin
            </span>
            <span className="text-border">&middot;</span>
            <span className="text-xs text-muted-foreground">The Debrief</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.15] text-foreground">
            Content Tools
          </h1>
          <p className="text-muted-foreground mt-3 text-[15px] sm:text-base leading-relaxed">
            Turn articles into social media content.
          </p>
          <div className="w-8 h-0.5 bg-primary mt-6" />
        </header>

        <div className="space-y-4">
          <Link
            href="/admin/content-generator"
            className="group block rounded-xl border border-border bg-background p-6 hover:border-foreground/15 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-5">
              <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <Sparkles className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h2 className="text-base font-semibold font-serif text-foreground leading-snug">
                    Content Generator
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium shrink-0">
                    Images + Video + TTS
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  One AI call generates carousel slides, video narration,
                  caption, and hashtags. Edit once, export as PNG or MP4.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-border group-hover:text-muted-foreground transition-colors shrink-0 mt-1" />
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            className="group block rounded-xl border border-border bg-background p-6 hover:border-foreground/15 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-5">
              <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <BarChart3 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h2 className="text-base font-semibold font-serif text-foreground leading-snug">
                    Analytics
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium shrink-0">
                    Page Views
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track page views per article, language, and page type.
                  Daily trends and all-time totals.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-border group-hover:text-muted-foreground transition-colors shrink-0 mt-1" />
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground/50 text-center">
            the-debrief.ai
          </p>
        </div>
      </div>
    </div>
  );
}
