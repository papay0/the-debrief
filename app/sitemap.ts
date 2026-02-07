import { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thedebrief.ai";
  const posts = getAllPosts();
  const tags = getAllTags();

  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tagEntries = tags.map((tag) => ({
    url: `${baseUrl}/tags/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...postEntries,
    ...tagEntries,
  ];
}
