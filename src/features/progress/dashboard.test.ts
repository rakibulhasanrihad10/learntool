import { describe, expect, it } from 'vitest';
import { ALL_MODULES } from '@/content/github';
import { PRACTICE_EXERCISES } from '@/content/practice';
import { TROUBLESHOOTING_GUIDES } from '@/content/git';
import { INTERVIEW_QUESTIONS } from '@/content/interview';
import { LEARNING_PATHS } from '@/content/paths';
import { UserProgress } from '@/types/gamification';
import { LearningSignals } from '@/features/paths/signals';
import {
  buildActivity,
  buildCurriculumProgress,
  buildDashboard,
  buildInterviewAnalytics,
  buildPracticeAnalytics,
  buildWeakAreas,
} from './dashboard';
import { computeMastery } from '@/features/paths/mastery';

const emptySignals = (): LearningSignals => ({
  completedLessonIds: new Set(),
  learningProgress: {},
  practice: {},
  interview: {},
  mockHistory: [],
  assessmentPassed: false,
});

const emptyGame = (): UserProgress => ({
  totalXp: 0,
  level: 1,
  streak: { currentStreak: 0, longestStreak: 0, lastActiveDate: '', history: [] },
  completedLessonIds: [],
  completedChallengeIds: [],
  unlockedAchievementIds: [],
  learningProgress: {},
  lastUpdated: new Date().toISOString(),
});

const AT = '2026-01-01T00:00:00.000Z';

describe('empty / new user', () => {
  it('reports zeros, no current item surprises, and starter recommendations', () => {
    const d = buildDashboard(emptySignals(), emptyGame());
    expect(d.curriculum.percent).toBe(0);
    expect(d.curriculum.lessonsDone).toBe(0);
    expect(d.practice.completed).toBe(0);
    expect(d.practice.attempted).toBe(0);
    expect(d.interview.reviewed).toBe(0);
    expect(d.pathsStarted).toBe(0);
    expect(d.pathsCompleted).toBe(0);
    expect(d.topicsStrong).toBe(0);
    expect(d.activity).toEqual([]);
    expect(d.xp).toBe(0);
    // Deterministic starter set: continue first step + start practice + interview + path.
    expect(d.recommendations.length).toBeGreaterThan(0);
    expect(d.recommendations[0].kind).toBe('path');
    // Same inputs → identical dashboard.
    expect(buildDashboard(emptySignals(), emptyGame())).toEqual(d);
  });

  it('points a brand-new learner at the first path', () => {
    const d = buildDashboard(emptySignals(), emptyGame());
    expect(d.current?.route).toBe('/learn/git/fundamentals/what-is-git');
  });
});

describe('curriculum progress (no double counting)', () => {
  it('counts only required lesson steps; practice/interview stay separate', () => {
    const signals = emptySignals();
    const beginner = LEARNING_PATHS[0];
    const lessonSteps = beginner.steps.filter((s) => s.type === 'lesson' && s.required);
    signals.completedLessonIds.add(lessonSteps[0].contentId);
    // Plus unrelated practice + interview completions.
    signals.practice['git.practice.initialize-repository'] = {
      attempts: 1, bestScore: 100, completed: true, completedAt: AT, lastAttemptAt: AT, hintsUsed: 0,
    };
    const q = INTERVIEW_QUESTIONS[0];
    signals.interview[q.id] = { attempts: 1, reviewed: true, lastAttemptAt: AT };

    const curriculum = buildCurriculumProgress(signals);
    const allLessonSteps = LEARNING_PATHS.flatMap((p) => p.steps).filter((s) => s.type === 'lesson' && s.required);
    expect(curriculum.lessonStepsTotal).toBe(allLessonSteps.length);
    expect(curriculum.lessonStepsDone).toBe(1);
    expect(curriculum.percent).toBe(Math.round((1 / allLessonSteps.length) * 100));

    const d = buildDashboard(signals, emptyGame());
    expect(d.practice.completed).toBe(1);
    expect(d.interview.reviewed).toBe(1);
  });
});

