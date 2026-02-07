import { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { SITE_URL } from "@/lib/config";
import { locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: locale === "en" ? baseUrl : `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  }

  // Posts for each locale
  for (const locale of locales) {
    const posts = getAllPosts(false, locale as Locale);
    for (const post of posts) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}/posts/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  // Tags for each locale
  for (const locale of locales) {
    const tags = getAllTags(false, locale as Locale);
    for (const tag of tags) {
      const prefix = locale === "en" ? "" : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}/tags/${tag}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
