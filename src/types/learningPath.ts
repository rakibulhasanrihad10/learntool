/**
 * Learning Path model for GitVerse (Prompt 12).
 *
 * A Learning Path is an orchestration layer, NOT a content engine:
 * every step references an existing stable content id and opens the
 * existing experience (lesson page, practice session, troubleshooting
 * guide, command reference, internals explorer, interview topic,
 * skill assessment). No content is duplicated here.
 *
 * Conventions (mirroring the rest of the codebase):
 * - Path ids: `git-beginner`, `git-intermediate`, `git-advanced`.
 *   Future subjects follow `<subject>-<level>` (e.g. `linux-beginner`).
 * - Step ids: `<pathId>.<slug>` (stable, used for prerequisites only —
 *   completion is always derived from the underlying content stores).
 * - Bilingual `{ en, bn }` copy via LocalText; commands, flags, syntax,
 *   filenames, branch names and hashes stay in English in both languages.
 */
import { DifficultyLevel, LocalText } from './content';

/** Step kinds. `lesson|practice|workflow|troubleshooting|assessment|interview`
 *  are the core journey; `command` and `explorer` cover reference/explorer stops. */
export type LearningPathStepType =
  | 'lesson'
  | 'practice'
  | 'workflow'
  | 'troubleshooting'
  | 'assessment'
  | 'interview'
  | 'command'
  | 'explorer';

export interface LearningPathStep {
  /** Stable id, e.g. `git-beginner.staging-area`. */
  id: string;
  pathId: string;
  order: number;
  type: LearningPathStepType;
  /**
   * Existing stable content id the step points at:
   * - lesson: CurriculumLesson id (`git.fundamentals.commit`)
   * - practice: exercise id (`git.practice.basic-commit`)
   * - workflow: workflow id (`git.workflow.everyday`) + explicit `route`
   * - troubleshooting: guide id (`git.troubleshooting.merge-conflict`)
   * - assessment: `git.assessment.skill` → /practice/assessment
   * - interview: `interview:<category>` (e.g. `interview:branching`)
   * - command: GIT_COMMANDS id (`git.status`)
   * - explorer: `git.internals.explorer` → /git/internals
   */
  contentId: string;
  /** Explicit route override (used by workflow steps; resolved otherwise). */
  route?: string;
  title: LocalText;
  description: LocalText;
  /** Why this step matters in the journey (1–2 sentences). */
  whyItMatters: LocalText;
  estimatedMinutes: number;
  /** Optional steps never block path completion. */
  required: boolean;
  /** Step ids within the same path recommended beforehand (guidance, not locks). */
  prerequisites: string[];
  tags: string[];
}

export interface LearningPath {
  /** Stable id, e.g. `git-beginner`. Used in routes (/learn/paths/<id>). */
  id: string;
  subjectId: string;
  difficulty: DifficultyLevel;
  title: LocalText;
  description: LocalText;
  /** What the learner will be able to do after finishing. */
  outcomes: LocalText[];
  /** Path ids recommended before starting this one (guidance, not locks). */
  prerequisites: string[];
  icon: string;
  order: number;
  tags: string[];
  steps: LearningPathStep[];
}

/** Per-step progress state shown in the curriculum. */
export type PathStepStatus = 'completed' | 'current' | 'available' | 'suggested';

/** "GitVerse Learning Mastery" — an educational estimate, never certification. */
export type MasteryLevel = 'not-started' | 'learning' | 'practicing' | 'familiar' | 'strong';

export interface PathProgressSummary {
  pathId: string;
  requiredTotal: number;
  requiredCompleted: number;
  totalSteps: number;
  completedSteps: number;
  percent: number;
  complete: boolean;
  started: boolean;
  currentStepId: string | undefined;
  lastActivityAt: string | undefined;
  statusByStep: Record<string, PathStepStatus>;
}

export interface TopicMastery {
  topicId: string;
  title: LocalText;
  score: number;
  level: MasteryLevel;
  lessonsDone: number;
  lessonsTotal: number;
  practiceDone: number;
  practiceTotal: number;
}
