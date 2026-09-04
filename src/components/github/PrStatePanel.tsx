import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { useTranslation } from '@/i18n/context';
import { PrSimState, PrStatus } from '@/features/github/prSimulation';

export interface PrStatePanelProps {
  state: PrSimState;
}

function statusKey(status: PrStatus): string {
  switch (status) {
    case 'none': return 'statusNone';
    case 'draft': return 'statusDraft';
    case 'open': return 'statusOpen';
    case 'changes-requested': return 'statusChangesRequested';
    case 'updated': return 'statusUpdated';
    case 'approved': return 'statusApproved';
    case 'merged': return 'statusMerged';
    case 'closed': return 'statusClosed';
  }
}

/** Live PR state readout shared by the guided simulator and the sandbox. */
export const PrStatePanel: React.FC<PrStatePanelProps> = ({ state }) => {
  const { language, t } = useTranslation();
  const g = t.pages.github;
  const isBn = language === 'bn';
  const statusLabel = (g as unknown as Record<string, string>)[statusKey(state.prStatus)] ?? state.prStatus;

  return (
    <Card variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{g.prStateLabel}:</span>
        <Badge variant={state.prStatus === 'merged' ? 'success' : state.prStatus === 'approved' ? 'primary' : state.prStatus === 'closed' ? 'secondary' : state.prStatus === 'none' ? 'outline' : 'warning'} size="sm">
          {statusLabel}
        </Badge>
        <Badge variant="outline" size="sm" aria-label={`feature/login: ${state.commits} commits`}>
          <span className="font-mono">feature/login · {state.commits} {isBn ? 'কমিট' : state.commits === 1 ? 'commit' : 'commits'}</span>
        </Badge>
        {state.pushed && <Badge variant="secondary" size="sm">{isBn ? 'পুশড' : 'pushed'}</Badge>}
      </div>

      {state.comments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{g.commentsLabel}</span>
          {state.comments.map((c) => (
            <div
              key={c.id}
              style={{
                borderLeft: c.kind === 'blocker' ? '3px solid var(--md-sys-color-error)' : '3px solid var(--md-sys-color-outline-variant)',
                paddingLeft: 'var(--space-3)',
                fontSize: '0.875rem',
              }}
            >
              <span className="label-sm" style={{ fontWeight: 700 }}>
                {c.author === 'reviewer' ? (isBn ? 'রিভিউয়ার' : 'Reviewer') : (isBn ? 'আপনি' : 'You')}
                {c.kind === 'blocker' && (c.resolved ? (isBn ? ' · সমাধানকৃত' : ' · resolved') : (isBn ? ' · ব্লকিং' : ' · blocking'))}
              </span>
              <p className="body-sm" style={{ margin: '2px 0 0' }}>{isBn ? c.text.bn : c.text.en}</p>
            </div>
          ))}
        </div>
      )}

      {state.checks.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{g.checksLabel}:</span>
          {state.checks.map((c) => (
            <Badge key={c.id} variant={c.status === 'pass' ? 'success' : c.status === 'fail' ? 'error' : 'warning'} size="sm">
              {c.status === 'pass' ? '✓' : c.status === 'fail' ? '✕' : '…'} {c.name}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
};
