"use client";

import { useState } from "react";
import {
  ChevronDown,
  Type,
  Hash,
  AlignLeft,
  GripVertical,
  Plus,
  Trash2,
  Volume2,
} from "lucide-react";
import { SlideEditorMiniPreview } from "./slide-preview";
import type { SlideData } from "./slide-renderer";

interface GeneratedSlide {
  heading: string;
  bullets: string[];
  narration: string;
}

export function ContentEditor({
  slides,
  generatedSlides,
  titleNarration,
  ctaNarration,
  onUpdateSlide,
  onUpdateGenerated,
  onUpdateTitleNarration,
  onUpdateCtaNarration,
}: {
  slides: SlideData[];
  generatedSlides: GeneratedSlide[];
  titleNarration: string;
  ctaNarration: string;
  onUpdateSlide: (index: number, patch: Partial<SlideData>) => void;
  onUpdateGenerated: (index: number, patch: Partial<GeneratedSlide>) => void;
  onUpdateTitleNarration: (text: string) => void;
  onUpdateCtaNarration: (text: string) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {slides.map((slide, i) => {
        if (slide.type === "cta") {
          // CTA narration editor
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`group/card rounded-lg border overflow-hidden transition-all duration-200 ${
                isOpen
                  ? "bg-muted/50 border-border shadow-sm"
                  : "bg-background border-border hover:bg-muted/30"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center gap-4 px-4 py-3 text-left cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 shrink-0 rounded overflow-hidden border border-border">
                  <SlideEditorMiniPreview slide={slide} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      CTA
                    </span>
                  </div>
                  <p className="text-sm text-foreground/85 truncate mt-0.5 leading-snug">
                    Read the full article
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
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 pt-1">
                    <div className="h-px bg-border mb-4" />
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Volume2 className="w-3 h-3 text-muted-foreground" />
                        <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Narration
                        </label>
                        <span className="ml-auto text-[10px] text-muted-foreground/50 tabular-nums">
                          {ctaNarration.length}
                        </span>
                      </div>
                      <textarea
                        value={ctaNarration}
                        onChange={(e) => onUpdateCtaNarration(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground/85 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
                        placeholder="CTA narration..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        const isOpen = openIndex === i;
        const label =
          slide.type === "title" ? "Cover" : `Slide ${slide.slideNumber}`;
        const previewText =
          slide.type === "title" ? slide.title : slide.heading;

        // For content slides, find the matching generated slide index
        // Content slides are at index 1..4 in the slides array, mapping to generatedSlides[0..3]
        const genIndex = slide.type === "content" ? i - 1 : -1;
        const genSlide =
          genIndex >= 0 && genIndex < generatedSlides.length
            ? generatedSlides[genIndex]
            : null;

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

            {/* Expandable content */}
            <div
              className="grid transition-all duration-300 ease-in-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 pt-1">
                  <div className="h-px bg-border mb-4" />
                  <div className="flex gap-4">
                    {/* Fields */}
                    <div className="flex-1 space-y-3 min-w-0">
                      {slide.type === "title" && (
                        <>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Hash className="w-3 h-3 text-muted-foreground" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                Hook
                              </label>
                              <span className="ml-auto text-[10px] text-muted-foreground/50 tabular-nums">
                                {(slide.keyword || "").length}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={slide.keyword || ""}
                              onChange={(e) =>
                                onUpdateSlide(i, { keyword: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground/85 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/50"
                              placeholder="Scroll-stopping hook (e.g. This Free AI Was Secretly Stealing Passwords)..."
                            />
                          </div>
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
                          {/* Title narration */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Volume2 className="w-3 h-3 text-muted-foreground" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                Narration
                              </label>
                              <span className="ml-auto text-[10px] text-muted-foreground/50 tabular-nums">
                                {titleNarration.length}
                              </span>
                            </div>
                            <textarea
                              value={titleNarration}
                              onChange={(e) =>
                                onUpdateTitleNarration(e.target.value)
                              }
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground/85 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
                              placeholder="Title card narration..."
                            />
                          </div>
                        </>
                      )}

                      {slide.type === "content" && genSlide && (
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
                              onChange={(e) => {
                                onUpdateSlide(i, { heading: e.target.value });
                                onUpdateGenerated(genIndex, {
                                  heading: e.target.value,
                                });
                              }}
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
                                        onUpdateGenerated(genIndex, {
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
                                        onUpdateGenerated(genIndex, {
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
                                  onUpdateGenerated(genIndex, {
                                    bullets: newBullets,
                                  });
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
                          {/* Narration */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Volume2 className="w-3 h-3 text-muted-foreground" />
                              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                Narration
                              </label>
                              <span className="ml-auto text-[10px] text-muted-foreground/50 tabular-nums">
                                {genSlide.narration.length}
                              </span>
                            </div>
                            <textarea
                              value={genSlide.narration}
                              onChange={(e) =>
                                onUpdateGenerated(genIndex, {
                                  narration: e.target.value,
                                })
                              }
                              rows={3}
                              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground/85 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
                              placeholder="Narration text for this slide..."
                            />
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
