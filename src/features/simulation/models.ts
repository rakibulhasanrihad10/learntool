/**
 * Educational Git simulation models.
 *
 * These types describe a SMALL, deterministic, client-side-only model of a Git
 * repository. They are intentionally not a real Git implementation: there is no
 * object database, no filesystem access, no shell execution, no network.
 *
 * Areas modelled (matching the mental model taught in Learning Mode):
 *   Working Directory → Staging Area → Local Repository → Remote Repository
 */

/** Bilingual text pair. Git syntax, filenames, branch names and hashes stay in English. */
export interface LangText {
  en: string;
  bn: string;
}

/** Per-file state inside the simulated Working Directory. */
export type WorkStatus = 'clean' | 'modified' | 'deleted';

export interface SimFile {
  /** File name, e.g. "README.md". Never translated. */
  name: string;
  workStatus: WorkStatus;
  /** True once the current working-tree state has been staged via `git add`. */
  staged: boolean;
}

/** A simulated commit object (id, message and parent links only). */
export interface SimCommit {
  /** Short simulated id, e.g. "C1", "F2", "F1'". Never translated. */
  id: string;
  message: string;
  /** Parent commit ids (two parents for merge commits). */
  parents: string[];
}

/**
 * Full snapshot of the simulated repository.
 * Everything the visualizer renders is derived from this single object.
 */
export interface GitSimulationState {
  files: SimFile[];
  /** Every commit known to the LOCAL repository (fetched or created locally). */
  commits: SimCommit[];
  /** Local branch name → tip commit id. */
  localBranches: Record<string, string>;
  /** Remote-tracking refs, e.g. "origin/main" → commit id. Updated by fetch/pull/push. */
  remoteTracking: Record<string, string>;
  /** The simulated SERVER state (what `git push` uploads to). */
  serverBranches: Record<string, string>;
  /** Commits that exist on the server but are not yet known locally (pre-fetch). */
  serverOnly: SimCommit[];
  currentBranch: string;
  /** Monotonic counter used to mint fresh commit ids ("C1", "C2", ...). */
  seq: number;
}

/** Repository areas that an action may have changed (used to highlight panels). */
export type ChangedArea = 'working' | 'staging' | 'local' | 'remote' | 'tracking';

/**
 * Predefined simulation actions. The UI NEVER executes free-form terminal input —
 * every button dispatches one of these typed actions.
 */
export type SimAction =
  | { type: 'modify'; file: string }
  | { type: 'delete-file'; file: string }
  | { type: 'stage'; files?: string[] }
  | { type: 'commit'; message: string }
  | { type: 'push' }
  | { type: 'teammate-push'; message: string }
  | { type: 'fetch' }
  | { type: 'pull' }
  | { type: 'switch'; branch: string }
  | { type: 'create-branch'; branch: string }
  | { type: 'merge'; source: string }
  | { type: 'rebase'; onto: string }
  | { type: 'status' }
  | { type: 'diff' }
  | { type: 'log' };

/** Simulated terminal I/O shown in the UI (presentation only). */
export interface SimTerminal {
  /** Exact command text shown after the `$` prompt. Never translated. */
  command: string;
  outputEn: string;
  outputBn: string;
}

/** The educational outcome of applying one action. */
export interface SimResult {
  ok: boolean;
  /** Short headline, e.g. "README.md moved to the Staging Area." */
  title: LangText;
  /** One or two sentences describing the state transition. */
  detail: LangText;
  /** Conceptual takeaway ("Remember"). */
  remember: LangText;
  terminal: SimTerminal;
  /** Areas whose contents changed (for visual highlighting). */
  changes: ChangedArea[];
}

/** A single guided step inside a scenario script. */
export interface ScenarioStep {
  id: string;
  title: LangText;
  /** Why this step exists / what to observe. */
  explanation: LangText;
  /** Command text displayed in the command panel. Never translated. */
  command: string;
  action: SimAction;
  /** What the learner should expect to see after running the step. */
  expectedResult: LangText;
  /** "Why this matters" takeaway. */
  whyItMatters: LangText;
  /** Lesson content id for the "Learn more" link. */
  learnMoreLessonId?: string;
}

/** A complete guided simulation: initial state + ordered steps. */
export interface SimScenario {
  id: string;
  title: LangText;
  subtitle: LangText;
  intro: LangText;
  initial: GitSimulationState;
  steps: ScenarioStep[];
}

export type ScenarioId = 'everyday' | 'merge' | 'rebase' | 'fetch-pull';
