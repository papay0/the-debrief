import { getAllPosts } from "@/lib/posts";
import { IGGenerator } from "./carousel-generator";

export default function IGGeneratorPage() {
  const posts = getAllPosts(true, "en");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
              Admin
            </span>
            <span className="text-border">&middot;</span>
            <span className="text-xs text-muted-foreground">
              The Debrief
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.15] text-foreground">
            Instagram Post Generator
          </h1>
          <p className="text-muted-foreground mt-3 text-[15px] sm:text-base leading-relaxed">
            Select an article to generate carousel slides, caption, and hashtags.
          </p>
          <div className="w-8 h-0.5 bg-primary mt-6" />
        </header>
        <IGGenerator posts={posts} />
      </div>
    </div>
  );
}
