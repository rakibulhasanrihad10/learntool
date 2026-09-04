import { describe, expect, it } from 'vitest';
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS } from '@/content/interview';
import { selectMockQuestions } from './mock';
import { scoreMock, scoreObjective, scoreOpen } from './scoring';
import { computeReadiness } from './readiness';
import { getUnlockedAchievementsForInterview } from './achievements';
import { InterviewProgress } from '@/types/interview';

describe('interview question bank', () => {
  it('has 80 questions with unique stable ids and orders 1–80', () => {
    expect(INTERVIEW_QUESTIONS).toHaveLength(80);
    const ids = INTERVIEW_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(80);
    for (const id of ids) expect(id.startsWith('git.interview.')).toBe(true);
    const orders = INTERVIEW_QUESTIONS.map((q) => q.order).sort((a, b) => a - b);
    expect(orders).toEqual(Array.from({ length: 80 }, (_, i) => i + 1));
  });

  it('covers all 7 categories with bilingual copy', () => {
    const cats = new Set(INTERVIEW_QUESTIONS.map((q) => q.category));
    expect([...cats].sort()).toEqual(INTERVIEW_CATEGORIES.map((c) => c.id).sort());
    for (const q of INTERVIEW_QUESTIONS) {
      expect(q.question.en.trim().length).toBeGreaterThan(0);
      expect(q.question.bn.trim().length).toBeGreaterThan(0);
      expect(q.shortAnswer.en.trim().length).toBeGreaterThan(0);
      expect(q.interviewTip.en.trim().length).toBeGreaterThan(0);
      expect(q.commonMistake.en.trim().length).toBeGreaterThan(0);
    }
  });

  it('gives objective questions exactly one correct option', () => {
    const objective = INTERVIEW_QUESTIONS.filter((q) => q.options && q.options.length > 0);
    expect(objective.length).toBeGreaterThan(0);
    for (const q of objective) {
      expect(q.options!.filter((o) => o.correct).length).toBe(1);
    }
  });

  it('keeps command text untranslated (no Bengali in labels/commands)', () => {
    const hasBengali = (s: string): boolean =>
      [...s].some((ch) => {
        const code = ch.codePointAt(0) ?? 0;
        return code >= 2432 && code <= 2559;
      });
    for (const q of INTERVIEW_QUESTIONS) {
      for (const o of q.options ?? []) {
        expect(hasBengali(o.label)).toBe(false);
      }
      if (q.exampleCommand) expect(hasBengali(q.exampleCommand)).toBe(false);
    }
  });
});

describe('mock selection', () => {
  it('returns the requested count with balanced categories when mixed', () => {
    const picked = selectMockQuestions(
      INTERVIEW_QUESTIONS,
      { difficulty: 'mixed', focus: 'mixed', count: 10 },
      0
    );
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((q) => q.category)).size).toBeGreaterThanOrEqual(5);
  });

  it('rotates with seed and respects focus filters', () => {
    const a = selectMockQuestions(INTERVIEW_QUESTIONS, { difficulty: 'mixed', focus: 'mixed', count: 10 }, 0);
    const b = selectMockQuestions(INTERVIEW_QUESTIONS, { difficulty: 'mixed', focus: 'mixed', count: 10 }, 1);
    expect(a.map((q) => q.id)).not.toEqual(b.map((q) => q.id));
    const focused = selectMockQuestions(
      INTERVIEW_QUESTIONS,
      { difficulty: 'mixed', focus: 'commands', count: 10 },
      0
    );
    expect(focused.every((q) => q.category === 'commands')).toBe(true);
  });

  it('respects difficulty mapping', () => {
    const beginner = selectMockQuestions(
      INTERVIEW_QUESTIONS,
      { difficulty: 'beginner', focus: 'mixed', count: 20 },
      0
    );
    expect(beginner.every((q) => q.difficulty === 'beginner')).toBe(true);
  });
});

describe('scoring (no AI, deterministic)', () => {
  it('scores objective options and self-ratings', () => {
    const q = INTERVIEW_QUESTIONS.find((x) => x.options && x.options.length > 0)!;
    const right = q.options!.find((o) => o.correct)!.id;
    const wrong = q.options!.find((o) => !o.correct)!.id;
    expect(scoreObjective(q, right)).toBe(true);
    expect(scoreObjective(q, wrong)).toBe(false);
    expect(scoreOpen('knew')).toBe(100);
    expect(scoreOpen('partial')).toBe(70);
    expect(scoreOpen('review')).toBe(0);
  });

  it('averages mock answers', () => {
    const { score } = scoreMock([
      { questionId: 'a', correct: true, selfRating: null, retries: 0 },
      { questionId: 'b', correct: false, selfRating: null, retries: 0 },
    ]);
    expect(score).toBe(50);
  });
});

describe('readiness', () => {
  const reviewed = (n: number): InterviewProgress => {
    const progress: InterviewProgress = {};
    for (const q of INTERVIEW_QUESTIONS.slice(0, n)) {
      progress[q.id] = { attempts: 1, reviewed: true, lastAttemptAt: new Date().toISOString() };
    }
    return progress;
  };
  it('progresses beginner → developing → ready → advanced', () => {
    expect(computeReadiness({}, []).level).toBe('beginner');
    expect(computeReadiness(reviewed(16), []).level).toBe('developing');
    expect(computeReadiness(reviewed(40), []).level).toBe('ready');
    const advanced = computeReadiness(reviewed(56), [
      { id: 'm1', finishedAt: new Date().toISOString(), config: { difficulty: 'mixed', focus: 'mixed', count: 10 }, score: 90, total: 10 },
    ]);
    expect(advanced.level).toBe('advanced');
    expect(advanced.weakCategories).toHaveLength(2);
  });
});

describe('interview achievements (pure rules)', () => {
  it('unlocks by reviewed count and mock history', () => {
    const ids = Array.from({ length: 10 }, (_, i) => `git.interview.q${i}`);
    expect(getUnlockedAchievementsForInterview(ids, [], [])).toContain('interview_10_reviewed');
    expect(getUnlockedAchievementsForInterview(ids, [], [])).not.toContain('interview_ready');
    const withMock = getUnlockedAchievementsForInterview(
      Array.from({ length: 20 }, (_, i) => `git.interview.q${i}`),
      [{ id: 'm', finishedAt: '', config: { difficulty: 'mixed', focus: 'mixed', count: 10 }, score: 85, total: 10 }],
      []
    );
    expect(withMock).toContain('interview_ready');
    expect(withMock).toContain('interview_mock_high_score');
  });
});
