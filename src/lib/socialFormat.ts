import type { Locale } from "@/i18n/config";

/**
 * Team Social — the shapes the CMS's public social API returns, plus the pure
 * helpers both server pages and client components need (text tokenising,
 * localisation, excerpts, relative time).
 *
 * Deliberately free of any server import: client components import from here,
 * and anything pulled in would ship to the browser. The fetchers live in
 * `src/lib/social.ts`.
 */

/* ------------------------------------------------------------------- types */

export type Localized = { fi: string; en: string };

export type MemberSummary = {
  slug: string;
  name: string;
  photo: string;
  role: Localized;
  headline: Localized;
  postCount: number;
};

export type PortfolioItem = { title: string; description: string; url: string; image: string };

export type Profile = MemberSummary & {
  cover: string;
  about: Localized;
  bio: Localized;
  skills: string[];
  portfolio: PortfolioItem[];
  linkedin: string;
  email: string;
  location: string;
};

export type Media = {
  type: "image" | "video";
  path: string;
  poster?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type LinkPreview = { url: string; title: string; description: string; image: string; site: string };

export type Embed = { provider: "youtube" | "vimeo" | "linkedin"; url: string; embedUrl: string };

export type Comment = { id: number; author: MemberSummary; body: string; createdAt: string };

export type SharedPost = Omit<Post, "shared" | "comments">;

export type Post = {
  id: number;
  slug: string;
  lang: "fi" | "en";
  author: MemberSummary;
  body: string;
  media: Media[];
  link: LinkPreview | null;
  embed: Embed | null;
  /** One level deep; null when the original was hidden or deleted. */
  shared: SharedPost | null;
  pinned: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  /** All visible comments, oldest first. */
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};

export type Story = {
  id: number;
  mediaType: "image" | "video";
  path: string;
  poster: string;
  caption: string;
  linkUrl: string;
  createdAt: string;
  expiresAt: string;
  highlight: boolean;
  highlightTitle: string;
};

export type StoryGroup = { member: MemberSummary; stories: Story[] };

/* ----------------------------------------------------------------- helpers */

export const SITE_ORIGIN = "https://norr3.fi";

/** A localized pair in the page's language, falling back to the other one. */
export function loc(value: Partial<Localized> | null | undefined, locale: Locale): string {
  if (!value) return "";
  const own = value[locale]?.trim();
  if (own) return own;
  return (locale === "fi" ? value.en : value.fi)?.trim() ?? "";
}

/** `{n}` / `{name}` style template fill. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Count label that picks the singular template for exactly one. */
export function countLabel(n: number, one: string, many: string): string {
  return fill(n === 1 ? one : many, { n });
}

/** Absolute URL for JSON-LD and OpenGraph, leaving external URLs untouched. */
export function absoluteUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Only plain http(s) links are ever rendered as hrefs — never `javascript:`. */
export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Media paths are site-relative uploads; external http(s) images pass through. */
export function mediaSrc(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("/")) return path;
  return safeHttpUrl(path) ?? "";
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** A single-line excerpt, cut on a word boundary. */
export function excerpt(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s.,;:!?-]+$/, "")}…`;
}

/** The first picture a post can be shared with: its own media, then the shared post, then the link card. */
export function postImage(post: Pick<Post, "media" | "link"> & { shared?: SharedPost | null }): string {
  for (const source of [post, post.shared]) {
    if (!source) continue;
    const image = source.media.find((m) => m.type === "image");
    if (image) return image.path;
    const poster = source.media.find((m) => m.type === "video" && m.poster);
    if (poster?.poster) return poster.poster;
    if (source.link?.image) return source.link.image;
  }
  return "";
}

export type BodyToken =
  | { type: "text"; value: string }
  | { type: "url"; value: string; href: string }
  | { type: "tag"; value: string; tag: string };

const TOKEN = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+|#[\p{L}\p{N}_]{2,64})/gu;

/**
 * Split plain post text into text, URL and hashtag tokens. Rendering happens in
 * React, so nothing here is ever injected as HTML.
 */
export function tokenizeBody(body: string): BodyToken[] {
  const tokens: BodyToken[] = [];
  let last = 0;
  for (const match of body.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    let value = match[0];
    if (value.startsWith("#")) {
      // A hashtag only counts at a word start — `abc#def` is not one.
      const before = start > 0 ? body[start - 1] : " ";
      if (/[\p{L}\p{N}_&]/u.test(before)) continue;
      if (start > last) tokens.push({ type: "text", value: body.slice(last, start) });
      tokens.push({ type: "tag", value, tag: value.slice(1) });
      last = start + value.length;
      continue;
    }
    // Sentence punctuation after a URL belongs to the sentence.
    const trimmed = value.replace(/[.,;:!?'")\]]+$/, "");
    value = trimmed;
    const href = safeHttpUrl(value.startsWith("www.") ? `https://${value}` : value);
    if (!href) continue;
    if (start > last) tokens.push({ type: "text", value: body.slice(last, start) });
    tokens.push({ type: "url", value, href });
    last = start + value.length;
  }
  if (last < body.length) tokens.push({ type: "text", value: body.slice(last) });
  return tokens;
}

/** Whether a post (or the post it shares) carries a hashtag, case-insensitively. */
export function hasTag(post: Pick<Post, "body"> & { shared?: SharedPost | null }, tag: string): boolean {
  const wanted = tag.toLowerCase();
  const inBody = (body: string) =>
    tokenizeBody(body).some((token) => token.type === "tag" && token.tag.toLowerCase() === wanted);
  return inBody(post.body) || (post.shared ? inBody(post.shared.body) : false);
}

const TIME_ZONE = "Europe/Helsinki";

/** Deterministic absolute date — the SSR rendering of every timestamp. */
export function absoluteDate(iso: string, locale: Locale, withTime = false): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "fi" ? "fi-FI" : "en-GB", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: locale === "fi" ? "numeric" : "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

/** LinkedIn-style short relative time: "5 min", "3 h", "2 d", then a date after a week. */
export function relativeTime(iso: string, locale: Locale, now: number, justNow: string): string {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";
  const seconds = Math.round((now - time) / 1000);
  if (seconds < 60) return justNow;
  const rtf = new Intl.RelativeTimeFormat(locale === "fi" ? "fi-FI" : "en-GB", { numeric: "always", style: "short" });
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return rtf.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  const days = Math.round(hours / 24);
  if (days < 7) return rtf.format(-days, "day");
  return absoluteDate(iso, locale);
}

/** Paragraphs of a plain-text field, split on blank lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** JSON for a `<script type="application/ld+json">`, safe against `</script>` in user text. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/[\u2028\u2029]/g, " ");
}
