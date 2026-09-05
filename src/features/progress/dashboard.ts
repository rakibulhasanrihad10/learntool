/**
 * Progress dashboard — a DERIVED read model (Phase 13).
 *
 * Everything here is computed from the existing authoritative stores:
 * lessons/troubleshooting/workflows → gamification `completedLessonIds`
 * practice → `gitverse_practice_progress`
 * interview → `gitverse_interview_progress` + `gitverse_interview_mocks`
 * assessment → gamification quiz record · XP/level/streak → gamification
 *
 * Nothing is persisted by this module. Same inputs → same dashboard.
 *
 * Overall progress is deliberately THREE numbers, not one:
 * - Curriculum Progress: required lesson-type learning-path steps done/total.
 *   (Lesson steps only, so practice/interview work is never double-counted.)
 * - Skill Practice: practice exercises completed/total + average best score.
 * - Interview Readiness: the existing readiness level + reviewed/total.
 */
import { useMemo } from 'react';
import { ALL_MODULES, getLessonRoute } from '@/content/github';
import { GIT_WORKFLOWS } from '@/content/git/workflows';
import { GITHUB_WORKFLOWS } from '@/content/github/githubWorkflows';
import { PRACTICE_CATEGORIES, PRACTICE_EXERCISES } from '@/content/practice';
import { TROUBLESHOOTING_GUIDES } from '@/content/git';
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS } from '@/content/interview';
import { LEARNING_PATHS } from '@/content/paths';
import { LocalText } from '@/types/content';
import { LearningPath, PathProgressSummary, TopicMastery } from '@/types/learningPath';
import { UserProgress } from '@/types/gamification';
import { useGamification } from '@/features/gamification/useGamification';
import { calculateUserLevel } from '@/features/gamification/levelSystem';
import { ACHIEVEMENTS_CATALOG } from '@/features/gamification/achievements';
import { TODAY_CHALLENGE } from '@/features/gamification/dailyChallenge';
import { XP_CONFIG } from '@/features/gamification/config';
import { computeReadiness, ReadinessResult } from '@/features/interview/readiness';
import { MASTERY_TOPICS, computeMastery } from '@/features/paths/mastery';
import { getContinueTarget, stepRoute, summarizePath } from '@/features/paths/progress';
import { getWeakAreaReviews } from '@/features/paths/recommend';
import { LearningSignals, useLearningSignals } from '@/features/paths/signals';

/* ---------------- lesson / guide / workflow title lookups ---------------- */

function text(en: string, bn: string | undefined): LocalText {
  return { en, bn: bn ?? en };
}

const LESSON_TITLES: Map<string, LocalText> = new Map(
  ALL_MODULES.flatMap((m) => m.lessons.map((l): [string, LocalText] => [l.id, text(l.title, l.titleBn)]))
);
const GUIDE_TITLES: Map<string, LocalText> = new Map(
  TROUBLESHOOTING_GUIDES.map((g): [string, LocalText] => [g.id, g.title])
);
const WORKFLOW_TITLES: Map<string, LocalText> = new Map<string, LocalText>([
  ...GIT_WORKFLOWS.map((w): [string, LocalText] => [w.id, text(w.title, w.titleBn)]),
  ...GITHUB_WORKFLOWS.map((w): [string, LocalText] => [w.id, text(w.title, w.titleBn)]),
  ['git.internals.explorer', { en: 'Git Internals Explorer', bn: 'গিট ইন্টারনালস এক্সপ্লোরার' }],
]);

function contentTitle(id: string): LocalText | undefined {
  return LESSON_TITLES.get(id) ?? GUIDE_TITLES.get(id) ?? WORKFLOW_TITLES.get(id);
}

function isGuideId(id: string): boolean {
  return id.startsWith('git.troubleshooting.');
}

/* ---------------- dashboard model ---------------- */

export interface CurriculumProgress {
  lessonStepsDone: number;
  lessonStepsTotal: number;
  percent: number;
  lessonsDone: number;
  lessonsTotal: number;
}

export interface PracticeCategoryStat {
  category: string;
  done: number;
  total: number;
  attempted: number;
  avgBest: number;
}

