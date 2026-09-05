import { describe, expect, it } from 'vitest';
import { GIT_COMMANDS, TROUBLESHOOTING_GUIDES } from '@/content/git';
import { ALL_MODULES } from '@/content/github';
import { LEARNING_PATHS } from '@/content/paths';
import { getCommandById } from '@/utils/commandSearch';
import { getScenarioBySlug } from '@/utils/troubleshootingSearch';
import { stepRoute } from '@/features/paths/progress';

/**
 * Global cross-content integrity (Phase 20): every stable-ID reference
 * between systems must resolve. Per-system suites cover practice,
 * interview, paths prerequisites, and cheat-sheet links; this suite
 * covers the remaining relation sets (encyclopedia, cookbook, path steps)
 * so no link rots silently.
 */
describe('integrity — command encyclopedia references', () => {
  const lessonIds = new Set(ALL_MODULES.flatMap((m) => m.lessons.map((l) => l.id)));

  it('resolves every related command and lesson', () => {
    for (const cmd of GIT_COMMANDS) {
      for (const id of cmd.relatedCommands ?? []) {
        expect(getCommandById(GIT_COMMANDS, id), `${cmd.id} → ${id}`).toBeDefined();
      }
      for (const id of cmd.relatedLessons ?? []) {
        expect(lessonIds.has(id), `${cmd.id} → ${id}`).toBe(true);
      }
    }
  });

  it('keeps command ids, slugs, and orders unique', () => {
    const ids = GIT_COMMANDS.map((c) => c.id);
    const slugs = GIT_COMMANDS.map((c) => c.slug);
    const orders = GIT_COMMANDS.map((c) => c.order);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(orders).size).toBe(orders.length);
  });
});

describe('integrity — troubleshooting guide references', () => {
  const lessonIds = new Set(ALL_MODULES.flatMap((m) => m.lessons.map((l) => l.id)));

  it('resolves every command slug, lesson, and scenario link', () => {
    for (const guide of TROUBLESHOOTING_GUIDES) {
      for (const slug of guide.commands) {
        expect(getCommandById(GIT_COMMANDS, slug), `${guide.id} command ${slug}`).toBeDefined();
      }
      for (const id of guide.lessons) {
        expect(lessonIds.has(id), `${guide.id} lesson ${id}`).toBe(true);
      }
      for (const slug of guide.scenarios) {
        expect(getScenarioBySlug(TROUBLESHOOTING_GUIDES, slug), `${guide.id} scenario ${slug}`).toBeDefined();
      }
    }
  });
});

describe('integrity — learning path steps open real destinations', () => {
  it('resolves every step of every path to a route', () => {
    for (const path of LEARNING_PATHS) {
      for (const step of path.steps) {
        expect(stepRoute(step), `${step.id} route`).not.toBeNull();
      }
    }
  });
});

describe('integrity — no duplicate stable ids across catalogs', () => {
  it('keeps guide/lesson/command slugs collision-free where routes overlap', () => {
    // Commands and guides share URL namespaces per type, but slugs must be
    // unique within each catalog so lookups are unambiguous.
    const guideSlugs = TROUBLESHOOTING_GUIDES.map((g) => g.slug);
    expect(new Set(guideSlugs).size).toBe(guideSlugs.length);
    const lessonSlugs = ALL_MODULES.flatMap((m) => m.lessons.map((l) => `${m.slug}/${l.slug}`));
    expect(new Set(lessonSlugs).size).toBe(lessonSlugs.length);
  });
});
