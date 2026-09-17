# Launch cutover — norr3.fi to the new site

The new site runs on this VPS (`next start` on :3847) behind Traefik, today at
`https://site.srv1160035.hstgr.cloud`. `norr3.fi` still points at the old
WordPress (through Cloudflare). Everything below was pre-checked on 11.9.2026.

## Already verified

- **robots.txt** — `norr3.fi` / `www.norr3.fi` get `Allow: /` plus the sitemap;
  every other host gets `Disallow: /` (`src/lib/host.ts`). Meta robots on the
  production host is `index, follow`.
- **Redirects** — all 47 legacy rules answer `301` (not 308) straight to their
  final URL; no chains. Three still end in a 404 until their content is
  published: `/terveystalo` and `/flow-festivaali` (cases hidden in the CMS)
  and `/norr3-on-vuoden-toimisto-2023` (post is a draft). Re-checked 17.9.2026:
  all three still 404 at the target — publish the content or drop the rules
  before launch.
- **Broken links** — a 28-route crawl (FI + EN, all key templates) on 17.9.2026
  found 82 unique internal URLs, all 200, no redirect chains
  (`docs/performance-test-2026-09-17.md`).
- **robots.txt** — checked again on 17.9.2026 on the production host: `Allow: /`,
  `Disallow: /api/` and `/cms-preview/`, sitemap at `https://norr3.fi/sitemap.xml`.
- **HTTPS** — Let's Encrypt via Traefik's `mytlschallenge` resolver works for
  the staging host; http → https redirects.

## On the day

1. **Lower the DNS TTL** a day ahead (Cloudflare → DNS → `norr3.fi`, `www`).
2. **The production router already exists** — `/docker/traefik-v9pi/dynamic/norr3-site.yml`
   (live since the last infra pass) contains the `norr3.fi` + `www.norr3.fi`
   router with the `letsencrypt` **HTTP-01** resolver and a `norr3-www-redirect`
   middleware. HTTP-01 works through the Cloudflare proxy, so no manual TLS
   configuration is needed on the day; Traefik issues the certificate on the
   first request after DNS moves. `site.srv1160035.hstgr.cloud` stays as a
   staging alias with the `mytlschallenge` resolver.
3. **Point DNS** `norr3.fi` and `www` A records at `194.31.55.65` (Cloudflare
   proxied is fine with HTTP-01). Set SSL/TLS mode to **Full (strict)**.
4. **CMS settings** — Settings → Website connection: set the Website URL for
   previews to `https://norr3.fi`.
5. **Smoke test** (FI and EN):

   ```bash
   curl -sI https://norr3.fi/ | head -1                 # 200
   curl -s  https://norr3.fi/robots.txt                  # Allow: /
   curl -sI https://norr3.fi/palvelut | grep -i location # 301 → /services
   curl -sI https://www.norr3.fi/ | head -1              # 200
   curl -sI https://norr3.fi/en/services | head -1       # 200
   ```

6. Submit `https://norr3.fi/sitemap.xml` in Search Console and Bing (Geir's task).

## Deploying code changes (both apps)

`next build` replaces the JS/CSS the *running* server still references, so the
live pages break (asset 500s, no hydration) until it restarts. Always restart
straight after a successful build. The server is managed by systemd
(`norr3-website.service`, `Restart=always`), so restart it properly:

```bash
npm run build && systemctl restart norr3-website.service
sleep 7 && curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3847/
```

After a CMS content change, trigger the revalidation hook as well
(`POST /api/revalidate` with the `x-norr3-secret` header).

Don't `pkill -f` with a pattern that also appears in your own command line — it
kills the shell running it.