export interface PracticeAnalytics {
  completed: number;
  total: number;
  attempted: number;
  avgBest: number;
  best: number;
  /** Attempts beyond the first per exercise — retry pressure, not a stored retry log. */
  extraAttempts: number;
  byCategory: PracticeCategoryStat[];
  strongest: PracticeCategoryStat | undefined;
  weakest: PracticeCategoryStat | undefined;
}

export interface InterviewCategoryStat {
  category: string;
  reviewed: number;
  total: number;
}

export interface InterviewAnalytics {
  reviewed: number;
  total: number;
  objectiveCorrect: number;
  objectiveAttempted: number;
  byCategory: InterviewCategoryStat[];
  weakest: InterviewCategoryStat[];
  readiness: ReadinessResult;
}

export type WeakReason =
  | { kind: 'practice-score'; avgBest: number; attempts: number }
  | { kind: 'lessons-incomplete'; done: number; total: number }
  | { kind: 'interview-low'; reviewed: number; total: number }
  | { kind: 'cookbook-untouched' }
  | { kind: 'not-started' };

export interface WeakArea {
  topic: TopicMastery;
  reasons: WeakReason[];
  lessonRoute: string | null;
  practiceRoute: string | null;
  troubleshootingRoute: string | null;
  interviewRoute: string | null;
}

export interface Recommendation {
  id: string;
  kind: 'path' | 'lesson' | 'practice' | 'troubleshooting' | 'interview';
  topicId?: string;
  title: LocalText;
  detail: LocalText;
  route: string;
  minutes?: number;
}

export interface CurrentItem {
  kind: 'path' | 'lesson' | 'practice' | 'review';
  title: LocalText;
  context: LocalText;
  route: string;
  minutes?: number;
  status: LocalText;
}

export type ActivityKind = 'lesson' | 'troubleshooting' | 'workflow' | 'practice' | 'interview' | 'mock' | 'daily';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: LocalText;
  at: string;
  /** XP only when the award for this event is deterministic (+50 lesson, exercise xpReward, +5 first review). */
  xp?: number;
}

export interface ProgressDashboard {
  curriculum: CurriculumProgress;
  paths: { path: LearningPath; summary: PathProgressSummary }[];
  pathsStarted: number;
  pathsCompleted: number;
  continueTarget: { path: LearningPath; summary: PathProgressSummary } | undefined;
  current: CurrentItem | undefined;
  mastery: TopicMastery[];
  topicsStrong: number;
  practice: PracticeAnalytics;
  interview: InterviewAnalytics;
  weakAreas: WeakArea[];
  recommendations: Recommendation[];
  activity: ActivityItem[];
  xp: number;
  level: ReturnType<typeof calculateUserLevel>;
  streak: UserProgress['streak'];
  achievementsUnlocked: number;
  achievementsTotal: number;
  nextAchievements: { id: string; title: LocalText }[];
  dailyCompleted: boolean;
}

/* ---------------- builders (pure) ---------------- */

export function buildCurriculumProgress(signals: LearningSignals): CurriculumProgress {
  const lessonSteps = LEARNING_PATHS.flatMap((p) => p.steps).filter((s) => s.type === 'lesson' && s.required);
  const lessonStepsDone = lessonSteps.filter((s) => signals.completedLessonIds.has(s.contentId)).length;
  const lessonIds = new Set(ALL_MODULES.flatMap((m) => m.lessons.map((l) => l.id)));
  const lessonsDone = [...signals.completedLessonIds].filter((id) => lessonIds.has(id)).length;
  return {
    lessonStepsDone,
    lessonStepsTotal: lessonSteps.length,
    percent: lessonSteps.length === 0 ? 0 : Math.round((lessonStepsDone / lessonSteps.length) * 100),
    lessonsDone,
    lessonsTotal: lessonIds.size,
  };
}

