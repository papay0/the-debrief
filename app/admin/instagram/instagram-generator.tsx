"use client";

import React, { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import type { PostMetadata } from "@/lib/posts";
import type { MiniReelGradient } from "@/remotion/constants";
import {
  FPS,
  VERTICAL,
  MINI_REEL_FRAMES,
  MINI_REEL_GRADIENTS,
} from "@/remotion/constants";
import {
  Search,
  Sparkles,
  Download,
  Copy,
  Check,
  Loader2,
  ChevronDown,
  Film,
} from "lucide-react";

// Dynamically import Remotion Player (no SSR)
const PlayerComponent = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false }
);

const GRADIENT_OPTIONS: { key: MiniReelGradient; label: string }[] = [
  { key: "ocean", label: "Ocean Deep" },
  { key: "dusk", label: "Dusk Purple" },
  { key: "emerald", label: "Emerald Night" },
  { key: "midnight", label: "Midnight Blue" },
  { key: "ember", label: "Warm Ember" },
];

interface GeneratedContent {
  headline: string;
  tldr: string;
  instagramCaption: string;
  hashtags: string;
}

export function InstagramGenerator({ posts }: { posts: PostMetadata[] }) {
  // Article selection
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Generation
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);

  // Editable fields
  const [headline, setHeadline] = useState("");
  const [tldr, setTldr] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");

  // Gradient
  const [gradient, setGradient] = useState<MiniReelGradient>("ocean");

  // Export
  const [rendering, setRendering] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  // Filter articles by search
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, searchQuery]);

  const selectedPost = posts.find((p) => p.slug === selectedSlug);

  // Lazily import MiniReel component for preview
  const LazyMiniReel = useMemo(
    () =>
      React.lazy(() =>
        import("@/remotion/compositions/MiniReel").then((mod) => ({
          default: mod.MiniReel as React.FC<Record<string, unknown>>,
        }))
      ),
    []
  );

  const handleSelectArticle = useCallback(
    (slug: string) => {
      setSelectedSlug(slug);
      setDropdownOpen(false);
      setSearchQuery("");
      // Reset generated content when switching articles
      setGenerated(null);
      setHeadline("");
      setTldr("");
      setCaption("");
      setHashtags("");
    },
    []
  );

  const handleGenerate = useCallback(async () => {
    if (!selectedSlug) return;
    setLoading(true);

    try {
      // Fetch full article content
      const articleRes = await fetch(`/api/admin/articles/${selectedSlug}`);
      const article = await articleRes.json();

      // Generate mini reel content
      const genRes = await fetch("/api/admin/generate-mini-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          tags: article.tags,
          content: article.content,
          date: article.date,
        }),
      });

      const data = await genRes.json();
      setGenerated(data);
      setHeadline(data.headline);
      setTldr(data.tldr);
      setCaption(data.instagramCaption);
      setHashtags(data.hashtags);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedSlug]);

  const handleExportVideo = useCallback(async () => {
    setRendering(true);
    try {
      const res = await fetch("/api/admin/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compositionId: "MiniReel",
          props: { headline, tldr, gradient },
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mini-reel-${selectedSlug}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Render failed:", err);
    } finally {
      setRendering(false);
    }
  }, [headline, tldr, gradient, selectedSlug]);

  const handleCopyCaption = useCallback(() => {
    const fullText = caption + "\n\n" + hashtags;
    navigator.clipboard.writeText(fullText);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  }, [caption, hashtags]);

  const hasContent = headline && tldr;

  return (
    <div className="space-y-10">
      {/* ── Step 1: Article Selection ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
            1
          </div>
          <h2 className="text-lg font-serif font-semibold">Choose Article</h2>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm hover:border-foreground/20 transition-colors"
          >
            <span className={selectedPost ? "text-foreground" : "text-muted-foreground"}>
              {selectedPost ? selectedPost.title : "Select an article..."}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {dropdownOpen && (
            <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-background shadow-lg overflow-hidden">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredPosts.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No articles found
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <button
                      key={post.slug}
                      type="button"
                      onClick={() => handleSelectArticle(post.slug)}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 ${
                        post.slug === selectedSlug ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="font-medium text-foreground leading-snug">
                        {post.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span>{post.date}</span>
                        <span className="text-border">|</span>
                        <span>{post.tags.slice(0, 3).join(", ")}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {selectedSlug && !generated && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Mini Reel
              </>
            )}
          </button>
        )}
      </section>

      {/* ── Step 2: Customize (only after generation) ── */}
      {hasContent && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
              2
            </div>
            <h2 className="text-lg font-serif font-semibold">
              Customize & Preview
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Editor */}
            <div className="space-y-6">
              {/* Gradient picker */}
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">
                  Gradient Theme
                </label>
                <div className="flex gap-2 flex-wrap">
                  {GRADIENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setGradient(opt.key)}
                      className={`relative rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                        gradient === opt.key
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-white/20"
                        style={{
                          background: MINI_REEL_GRADIENTS[opt.key],
                        }}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base font-serif font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                />
                <div className="text-[11px] text-muted-foreground mt-1.5">
                  {headline.length} chars (best under 40)
                </div>
              </div>

              {/* TLDR */}
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                  TLDR (2 sentences)
                </label>
                <textarea
                  value={tldr}
                  onChange={(e) => setTldr(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none"
                />
              </div>

              {/* Re-generate button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Regenerate
              </button>
            </div>

            {/* Right: Preview */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 block">
                Reel Preview (9:16)
              </label>
              <div className="mx-auto" style={{ maxWidth: 320 }}>
                {PlayerComponent && (
                  <PlayerComponent
                    key={`${gradient}-${headline}-${tldr}`}
                    component={LazyMiniReel}
                    inputProps={{ headline, tldr, gradient }}
                    durationInFrames={MINI_REEL_FRAMES}
                    compositionWidth={VERTICAL.width}
                    compositionHeight={VERTICAL.height}
                    fps={FPS}
                    controls
                    loop
                    style={{
                      width: "100%",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  />
                )}
              </div>

              {/* Export video */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleExportVideo}
                  disabled={rendering}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {rendering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Rendering MP4...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Export MP4
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Step 3: Caption & Hashtags ── */}
      {hasContent && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
              3
            </div>
            <h2 className="text-lg font-serif font-semibold">
              Caption & Hashtags
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Caption */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                Instagram Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none"
              />
            </div>

            {/* Hashtags */}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
              />
              <div className="text-[11px] text-muted-foreground mt-1.5">
                Space-separated. Will be appended below the caption when copied.
              </div>

              {/* Copy all button */}
              <button
                type="button"
                onClick={handleCopyCaption}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
              >
                {captionCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Caption + Hashtags
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!selectedSlug && (
        <div className="text-center py-20">
          <Film className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            Select an article above to get started.
          </p>
        </div>
      )}
    </div>
  );
}
