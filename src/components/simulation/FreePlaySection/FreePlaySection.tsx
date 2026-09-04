import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { TerminalPreview } from '@/components/data-display/TerminalPreview/TerminalPreview';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { RotateCcw, FlaskConical } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { useFreePlay } from '@/features/simulation/useGitSimulation';
import { GitSimulationState } from '@/features/simulation/models';
import { RepositoryState } from '../RepositoryState/RepositoryState';
import { CommitGraph } from '../CommitGraph/CommitGraph';
import { HeadPointer } from '../HeadPointer/HeadPointer';
import { CommandPanel } from '../CommandPanel/CommandPanel';
import { StateChangeSummary } from '../StateChangeSummary/StateChangeSummary';
import '../WorkflowPlayer/WorkflowPlayer.css';

export interface FreePlaySectionProps {
  initial: GitSimulationState;
}

/**
 * Unguided sandbox over the same engine: any predefined action, any order,
 * instant visual feedback, one-click reset. Failed actions teach via the
 * engine's bilingual explanations instead of breaking anything.
 */
export const FreePlaySection: React.FC<FreePlaySectionProps> = ({ initial }) => {
  const { language, t } = useTranslation();
  const s = t.pages.simulator;
  const isBn = language === 'bn';
  const play = useFreePlay(initial);

  const recentHistory = play.history
    .map((term, index) => ({ term, index }))
    .slice(-3);

  return (
    <div className="sim-player">
      <Card variant="filled" padding="lg" className="sim-player__step">
        <div className="sim-player__step-head">
          <FlaskConical size={16} aria-hidden="true" />
          <h3 className="title-md sim-player__step-title">{s.freePlayTitle}</h3>
        </div>
        <p className="body-md sim-player__step-text">{s.freePlaySubtitle}</p>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <CommandPanel state={play.state} onRun={play.run} />
        </div>
        <div>
          <Button variant="text" size="sm" onClick={play.reset} iconLeft={<RotateCcw size={14} />}>
            {s.resetSim}
          </Button>
        </div>
      </Card>

      <RepositoryState state={play.state} highlight={play.lastResult?.changes ?? []} />

      <div className="sim-player__graph-row">
        <Card variant="filled" padding="md" className="sim-player__head-card">
          <HeadPointer state={play.state} />
        </Card>
        <Card variant="filled" padding="md" className="sim-player__graph-card">
          <CommitGraph state={play.state} />
        </Card>
      </div>

      {recentHistory.length === 0 ? (
        <EmptyState title={s.terminalTitle} description={s.emptyHistory} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {recentHistory.map(({ term, index }) => (
            <TerminalPreview
              key={`term-${index}`}
              command={term.command}
              output={isBn ? term.outputBn : term.outputEn}
              title={s.terminalTitle}
              copyable={false}
            />
          ))}
          <span className="sim-player__simnote">{s.simulatedNote}</span>
        </div>
      )}

      <div aria-live="polite">
        <StateChangeSummary result={play.lastResult} />
      </div>
    </div>
  );
};
