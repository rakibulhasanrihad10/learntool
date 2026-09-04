import { describe, it, expect } from 'vitest';
import { applyAction, createEverydayInitial, isAncestor, exclusiveCommits } from './engine';
import { GitSimulationState } from './models';

const fresh = (): GitSimulationState => createEverydayInitial();

describe('engine — git add (working directory → staging)', () => {
  it('stages a modified file without touching the working tree', () => {
    let s = fresh();
    s = applyAction(s, { type: 'modify', file: 'README.md' }).state;
    const { state, result } = applyAction(s, { type: 'stage', files: ['README.md'] });
    expect(result.ok).toBe(true);
    const file = state.files.find((f) => f.name === 'README.md');
    expect(file?.staged).toBe(true);
    expect(file?.workStatus).toBe('modified');
    expect(result.changes).toContain('staging');
  });

  it('refuses to stage a clean tree', () => {
    const { result } = applyAction(fresh(), { type: 'stage' });
    expect(result.ok).toBe(false);
  });
});

describe('engine — git commit (staging → new commit)', () => {
  it('creates a commit, advances branch + HEAD, and clears staging', () => {
    let s = fresh();
    s = applyAction(s, { type: 'modify', file: 'app.js' }).state;
    s = applyAction(s, { type: 'stage' }).state;
    const { state, result } = applyAction(s, { type: 'commit', message: 'Tweak app' });
    expect(result.ok).toBe(true);
    expect(state.commits).toHaveLength(2);
    const head = state.commits[state.commits.length - 1];
    expect(head.parents).toEqual(['C1']);
    expect(state.localBranches.main).toBe(head.id);
    expect(state.files.every((f) => !f.staged && f.workStatus === 'clean')).toBe(true);
  });

  it('refuses an empty commit', () => {
    const { state, result } = applyAction(fresh(), { type: 'commit', message: 'Empty' });
    expect(result.ok).toBe(false);
    expect(state.commits).toHaveLength(1);
  });
});

describe('engine — git push (local → remote)', () => {
  it('moves the server branch forward on fast-forward', () => {
    let s = fresh();
    s = applyAction(s, { type: 'modify', file: 'app.js' }).state;
    s = applyAction(s, { type: 'stage' }).state;
    s = applyAction(s, { type: 'commit', message: 'Tweak app' }).state;
    const { state, result } = applyAction(s, { type: 'push' });
    expect(result.ok).toBe(true);
    expect(state.serverBranches.main).toBe(state.localBranches.main);
    expect(state.remoteTracking['origin/main']).toBe(state.localBranches.main);
  });

  it('rejects a diverged push without rewriting history', () => {
    let s = fresh();
    s = applyAction(s, { type: 'teammate-push', message: 'Docs' }).state;
    s = applyAction(s, { type: 'modify', file: 'app.js' }).state;
    s = applyAction(s, { type: 'stage' }).state;
    s = applyAction(s, { type: 'commit', message: 'Mine' }).state;
    const before = s.serverBranches.main;
    const { state, result } = applyAction(s, { type: 'push' });
    expect(result.ok).toBe(false);
    expect(state.serverBranches.main).toBe(before);
  });
});

describe('engine — git fetch (remote → tracking, branch untouched)', () => {
  it('updates origin/main without moving the local branch', () => {
    let s = fresh();
    s = applyAction(s, { type: 'teammate-push', message: 'Docs' }).state;
    const { state, result } = applyAction(s, { type: 'fetch' });
    expect(result.ok).toBe(true);
    expect(state.localBranches.main).toBe('C1');
    expect(state.remoteTracking['origin/main']).toBe('C2');
    expect(state.commits.some((c) => c.id === 'C2')).toBe(true);
    expect(state.files.every((f) => f.workStatus === 'clean')).toBe(true);
  });
});

describe('engine — git switch', () => {
  it('moves HEAD to the target branch and resets the tree', () => {
    const s: GitSimulationState = {
      ...fresh(),
      localBranches: { main: 'C1', feature: 'C1' },
    };
    const { state, result } = applyAction(s, { type: 'switch', branch: 'feature' });
    expect(result.ok).toBe(true);
    expect(state.currentBranch).toBe('feature');
  });

  it('blocks switching with a dirty tree', () => {
    let s: GitSimulationState = { ...fresh(), localBranches: { main: 'C1', feature: 'C1' } };
    s = applyAction(s, { type: 'modify', file: 'app.js' }).state;
    const { state, result } = applyAction(s, { type: 'switch', branch: 'feature' });
    expect(result.ok).toBe(false);
    expect(state.currentBranch).toBe('main');
  });

  it('rejects unknown branches', () => {
    const { result } = applyAction(fresh(), { type: 'switch', branch: 'nope' });
    expect(result.ok).toBe(false);
  });
});

