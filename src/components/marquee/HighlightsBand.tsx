import Link from "next/link";
import { Icon } from "@/components/Icon";
import { clients as bundledClients } from "@/content/services";
import type { CaseStudy } from "@/content/cases";
import type { Locale } from "@/i18n/config";
import { linkTo } from "@/lib/links";

const PILL_TONES = [
  "bg-white text-ink",
  "bg-purple text-white",
  "bg-light-purple text-ink",
];

const CHIP_ICONS = ["interests", "trending_up", "monitoring", "bar_chart"];

/**
 * Sub-brands and shortened names that belong to a case published under the
 * parent company. The lookup is still guarded by `cases` — an alias only
 * resolves while that case is actually live, so a hidden case falls back to
 * the cases index rather than a 404.
 */
const CLIENT_CASE_ALIASES: Record<string, string> = {
  rahalaitos: "sambla-group",
  omalaina: "sambla-group",
};

/** Lowercase and strip diacritics/punctuation so "Kokkolan kaupunki" and
 *  "Kokkola" can be compared as plain strings. */
function normaliseClientName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Where a ribbon pill points: the client's own case when one is published,
 * otherwise the cases index. Most clients on the ribbon don't have a case
 * story of their own, so the index is the honest destination for them — the
 * task is to see the work, not to land on a page that doesn't exist.
 */
function caseHrefForClient(client: string, cases: CaseStudy[], locale: Locale): string {
  const needle = normaliseClientName(client);
  const alias = CLIENT_CASE_ALIASES[needle];
  const match =
    (alias ? cases.find((entry) => entry.slug === alias) : undefined) ??
    cases.find((entry) => {
      const haystack = normaliseClientName(entry.client);
      if (haystack === needle) return true;
      const shorter = needle.length <= haystack.length ? needle : haystack;
      const longer = needle.length <= haystack.length ? haystack : needle;
      // "ST1 Finland" ↔ "St1" and "Kokkolan kaupunki" ↔ "Kokkola" are the same
      // client stated more or less fully — a prefix match bridges those. The
      // length floors keep short names ("SPR") from matching as substrings.
      if (shorter.length >= 3 && longer.startsWith(shorter)) return true;
      if (shorter.length >= 5 && longer.includes(shorter)) return true;
      return false;
    });
  return linkTo(locale, match ? `/${match.slug}` : "/caset");
}

/** The "Highlights" band: client pills scrolling over a solid black surface. */
export function HighlightsBand({
  clients = bundledClients,
  cases = [],
  locale,
}: {
  clients?: string[];
  cases?: CaseStudy[];
  locale: Locale;
}) {
  // The marquee loops by rendering the row twice; the second copy is inert
  // (aria-hidden, untabbable) so the list is announced and tabbed exactly once.
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {clients.map((name, i) => (
        <span key={`${name}-${i}`} className="flex items-center gap-4">
          <Link
            href={caseHrefForClient(name, cases, locale)}
            tabIndex={hidden ? -1 : undefined}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-base font-medium transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow ${PILL_TONES[i % PILL_TONES.length]}`}
          >
            {name}
            <span aria-hidden>→</span>
          </Link>
          <span
            aria-hidden
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${i % 3 === 1 ? "bg-purple text-white" : "bg-white text-ink"}`}
          >
            <Icon name={CHIP_ICONS[i % CHIP_ICONS.length]} className="text-[20px]" />
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="bg-ink py-12 dark:bg-white/[0.04] dark:border-y dark:border-white/10">
      <div className="marquee-paused mask-fade overflow-x-clip" style={{ ["--marquee-duration" as string]: "var(--marquee-pills, 45s)" }}>
        <div className="marquee-track items-center">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
