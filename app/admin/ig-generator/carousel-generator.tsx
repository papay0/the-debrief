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

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const BG = "#1b2340";

function SlideTitle({ slide }: { slide: SlideData }) {
  const titleLen = slide.title?.length || 0;
  const fontSize = titleLen > 60 ? 64 : titleLen > 45 ? 72 : 80;

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "90px 90px 120px",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          left: -100,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.02)",
        }}
      />
      <div
        style={{
          width: 60,
          height: 5,
          background: "rgba(255,255,255,0.3)",
          borderRadius: 3,
          marginBottom: 48,
        }}
      />
      <div
        style={{
          fontSize,
          fontWeight: 800,
          color: "white",
          lineHeight: 1.15,
          letterSpacing: "-0.025em",
          marginBottom: 36,
        }}
      >
        {slide.title}
      </div>
      {slide.description && (
        <div
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.5,
            maxWidth: 860,
          }}
        >
          {slide.description}
        </div>
      )}
      {slide.tags && slide.tags.length > 0 && (
        <div style={{ display: "flex", gap: 12, marginTop: 48 }}>
          {slide.tags.map((tag) => (
            <div
              key={tag}
              style={{
                padding: "10px 22px",
                background: "rgba(255,255,255,0.07)",
                borderRadius: 100,
                fontSize: 24,
                color: "rgba(255,255,255,0.55)",
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 90,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          TD
        </div>
        <span
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          The Debrief
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 56,
          right: 90,
          fontSize: 18,
          color: "rgba(255,255,255,0.2)",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        Swipe
        <span style={{ fontSize: 22 }}>&rarr;</span>
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
        background: BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "90px 90px 120px",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: -180,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.02)",
          transform: "translateY(-50%)",
        }}
      />
      <div
        style={{
          fontSize: 20,
          color: "rgba(255,255,255,0.2)",
          fontWeight: 600,
          letterSpacing: "0.1em",
          marginBottom: 48,
        }}
      >
        {slide.slideNumber} / {slide.totalSlides}
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "white",
          lineHeight: 1.12,
          letterSpacing: "-0.03em",
          marginBottom: 48,
        }}
      >
        {slide.heading}
      </div>
      <div
        style={{
          width: 50,
          height: 4,
          background: "rgba(255,255,255,0.2)",
          borderRadius: 2,
          marginBottom: 48,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {slide.bullets?.map((bullet, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 22,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.3)",
                marginTop: 17,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: 36,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.5,
                maxWidth: 840,
              }}
            >
              {bullet}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 90,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 800,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          TD
        </div>
        <span
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.3)",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          The Debrief
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 58,
          right: 90,
          display: "flex",
          gap: 8,
        }}
      >
        {Array.from({ length: slide.totalSlides || 0 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === slide.slideNumber ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background:
                i + 1 === slide.slideNumber
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
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
        background: BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 90,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.02)",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 20,
          background: "rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 56,
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "-0.02em",
          }}
        >
          TD
        </span>
      </div>
      <div
        style={{
          fontSize: 58,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-0.025em",
          marginBottom: 28,
        }}
      >
        Read the
        <br />
        full article
      </div>
      <div
        style={{
          fontSize: 30,
          color: "rgba(255,255,255,0.35)",
          fontWeight: 500,
          marginBottom: 64,
        }}
      >
        the-debrief.ai
      </div>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          color: "rgba(255,255,255,0.35)",
        }}
      >
        &uarr;
      </div>
      <div
        style={{
          fontSize: 16,
          color: "rgba(255,255,255,0.18)",
          marginTop: 14,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Link in bio
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 58,
          display: "flex",
          gap: 8,
        }}
      >
        {Array.from({ length: slide.totalSlides || 0 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i + 1 === slide.slideNumber ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background:
                i + 1 === slide.slideNumber
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.12)",
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
      <div className="text-xs text-white/20 mb-2 font-medium">
        {slide.type === "title"
          ? "Cover"
          : slide.type === "cta"
            ? "CTA"
            : `Slide ${slide.slideNumber}`}
      </div>
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden border border-white/[0.06] bg-[#1b2340] aspect-square"
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
          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
            <Download className="w-5 h-5 text-white" />
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
      className="relative rounded-2xl overflow-hidden bg-[#1b2340] aspect-square"
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
      className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
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
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
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
      className="relative rounded-lg overflow-hidden bg-[#1b2340] aspect-square w-full"
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
            className={`group/card rounded-xl border overflow-hidden transition-all duration-300 ${
              isOpen
                ? "bg-white/[0.04] border-white/[0.1] shadow-lg shadow-black/20"
                : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.08]"
            }`}
          >
            {/* Header row */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center gap-4 px-4 py-3 text-left cursor-pointer transition-colors"
            >
              {/* Mini preview thumbnail */}
              <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-white/[0.08] shadow-sm shadow-black/20">
                <SlideEditorMiniPreview slide={slide} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30">
                    {label}
                  </span>
                  {slide.type === "title" && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400/60 font-medium">
                      Cover
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/60 truncate mt-0.5 leading-snug">
                  {previewText || "Untitled"}
                </p>
              </div>

              <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? "bg-white/[0.08] rotate-180"
                    : "bg-transparent group-hover/card:bg-white/[0.04]"
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5 text-white/30" />
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
                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-4" />

                  {/* Two-column: fields + live preview */}
                  <div className="flex gap-4">
                    {/* Fields */}
                    <div className="flex-1 space-y-3 min-w-0">
                      {slide.type === "title" && (
                        <>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Type className="w-3 h-3 text-white/20" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
                                Title
                              </label>
                              <span className="ml-auto text-[10px] text-white/15 tabular-nums">
                                {(slide.title || "").length}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={slide.title || ""}
                              onChange={(e) =>
                                onUpdateSlide(i, { title: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.05] focus:ring-1 focus:ring-white/[0.06] transition-all duration-200 placeholder:text-white/15"
                              placeholder="Enter slide title..."
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <AlignLeft className="w-3 h-3 text-white/20" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
                                Description
                              </label>
                              <span className="ml-auto text-[10px] text-white/15 tabular-nums">
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
                              className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.05] focus:ring-1 focus:ring-white/[0.06] transition-all duration-200 resize-none placeholder:text-white/15"
                              placeholder="Brief description..."
                            />
                          </div>
                        </>
                      )}

                      {slide.type === "content" && (
                        <>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Type className="w-3 h-3 text-white/20" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
                                Heading
                              </label>
                              <span className="ml-auto text-[10px] text-white/15 tabular-nums">
                                {(slide.heading || "").length}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={slide.heading || ""}
                              onChange={(e) =>
                                onUpdateSlide(i, { heading: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/80 text-sm focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.05] focus:ring-1 focus:ring-white/[0.06] transition-all duration-200 placeholder:text-white/15"
                              placeholder="Slide heading..."
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <AlignLeft className="w-3 h-3 text-white/20" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
                                Key Points
                              </label>
                              <span className="ml-auto text-[10px] text-white/15">
                                {(slide.bullets || []).length} items
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {(slide.bullets || []).map((bullet, bi) => (
                                <div
                                  key={bi}
                                  className="group/bullet flex items-center gap-1.5"
                                >
                                  <GripVertical className="w-3 h-3 text-white/[0.08] shrink-0 group-hover/bullet:text-white/20 transition-colors" />
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
                                      className="w-full pl-3 pr-8 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.05] text-white/70 text-sm focus:outline-none focus:border-white/[0.12] focus:bg-white/[0.04] focus:ring-1 focus:ring-white/[0.06] transition-all duration-200 placeholder:text-white/15"
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
                                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/bullet:opacity-100 hover:bg-red-500/10 text-white/20 hover:text-red-400/70 transition-all cursor-pointer"
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
                                className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/50 transition-colors cursor-pointer ml-[18px] mt-1 group/add"
                              >
                                <span className="w-4 h-4 rounded-full border border-dashed border-white/15 group-hover/add:border-white/30 flex items-center justify-center transition-colors">
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
                        <div className="text-[9px] uppercase tracking-[0.15em] text-white/15 font-semibold mb-1.5 text-center">
                          Preview
                        </div>
                        <div className="rounded-lg overflow-hidden border border-white/[0.06] shadow-md shadow-black/30">
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
      backgroundColor: BG,
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
        backgroundColor: BG,
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
          className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4 text-white/30" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/30 mb-0.5">Article</div>
              <div className="text-sm text-white/80 truncate">
                {selectedPost?.title || "Select an article..."}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-white/30 shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-xl bg-[#141520] border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden">
            <div className="max-h-80 overflow-y-auto">
              {posts.map((post) => (
                <button
                  key={post.slug}
                  onClick={() => handleSelectArticle(post.slug)}
                  className={`w-full text-left px-5 py-3.5 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0 cursor-pointer ${
                    post.slug === selectedSlug ? "bg-white/[0.06]" : ""
                  }`}
                >
                  <div className="text-sm text-white/80 font-medium">
                    {post.title}
                  </div>
                  <div className="text-xs text-white/30 mt-1 flex items-center gap-2">
                    <span>{post.date}</span>
                    <span className="text-white/10">|</span>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                    {post.draft && (
                      <span className="text-amber-400/60 font-medium">
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
        <div className="flex items-center gap-3 text-white/40 py-20">
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
              <h2 className="text-lg font-semibold text-white/80">
                Carousel Preview
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setFullscreen(true)}
                  variant="ghost"
                  className="text-white/40 hover:text-white/70 hover:bg-white/[0.06] cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Fullscreen
                </Button>
                <Button
                  onClick={handleRegenerate}
                  variant="ghost"
                  className="text-white/40 hover:text-white/70 hover:bg-white/[0.06] cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  onClick={downloadAll}
                  disabled={exporting}
                  className="bg-white/[0.08] hover:bg-white/[0.12] text-white/80 border border-white/[0.06] cursor-pointer"
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
                <CarouselPrevious className="bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-white" />
                <CarouselNext className="bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-white" />
              </Carousel>
            </div>
          </section>

          {/* === Edit Content === */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white/80">
                  Edit Content
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/20 font-medium">
                  {slides.filter((s) => s.type !== "cta").length} editable
                </span>
              </div>
            </div>
            <SlideEditor slides={slides} onUpdateSlide={updateSlide} />
          </section>

          {/* === Caption & Hashtags === */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Caption */}
            <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 hover:border-white/[0.08] transition-colors group/caption">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-white/20" />
                  <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">
                    Caption
                  </h3>
                  <span className="text-[10px] text-white/15 tabular-nums">
                    {caption.length}
                  </span>
                </div>
                <CopyButton text={caption} />
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="w-full text-white/70 text-sm leading-relaxed bg-white/[0.03] border border-white/[0.05] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.05] focus:ring-1 focus:ring-white/[0.06] transition-all duration-200 resize-none placeholder:text-white/15"
                placeholder="Write your caption..."
              />
            </div>

            {/* Hashtags */}
            <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 hover:border-white/[0.08] transition-colors group/hashtags">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-blue-400/30" />
                  <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">
                    Hashtags
                  </h3>
                  <span className="text-[10px] text-white/15 tabular-nums">
                    {hashtags.split(/\s+/).filter(Boolean).length} tags
                  </span>
                </div>
                <CopyButton text={hashtags} />
              </div>
              <textarea
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                rows={3}
                className="w-full text-blue-400/60 text-sm leading-relaxed bg-white/[0.03] border border-white/[0.05] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-blue-400/20 focus:bg-white/[0.05] focus:ring-1 focus:ring-blue-400/10 transition-all duration-200 resize-none placeholder:text-white/15"
                placeholder="#hashtags..."
              />
            </div>
          </section>

          {/* === All Slides Grid === */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-white/80">
                All Slides
              </h2>
              <Badge
                variant="secondary"
                className="bg-white/[0.06] text-white/50 border-0 px-3 py-1"
              >
                {slides.length} slides
              </Badge>
              <span className="text-xs text-white/20">
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
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
            <Sparkles className="w-7 h-7 text-white/15" />
          </div>
          <p className="text-white/25 text-sm">
            Select an article to generate your Instagram post.
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
