import type { Locale } from "@/i18n/config";

/**
 * Datasets that drive widgets rather than being page copy.
 *
 * These lived as literals inside the components that drew them, which meant a
 * revenue figure or a new brief channel needed a commit. They are managed in the
 * CMS now (Site copy → widgets); the values here are the shipped defaults and
 * the fallback whenever the CMS has nothing to say.
 */

export type AudienceChannel = { name: string; men: number; women: number };

/** Illustrative panel reach, not a live measurement feed. */
export const audienceChannels: AudienceChannel[] = [
  { name: "Facebook", men: 24, women: 57 },
  { name: "Instagram", men: 41, women: 83 },
  { name: "TikTok", men: 35, women: 61 },
  { name: "Jodel", men: 22, women: 17 },
  { name: "Snapchat", men: 30, women: 77 },
  { name: "Pinterest", men: 8, women: 25 },
  { name: "LinkedIn", men: 12, women: 15 },
  { name: "Telegram", men: 21, women: 12 },
  { name: "Twitter", men: 16, women: 20 },
  { name: "YouTube", men: 40, women: 60 },
  { name: "Reddit", men: 14, women: 24 },
  { name: "Discord", men: 18, women: 12 },
  { name: "BeReal", men: 6, women: 16 },
  { name: "OnlyFans", men: 5, women: 8 },
  { name: "Threads", men: 9, women: 11 },
];

export type DashboardKpi = {
  key: string;
  value: number;
  decimals?: number;
  suffix?: string;
  delta?: number;
  deltaDecimals?: number;
  deltaSuffix?: string;
  color?: string;
};

export type DashboardData = {
  kpis: DashboardKpi[];
  campaigns: { tags: string[]; pct: number }[];
  trend: number[];
};

export const dashboardData: DashboardData = {
  kpis: [
    { key: "campaigns", value: 24, decimals: 0, suffix: "", delta: 3, color: "text-accent-green" },
    { key: "impressions", value: 2.4, decimals: 1, suffix: " M", delta: 18, deltaSuffix: " %", color: "text-accent-blue" },
    { key: "ctr", value: 14.2, decimals: 1, suffix: " %", delta: 2.1, deltaDecimals: 1, color: "text-accent-pink" },
    { key: "conversions", value: 847, decimals: 0, suffix: "", delta: 64, color: "text-accent-orange" },
    { key: "spend", value: 12.4, decimals: 1, suffix: " k€", delta: 9, deltaSuffix: " %", color: "text-yellow" },
  ],
  campaigns: [
    { tags: ["Meta", "Display", "PDOOH"], pct: 96.2 },
    { tags: ["Meta", "Display"], pct: 78.8 },
    { tags: ["Meta", "PDOOH"], pct: 72.4 },
    { tags: ["Display", "PDOOH"], pct: 58.1 },
  ],
  trend: [42, 68, 50, 82, 58, 96, 74],
};

export type CompanyStat = { value: number; suffix?: string; prefix?: string; decimals?: number; grouping?: boolean; label: string };

/**
 * The "In numbers" figures. The home and team pages each kept their own copy of
 * this list, so the two could disagree; both read the one dataset now.
 */
export const companyStats: Record<Locale, CompanyStat[]> = {
  fi: [
    { value: 360, suffix: "°", label: "Strategisesti aktiivinen insight- ja mediatoimisto" },
    { value: 2019, grouping: false, label: "Perustettu" },
    { value: 20, label: "Vakituista omaa työntekijää, kaikki kokeneita ja lähes kaikki partnereita" },
    { value: 83, label: "NPS 2026" },
    { value: 800, suffix: "+", label: "Ammattilaista tukena ympäri maailmaa" },
    // `decimals` matters here: StatGrid defaults to 0, so without it 15.5 renders
    // as "16 M€" and the site overstates the figure.
    { value: 15.5, decimals: 1, suffix: " M€", label: "Liikevaihtomme 2025" },
  ],
  en: [
    { value: 360, suffix: "°", label: "A strategically active insight and media agency" },
    { value: 2019, grouping: false, label: "Founded" },
    { value: 20, label: "Permanent employees — all experienced, nearly all partners" },
    { value: 83, label: "NPS 2026" },
    { value: 800, suffix: "+", label: "Professionals supporting us worldwide" },
    { value: 15.5, decimals: 1, suffix: " M€", label: "Our revenue 2025" },
  ],
};

export const briefChannels: Record<Locale, string[]> = {
  fi: [
    "TV", "Suomalaiset suoratoistopalvelut, video", "YouTube", "Perinteinen radio",
    "Digitaalinen audio; Spotify, podcastit, jne.", "Printtimainonta", "Display-mainonta",
    "Natiivimainonta", "Ulkomainonta", "Elokuvamainonta leffateattereissa",
    "Vaikuttajamainonta", "PR", "Hakukonemarkkinointi", "Applikaatiomainonta (Android, iOS)",
    "Facebook-mainonta", "Instagram-mainonta", "LinkedIn-mainonta", "Jodel-mainonta",
    "TikTok-mainonta", "Snapchat-mainonta", "Orgaaninen FB & IG",
  ],
  en: [
    "TV", "Finnish streaming services, video", "YouTube", "Traditional radio",
    "Digital audio; Spotify, podcasts, etc.", "Print advertising", "Display advertising",
    "Native advertising", "Out-of-home", "Cinema advertising",
    "Influencer marketing", "PR", "Search engine marketing", "App advertising (Android, iOS)",
    "Facebook advertising", "Instagram advertising", "LinkedIn advertising", "Jodel advertising",
    "TikTok advertising", "Snapchat advertising", "Organic FB & IG",
  ],
};

/**
 * Read one dataset out of the CMS bundle, per locale, falling back to the
 * shipped value when it is absent or the wrong shape. Arrays are checked for
 * length so an empty list in the CMS cannot blank a chart.
 */
export function dataset<T>(
  datasets: Record<string, { fi: unknown; en: unknown }> | undefined,
  key: string,
  locale: Locale,
  fallback: T
): T {
  const value = datasets?.[key]?.[locale];
  if (value == null) return fallback;
  if (Array.isArray(fallback)) {
    return Array.isArray(value) && value.length > 0 ? (value as T) : fallback;
  }
  return typeof value === "object" ? (value as T) : fallback;
}
