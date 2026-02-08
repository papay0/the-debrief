"use client";

import { useRef, useState, useEffect } from "react";
import { Download } from "lucide-react";
import { SlideRenderer, type SlideData } from "./slide-renderer";

export function SlidePreview({
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

export function CarouselSlidePreview({ slide }: { slide: SlideData }) {
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

export function SlideEditorMiniPreview({ slide }: { slide: SlideData }) {
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
