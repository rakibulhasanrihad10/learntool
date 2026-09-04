import React from 'react';
import { FileText, Layers, HardDrive, Cloud, ArrowRight, ArrowDown } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { ChangedArea, GitSimulationState } from '@/features/simulation/models';
import { aheadCount } from '@/features/simulation/selectors';
import { FileState } from '../FileState/FileState';
import { cn } from '@/utils/classnames';
import './RepositoryState.css';

export interface RepositoryStateProps {
  state: GitSimulationState;
  /** Areas that just changed — panels pulse once to draw the eye. */
  highlight?: ChangedArea[];
  className?: string;
}

function fileStatusOf(f: GitSimulationState['files'][number]): 'unmodified' | 'modified' | 'staged' | 'deleted' {
  if (f.staged) return 'staged';
  if (f.workStatus === 'deleted') return 'deleted';
  if (f.workStatus === 'modified') return 'modified';
  return 'unmodified';
}

/**
 * The four-area mental model as a live flow diagram:
 * Working Directory →(git add) Staging Area →(git commit) Local →(git push) Remote.
 * Rendered with divs (not an image) so it stays interactive and accessible.
 */
export const RepositoryState: React.FC<RepositoryStateProps> = ({ state, highlight = [], className }) => {
  const { t } = useTranslation();
  const s = t.pages.simulator;

  const staged = state.files.filter((f) => f.staged);
  const ahead = aheadCount(state);
  const localNames = Object.keys(state.localBranches);
  const trackingNames = Object.keys(state.remoteTracking);
  const serverNames = Object.keys(state.serverBranches);

  const panels: { key: ChangedArea; title: string; sub: string; icon: React.ReactNode; body: React.ReactNode }[] = [
    {
      key: 'working',
      title: s.workingDirectory,
      sub: s.workingSub,
      icon: <FileText size={16} aria-hidden="true" />,
      body: state.files.length === 0 ? (
        <span className="sim-area__empty">{s.cleanTree}</span>
      ) : (
        state.files.map((f) => <FileState key={f.name} name={f.name} status={fileStatusOf(f)} />)
      ),
    },
    {
      key: 'staging',
      title: s.stagingArea,
      sub: s.stagingSub,
      icon: <Layers size={16} aria-hidden="true" />,
      body: staged.length === 0 ? (
        <span className="sim-area__empty">{s.emptyStaging}</span>
      ) : (
        staged.map((f) => <FileState key={f.name} name={f.name} status="staged" />)
      ),
    },
    {
      key: 'local',
      title: s.localRepo,
      sub: s.localSub,
      icon: <HardDrive size={16} aria-hidden="true" />,
      body: (
        <>
          {localNames.map((name) => (
            <div
              key={name}
              className={cn('sim-area__branch', name === state.currentBranch && 'sim-area__branch--current')}
            >
              <code className="font-mono sim-area__branch-name">{name}</code>
              <span className="font-mono sim-area__branch-tip">→ {state.localBranches[name]}</span>
              {name === state.currentBranch && <span className="sim-area__head-tag">HEAD</span>}
            </div>
          ))}
          {ahead > 0 && (
            <span className="sim-area__meta">+{ahead} {s.aheadOf} origin/{state.currentBranch}</span>
          )}
        </>
      ),
    },
    {
      key: 'remote',
      title: s.remoteRepo,
      sub: s.remoteSub,
      icon: <Cloud size={16} aria-hidden="true" />,
      body: (
        <>
          {serverNames.map((name) => (
            <div key={name} className="sim-area__branch">
              <code className="font-mono sim-area__branch-name">{name}</code>
              <span className="font-mono sim-area__branch-tip">→ {state.serverBranches[name]}</span>
            </div>
          ))}
          {trackingNames.length > 0 && (
            <>
              <span className="sim-area__divider">{s.trackingSub}</span>
              {trackingNames.map((name) => (
                <div
                  key={name}
                  className={cn('sim-area__branch', 'sim-area__branch--tracking', highlight.includes('tracking') && 'sim-area__branch--lit')}
                >
                  <code className="font-mono sim-area__branch-name">{name}</code>
                  <span className="font-mono sim-area__branch-tip">→ {state.remoteTracking[name]}</span>
                </div>
              ))}
            </>
          )}
        </>
      ),
    },
  ];

  const transitions = ['git add', 'git commit', 'git push'];

  return (
    <div className={cn('sim-areas', className)} role="group" aria-label={`${s.workingDirectory} → ${s.stagingArea} → ${s.localRepo} → ${s.remoteRepo}`}>
      {panels.map((panel, i) => (
        <React.Fragment key={panel.key}>
          {i > 0 && (
            <div className="sim-areas__transition" aria-hidden="true">
              <span className="sim-areas__transition-cmd font-mono">{transitions[i - 1]}</span>
              <ArrowRight size={16} className="sim-areas__arrow-h" />
              <ArrowDown size={16} className="sim-areas__arrow-v" />
            </div>
          )}
          <section
            className={cn('sim-area', highlight.includes(panel.key) && 'sim-area--changed')}
            aria-label={panel.title}
          >
            <header className="sim-area__header">
              {panel.icon}
              <span className="label-sm">{panel.title}</span>
            </header>
            <div className="sim-area__body">
              <span className="sim-area__sub">{panel.sub}</span>
              <div className="sim-area__items">{panel.body}</div>
            </div>
          </section>
        </React.Fragment>
      ))}
    </div>
  );
};
