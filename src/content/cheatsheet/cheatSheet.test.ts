import { describe, expect, it } from 'vitest';
import { GIT_COMMANDS, TROUBLESHOOTING_GUIDES } from '@/content/git';
import { ALL_MODULES, getLessonRoute } from '@/content/github';
import { getCommandById } from '@/utils/commandSearch';
import { classifyCommand } from '@/utils/troubleshootingSearch';
import { CHEAT_SHEET_SECTIONS, QUICK_ACTIONS } from './cheatSheet';
import { COMMAND_COMPARISONS, UNDO_SITUATIONS, WORKFLOW_RECIPES } from './cheatSheetExtras';
import { filterSections, resolveEntry, resolveSections } from '@/features/cheatsheet/cheatsheet';

const MODULE_ROUTES = new Set(ALL_MODULES.map((m) => `/learn/${m.subjectId}/${m.slug}`));
const STATIC_ROUTES = new Set([
  '/workflows/everyday-git',
  '/workflows/github-pr',
  '/troubleshooting',
  '/commands',
  '/practice',
  '/interview',
  '/learn/paths',
  '/git/internals',
  '/cheatsheet',
  '/cheatsheet/git',
]);

function routeExists(route: string): boolean {
  if (MODULE_ROUTES.has(route) || STATIC_ROUTES.has(route)) return true;
  if (route.startsWith('/commands/git/')) {
    return getCommandById(GIT_COMMANDS, route.split('/').pop() ?? '') !== undefined;
  }
  if (route.startsWith('/troubleshooting/git/')) {
    return TROUBLESHOOTING_GUIDES.some((g) => g.slug === route.split('/').pop());
  }
  if (route.startsWith('/interview/git/')) return true;
  if (route.startsWith('/learn/paths/')) return true;
  if (route.startsWith('/practice/')) return true;
  if (route.startsWith('/search?')) return true;
  return false;
}

describe('cheat sheet metadata', () => {
  it('has unique section ids with bilingual titles', () => {
    const ids = CHEAT_SHEET_SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(8);
    for (const s of CHEAT_SHEET_SECTIONS) {
      expect(s.title.en.trim().length).toBeGreaterThan(0);
      expect(s.title.bn.trim().length).toBeGreaterThan(0);
      expect(s.description.en.trim().length).toBeGreaterThan(0);
      expect(s.entries.length).toBeGreaterThan(0);
      expect(routeExists(s.learnRoute), `${s.id} learnRoute`).toBe(true);
    }
  });

  it('resolves every entry without broken links', () => {
    for (const section of CHEAT_SHEET_SECTIONS) {
      section.entries.forEach((entry, index) => {
        const resolved = resolveEntry(section.id, index, entry);
        expect(resolved, `${section.id}[${index}]`).not.toBeNull();
        if (entry.kind === 'snippet') {
          if (entry.linkCommandId) {
            expect(getCommandById(GIT_COMMANDS, entry.linkCommandId), `${entry.command} linkCommand`).toBeDefined();
          }
          if (entry.linkLessonId) {
            expect(getLessonRoute(entry.linkLessonId), `${entry.command} linkLesson`).not.toBeNull();
          }
          if (entry.linkGuideId) {
            expect(TROUBLESHOOTING_GUIDES.some((g) => g.id === entry.linkGuideId), `${entry.command} linkGuide`).toBe(true);
          }
        }
        expect(resolved!.command.trim().length).toBeGreaterThan(0);
        expect(resolved!.purpose.en.trim().length).toBeGreaterThan(0);
        expect(resolved!.purpose.bn.trim().length).toBeGreaterThan(0);
      });
    }
  });

  it('has no duplicate command lines within a section', () => {
    for (const section of CHEAT_SHEET_SECTIONS) {
      const resolved = section.entries
        .map((entry, index) => resolveEntry(section.id, index, entry))
        .filter((e): e is NonNullable<typeof e> => e !== null);
      const commands = resolved.map((e) => e.command);
      expect(new Set(commands).size, `${section.id} dupes`).toBe(commands.length);
    }
  });

  it('copies exact text: refs use encyclopedia syntax, snippets stay verbatim', () => {
    for (const section of CHEAT_SHEET_SECTIONS) {
      section.entries.forEach((entry, index) => {
        const resolved = resolveEntry(section.id, index, entry)!;
        expect(resolved).not.toBeNull();
        if (entry.kind === 'command') {
          const cmd = getCommandById(GIT_COMMANDS, entry.commandId)!;
          expect(resolved.command).toBe(cmd.syntax);
        } else {
          expect(resolved.command).toBe(entry.command);
        }
      });
    }
  });

  it('labels safety from the shared classifier, not invented values', () => {
    for (const section of CHEAT_SHEET_SECTIONS) {
      section.entries.forEach((entry, index) => {
        const resolved = resolveEntry(section.id, index, entry)!;
        expect(resolved.safety).toBe(classifyCommand(resolved.command).level);
      });
    }
    // Destructive lines are flagged, safe ones are not.
    expect(classifyCommand('git reset --hard HEAD~1').level).toBe('destructive');
    expect(classifyCommand('git status').level).toBe('safe');
  });

  it('covers the representative commands', () => {
    const all = resolveSections().flatMap((s) => s.entries.map((e) => e.command));
    const hay = all.join('\n');
    for (const needle of [
      'git status', 'git add', 'git commit', 'git switch', 'git merge', 'git rebase',
      'git fetch', 'git pull', 'git push', 'git reset', 'git restore', 'git revert', 'git reflog',
      'git stash', 'git tag', 'git config',
    ]) {
      expect(hay.includes(needle), needle).toBe(true);
    }
  });
});

