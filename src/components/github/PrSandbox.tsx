import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { TerminalPreview } from '@/components/data-display/TerminalPreview/TerminalPreview';
import { Callout } from '@/components/feedback/Callout/Callout';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import {
  applyPrAction,
  PR_INITIAL_STATE,
  PrActionType,
  PrResult,
  PrSimState,
} from '@/features/github/prSimulation';
import { PrPipeline } from './PrPipeline';
import { PrStatePanel } from './PrStatePanel';

const ACTION_ORDER: PrActionType[] = [
  'sync-main',
  'create-branch',
  'commit',
  'push',
  'open-draft',
  'mark-ready',
  'add-comment',
  'request-changes',
  'push-fix',
  'approve',
  'merge',
  'sync-local',
  'close-pr',
];

function actionKey(type: PrActionType): string {
  switch (type) {
    case 'sync-main': return 'actSyncMain';
    case 'create-branch': return 'actCreateBranch';
    case 'commit': return 'actCommit';
    case 'push': return 'actPush';
    case 'open-draft': return 'actOpenDraft';
    case 'mark-ready': return 'actMarkReady';
    case 'add-comment': return 'actComment';
    case 'request-changes': return 'actRequestChanges';
    case 'push-fix': return 'actPushFix';
    case 'approve': return 'actApprove';
    case 'merge': return 'actMerge';
    case 'sync-local': return 'actSyncLocal';
    case 'close-pr': return 'actClosePr';
    default: return type;
  }
}

/**
 * Free-play PR sandbox: every action from the guided flow, pressable in any
 * order. Invalid actions teach via engine explanations — nothing is real.
 */
export const PrSandbox: React.FC = () => {
  const { language, t } = useTranslation();
  const g = t.pages.github;
  const s = t.pages.simulator;
  const isBn = language === 'bn';
  const [state, setState] = useState<PrSimState>({ ...PR_INITIAL_STATE, comments: [], checks: [] });
  const [lastResult, setLastResult] = useState<PrResult | null>(null);

  const run = (type: PrActionType) => {
    const applied = applyPrAction(state, { type });
    setState(applied.state);
    setLastResult(applied.result);
  };

  const reset = () => {
    setState({ ...PR_INITIAL_STATE, comments: [], checks: [] });
    setLastResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {g.sandboxSubtitle}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }} role="group" aria-label={g.actionsLabel}>
          {ACTION_ORDER.map((type) => (
            <Button
              key={type}
              variant="tonal"
              size="sm"
              onClick={() => run(type)}
            >
              {(g as unknown as Record<string, string>)[actionKey(type)] ?? type}
            </Button>
          ))}
          <Button variant="text" size="sm" onClick={reset} iconLeft={<RotateCcw size={14} />}>
            {s.resetSim}
          </Button>
        </div>
      </Card>

      <PrPipeline state={state} />
      <PrStatePanel state={state} />

      {lastResult && (
        <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <TerminalPreview
            command={lastResult.terminal.command}
            output={isBn ? lastResult.terminal.outputBn : lastResult.terminal.outputEn}
            title={s.terminalTitle}
            copyable={false}
          />
          <figcaption style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--md-sys-color-on-surface-variant)' }}>
            {s.simulatedNote}
          </figcaption>
        </figure>
      )}

      <div aria-live="polite">
        {lastResult && (
          <Callout type={lastResult.ok ? 'tip' : 'warning'} title={isBn ? lastResult.title.bn : lastResult.title.en}>
            {isBn ? lastResult.detail.bn : lastResult.detail.en}
          </Callout>
        )}
      </div>
    </div>
  );
};
