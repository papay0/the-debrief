"use client";

import {
  Film,
  Images,
  BookOpen,
  MessageCircle,
  Share2,
  ClipboardList,
} from "lucide-react";
import { CopyButton } from "./copy-button";

export interface PostingStep {
  step: number;
  title: string;
  when: string;
  platform: "reel" | "carousel" | "story" | "engagement" | "cross-promo";
  instructions: string[];
  copyText?: string;
}

const platformConfig = {
  reel: { icon: Film, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20", label: "Reel" },
  carousel: { icon: Images, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", label: "Carousel" },
  story: { icon: BookOpen, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", label: "Story" },
  engagement: { icon: MessageCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", label: "Engagement" },
  "cross-promo": { icon: Share2, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", label: "Cross-Promo" },
};

export function PostingStrategySection({
  steps,
}: {
  steps: PostingStep[];
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-5">
        <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
        <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
          Posting Strategy
        </h2>
        <span className="text-[10px] text-muted-foreground/50 tabular-nums">
          {steps.length} steps
        </span>
      </div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border" />

        <div className="space-y-4">
          {steps.map((step, i) => {
            const config = platformConfig[step.platform];
            const Icon = config.icon;
            const isLast = i === steps.length - 1;

            return (
              <div key={step.step} className="relative flex gap-4">
                {/* Step circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-[31px] h-[31px] rounded-full ${config.bg} ${config.border} border flex items-center justify-center`}
                  >
                    <span className={`text-xs font-semibold ${config.color}`}>
                      {step.step}
                    </span>
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-lg bg-background border border-border p-4 hover:border-foreground/20 transition-colors ${
                    isLast ? "" : ""
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-medium text-foreground">
                        {step.title}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color} ${config.border} border`}
                      >
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Timing */}
                  <p className="text-xs text-muted-foreground mb-3">
                    {step.when}
                  </p>

                  {/* Instructions */}
                  <ol className="space-y-1.5 mb-3">
                    {step.instructions.map((instruction, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-sm text-foreground/80 leading-relaxed"
                      >
                        <span className="text-muted-foreground/50 text-xs mt-0.5 flex-shrink-0">
                          {j + 1}.
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ol>

                  {/* Copy-paste block */}
                  {step.copyText && (
                    <div className="rounded-md bg-muted/40 border border-border p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                          Copy-paste text
                        </span>
                        <CopyButton text={step.copyText} />
                      </div>
                      <p className="text-sm text-foreground/70 whitespace-pre-wrap leading-relaxed">
                        {step.copyText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
