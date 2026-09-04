import { describe, it, expect, beforeEach } from 'vitest';
import {
  PRACTICE_STORAGE_KEY,
  loadPracticeProgress,
  practiceStats,
  recordPracticeAttempt,
} from './progress';
import { PracticeProgress } from '@/types/practice';

/** Minimal localStorage stub — vitest runs in node without a window. */
function installStorageStub() {
  const store = new Map<string, string>();
  const stub = {
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => store.clear(),
  };
  Object.defineProperty(globalThis, 'window', { value: { localStorage: stub }, configurable: true });
  return stub;
}

installStorageStub();

describe('practice progress — attempt recording', () => {
  let prev: PracticeProgress;

  beforeEach(() => {
    prev = {};
    (globalThis as unknown as { window: Storage }).window.localStorage.removeItem(PRACTICE_STORAGE_KEY);
  });

  it('creates a first-completion entry with best score', () => {
    const { progress, isNewBest, isFirstCompletion } = recordPracticeAttempt(prev, {
      exerciseId: 'git.practice.basic-commit',
      score: 95,
      hintsUsed: 1,
      completed: true,
    });
    expect(isNewBest).toBe(true);
    expect(isFirstCompletion).toBe(true);
    expect(progress['git.practice.basic-commit']).toMatchObject({
      attempts: 1,
      bestScore: 95,
      completed: true,
      hintsUsed: 1,
    });
    expect(progress['git.practice.basic-commit'].completedAt).toBeDefined();
  });

  it('keeps the best score across attempts and counts every try', () => {
    let current = recordPracticeAttempt(prev, {
      exerciseId: 'ex',
      score: 60,
      hintsUsed: 2,
      completed: true,
    }).progress;
    const second = recordPracticeAttempt(current, {
      exerciseId: 'ex',
      score: 100,
      hintsUsed: 0,
      completed: true,
    });
    expect(second.isNewBest).toBe(true);
    expect(second.isFirstCompletion).toBe(false);
    expect(second.progress.ex.bestScore).toBe(100);
    expect(second.progress.ex.attempts).toBe(2);
    expect(second.progress.ex.hintsUsed).toBe(2);

    const third = recordPracticeAttempt(second.progress, {
      exerciseId: 'ex',
      score: 40,
      hintsUsed: 0,
      completed: true,
    });
    expect(third.isNewBest).toBe(false);
    expect(third.progress.ex.bestScore).toBe(100);
  });

  it('persists progress to localStorage and reloads it', () => {
    const { progress } = recordPracticeAttempt(prev, {
      exerciseId: 'ex',
      score: 80,
      hintsUsed: 0,
      completed: true,
    });
    expect(loadPracticeProgress()).toEqual(progress);
  });

  it('summarizes completion counts, attempts, and average best', () => {
    let p = recordPracticeAttempt(prev, { exerciseId: 'a', score: 100, hintsUsed: 0, completed: true }).progress;
    p = recordPracticeAttempt(p, { exerciseId: 'b', score: 50, hintsUsed: 0, completed: false }).progress;
    expect(practiceStats(p)).toEqual({ completedCount: 1, totalAttempts: 2, averageBest: 75 });
    expect(practiceStats({})).toEqual({ completedCount: 0, totalAttempts: 0, averageBest: 0 });
  });
});
