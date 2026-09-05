import { describe, expect, it } from 'vitest';
import { APP_ROUTE_PATHS } from './routePaths';

/**
 * Route registry regression safety: every representative public route from
 * the Phase 17 quality checklist must exist exactly once. Query strings,
 * modal states, and progress states are not routes and stay out.
 */
describe('router — public route registry', () => {
  const expected = [
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

  it('lists every public route exactly once', () => {
    expect([...APP_ROUTE_PATHS].sort()).toEqual([...expected].sort());
    expect(new Set(APP_ROUTE_PATHS).size).toBe(APP_ROUTE_PATHS.length);
  });

  it('uses stable, readable, parameter-consistent paths', () => {
    for (const path of APP_ROUTE_PATHS) {
      expect(path.startsWith('/')).toBe(true);
      expect(path).not.toContain('?');
      if (path !== '/') expect(path).not.toMatch(/\/$/);
    }
  });
});
