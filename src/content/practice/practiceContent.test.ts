import { describe, it, expect } from 'vitest';
import { GIT_COMMANDS } from '@/content/git/commands';
import { TROUBLESHOOTING_GUIDES } from '@/content/git';
import { GIT_WORKFLOWS } from '@/content/git/workflows';
import { GITHUB_WORKFLOWS } from '@/content/github/githubWorkflows';
import { ALL_CURRICULUM_LESSONS, getLessonRoute } from '@/content/github';
import { getCommandById } from '@/utils/commandSearch';
import { getScenarioBySlug } from '@/utils/troubleshootingSearch';
import { searchGithubConcepts } from '@/utils/githubSearch';
import { GITHUB_SEARCH_ENTRIES } from '@/content/github';
import { applyAction } from '@/features/simulation/engine';
import { SimAction } from '@/features/simulation/models';
import { evaluateAllRules } from '@/features/practice/validation';
import { ASSESSMENT_ITEMS, PRACTICE_EXERCISES, getExerciseById } from './index';
import { PracticeExercise } from '@/types/practice';

describe('practice curriculum — structure', () => {
  it('ships thirty exercises with stable unique ids and sequential order', () => {
    expect(PRACTICE_EXERCISES).toHaveLength(30);
    const ids = PRACTICE_EXERCISES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith('git.practice.'))).toBe(true);
    const orders = PRACTICE_EXERCISES.map((e) => e.order);
    expect(new Set(orders).size).toBe(orders.length);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });

  it('covers every required category', () => {
    const cats = new Set(PRACTICE_EXERCISES.map((e) => e.category));
    for (const expected of [
      'fundamentals',
      'everyday',
      'branching',
      'merging',
      'rebasing',
      'remote',
      'github',
      'recovery',
      'internals',
    ]) {
      expect(cats.has(expected as never)).toBe(true);
    }
  });

  it('looks exercises up by full id or slug suffix', () => {
    expect(getExerciseById('git.practice.basic-commit')?.order).toBe(4);
    expect(getExerciseById('basic-commit')?.id).toBe('git.practice.basic-commit');
    expect(getExerciseById('nope')).toBeUndefined();
  });

  it('uses only valid difficulties and XP rewards by difficulty', () => {
    for (const ex of PRACTICE_EXERCISES) {
      expect(['beginner', 'intermediate', 'advanced']).toContain(ex.difficulty);
      expect(ex.xpReward).toBe(ex.difficulty === 'beginner' ? 10 : ex.difficulty === 'intermediate' ? 20 : 30);
      expect(ex.estimatedMinutes).toBeGreaterThan(0);
    }
  });
});

describe('practice curriculum — bilingual content', () => {
  it('provides English and Bangla copy for every user-facing string', () => {
    for (const ex of PRACTICE_EXERCISES) {
      expect(ex.title.bn.length, `${ex.id} title`).toBeGreaterThan(0);
      expect(ex.description.bn.length, `${ex.id} description`).toBeGreaterThan(0);
      expect(ex.objective.bn.length, `${ex.id} objective`).toBeGreaterThan(0);
      expect(ex.tasks.length, `${ex.id} tasks`).toBeGreaterThan(0);
      for (const task of ex.tasks) {
        expect(task.prompt.bn.length, `${ex.id}:${task.id} prompt`).toBeGreaterThan(0);
        expect(task.explanation.bn.length, `${ex.id}:${task.id} explanation`).toBeGreaterThan(0);
        if (task.kind === 'select') {
          expect(task.options.filter((o) => o.correct)).toHaveLength(1);
          for (const o of task.options) {
            // Pure command syntax stays in English; full sentences need Bangla.
            const needsBn = !o.label.startsWith('git ');
            if (needsBn) {
              expect(o.labelBn?.length, `${ex.id}:${task.id}:${o.id}`).toBeGreaterThan(0);
            }
          }
        }
        if (task.kind === 'order') {
          expect(task.items.length).toBeGreaterThan(1);
          expect([...task.items.map((i) => i.id)].sort()).toEqual([...task.correctOrder].sort());
          for (const item of task.items) {
            expect(item.labelBn?.length, `${ex.id}:${task.id}:${item.id}`).toBeGreaterThan(0);
          }
        }
      }
      for (const hint of ex.hints) {
        expect(hint.bn.length, `${ex.id} hint`).toBeGreaterThan(0);
      }
    }
  });

  it('keeps commands, branches, and hashes untranslated', () => {
    const dump = JSON.stringify(PRACTICE_EXERCISES);
    for (const token of ['git init', 'git status', 'feature/login', 'origin/main', 'README.md']) {
      expect(dump).toContain(token);
    }
  });
});

