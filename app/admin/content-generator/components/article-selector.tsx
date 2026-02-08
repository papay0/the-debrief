"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import type { PostMetadata } from "@/lib/posts";

export function ArticleSelector({
  posts,
  selectedSlug,
  onSelect,
}: {
  posts: PostMetadata[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedPost = posts.find((p) => p.slug === selectedSlug);

  return (
    <div className="relative max-w-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-lg bg-muted/50 border border-border hover:border-foreground/20 transition-colors text-left cursor-pointer shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground mb-0.5">Article</div>
            <div className="text-sm text-foreground/85 truncate font-serif">
              {selectedPost?.title || "Select an article..."}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg bg-background border border-border shadow-lg overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {posts.map((post) => (
              <button
                key={post.slug}
                onClick={() => {
                  onSelect(post.slug);
                  setOpen(false);
                }}
                className={`w-full text-left px-5 py-3.5 hover:bg-muted/50 transition-colors border-b border-border last:border-0 cursor-pointer ${
                  post.slug === selectedSlug ? "bg-muted/70" : ""
                }`}
              >
                <div className="text-sm text-foreground/85 font-serif font-semibold leading-snug">
                  {post.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <span className="tabular-nums">{post.date}</span>
                  <span className="text-border">&middot;</span>
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                  {post.draft && (
                    <span className="text-destructive font-medium">Draft</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
