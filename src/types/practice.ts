/**
 * Practice Labs data contracts for GitVerse.
 *
 * Content lives in `src/content/practice/`, logic in `src/features/practice/`,
 * UI in `src/components/practice/` + `src/pages/Practice/`.
 *
 * Conventions (mirroring the rest of the codebase):
 * - Stable ids: `git.practice.<slug>` for exercises, `<exerciseId>:<taskId>` for tasks.
 * - Bilingual `{ en, bn }` copy via LangText; Git syntax, filenames, branch
 *   names and hashes stay in English in both languages.
 * - `relatedCommands` reference GIT_COMMANDS ids (e.g. `git.status`).
 * - `relatedLessons` reference CurriculumLesson ids (any subject).
 * - `relatedScenarios` reference TroubleshootingGuide ids.
 * - `relatedWorkflows` reference Workflow ids.
 */
import { DifficultyLevel } from './content';
import { GitSimulationState } from '@/features/simulation/models';

/** Bilingual text pair. Git syntax, filenames, branch names and hashes stay in English. */
export interface LangText {
  en: string;
  bn: string;
}

export type PracticeCategory =
  | 'fundamentals'
  | 'everyday'
  | 'branching'
  | 'merging'
  | 'rebasing'
  | 'remote'
  | 'github'
  | 'recovery'
  | 'internals';

export type PracticeTaskKind =
  | 'select'
  | 'order'
  | 'complete'
  | 'simulate';

export interface PracticeOption {
  id: string;
  /** Command text or short answer. Never translated. */
  label: string;
  labelBn?: string;
  correct: boolean;
}

export interface PracticeOrderItem {
  id: string;
  label: string;
  labelBn?: string;
}

interface PracticeTaskBase {
  id: string;
  kind: PracticeTaskKind;
  prompt: LangText;
  explanation: LangText;
  /** Optional repository snapshot shown above the question (predict-state / read-graph). */
  stateSnapshot?: GitSimulationState;
  /** How to render the snapshot. Defaults to 'areas'. */
  snapshotView?: 'areas' | 'graph';
}

export interface SelectTask extends PracticeTaskBase {
  kind: 'select';
  options: PracticeOption[];
}

export interface OrderTask extends PracticeTaskBase {
  kind: 'order';
  items: PracticeOrderItem[];
  /** Correct sequence of item ids, first step first. */
  correctOrder: string[];
}

export interface CompleteTask extends PracticeTaskBase {
  kind: 'complete';
  /** Command prefix shown before the blank, e.g. "git add". Never translated. */
  prefix: string;
  /** Accepted completions (trimmed, case-sensitive — Git syntax is exact). Never translated. */
  acceptedAnswers: string[];
  placeholder?: string;
}

export interface SimulateTask extends PracticeTaskBase {
  kind: 'simulate';
  /** Starting repository snapshot (plain data — never a real repo). */
  setup: GitSimulationState;
  /** State conditions that must ALL hold for the task to pass. */
  validation: ValidationRule[];
}

export type PracticeTask = SelectTask | OrderTask | CompleteTask | SimulateTask;

export type ValidationRule =
  | { rule: 'tipIs'; branch: string; commit: string }
  | { rule: 'trackingEqualsServer'; branch: string }
  | { rule: 'currentBranchIs'; branch: string }
  | { rule: 'branchExists'; branch: string }
  | { rule: 'branchAbsent'; branch: string }
  | { rule: 'commitCountMin'; count: number }
  | { rule: 'commitCountExact'; count: number }
  | { rule: 'tipHasParents'; branch: string; count: number }
  | { rule: 'tipsEqual'; branchA: string; branchB: string }
  | { rule: 'descendsFrom'; branch: string; ancestorBranch: string }
  | { rule: 'fileIs'; file: string; workStatus?: 'clean' | 'modified' | 'deleted'; staged?: boolean }
  | { rule: 'treeIsClean' }
  | { rule: 'remoteInSync'; branch: string }
  | { rule: 'trackingInSync'; branch: string }
  | { rule: 'serverHasBranch'; branch: string };

export interface PracticeExercise {
  /** Stable id, e.g. `git.practice.basic-commit`. Used for progress + XP. */
  id: string;
  category: PracticeCategory;
  difficulty: DifficultyLevel;
  order: number;
  estimatedMinutes: number;
  /** XP awarded on FIRST completion only (anti-farming). */
  xpReward: number;
  tags: string[];
  /** Extra search keywords (natural language). Bilingual matching. */
  keywords: string[];
  title: LangText;
  description: LangText;
  objective: LangText;
  tasks: PracticeTask[];
  /** Progressively revealing hints (last one may reveal the answer). */
  hints: LangText[];
  prerequisites?: string[];
  relatedCommands: string[];
  relatedLessons: string[];
  relatedScenarios: string[];
  relatedWorkflows: string[];
}

export interface TaskAttempt {
  taskId: string;
  passed: boolean;
  /** Wrong submissions before the passing one (0 = first try). */
  retries: number;
  hintsShown: number;
}

export interface PracticeResult {
  exerciseId: string;
  score: number;
  band: ScoreBand;
  tasksPassed: number;
  tasksTotal: number;
  hintsUsed: number;
  retries: number;
  xpEarned: number;
  firstCompletion: boolean;
  completedAt: string;
}

export type ScoreBand = 'mastered' | 'strong' | 'needs-practice' | 'review';

export interface ExerciseProgress {
  attempts: number;
  bestScore: number;
  completed: boolean;
  completedAt?: string;
  lastAttemptAt: string;
  hintsUsed: number;
}

export type PracticeProgress = Record<string, ExerciseProgress>;

/* ---------------- Skill Assessment ---------------- */

export interface AssessmentItem {
  id: string;
  /** Section this item scores into. */
  section: AssessmentSectionId;
  exerciseId: string;
  taskId: string;
}

export type AssessmentSectionId =
  | 'fundamentals'
  | 'branching'
  | 'merging-rebasing'
  | 'remote'
  | 'recovery'
  | 'internals';

export type SectionLevel = 'strong' | 'developing' | 'needs-practice';

export interface AssessmentSectionResult {
  section: AssessmentSectionId;
  correct: number;
  total: number;
  level: SectionLevel;
}

export type OverallLevel =
  | 'git-novice'
  | 'developing-practitioner'
  | 'intermediate-practitioner'
  | 'confident-practitioner';
