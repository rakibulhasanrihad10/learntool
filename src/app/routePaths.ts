/**
 * Canonical public route paths (flat). Single source of truth for "which
 * URLs exist" — used by the router, regression tests, and any future
 * sitemap generation. Query strings, modal states, and progress states
 * are never routes and stay out of this list.
 */
export const APP_ROUTE_PATHS = [
  '/',
  '/learn',
  '/learn/paths',
  '/learn/paths/:pathId',
  '/learn/:subjectId',
  '/learn/:subjectId/:moduleId',
  '/learn/:subjectId/:moduleId/:lessonId',
  '/progress',
  '/search',
  '/commands',
  '/commands/git/:commandSlug',
  '/workflows',
  '/workflows/everyday-git',
  '/workflows/github-pr',
  '/troubleshooting',
  '/troubleshooting/git/:scenarioSlug',
  '/interview',
  '/interview/git',
  '/interview/git/mock',
  '/interview/git/:categoryId',
  '/practice',
  '/practice/assessment',
  '/practice/:exerciseId',
  '/cheatsheet',
  '/cheatsheet/git',
  '/git/internals',
];