export function buildPracticeAnalytics(signals: LearningSignals): PracticeAnalytics {
  const byCategory: PracticeCategoryStat[] = PRACTICE_CATEGORIES.map((cat) => {
    const exercises = PRACTICE_EXERCISES.filter((e) => e.category === cat.id);
    const attemptedEx = exercises.filter((e) => (signals.practice[e.id]?.attempts ?? 0) > 0);
    const avgBest =
      attemptedEx.length === 0
        ? 0
        : Math.round(attemptedEx.reduce((s, e) => s + (signals.practice[e.id]?.bestScore ?? 0), 0) / attemptedEx.length);
    return {
      category: cat.id,
      done: exercises.filter((e) => signals.practice[e.id]?.completed).length,
      total: exercises.length,
      attempted: attemptedEx.length,
      avgBest,
    };
  });
  const attemptedAll = PRACTICE_EXERCISES.filter((e) => (signals.practice[e.id]?.attempts ?? 0) > 0);
  const completed = PRACTICE_EXERCISES.filter((e) => signals.practice[e.id]?.completed).length;
  const best = attemptedAll.reduce((m, e) => Math.max(m, signals.practice[e.id]?.bestScore ?? 0), 0);
  const avgBest =
    attemptedAll.length === 0
      ? 0
      : Math.round(attemptedAll.reduce((s, e) => s + (signals.practice[e.id]?.bestScore ?? 0), 0) / attemptedAll.length);
  const extraAttempts = Object.values(signals.practice).reduce((s, e) => s + Math.max(0, e.attempts - 1), 0);
  const tried = byCategory.filter((c) => c.attempted > 0);
  const strongest = tried.length === 0 ? undefined : [...tried].sort((a, b) => b.avgBest - a.avgBest || b.done - a.done)[0];
  const weakest = tried.length === 0 ? undefined : [...tried].sort((a, b) => a.avgBest - b.avgBest || a.done - b.done)[0];
  return { completed, total: PRACTICE_EXERCISES.length, attempted: attemptedAll.length, avgBest, best, extraAttempts, byCategory, strongest, weakest };
}

export function buildInterviewAnalytics(signals: LearningSignals): InterviewAnalytics {
  const objective = INTERVIEW_QUESTIONS.filter((q) => q.options && q.options.length > 0);
  const objectiveAttempted = objective.filter((q) => {
    const p = signals.interview[q.id];
    return p && (p.attempts > 0 || p.everCorrect === true);
  });
  const objectiveCorrect = objectiveAttempted.filter((q) => signals.interview[q.id]?.everCorrect === true).length;
  const byCategory: InterviewCategoryStat[] = INTERVIEW_CATEGORIES.map((c) => {
    const qs = INTERVIEW_QUESTIONS.filter((q) => q.category === c.id);
    return { category: c.id, reviewed: qs.filter((q) => signals.interview[q.id]?.reviewed).length, total: qs.length };
  });
  const reviewed = byCategory.reduce((s, c) => s + c.reviewed, 0);
  const weakest = [...byCategory]
    .filter((c) => c.total > 0 && c.reviewed < c.total)
    .sort((a, b) => a.reviewed / a.total - b.reviewed / b.total)
    .slice(0, 2);
  return {
    reviewed,
    total: INTERVIEW_QUESTIONS.length,
    objectiveCorrect,
    objectiveAttempted: objectiveAttempted.length,
    byCategory,
    weakest,
    readiness: computeReadiness(signals.interview, signals.mockHistory),
  };
}

const WEAK_SCORE_CUTOFF = 60;

