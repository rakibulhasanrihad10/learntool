import React from 'react';
import { useTranslation } from '@/i18n/context';
import { PR_MOCK_DIFF } from '@/features/github/prSimulation';

export interface PrDiffProps {
  fileName?: string;
}

/**
 * Simplified mock diff (§23): predefined lines only, no parser.
 * Reviewers inspect base-vs-proposed differences — this shows what that looks like.
 */
export const PrDiff: React.FC<PrDiffProps> = ({ fileName = 'auth.js' }) => {
  const { t } = useTranslation();
  const g = t.pages.github;

  return (
    <div
      role="img"
      aria-label={g.diffCaption}
      style={{
        border: '1px solid var(--md-sys-color-outline-variant)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      <div
        className="label-sm font-mono"
        style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--md-sys-color-surface-container-high)' }}
      >
        {fileName} — {g.diffTitle}
      </div>
      <pre
        className="font-mono"
        style={{ margin: 0, padding: 'var(--space-3)', fontSize: '0.8125rem', lineHeight: 1.7, overflowX: 'auto', backgroundColor: 'var(--md-sys-color-surface-container-lowest)' }}
      >
        {PR_MOCK_DIFF.map((line, i) => (
          <div
            key={i}
            style={{
              backgroundColor:
                line.kind === 'add'
                  ? 'var(--md-sys-color-success-container)'
                  : line.kind === 'del'
                    ? 'var(--md-sys-color-error-container)'
                    : 'transparent',
              color: 'var(--md-sys-color-on-surface)',
              padding: '0 var(--space-2)',
            }}
          >
            <span aria-hidden="true" style={{ display: 'inline-block', width: '1.25em', fontWeight: 700 }}>
              {line.kind === 'add' ? '+' : line.kind === 'del' ? '−' : line.kind === 'hunk' ? '⋯' : ' '}
            </span>
            {line.text}
          </div>
        ))}
      </pre>
      <div className="body-sm" style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--md-sys-color-on-surface-variant)' }}>
        {g.diffCaption}
      </div>
    </div>
  );
};
