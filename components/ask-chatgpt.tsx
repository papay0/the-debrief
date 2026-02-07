"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { SITE_URL } from "@/lib/config";

export function AskChatGPT({ slug }: { slug: string }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [placeholderWidth, setPlaceholderWidth] = useState(0);

  // Measure the placeholder text width on mount to size the collapsed state perfectly
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx && inputRef.current) {
      const style = window.getComputedStyle(inputRef.current);
      ctx.font = `${style.fontSize} ${style.fontFamily}`;
      const measured = ctx.measureText("Ask ChatGPT a follow-up question...");
      // placeholder width + button (28px) + gaps/padding (48px) + breathing room (24px)
      setPlaceholderWidth(Math.ceil(measured.width) + 100);
    }
  }, []);

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
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-[max-width] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        expanded
          ? "w-[calc(100%-2rem)] max-w-xl"
          : "w-[calc(100%-2rem)]"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full bg-secondary/95 backdrop-blur border border-border/50 shadow-lg px-5 py-2.5 cursor-text"
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
          placeholder="Ask ChatGPT a follow-up question..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-opacity disabled:opacity-30"
          aria-label="Send question to ChatGPT"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