describe('practice curriculum — relationships resolve', () => {
  it('links only to real reference commands', () => {
    for (const ex of PRACTICE_EXERCISES) {
      for (const cmdId of ex.relatedCommands) {
        expect(getCommandById(GIT_COMMANDS, cmdId), `${ex.id} → ${cmdId}`).toBeDefined();
      }
      expect(ex.relatedCommands.length).toBeGreaterThan(0);
    }
  });

  it('links only to real lessons with canonical routes', () => {
    const lessonIds = new Set(ALL_CURRICULUM_LESSONS.map((l) => l.id));
    for (const ex of PRACTICE_EXERCISES) {
      for (const lessonId of ex.relatedLessons) {
        expect(lessonIds.has(lessonId), `${ex.id} → ${lessonId}`).toBe(true);
        expect(getLessonRoute(lessonId)?.path.startsWith('/learn/'), lessonId).toBe(true);
      }
    }
  });

  it('links only to real troubleshooting guides', () => {
    for (const ex of PRACTICE_EXERCISES) {
      for (const guideId of ex.relatedScenarios) {
        expect(getScenarioBySlug(TROUBLESHOOTING_GUIDES, guideId), `${ex.id} → ${guideId}`).toBeDefined();
      }
    }
  });

  it('links only to real workflows', () => {
    const workflowIds = new Set([...GIT_WORKFLOWS, ...GITHUB_WORKFLOWS].map((w) => w.id));
    for (const ex of PRACTICE_EXERCISES) {
      for (const workflowId of ex.relatedWorkflows) {
        expect(workflowIds.has(workflowId), `${ex.id} → ${workflowId}`).toBe(true);
      }
    }
  });

  it('keeps prerequisites within the curriculum and acyclic by order', () => {
    const ids = new Set(PRACTICE_EXERCISES.map((e) => e.id));
    for (const ex of PRACTICE_EXERCISES) {
      for (const pre of ex.prerequisites ?? []) {
        expect(ids.has(pre), `${ex.id} prereq ${pre}`).toBe(true);
        const preOrder = PRACTICE_EXERCISES.find((e) => e.id === pre)!.order;
        expect(preOrder, `${ex.id} prereq order`).toBeLessThan(ex.order);
      }
    }
  });
});

