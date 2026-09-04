import React, { useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import { GitSimulationState, SimAction } from '@/features/simulation/models';
import './CommandPanel.css';

export interface CommandPanelProps {
  state: GitSimulationState;
  onRun: (action: SimAction) => void;
}

interface ActionDef {
  key: string;
  label: string;
  command: string;
  action: SimAction;
  disabled?: boolean;
  disabledReason?: string;
  note?: string;
}

/**
 * Predefined simulation actions grouped by intent. This is NOT a terminal:
 * learners pick an action, the engine applies it, and the UI explains it.
 */
export const CommandPanel: React.FC<CommandPanelProps> = ({ state, onRun }) => {
  const { language, t } = useTranslation();
  const s = t.pages.simulator;
  const isBn = language === 'bn';

  const [commitMessage, setCommitMessage] = useState('Update files');
  const [newBranch, setNewBranch] = useState('feature');
  const [switchTarget, setSwitchTarget] = useState('');
  const [mergeSource, setMergeSource] = useState('');
  const [rebaseOnto, setRebaseOnto] = useState('');

  const cleanFiles = state.files.filter((f) => f.workStatus === 'clean' && !f.staged);
  const canStage = state.files.some((f) => !f.staged && f.workStatus !== 'clean');
  const canCommit = state.files.some((f) => f.staged);
  const branchNames = Object.keys(state.localBranches);
  const otherBranches = branchNames.filter((b) => b !== state.currentBranch);

  const group = (title: string, defs: ActionDef[], extra?: React.ReactNode) => (
    <section className="sim-panel__group" aria-label={title}>
      <h4 className="label-sm sim-panel__group-title">{title}</h4>
      <div className="sim-panel__actions">
        {defs.map((def) => (
          <div key={def.key} className="sim-panel__action">
            <Button
              variant="tonal"
              size="sm"
              disabled={def.disabled}
              title={def.disabled ? def.disabledReason : def.command}
              onClick={() => onRun(def.action)}
              aria-label={`${def.label} — ${def.command}`}
            >
              {def.label}
            </Button>
            <code className="font-mono sim-panel__cmd">{def.command}</code>
            {def.note && <span className="sim-panel__note">{def.note}</span>}
          </div>
        ))}
      </div>
      {extra}
    </section>
  );

  return (
    <div className="sim-panel">
      {group(s.groupInspect, [
        { key: 'status', label: 'status', command: 'git status', action: { type: 'status' } },
        { key: 'diff', label: 'diff', command: 'git diff', action: { type: 'diff' } },
        { key: 'log', label: 'log', command: 'git log --oneline --graph --all', action: { type: 'log' } },
      ])}

      {group(s.groupEdit, [
        ...cleanFiles.map((f) => ({
          key: `edit-${f.name}`,
          label: isBn ? `এডিট ${f.name}` : `Edit ${f.name}`,
          command: `# edit ${f.name}`,
          action: { type: 'modify', file: f.name } as SimAction,
        })),
        {
          key: 'stage',
          label: 'add',
          command: 'git add .',
          action: { type: 'stage' },
          disabled: !canStage,
          disabledReason: isBn ? 'স্টেজ করার মতো কিছু নেই' : 'Nothing to stage',
        },
        {
          key: 'commit',
          label: 'commit',
          command: `git commit -m "${commitMessage || 'Update files'}"`,
          action: { type: 'commit', message: commitMessage.trim() || 'Update files' },
          disabled: !canCommit,
          disabledReason: isBn ? 'আগে কিছু স্টেজ করুন' : 'Stage something first',
        },
      ], (
        <label className="sim-panel__field">
          <span className="label-sm">{s.commitMessageLabel}</span>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            maxLength={72}
            className="sim-panel__input font-mono"
          />
        </label>
      ))}

      {group(s.groupSync, [
        { key: 'push', label: 'push', command: 'git push', action: { type: 'push' } },
        { key: 'fetch', label: 'fetch', command: 'git fetch', action: { type: 'fetch' } },
        { key: 'pull', label: 'pull', command: 'git pull', action: { type: 'pull' } },
        {
          key: 'teammate',
          label: isBn ? 'সহকর্মীর পুশ' : 'Teammate push',
          command: '# teammate runs: git push',
          action: { type: 'teammate-push', message: 'Teammate update' },
          note: s.teammateNote,
        },
      ])}

      {group(s.groupBranch, [
        {
          key: 'switch',
          label: 'switch',
          command: `git switch ${switchTarget || '…'}`,
          action: { type: 'switch', branch: switchTarget || state.currentBranch },
          disabled: otherBranches.length === 0 || !switchTarget,
          disabledReason: isBn ? 'অন্য ব্রাঞ্চ বেছে নিন' : 'Pick another branch',
        },
        {
          key: 'merge',
          label: 'merge',
          command: `git merge ${mergeSource || '…'}`,
          action: { type: 'merge', source: mergeSource || state.currentBranch },
          disabled: otherBranches.length === 0 || !mergeSource,
          disabledReason: isBn ? 'সোর্স ব্রাঞ্চ বেছে নিন' : 'Pick a source branch',
        },
        {
          key: 'rebase',
          label: 'rebase',
          command: `git rebase ${rebaseOnto || '…'}`,
          action: { type: 'rebase', onto: rebaseOnto || state.currentBranch },
          disabled: otherBranches.length === 0 || !rebaseOnto,
          disabledReason: isBn ? 'বেস ব্রাঞ্চ বেছে নিন' : 'Pick a base branch',
        },
      ], (
        <div className="sim-panel__fields">
          <label className="sim-panel__field">
            <span className="label-sm">switch / merge / rebase →</span>
            <select
              value={switchTarget}
              onChange={(e) => {
                setSwitchTarget(e.target.value);
                setMergeSource(e.target.value);
                setRebaseOnto(e.target.value);
              }}
              className="sim-panel__input font-mono"
              aria-label={isBn ? 'লক্ষ্য ব্রাঞ্চ' : 'Target branch'}
            >
              <option value="">—</option>
              {otherBranches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="sim-panel__field">
            <span className="label-sm">{s.branchNameLabel}</span>
            <span className="sim-panel__inline">
              <input
                type="text"
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value.replace(/\s+/g, '-'))}
                maxLength={32}
                className="sim-panel__input font-mono"
              />
              <Button
                variant="tonal"
                size="sm"
                disabled={!newBranch.trim() || branchNames.includes(newBranch.trim())}
                onClick={() => {
                  onRun({ type: 'create-branch', branch: newBranch.trim() });
                  setNewBranch('');
                }}
                aria-label={`Create branch ${newBranch}`}
              >
                +
              </Button>
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};
