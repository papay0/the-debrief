import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative min-h-screen flex flex-col">
        <SiteHeader locale="en" />
        <main className="flex-1">
          <article className="mx-auto max-w-2xl px-4 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-16">
            <header className="mb-10 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-semibold font-serif leading-[1.15]">
                Story Not Found
              </h1>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <time className="tabular-nums">{formattedDate}</time>
                <span aria-hidden="true" className="text-border">&middot;</span>
                <span>0 min read</span>
              </div>
            </header>

            <div>
              <p className="mb-5 text-foreground/85 text-[15px] sm:text-[16.5px]" style={{ lineHeight: 1.8 }}>
                The article you&apos;re looking for doesn&apos;t exist. It may have
                been moved, or it was never published. These things happen when
                you&apos;re covering AI news at the speed of AI.
              </p>
              <p className="text-[15px] sm:text-[16.5px]" style={{ lineHeight: 1.8 }}>
                <Link
                  href="/"
                  className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                >
                  Back to all stories
                </Link>
              </p>
            </div>
          </article>
        </main>
        <SiteFooter locale="en" />
      </div>
    </ThemeProvider>
  );
}
