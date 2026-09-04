/**
 * Content Contracts for GitVerse
 * 
 * Separates data structure from UI implementation.
 * Supports static JSON/Markdown content or future API backend seamlessly.
 */

export type SubjectId = 'git' | 'github' | 'linux' | 'docker' | 'sql' | 'flutter' | 'system-design';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type LearningStatus = 'not_started' | 'in_progress' | 'completed' | 'locked';

export interface SubjectMeta {
  id: SubjectId;
  title: string;
  description: string;
  icon: string;
  moduleCount: number;
  isAvailable: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  titleBn?: string;
  slug: string;
  order: number;
  durationMinutes: number;
  summary: string;
  summaryBn?: string;
  difficulty: DifficultyLevel;
  contentMarkdownRef?: string;
  keyTakeaways: string[];
}

export interface LearningModule {
  id: string;
  subjectId: SubjectId;
  title: string;
  titleBn?: string;
  slug: string;
  description: string;
  descriptionBn?: string;
  icon: string;
  difficulty: DifficultyLevel;
  order: number;
  lessons: Lesson[];
  prerequisites?: string[];
}

export interface CommandExample {
  title: string;
  titleBn?: string;
  command: string; // Commands are always in English
  explanation: string;
  explanationBn?: string;
  outputPreview?: string;
}

export interface Command {
  id: string;
  subjectId: SubjectId;
  name: string;
  syntax: string;
  category: string;
  summary: string;
  summaryBn?: string;
  description: string;
  descriptionBn?: string;
  difficulty: DifficultyLevel;
  tags: string[];
  examples: CommandExample[];
  commonFlags?: {
    flag: string;
    description: string;
    descriptionBn?: string;
  }[];
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  titleBn?: string;
  command?: string;
  description: string;
  descriptionBn?: string;
  proTip?: string;
  proTipBn?: string;
}

export interface Workflow {
  id: string;
  subjectId: SubjectId;
  title: string;
  titleBn?: string;
  category: string;
  difficulty: DifficultyLevel;
  scenario: string;
  scenarioBn?: string;
  steps: WorkflowStep[];
  tags: string[];
}

export interface TroubleshootingScenario {
  id: string;
  subjectId: SubjectId;
  problem: string;
  problemBn?: string;
  symptom: string;
  symptomBn?: string;
  cause: string;
  causeBn?: string;
  quickFixCommand?: string;
  solutionSteps: string[];
  solutionStepsBn?: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}

/* ==========================================================================
   Troubleshooting & Recovery Cookbook (Phase 7)
   Rich, data-driven recovery guides. Content lives in
   src/content/git/troubleshooting.ts — UI only renders this contract.
   ========================================================================== */

/** Bilingual copy block. Git commands, flags, paths and hashes stay in English. */
export interface LocalText {
  en: string;
  bn: string;
}

export type TroubleshootingCategoryId =
  | 'everyday-mistakes'
  | 'undo-recovery'
  | 'branch-problems'
  | 'merge-conflicts'
  | 'rebase-conflicts'
  | 'remote-push'
  | 'commit-problems'
  | 'working-tree'
  | 'detached-head'
  | 'history-recovery'
  | 'collaboration'
  | 'github-workflow'
  | 'security';

export interface TroubleshootingCategory {
  id: TroubleshootingCategoryId;
  title: LocalText;
}

export type TroubleshootingSeverity = 'low' | 'medium' | 'high' | 'critical';

export type CommandSafetyLevel = 'safe' | 'usually-safe' | 'destructive' | 'high-risk';

export interface GuideCheck {
  label: LocalText;
  /** Exact terminal line shown in the diagnose sequence. English-only. */
  command: string;
}

export interface GuideFix {
  title: LocalText;
  steps: LocalText[];
  /** Terminal lines for the fix, in order. English-only. */
  commands: string[];
}

export interface GuideAlternative {
  title: LocalText;
  detail: LocalText;
  commands: string[];
}

export interface GuideWarning {
  level: 'info' | 'caution' | 'danger';
  text: LocalText;
}

export interface GuideTerminal {
  /** Exact command line. English-only. */
  command: string;
  /** Realistic output the user might see. English-only. */
  output: string;
}

export interface GuideDiagram {
  before: string[];
  after: string[];
  caption: LocalText;
}

export interface SimulatorLink {
  scenario: 'everyday' | 'merge' | 'rebase' | 'fetch-pull';
}

export interface TroubleshootingGuide {
  /** Stable id, e.g. 'git.troubleshooting.wrong-branch'. */
  id: string;
  /** URL slug, e.g. 'wrong-branch' → /troubleshooting/git/wrong-branch. */
  slug: string;
  title: LocalText;
  shortDescription: LocalText;
  category: TroubleshootingCategoryId;
  difficulty: DifficultyLevel;
  severity: TroubleshootingSeverity;
  /** What the user observes (terminal text, states). */
  symptoms: LocalText[];
  /** Realistic terminal output the user might see. */
  sightings: GuideTerminal[];
  /** What happened and why — the Git concept behind the problem. */
  diagnosis: LocalText;
  likelyCauses: LocalText[];
  /** Safe inspection sequence to confirm the situation. */
  checks: GuideCheck[];
  /** Preferred recovery path. Safest viable option first. */
  fix: GuideFix;
  alternatives: GuideAlternative[];
  warnings: GuideWarning[];
  /** How to confirm the problem is resolved. */
  verify: LocalText[];
  /** Before/after sketch for recovery scenarios (optional). */
  diagram?: GuideDiagram;
  /** Command slugs/ids for Reference Mode links (resolved against GIT_COMMANDS). */
  commands: string[];
  /** Lesson content ids for Learning Mode links. */
  lessons: string[];
  /** Related guide slugs. */
  scenarios: string[];
  /** Interactive Phase 6 simulation (optional). */
  simulator?: SimulatorLink;
  tags: string[];
  searchKeywords: string[];
  safeForBeginners: boolean;
  popular?: boolean;
  order: number;
}

