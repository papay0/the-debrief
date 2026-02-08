"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { CarouselSlidePreview } from "./slide-preview";
import type { SlideData } from "./slide-renderer";

export function FullscreenCarousel({
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
