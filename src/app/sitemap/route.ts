import { getSiteContent } from "@/lib/cms";
import { linkTo } from "@/lib/links";

/**
 * A human-readable sitemap + redirect map, served at `/sitemap` (the XML
 * sitemap stays at `/sitemap.xml` for crawlers). Lists every public URL and
 * every permanent redirect, so the whole URL surface is visible in one place.
 */

const BASE = "https://norr3.fi";

const CODED_ROUTES = [
  { path: "", label: "Home" },
  { path: "services", label: "Services" },
  { path: "engine", label: "Marketing Engine" },
  { path: "cases", label: "Cases" },
  { path: "insights", label: "Insights" },
  { path: "about", label: "About Us" },
  { path: "team", label: "Team" },
  { path: "careers", label: "Careers" },
  { path: "contact", label: "Contact" },
  { path: "brief", label: "Brief" },
  { path: "privacy", label: "Privacy Policy" },
  { path: "terms", label: "Terms & Conditions" },
];

/** Permanent redirects, mirroring next.config.ts. */
const REDIRECTS: { from: string; to: string; note?: string }[] = [
  { from: "/fi/:path*", to: "/:path*", note: "legacy Finnish prefix" },
  { from: "/cases/:slug", to: "/:slug", note: "section prefix → root slug" },
  { from: "/insights/:slug", to: "/:slug", note: "section prefix → root slug" },
  { from: "/en/cases/:slug", to: "/en/:slug", note: "section prefix → root slug" },
  { from: "/en/insights/:slug", to: "/en/:slug", note: "section prefix → root slug" },
  { from: "/palvelut/:slug", to: "/:slug", note: "old service prefix → root slug" },
  { from: "/palvelut/data/*", to: "/data-ja-mittaus", note: "old data tree" },
  { from: "/palvelut/mediat/*", to: "/mediasuunnittelu", note: "old media tree" },
  { from: "/palvelut/mittaaminen/*", to: "/data-ja-mittaus", note: "old measurement tree" },
  { from: "/about", to: "/meista", note: "Finnish URL" },
  { from: "/team", to: "/tiimi", note: "Finnish URL" },
  { from: "/careers", to: "/toihin-meille", note: "Finnish URL" },
  { from: "/privacy", to: "/tietosuojaseloste", note: "Finnish URL" },
  { from: "/terms", to: "/kayttoehdot", note: "Finnish URL" },
  { from: "/cases", to: "/caset", note: "Finnish URL" },
  { from: "/en/palvelut/:slug", to: "/en/:slug", note: "old service prefix → root slug" },
  { from: "/cases", to: "/caset", note: "route renamed to Finnish" },
  { from: "/about", to: "/meista", note: "route renamed to Finnish" },
  { from: "/tarinat", to: "/insights" },
  { from: "/norr3-marketing-engine", to: "/engine" },
  { from: "/privacy-policy", to: "/tietosuojaseloste" },
  
  { from: "/sample-page", to: "/" },
  { from: "/en/home", to: "/en" },
  { from: "/en/norr3", to: "/en" },
  { from: "/media-insights", to: "/services", note: "old landing page" },
  { from: "/en/media-insights", to: "/en/services", note: "old landing page" },
  { from: "/terveystalo", to: "/suun-terveystalo", note: "slug changed" },
  { from: "/flow-festivaali", to: "/flow-festival", note: "slug changed" },
  { from: "/voittava-mediamixia-vuodelle-2024", to: "/voittava-mediamix-2026", note: "slug changed" },
  { from: "/trekronormedia_norr3", to: "/tre-kronor-media", note: "slug changed" },
  { from: "/norr3-on-vuoden-toimisto-2023", to: "/norr3-vuoden-toimisto-2023", note: "slug changed" },
  { from: "/grandone", to: "/cases", note: "content unavailable" },
];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const content = await getSiteContent();
  const cases = content.cases;
  const posts = content.posts;

  const urlRow = (path: string, label: string, priority: string) => `
    <tr>
      <td class="u"><a href="${BASE}${path}">${esc(path || "/")}</a></td>
      <td>${esc(label)}</td>
      <td class="p">${priority}</td>
    </tr>`;

  const pagesRows = CODED_ROUTES.map((r) =>
    urlRow(linkTo("fi", r.path), r.label, r.path === "" ? "1.0" : "0.8")
  ).join("");

  const casesRows = cases
    .map((c) => urlRow(`/${c.slug}`, c.client, "0.6"))
    .join("");

  const postsRows = posts
    .map((p) => urlRow(`/${p.slug}`, p.en.title || p.fi.title, "0.5"))
    .join("");

  const redirectRows = REDIRECTS.map(
    (r) => `
    <tr>
      <td class="u"><code>${esc(r.from)}</code></td>
      <td class="arr">→</td>
      <td class="u"><a href="${BASE}${r.to.replace(/:path\*/g, "")}">${esc(r.to)}</a></td>
      <td class="note">${esc(r.note ?? "")}</td>
    </tr>`
  ).join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>NØRR3 — Sitemap & Redirects</title>