export function buildWeakAreas(
  signals: LearningSignals,
  mastery: TopicMastery[],
  practice: PracticeAnalytics,
  interview: InterviewAnalytics
): WeakArea[] {
  // Actionable weaknesses first: topics with real activity (attempts,
  // reviews, lessons) outrank untouched ones at the same low score —
  // a poor practice average deserves attention before a blank slate.
  const activeOf = (topicId: string): boolean => {
    const m = mastery.find((t) => t.topicId === topicId);
    if (!m) return false;
    if (m.lessonsDone > 0 || m.practiceDone > 0) return true;
    const cats = practice.byCategory.filter((c) => topicForPracticeCategory(c.category) === topicId);
    if (cats.some((c) => c.attempted > 0)) return true;
    return interview.byCategory.some(
      (c) => topicInterviewCategories(topicId).includes(c.category) && c.reviewed > 0
    );
  };
  const ranked = [...mastery]
    .filter((m) => m.score < WEAK_SCORE_CUTOFF)
    .sort((a, b) => Number(activeOf(b.topicId)) - Number(activeOf(a.topicId)) || a.score - b.score)
    .slice(0, 3);
  const byId = new Map(
    getWeakAreaReviews(mastery, signals, mastery.length).map((r) => [r.topic.topicId, r])
  );
  // Emit in ranked order (actionable first), not the review helper's order.
  const base = ranked.map((m) => byId.get(m.topicId)!).filter(Boolean);
  return base.map(({ topic, lessonRoute, troubleshootingRoute, interviewRoute }) => {
    const reasons: WeakReason[] = [];
    if (topic.score < 1) {
      reasons.push({ kind: 'not-started' });
    } else {
      if (topic.lessonsDone < topic.lessonsTotal) {
        reasons.push({ kind: 'lessons-incomplete', done: topic.lessonsDone, total: topic.lessonsTotal });
      }
      const cats = practice.byCategory.filter(
        (c) => topicForPracticeCategory(c.category) === topic.topicId && c.attempted > 0 && c.avgBest < 70
      );
      for (const c of cats.slice(0, 1)) {
        const attempts = PRACTICE_EXERCISES.filter((e) => e.category === c.category).reduce(
          (s, e) => s + (signals.practice[e.id]?.attempts ?? 0), 0);
        reasons.push({ kind: 'practice-score', avgBest: c.avgBest, attempts });
      }
      const iv = interview.byCategory.filter((c) =>
        topicInterviewCategories(topic.topicId).includes(c.category) && c.reviewed < c.total
      );
      const ivReviewed = iv.reduce((s, c) => s + c.reviewed, 0);
      const ivTotal = iv.reduce((s, c) => s + c.total, 0);
      if (ivTotal > 0 && (ivReviewed / ivTotal < 0.5 || topic.score < 40)) {
        reasons.push({ kind: 'interview-low', reviewed: ivReviewed, total: ivTotal });
      }
      if (reasons.length === 0) reasons.push({ kind: 'cookbook-untouched' });
    }
    // First incomplete exercise in the topic's practice categories.
    const exercise = PRACTICE_EXERCISES.find(
      (e) => topicForPracticeCategory(e.category) === topic.topicId && !signals.practice[e.id]?.completed
    );
    return {
      topic,
      reasons,
      lessonRoute,
      practiceRoute: exercise ? `/practice/${exercise.id.split('.').pop()}` : null,
      troubleshootingRoute,
      interviewRoute,
    };
  });
}

// Practice category → mastery topic mapping (mirrors mastery.ts definitions).
function topicForPracticeCategory(category: string): string {
  if (['fundamentals', 'everyday'].includes(category)) return 'fundamentals';
  if (['branching', 'merging', 'rebasing'].includes(category)) return 'branching';
  if (category === 'remote') return 'remote';
  if (category === 'recovery') return 'recovery';
  if (category === 'internals') return 'internals';
  return 'collaboration';
}

function topicInterviewCategories(topicId: string): string[] {
  const map: Record<string, string[]> = {
    fundamentals: ['fundamentals', 'commands'],
    branching: ['branching'],
    remote: ['remote'],
    recovery: ['troubleshooting'],
    internals: ['internals'],
    collaboration: ['scenarios'],
  };
  return map[topicId] ?? [];
}

