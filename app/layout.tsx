import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchCommand } from "@/components/search-command";
import { getAllPosts } from "@/lib/posts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thedebrief.ai"),
  title: {
    default: "The Debrief — AI News, Explained Simply",
    template: "%s | The Debrief",
  },
  description: "AI news, explained simply. Breaking down the latest in artificial intelligence so anyone can understand.",
  openGraph: {
    title: "The Debrief",
    description: "AI news, explained simply.",
    type: "website",
    locale: "en_US",
    siteName: "The Debrief",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "The Debrief — AI news, explained simply.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Debrief",
    description: "AI news, explained simply.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts();
  const searchPosts = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <SearchCommand posts={searchPosts} />
        </ThemeProvider>
      </body>
    </html>
  );
}
