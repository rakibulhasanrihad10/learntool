import React from 'react';
import { ArrowDown, MapPin } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { localTip } from '@/features/simulation/engine';
import { GitSimulationState } from '@/features/simulation/models';
import './HeadPointer.css';

export interface HeadPointerProps {
  state: GitSimulationState;
  className?: string;
}

/**
 * HEAD → branch → commit chain. Makes explicit that HEAD is a pointer to the
 * current branch, not a branch itself.
 */
export const HeadPointer: React.FC<HeadPointerProps> = ({ state, className }) => {
  const { t } = useTranslation();
  const tip = localTip(state);

  return (
    <figure className={`sim-head${className ? ` ${className}` : ''}`} aria-label={`HEAD → ${state.currentBranch} → ${tip}`}>
      <div className="sim-head__chain">
        <span className="sim-head__node sim-head__node--head">
          <MapPin size={13} aria-hidden="true" />
          HEAD
        </span>
        <ArrowDown size={14} className="sim-head__arrow" aria-hidden="true" />
        <span className="sim-head__node sim-head__node--branch">{state.currentBranch}</span>
        <ArrowDown size={14} className="sim-head__arrow" aria-hidden="true" />
        <code className="sim-head__node sim-head__node--commit font-mono">{tip}</code>
      </div>
      <figcaption className="sim-head__caption body-sm">{t.pages.simulator.headCaption}</figcaption>
    </figure>
  );
};