describe('engine — git merge', () => {
  const diverged = (): GitSimulationState => ({
    ...fresh(),
    commits: [
      { id: 'C1', message: 'Initial commit', parents: [] },
      { id: 'C2', message: 'Base', parents: ['C1'] },
      { id: 'C3', message: 'Main work', parents: ['C2'] },
      { id: 'F1', message: 'Feature work', parents: ['C2'] },
    ],
    localBranches: { main: 'C3', feature: 'F1' },
    seq: 4,
  });

  it('creates a merge commit with two parents when diverged', () => {
    const { state, result } = applyAction(diverged(), { type: 'merge', source: 'feature' });
    expect(result.ok).toBe(true);
    const m = state.commits[state.commits.length - 1];
    expect(m.parents).toEqual(['C3', 'F1']);
    expect(state.localBranches.main).toBe(m.id);
    // source branch untouched
    expect(state.localBranches.feature).toBe('F1');
  });

  it('fast-forwards when the current branch has no unique work', () => {
    const s: GitSimulationState = {
      ...diverged(),
      localBranches: { main: 'C2', feature: 'F1' },
    };
    const { state, result } = applyAction(s, { type: 'merge', source: 'feature' });
    expect(result.ok).toBe(true);
    expect(state.localBranches.main).toBe('F1');
    expect(state.commits).toHaveLength(4); // no new commit
  });

  it('refuses self-merge', () => {
    const { result } = applyAction(fresh(), { type: 'merge', source: 'main' });
    expect(result.ok).toBe(false);
  });
});

describe('engine — git rebase', () => {
  const forked = (): GitSimulationState => ({
    ...fresh(),
    commits: [
      { id: 'C1', message: 'Initial commit', parents: [] },
      { id: 'C2', message: 'Base', parents: ['C1'] },
      { id: 'C3', message: 'Main advance', parents: ['C2'] },
      { id: 'F1', message: 'Feature one', parents: ['C2'] },
      { id: 'F2', message: 'Feature two', parents: ['F1'] },
    ],
    localBranches: { main: 'C3', feature: 'F2' },
    currentBranch: 'feature',
    seq: 4,
  });

  it("replays commits with new ids onto the new base", () => {
    const { state, result } = applyAction(forked(), { type: 'rebase', onto: 'main' });
    expect(result.ok).toBe(true);
    expect(state.localBranches.feature).toBe("F2'");
    const f1p = state.commits.find((c) => c.id === "F1'");
    const f2p = state.commits.find((c) => c.id === "F2'");
    expect(f1p?.parents).toEqual(['C3']);
    expect(f2p?.parents).toEqual(["F1'"]);
    // linear: new tip reaches base through first parents
    expect(isAncestor(state.commits, 'C3', "F2'")).toBe(true);
  });

  it('warns that rebased commits get new identities', () => {
    const { result } = applyAction(forked(), { type: 'rebase', onto: 'main' });
    expect(result.remember.en).toMatch(/NEW identities/i);
    expect(result.remember.bn.length).toBeGreaterThan(0);
  });
});

describe('engine — read-only actions and graph helpers', () => {
  it('status/diff/log never mutate state', () => {
    const s = fresh();
    for (const a of [{ type: 'status' }, { type: 'diff' }, { type: 'log' }] as const) {
      const { state } = applyAction(s, a);
      expect(state).toEqual(s);
    }
  });

  it('teammate-push touches only the server side', () => {
    const { state } = applyAction(fresh(), { type: 'teammate-push', message: 'Docs' });
    expect(state.localBranches.main).toBe('C1');
    expect(state.remoteTracking['origin/main']).toBe('C1');
    expect(state.serverBranches.main).toBe('C2');
    expect(state.serverOnly).toHaveLength(1);
  });

  it('computes ancestry and exclusive sets correctly', () => {
    const s = fresh();
    s.commits.push({ id: 'C2', message: 'x', parents: ['C1'] });
    expect(isAncestor(s.commits, 'C1', 'C2')).toBe(true);
    expect(isAncestor(s.commits, 'C2', 'C1')).toBe(false);
    expect(exclusiveCommits(s.commits, 'C1', 'C2').map((c) => c.id)).toEqual(['C2']);
  });
});
