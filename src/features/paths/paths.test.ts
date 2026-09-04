import { describe, expect, it } from 'vitest';
import { GIT_COMMANDS, TROUBLESHOOTING_GUIDES } from '@/content/git';
import { ALL_MODULES, getLessonRoute } from '@/content/github';
import { PRACTICE_EXERCISES, getExerciseById } from '@/content/practice';
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS } from '@/content/interview';
import { LEARNING_PATHS } from '@/content/paths';
import { getCommandById } from '@/utils/commandSearch';
import { LearningPathStep } from '@/types/learningPath';
import { isStepComplete, stepRoute, summarizePath, getContinueTarget } from './progress';
import { computeMastery, MASTERY_TOPICS } from './mastery';
import { getNextSteps, getWhatNextForLesson, getWeakAreaReviews } from './recommend';
import { searchLearningPaths } from './search';
import { ASSESSMENT_QUIZ_ID, LearningSignals } from './signals';

const emptySignals = (): LearningSignals => ({
  completedLessonIds: new Set(),
  learningProgress: {},
  practice: {},
  interview: {},
  mockHistory: [],
  assessmentPassed: false,
});

describe('learning path schema', () => {
  it('has 3 git paths with unique stable ids in order', () => {
    expect(LEARNING_PATHS.map((p) => p.id)).toEqual(['git-beginner', 'git-intermediate', 'git-advanced']);
    for (const path of LEARNING_PATHS) {
      expect(path.subjectId).toBe('git');
      expect(path.title.en.trim().length).toBeGreaterThan(0);
      expect(path.title.bn.trim().length).toBeGreaterThan(0);
      expect(path.description.en.trim().length).toBeGreaterThan(0);
      expect(path.description.bn.trim().length).toBeGreaterThan(0);
      expect(path.outcomes.length).toBeGreaterThan(0);
      for (const o of path.outcomes) {
        expect(o.en.trim().length).toBeGreaterThan(0);
        expect(o.bn.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('has sequential orders, unique namespaced step ids, and valid steps', () => {
    const validTypes = ['lesson', 'practice', 'workflow', 'troubleshooting', 'assessment', 'interview', 'command', 'explorer'];
    for (const path of LEARNING_PATHS) {
      expect(path.steps.length).toBeGreaterThan(10);
      const orders = path.steps.map((s) => s.order);
      expect(orders).toEqual(Array.from({ length: orders.length }, (_, i) => i + 1));
      const ids = path.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const step of path.steps) {
        expect(step.id.startsWith(`${path.id}.`)).toBe(true);
        expect(step.pathId).toBe(path.id);
        expect(validTypes).toContain(step.type);
        expect(step.title.en.trim().length).toBeGreaterThan(0);
        expect(step.title.bn.trim().length).toBeGreaterThan(0);
        expect(step.description.bn.trim().length).toBeGreaterThan(0);
        expect(step.whyItMatters.en.trim().length).toBeGreaterThan(0);
        expect(step.whyItMatters.bn.trim().length).toBeGreaterThan(0);
        expect(step.estimatedMinutes).toBeGreaterThan(0);
      }
      expect(path.steps.some((s) => s.required)).toBe(true);
    }
  });

  it('keeps prerequisites inside the path, earlier, and acyclic', () => {
    for (const path of LEARNING_PATHS) {
      const byId = new Map(path.steps.map((s) => [s.id, s]));
      for (const step of path.steps) {
        expect(step.prerequisites).not.toContain(step.id);
        for (const pre of step.prerequisites) {
          const target = byId.get(pre);
          expect(target, `${step.id} prerequisite ${pre} must exist`).toBeDefined();
          expect(target!.order).toBeLessThan(step.order);
        }
      }
    }
  });
});

describe('step references resolve to real content', () => {
  it('every step reference exists and every step has a route', () => {
    for (const path of LEARNING_PATHS) {
      for (const step of path.steps) {
        switch (step.type) {
          case 'lesson':
            expect(getLessonRoute(step.contentId), `${step.id} lesson`).not.toBeNull();
            break;
          case 'practice':
            expect(getExerciseById(step.contentId), `${step.id} exercise`).toBeDefined();
            break;
          case 'troubleshooting':
            expect(TROUBLESHOOTING_GUIDES.some((g) => g.id === step.contentId), `${step.id} guide`).toBe(true);
            break;
          case 'command':
            expect(getCommandById(GIT_COMMANDS, step.contentId), `${step.id} command`).toBeDefined();
            break;
          case 'interview': {
            const category = step.contentId.split(':')[1];
            expect(INTERVIEW_CATEGORIES.some((c) => c.id === category), `${step.id} category`).toBe(true);
            break;
          }
          case 'assessment':
            expect(step.contentId).toBe('git.assessment.skill');
            break;
          case 'workflow':
          case 'explorer':
            expect(step.route, `${step.id} needs explicit route`).toBeTruthy();
            break;
        }
        expect(stepRoute(step), `${step.id} route`).not.toBeNull();
      }
    }
  });

  it('covers Learn → Practice → Troubleshoot → Assess → Interview in each path', () => {
    for (const path of LEARNING_PATHS) {
      const types = new Set(path.steps.map((s) => s.type));
      for (const t of ['lesson', 'practice', 'troubleshooting', 'assessment', 'interview'] as const) {
        expect(types.has(t), `${path.id} should include ${t}`).toBe(true);
      }
    }
  });
});

describe('step completion reuses existing stores', () => {
  const beginner = LEARNING_PATHS[0];

  function stepByType(type: LearningPathStep['type']): LearningPathStep {
    const step = beginner.steps.find((s) => s.type === type);
    if (!step) throw new Error(`no ${type} step in beginner path`);
    return step;
  }

  it('completes lessons/troubleshooting from completedLessonIds', () => {
    const lesson = stepByType('lesson');
    const signals = emptySignals();
    expect(isStepComplete(lesson, signals)).toBe(false);
    signals.completedLessonIds.add(lesson.contentId);
    expect(isStepComplete(lesson, signals)).toBe(true);

    const trouble = stepByType('troubleshooting');
    expect(isStepComplete(trouble, emptySignals())).toBe(false);
    const resolved = emptySignals();
    resolved.completedLessonIds.add(trouble.contentId);
    expect(isStepComplete(trouble, resolved)).toBe(true);
  });

  it('completes practice from practice progress and assessment from quiz record', () => {
    const practice = stepByType('practice');
    const signals = emptySignals();
    signals.practice[practice.contentId] = {
      attempts: 2, bestScore: 80, completed: true, lastAttemptAt: new Date().toISOString(), hintsUsed: 0,
    };
    expect(isStepComplete(practice, signals)).toBe(true);

    const assessment = stepByType('assessment');
    expect(assessment.contentId).toBe('git.assessment.skill');
    expect(ASSESSMENT_QUIZ_ID).toBe('git.assessment.skill');
    expect(isStepComplete(assessment, emptySignals())).toBe(false);
    expect(isStepComplete(assessment, { ...emptySignals(), assessmentPassed: true })).toBe(true);
  });

  it('completes interview steps after the review threshold in that category', () => {
    const intermediate = LEARNING_PATHS[1];
    const step = intermediate.steps.find((s) => s.type === 'interview')!;
    const category = step.contentId.split(':')[1];
    const ids = INTERVIEW_QUESTIONS.filter((q) => q.category === category).map((q) => q.id);
    expect(ids.length).toBeGreaterThanOrEqual(4);
    const signals = emptySignals();
    for (const id of ids.slice(0, 3)) {
      signals.interview[id] = { attempts: 1, reviewed: true, lastAttemptAt: new Date().toISOString() };
    }
    expect(isStepComplete(step, signals)).toBe(false);
    signals.interview[ids[3]] = { attempts: 1, reviewed: true, lastAttemptAt: new Date().toISOString() };
    expect(isStepComplete(step, signals)).toBe(true);
  });
});

describe('path progress', () => {
  const beginner = LEARNING_PATHS[0];

  it('starts at 0% with the first step current and no activity', () => {
    const summary = summarizePath(beginner, emptySignals());
    expect(summary.percent).toBe(0);
    expect(summary.started).toBe(false);
    expect(summary.complete).toBe(false);
    expect(summary.currentStepId).toBe(beginner.steps[0].id);
    expect(summary.lastActivityAt).toBeUndefined();
  });

  it('advances current step and percent as required steps complete', () => {
    const signals = emptySignals();
    const first = beginner.steps[0];
    signals.completedLessonIds.add(first.contentId);
    const summary = summarizePath(beginner, signals);
    expect(summary.statusByStep[first.id]).toBe('completed');
    expect(summary.currentStepId).toBe(beginner.steps[1].id);
    expect(summary.percent).toBeGreaterThan(0);
    expect(summary.started).toBe(true);
  });

  it('marks steps with unmet prerequisites as suggested, never locked', () => {
    const summary = summarizePath(beginner, emptySignals());
    const withPrereqs = beginner.steps.filter((s) => s.prerequisites.length > 0);
    expect(withPrereqs.length).toBeGreaterThan(0);
    // First step has no prerequisites → current; later steps with prereqs → suggested.
    expect(summary.statusByStep[withPrereqs[0].id]).toBe('suggested');
  });

  it('recommends the most recently active incomplete path', () => {
    expect(getContinueTarget(LEARNING_PATHS, emptySignals())?.path.id).toBe('git-beginner');
    const signals = emptySignals();
    const advancedStep = LEARNING_PATHS[2].steps[0];
    signals.completedLessonIds.add(advancedStep.contentId);
    signals.learningProgress[advancedStep.contentId] = {
      contentId: advancedStep.contentId, status: 'completed', progressPercent: 100,
      completedAt: new Date().toISOString(), lastAccessedAt: '2999-01-01T00:00:00.000Z',
    };
    expect(getContinueTarget(LEARNING_PATHS, signals)?.path.id).toBe('git-advanced');
  });
});

describe('mastery', () => {
  it('reports not-started everywhere for empty signals', () => {
    const mastery = computeMastery(emptySignals());
    expect(mastery).toHaveLength(MASTERY_TOPICS.length);
    for (const m of mastery) {
      expect(m.level).toBe('not-started');
      expect(m.score).toBe(0);
    }
  });

  it('reaches strong with full completion across all stores', () => {
    const signals = emptySignals();
    // Complete everything the topics measure (all modules, not just the
    // ALL_CURRICULUM_LESSONS subset which omits workflow/branching/etc.).
    for (const m of ALL_MODULES) for (const l of m.lessons) signals.completedLessonIds.add(l.id);
    for (const g of TROUBLESHOOTING_GUIDES) signals.completedLessonIds.add(g.id);
    for (const e of PRACTICE_EXERCISES) {
      signals.practice[e.id] = { attempts: 1, bestScore: 90, completed: true, lastAttemptAt: new Date().toISOString(), hintsUsed: 0 };
    }
    for (const q of INTERVIEW_QUESTIONS) {
      signals.interview[q.id] = { attempts: 1, reviewed: true, lastAttemptAt: new Date().toISOString() };
    }
    const mastery = computeMastery({ ...signals, assessmentPassed: true });
    for (const m of mastery) {
      expect(m.score).toBeGreaterThanOrEqual(80);
      expect(m.level).toBe('strong');
    }
  });
});

describe('recommendations', () => {
  const beginner = LEARNING_PATHS[0];

  it('returns current + next incomplete steps deterministically', () => {
    const summary = summarizePath(beginner, emptySignals());
    const next = getNextSteps(beginner, summary, 3);
    expect(next.map((s) => s.id)).toEqual(beginner.steps.slice(0, 3).map((s) => s.id));
    // Same input → same output.
    expect(getNextSteps(beginner, summarizePath(beginner, emptySignals()), 3)).toEqual(next);
  });

  it('suggests follow-ups after a lesson from containing paths', () => {
    const lessonId = 'git.fundamentals.commit';
    const summaries: Record<string, ReturnType<typeof summarizePath>> = {};
    for (const p of LEARNING_PATHS) summaries[p.id] = summarizePath(p, emptySignals());
    const whatNext = getWhatNextForLesson(lessonId, LEARNING_PATHS, summaries);
    expect(whatNext.pathFollowups.length).toBeGreaterThan(0);
    for (const { path, nextStep } of whatNext.pathFollowups) {
      const ordered = [...path.steps].sort((a, b) => a.order - b.order);
      const at = ordered.findIndex((s) => s.contentId === lessonId);
      if (nextStep) expect(ordered.findIndex((s) => s.id === nextStep.id)).toBeGreaterThan(at);
    }
    expect(whatNext.practice.length).toBeGreaterThan(0);
  });

  it('flags low-scoring topics with concrete review routes', () => {
    const signals = emptySignals();
    // Finish one fundamentals lesson so fundamentals scores above nothing but stays weak.
    signals.completedLessonIds.add('git.fundamentals.what-is-git');
    const mastery = computeMastery(signals);
    const weak = getWeakAreaReviews(mastery, signals, 2);
    expect(weak.length).toBe(2);
    for (const w of weak) {
      expect(w.topic.score).toBeLessThan(60);
      expect(w.lessonRoute ?? w.troubleshootingRoute ?? w.interviewRoute).toBeTruthy();
    }
  });
});

describe('path search', () => {
  it('finds paths for roadmap-style queries in both languages', () => {
    expect(searchLearningPaths('roadmap').map((r) => r.path.id)).toEqual([
      'git-beginner',
      'git-intermediate',
      'git-advanced',
    ]);
    expect(searchLearningPaths('git beginner')[0].path.id).toBe('git-beginner');
    expect(searchLearningPaths('advanced')[0].path.id).toBe('git-advanced');
    expect(searchLearningPaths('গিট').length).toBeGreaterThan(0);
  });

  it('returns nothing for blank or unrelated queries', () => {
    expect(searchLearningPaths('')).toEqual([]);
    expect(searchLearningPaths('xyzzy-no-such-thing')).toEqual([]);
  });
});
