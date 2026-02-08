"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { PostMetadata } from "@/lib/posts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Download,
  Loader2,
  ChevronDown,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Maximize2,
  X,
  Plus,
  Trash2,
  Type,
  AlignLeft,
  Hash,
  GripVertical,
  MessageSquare,
} from "lucide-react";

// --- Types ---

interface SlideData {
  type: "title" | "content" | "cta";
  title?: string;
  description?: string;
  tags?: string[];
  heading?: string;
  bullets?: string[];
  slideNumber?: number;
  totalSlides?: number;
}

// --- Slide rendering (inline styles for html2canvas) ---

// Editorial palette: warm cream background, deep ink text, refined serif typography
const SLIDE_BG = "#FAFAF7";
const SLIDE_INK = "#1A1A18";
const SLIDE_MUTED = "#8A8A82";
const SLIDE_ACCENT = "#2B2B6E"; // Deep editorial blue
const SLIDE_RULE = "#D4D4CC";
const SERIF = '"Source Serif 4", "Georgia", "Times New Roman", serif';
const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';

function SlideTitle({ slide }: { slide: SlideData }) {
  const titleLen = slide.title?.length || 0;
  const fontSize = titleLen > 60 ? 66 : titleLen > 45 ? 76 : 84;

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: SLIDE_BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px 100px 140px",
        fontFamily: SERIF,
      }}
    >
      {/* Masthead */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 100,
          right: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontFamily: SANS,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: SLIDE_INK,
          }}
        >
          The Debrief
        </div>
        <div
          style={{
            fontSize: 14,
            fontFamily: SANS,
            fontWeight: 400,
            color: SLIDE_MUTED,
            letterSpacing: "0.04em",
          }}
        >
          the-debrief.ai
        </div>
      </div>

      {/* Thin rule under masthead */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 100,
          right: 100,
          height: 1,
          background: SLIDE_RULE,
        }}
      />

      {/* Title */}
      <div
        style={{
          fontSize,
          fontWeight: 700,
          color: SLIDE_INK,
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          marginBottom: 32,
          maxWidth: 830,
        }}
      >
        {slide.title}
      </div>

      {/* Description */}
      {slide.description && (
        <div
          style={{
            fontSize: 34,
            fontFamily: SANS,
            color: SLIDE_MUTED,
            lineHeight: 1.55,
            maxWidth: 780,
          }}
        >
          {slide.description}
        </div>
      )}

      {/* Tags */}
      {slide.tags && slide.tags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 44,
          }}
        >
          {slide.tags.map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                border: `1px solid ${SLIDE_RULE}`,
                borderRadius: 100,
                fontSize: 20,
                fontFamily: SANS,
                color: SLIDE_MUTED,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          left: 100,
          right: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontFamily: SANS,
            color: SLIDE_MUTED,
            fontWeight: 400,
            letterSpacing: "0.04em",
          }}
        >
          Swipe to read &rarr;
        </div>
        <div style={{ width: 36, height: 2, background: SLIDE_ACCENT }} />
      </div>
    </div>
  );
}

