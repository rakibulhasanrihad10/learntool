import { describe, it, expect } from 'vitest';
import {
  OVERALL_LEVEL_META,
  bandForScore,
  overallLevel,
  scoreAssessment,
  scoreExercise,
  scoreTask,
} from './scoring';
import { TaskAttempt } from '@/types/practice';

const attempt = (passed: boolean, retries = 0): TaskAttempt => ({
  taskId: 't',
  passed,
  retries,
  hintsShown: 0,
});

describe('scoring — tasks', () => {
  it('awards 100 for a first-try pass', () => {
    expect(scoreTask(attempt(true, 0))).toBe(100);
  });

  it('awards partial credit for a pass after retries', () => {
    expect(scoreTask(attempt(true, 2))).toBe(70);
  });

  it('awards zero for failure', () => {
    expect(scoreTask(attempt(false, 3))).toBe(0);
  });
});

describe('scoring — exercises', () => {
  it('averages task scores into bands', () => {
    expect(scoreExercise([attempt(true), attempt(true)], 0)).toEqual({ score: 100, band: 'mastered' });
    expect(scoreExercise([attempt(true), attempt(true, 1)], 0)).toEqual({ score: 85, band: 'strong' });
    expect(scoreExercise([attempt(true, 1), attempt(false)], 0)).toEqual({ score: 35, band: 'review' });
  });

  it('deducts five points per hint with a floor of zero', () => {
    expect(scoreExercise([attempt(true)], 1)).toEqual({ score: 95, band: 'strong' });
    expect(scoreExercise([attempt(false)], 40)).toEqual({ score: 0, band: 'review' });
  });

  it('scores an empty attempt list as review', () => {
    expect(scoreExercise([], 0)).toEqual({ score: 0, band: 'review' });
  });

  it('classifies band boundaries', () => {
    expect(bandForScore(100)).toBe('mastered');
    expect(bandForScore(99)).toBe('strong');
    expect(bandForScore(80)).toBe('strong');
    expect(bandForScore(79)).toBe('needs-practice');
    expect(bandForScore(60)).toBe('needs-practice');
    expect(bandForScore(59)).toBe('review');
  });
});

describe('scoring — assessment', () => {
  const answers = (section: string, correct: number, total: number) =>
    Array.from({ length: total }, (_, i) => ({
      itemId: `${section}-${i}`,
      section: section as never,
      correct: i < correct,
    }));

  it('scores each section independently', () => {
    const results = scoreAssessment([
      ...answers('fundamentals', 3, 3),
      ...answers('remote', 1, 3),
    ]);
    const fund = results.find((r) => r.section === 'fundamentals')!;
    expect(fund).toMatchObject({ correct: 3, total: 3, level: 'strong' });
    const remote = results.find((r) => r.section === 'remote')!;
    expect(remote).toMatchObject({ correct: 1, total: 3, level: 'needs-practice' });
    const empty = results.find((r) => r.section === 'internals')!;
    expect(empty).toMatchObject({ correct: 0, total: 0, level: 'needs-practice' });
  });

  it('classifies section levels at 80/60 boundaries', () => {
    const results = scoreAssessment([...answers('branching', 4, 5), ...answers('recovery', 3, 5)]);
    expect(results.find((r) => r.section === 'branching')!.level).toBe('strong');
    expect(results.find((r) => r.section === 'recovery')!.level).toBe('developing');
  });

  it('derives the overall practitioner level from the mean', () => {
    expect(overallLevel([])).toBe('git-novice');
    expect(
      overallLevel([
        { section: 'fundamentals', correct: 3, total: 3, level: 'strong' },
        { section: 'remote', correct: 3, total: 3, level: 'strong' },
      ])
    ).toBe('confident-practitioner');
    expect(
      overallLevel([
        { section: 'fundamentals', correct: 2, total: 3, level: 'developing' },
        { section: 'remote', correct: 2, total: 3, level: 'developing' },
      ])
    ).toBe('intermediate-practitioner');
    expect(
      overallLevel([
        { section: 'fundamentals', correct: 0, total: 3, level: 'needs-practice' },
      ])
    ).toBe('git-novice');
  });

  it('labels every overall level bilingually', () => {
    for (const level of Object.keys(OVERALL_LEVEL_META) as Array<keyof typeof OVERALL_LEVEL_META>) {
      expect(OVERALL_LEVEL_META[level].en.length).toBeGreaterThan(0);
      expect(OVERALL_LEVEL_META[level].bn.length).toBeGreaterThan(0);
    }
  });
});
