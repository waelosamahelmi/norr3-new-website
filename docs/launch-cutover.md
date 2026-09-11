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
  and `/norr3-on-vuoden-toimisto-2023` (post is a draft).
- **HTTPS** — Let's Encrypt via Traefik's `mytlschallenge` resolver works for
  the staging host; http → https redirects.

## On the day

1. **Lower the DNS TTL** a day ahead (Cloudflare → DNS → `norr3.fi`, `www`).
2. **Add the production router** — create
   `/docker/traefik-v9pi/dynamic/norr3-fi.yml` (Traefik picks it up live):

   ```yaml
   http:
     routers:
       norr3-fi:
         entryPoints: [web, websecure]
         rule: "Host(`norr3.fi`) || Host(`www.norr3.fi`)"
         service: norr3-site
         tls:
           certResolver: mytlschallenge
   ```

   `norr3-site` is the service already defined in `norr3-site.yml`. Do this
   *after* DNS points here — the TLS challenge fails while it still resolves
   to WordPress, and repeated failures hit Let's Encrypt's rate limit.
3. **Point DNS** `norr3.fi` and `www` A records at `194.31.55.65`. If they stay
   proxied through Cloudflare, set SSL/TLS mode to **Full (strict)**; with the
   TLS challenge, the proxy must be off (grey cloud) until the first
   certificate is issued.
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
straight after a successful build:

```bash
npm run build && kill <pid of next-server on :3847> && nohup npm run start -- -p 3847 > next-start.log 2>&1 &
```

Don't `pkill -f` with a pattern that also appears in your own command line — it
kills the shell running it.
