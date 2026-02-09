"use client";

import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Eye, TrendingUp, FileText, Globe } from "lucide-react";

type CountRow = {
  slug: string;
  locale: string;
  page_type: string;
  view_count: number;
};

type DailyRow = { date: string; views: number };

type ArticleDailyRow = {
  slug: string;
  locale: string;
  days: { date: string; views: number }[];
};

type AnalyticsData = {
  counts: CountRow[];
  daily: DailyRow[];
  articleDaily: ArticleDailyRow[];
};

type Period = "7d" | "30d" | "all";

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "all", label: "All time" },
];

const LOCALE_COLORS: Record<string, string> = {
  en: "hsl(var(--primary))",
  fr: "hsl(220, 70%, 55%)",
};

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  fr: "FR",
};

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<Period>("30d");
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period]);

  // Aggregate counts per article across locales
  const articleStats = useMemo(() => {
    if (!data) return [];
    const map = new Map<
      string,
      {
        slug: string;
        pageType: string;
        total: number;
        locales: { locale: string; count: number }[];
      }
    >();
    for (const row of data.counts) {
      const key = `${row.slug}::${row.page_type}`;
      if (!map.has(key)) {
        map.set(key, {
          slug: row.slug,
          pageType: row.page_type,
          total: 0,
          locales: [],
        });
      }
      const entry = map.get(key)!;
      entry.total += row.view_count;
      entry.locales.push({ locale: row.locale, count: row.view_count });
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [data]);

  const totalViews = useMemo(
    () => articleStats.reduce((sum, a) => sum + a.total, 0),
    [articleStats]
  );

  const todayViews = useMemo(() => {
    if (!data) return 0;
    const today = new Date().toISOString().slice(0, 10);
    return data.daily.find((d) => d.date === today)?.views ?? 0;
  }, [data]);

  const topArticle = useMemo(
    () => (articleStats.length > 0 ? articleStats[0] : null),
    [articleStats]
  );

  // Per-language totals
  const languageTotals = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, number>();
    for (const row of data.counts) {
      map.set(row.locale, (map.get(row.locale) ?? 0) + row.view_count);
    }
    return Array.from(map.entries())
      .map(([locale, views]) => ({ locale, views }))
      .sort((a, b) => b.views - a.views);
  }, [data]);

  // Selected article daily data
  const selectedArticleDaily = useMemo(() => {
    if (!selectedArticle || !data) return null;
    return data.articleDaily.filter((a) => a.slug === selectedArticle);
  }, [selectedArticle, data]);

  // Merge selected article daily data for chart (per locale lines)
  const selectedArticleChartData = useMemo(() => {
    if (!selectedArticleDaily) return [];
    const dayMap = new Map<string, Record<string, number>>();
    for (const entry of selectedArticleDaily) {
      for (const day of entry.days) {
        if (!dayMap.has(day.date)) dayMap.set(day.date, {});
        dayMap.get(day.date)![entry.locale] = day.views;
      }
    }
    return Array.from(dayMap.entries())
      .map(([date, locales]) => ({ date, ...locales }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedArticleDaily]);

  const localesInSelection = useMemo(() => {
    if (!selectedArticleDaily) return [];
    return [...new Set(selectedArticleDaily.map((a) => a.locale))];
  }, [selectedArticleDaily]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-muted-foreground text-center py-20">
        Failed to load analytics data.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period selector */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
              period === p.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Eye className="w-4 h-4" />}
          label="Total views"
          value={totalViews.toLocaleString()}
        />
        <SummaryCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Today"
          value={todayViews.toLocaleString()}
        />
        <SummaryCard
          icon={<FileText className="w-4 h-4" />}
          label="Top article"
          value={topArticle ? formatSlug(topArticle.slug) : "—"}
          sub={topArticle ? `${topArticle.total.toLocaleString()} views` : undefined}
        />
        <SummaryCard
          icon={<Globe className="w-4 h-4" />}
          label="Languages"
          value={languageTotals
            .map((l) => `${LOCALE_LABELS[l.locale] ?? l.locale}: ${l.views}`)
            .join(" / ")}
        />
      </div>

      {/* Daily views chart */}
      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-sm font-semibold mb-4">Daily views</h2>
        {data.daily.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No data yet for this period.
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(d) => d.slice(5)}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#viewsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Per-article breakdown */}
      <div className="rounded-xl border border-border bg-background p-6">
        <h2 className="text-sm font-semibold mb-4">Views by article</h2>
        {articleStats.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No data yet.
          </p>
        ) : (
          <div className="space-y-3">
            {articleStats.map((article) => {
              const isSelected = selectedArticle === article.slug;
              const maxViews = articleStats[0]?.total ?? 1;
              const pct = Math.round((article.total / maxViews) * 100);

              return (
                <div key={`${article.slug}::${article.pageType}`}>
                  <button
                    onClick={() =>
                      setSelectedArticle(isSelected ? null : article.slug)
                    }
                    className={`w-full text-left group rounded-lg p-3 transition-all ${
                      isSelected
                        ? "bg-muted/60 ring-1 ring-border"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {formatSlug(article.slug)}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium shrink-0">
                          {article.pageType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {article.locales.map((l) => (
                          <span
                            key={l.locale}
                            className="inline-flex items-center gap-1 text-xs"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background:
                                  LOCALE_COLORS[l.locale] ??
                                  "hsl(var(--muted-foreground))",
                              }}
                            />
                            <span className="text-muted-foreground font-medium">
                              {LOCALE_LABELS[l.locale] ?? l.locale}
                            </span>
                            <span className="font-semibold tabular-nums">
                              {l.count.toLocaleString()}
                            </span>
                          </span>
                        ))}
                        <span className="text-sm font-semibold tabular-nums ml-2">
                          {article.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: "hsl(var(--primary))",
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </button>

                  {/* Expanded per-article chart */}
                  {isSelected && selectedArticleChartData.length > 0 && (
                    <div className="mt-2 ml-3 mr-3 mb-1 p-4 rounded-lg bg-muted/30 border border-border/50">
                      <h3 className="text-xs font-medium text-muted-foreground mb-3">
                        Daily views for {formatSlug(article.slug)}
                      </h3>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={selectedArticleChartData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="hsl(var(--border))"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 10 }}
                              tickFormatter={(d) => d.slice(5)}
                              stroke="hsl(var(--muted-foreground))"
                            />
                            <YAxis
                              tick={{ fontSize: 10 }}
                              stroke="hsl(var(--muted-foreground))"
                              allowDecimals={false}
                            />
                            <Tooltip
                              contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                                fontSize: 11,
                              }}
                            />
                            {localesInSelection.map((locale) => (
                              <Bar
                                key={locale}
                                dataKey={locale}
                                stackId="views"
                                fill={
                                  LOCALE_COLORS[locale] ??
                                  "hsl(var(--muted-foreground))"
                                }
                                radius={[2, 2, 0, 0]}
                                name={LOCALE_LABELS[locale] ?? locale}
                              />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Language breakdown chart */}
      {languageTotals.length > 0 && (
        <div className="rounded-xl border border-border bg-background p-6">
          <h2 className="text-sm font-semibold mb-4">Views by language</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageTotals} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="locale"
                  tick={{ fontSize: 12, fontWeight: 600 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => LOCALE_LABELS[v] ?? v}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                  {languageTotals.map((entry) => (
                    <Cell
                      key={entry.locale}
                      fill={
                        LOCALE_COLORS[entry.locale] ??
                        "hsl(var(--muted-foreground))"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-lg font-semibold truncate">{value}</p>
      {sub && (
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      )}
    </div>
  );
}

function formatSlug(slug: string): string {
  if (slug === "_landing") return "Home page";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
