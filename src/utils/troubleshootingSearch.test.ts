import { describe, it, expect } from 'vitest';
import { GIT_COMMANDS, FUNDAMENTALS_LESSONS, TROUBLESHOOTING_GUIDES, DECISION_TREES } from '@/content/git';
import {
  searchScenarios,
  filterScenarios,
  searchAndFilterScenarios,
  getScenarioBySlug,
  getScenarioById,
  getAdjacentScenarios,
  getRelatedScenarios,
  getCommandsForScenario,
  getScenariosForCommand,
  getLessonsForScenario,
  getDecisionTree,
  resolveDecisionHop,
  classifyCommand,
} from './troubleshootingSearch';

const GUIDES = TROUBLESHOOTING_GUIDES;

describe('troubleshooting — library integrity', () => {
  it('ships at least 20 scenarios with unique ids, slugs and orders', () => {
    expect(GUIDES.length).toBeGreaterThanOrEqual(20);
    expect(new Set(GUIDES.map((g) => g.id)).size).toBe(GUIDES.length);
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
    expect(new Set(GUIDES.map((g) => g.order)).size).toBe(GUIDES.length);
  });

  it('every guide carries non-empty English + Bangla copy', () => {
    for (const g of GUIDES) {
      expect(g.title.en.length).toBeGreaterThan(0);
      expect(g.title.bn.length).toBeGreaterThan(0);
      expect(g.shortDescription.bn.length).toBeGreaterThan(0);
      expect(g.diagnosis.bn.length).toBeGreaterThan(0);
      expect(g.fix.steps.length).toBeGreaterThan(0);
      expect(g.verify.length).toBeGreaterThan(0);
      for (const s of g.fix.steps) expect(s.bn.length).toBeGreaterThan(0);
    }
  });

  it('every guide id follows the stable convention', () => {
    for (const g of GUIDES) {
      expect(g.id).toBe(`git.troubleshooting.${g.slug}`);
    }
  });
});

describe('troubleshooting — lookup', () => {
  it('resolves a scenario by slug and by id', () => {
    expect(getScenarioBySlug(GUIDES, 'wrong-branch')?.id).toBe('git.troubleshooting.wrong-branch');
    expect(getScenarioById(GUIDES, 'git.troubleshooting.undo-last-commit')?.slug).toBe('undo-last-commit');
  });

  it('returns undefined for unknown slugs (invalid routes)', () => {
    expect(getScenarioBySlug(GUIDES, 'nope-not-real')).toBeUndefined();
    expect(getScenarioById(GUIDES, 'git.troubleshooting.nope')).toBeUndefined();
  });

  it('navigates to adjacent scenarios in canonical order', () => {
    const first = [...GUIDES].sort((a, b) => a.order - b.order)[0];
    const { prev, next } = getAdjacentScenarios(first, GUIDES);
    expect(prev).toBeUndefined();
    expect(next?.order).toBeGreaterThan(first.order);
  });

  it('resolves related scenarios, skipping self and unknowns', () => {
    const guide = getScenarioBySlug(GUIDES, 'wrong-branch')!;
    const related = getRelatedScenarios(guide, GUIDES);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((r) => r.id !== guide.id)).toBe(true);
  });
});

describe('troubleshooting — natural problem search', () => {
  it.each([
    ['wrong branch', 'wrong-branch'],
    ['undo commit', 'undo-last-commit'],
    ['push rejected', 'push-rejected'],
    ['merge conflict', 'merge-conflict'],
    ['detached head', 'detached-head'],
    ['recover deleted commit', 'recover-commit'],
    ['nothing to commit', 'nothing-to-commit'],
    ['non-fast-forward', 'push-rejected'],
    ['force push', 'force-push'],
    ['secret', 'committed-secret'],
    ['rebase conflict', 'rebase-conflict'],
  ])('resolves "%s" → %s', (query, slug) => {
    const results = searchScenarios(query, GUIDES);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe(slug);
  });

  it('matches Bangla keywords too', () => {
    const results = searchScenarios('ভুল ব্রাঞ্চ', GUIDES);
    expect(results.some((g) => g.slug === 'wrong-branch')).toBe(true);
  });

  it('returns the full library for a blank query', () => {
    expect(searchScenarios('   ', GUIDES)).toHaveLength(GUIDES.length);
  });

  it('returns nothing for gibberish', () => {
    expect(searchScenarios('zzz-no-such-problem-zzz', GUIDES)).toHaveLength(0);
  });
});

