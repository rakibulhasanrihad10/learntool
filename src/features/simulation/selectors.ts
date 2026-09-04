/**
 * Read-only selectors over GitSimulationState.
 * The UI derives everything it renders through these helpers —
 * components never implement Git logic themselves.
 */
import { GitSimulationState, SimFile } from './models';
import { isAncestor, localTip } from './engine';

export function stagedFiles(state: GitSimulationState): SimFile[] {
  return state.files.filter((f) => f.staged);
}

export function modifiedFiles(state: GitSimulationState): SimFile[] {
  return state.files.filter((f) => !f.staged && f.workStatus !== 'clean');
}

export function isClean(state: GitSimulationState): boolean {
  return state.files.every((f) => f.workStatus === 'clean' && !f.staged);
}

/** How many local commits the current branch has beyond its remote-tracking ref. */
export function aheadCount(state: GitSimulationState): number {
  const track = state.remoteTracking[`origin/${state.currentBranch}`];
  if (!track) return Object.keys(state.localBranches).length > 0 ? state.commits.length : 0;
  const tip = localTip(state);
  if (tip === track) return 0;
  if (!isAncestor(state.commits, track, tip)) return -1; // diverged
  let n = 0;
  let cur: string | undefined = tip;
  while (cur && cur !== track) {
    n += 1;
    cur = state.commits.find((c) => c.id === cur)?.parents[0];
  }
  return n;
}

/**
 * Screen-reader friendly one-liner, e.g. "HEAD points to main at commit C3."
 * Used for aria-labels and the commit-graph text alternative.
 */
export function headDescription(state: GitSimulationState, lang: 'en' | 'bn'): string {
  const tip = localTip(state);
  return lang === 'bn'
    ? `HEAD ${state.currentBranch}-কে নির্দেশ করে, কমিট ${tip}-তে।`
    : `HEAD points to ${state.currentBranch} at commit ${tip}.`;
}

/** Branch names pointing at a commit (for graph badges). */
export function branchesAt(state: GitSimulationState, commitId: string): string[] {
  return Object.entries(state.localBranches)
    .filter(([, tip]) => tip === commitId)
    .map(([name]) => name);
}

/** Remote-tracking refs pointing at a commit. */
export function trackingAt(state: GitSimulationState, commitId: string): string[] {
  return Object.entries(state.remoteTracking)
    .filter(([, tip]) => tip === commitId)
    .map(([name]) => name);
}
