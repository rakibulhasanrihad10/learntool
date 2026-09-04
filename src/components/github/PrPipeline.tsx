import React from 'react';
import { Check, Circle, Loader } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { derivePipeline, PrSimState } from '@/features/github/prSimulation';

export interface PrPipelineProps {
  state: PrSimState;
}

/**
 * Conceptual workflow visualizer (§21): the collaboration pipeline as a
 * step strip. Stage state uses icon + label + position — never color alone.
 * Wraps on narrow screens; no page-level horizontal overflow.
 */
export const PrPipeline: React.FC<PrPipelineProps> = ({ state }) => {
  const { language, t } = useTranslation();
  const isBn = language === 'bn';
  const stages = derivePipeline(state);

  return (
    <div
      role="list"
      aria-label={t.pages.github.pipelineLabel}
      style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'stretch' }}
    >
      {stages.map((stage, i) => (
        <React.Fragment key={stage.id}>
          <div
            role="listitem"
            aria-current={stage.state === 'active' ? 'step' : undefined}
            aria-label={`${isBn ? stage.labelBn : stage.labelEn}: ${stage.state}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: stage.state === 'active'
                ? '2px solid var(--md-sys-color-primary)'
                : '1px solid var(--md-sys-color-outline-variant)',
              backgroundColor: stage.state === 'done'
                ? 'var(--md-sys-color-primary-container)'
                : 'var(--md-sys-color-surface-container-low)',
              fontSize: '0.8125rem',
              fontWeight: stage.state === 'todo' ? 400 : 600,
              opacity: stage.state === 'todo' ? 0.75 : 1,
            }}
          >
            {stage.state === 'done' ? (
              <Check size={14} aria-hidden="true" />
            ) : stage.state === 'active' ? (
              <Loader size={14} aria-hidden="true" />
            ) : (
              <Circle size={14} aria-hidden="true" />
            )}
            <span>{isBn ? stage.labelBn : stage.labelEn}</span>
          </div>
          {i < stages.length - 1 && (
            <span aria-hidden="true" style={{ alignSelf: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>→</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
