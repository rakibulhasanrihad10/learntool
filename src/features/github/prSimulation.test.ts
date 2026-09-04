import { describe, it, expect } from 'vitest';
import {
  applyPrAction,
  derivePipeline,
  PR_INITIAL_STATE,
  PR_LOGIN_SCENARIO,
  PR_MOCK_DIFF,
  PrSimState,
  replayPrScenario,
} from './prSimulation';

function fresh(): PrSimState {
  return { ...PR_INITIAL_STATE, comments: [], checks: [] };
}

function runAll(state: PrSimState, types: string[]): PrSimState {
  let s = state;
  for (const type of types) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applied = applyPrAction(s, { type } as any);
    s = applied.state;
  }
  return s;
}

describe('prSimulation — guided progression', () => {
  it('has twelve ordered steps covering Draft → Merged', () => {
    expect(PR_LOGIN_SCENARIO).toHaveLength(12);
    const ids = PR_LOGIN_SCENARIO.map((s) => s.id);
    expect(ids[0]).toBe('pr-sync');
    expect(ids[ids.length - 1]).toBe('pr-sync');
  });

  it('replays the full login scenario to a synced, merged PR', () => {
    const { state, results } = replayPrScenario(PR_LOGIN_SCENARIO.length);
    expect(results.every((r) => r.ok)).toBe(true);
    expect(state.prStatus).toBe('merged');
    expect(state.localMainSynced).toBe(true);
    expect(state.commits).toBeGreaterThan(0);
  });

  it('passes through every PR state in order', () => {
    const seen: string[] = [];
    let s = fresh();
    for (const step of PR_LOGIN_SCENARIO) {
      const applied = applyPrAction(s, step.action);
      s = applied.state;
      seen.push(s.prStatus);
    }
    for (const expected of ['draft', 'open', 'changes-requested', 'updated', 'approved', 'merged']) {
      expect(seen).toContain(expected);
    }
  });

  it('resets to the pristine initial state', () => {
    const { state } = replayPrScenario(0);
    expect(state).toEqual(fresh());
    expect(state.prStatus).toBe('none');
    expect(state.comments).toHaveLength(0);
  });

  it('clamps out-of-range replay bounds', () => {
    expect(replayPrScenario(-5).results).toHaveLength(0);
    expect(replayPrScenario(999).results).toHaveLength(PR_LOGIN_SCENARIO.length);
  });
});

describe('prSimulation — state transitions and guards', () => {
  it('blocks branching from a stale main', () => {
    const { state, result } = applyPrAction(fresh(), { type: 'create-branch' });
    expect(result.ok).toBe(false);
    expect(state.branchCreated).toBe(false);
  });

  it('blocks approval while blockers are unresolved', () => {
    let s = runAll(fresh(), ['sync-main', 'create-branch', 'commit', 'push', 'open-draft', 'mark-ready', 'request-changes']);
    expect(s.prStatus).toBe('changes-requested');
    const { state, result } = applyPrAction(s, { type: 'approve' });
    expect(result.ok).toBe(false);
    expect(state.prStatus).toBe('changes-requested');
    s = applyPrAction(s, { type: 'push-fix' }).state;
    expect(s.prStatus).toBe('updated');
    expect(s.comments.every((c) => c.kind !== 'blocker' || c.resolved)).toBe(true);
    const approved = applyPrAction(s, { type: 'approve' });
    expect(approved.result.ok).toBe(true);
    expect(approved.state.prStatus).toBe('approved');
  });

  it('locks merging until approval', () => {
    const s = runAll(fresh(), ['sync-main', 'create-branch', 'commit', 'push', 'open-draft', 'mark-ready']);
    const { state, result } = applyPrAction(s, { type: 'merge' });
    expect(result.ok).toBe(false);
    expect(state.prStatus).toBe('open');
  });

  it('runs green checks on open and fix pushes', () => {
    const s = runAll(fresh(), ['sync-main', 'create-branch', 'commit', 'push', 'open-draft']);
    expect(s.checks.length).toBe(3);
    expect(s.checks.every((c) => c.status === 'pass')).toBe(true);
  });

  it('closes an open PR without merging', () => {
    const s = runAll(fresh(), ['sync-main', 'create-branch', 'commit', 'push', 'open-draft', 'mark-ready']);
    const closed = applyPrAction(s, { type: 'close-pr' });
    expect(closed.result.ok).toBe(true);
    expect(closed.state.prStatus).toBe('closed');
  });

  it('never mutates the input state', () => {
    const before = fresh();
    const snapshot = JSON.stringify(before);
    applyPrAction(before, { type: 'sync-main' });
    expect(JSON.stringify(before)).toBe(snapshot);
  });
});

describe('prSimulation — pipeline, diff, bilingual copy', () => {
  it('derives pipeline stages from live state', () => {
    const start = derivePipeline(fresh());
    expect(start.every((s) => s.state === 'todo')).toBe(true);
    const { state } = replayPrScenario(PR_LOGIN_SCENARIO.length);
    const done = derivePipeline(state);
    expect(done.filter((s) => s.state === 'done').length).toBeGreaterThanOrEqual(8);
    expect(done.every((s) => s.labelEn.length > 0 && s.labelBn.length > 0)).toBe(true);
  });

  it('ships a predefined mock diff with additions and deletions', () => {
    expect(PR_MOCK_DIFF.some((l) => l.kind === 'add')).toBe(true);
    expect(PR_MOCK_DIFF.some((l) => l.kind === 'del')).toBe(true);
  });

  it('resolves every step and result in English and Bangla', () => {
    for (const step of PR_LOGIN_SCENARIO) {
      expect(step.title.en.length).toBeGreaterThan(0);
      expect(step.title.bn.length).toBeGreaterThan(0);
      expect(step.explanation.bn.length).toBeGreaterThan(0);
      expect(step.expected.bn.length).toBeGreaterThan(0);
      expect(step.whyItMatters.bn.length).toBeGreaterThan(0);
    }
    const { results } = replayPrScenario(PR_LOGIN_SCENARIO.length);
    for (const r of results) {
      expect(r.title.bn.length).toBeGreaterThan(0);
      expect(r.detail.bn.length).toBeGreaterThan(0);
      expect(r.terminal.outputBn.length).toBeGreaterThan(0);
    }
  });
});
