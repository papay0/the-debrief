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

interface SearchPost {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

export function SearchCommand({ posts }: { posts: SearchPost[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);

    // Allow header search button to open dialog
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
    router.push(`/posts/${slug}`);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search articles"
      description="Search for articles by title, description, or tags"
    >
      <CommandInput placeholder="Search articles..." />
      <CommandList>
        <CommandEmpty>No articles found.</CommandEmpty>
        <CommandGroup heading="Articles">
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
