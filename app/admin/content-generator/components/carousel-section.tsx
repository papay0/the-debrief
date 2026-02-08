"use client";

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
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { SlidePreview, CarouselSlidePreview } from "./slide-preview";
import type { SlideData } from "./slide-renderer";

export function CarouselSection({
  slides,
  exporting,
  onFullscreen,
  onRegenerate,
  onDownloadAll,
  onDownloadSlide,
}: {
  slides: SlideData[];
  exporting: boolean;
  onFullscreen: () => void;
  onRegenerate: () => void;
  onDownloadAll: () => void;
  onDownloadSlide: (index: number) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Carousel Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-serif text-foreground">
            Carousel Preview
          </h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={onFullscreen}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Fullscreen
            </Button>
            <Button
              onClick={onRegenerate}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button
              onClick={onDownloadAll}
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

      {/* All Slides Grid */}
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
              onDownload={onDownloadSlide}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
