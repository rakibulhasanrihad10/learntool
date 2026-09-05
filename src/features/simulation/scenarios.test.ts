import { describe, it, expect } from 'vitest';
import { demoForCommand } from './engine';
import { clampStepIndex, replayScenario } from './player';
import { SIM_SCENARIOS, getScenario, scenarioForLesson } from './scenarios';

describe('scenarios — script validity', () => {
  it('registers the four expected scenarios', () => {
    expect(SIM_SCENARIOS.map((s) => s.id)).toEqual(['everyday', 'merge', 'rebase', 'fetch-pull']);
  });

  it('replays every scenario end-to-end with all steps succeeding', () => {
    for (const scenario of SIM_SCENARIOS) {
      const { state, stepResults } = replayScenario(scenario, scenario.steps.length);
      expect(stepResults).toHaveLength(scenario.steps.length);
      for (const [i, r] of stepResults.entries()) {
        expect(r.ok, `${scenario.id} step ${i} (${scenario.steps[i].id}) should succeed`).toBe(true);
      }
      expect(state.commits.length).toBeGreaterThan(0);
    }
  });

  it('everyday ends fully synced (local = tracking = server)', () => {
    const scenario = getScenario('everyday');
    const { state } = replayScenario(scenario, scenario.steps.length);
    expect(state.localBranches.main).toBe(state.remoteTracking['origin/main']);
    expect(state.localBranches.main).toBe(state.serverBranches.main);
    expect(state.files.every((f) => f.workStatus === 'clean' && !f.staged)).toBe(true);
  });

  it('merge ends with a two-parent commit on main', () => {
    const { state } = replayScenario(getScenario('merge'), 99);
    const tip = state.localBranches.main;
    const commit = state.commits.find((c) => c.id === tip);
    expect(commit?.parents).toHaveLength(2);
  });

  it('rebase ends with main fast-forwarded onto replayed commits', () => {
    const { state } = replayScenario(getScenario('rebase'), 99);
    expect(state.localBranches.main).toBe("F2'");
    expect(state.currentBranch).toBe('main');
  });

  it('fetch-pull demonstrates tracking moving before the local branch', () => {
    const scenario = getScenario('fetch-pull');
    const afterFetch = replayScenario(scenario, 2);
    expect(afterFetch.state.remoteTracking['origin/main']).toBe('C2');
    expect(afterFetch.state.localBranches.main).toBe('C1');
    const afterPull = replayScenario(scenario, 4);
    expect(afterPull.state.localBranches.main).toBe('C2');
  });
});

describe('player — step progression (previous/next/reset/run-all)', () => {
  const scenario = getScenario('everyday');

  it('clamps out-of-range pointers', () => {
    expect(clampStepIndex(scenario, -3)).toBe(0);
    expect(clampStepIndex(scenario, 999)).toBe(scenario.steps.length);
    expect(clampStepIndex(scenario, 2.7)).toBe(2);
  });

  it('step 0 reproduces the pristine initial state', () => {
    const { state, stepResults } = replayScenario(scenario, 0);
    expect(stepResults).toHaveLength(0);
    expect(state).toEqual(scenario.initial);
  });

  it('each next step applies exactly one more action', () => {
    const a = replayScenario(scenario, 3);
    const b = replayScenario(scenario, 4);
    expect(b.stepResults).toHaveLength(a.stepResults.length + 1);
    // stepping back restores the earlier snapshot (reset semantics)
    expect(replayScenario(scenario, 3).state).toEqual(a.state);
  });

  it('unknown scenario ids fall back to everyday', () => {
    expect(getScenario('nope').id).toBe('everyday');
  });
});

describe('scenarios — bilingual content resolution', () => {
  it('every step carries non-empty English + Bangla copy', () => {
    for (const scenario of SIM_SCENARIOS) {
      expect(scenario.title.bn.length).toBeGreaterThan(0);
      for (const step of scenario.steps) {
        for (const field of [step.title, step.explanation, step.expectedResult, step.whyItMatters] as const) {
          expect(field.en.length, `${scenario.id}/${step.id} en`).toBeGreaterThan(0);
          expect(field.bn.length, `${scenario.id}/${step.id} bn`).toBeGreaterThan(0);
        }
        // commands and ids stay untranslated (no Bangla digits block)
        expect(step.command.length).toBeGreaterThan(0);
      }
    }
  });

  it('maps lessons and commands to sensible demos', () => {
    expect(scenarioForLesson('git.fundamentals.remote-repository')).toBe('fetch-pull');
    expect(scenarioForLesson('git.fundamentals.branch')).toBe('merge');
    expect(scenarioForLesson('git.fundamentals.staging-area')).toBe('everyday');
    expect(scenarioForLesson('git.fundamentals.what-is-git')).toBeNull();
    expect(scenarioForLesson('git.fundamentals.git-vs-github')).toBeNull();
    expect(scenarioForLesson('git.fundamentals.repository')).toBeNull();
    expect(demoForCommand('rebase')?.scenario).toBe('rebase');
    expect(demoForCommand('fetch')?.scenario).toBe('fetch-pull');
    expect(demoForCommand('status')?.scenario).toBe('everyday');
    expect(demoForCommand('config')).toBeNull();
  });
});