describe('quick actions, recipes, comparisons, undo', () => {
  it('routes every quick action to a real destination', () => {
    expect(QUICK_ACTIONS.length).toBeGreaterThanOrEqual(12);
    for (const action of QUICK_ACTIONS) {
      expect(action.intent.en.trim().length).toBeGreaterThan(0);
      expect(action.intent.bn.trim().length).toBeGreaterThan(0);
      expect(routeExists(action.route), `${action.id} route`).toBe(true);
    }
  });

  it('keeps recipes technically sound with real routes', () => {
    for (const recipe of WORKFLOW_RECIPES) {
      expect(recipe.lines.length).toBeGreaterThan(0);
      for (const line of recipe.lines) {
        expect(line.startsWith('git '), `${recipe.id}: ${line}`).toBe(true);
      }
      expect(routeExists(recipe.route), `${recipe.id} route`).toBe(true);
    }
    const daily = WORKFLOW_RECIPES.find((r) => r.id === 'recipe-daily')!;
    expect(daily.lines).toContain('git status');
    expect(daily.lines.some((l) => l.startsWith('git add '))).toBe(true);
  });

  it('links comparisons and undo situations to existing content', () => {
    expect(COMMAND_COMPARISONS.length).toBeGreaterThanOrEqual(6);
    for (const c of COMMAND_COMPARISONS) {
      expect(routeExists(c.learnRoute), `${c.id} learnRoute`).toBe(true);
      expect(c.difference.en.trim().length).toBeGreaterThan(0);
      expect(c.difference.bn.trim().length).toBeGreaterThan(0);
    }
    expect(UNDO_SITUATIONS.length).toBeGreaterThanOrEqual(9);
    for (const u of UNDO_SITUATIONS) {
      expect(TROUBLESHOOTING_GUIDES.some((g) => g.id === u.guideId), `${u.id} guide`).toBe(true);
      expect(u.command.startsWith('git ')).toBe(true);
      expect(u.situation.bn.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('in-page filter', () => {
  const resolved = resolveSections();

  it('returns everything on blank queries', () => {
    expect(filterSections('', resolved)).toBe(resolved);
    expect(filterSections('  ', resolved).length).toBe(resolved.length);
  });

  it('narrows by token across commands and purposes', () => {
    const branch = filterSections('branch', resolved);
    expect(branch.length).toBeGreaterThan(0);
    expect(branch.length).toBeLessThan(resolved.length);
    const remote = filterSections('remote', resolved);
    expect(remote.some((s) => s.section.id === 'remote')).toBe(true);
    const undo = filterSections('undo', resolved);
    expect(undo.some((s) => s.section.id === 'undo')).toBe(true);
  });

  it('finds nothing for nonsense and matches deterministically', () => {
    expect(filterSections('xyzzy-no-such-thing', resolved)).toEqual([]);
    expect(filterSections('rebase', resolved)).toEqual(filterSections('rebase', resolved));
  });
});
