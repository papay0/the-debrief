import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchCommand } from "@/components/search-command";
import { getAllPosts } from "@/lib/posts";
import { locales, isValidLocale, t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isValidLocale(localeParam) ? localeParam : "en") as Locale;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t(locale, "meta.title"),
      template: "%s | The Debrief",
    },
    description: t(locale, "meta.description"),
    openGraph: {
      title: t(locale, "meta.og.title"),
      description: t(locale, "meta.og.description"),
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: "The Debrief",
      images: [
        {
          url: "/api/og",
          width: 1200,
          height: 630,
          alt: t(locale, "meta.og.description"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t(locale, "meta.og.title"),
      description: t(locale, "meta.og.description"),
      images: ["/api/og"],
    },
    alternates: {
      languages: {
        en: SITE_URL,
        fr: `${SITE_URL}/fr`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const posts = getAllPosts(false, locale);
  const searchPosts = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
  }));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative min-h-screen flex flex-col">
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} />
      </div>
      <SearchCommand posts={searchPosts} locale={locale} />
    </ThemeProvider>
  );
}