export function buildRecommendations(
  signals: LearningSignals,
  paths: { path: LearningPath; summary: PathProgressSummary }[],
  mastery: TopicMastery[],
  practice: PracticeAnalytics,
  interview: InterviewAnalytics
): Recommendation[] {
  const recs: Recommendation[] = [];
  const usedRoutes = new Set<string>();
  const push = (r: Recommendation) => {
    if (usedRoutes.has(r.route)) return;
    usedRoutes.add(r.route);
    recs.push(r);
  };
  const L = (en: string, bn: string): LocalText => ({ en, bn });

  // 1. Continue the active path.
  const target = getContinueTarget(LEARNING_PATHS, signals);
  if (target) {
    const step = target.path.steps.find((s) => s.id === target.summary.currentStepId);
    if (step) {
      const route = stepRoute(step) ?? `/learn/paths/${target.path.id}`;
      push({
        id: `continue-${step.id}`,
        kind: 'path',
        topicId: undefined,
        title: step.title,
        detail: L(
          `Continue ${target.path.title.en} — ${target.summary.requiredCompleted}/${target.summary.requiredTotal} required steps done.`,
          `${target.path.title.bn} চালিয়ে যান — ${target.summary.requiredCompleted}/${target.summary.requiredTotal} আবশ্যক ধাপ সম্পন্ন।`
        ),
        route,
        minutes: step.estimatedMinutes,
      });
    }
  }

  // 2. Oldest in-progress (started, uncompleted) lesson.
  const inProgress = Object.values(signals.learningProgress)
    .filter((lp) => lp.status !== 'completed' && LESSON_TITLES.has(lp.contentId) && !isGuideId(lp.contentId))
    .sort((a, b) => a.lastAccessedAt.localeCompare(b.lastAccessedAt))[0];
  if (inProgress) {
    const title = LESSON_TITLES.get(inProgress.contentId);
    const route = getLessonRoute(inProgress.contentId)?.path;
    if (title && route) {
      push({
        id: `lesson-${inProgress.contentId}`,
        kind: 'lesson',
        title,
        detail: L(
          'You started this lesson but have not finished it yet.',
          'এই পাঠ শুরু করেছেন কিন্তু শেষ করেননি।'
        ),
        route,
      });
    }
  }

  // 3. Practice the weakest attempted category (<70 avg), else start practice.
  if (practice.weakest && practice.weakest.avgBest < 70) {
    const exercise = PRACTICE_EXERCISES.find(
      (e) => e.category === practice.weakest!.category && !signals.practice[e.id]?.completed
    ) ?? PRACTICE_EXERCISES.find((e) => e.category === practice.weakest!.category);
    if (exercise) {
      push({
        id: `practice-${exercise.id}`,
        kind: 'practice',
        topicId: topicForPracticeCategory(exercise.category),
        title: exercise.title,
        detail: L(
          `Your ${exercise.category} practice averages ${practice.weakest.avgBest} — targeted reps will move it.`,
          `আপনার ${exercise.category} অনুশীলন গড় ${practice.weakest.avgBest} — লক্ষ্যযুক্ত অনুশীলনে উন্নতি হবে।`
        ),
        route: `/practice/${exercise.id.split('.').pop()}`,
        minutes: exercise.estimatedMinutes,
      });
    }
  } else if (practice.attempted === 0) {
    const first = PRACTICE_EXERCISES[0];
    push({
      id: `practice-${first.id}`,
      kind: 'practice',
      topicId: 'fundamentals',
      title: first.title,
      detail: L(
        'Practice turns knowledge into skill — start with initializing a repository.',
        'অনুশীলন জ্ঞানকে দক্ষতায় বদলায় — রিপোজিটরি তৈরি দিয়ে শুরু করুন।'
      ),
      route: `/practice/${first.id.split('.').pop()}`,
      minutes: first.estimatedMinutes,
    });
  }

  // 4. Unresolved cookbook guide in the lowest weak topic.
  const weakTopic = mastery.filter((m) => m.score < WEAK_SCORE_CUTOFF).sort((a, b) => a.score - b.score)[0];
  if (weakTopic) {
    const def = MASTERY_TOPICS.find((t) => t.id === weakTopic.topicId);
    const guide = TROUBLESHOOTING_GUIDES.find(
      (g) => def?.troubleshootingCategories.includes(g.category) && !signals.completedLessonIds.has(g.id)
    );
    if (guide) {
      push({
        id: `cookbook-${guide.id}`,
        kind: 'troubleshooting',
        topicId: weakTopic.topicId,
        title: guide.title,
        detail: L(
          `${weakTopic.title.en} is your lowest area — walk the recovery recipe before you need it.`,
          `${weakTopic.title.bn} আপনার দুর্বলতম ক্ষেত্র — প্রয়োজনের আগেই পুনরুদ্ধার রেসিপি দেখুন।`
        ),
        route: `/troubleshooting/git/${guide.slug}`,
      });
    }
  }

  // 5. Interview questions in the weakest category.
  if (interview.weakest.length > 0) {
    const w = interview.weakest[0];
    push({
      id: `interview-${w.category}`,
      kind: 'interview',
      topicId: undefined,
      title: L(`Interview: ${w.category}`, `ইন্টারভিউ: ${w.category}`),
      detail: L(
        `You reviewed ${w.reviewed}/${w.total} ${w.category} questions — explaining out loud cements the topic.`,
        `${w.category} প্রশ্ন দেখেছেন ${w.reviewed}/${w.total} — মুখে ব্যাখ্যা বিষয় পোক্ত করে।`
      ),
      route: `/interview/git/${w.category}`,
    });
  }

  // 6. Start the next unstarted path (or revisit the first when all complete).
  const unstarted = paths.find((p) => !p.summary.started);
  if (unstarted) {
    push({
      id: `start-${unstarted.path.id}`,
      kind: 'path',
      title: unstarted.path.title,
      detail: L('A guided journey from first principles to confident practice.', 'মূল থেকে আত্মবিশ্বাসী অনুশীলনে নির্দেশিত যাত্রা।'),
      route: `/learn/paths/${unstarted.path.id}`,
    });
  }

  return recs.slice(0, 6);
}