describe('troubleshooting — filters', () => {
  it('filters by category', () => {
    const results = filterScenarios(GUIDES, { category: 'remote-push' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((g) => g.category === 'remote-push')).toBe(true);
  });

  it('filters by difficulty', () => {
    const results = filterScenarios(GUIDES, { difficulty: 'beginner' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((g) => g.difficulty === 'beginner')).toBe(true);
  });

  it('filters to beginner-safe guides', () => {
    const results = filterScenarios(GUIDES, { beginnerSafe: true });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((g) => g.safeForBeginners)).toBe(true);
  });

  it('combines query with structural filters', () => {
    const results = searchAndFilterScenarios(GUIDES, 'push', { category: 'remote-push' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((g) => g.category === 'remote-push')).toBe(true);
  });
});

describe('troubleshooting — relationships', () => {
  it('links commands to scenarios (git reset)', () => {
    const results = getScenariosForCommand('reset', GUIDES);
    const slugs = results.map((g) => g.slug);
    expect(slugs).toContain('undo-last-commit');
    expect(slugs).toContain('wrong-branch');
    expect(slugs).toContain('reset-hard');
  });

  it('links scenarios back to reference commands', () => {
    const guide = getScenarioBySlug(GUIDES, 'staged-file')!;
    const { found, missing } = getCommandsForScenario(guide, GIT_COMMANDS);
    expect(found.map((c) => c.slug)).toContain('restore');
    expect(found.map((c) => c.slug)).toContain('status');
    expect(missing).toHaveLength(0);
  });

  it('resolves lessons for a scenario', () => {
    const guide = getScenarioBySlug(GUIDES, 'detached-head')!;
    const lessons = getLessonsForScenario(guide, FUNDAMENTALS_LESSONS);
    expect(lessons.map((l) => l.id)).toContain('git.fundamentals.head');
  });

  it('skips unknown lesson ids gracefully', () => {
    const guide = { ...getScenarioBySlug(GUIDES, 'detached-head')!, lessons: ['nope'] };
    expect(getLessonsForScenario(guide, FUNDAMENTALS_LESSONS)).toHaveLength(0);
  });
});

describe('troubleshooting — decision trees', () => {
  it('walks the undo tree to the staged-file guide', () => {
    const tree = getDecisionTree(DECISION_TREES, 'undo-helper')!;
    const hop = resolveDecisionHop(tree, 'undo-q1', 1);
    expect(hop).toEqual({ kind: 'scenario', slug: 'staged-file' });
  });

  it('walks the pushed branch to a follow-up question, then to a guide', () => {
    const tree = getDecisionTree(DECISION_TREES, 'undo-helper')!;
    const hop1 = resolveDecisionHop(tree, 'undo-q1', 3);
    expect(hop1).toEqual({ kind: 'node', nodeId: 'undo-pushed-q' });
    const hop2 = resolveDecisionHop(tree, 'undo-pushed-q', 0);
    expect(hop2).toEqual({ kind: 'scenario', slug: 'undo-last-commit' });
  });

  it('walks the push tree to the diverged guide', () => {
    const tree = getDecisionTree(DECISION_TREES, 'push-helper')!;
    expect(resolveDecisionHop(tree, 'push-q1', 2)).toEqual({ kind: 'scenario', slug: 'diverged' });
  });

  it('rejects bad node ids and option indexes', () => {
    const tree = getDecisionTree(DECISION_TREES, 'push-helper')!;
    expect(resolveDecisionHop(tree, 'nope', 0)).toBeNull();
    expect(resolveDecisionHop(tree, 'push-q1', 99)).toBeNull();
    expect(getDecisionTree(DECISION_TREES, 'nope')).toBeUndefined();
  });
});

describe('troubleshooting — safety classification', () => {
  it.each([
    ['git status', 'safe'],
    ['git log --oneline', 'safe'],
    ['git diff --staged', 'safe'],
    ['git reflog', 'safe'],
    ['git remote -v', 'safe'],
    ['git fetch', 'usually-safe'],
    ['git switch main', 'usually-safe'],
    ['git pull', 'usually-safe'],
  ])('classifies "%s" as %s', (cmd, level) => {
    expect(classifyCommand(cmd).level).toBe(level);
  });

  it.each([
    ['git reset --hard HEAD~1', 'destructive'],
    ['git reset HEAD~1', 'destructive'],
    ['git restore --staged a.txt', 'destructive'],
    ['git rebase main', 'destructive'],
  ])('flags "%s" as %s (wording hedged in UI)', (cmd, level) => {
    expect(classifyCommand(cmd).level).toBe(level);
  });

  it.each([
    ['git push --force origin main', 'high-risk'],
    ['git push --force-with-lease', 'high-risk'],
  ])('flags "%s" as %s', (cmd, level) => {
    expect(classifyCommand(cmd).level).toBe(level);
  });

  it('treats unknown commands conservatively', () => {
    expect(classifyCommand('git frobnicate --yes').level).toBe('destructive');
  });
});
