import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { clients as bundledClients } from "@/content/services";
import { linkTo } from "@/lib/links";

/**
 * Grayscale client "logo" strip — slow marquee, matching the design's ● Logo
 * row. Each name links to the cases page: this is a trust signal ("we work
 * with brands like these"), and the natural next step from seeing one is to
 * see the work, not any one client's page in particular — most of these
 * names don't have a case study of their own, so linking to a specific case
 * per client would mostly be a broken promise.
 */
export function LogoStrip({
  clients = bundledClients,
  locale,
}: {
  clients?: string[];
  locale: Locale;
}) {
  const href = linkTo(locale, "/cases");

  // The marquee loops by rendering the row twice back to back; the second
  // copy exists purely for the seamless scroll and would otherwise double
  // every link a keyboard or screen-reader user encounters. `hidden` renders
  // that copy inert — aria-hidden and untabbable — so the real list is
  // announced, and can be activated, exactly once.
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {clients.map((name) => (
        <Link
          key={name}
          href={href}
          tabIndex={hidden ? -1 : undefined}
          className="mx-7 flex items-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium text-ink/60 transition-colors hover:text-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:text-white/60 dark:hover:text-light-purple dark:focus-visible:outline-light-purple"
        >
          <span className="h-2 w-2 rounded-full bg-ink/70 dark:bg-white/70" />
          {name}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-black/5 py-5 dark:border-white/10" style={{ ["--marquee-duration" as string]: "var(--marquee-logos, 55s)" }}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