export function buildCurrentItem(
  signals: LearningSignals,
  paths: { path: LearningPath; summary: PathProgressSummary }[],
  mastery: TopicMastery[]
): CurrentItem | undefined {
  // 1. Active path step.
  const target = getContinueTarget(LEARNING_PATHS, signals);
  if (target) {
    const step = target.path.steps.find((s) => s.id === target.summary.currentStepId);
    if (step) {
      return {
        kind: 'path',
        title: step.title,
        context: target.path.title,
        route: stepRoute(step) ?? `/learn/paths/${target.path.id}`,
        minutes: step.estimatedMinutes,
        status: { en: 'Continue path', bn: 'পাথ চালিয়ে যান' },
      };
    }
  }
  // 2. In-progress lesson (most recently touched).
  const inProgress = Object.values(signals.learningProgress)
    .filter((lp) => lp.status !== 'completed' && LESSON_TITLES.has(lp.contentId) && !isGuideId(lp.contentId))
    .sort((a, b) => b.lastAccessedAt.localeCompare(a.lastAccessedAt))[0];
  if (inProgress) {
    const route = getLessonRoute(inProgress.contentId)?.path;
    const title = LESSON_TITLES.get(inProgress.contentId);
    if (route && title) {
      return {
        kind: 'lesson',
        title,
        context: { en: 'Lesson in progress', bn: 'চলমান পাঠ' },
        route,
        status: { en: 'Continue lesson', bn: 'পাঠ চালিয়ে যান' },
      };
    }
  }
  // 3. Attempted-but-incomplete exercise (most recent).
  const openExercise = PRACTICE_EXERCISES.filter((e) => {
    const p = signals.practice[e.id];
    return p && p.attempts > 0 && !p.completed;
  }).sort((a, b) =>
    (signals.practice[b.id]?.lastAttemptAt ?? '').localeCompare(signals.practice[a.id]?.lastAttemptAt ?? '')
  )[0];
  if (openExercise) {
    return {
      kind: 'practice',
      title: openExercise.title,
      context: { en: 'Practice Lab', bn: 'প্র্যাকটিস ল্যাব' },
      route: `/practice/${openExercise.id.split('.').pop()}`,
      minutes: openExercise.estimatedMinutes,
      status: { en: 'Continue practice', bn: 'অনুশীলন চালিয়ে যান' },
    };
  }
  // 4. Weak-area review.
  const weak = mastery.filter((m) => m.score < WEAK_SCORE_CUTOFF).sort((a, b) => a.score - b.score)[0];
  if (weak) {
    const reviews = getWeakAreaReviews(mastery, signals, 3);
    const match = reviews.find((r) => r.topic.topicId === weak.topicId);
    const route = match?.lessonRoute ?? match?.troubleshootingRoute ?? match?.interviewRoute;
    if (route) {
      return {
        kind: 'review',
        title: { en: `Review ${weak.title.en}`, bn: `${weak.title.bn} পর্যালোচনা` },
        context: { en: 'Recommended review', bn: 'প্রস্তাবিত পর্যালোচনা' },
        route,
        status: { en: 'Review topic', bn: 'বিষয় পর্যালোচনা' },
      };
    }
  }
  // 5. Nothing active — start the first path.
  const first = paths[0];
  if (first && !first.summary.complete) {
    return {
      kind: 'path',
      title: first.path.title,
      context: { en: 'Suggested starting point', bn: 'প্রস্তাবিত শুরু' },
      route: `/learn/paths/${first.path.id}`,
      status: { en: 'Start path', bn: 'পাথ শুরু করুন' },
    };
  }
  return undefined;
}

const MAX_ACTIVITY = 8;

