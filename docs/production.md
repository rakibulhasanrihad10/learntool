# Production Quality Decisions (Phase 17)

> Polish pass, not a redesign. Every change is small, reversible, and
> covered by type checking plus tests.

## Performance

- **Route-level lazy loading** (`src/app/router.tsx`): every feature
  route is `React.lazy` + `Suspense` with a layout-preserving,
  bilingual, reduced-motion-safe `PageLoader`. Only the shell and the
  Home / Learn / Commands / 404 hubs stay eager. Content datasets now
  travel with their routes instead of the initial chunk.
- **No other perf work was needed on audit:** the search index is
  module-cached, dashboard/path derivations are memoized, progress
  writes happen only on state change, and `storage` is already
  crash-resilient. No new state library, no debounce layer, no IndexedDB.

## Accessibility

- **Modal:** focus trap (Tab cycles), initial focus into the dialog,
  focus restored to the trigger on close, background scroll locked,
  `aria-label` fallback. SearchModal's own input focus still wins via
  its deferred focus call.
- **Skip link** in `AppShell` → `#main-content`, bilingual, visible on
  focus only. Reduced-motion keyframes already global in
  `styles/animations.css`; `:focus-visible` ring already global.
- **Copy buttons** already expose `aria-label` + confirmation state;
  `useClipboard` now honors a `false` execCommand return and missing
  APIs instead of claiming success.
- **404 page** now offers Home, Learn, Commands, and Search (was a
  two-button dead end).

## SEO

- `index.html`: theme-color, Open Graph, and Twitter card tags. No
  canonical/OG-URL: the production domain is unknown and hard-coding a
  wrong one is worse than omitting it.
- `src/utils/pageMeta.ts`: single helper setting title + description +
  OG/Twitter tags from content the page already renders (localized, so
  language switches stay correct). Wired into all hub and detail pages.
- `public/robots.txt`: allow all; query URLs (`/search?`, filters)
  disallowed. No `sitemap.xml`: sitemaps require absolute URLs and the
  deployment domain is not configured — `src/app/routePaths.ts` is the
  ready-made source list when a domain exists.

## Resilience

- One route-level `ErrorBoundary` around the outlet (keyed by pathname
  so navigation resets it): bilingual fallback with retry + safe links,
  no stack traces to users, console-only logging.
- Clipboard and storage paths verified against missing/throwing browser
  APIs by unit tests with stubbed globals.

## Build observations

- Deps: react, react-dom, react-router-dom, lucide-react (tree-shaken
  named imports). Nothing unused, nothing added.
- The chunk-size warning predates this phase (single 1.9 MB bundle of
  static content); route splitting directly addresses its cause —
  confirm chunk count/sizes in build output rather than silencing it.
