# Deployment Guide (Phase 19)

> GitVerse is a static frontend: `npm run build` → deploy `dist/`.
> No backend, no secrets, no server infrastructure required.

## Recommended hosting: Cloudflare Pages

Why: free static hosting with HTTPS by default, native `_redirects`
+ `_headers` support (both committed), global CDN, preview deploys.
The project stays portable — Netlify reads the same two files, and
`vercel.json` covers Vercel. Avoid GitHub Pages (no rewrite support;
SPA fallback would need workarounds).

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20+ (24 verified) |
| Environment | `VITE_SITE_URL=https://<your-domain>` |
| SPA fallback | `public/_redirects` (`/* → /index.html 200`), committed |
| Headers | `public/_headers` (cache + security), committed |

HTTPS is assumed (required for service workers). Custom domains get
HTTPS automatically on all three hosts.

## Configuration

Copy `.env.example` to `.env` (local) or set in the host dashboard:

- `VITE_SITE_URL` — public origin. Enables canonical URLs, `og:url`,
  and `dist/sitemap.xml` + sitemap `robots.txt` at build time. Leave
  **unset** for preview builds: pages emit no canonical rather than a
  wrong one, and the sitemap step skips loudly.
- `VITE_BASE_PATH` — subpath hosting (e.g. `/gitverse/`). Defaults to
  `/` (domain root, recommended — PWA install scope is cleanest there).
  Assets, router basename, and manifest scope follow it automatically.

## Caching & updates

- Hashed `/assets/*`: immutable, 1 year.
- `index.html`, `sw.js`, `manifest.webmanifest`: `no-cache` so deploys
  and prompt-driven SW updates can never stick behind a CDN.
- The service worker precaches versioned assets and cleans old caches;
  users accept updates via the in-app banner (never forced reloads).

## Post-deploy smoke checklist

**Navigation:** `/`, `/learn`, `/learn/paths`, `/commands`,
`/commands/git/rebase`, `/workflows`, `/troubleshooting`,
`/troubleshooting/git/merge-conflict`, `/practice`, `/interview`,
`/progress`, `/search?q=merge`, `/cheatsheet`, `/git/internals`,
`/nope` (GitVerse 404, not the host's).
Direct-URL loads (paste into address bar) must render, not 404.

**Core:** search → result; command copy; simulator guided + free-play;
practice exercise + XP; interview self-rating; progress dashboard;
language EN↔BN; theme light↔dark; reload keeps progress.

**PWA:** manifest served (`/manifest.webmanifest`); `sw.js` registered;
DevTools → Application → installable; airplane mode → cached routes
work, banner shows "offline"; reconnect → "back online"; new deploy →
update banner → accept reloads once.

**SEO:** view-source title/description per page; canonical absolute and
matching the domain; `/robots.txt` allows content; `/sitemap.xml`
lists static routes only; OG tags with `/og-cover.png`.

**Responsive:** 375px / 768px / 1440px spot-checks: nav, code blocks,
search, cheat sheet, PWA banners clear of content.

## Known limits of local verification

`npm run preview` serves the production build locally (used below to
verify routing, assets, manifest, SW, robots). It cannot verify real
HTTPS, real install prompts, cross-browser SW behavior, or CDN header
application — those need the deployed URL checklist above.
