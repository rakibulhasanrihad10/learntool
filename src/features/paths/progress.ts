/**
 * Path progress — pure, deterministic functions over LearningSignals.
 *
 * Completion reuses each system's own definition of done:
 * - lesson / troubleshooting / workflow / explorer / command:
 *   the content id is in `completedLessonIds` (troubleshooting "resolved"
 *   and workflow/explorer "mark as reviewed" both record there).
 * - practice: the exercise is `completed` in practice progress.
 * - interview (`interview:<category>`): ≥ INTERVIEW_STEP_THRESHOLD
 *   questions of that category reviewed (or all, when fewer exist).
 * - assessment: the skill-assessment quiz id is passed.
 *
 * Prerequisites guide; they never lock. A step whose prerequisites are
 * unmet is `suggested` (shown with a hint) but stays navigable.
 */
import { GIT_COMMANDS, TROUBLESHOOTING_GUIDES } from '@/content/git';
import { getLessonRoute } from '@/content/github';
import { getExerciseById } from '@/content/practice';
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS } from '@/content/interview';
import { getCommandById } from '@/utils/commandSearch';
import { LearningPath, LearningPathStep, PathProgressSummary, PathStepStatus } from '@/types/learningPath';
import { INTERVIEW_STEP_THRESHOLD, LearningSignals } from './signals';

export function interviewCategoryOf(step: LearningPathStep): string | undefined {
  if (step.type !== 'interview') return undefined;
  const [, category] = step.contentId.split(':');
  return category;
}

export function isStepComplete(step: LearningPathStep, signals: LearningSignals): boolean {
  switch (step.type) {
    case 'lesson':
    case 'troubleshooting':
    case 'workflow':
    case 'explorer':
    case 'command':
      return signals.completedLessonIds.has(step.contentId);
    case 'practice':
      return signals.practice[step.contentId]?.completed === true;
    case 'assessment':
      return signals.assessmentPassed;
    case 'interview': {
      const category = interviewCategoryOf(step);
      if (!category) return false;
      const ids = INTERVIEW_QUESTIONS.filter((q) => q.category === category).map((q) => q.id);
      if (ids.length === 0) return false;
      const reviewed = ids.filter((id) => signals.interview[id]?.reviewed).length;
      return reviewed >= Math.min(INTERVIEW_STEP_THRESHOLD, ids.length);
    }
    default:
      return false;
  }
}

/**
 * Resolve a step to the existing route that delivers it.
 * Returns null when the reference cannot be resolved (UI hides the link).
 */
export function stepRoute(step: LearningPathStep): string | null {
  if (step.route) return step.route;
  switch (step.type) {
    case 'lesson': {
      const route = getLessonRoute(step.contentId);
      return route ? route.path : null;
    }
    case 'practice': {
      if (!getExerciseById(step.contentId)) return null;
      return `/practice/${step.contentId.split('.').pop()}`;
    }
    case 'troubleshooting': {
      const guide = TROUBLESHOOTING_GUIDES.find((g) => g.id === step.contentId);
      return guide ? `/troubleshooting/git/${guide.slug}` : null;
    }
    case 'command': {
      const cmd = getCommandById(GIT_COMMANDS, step.contentId);
      return cmd ? `/commands/git/${cmd.slug}` : null;
    }
    case 'interview': {
      const category = interviewCategoryOf(step);
      return category && INTERVIEW_CATEGORIES.some((c) => c.id === category)
        ? `/interview/git/${category}`
        : null;
    }
    case 'assessment':
      return '/practice/assessment';
    case 'explorer':
      return '/git/internals';
    case 'workflow':
      // Workflow steps must carry an explicit route (only two workflow
      // pages exist); without one there is nowhere to send the learner.
      return null;
    default:
      return null;
  }
}

function prerequisitesMet(
  step: LearningPathStep,
  completeIds: Set<string>
): boolean {
  return step.prerequisites.every((id) => completeIds.has(id));
}

export function summarizePath(path: LearningPath, signals: LearningSignals): PathProgressSummary {
  const completeIds = new Set<string>();
  for (const step of path.steps) {
    if (isStepComplete(step, signals)) completeIds.add(step.id);
  }
  const required = path.steps.filter((s) => s.required);
  const requiredCompleted = required.filter((s) => completeIds.has(s.id)).length;
  const percent = required.length === 0 ? 100 : Math.round((requiredCompleted / required.length) * 100);

  // Current = first required incomplete step whose prerequisites are met;
  // fall back to the first required incomplete step (guidance, not locks).
  const incompleteRequired = required.filter((s) => !completeIds.has(s.id));
  const currentStepId =
    incompleteRequired.find((s) => prerequisitesMet(s, completeIds))?.id ??
    incompleteRequired[0]?.id;

  const statusByStep: Record<string, PathStepStatus> = {};
  for (const step of path.steps) {
    if (completeIds.has(step.id)) statusByStep[step.id] = 'completed';
    else if (step.id === currentStepId) statusByStep[step.id] = 'current';
    else if (!prerequisitesMet(step, completeIds)) statusByStep[step.id] = 'suggested';
    else statusByStep[step.id] = 'available';
  }

  // Last activity = freshest timestamp among referenced progress records.
  let lastActivityAt: string | undefined;
  const consider = (iso: string | undefined) => {
    if (iso && (!lastActivityAt || iso > lastActivityAt)) lastActivityAt = iso;
  };
  for (const step of path.steps) {
    if (step.type === 'lesson' || step.type === 'troubleshooting' || step.type === 'workflow' || step.type === 'explorer' || step.type === 'command') {
      consider(signals.learningProgress[step.contentId]?.lastAccessedAt);
    } else if (step.type === 'practice') {
      consider(signals.practice[step.contentId]?.lastAttemptAt);
    } else if (step.type === 'interview') {
      const category = interviewCategoryOf(step);
      for (const q of INTERVIEW_QUESTIONS.filter((x) => x.category === category)) {
        consider(signals.interview[q.id]?.lastAttemptAt);
      }
    }
  }

  return {
    pathId: path.id,
    requiredTotal: required.length,
    requiredCompleted,
    totalSteps: path.steps.length,
    completedSteps: completeIds.size,
    percent,
    complete: required.length > 0 && requiredCompleted >= required.length,
    started: completeIds.size > 0,
    currentStepId,
    lastActivityAt,
    statusByStep,
  };
}

export interface ContinueTarget {
  path: LearningPath;
  summary: PathProgressSummary;
}

/**
 * Deterministic "Continue Learning": the most recently active started but
 * incomplete path; otherwise the first unstarted path; undefined when every
 * path is complete.
 */
export function getContinueTarget(
  paths: LearningPath[],
  signals: LearningSignals
): ContinueTarget | undefined {
  const summaries = paths.map((path) => ({ path, summary: summarizePath(path, signals) }));
  const active = summaries
    .filter((s) => s.summary.started && !s.summary.complete)
    .sort((a, b) => (b.summary.lastActivityAt ?? '').localeCompare(a.summary.lastActivityAt ?? ''));
  if (active.length > 0) return active[0];
  return summaries.find((s) => !s.summary.started);
}