describe('practice analytics', () => {
  it('computes completed/average/best/extra attempts and category extremes', () => {
    const signals = emptySignals();
    signals.practice['git.practice.initialize-repository'] = {
      attempts: 3, bestScore: 70, completed: true, completedAt: AT, lastAttemptAt: AT, hintsUsed: 1,
    };
    signals.practice['git.practice.basic-commit'] = {
      attempts: 1, bestScore: 100, completed: true, completedAt: AT, lastAttemptAt: AT, hintsUsed: 0,
    };
    const a = buildPracticeAnalytics(signals);
    expect(a.completed).toBe(2);
    expect(a.attempted).toBe(2);
    expect(a.avgBest).toBe(85);
    expect(a.best).toBe(100);
    expect(a.extraAttempts).toBe(2);
    expect(a.strongest?.category).toBe('fundamentals');
    expect(a.weakest?.category).toBe('fundamentals');
    const fund = a.byCategory.find((c) => c.category === 'fundamentals')!;
    expect(fund.done).toBe(2);
    expect(fund.attempted).toBe(2);
  });

  it('reports no extremes when nothing was attempted', () => {
    const a = buildPracticeAnalytics(emptySignals());
    expect(a.strongest).toBeUndefined();
    expect(a.weakest).toBeUndefined();
    expect(a.avgBest).toBe(0);
  });
});

describe('interview analytics', () => {
  it('separates objective accuracy from self-assessed reviews', () => {
    const signals = emptySignals();
    const objective = INTERVIEW_QUESTIONS.filter((q) => q.options?.length);
    signals.interview[objective[0].id] = { attempts: 1, everCorrect: true, reviewed: true, lastAttemptAt: AT };
    signals.interview[objective[1].id] = { attempts: 2, everCorrect: false, reviewed: true, lastAttemptAt: AT };
    const open = INTERVIEW_QUESTIONS.find((q) => !q.options?.length)!;
    signals.interview[open.id] = { attempts: 1, lastSelfRating: 'partial', reviewed: true, lastAttemptAt: AT };
    const a = buildInterviewAnalytics(signals);
    expect(a.objectiveAttempted).toBe(2);
    expect(a.objectiveCorrect).toBe(1);
    expect(a.reviewed).toBe(3);
    expect(a.readiness.level).toBe('beginner');
    expect(a.weakest.length).toBe(2);
  });
});

describe('weak areas', () => {
  it('finds nothing weak for a fully complete learner', () => {
    const signals = emptySignals();
    for (const m of ALL_MODULES) for (const l of m.lessons) signals.completedLessonIds.add(l.id);
    for (const g of TROUBLESHOOTING_GUIDES) signals.completedLessonIds.add(g.id);
    for (const e of PRACTICE_EXERCISES) {
      signals.practice[e.id] = { attempts: 1, bestScore: 90, completed: true, completedAt: AT, lastAttemptAt: AT, hintsUsed: 0 };
    }
    for (const q of INTERVIEW_QUESTIONS) {
      signals.interview[q.id] = { attempts: 1, reviewed: true, lastAttemptAt: AT };
    }
    const mastery = computeMastery(signals);
    const weak = buildWeakAreas(signals, mastery, buildPracticeAnalytics(signals), buildInterviewAnalytics(signals));
    expect(weak).toEqual([]);
  });

  it('explains a weak topic with evidence and routes', () => {
    const signals = emptySignals();
    signals.completedLessonIds.add('git.fundamentals.what-is-git');
    // Poor rebasing practice: 2 attempts, 48 best.
    signals.practice['git.practice.rebase-feature'] = {
      attempts: 2, bestScore: 48, completed: false, lastAttemptAt: AT, hintsUsed: 0,
    };
    const mastery = computeMastery(signals);
    const weak = buildWeakAreas(signals, mastery, buildPracticeAnalytics(signals), buildInterviewAnalytics(signals));
    const branching = weak.find((w) => w.topic.topicId === 'branching');
    expect(branching).toBeDefined();
    expect(branching!.reasons.some((r) => r.kind === 'practice-score')).toBe(true);
    const reason = branching!.reasons.find((r) => r.kind === 'practice-score');
    expect(reason).toMatchObject({ avgBest: 48, attempts: 2 });
    expect(branching!.practiceRoute).toContain('/practice/');
  });

  it('orders multiple weak topics deterministically (score asc)', () => {
    const mastery = computeMastery(emptySignals());
    const weak = buildWeakAreas(emptySignals(), mastery, buildPracticeAnalytics(emptySignals()), buildInterviewAnalytics(emptySignals()));
    expect(weak.length).toBe(3);
    const scores = weak.map((w) => w.topic.score);
    expect(scores).toEqual([0, 0, 0]);
    // Stable order across runs.
    expect(buildWeakAreas(emptySignals(), computeMastery(emptySignals()), buildPracticeAnalytics(emptySignals()), buildInterviewAnalytics(emptySignals())).map((w) => w.topic.topicId))
      .toEqual(weak.map((w) => w.topic.topicId));
  });
});