function SlideContent({ slide }: { slide: SlideData }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: SLIDE_BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "100px 100px 140px",
        fontFamily: SERIF,
      }}
    >
      {/* Top rule */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 100,
          right: 100,
          height: 1,
          background: SLIDE_RULE,
        }}
      />

      {/* Slide number */}
      <div
        style={{
          fontSize: 14,
          fontFamily: SANS,
          color: SLIDE_MUTED,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          marginBottom: 44,
        }}
      >
        {String(slide.slideNumber).padStart(2, "0")} / {String(slide.totalSlides).padStart(2, "0")}
      </div>

      {/* Heading */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: SLIDE_INK,
          lineHeight: 1.14,
          letterSpacing: "-0.02em",
          marginBottom: 40,
          maxWidth: 800,
        }}
      >
        {slide.heading}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 40,
          height: 2,
          background: SLIDE_ACCENT,
          marginBottom: 40,
        }}
      />

      {/* Bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {slide.bullets?.map((bullet, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: SLIDE_ACCENT,
                marginTop: 18,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: 36,
                fontFamily: SANS,
                color: SLIDE_INK,
                lineHeight: 1.55,
                maxWidth: 820,
                opacity: 0.8,
              }}
            >
              {bullet}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          left: 100,
          right: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontFamily: SANS,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            color: SLIDE_MUTED,
            opacity: 0.6,
          }}
        >
          The Debrief
        </div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: slide.totalSlides || 0 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === slide.slideNumber ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background:
                  i + 1 === slide.slideNumber ? SLIDE_ACCENT : SLIDE_RULE,
                transition: "width 0.2s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideCTA({ slide }: { slide: SlideData }) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: SLIDE_BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 100,
        fontFamily: SERIF,
      }}
    >
      {/* Masthead */}
      <div
        style={{
          fontSize: 15,
          fontFamily: SANS,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: SLIDE_INK,
          marginBottom: 64,
        }}
      >
        The Debrief
      </div>

      {/* CTA text */}
      <div
        style={{
          fontSize: 68,
          fontWeight: 700,
          color: SLIDE_INK,
          textAlign: "center" as const,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: 28,
        }}
      >
        Read the
        <br />
        full article
      </div>

      {/* Divider */}
      <div
        style={{
          width: 48,
          height: 2,
          background: SLIDE_ACCENT,
          marginBottom: 32,
        }}
      />

      {/* URL */}
      <div
        style={{
          fontSize: 28,
          fontFamily: SANS,
          color: SLIDE_MUTED,
          fontWeight: 400,
          marginBottom: 56,
          letterSpacing: "0.02em",
        }}
      >
        the-debrief.ai
      </div>

      {/* Arrow up icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `1.5px solid ${SLIDE_RULE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: SLIDE_MUTED,
        }}
      >
        &uarr;
      </div>

      <div
        style={{
          fontSize: 13,
          fontFamily: SANS,
          color: SLIDE_MUTED,
          marginTop: 14,
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          opacity: 0.6,
        }}
      >
        Link in bio
      </div>

      {/* Bottom progress dots */}
      <div
        style={{
          position: "absolute",
          bottom: 54,
          display: "flex",
          gap: 6,
        }}
      >
        {Array.from({ length: slide.totalSlides || 0 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === slide.slideNumber ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background:
                i + 1 === slide.slideNumber ? SLIDE_ACCENT : SLIDE_RULE,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SlideRenderer({ slide }: { slide: SlideData }) {
  switch (slide.type) {
    case "title":
      return <SlideTitle slide={slide} />;
    case "content":
      return <SlideContent slide={slide} />;
    case "cta":
      return <SlideCTA slide={slide} />;
  }
}

// --- Scaled slide preview ---

function SlidePreview({
  slide,
  index,
  onDownload,
}: {
  slide: SlideData;
  index: number;
  onDownload: (i: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setScale(entry.contentRect.width / 1080);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="group relative">
      <div className="text-xs text-muted-foreground mb-2 font-medium">
        {slide.type === "title"
          ? "Cover"
          : slide.type === "cta"
            ? "CTA"
            : `Slide ${slide.slideNumber}`}
      </div>
      <div
        ref={containerRef}
        className="relative rounded-lg overflow-hidden border border-border bg-background aspect-square"
      >
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            width: 1080,
            height: 1080,
            transform: `scale(${scale})`,
          }}
        >
          <SlideRenderer slide={slide} />
        </div>
        <button
          onClick={() => onDownload(index)}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <div className="bg-background/90 backdrop-blur-sm rounded-full p-3 border border-border shadow-sm">
            <Download className="w-5 h-5 text-foreground" />
          </div>
        </button>
      </div>
    </div>
  );
}

// --- Carousel slide for the interactive preview ---

function CarouselSlidePreview({ slide }: { slide: SlideData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setScale(entry.contentRect.width / 1080);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative rounded-lg overflow-hidden bg-background border border-border aspect-square"
    >
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          width: 1080,
          height: 1080,
          transform: `scale(${scale})`,
        }}
      >
        <SlideRenderer slide={slide} />
      </div>
    </div>
  );
}

// --- Copy button helper ---

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground/60 transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

// --- Fullscreen carousel overlay ---