<style>
  :root { --purple:#7A06D3; --violet:#5517A7; --ink:#000; --off:#F9F8F6; --line:#e5e0ea; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background:var(--off); color:var(--ink); line-height:1.5; }
  header { background:var(--purple); color:#fff; padding:40px 24px; }
  header h1 { margin:0 0 6px; font-size:28px; letter-spacing:-0.02em; }
  header p { margin:0; opacity:.85; font-size:14px; }
  main { max-width:960px; margin:0 auto; padding:32px 24px 80px; }
  h2 { font-size:20px; margin:40px 0 12px; letter-spacing:-0.01em; border-bottom:2px solid var(--purple); padding-bottom:8px; }
  h2 .count { font-size:13px; font-weight:600; color:var(--purple); margin-left:8px; }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:#666; padding:8px 10px; border-bottom:1px solid var(--line); }
  td { padding:7px 10px; border-bottom:1px solid var(--line); vertical-align:top; }
  td.u { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:13px; word-break:break-all; }
  td.p { text-align:right; color:#888; font-variant-numeric:tabular-nums; }
  td.arr { color:var(--purple); font-weight:700; text-align:center; width:24px; }
  td.note { color:#888; font-size:12px; }
  a { color:var(--purple); text-decoration:none; }
  a:hover { text-decoration:underline; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:13px; }
  .cols { display:grid; grid-template-columns:1fr 1fr; gap:0 40px; }
  @media (max-width:720px){ .cols { grid-template-columns:1fr; } }
</style>
</head>
<body>
<header>
  <h1>NØRR3 — Sitemap &amp; Redirects</h1>
  <p>Every public URL and every permanent redirect, in one place. The machine-readable sitemap is at <a href="/sitemap.xml" style="color:#fff;text-decoration:underline">/sitemap.xml</a>.</p>
</header>
<main>
  <h2>Pages<span class="count">${CODED_ROUTES.length * 2} URLs (FI + EN)</span></h2>
  <table>
    <thead><tr><th>URL</th><th>Page</th><th>Priority</th></tr></thead>
    <tbody>${pagesRows}</tbody>
  </table>

  <h2>Case studies<span class="count">${cases.length * 2} URLs</span></h2>
  <table>
    <thead><tr><th>URL</th><th>Client</th><th>Priority</th></tr></thead>
    <tbody>${casesRows}</tbody>
  </table>

  <h2>Insights<span class="count">${posts.length * 2} URLs</span></h2>
  <table>
    <thead><tr><th>URL</th><th>Title</th><th>Priority</th></tr></thead>
    <tbody>${postsRows}</tbody>
  </table>

  <h2>Redirects<span class="count">${REDIRECTS.length}</span></h2>
  <table>
    <thead><tr><th>From</th><th></th><th>To</th><th>Note</th></tr></thead>
    <tbody>${redirectRows}</tbody>
  </table>
</main>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
