import { describe, it, expect } from 'vitest';
import { applyAction, createEverydayInitial } from '@/features/simulation/engine';
import { GitSimulationState } from '@/features/simulation/models';
import {
  describeRule,
  evaluateAllRules,
  evaluateRule,
  newCommitsSince,
} from './validation';

const fresh = (): GitSimulationState => createEverydayInitial();

function diverged(): GitSimulationState {
  return {
    files: [
      { name: 'README.md', workStatus: 'clean', staged: false },
      { name: 'app.js', workStatus: 'clean', staged: false },
      { name: 'package.json', workStatus: 'clean', staged: false },
    ],
    commits: [
      { id: 'C1', message: 'Initial commit', parents: [] },
      { id: 'C2', message: 'Homepage copy', parents: ['C1'] },
      { id: 'C3', message: 'Login form', parents: ['C1'] },
    ],
    localBranches: { main: 'C2', feature: 'C3' },
    remoteTracking: { 'origin/main': 'C2' },
    serverBranches: { main: 'C2' },
    serverOnly: [],
    currentBranch: 'main',
    seq: 4,
  };
}

describe('validation — branch and HEAD rules', () => {
  it('checks the current branch', () => {
    expect(evaluateRule(fresh(), { rule: 'currentBranchIs', branch: 'main' }).pass).toBe(true);
    expect(evaluateRule(fresh(), { rule: 'currentBranchIs', branch: 'feature' }).pass).toBe(false);
  });

  it('checks branch existence and absence', () => {
    expect(evaluateRule(fresh(), { rule: 'branchExists', branch: 'main' }).pass).toBe(true);
    expect(evaluateRule(fresh(), { rule: 'branchExists', branch: 'nope' }).pass).toBe(false);
    expect(evaluateRule(fresh(), { rule: 'branchAbsent', branch: 'nope' }).pass).toBe(true);
    expect(evaluateRule(fresh(), { rule: 'branchAbsent', branch: 'main' }).pass).toBe(false);
  });

  it('detects a newly created branch after the action', () => {
    const next = applyAction(fresh(), { type: 'create-branch', branch: 'feature/login' }).state;
    expect(evaluateRule(next, { rule: 'branchExists', branch: 'feature/login' }).pass).toBe(true);
    expect(evaluateRule(next, { rule: 'currentBranchIs', branch: 'main' }).pass).toBe(true);
  });
});

describe('validation — commit rules', () => {
  it('counts commits with min and exact', () => {
    expect(evaluateRule(fresh(), { rule: 'commitCountMin', count: 1 }).pass).toBe(true);
    expect(evaluateRule(fresh(), { rule: 'commitCountMin', count: 2 }).pass).toBe(false);
    expect(evaluateRule(fresh(), { rule: 'commitCountExact', count: 1 }).pass).toBe(true);
  });

  it('detects merge commits by parent count', () => {
    expect(evaluateRule(diverged(), { rule: 'tipHasParents', branch: 'main', count: 2 }).pass).toBe(false);
    const merged = applyAction(diverged(), { type: 'merge', source: 'feature' }).state;
    expect(evaluateRule(merged, { rule: 'tipHasParents', branch: 'main', count: 2 }).pass).toBe(true);
  });

  it('compares branch tips for fast-forward detection', () => {
    expect(evaluateRule(fresh(), { rule: 'tipsEqual', branchA: 'main', branchB: 'nope' }).pass).toBe(false);
    const s = diverged();
    s.localBranches.main = 'C3';
    expect(evaluateRule(s, { rule: 'tipsEqual', branchA: 'main', branchB: 'feature' }).pass).toBe(true);
  });

  it('checks ancestry for rebase validation', () => {
    const rebased = applyAction(
      { ...diverged(), currentBranch: 'feature' },
      { type: 'rebase', onto: 'main' }
    ).state;
    expect(evaluateRule(rebased, { rule: 'descendsFrom', branch: 'feature', ancestorBranch: 'main' }).pass).toBe(true);
    expect(evaluateRule(diverged(), { rule: 'descendsFrom', branch: 'feature', ancestorBranch: 'main' }).pass).toBe(false);
  });
});

