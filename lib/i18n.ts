export type Locale = "en" | "fr";

export const locales: Locale[] = ["en", "fr"];
export const defaultLocale: Locale = "en";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Header
    "site.tagline": "AI news, explained simply.",
    "site.search": "Search",

    // Meta
    "meta.title": "The Debrief — AI News, Explained Simply",
    "meta.description": "AI news, explained simply. Breaking down the latest in artificial intelligence so anyone can understand.",
    "meta.og.title": "The Debrief",
    "meta.og.description": "AI news, explained simply.",

    // Search
    "search.title": "Search articles",
    "search.description": "Search for articles by title, description, or tags",
    "search.placeholder": "Search articles...",
    "search.empty": "No articles found.",
    "search.group": "Articles",

    // Posts
    "posts.back": "Back to all posts",
    "posts.noArticles": "No articles found.",
    "posts.readingTime": "{time}",

    // Tags
    "tags.all": "All",
    "tags.article": "article",
    "tags.articles": "articles",
    "tags.clear": "Clear",
    "tags.postsTagged": 'Posts tagged "{tag}"',
    "tags.postsTaggedDesc": "All articles about {tag} on The Debrief.",

    // Ask ChatGPT
    "ask.placeholder": "Ask ChatGPT a follow-up question...",

    // 404
    "notFound.title": "Page not found",
    "notFound.description": "The page you're looking for doesn't exist or has been moved. Let's get you back to the latest AI news.",
    "notFound.button": "Back to homepage",

    // Language
    "lang.switchLabel": "Lire en français",
    "lang.switchText": "FR",
  },
  fr: {
    // Header
    "site.tagline": "L'actu IA, en toute simplicité.",
    "site.search": "Rechercher",

    // Meta
    "meta.title": "The Debrief — L'actu IA, en toute simplicité",
    "meta.description": "L'actu IA, en toute simplicité. On décrypte les dernières avancées en intelligence artificielle pour que tout le monde puisse comprendre.",
    "meta.og.title": "The Debrief",
    "meta.og.description": "L'actu IA, en toute simplicité.",

    // Search
    "search.title": "Rechercher des articles",
    "search.description": "Rechercher des articles par titre, description ou tags",
    "search.placeholder": "Rechercher des articles...",
    "search.empty": "Aucun article trouvé.",
    "search.group": "Articles",

    // Posts
    "posts.back": "Retour aux articles",
    "posts.noArticles": "Aucun article trouvé.",
    "posts.readingTime": "{time} de lecture",

    // Tags
    "tags.all": "Tous",
    "tags.article": "article",
    "tags.articles": "articles",
    "tags.clear": "Effacer",
    "tags.postsTagged": 'Articles tagués « {tag} »',
    "tags.postsTaggedDesc": "Tous les articles sur {tag} sur The Debrief.",

    // Ask ChatGPT
    "ask.placeholder": "Posez une question de suivi à ChatGPT...",

    // 404
    "notFound.title": "Page introuvable",
    "notFound.description": "La page que vous cherchez n'existe pas ou a été déplacée. Retournons aux dernières nouvelles IA.",
    "notFound.button": "Retour à l'accueil",

    // Language
    "lang.switchLabel": "Read in English",
    "lang.switchText": "EN",
  },
};

export function t(locale: Locale, key: string, params?: Record<string, string>): string {
  let value = translations[locale]?.[key] ?? translations.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, v);
    }
  }
  return value;
}

export function localePath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizeReadingTime(readingTime: string, locale: Locale): string {
  if (locale === "en") return readingTime;
  // "3 min read" -> "3 min de lecture"
  const match = readingTime.match(/^(\d+)\s*min\s*read$/);
  if (match) {
    return t(locale, "posts.readingTime", { time: `${match[1]} min` });
  }
  return readingTime;
}