function FullscreenCarousel({
  slides,
  onClose,
}: {
  slides: SlideData[];
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      <div className="w-full h-full flex items-center justify-center px-20">
        <div className="w-full" style={{ maxWidth: "min(90vh, 90vw)" }}>
          <Carousel className="w-full">
            <CarouselContent>
              {slides.map((slide, i) => (
                <CarouselItem key={i}>
                  <CarouselSlidePreview slide={slide} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-white -left-14 size-10" />
            <CarouselNext className="bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-white -right-14 size-10" />
          </Carousel>
        </div>
      </div>
    </div>
  );
}

// --- Slide editor ---

function SlideEditorMiniPreview({ slide }: { slide: SlideData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.13);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setScale(entry.contentRect.width / 1080);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative rounded overflow-hidden bg-background border border-border aspect-square w-full"
    >
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          width: 1080,
          height: 1080,
          transform: `scale(${scale})`,
        }}
      >
        <SlideRenderer slide={slide} />
      </div>
    </div>
  );
}

function SlideEditor({
  slides,
  onUpdateSlide,
}: {
  slides: SlideData[];
  onUpdateSlide: (index: number, patch: Partial<SlideData>) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {slides.map((slide, i) => {
        if (slide.type === "cta") return null;
        const isOpen = openIndex === i;
        const label =
          slide.type === "title"
            ? "Cover"
            : `Slide ${slide.slideNumber}`;
        const previewText =
          slide.type === "title" ? slide.title : slide.heading;

        return (
          <div
            key={i}
            className={`group/card rounded-lg border overflow-hidden transition-all duration-200 ${
              isOpen
                ? "bg-muted/50 border-border shadow-sm"
                : "bg-background border-border hover:bg-muted/30"
            }`}
          >
            {/* Header row */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center gap-4 px-4 py-3 text-left cursor-pointer transition-colors"
            >
              {/* Mini preview thumbnail */}
              <div className="w-10 h-10 shrink-0 rounded overflow-hidden border border-border">
                <SlideEditorMiniPreview slide={slide} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    {label}
                  </span>
                </div>
                <p className="text-sm text-foreground/85 truncate mt-0.5 leading-snug">
                  {previewText || "Untitled"}
                </p>
              </div>

              <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isOpen
                    ? "bg-muted rotate-180"
                    : "bg-transparent group-hover/card:bg-muted"
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </button>

            {/* Expandable content area */}
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 pt-1">
                  {/* Subtle divider */}
                  <div className="h-px bg-border mb-4" />

                  {/* Two-column: fields + live preview */}
                  <div className="flex gap-4">
                    {/* Fields */}
                    <div className="flex-1 space-y-3 min-w-0">
                      {slide.type === "title" && (
                        <>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Type className="w-3 h-3 text-muted-foreground" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                Title
                              </label>
                              <span className="ml-auto text-[10px] text-muted-foreground/50 tabular-nums">
                                {(slide.title || "").length}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={slide.title || ""}
                              onChange={(e) =>
                                onUpdateSlide(i, { title: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground/85 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                              placeholder="Enter slide title..."
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <AlignLeft className="w-3 h-3 text-muted-foreground" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                Description
                              </label>
                              <span className="ml-auto text-[10px] text-muted-foreground/50 tabular-nums">
                                {(slide.description || "").length}
                              </span>
                            </div>
                            <textarea
                              value={slide.description || ""}
                              onChange={(e) =>
                                onUpdateSlide(i, {
                                  description: e.target.value,
                                })
                              }
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground/85 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
                              placeholder="Brief description..."
                            />
                          </div>
                        </>
                      )}

                      {slide.type === "content" && (
                        <>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Type className="w-3 h-3 text-muted-foreground" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                Heading
                              </label>
                              <span className="ml-auto text-[10px] text-muted-foreground/50 tabular-nums">
                                {(slide.heading || "").length}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={slide.heading || ""}
                              onChange={(e) =>
                                onUpdateSlide(i, { heading: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground/85 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                              placeholder="Slide heading..."
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <AlignLeft className="w-3 h-3 text-muted-foreground" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                Key Points
                              </label>
                              <span className="ml-auto text-[10px] text-muted-foreground/50">
                                {(slide.bullets || []).length} items
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {(slide.bullets || []).map((bullet, bi) => (
                                <div
                                  key={bi}
                                  className="group/bullet flex items-center gap-1.5"
                                >
                                  <GripVertical className="w-3 h-3 text-border shrink-0 group-hover/bullet:text-muted-foreground transition-colors" />
                                  <div className="relative flex-1">
                                    <input
                                      type="text"
                                      value={bullet}
                                      onChange={(e) => {
                                        const newBullets = [
                                          ...(slide.bullets || []),
                                        ];
                                        newBullets[bi] = e.target.value;
                                        onUpdateSlide(i, {
                                          bullets: newBullets,
                                        });
                                      }}
                                      className="w-full pl-3 pr-8 py-1.5 rounded-md bg-background border border-border text-foreground/80 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                                      placeholder={`Point ${bi + 1}...`}
                                    />
                                    <button
                                      onClick={() => {
                                        const newBullets = (
                                          slide.bullets || []
                                        ).filter((_, j) => j !== bi);
                                        onUpdateSlide(i, {
                                          bullets: newBullets,
                                        });
                                      }}
                                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/bullet:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all cursor-pointer"
                                      title="Remove point"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => {
                                  const newBullets = [
                                    ...(slide.bullets || []),
                                    "",
                                  ];
                                  onUpdateSlide(i, { bullets: newBullets });
                                }}
                                className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground/60 transition-colors cursor-pointer ml-[18px] mt-1 group/add"
                              >
                                <span className="w-4 h-4 rounded-full border border-dashed border-border group-hover/add:border-muted-foreground flex items-center justify-center transition-colors">
                                  <Plus className="w-2.5 h-2.5" />
                                </span>
                                Add point
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Live mini preview */}
                    <div className="w-28 shrink-0 hidden sm:block">
                      <div className="sticky top-0">
                        <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50 font-semibold mb-1.5 text-center">
                          Preview
                        </div>
                        <div className="rounded overflow-hidden border border-border shadow-sm">
                          <SlideEditorMiniPreview slide={slide} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Main component ---

export function IGGenerator({ posts }: { posts: PostMetadata[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const slidesRef = useRef<HTMLDivElement>(null);

  const selectedPost = posts.find((p) => p.slug === selectedSlug);

  const updateSlide = useCallback(
    (index: number, patch: Partial<SlideData>) => {
      setSlides((prev) =>
        prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
      );
    },
    []
  );

  const generateForArticle = useCallback(async (slug: string) => {
    setLoading(true);
    setSlides([]);
    setCaption("");
    setHashtags("");

    try {
      const res = await fetch(`/api/admin/articles/${slug}`);
      const post = await res.json();

      const aiRes = await fetch("/api/admin/generate-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          description: post.description,
          tags: post.tags,
          content: post.content,
        }),
      });

      const aiData = await aiRes.json();

      if (aiData.error) {
        console.error("AI generation failed:", aiData.error);
        return;
      }

      const contentSlides = aiData.slides || [];
      const totalSlides = contentSlides.length + 2;
      const allSlides: SlideData[] = [];

      allSlides.push({
        type: "title",
        title: post.title,
        description: post.description,
        tags: post.tags,
      });

      contentSlides.forEach(
        (s: { heading: string; bullets: string[] }, i: number) => {
          allSlides.push({
            type: "content",
            heading: s.heading,
            bullets: s.bullets,
            slideNumber: i + 2,
            totalSlides,
          });
        }
      );

      allSlides.push({
        type: "cta",
        slideNumber: totalSlides,
        totalSlides,
      });

      setSlides(allSlides);

      setCaption(
        `Read the full article at the-debrief.ai/posts/${slug}`
      );
      setHashtags(aiData.hashtags || "");
    } catch (err) {
      console.error("Failed to generate:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectArticle = useCallback(
    (slug: string) => {
      setSelectedSlug(slug);
      setDropdownOpen(false);
      generateForArticle(slug);
    },
    [generateForArticle]
  );

  const handleRegenerate = useCallback(() => {
    if (selectedSlug) generateForArticle(selectedSlug);
  }, [selectedSlug, generateForArticle]);

  const downloadSlide = useCallback(async (index: number) => {
    const container = slidesRef.current;
    if (!container) return;
    const slideEl = container.children[index] as HTMLElement;
    if (!slideEl) return;

    const html2canvas = (await import("html2canvas-pro")).default;
    const canvas = await html2canvas(slideEl, {
      width: 1080,
      height: 1080,
      scale: 1,
      useCORS: true,
      backgroundColor: SLIDE_BG,
    });

    const link = document.createElement("a");
    link.download = `slide-${index + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const downloadAll = useCallback(async () => {
    setExporting(true);
    const container = slidesRef.current;
    if (!container) return;

    const html2canvas = (await import("html2canvas-pro")).default;

    for (let i = 0; i < container.children.length; i++) {
      const slideEl = container.children[i] as HTMLElement;
      const canvas = await html2canvas(slideEl, {
        width: 1080,
        height: 1080,
        scale: 1,
        useCORS: true,
        backgroundColor: SLIDE_BG,
      });

      const link = document.createElement("a");
      link.download = `slide-${i + 1}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      await new Promise((r) => setTimeout(r, 300));
    }

    setExporting(false);
  }, []);

  return (
    <div>
      {/* Article selector */}
      <div className="relative mb-8 max-w-lg">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-lg bg-muted/50 border border-border hover:border-foreground/20 transition-colors text-left cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">Article</div>
              <div className="text-sm text-foreground/85 truncate font-serif">
                {selectedPost?.title || "Select an article..."}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-lg bg-background border border-border shadow-lg overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              {posts.map((post) => (
                <button
                  key={post.slug}
                  onClick={() => handleSelectArticle(post.slug)}
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
                      <span className="text-destructive font-medium">
                        Draft
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 text-muted-foreground py-20">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Generating your Instagram post...</span>
        </div>
      )}

      {/* Results */}
      {!loading && slides.length > 0 && (
        <div className="space-y-10">
          {/* === Carousel Preview === */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold font-serif text-foreground">
                Carousel Preview
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setFullscreen(true)}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Fullscreen
                </Button>
                <Button
                  onClick={handleRegenerate}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  onClick={downloadAll}
                  disabled={exporting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download All
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Interactive carousel */}
            <div className="max-w-md mx-auto px-12">
              <Carousel className="w-full">
                <CarouselContent>
                  {slides.map((slide, i) => (
                    <CarouselItem key={i}>
                      <CarouselSlidePreview slide={slide} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="border-border text-foreground hover:bg-muted hover:text-foreground" />
                <CarouselNext className="border-border text-foreground hover:bg-muted hover:text-foreground" />
              </Carousel>
            </div>
          </section>

          {/* === Edit Content === */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold font-serif text-foreground">
                  Edit Content
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  {slides.filter((s) => s.type !== "cta").length} editable
                </span>
              </div>
            </div>
            <SlideEditor slides={slides} onUpdateSlide={updateSlide} />
          </section>

          {/* === Caption & Hashtags === */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Caption */}
            <div className="rounded-lg bg-background border border-border p-5 hover:border-foreground/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                    Caption
                  </h3>
                  <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                    {caption.length}
                  </span>
                </div>
                <CopyButton text={caption} />
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="w-full text-foreground/85 text-sm leading-relaxed bg-muted/30 border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
                placeholder="Write your caption..."
              />
            </div>

            {/* Hashtags */}
            <div className="rounded-lg bg-background border border-border p-5 hover:border-foreground/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                    Hashtags
                  </h3>
                  <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                    {hashtags.split(/\s+/).filter(Boolean).length} tags
                  </span>
                </div>
                <CopyButton text={hashtags} />
              </div>
              <textarea
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                rows={3}
                className="w-full text-primary text-sm leading-relaxed bg-muted/30 border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
                placeholder="#hashtags..."
              />
            </div>
          </section>

          {/* === All Slides Grid === */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold font-serif text-foreground">
                All Slides
              </h2>
              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground border-0 px-3 py-1"
              >
                {slides.length} slides
              </Badge>
              <span className="text-xs text-muted-foreground">
                1080 &times; 1080px
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {slides.map((slide, i) => (
                <SlidePreview
                  key={i}
                  slide={slide}
                  index={i}
                  onDownload={downloadSlide}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Empty state */}
      {!loading && slides.length === 0 && !selectedSlug && (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-lg">
          <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Select an article above to generate your Instagram post.
          </p>
        </div>
      )}

      {/* Fullscreen overlay */}
      {fullscreen && (
        <FullscreenCarousel
          slides={slides}
          onClose={() => setFullscreen(false)}
        />
      )}

      {/* Hidden full-size slides for export */}
      <div
        ref={slidesRef}
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: 0 }}
      >
        {slides.map((slide, i) => (
          <div key={i}>
            <SlideRenderer slide={slide} />
          </div>
        ))}
      </div>
    </div>
  );
}
