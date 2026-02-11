"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { SITE_URL } from "@/lib/config";
import type { Locale } from "@/lib/i18n";

const placeholders = {
  en: "Ask ChatGPT a follow-up question...",
  fr: "Posez une question de suivi à ChatGPT...",
};

export function AskChatGPT({ slug, locale }: { slug: string; locale: Locale }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [placeholderWidth, setPlaceholderWidth] = useState(0);
  const [ready, setReady] = useState(false);

  const placeholder = placeholders[locale];

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx && inputRef.current) {
      const style = window.getComputedStyle(inputRef.current);
      ctx.font = `${style.fontSize} ${style.fontFamily}`;
      const measured = ctx.measureText(placeholder);
      setPlaceholderWidth(Math.ceil(measured.width) + 100);
      setReady(true);
    }
  }, [placeholder]);

  // Hide when footer is in view
  const checkFooterVisibility = useCallback(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const footerRect = footer.getBoundingClientRect();
    // Hide when footer top is within viewport (with a small buffer)
    setHidden(footerRect.top < window.innerHeight - 20);
  }, []);

  useEffect(() => {
    checkFooterVisibility();
    window.addEventListener("scroll", checkFooterVisibility, { passive: true });
    window.addEventListener("resize", checkFooterVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkFooterVisibility);
      window.removeEventListener("resize", checkFooterVisibility);
    };
  }, [checkFooterVisibility]);

  useEffect(() => {
    if (!expanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !query.trim()
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const articleUrl = `${SITE_URL}/posts/${slug}`;
    const q = `${articleUrl} ${trimmed}`;
    const url = `https://chatgpt.com/?hints=search&q=${encodeURIComponent(q)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setQuery("");
    setExpanded(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setExpanded(true);
  };

  return (
    <div
      ref={containerRef}
      style={
        !expanded && placeholderWidth
          ? { maxWidth: `${placeholderWidth}px` }
          : undefined
      }
      className={`fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        expanded
          ? "w-[calc(100%-2rem)] max-w-xl"
          : "w-[calc(100%-2rem)]"
      } ${!ready ? "opacity-0 pointer-events-none" : hidden ? "translate-y-4 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}
    >
      <form
        onSubmit={handleSubmit}
        className="ask-chatgpt-pill flex items-center gap-2 rounded-full px-5 py-3 cursor-text transition-shadow duration-200"
        onClick={() => {
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-foreground dark:text-foreground placeholder:text-foreground/35 dark:placeholder:text-foreground/35 outline-none min-w-0"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-150 disabled:opacity-30 hover:bg-primary/85"
          aria-label="Send question to ChatGPT"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
