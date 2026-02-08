import { getAllPosts } from "@/lib/posts";
import { IGGenerator } from "./carousel-generator";

export default function IGGeneratorPage() {
  const posts = getAllPosts(true, "en");

  return (
    <div className="min-h-screen bg-[#0a0b10] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-md bg-[#1b2340] flex items-center justify-center">
              <span className="text-[10px] font-bold tracking-tight text-white/90">TD</span>
            </div>
            <span className="text-xs font-medium tracking-widest uppercase text-white/40">
              Admin
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-4 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
            Instagram Post Generator
          </h1>
          <p className="text-white/40 mt-2 text-sm">
            Select an article to generate carousel slides, caption, and hashtags.
          </p>
        </header>
        <IGGenerator posts={posts} />
      </div>
    </div>
  );
}