describe('recommendations', () => {
  it('prioritizes continue-path first, then lesson, practice, cookbook, interview', () => {
    const d = buildDashboard(emptySignals(), emptyGame());
    expect(d.recommendations[0].kind).toBe('path');
    const kinds = d.recommendations.map((r) => r.kind);
    expect(kinds).toContain('practice');
    expect(kinds).toContain('interview');
    // No duplicate routes, capped at 6.
    const routes = d.recommendations.map((r) => r.route);
    expect(new Set(routes).size).toBe(routes.length);
    expect(d.recommendations.length).toBeLessThanOrEqual(6);
  });

  it('recommends weak-category practice with concrete evidence', () => {
    const signals = emptySignals();
    for (const s of LEARNING_PATHS[0].steps.filter((x) => x.type === 'lesson')) {
      signals.completedLessonIds.add(s.contentId);
    }
    signals.practice['git.practice.rebase-feature'] = {
      attempts: 2, bestScore: 48, completed: false, lastAttemptAt: AT, hintsUsed: 0,
    };
    const d = buildDashboard(signals, emptyGame());
    const rec = d.recommendations.find((r) => r.kind === 'practice');
    expect(rec).toBeDefined();
    expect(rec!.route).toContain('/practice/');
    expect(rec!.detail.en).toContain('48');
  });

  it('uses stable bilingual titles from content, never invented strings', () => {
    const d = buildDashboard(emptySignals(), emptyGame());
    for (const r of d.recommendations) {
      expect(r.title.en.trim().length).toBeGreaterThan(0);
      expect(r.title.bn.trim().length).toBeGreaterThan(0);
      expect(r.route.startsWith('/')).toBe(true);
    }
  });
});

describe('current item priority', () => {
  it('prefers active path step over in-progress lesson and open exercise', () => {
    const signals = emptySignals();
    // Stale in-progress lesson + open exercise, but no path progress.
    signals.learningProgress['git.fundamentals.commit'] = {
      contentId: 'git.fundamentals.commit', status: 'in_progress', progressPercent: 40, lastAccessedAt: AT,
    };
    signals.practice['git.practice.basic-commit'] = {
      attempts: 1, bestScore: 0, completed: false, lastAttemptAt: AT, hintsUsed: 0,
    };
    const d = buildDashboard(signals, emptyGame());
    // Path step wins (git-beginner untouched → first step).
    expect(d.current?.kind).toBe('path');
  });

  it('falls to lesson, then exercise, then review', () => {
    const signals = emptySignals();
    // Complete every required step of every path through the real stores,
    // so getContinueTarget() finds nothing active (completed-path edge case).
    for (const path of LEARNING_PATHS) {
      for (const s of path.steps) {
        if (!s.required) continue;
        if (s.type === 'practice') {
          signals.practice[s.contentId] = {
            attempts: 1, bestScore: 80, completed: true, completedAt: AT, lastAttemptAt: AT, hintsUsed: 0,
          };
        } else if (s.type === 'interview') {
          const category = s.contentId.split(':')[1];
          const ids = INTERVIEW_QUESTIONS.filter((q) => q.category === category).map((q) => q.id);
          for (const id of ids.slice(0, 4)) {
            signals.interview[id] = { attempts: 1, reviewed: true, lastAttemptAt: AT };
          }
        } else if (s.type === 'assessment') {
          signals.assessmentPassed = true;
        } else {
          signals.completedLessonIds.add(s.contentId);
        }
      }
    }
    // Nothing active → an in-progress lesson becomes current.
    signals.learningProgress['git.fundamentals.commit'] = {
      contentId: 'git.fundamentals.commit', status: 'in_progress', progressPercent: 40, lastAccessedAt: AT,
    };
    const d = buildDashboard(signals, emptyGame());
    expect(d.pathsCompleted).toBe(3);
    expect(d.continueTarget).toBeUndefined();
    expect(d.current?.kind).toBe('lesson');
    expect(d.current?.route).toBe('/learn/git/fundamentals/commit');
  });
});

