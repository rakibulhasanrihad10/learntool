# PWA & Offline-First (Phase 18)

> Installable, offline-capable, still static-first. PWA is progressive
> enhancement: without service-worker or install support, GitVerse is
> exactly the same website.

## Stack

`vite-plugin-pwa` (generateSW) + a hand-written manifest source
(`src/pwa/manifest.ts`) + ~200 lines of UI/hooks. No other new
dependencies (`sharp` was used once to rasterize icons, then removed).

## Caching strategy

- **Precache (versioned, content-hashed, bounded):** all JS/CSS/HTML/SVG/
  PNG in `dist` — app shell plus every lazy route chunk, so all
  lessons, commands, labs, interview, paths, and cheat sheets work
  offline after the first visit. `cleanupOutdatedCaches` purges old
  deploys; new deploys change hashes, so nothing goes stale.
- **Offline navigation:** `navigateFallback: index.html`. The router
  boots offline and serves cached routes; unknown paths hit the
  existing 404 page; partial failures hit the route error boundary.
  No dedicated fallback page is needed — with full precache it would
  be unreachable (first-visit-offline cannot be helped by any SW).
- **Runtime:** Google Fonts stylesheets (StaleWhileRevalidate) and font
  files (CacheFirst, 30 entries / 30 days) only. No API caching exists
  because no backend exists; no analytics, no tracking.
- **robots.txt** already disallows query URLs, so cached `/search?q=`
  states stay out of indexes.

## Updates (never silent)

`registerType: 'prompt'`, `injectRegister: false`, manual `registerSW`
in `main.tsx`. A new worker waits; the UI shows "A new version is
available → Update now" only after user-visible `onNeedRefresh`.
Clicking calls `skipWaiting` + reload via `src/pwa/update.ts`. All
learner state already lives in localStorage (written synchronously on
change), so a user-timed reload loses nothing in flight.

## Install & status UX

- `useInstallPrompt`: captures `beforeinstallprompt`, honors
  `appinstalled`, persists dismissals (re-offer after 30 days via
  `installEligible()`), hides when standalone or unsupported.
- `useNetworkStatus`: online/offline events; banner shows persistent
  "offline" and transient (4 s) "back online", `role="status"`.
- Banners stack fixed-bottom above the mobile nav (safe-area aware),
  dock right on desktop, use design tokens only, no animation.

## Persistence & APIs offline

Unchanged and safe: theme/language/progress/XP/achievements/streaks/
history all use the crash-resilient `storage` util (covered by tests
for malformed/throwing/absent storage). Simulator, search, practice,
interview, and mastery are pure local computation. Clipboard keeps its
fallback chain; `navigator.onLine`/matchMedia/service-worker access
are all guarded.

## Verification

- `src/pwa/pwa.test.ts`: manifest completeness, install rule,
  update bridge.
- Manual checklist per release: install prompt → standalone launch →
  airplane mode → browse cached routes → complete a lesson/lab →
  reconnect → update banner → accept.