describe('validation — file and tree rules', () => {
  it('checks file work status and staged flags', () => {
    expect(evaluateRule(fresh(), { rule: 'fileIs', file: 'README.md', workStatus: 'clean' }).pass).toBe(true);
    const modified = applyAction(fresh(), { type: 'modify', file: 'README.md' }).state;
    expect(evaluateRule(modified, { rule: 'fileIs', file: 'README.md', workStatus: 'modified', staged: false }).pass).toBe(true);
    const staged = applyAction(modified, { type: 'stage', files: ['README.md'] }).state;
    expect(evaluateRule(staged, { rule: 'fileIs', file: 'README.md', staged: true }).pass).toBe(true);
    expect(evaluateRule(staged, { rule: 'fileIs', file: 'missing.txt' }).pass).toBe(false);
  });

  it('detects a clean tree only when nothing is staged or modified', () => {
    expect(evaluateRule(fresh(), { rule: 'treeIsClean' }).pass).toBe(true);
    const modified = applyAction(fresh(), { type: 'modify', file: 'app.js' }).state;
    expect(evaluateRule(modified, { rule: 'treeIsClean' }).pass).toBe(false);
  });
});

describe('validation — remote and tracking rules', () => {
  it('detects first-time publish and sync states', () => {
    expect(evaluateRule(fresh(), { rule: 'serverHasBranch', branch: 'feature' }).pass).toBe(false);
    let s = applyAction(fresh(), { type: 'create-branch', branch: 'feature' }).state;
    s = applyAction({ ...s, currentBranch: 'feature' }, { type: 'push' }).state;
    expect(evaluateRule(s, { rule: 'serverHasBranch', branch: 'feature' }).pass).toBe(true);
    expect(evaluateRule(s, { rule: 'remoteInSync', branch: 'feature' }).pass).toBe(true);
    expect(evaluateRule(s, { rule: 'trackingInSync', branch: 'feature' }).pass).toBe(true);
  });

  it('distinguishes tracking state from local state after fetch', () => {
    const withRemote = applyAction(fresh(), { type: 'teammate-push', message: 'Docs' }).state;
    expect(evaluateRule(withRemote, { rule: 'trackingEqualsServer', branch: 'main' }).pass).toBe(false);
    const fetched = applyAction(withRemote, { type: 'fetch' }).state;
    expect(evaluateRule(fetched, { rule: 'trackingEqualsServer', branch: 'main' }).pass).toBe(true);
    expect(evaluateRule(fetched, { rule: 'tipIs', branch: 'main', commit: 'C1' }).pass).toBe(true);
  });
});

describe('validation — reports', () => {
  it('requires every rule to pass (AND semantics)', () => {
    const report = evaluateAllRules(fresh(), [
      { rule: 'currentBranchIs', branch: 'main' },
      { rule: 'branchExists', branch: 'nope' },
    ]);
    expect(report.passed).toBe(false);
    expect(report.verdicts).toHaveLength(2);
    expect(report.verdicts[0].pass).toBe(true);
    expect(report.verdicts[1].pass).toBe(false);
  });

  it('rejects empty rule sets', () => {
    expect(evaluateAllRules(fresh(), []).passed).toBe(false);
  });

  it('describes every rule bilingually', () => {
    const rules = [
      { rule: 'currentBranchIs', branch: 'main' },
      { rule: 'tipIs', branch: 'main', commit: 'C1' },
      { rule: 'trackingEqualsServer', branch: 'main' },
    ] as const;
    for (const rule of rules) {
      const label = describeRule(rule);
      expect(label.en.length).toBeGreaterThan(0);
      expect(label.bn.length).toBeGreaterThan(0);
    }
  });

  it('lists commits created beyond a baseline', () => {
    const before = fresh();
    const after = applyAction(
      applyAction(applyAction(before, { type: 'modify', file: 'app.js' }).state, { type: 'stage' }).state,
      { type: 'commit', message: 'Tweak' }
    ).state;
    expect(newCommitsSince(before, after)).toHaveLength(1);
    expect(newCommitsSince(before, before)).toHaveLength(0);
  });
});
