import { dictionaries, type Dictionary } from "@/content/dictionary";
import { serviceCards, clients, valuePills, mediaPills, type ServiceCard } from "@/content/services";
import { cases as staticCases, type CaseStudy } from "@/content/cases";
import { insights as staticInsights, type Insight } from "@/content/insights";
import { team as staticTeam, houseBio as staticHouseBio, openRoles as staticOpenRoles, type TeamMember, type OpenRole } from "@/content/team";
import { channels as staticChannels, mediaGroups as staticMediaGroups, type Channel } from "@/content/channels";
import type { Locale } from "@/i18n/config";
import type { Block } from "@/content/blocks";

/**
 * The site's content layer.
 *
 * Copy and collections live in the NØRR3 CMS. This module fetches them, merges
 * them over the bundled `src/content/*` modules and hands the result to the
 * pages in exactly the shape those modules already exported — so a page reads
 * `dict.home.heroLeft` or `cases[0].metrics` without caring where it came from.
 *
 * Two properties matter more than freshness here:
 *
 *  1. **The site never goes dark.** If the CMS is down, mid-deploy, or returns
 *     something malformed, every accessor falls back to the committed content.
 *     A marketing site that 500s because a sidecar service restarted is worse
 *     than one showing yesterday's copy.
 *
 *  2. **Missing keys can't crash a render.** The CMS payload is merged *over*
 *     the static dictionary rather than replacing it, so a key an editor has not
 *     filled in resolves to the committed string instead of `undefined`.
 */

const CMS_URL = (process.env.NORR3_CMS_URL || "http://127.0.0.1:3848").replace(/\/+$/, "");

/** Cache tags the CMS invalidates through /api/revalidate after a publish. */
export const CMS_TAGS = {
  all: "cms",
  dictionary: "cms:dictionary",
  pages: "cms:pages",
  posts: "cms:posts",
  services: "cms:services",
  cases: "cms:cases",
  team: "cms:team",
  channels: "cms:channels",
  careers: "cms:careers",
  chrome: "cms:chrome",
  media: "cms:media",
} as const;

const ALL_TAGS = Object.values(CMS_TAGS);

/* ------------------------------------------------------------------- types */

export type CmsPost = Insight & {
  category: string;
  tags: string[];
  author: string;
  featured: boolean;
  readingMinutes: number;
  isoDate: string;
  seo: Record<Locale, { title: string; description: string }>;
  fi: Insight["fi"] & { html: string };
  en: Insight["en"] & { html: string };
};

export type CmsNavItem = { label: Record<Locale, string>; href: string; icon: string };

export type CmsCta = {
  label: Record<Locale, string>;
  href: string;
  placement: string;
  variant: "primary" | "secondary" | "text";
};

export type CmsAnnouncement = {
  message: Record<Locale, string>;
  href: string;
  label: Record<Locale, string>;
} | null;

export type CmsCareer = {
  id: string;
  type: string;
  title: Record<Locale, string>;
  location: Record<Locale, string>;
  description: Record<Locale, string>;
  requirements: Record<Locale, string[]>;
};

export type MotionSettings = {
  enabled: boolean;
  reveal: { distance: number; duration: number; stagger: number; margin: number };
  hoverLift: number;
  marquee: { logos: number; pills: number; team: number };
  routeWipe: boolean;
};

/**
 * What the site animates with when the CMS has nothing to say. These are the
 * values the components were written with, so a fallback render is the design.
 */
export const MOTION_DEFAULTS: MotionSettings = {
  enabled: true,
  reveal: { distance: 24, duration: 0.55, stagger: 0.08, margin: 80 },
  hoverLift: 6,
  marquee: { logos: 55, pills: 40, team: 60 },
  routeWipe: true,
};

/**
 * One hero variant, as configured in the CMS.
 *
 * `images` and `config` are intentionally loose: the six variants draw quite
 * different things (the city skyline layers four parallax plates, the card stack
 * wants an orientation per card), and forcing them into one shape would mean
 * mostly-empty fields. Each hero component reads the keys it understands and
 * falls back to its built-in defaults for anything absent.
 */
export type CmsHero = {
  key: string;
  variant: string;
  label: string;
  enabled: boolean;
  weight: number;
  eyebrow: Record<Locale, string>;
  headline: Record<Locale, string>;
  words: Record<Locale, string[]>;
  body: Record<Locale, string>;
  cta: { label: Record<Locale, string>; href: string };
  images: HeroImage[];
  config: Record<string, unknown>;
};

export type HeroImage = {
  src: string;
  alt_fi?: string;
  alt_en?: string;
  [key: string]: unknown;
};

