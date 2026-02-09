"use client";

import { useEffect } from "react";

export function PageViewTracker({
  slug,
  locale,
  pageType,
}: {
  slug: string;
  locale: string;
  pageType: string;
}) {
  useEffect(() => {
    const TTL_MS = 30 * 60 * 1000; // 30 minutes
    const key = `pv:${locale}:${pageType}:${slug}`;

    const lastTracked = localStorage.getItem(key);
    if (lastTracked && Date.now() - Number(lastTracked) < TTL_MS) return;

    const body = JSON.stringify({ slug, locale, pageType });
    const sent = navigator.sendBeacon?.("/api/track", body);
    if (!sent) {
      fetch("/api/track", { method: "POST", body, keepalive: true }).catch(
        () => {}
      );
    }

    localStorage.setItem(key, String(Date.now()));
  }, [slug, locale, pageType]);

  return null;
}
