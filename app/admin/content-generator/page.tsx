import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { ContentGenerator } from "./content-generator";

export default function ContentGeneratorPage() {
  const posts = getAllPosts(true, "en");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Site header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4 sm:px-6">
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
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-md hover:bg-muted hover:text-foreground transition-colors"
            >
              Admin
            </Link>
            <span className="px-3 py-1.5 rounded-md bg-muted text-foreground font-medium">
              Content Generator
            </span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
              Admin
            </span>
            <span className="text-border">&middot;</span>
            <span className="text-xs text-muted-foreground">The Debrief</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.15] text-foreground">
            Content Generator
          </h1>
          <p className="text-muted-foreground mt-3 text-[15px] sm:text-base leading-relaxed max-w-xl">
            One AI call generates carousel slides, video narration, caption, and
            hashtags. Edit once, export everywhere.
          </p>
          <div className="w-8 h-0.5 bg-primary mt-6" />
        </header>
        <ContentGenerator posts={posts} />
      </div>
    </div>
  );
}
