/**
 * Scenario player logic — pure and testable.
 *
 * A scenario is a deterministic script: `stateAtStep(scenario, i)` replays the
 * first `i` step actions from the initial state, so Previous/Next/Reset/Run All
 * are just pointer moves. No simulator state is ever persisted.
 */
import { applyAction } from './engine';
import { GitSimulationState, SimResult, SimScenario } from './models';

export interface Replay {
  /** State after applying the first `stepIndex` steps. */
  state: GitSimulationState;
  /** Per-step results for the applied steps (index-aligned with scenario.steps). */
  stepResults: SimResult[];
}

/** Clamp a requested step pointer into the valid range [0, steps.length]. */
export function clampStepIndex(scenario: SimScenario, requested: number): number {
  if (!Number.isFinite(requested)) return 0;
  return Math.min(Math.max(0, Math.floor(requested)), scenario.steps.length);
}

/** Replay the first `stepIndex` steps of a scenario from its initial state. */
export function replayScenario(scenario: SimScenario, stepIndex: number): Replay {
  const upto = clampStepIndex(scenario, stepIndex);
  let state = scenario.initial;
  const stepResults: SimResult[] = [];
  for (let i = 0; i < upto; i += 1) {
    const step = scenario.steps[i];
    const applied = applyAction(state, step.action);
    state = applied.state;
    stepResults.push(applied.result);
  }
  return { state, stepResults };
}
