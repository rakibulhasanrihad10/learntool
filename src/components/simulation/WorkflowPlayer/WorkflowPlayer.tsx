import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { CommandBlock } from '@/components/data-display/CommandBlock/CommandBlock';
import { TerminalPreview } from '@/components/data-display/TerminalPreview/TerminalPreview';
import { useTranslation } from '@/i18n/context';
import { useScenarioPlayer } from '@/features/simulation/useGitSimulation';
import { SimScenario } from '@/features/simulation/models';
import { RepositoryState } from '../RepositoryState/RepositoryState';
import { CommitGraph } from '../CommitGraph/CommitGraph';
import { HeadPointer } from '../HeadPointer/HeadPointer';
import { SimulationControls } from '../SimulationControls/SimulationControls';
import { StateChangeSummary } from '../StateChangeSummary/StateChangeSummary';
import './WorkflowPlayer.css';

export interface WorkflowPlayerProps {
  scenario: SimScenario;
  initialStep?: number;
}

/**
 * Guided scenario runner: step explainer + controls + live visualizer +
 * simulated terminal + "what happened" summary. State is derived by replaying
 * the scenario script, so navigation and Reset are always consistent.
 */
export const WorkflowPlayer: React.FC<WorkflowPlayerProps> = ({ scenario, initialStep = 0 }) => {
  const { language, t } = useTranslation();
  const s = t.pages.simulator;
  const isBn = language === 'bn';
  const player = useScenarioPlayer(scenario, initialStep);

  const step = player.currentStep;

  return (
    <div className="sim-player">
      {/* Step explainer */}
      <Card variant="elevated" padding="lg" className="sim-player__step">
        <div className="sim-player__step-head">
          <Badge variant="secondary" size="sm">
            {player.stepIndex === 0
              ? s.introHeading
              : `${s.currentStep}: ${player.stepIndex} / ${player.totalSteps}`}
          </Badge>
        </div>
        <h3 className="title-lg sim-player__step-title">
          {step ? (isBn ? step.title.bn : step.title.en) : (isBn ? scenario.title.bn : scenario.title.en)}
        </h3>
        <p className="body-md sim-player__step-text">
          {step
            ? (isBn ? step.explanation.bn : step.explanation.en)
            : (isBn ? scenario.intro.bn : scenario.intro.en)}
        </p>
        {step && (
          <div className="sim-player__cmd">
            <CommandBlock command={step.command} />
          </div>
        )}
      </Card>

      {/* Controls */}
      <SimulationControls
        stepIndex={player.stepIndex}
        totalSteps={player.totalSteps}
        canPrev={player.canPrev}
        canNext={player.canNext}
        onPrev={player.prev}
        onNext={player.next}
        onRunAll={player.runAll}
        onReset={player.reset}
        onGoTo={player.goTo}
      />

      {/* Live visualization */}
      <RepositoryState
        key={player.stepIndex}
        state={player.state}
        highlight={player.lastResult?.changes ?? []}
      />

      <div className="sim-player__graph-row">
        <Card variant="filled" padding="md" className="sim-player__head-card">
          <HeadPointer state={player.state} />
        </Card>
        <Card variant="filled" padding="md" className="sim-player__graph-card">
          <CommitGraph state={player.state} />
        </Card>
      </div>

      {/* Simulated terminal */}
      {player.lastResult && (
        <figure className="sim-player__terminal">
          <TerminalPreview
            command={player.lastResult.terminal.command}
            output={isBn ? player.lastResult.terminal.outputBn : player.lastResult.terminal.outputEn}
            title={s.terminalTitle}
            copyable={false}
          />
          <figcaption className="sim-player__simnote">{s.simulatedNote}</figcaption>
        </figure>
      )}

      {/* Explanation (announced to screen readers) */}
      <div aria-live="polite">
        <StateChangeSummary
          result={player.lastResult}
          expectedEn={step ? step.expectedResult.en : undefined}
          expectedBn={step ? step.expectedResult.bn : undefined}
          whyEn={step ? step.whyItMatters.en : undefined}
          whyBn={step ? step.whyItMatters.bn : undefined}
          learnMoreLessonId={step?.learnMoreLessonId}
        />
      </div>
    </div>
  );
};
