import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") ?? "30d";

  // Calculate date filter
  let fromDate: string | null = null;
  if (period === "7d") {
    fromDate = new Date(Date.now() - 7 * 86400000).toISOString();
  } else if (period === "30d") {
    fromDate = new Date(Date.now() - 30 * 86400000).toISOString();
  }

  // Totals from aggregated counts table
  const { data: counts } = await supabase
    .from("page_view_counts")
    .select("slug, locale, page_type, view_count")
    .order("view_count", { ascending: false });

  // Daily breakdown from raw events
  let dailyQuery = supabase
    .from("page_views")
    .select("slug, locale, page_type, created_at");

  if (fromDate) {
    dailyQuery = dailyQuery.gte("created_at", fromDate);
  }

  const { data: rawDaily } = await dailyQuery.order("created_at", {
    ascending: true,
  });

  // Aggregate daily counts in JS
  const dailyMap = new Map<string, number>();
  for (const row of rawDaily ?? []) {
    const day = row.created_at.slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }
  const daily = Array.from(dailyMap.entries()).map(([date, views]) => ({
    date,
    views,
  }));

  // Per-article daily breakdown for the detail view
  const articleDailyMap = new Map<string, Map<string, number>>();
  for (const row of rawDaily ?? []) {
    const key = `${row.slug}::${row.locale}`;
    const day = row.created_at.slice(0, 10);
    if (!articleDailyMap.has(key)) articleDailyMap.set(key, new Map());
    const dayMap = articleDailyMap.get(key)!;
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }
  const articleDaily = Array.from(articleDailyMap.entries()).map(
    ([key, dayMap]) => {
      const [slug, locale] = key.split("::");
      return {
        slug,
        locale,
        days: Array.from(dayMap.entries()).map(([date, views]) => ({
          date,
          views,
        })),
      };
    }
  );

  return NextResponse.json({ counts: counts ?? [], daily, articleDaily });
}
