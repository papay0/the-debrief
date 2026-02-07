"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import type { Locale } from "@/lib/i18n";

interface SearchPost {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

const translations = {
  en: {
    title: "Search articles",
    description: "Search for articles by title, description, or tags",
    placeholder: "Search articles...",
    empty: "No articles found.",
    group: "Articles",
  },
  fr: {
    title: "Rechercher des articles",
    description: "Rechercher des articles par titre, description ou tags",
    placeholder: "Rechercher des articles...",
    empty: "Aucun article trouvé.",
    group: "Articles",
  },
};

export function SearchCommand({ posts, locale }: { posts: SearchPost[]; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const strings = translations[locale];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);

    const handleClick = () => setOpen(true);
    const trigger = document.querySelector("[data-search-trigger]");
    trigger?.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", down);
      trigger?.removeEventListener("click", handleClick);
    };
  }, []);

  const handleSelect = (slug: string) => {
    setOpen(false);
    const path = locale === "en" ? `/posts/${slug}` : `/${locale}/posts/${slug}`;
    router.push(path);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={strings.title}
      description={strings.description}
    >
      <CommandInput placeholder={strings.placeholder} />
      <CommandList>
        <CommandEmpty>{strings.empty}</CommandEmpty>
        <CommandGroup heading={strings.group}>
          {posts.map((post) => (
            <CommandItem
              key={post.slug}
              value={`${post.title} ${post.description} ${post.tags.join(" ")}`}
              onSelect={() => handleSelect(post.slug)}
              className="cursor-pointer"
            >
              <FileText className="h-4 w-4 shrink-0" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="font-medium truncate">{post.title}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {post.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