export type CmsPageSummary = {
  slug: string;
  title: Record<Locale, string>;
  navLabel: Record<Locale, string>;
  updatedAt: string;
};

export type SiteContent = {
  source: "cms" | "fallback";
  generatedAt: string;
  error?: string;
  dictionaries: Record<Locale, Dictionary>;
  services: ServiceCard[];
  cases: CaseStudy[];
  posts: CmsPost[];
  team: TeamMember[];
  houseBio: { fi: string; en: string };
  openRoles: OpenRole[];
  careers: CmsCareer[];
  channels: Channel[];
  mediaGroups: { id: string; icon: string; fi: string; en: string }[];
  nav: { header: CmsNavItem[]; footerJoin: CmsNavItem[]; footerLegal: CmsNavItem[] };
  ctas: CmsCta[];
  announcement: CmsAnnouncement;
  pages: CmsPageSummary[];
  heroes: CmsHero[];
  /** Widget datasets — chart channels, dashboard figures, company stats, brief channels. */
  datasets: Record<string, { fi: unknown; en: unknown }>;
  /** Named section-image slots on the hand-built pages, keyed by slot. */
  imageSlots: Record<string, { src: string; alt: Record<Locale, string>; caption: Record<Locale, string> }>;
  /** SEO the CMS owns for the hand-built routes, keyed by slug ("home" for /). */
  pageSeo: Record<string, { title: Record<Locale, string>; description: Record<Locale, string>; ogImage: string }>;
  /** Design-token overrides, emitted as CSS custom properties by the root layout. */
  theme: { root: Record<string, string>; dark: Record<string, string> };
  motion: MotionSettings;
  brand: {
    clients: string[];
    valuePills: { id: string; icon: string; fi: string; en: string }[];
    mediaPills: { id: string; icon: string; fi: string; en: string }[];
  };
  mediaAlt: Record<string, { fi: string; en: string }>;
  site: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    defaultLocale: Locale;
    ai: { enabled: boolean; url: string; model: string };
  };
};

/* ------------------------------------------------------------------ fallback */

/** Committed content, shaped like a CMS response. Used when the CMS is away. */
function fallbackContent(error?: string): SiteContent {
  return {
    source: "fallback",
    generatedAt: new Date(0).toISOString(),
    error,
    dictionaries,
    services: serviceCards,
    cases: staticCases,
    posts: staticInsights.map(toFallbackPost),
    team: staticTeam,
    houseBio: staticHouseBio,
    openRoles: staticOpenRoles,
    careers: staticOpenRoles.map((role) => ({
      id: role.id,
      type: "full-time",
      title: role.title,
      location: role.location,
      description: { fi: "", en: "" },
      requirements: { fi: [], en: [] },
    })),
    channels: staticChannels,
    mediaGroups: staticMediaGroups,
    nav: {
      header: (["services", "engine", "cases", "insights", "contact", "about", "careers"] as const).map((key) => ({
        label: { fi: dictionaries.fi.nav[key], en: dictionaries.en.nav[key] },
        href: `/${key}`,
        icon: "",
      })),
      footerJoin: dictionaries.fi.footer.joinLinks.map((link, i) => ({
        label: { fi: link.label, en: dictionaries.en.footer.joinLinks[i]?.label ?? link.label },
        href: link.path.startsWith("/") ? link.path : `/${link.path}`,
        icon: "",
      })),
      footerLegal: [
        { label: { fi: dictionaries.fi.footer.privacy, en: dictionaries.en.footer.privacy }, href: "/privacy", icon: "" },
        { label: { fi: dictionaries.fi.footer.terms, en: dictionaries.en.footer.terms }, href: "/terms", icon: "" },
      ],
    },
    ctas: [
      { label: { fi: dictionaries.fi.common.briefUs, en: dictionaries.en.common.briefUs }, href: "/brief", placement: "header", variant: "secondary" },
      { label: { fi: dictionaries.fi.common.contactUs, en: dictionaries.en.common.contactUs }, href: "/contact", placement: "header", variant: "primary" },
    ],
    announcement: {
      message: { fi: dictionaries.fi.announcement.message, en: dictionaries.en.announcement.message },
      href: "/engine",
      label: { fi: "", en: "" },
    },
    pages: [],
    // No hero rows means the components use their own built-in content, which is
    // what the site shipped before heroes became editable.
    heroes: [],
    datasets: {},
    imageSlots: {},
    pageSeo: {},
    theme: { root: {}, dark: {} },
    motion: MOTION_DEFAULTS,
    brand: { clients, valuePills, mediaPills },
    mediaAlt: {},
    site: {
      name: "NØRR3",
      email: "info@norr3.fi",
      phone: dictionaries.fi.footer.phone,
      linkedin: "https://www.linkedin.com/company/norr3",
      defaultLocale: "fi",
      ai: {
        enabled: true,
        url: process.env.NORR3_AI_URL || "http://localhost:11434/v1/chat/completions",
        model: process.env.NORR3_AI_MODEL || "glm-5.2:cloud",
      },
    },
  };
}