export function buildActivity(
  signals: LearningSignals,
  game: UserProgress
): ActivityItem[] {
  const items: ActivityItem[] = [];
  for (const lp of Object.values(signals.learningProgress)) {
    if (!lp.completedAt) continue;
    const title = contentTitle(lp.contentId);
    if (!title) continue;
    const kind: ActivityKind = isGuideId(lp.contentId) ? 'troubleshooting' : WORKFLOW_TITLES.has(lp.contentId) ? 'workflow' : 'lesson';
    items.push({
      id: `lesson-${lp.contentId}`,
      kind,
      title,
      at: lp.completedAt,
      // completeLesson() awards exactly XP_CONFIG.lessonCompleted — same call
      // backs lessons, cookbook resolves, and workflow/explorer reviews.
      xp: XP_CONFIG.lessonCompleted,
    });
  }
  for (const [id, p] of Object.entries(signals.practice)) {
    if (!p.completed || !p.completedAt) continue;
    const exercise = PRACTICE_EXERCISES.find((e) => e.id === id);
    if (!exercise) continue;
    // completedAt is only ever set on first completion, which is exactly
    // when xpReward is granted (anti-farming: later completions grant none).
    items.push({ id: `practice-${id}`, kind: 'practice', title: exercise.title, at: p.completedAt, xp: exercise.xpReward });
  }
  for (const [id, q] of Object.entries(signals.interview)) {
    const question = INTERVIEW_QUESTIONS.find((x) => x.id === id);
    if (!question || !q.reviewed) continue;
    items.push({
      id: `interview-${id}`,
      kind: 'interview',
      title: question.question,
      at: q.lastAttemptAt,
      // attempts === 1 implies the first (hence XP-bearing) review: reviewed
      // flips true on the very first attempt, so a lone attempt earned +5.
      xp: q.attempts === 1 ? 5 : undefined,
    });
  }
  for (const m of signals.mockHistory) {
    items.push({
      id: `mock-${m.id}`,
      kind: 'mock',
      title: { en: `Mock interview — scored ${m.score}`, bn: `মক ইন্টারভিউ — স্কোর ${m.score}` },
      at: m.finishedAt,
    });
  }
  if (game.completedChallengeIds.includes(TODAY_CHALLENGE.id)) {
    items.push({
      id: `daily-${TODAY_CHALLENGE.id}`,
      kind: 'daily',
      title: { en: TODAY_CHALLENGE.title, bn: TODAY_CHALLENGE.titleBn },
      at: new Date().toISOString(),
      xp: TODAY_CHALLENGE.xpReward,
    });
  }
  return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, MAX_ACTIVITY);
}

export function buildDashboard(signals: LearningSignals, game: UserProgress): ProgressDashboard {
  const paths = LEARNING_PATHS.map((path) => ({ path, summary: summarizePath(path, signals) }));
  const mastery = computeMastery(signals);
  const practice = buildPracticeAnalytics(signals);
  const interview = buildInterviewAnalytics(signals);
  const level = calculateUserLevel(game.totalXp);
  const unlocked = new Set(game.unlockedAchievementIds);
  const nextAchievements = ACHIEVEMENTS_CATALOG.filter((a) => !unlocked.has(a.id))
    .slice(0, 3)
    .map((a) => ({ id: a.id, title: { en: a.title, bn: a.titleBn } }));
  return {
    curriculum: buildCurriculumProgress(signals),
    paths,
    pathsStarted: paths.filter((p) => p.summary.started).length,
    pathsCompleted: paths.filter((p) => p.summary.complete).length,
    continueTarget: getContinueTarget(LEARNING_PATHS, signals),
    current: buildCurrentItem(signals, paths, mastery),
    mastery,
    topicsStrong: mastery.filter((m) => m.level === 'strong').length,
    practice,
    interview,
    weakAreas: buildWeakAreas(signals, mastery, practice, interview),
    recommendations: buildRecommendations(signals, paths, mastery, practice, interview),
    activity: buildActivity(signals, game),
    xp: game.totalXp,
    level,
    streak: game.streak,
    achievementsUnlocked: game.unlockedAchievementIds.length,
    achievementsTotal: ACHIEVEMENTS_CATALOG.length,
    nextAchievements,
    dailyCompleted: game.completedChallengeIds.includes(TODAY_CHALLENGE.id),
  };
}

export function useProgressDashboard(): ProgressDashboard {
  const signals = useLearningSignals();
  const { progress } = useGamification();
  return useMemo(() => buildDashboard(signals, progress), [signals, progress]);
}