describe('practice curriculum — simulation tasks are solvable', () => {
  const solve = (exerciseId: string, taskId: string, actions: SimAction[]) => {
    const exercise = getExerciseById(exerciseId)!;
    const task = exercise.tasks.find((t) => t.id === taskId)!;
    if (task.kind !== 'simulate') throw new Error(`not a simulate task: ${exerciseId}:${taskId}`);
    let state = task.setup;
    for (const action of actions) {
      state = applyAction(state, action).state;
    }
    return evaluateAllRules(state, task.validation);
  };

  it('every simulate task has rules to work toward', () => {
    const simTasks = PRACTICE_EXERCISES.flatMap((e) =>
      e.tasks.filter((t) => t.kind === 'simulate')
    );
    expect(simTasks.length).toBeGreaterThan(0);
    for (const task of simTasks) {
      if (task.kind !== 'simulate') continue;
      expect(task.validation.length).toBeGreaterThan(0);
    }
  });

  it.each([
    ['git.practice.command-stage-first-change', 't1', [{ type: 'stage', files: ['README.md'] } as SimAction]],
    ['git.practice.basic-commit', 't1', [{ type: 'commit', message: 'Add feature' } as SimAction]],
    [
      'git.practice.command-everyday-flow',
      't2',
      [
        { type: 'stage' } as SimAction,
        { type: 'commit', message: 'Update docs' } as SimAction,
        { type: 'push' } as SimAction,
      ],
    ],
    [
      'git.practice.command-commit-multiple-safely',
      't2',
      [{ type: 'stage' } as SimAction, { type: 'commit', message: 'Fix both' } as SimAction],
    ],
    [
      'git.practice.create-feature-branch',
      't1',
      [
        { type: 'create-branch', branch: 'feature/login' } as SimAction,
        { type: 'switch', branch: 'feature/login' } as SimAction,
      ],
    ],
    ['git.practice.switch-branches', 't1', [{ type: 'switch', branch: 'feature' } as SimAction]],
    [
      'git.practice.feature-branch-workflow',
      't1',
      [
        { type: 'create-branch', branch: 'feature/login' } as SimAction,
        { type: 'switch', branch: 'feature/login' } as SimAction,
        { type: 'modify', file: 'app.js' } as SimAction,
        { type: 'stage' } as SimAction,
        { type: 'commit', message: 'Add login' } as SimAction,
        { type: 'push' } as SimAction,
      ],
    ],
    ['git.practice.merge-feature', 't1', [{ type: 'merge', source: 'feature' } as SimAction]],
    ['git.practice.command-fast-forward-merge', 't2', [{ type: 'merge', source: 'feature' } as SimAction]],
    ['git.practice.rebase-feature', 't1', [{ type: 'rebase', onto: 'main' } as SimAction]],
    ['git.practice.push-feature', 't1', [{ type: 'push' } as SimAction]],
    ['git.practice.fetch-changes', 't1', [{ type: 'fetch' } as SimAction]],
  ])('golden path passes %s:%s', (exerciseId, taskId, actions) => {
    const report = solve(exerciseId, taskId, actions);
    expect(
      report.verdicts.filter((v) => !v.pass).map((v) => v.label.en),
      `${exerciseId}:${taskId}`
    ).toEqual([]);
    expect(report.passed).toBe(true);
  });

  it('reset restores the initial state (replay from setup)', () => {
    const exercise = getExerciseById('git.practice.basic-commit')!;
    const task = exercise.tasks.find((t) => t.id === 't1')!;
    if (task.kind !== 'simulate') throw new Error('expected simulate task');
    const moved = applyAction(task.setup, { type: 'commit', message: 'x' }).state;
    expect(evaluateAllRules(moved, task.validation).passed).toBe(true);
    // Reset = fresh copy of the setup snapshot.
    expect(evaluateAllRules(task.setup, task.validation).passed).toBe(false);
  });
});

describe('practice curriculum — assessment', () => {
  it('covers six sections with three items each, all resolving', () => {
    expect(ASSESSMENT_ITEMS).toHaveLength(18);
    const bySection = new Map<string, number>();
    for (const item of ASSESSMENT_ITEMS) {
      bySection.set(item.section, (bySection.get(item.section) ?? 0) + 1);
      const exercise = getExerciseById(item.exerciseId);
      expect(exercise, item.id).toBeDefined();
      expect(
        exercise!.tasks.some((t) => t.id === item.taskId),
        `${item.id} task`
      ).toBe(true);
    }
    for (const section of ['fundamentals', 'branching', 'merging-rebasing', 'remote', 'recovery', 'internals']) {
      expect(bySection.get(section)).toBe(3);
    }
  });

  it('assessment sim items reference real simulate tasks', () => {
    for (const item of ASSESSMENT_ITEMS.filter((i) => ['assess-b3', 'assess-r3'].includes(i.id))) {
      const exercise = getExerciseById(item.exerciseId)!;
      const task = exercise.tasks.find((t) => t.id === item.taskId)!;
      expect(task.kind).toBe('simulate');
    }
  });
});

describe('practice curriculum — search keywords', () => {
  it('matches natural-language queries per exercise', () => {
    const haystack = (ex: PracticeExercise) =>
      [ex.title.en, ex.title.bn, ex.description.en, ...ex.tags, ...ex.keywords].join(' ').toLowerCase();
    const find = (query: string) =>
      PRACTICE_EXERCISES.filter((ex) =>
        query
          .toLowerCase()
          .split(/[\s,;]+/)
          .filter(Boolean)
          .every((t) => haystack(ex).includes(t))
      );
    expect(find('merge conflict').map((e) => e.id)).toContain('git.practice.merge-conflict-flow');
    expect(find('undo commit').map((e) => e.id)).toContain('git.practice.command-undo-unwanted-change');
    expect(find('branch').length).toBeGreaterThan(3);
    expect(find('remote').length).toBeGreaterThan(2);
    expect(find('rebase').map((e) => e.id)).toContain('git.practice.rebase-feature');
    expect(find('recover deleted branch').map((e) => e.id)).toContain('git.practice.recover-deleted-branch');
  });

  it('keeps github concept search intact', () => {
    expect(searchGithubConcepts('pull request', GITHUB_SEARCH_ENTRIES).length).toBeGreaterThan(0);
  });
});
