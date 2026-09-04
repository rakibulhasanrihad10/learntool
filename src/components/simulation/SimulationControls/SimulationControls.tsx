import React from 'react';
import { ArrowLeft, Play, FastForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import './SimulationControls.css';

export interface SimulationControlsProps {
  stepIndex: number;
  totalSteps: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  /** Advance one step — applies the step's action (identical to Next in the replay model). */
  onNext: () => void;
  onRunAll: () => void;
  onReset: () => void;
  onGoTo?: (index: number) => void;
}

/**
 * Previous / Run Step (= Next) / Run All / Reset with step dots.
 * In the deterministic replay model, moving the pointer applies (or un-applies)
 * each step's action, so Run Step and Next share one code path.
 */
export const SimulationControls: React.FC<SimulationControlsProps> = ({
  stepIndex,
  totalSteps,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onRunAll,
  onReset,
  onGoTo,
}) => {
  const { language, t } = useTranslation();
  const s = t.pages.simulator;

  return (
    <div className="sim-controls">
      <div className="sim-controls__buttons" role="group" aria-label={s.guidedTitle}>
        <Button variant="outlined" size="sm" disabled={!canPrev} onClick={onPrev} iconLeft={<ArrowLeft size={14} />}>
          {s.previous}
        </Button>
        <Button variant="filled" size="sm" disabled={!canNext} onClick={onNext} iconLeft={<Play size={14} />}>
          {s.runStep}
        </Button>
        <Button variant="tonal" size="sm" disabled={!canNext} onClick={onRunAll} iconLeft={<FastForward size={14} />}>
          {s.runAll}
        </Button>
        <Button variant="text" size="sm" onClick={onReset} iconLeft={<RotateCcw size={14} />}>
          {s.resetSim}
        </Button>
      </div>

      <div className="sim-controls__progress">
        <span className="label-sm sim-controls__counter" aria-live="polite">
          {s.stepLabel} {stepIndex} / {totalSteps}
        </span>
        {onGoTo && (
          <div className="sim-controls__dots" role="group" aria-label={`${s.stepLabel} navigation`}>
            {Array.from({ length: totalSteps + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`sim-controls__dot${i === stepIndex ? ' sim-controls__dot--active' : ''}${i < stepIndex ? ' sim-controls__dot--done' : ''}`}
                onClick={() => onGoTo(i)}
                aria-label={`${s.stepLabel} ${i}${language === 'bn' ? ' এ যান' : ` — go to step ${i}`}`}
                aria-current={i === stepIndex ? 'step' : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
