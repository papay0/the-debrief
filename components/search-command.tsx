"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface SearchPost {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

const translations = {
  en: {
    placeholder: "What are you looking for?",
    empty: "No articles match your search.",
    hint: "Try a different keyword or browse the homepage.",
    close: "Close",
  },
  fr: {
    placeholder: "Que recherchez-vous ?",
    empty: "Aucun article ne correspond.",
    hint: "Essayez un autre mot-clé ou parcourez la page d'accueil.",
    close: "Fermer",
  },
};

export function SearchCommand({
  posts,
  locale,
}: {
  posts: SearchPost[];
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const strings = translations[locale];

  const filtered = query.trim()
    ? posts.filter((post) => {
        const q = query.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.description.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
    : posts;

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const handleSelect = useCallback(
    (slug: string) => {
      handleClose();
      const path =
        locale === "en" ? `/posts/${slug}` : `/${locale}/posts/${slug}`;
      router.push(path);
    },
    [locale, router, handleClose]
  );

  // Keyboard shortcut to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
        if (!open) {
          setQuery("");
          setSelectedIndex(0);
        }
      }
    };
    document.addEventListener("keydown", down);

    const handleClick = () => handleOpen();
    const trigger = document.querySelector("[data-search-trigger]");
    trigger?.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", down);
      trigger?.removeEventListener("click", handleClick);
    };
  }, [open, handleOpen]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClose]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex].slug);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/8 backdrop-blur-md" />

      {/* Centered search panel */}
      <div className="relative h-full flex items-center justify-center px-4">
        <div ref={panelRef} className="w-full max-w-lg">
          {/* Unified card */}
          <div className="rounded-xl bg-background shadow-2xl shadow-foreground/8 overflow-hidden ring-1 ring-border">
            {/* Input area */}
            <div className="flex items-center gap-3 px-5 h-14 border-b border-border/60">
              <Search className="w-[18px] h-[18px] text-muted-foreground/70 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={strings.placeholder}
                className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              <button
                onClick={handleClose}
                className="shrink-0 p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            {filtered.length > 0 ? (
              <div className="max-h-[48vh] overflow-y-auto py-1.5">
                {filtered.map((post, i) => (
                  <button
                    key={post.slug}
                    onClick={() => handleSelect(post.slug)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full text-left px-5 py-3.5 flex items-center gap-3 transition-colors duration-100 cursor-pointer ${
                      i === selectedIndex
                        ? "bg-primary/[0.07]"
                        : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-semibold text-[15px] text-foreground leading-snug truncate">
                        {post.title}
                      </div>
                      <div className="text-[13px] text-muted-foreground mt-0.5 truncate">
                        {post.description}
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-3.5 h-3.5 shrink-0 transition-all duration-150 ${
                        i === selectedIndex
                          ? "text-primary opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="px-5 py-10 text-center">
                <p className="text-muted-foreground text-sm">
                  {strings.empty}
                </p>
                <p className="text-muted-foreground/50 text-xs mt-1">
                  {strings.hint}
                </p>
              </div>
            ) : null}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-2.5 border-t border-border/40 text-[11px] text-muted-foreground/50">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-px rounded bg-muted/60 font-mono text-[10px]">
                  &uarr;&darr;
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-px rounded bg-muted/60 font-mono text-[10px]">
                  &crarr;
                </kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-px rounded bg-muted/60 font-mono text-[10px]">
                  esc
                </kbd>
                close
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
