/**
 * Deterministic recommendations — path order + existing relationships.
 * No AI, no randomness: the same progress always yields the same answer.
 */
import { ALL_MODULES, getLessonRoute } from '@/content/github';
import { PRACTICE_EXERCISES } from '@/content/practice';
import { TROUBLESHOOTING_GUIDES } from '@/content/git';
import { LearningPath, LearningPathStep, PathProgressSummary, TopicMastery } from '@/types/learningPath';
import { MASTERY_TOPICS } from './mastery';
import { stepRoute } from './progress';
import { LearningSignals } from './signals';

/** Current step plus the next incomplete steps (default 3 total). */
export function getNextSteps(
  path: LearningPath,
  summary: PathProgressSummary,
  count = 3
): LearningPathStep[] {
  const ordered = [...path.steps].sort((a, b) => a.order - b.order);
  const incomplete = ordered.filter((s) => summary.statusByStep[s.id] !== 'completed');
  const currentIdx = summary.currentStepId
    ? incomplete.findIndex((s) => s.id === summary.currentStepId)
    : 0;
  const start = currentIdx === -1 ? 0 : currentIdx;
  return incomplete.slice(start, start + count);
}

export interface WhatNext {
  /** Paths containing the lesson + the first incomplete step after it. */
  pathFollowups: { path: LearningPath; nextStep: LearningPathStep | undefined }[];
  /** Upcoming hands-on steps after the lesson within those paths. */
  practice: LearningPathStep[];
  troubleshooting: LearningPathStep[];
  interview: LearningPathStep[];
}

/**
 * "What next?" for a finished lesson: for every path containing it,
 * the first incomplete step after it, plus upcoming practice /
 * troubleshooting / interview steps in the same paths.
 */
export function getWhatNextForLesson(
  lessonId: string,
  paths: LearningPath[],
  summaries: Record<string, PathProgressSummary>
): WhatNext {
  const result: WhatNext = { pathFollowups: [], practice: [], troubleshooting: [], interview: [] };
  const seen = new Set<string>();
  for (const path of paths) {
    const ordered = [...path.steps].sort((a, b) => a.order - b.order);
    const at = ordered.findIndex((s) => s.contentId === lessonId);
    if (at === -1) continue;
    const summary = summaries[path.id];
    const after = ordered.slice(at + 1).filter((s) => summary?.statusByStep[s.id] !== 'completed');
    result.pathFollowups.push({ path, nextStep: after[0] });
    for (const step of after) {
      if (seen.has(step.id)) continue;
      seen.add(step.id);
      if (step.type === 'practice') result.practice.push(step);
      else if (step.type === 'troubleshooting') result.troubleshooting.push(step);
      else if (step.type === 'interview') result.interview.push(step);
    }
  }
  result.practice = result.practice.slice(0, 3);
  result.troubleshooting = result.troubleshooting.slice(0, 3);
  result.interview = result.interview.slice(0, 3);
  return result;
}

export interface WeakAreaReview {
  topic: TopicMastery;
  lessonRoute: string | null;
  troubleshootingRoute: string | null;
  interviewRoute: string | null;
}

/**
 * Weak areas = lowest-scoring started-or-not topics below 60.
 * Each links the first incomplete lesson (or first lesson), the first
 * guide of the topic, and the topic's first interview category.
 */
export function getWeakAreaReviews(
  mastery: TopicMastery[],
  signals: LearningSignals,
  limit = 2
): WeakAreaReview[] {
  return [...mastery]
    .filter((m) => m.score < 60)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((topic) => {
      const def = MASTERY_TOPICS.find((t) => t.id === topic.topicId);
      const lessonIds = ALL_MODULES.flatMap((m) => m.lessons)
        .filter((l) => def?.lessonPrefixes.some((prefix) => l.id.startsWith(prefix)))
        .map((l) => l.id);
      const nextLesson =
        lessonIds.find((id) => !signals.completedLessonIds.has(id)) ?? lessonIds[0];
      const guide = TROUBLESHOOTING_GUIDES.find((g) =>
        def?.troubleshootingCategories.includes(g.category)
      );
      const interviewCategory = def?.interviewCategories[0];
      return {
        topic,
        lessonRoute: nextLesson ? getLessonRoute(nextLesson)?.path ?? null : null,
        troubleshootingRoute: guide ? `/troubleshooting/git/${guide.slug}` : null,
        interviewRoute: interviewCategory ? `/interview/git/${interviewCategory}` : null,
      };
    });
}

export interface PracticeSurfacing {
  exercises: { id: string; route: string }[];
}

/** Practice exercises after a lesson's path position (for "Practice This"). */
export function getPracticeForLesson(
  lessonId: string,
  paths: LearningPath[],
  limit = 3
): PracticeSurfacing {
  const exercises: { id: string; route: string }[] = [];
  const seen = new Set<string>();
  for (const path of paths) {
    const ordered = [...path.steps].sort((a, b) => a.order - b.order);
    const at = ordered.findIndex((s) => s.contentId === lessonId);
    if (at === -1) continue;
    for (const step of ordered.slice(at + 1)) {
      if (step.type !== 'practice' || seen.has(step.contentId)) continue;
      const exercise = PRACTICE_EXERCISES.find((e) => e.id === step.contentId);
      if (!exercise) continue;
      seen.add(step.contentId);
      exercises.push({ id: exercise.id, route: stepRoute(step) ?? `/practice/${exercise.id.split('.').pop()}` });
      if (exercises.length >= limit) return { exercises };
    }
  }
  return { exercises };
}