export interface DecisionOption {
  label: LocalText;
  /** Next node id, or `scenario:<slug>` for a terminal hop to a guide. */
  next: string;
}

export interface DecisionNode {
  id: string;
  question: LocalText;
  options: DecisionOption[];
}

export interface DecisionTree {
  id: string;
  title: LocalText;
  subtitle: LocalText;
  startNode: string;
  nodes: DecisionNode[];
}

export interface InterviewQuestion {
  id: string;
  subjectId: SubjectId;
  question: string;
  questionBn?: string;
  category: string;
  difficulty: DifficultyLevel;
  answer: string;
  answerBn?: string;
  keyPoints: string[];
  keyPointsBn?: string[];
  followUpQuestions?: string[];
}

export interface QuizOption {
  id: string;
  text: string;
  textBn?: string;
  isCorrect: boolean;
  explanation?: string;
  explanationBn?: string;
}

export interface QuizQuestion {
  id: string;
  subjectId: SubjectId;
  question: string;
  questionBn?: string;
  difficulty: DifficultyLevel;
  codeSnippet?: string;
  options: QuizOption[];
  explanation: string;
  explanationBn?: string;
}

/* ==========================================================================
   Discriminated Union Content Blocks & Rich Curriculum Contracts
   ========================================================================== */

export type ContentBlockType =
  | 'paragraph'
  | 'heading'
  | 'code'
  | 'command'
  | 'callout'
  | 'list'
  | 'keyConcept'
  | 'visualizer'
  | 'interviewInsight'
  | 'quiz'
  | 'takeaway';

export interface ParagraphBlock {
  type: 'paragraph';
  text: string;
  textBn?: string;
}

export interface HeadingBlock {
  type: 'heading';
  level: 2 | 3 | 4;
  text: string;
  textBn?: string;
}

export interface CodeBlockData {
  type: 'code';
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export interface CommandBlockData {
  type: 'command';
  command: string;
  description?: string;
  descriptionBn?: string;
}

export interface CalloutBlockData {
  type: 'callout';
  variant: 'note' | 'tip' | 'important' | 'warning' | 'danger' | 'interviewTip';
  title?: string;
  titleBn?: string;
  text: string;
  textBn?: string;
}

export interface ListBlockData {
  type: 'list';
  ordered?: boolean;
  items: string[];
  itemsBn?: string[];
}

export interface KeyConceptBlockData {
  type: 'keyConcept';
  title: string;
  titleBn?: string;
  conceptKey?: string;
  text: string;
  textBn?: string;
}

export interface VisualizerBlockData {
  type: 'visualizer';
  initialState?: 'working' | 'staging' | 'local' | 'remote';
}

export interface InterviewInsightBlockData {
  type: 'interviewInsight';
  question: string;
  questionBn?: string;
  answer: string;
  answerBn?: string;
  keyPoints?: string[];
  keyPointsBn?: string[];
}

export interface QuizBlockData {
  type: 'quiz';
  quiz: QuizQuestion;
}

export interface TakeawayBlockData {
  type: 'takeaway';
  takeaways: string[];
  takeawaysBn?: string[];
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | CodeBlockData
  | CommandBlockData
  | CalloutBlockData
  | ListBlockData
  | KeyConceptBlockData
  | VisualizerBlockData
  | InterviewInsightBlockData
  | QuizBlockData
  | TakeawayBlockData;

export interface LessonSection {
  id: string;
  title: string;
  titleBn?: string;
  blocks: ContentBlock[];
}

export interface CurriculumLesson extends Lesson {
  sections: LessonSection[];
  learningObjectives: string[];
  learningObjectivesBn?: string[];
  quiz?: QuizQuestion;
  interviewQuestion?: InterviewQuestion;
  relatedCommands?: string[];
  relatedLessons?: string[];
}

export interface DetailedCommand {
  id: string;
  command: string;
  slug: string; // URL-safe segment: "status", "add", "commit"
  order: number; // display ordering
  category:
    | 'setup'
    | 'daily'
    | 'inspection'
    | 'branching'
    | 'remote'
    | 'recovery'
    | 'history'
    | 'staging'
    | 'committing'
    | 'merging'
    | 'rebasing'
    | 'sync'
    | 'advanced';
  difficulty: DifficultyLevel;
  title: string;
  titleBn?: string;
  whatItDoes: string;
  whatItDoesBn?: string;
  whenToUse: string;
  whenToUseBn?: string;
  whenNotToUse?: string;
  whenNotToUseBn?: string;
  syntax: string;
  whatHappensInternally: string;
  whatHappensInternallyBn?: string;
  examples: {
    command: string;
    description: string;
    descriptionBn?: string;
    output?: string;
  }[];
  commonOptions: {
    flag: string;
    description: string;
    descriptionBn?: string;
  }[];
  commonMistakes?: {
    mistake: string;
    mistakeBn?: string;
    howToAvoid: string;
    howToAvoidBn?: string;
  }[];
  interviewInsight?: {
    question: string;
    questionBn?: string;
    answer: string;
    answerBn?: string;
  };
  tags: string[];
  relatedCommands?: string[];
  relatedLessons?: string[]; // CurriculumLesson content IDs
  aliases?: string[]; // e.g. ["co"] for checkout
  searchKeywords?: string[]; // extra terms like "undo", "revert", "inspect"
  frequentlyUsed?: boolean; // mark as commonly used daily command
}


