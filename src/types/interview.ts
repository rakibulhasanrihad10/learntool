/**
 * Interview Preparation data contracts for GitVerse.
 *
 * Content lives in `src/content/interview/`, logic in `src/features/interview/`,
 * UI in `src/components/interview/` + `src/pages/Interview/`.
 *
 * Conventions (mirroring the rest of the codebase):
 * - Stable ids: `git.interview.<slug>` for questions.
 * - Bilingual `{ en, bn }` copy via LocalText; Git syntax, filenames, branch
 *   names and hashes stay in English in both languages.
 * - `relatedCommands` reference GIT_COMMANDS ids (e.g. `git.status`).
 * - `relatedLessons` reference CurriculumLesson ids (any subject).
 * - `relatedTroubleshooting` reference TroubleshootingGuide ids.
 * - `relatedPractice` reference practice exercise ids (`git.practice.<slug>`).
 * - `relatedInternals` reference internals CurriculumLesson ids.
 */
import { DifficultyLevel, LocalText } from './content';
import { GitSimulationState } from '@/features/simulation/models';

export type InterviewCategory =
  | 'fundamentals'
  | 'commands'
  | 'branching'
  | 'remote'
  | 'troubleshooting'
  | 'internals'
  | 'scenarios';

export type InterviewQuestionType =
  | 'conceptual'
  | 'choice'
  | 'scenario'
  | 'compare'
  | 'state'
  | 'graph';

export interface InterviewOption {
  id: string;
  /** Command text or short answer. Never translated. */
  label: string;
  labelBn?: string;
  correct: boolean;
}

export interface InterviewQuestion {
  /** Stable id, e.g. `git.interview.merge-vs-rebase`. Used for progress + XP. */
  id: string;
  category: InterviewCategory;
  difficulty: DifficultyLevel;
  type: InterviewQuestionType;
  question: LocalText;
  /** 1–3 sentence interview-ready answer. */
  shortAnswer: LocalText;
  /** Deeper conceptual explanation. */
  explanation: LocalText;
  /** Realistic command/example where appropriate. Never translated. */
  exampleCommand?: string;
  exampleNote?: LocalText;
  interviewTip: LocalText;
  commonMistake: LocalText;
  /** Required for choice/state/graph kinds; exactly one correct option. */
  options?: InterviewOption[];
  /** Repository snapshot shown above the question (state/graph kinds). */
  stateSnapshot?: GitSimulationState;
  /** How to render the snapshot. Defaults to 'areas'. */
  snapshotView?: 'areas' | 'graph';
  relatedCommands: string[];
  relatedLessons: string[];
  relatedTroubleshooting: string[];
  relatedPractice: string[];
  relatedInternals: string[];
  tags: string[];
  order: number;
}

/** Self-assessment rating for open-ended questions (no AI grading, ever). */
export type SelfRating = 'knew' | 'partial' | 'review';

export interface MockConfig {
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  focus: InterviewCategory | 'mixed';
  count: 10 | 15 | 20;
}

export interface MockAnswer {
  questionId: string;
  /** Objective kinds: whether the chosen option was correct. */
  correct: boolean | null;
  /** Open kinds: the learner's honest self-assessment. */
  selfRating: SelfRating | null;
  retries: number;
}

export interface MockRecord {
  id: string;
  startedAt: string;
  finishedAt: string;
  config: MockConfig;
  questionIds: string[];
  answers: MockAnswer[];
  score: number;
}

export interface QuestionProgress {
  attempts: number;
  /** Last self-rating for open questions. */
  lastSelfRating?: SelfRating;
  /** Best objective result: true if ever answered correctly. */
  everCorrect?: boolean;
  reviewed: boolean;
  lastAttemptAt: string;
}

export type InterviewProgress = Record<string, QuestionProgress>;

export interface MockHistoryEntry {
  id: string;
  finishedAt: string;
  config: MockConfig;
  score: number;
  total: number;
}

export type InterviewReadinessLevel = 'beginner' | 'developing' | 'ready' | 'advanced';