function toFallbackPost(post: Insight): CmsPost {
  const html = (paragraphs: string[]) => paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
  const minutes = (paragraphs: string[]) =>
    Math.max(1, Math.round(paragraphs.join(" ").split(/\s+/).filter(Boolean).length / 200));
  return {
    ...post,
    category: "insights",
    tags: [],
    author: "NØRR3",
    featured: false,
    readingMinutes: minutes(post.en.body),
    isoDate: isoFromFinnish(post.date),
    seo: {
      fi: { title: "", description: post.fi.excerpt },
      en: { title: "", description: post.en.excerpt },
    },
    fi: { ...post.fi, html: html(post.fi.body) },
    en: { ...post.en, html: html(post.en.body) },
  };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** "25.8.2026" -> "2026-08-25" */
function isoFromFinnish(value: string): string {
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value.trim());
  if (!match) return value;
  return `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

/* --------------------------------------------------------------------- fetch */

type RawBundle = {
  generatedAt?: string;
  dictionary?: Record<string, unknown>;
  services?: unknown[];
  cases?: unknown[];
  insights?: unknown[];
  team?: unknown[];
  houseBio?: { fi: string; en: string };
  openRoles?: unknown[];
  careers?: unknown[];
  channels?: unknown[];
  mediaGroups?: unknown[];
  nav?: { header?: unknown[]; footerJoin?: unknown[]; footerLegal?: unknown[] };
  ctas?: unknown[];
  announcement?: unknown;
  pages?: unknown[];
  heroes?: unknown[];
  datasets?: Record<string, { fi: unknown; en: unknown }>;
  imageSlots?: SiteContent["imageSlots"];
  pageSeo?: SiteContent["pageSeo"];
  theme?: { root?: Record<string, string>; dark?: Record<string, string> };
  motion?: Partial<MotionSettings>;
  brand?: Partial<SiteContent["brand"]>;
  media?: Record<string, { fi: string; en: string }>;
  site?: Partial<SiteContent["site"]>;
};

/**
 * Fetch and normalise the CMS bundle.
 *
 * Revalidation is time-based as a safety net (five minutes) and tag-based for
 * immediacy: the CMS calls `/api/revalidate` on publish, which drops these tags.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const fallback = fallbackContent();
  try {
    const res = await fetch(`${CMS_URL}/api/public/site`, {
      next: { revalidate: 300, tags: ALL_TAGS },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return fallbackContent(`CMS replied ${res.status}`);
    const raw = (await res.json()) as RawBundle;
    return merge(raw, fallback);
  } catch (error) {
    return fallbackContent(error instanceof Error ? error.message : "CMS unreachable");
  }
}

function merge(raw: RawBundle, fallback: SiteContent): SiteContent {
  const dictionary = raw.dictionary as Record<Locale, unknown> | undefined;
  return {
    source: "cms",
    generatedAt: raw.generatedAt ?? new Date().toISOString(),
    dictionaries: {
      fi: deepMerge(dictionaries.fi, dictionary?.fi) as Dictionary,
      en: deepMerge(dictionaries.en, dictionary?.en) as Dictionary,
    },
    services: nonEmpty(raw.services, fallback.services) as ServiceCard[],
    cases: nonEmpty(raw.cases, fallback.cases) as CaseStudy[],
    posts: nonEmpty(raw.insights, fallback.posts) as CmsPost[],
    team: nonEmpty(raw.team, fallback.team) as TeamMember[],
    houseBio: raw.houseBio?.fi ? raw.houseBio : fallback.houseBio,
    openRoles: nonEmpty(raw.openRoles, fallback.openRoles) as OpenRole[],
    careers: nonEmpty(raw.careers, fallback.careers) as CmsCareer[],
    channels: nonEmpty(raw.channels, fallback.channels) as Channel[],
    mediaGroups: nonEmpty(raw.mediaGroups, fallback.mediaGroups) as SiteContent["mediaGroups"],
    nav: {
      header: nonEmpty(raw.nav?.header, fallback.nav.header) as CmsNavItem[],
      footerJoin: nonEmpty(raw.nav?.footerJoin, fallback.nav.footerJoin) as CmsNavItem[],
      footerLegal: nonEmpty(raw.nav?.footerLegal, fallback.nav.footerLegal) as CmsNavItem[],
    },
    ctas: nonEmpty(raw.ctas, fallback.ctas) as CmsCta[],
    announcement: (raw.announcement as CmsAnnouncement) ?? null,
    pages: (raw.pages ?? []) as CmsPageSummary[],
    heroes: (raw.heroes ?? []) as CmsHero[],
    datasets: raw.datasets ?? {},
    imageSlots: raw.imageSlots ?? {},
    pageSeo: raw.pageSeo ?? {},
    theme: { root: raw.theme?.root ?? {}, dark: raw.theme?.dark ?? {} },
    motion: {
      ...MOTION_DEFAULTS,
      ...(raw.motion ?? {}),
      reveal: { ...MOTION_DEFAULTS.reveal, ...(raw.motion?.reveal ?? {}) },
      marquee: { ...MOTION_DEFAULTS.marquee, ...(raw.motion?.marquee ?? {}) },
    },
    brand: {
      clients: nonEmpty(raw.brand?.clients, fallback.brand.clients),
      valuePills: nonEmpty(raw.brand?.valuePills, fallback.brand.valuePills),
      mediaPills: nonEmpty(raw.brand?.mediaPills, fallback.brand.mediaPills),
    },
    mediaAlt: raw.media ?? {},
    site: {
      ...fallback.site,
      ...(raw.site ?? {}),
      ai: { ...fallback.site.ai, ...(raw.site?.ai ?? {}) },
    } as SiteContent["site"],
  };
}

function nonEmpty<T>(value: unknown, fallback: T): T {
  return Array.isArray(value) && value.length > 0 ? (value as unknown as T) : fallback;
}

/**
 * Overlay `source` onto `base`, key by key.
 *
 * Only plain objects recurse — arrays are replaced wholesale, because an ordered
 * list (paragraphs, legal sections, channel columns) is meaningful as a unit and
 * merging index by index would silently mix two versions of it. An empty string
 * from the CMS is treated as "not filled in" and keeps the committed value.
 */
function deepMerge(base: unknown, source: unknown): unknown {
  if (source === undefined || source === null) return base;
  if (Array.isArray(source)) return source.length > 0 ? source : base;
  if (typeof source !== "object") return source === "" ? base : source;
  if (typeof base !== "object" || base === null || Array.isArray(base)) return source;

  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    out[key] = key in out ? deepMerge(out[key], value) : value;
  }
  return out;
}

/* ------------------------------------------------------------- convenience */

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const content = await getSiteContent();
  return content.dictionaries[locale];
}

export async function getPosts(): Promise<CmsPost[]> {
  return (await getSiteContent()).posts;
}

export async function getPost(slug: string): Promise<CmsPost | undefined> {
  return (await getPosts()).find((post) => post.slug === slug);
}

export async function getCases(): Promise<CaseStudy[]> {
  return (await getSiteContent()).cases;
}

export async function getCase(slug: string): Promise<CaseStudy | undefined> {
  return (await getCases()).find((entry) => entry.slug === slug);
}

/* -------------------------------------------------------------- block pages */

export type CmsPage = {
  slug: string;
  kind: string;
  title: Record<Locale, string>;
  seo: Record<Locale, { title: string; description: string }>;
  ogImage: string;
  blocks: Block[];
  status: string;
  updatedAt: string;
};

/** One CMS-built page. `preview` forwards the CMS session so drafts render. */
export async function getCmsPage(slug: string, cookie?: string): Promise<CmsPage | null> {
  const preview = Boolean(cookie);
  try {
    const init: RequestInit = preview
      ? { cache: "no-store", headers: { cookie: cookie ?? "" } }
      : { next: { revalidate: 300, tags: [CMS_TAGS.all, CMS_TAGS.pages] } };
    const res = await fetch(
      `${CMS_URL}/api/public/page?slug=${encodeURIComponent(slug)}${preview ? "&preview=1" : ""}`,
      { ...init, signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return null;
    return (await res.json()) as CmsPage;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------ form ingestion */

const INGEST_SECRET = process.env.NORR3_CMS_INGEST_SECRET ?? "";

/**
 * Post a website form submission into the CMS inbox. Server-side only — the
 * shared secret never reaches the browser.
 */
export async function submitToCms(
  form: "contact" | "brief" | "application" | "idea",
  data: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  if (!INGEST_SECRET) {
    return { ok: false, error: "NORR3_CMS_INGEST_SECRET is not configured on the website." };
  }
  try {
    const res = await fetch(`${CMS_URL}/api/public/forms`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-norr3-secret": INGEST_SECRET },
      body: JSON.stringify({ form, data }),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return { ok: false, error: payload.error ?? `CMS replied ${res.status}` };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "CMS unreachable" };
  }
}

export const cmsUrl = CMS_URL;
