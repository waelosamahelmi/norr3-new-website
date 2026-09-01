/**
 * Environment detection shared by the robots route and the layout metadata.
 *
 * The production domain is norr3.fi. Every other host — the raw VPS IP, a
 * staging subdomain, a preview URL — must be treated as non-indexable so the
 * site never gets crawled as a duplicate before (or after) a DNS cutover.
 */
export function isProductionHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return host.replace(/^www\./, "").split(":")[0].toLowerCase() === "norr3.fi";
}
