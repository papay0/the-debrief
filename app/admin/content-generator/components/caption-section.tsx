"use client";

import { MessageSquare, Hash } from "lucide-react";
import { CopyButton } from "./copy-button";

export function CaptionSection({
  caption,
  hashtags,
  onCaptionChange,
  onHashtagsChange,
}: {
  caption: string;
  hashtags: string;
  onCaptionChange: (text: string) => void;
  onHashtagsChange: (text: string) => void;
}) {
  return (
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
          onChange={(e) => onCaptionChange(e.target.value)}
          rows={8}
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
          onChange={(e) => onHashtagsChange(e.target.value)}
          rows={3}
          className="w-full text-primary text-sm leading-relaxed bg-muted/30 border border-border rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
          placeholder="#hashtags..."
        />
      </div>
    </section>
  );
}