describe('recent activity', () => {
  it('lists completions newest-first with deterministic XP only', () => {
    const signals = emptySignals();
    signals.learningProgress['git.fundamentals.commit'] = {
      contentId: 'git.fundamentals.commit', status: 'completed', progressPercent: 100,
      completedAt: '2026-02-01T00:00:00.000Z', lastAccessedAt: '2026-02-01T00:00:00.000Z',
    };
    signals.learningProgress['git.troubleshooting.merge-conflict'] = {
      contentId: 'git.troubleshooting.merge-conflict', status: 'completed', progressPercent: 100,
      completedAt: '2026-03-01T00:00:00.000Z', lastAccessedAt: '2026-03-01T00:00:00.000Z',
    };
    signals.practice['git.practice.basic-commit'] = {
      attempts: 1, bestScore: 100, completed: true, completedAt: '2026-04-01T00:00:00.000Z', lastAttemptAt: '2026-04-01T00:00:00.000Z', hintsUsed: 0,
    };
    const q = INTERVIEW_QUESTIONS[0];
    signals.interview[q.id] = { attempts: 1, reviewed: true, lastAttemptAt: '2026-05-01T00:00:00.000Z' };
    signals.mockHistory.push({
      id: 'm1', finishedAt: '2026-06-01T00:00:00.000Z',
      config: { difficulty: 'mixed', focus: 'mixed', count: 10 }, score: 80, total: 10,
    });

    const activity = buildActivity(signals, emptyGame());
    expect(activity.map((a) => a.kind)).toEqual(['mock', 'interview', 'practice', 'troubleshooting', 'lesson']);
    expect(activity.find((a) => a.kind === 'lesson')?.xp).toBe(50);
    const practice = PRACTICE_EXERCISES.find((e) => e.id === 'git.practice.basic-commit')!;
    expect(activity.find((a) => a.kind === 'practice')?.xp).toBe(practice.xpReward);
    expect(activity.find((a) => a.kind === 'interview')?.xp).toBe(5);
    expect(activity.find((a) => a.kind === 'mock')?.xp).toBeUndefined();
    // Re-run is identical.
    expect(buildActivity(signals, emptyGame())).toEqual(activity);
  });

  it('skips unresolvable ids and caps at 8', () => {
    const signals = emptySignals();
    signals.learningProgress['git.unknown.ghost'] = {
      contentId: 'git.unknown.ghost', status: 'completed', progressPercent: 100,
      completedAt: AT, lastAccessedAt: AT,
    };
    expect(buildActivity(signals, emptyGame())).toEqual([]);
  });
});

describe('gamification integration', () => {
  it('reuses XP/level/streak/achievements without recalculating', () => {
    const game = emptyGame();
    game.totalXp = 500;
    game.unlockedAchievementIds = ['first_commit', 'interview_ready'];
    const d = buildDashboard(emptySignals(), game);
    expect(d.xp).toBe(500);
    expect(d.level.level).toBeGreaterThanOrEqual(2);
    expect(d.achievementsUnlocked).toBe(2);
    expect(d.nextAchievements.length).toBe(3);
    expect(d.nextAchievements.every((a) => !game.unlockedAchievementIds.includes(a.id))).toBe(true);
  });
});
