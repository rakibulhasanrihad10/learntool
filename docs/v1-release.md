# GitVerse v1 — Release Readiness (Phase 20)

> Final QA audit. Verdict: **ready for public deployment** (see
> § release blockers: none open).

## What Phase 20 changed

- **Fixed XP farming bug:** `PathDetailPage` re-awarded +150 XP on every
  revisit of a completed path (ref-only guard). The completion
  achievement id is now the durable celebrated marker.
- **Removed dead code:** leftover `getAdjacentQuestions` experiment in
  `InterviewTopicPage` (+ unused import).
- **Fixed `.gitignore`:** added `!.env.example` so the documented
  production-URL template is committable.
- **Added global integrity suite** (`src/content/integrity.test.ts`):
  encyclopedia relations, cookbook command/lesson/scenario links, every
  learning-path step resolving to a route, slug uniqueness.

## Audit results (verified, not assumed)

- **Git accuracy:** rebase golden rule, reset/restore/revert semantics,
  fetch = download-only / pull = fetch+integrate, switch vs checkout
  framing, SHA-1-common/SHA-256-exists, reflog limits — all accurate
  in source. No corrections required.
- **Cross-links:** 348 tests green, including new all-catalog
  relationship resolution — zero dangling references.
- **XP/gamification:** all award sites first-completion-guarded or
  idempotent by store check; lesson/quiz completions early-return on
  duplicates.
- **Accessibility:** dialog focus trap/return, skip link, live regions,
  text alternatives on visualizations, keyboard-native controls.
- **Responsive:** no fixed-width overflow risks (only decorative clipped
  art + max-width constraints).
- **SEO/PWA/deploy:** meta helper on all pages, robots, conditional
  sitemap, manifest + versioned SW in dist, SPA fallback verified over
  HTTP for 20/20 routes.
- **i18n:** `Record<Language, TranslationSchema>` makes missing Bangla
  keys a compile error; commands/syntax untranslated by convention +
  tests.
- **Security:** no `dangerouslySetInnerHTML` (verified: no matches),
  no analytics/tracking, CSP + headers committed, localStorage
  crash-guarded and tested.

## Validation (executed)

- `npx tsc --noEmit` — clean.
- `npm test` — 25 files / 348 tests pass.
- `npm run build` — succeeds; `dist/` contains SW, manifest, icons,
  robots, headers, redirects.
- `npm run preview` + HTTP smoke — 20/20 routes serve the app shell
  (hubs, deep links, invalid route, robots, manifest, SW).

## Not verified (requires real deployment / browsers)

- Actual install prompt, airplane-mode walkthrough, cross-browser SW
  behavior, CDN header application, screen-reader walkthrough,
  320–430px device checks. See `docs/deployment.md` post-deploy list.

## Release blockers

None open.
