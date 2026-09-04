/**
 * Session-local React bindings for the simulation engine.
 * No persistence, no global state — everything lives in component state and
 * resets on unmount (per spec: session-local React state is sufficient).
 */
import { useEffect, useMemo, useState } from 'react';
import { applyAction } from './engine';
import { clampStepIndex, replayScenario } from './player';
import {
  GitSimulationState,
  SimAction,
  SimResult,
  SimScenario,
  SimTerminal,
} from './models';

export interface ScenarioPlayer {
  state: GitSimulationState;
  stepIndex: number;
  totalSteps: number;
  /** The step most recently applied (null before the first step). */
  currentStep: SimScenario['steps'][number] | null;
  /** Result of the most recently applied step. */
  lastResult: SimResult | null;
  canPrev: boolean;
  canNext: boolean;
  prev: () => void;
  next: () => void;
  runAll: () => void;
  reset: () => void;
  goTo: (index: number) => void;
}

export function useScenarioPlayer(scenario: SimScenario, initialStep = 0): ScenarioPlayer {
  const [stepIndex, setStepIndex] = useState(initialStep);

  useEffect(() => {
    setStepIndex(initialStep);
  }, [scenario.id, initialStep]);

  const replay = useMemo(() => replayScenario(scenario, stepIndex), [scenario, stepIndex]);

  const totalSteps = scenario.steps.length;
  const clamped = clampStepIndex(scenario, stepIndex);

  return {
    state: replay.state,
    stepIndex: clamped,
    totalSteps,
    currentStep: clamped > 0 ? scenario.steps[clamped - 1] : null,
    lastResult: clamped > 0 ? replay.stepResults[clamped - 1] : null,
    canPrev: clamped > 0,
    canNext: clamped < totalSteps,
    prev: () => setStepIndex((i) => clampStepIndex(scenario, i - 1)),
    next: () => setStepIndex((i) => clampStepIndex(scenario, i + 1)),
    runAll: () => setStepIndex(totalSteps),
    reset: () => setStepIndex(0),
    goTo: (index: number) => setStepIndex(clampStepIndex(scenario, index)),
  };
}

export interface FreePlay {
  state: GitSimulationState;
  lastResult: SimResult | null;
  /** Terminal transcript (newest last), resolved per current language at render. */
  history: SimTerminal[];
  run: (action: SimAction) => void;
  reset: () => void;
}

export function useFreePlay(initial: GitSimulationState): FreePlay {
  const [state, setState] = useState<GitSimulationState>(initial);
  const [lastResult, setLastResult] = useState<SimResult | null>(null);
  const [history, setHistory] = useState<SimTerminal[]>([]);

  useEffect(() => {
    setState(initial);
    setLastResult(null);
    setHistory([]);
  }, [initial]);

  return {
    state,
    lastResult,
    history,
    run: (action: SimAction) => {
      const applied = applyAction(state, action);
      setState(applied.state);
      setLastResult(applied.result);
      setHistory((h) => [...h.slice(-19), applied.result.terminal]);
    },
    reset: () => {
      setState(initial);
      setLastResult(null);
      setHistory([]);
    },
  };
}
