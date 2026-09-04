import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { CommandBlock } from '@/components/data-display/CommandBlock/CommandBlock';
import { TerminalPreview } from '@/components/data-display/TerminalPreview/TerminalPreview';
import { Callout } from '@/components/feedback/Callout/Callout';
import { SimulationControls } from '@/components/simulation/SimulationControls/SimulationControls';
import { useTranslation } from '@/i18n/context';
import { PR_LOGIN_SCENARIO, replayPrScenario } from '@/features/github/prSimulation';
import { getLessonRoute } from '@/content/github';
import { PrPipeline } from './PrPipeline';
import { PrStatePanel } from './PrStatePanel';
import { PrDiff } from './PrDiff';

/**
 * Guided PR walkthrough (§22/§24): "You are working on a login feature."
 * Draft → Open → Changes Requested → Updated → Approved → Merged → synced.
 * Deterministic replay model — Previous / Run Step / Run All / Reset.
 */
export const PrSimulator: React.FC = () => {
  const { language, t } = useTranslation();
  const g = t.pages.github;
  const s = t.pages.simulator;
  const isBn = language === 'bn';
  const [stepIndex, setStepIndex] = useState(0);

  const totalSteps = PR_LOGIN_SCENARIO.length;
  const clamped = Math.max(0, Math.min(stepIndex, totalSteps));
  const { state, results } = useMemo(() => replayPrScenario(clamped), [clamped]);
  const step = clamped > 0 ? PR_LOGIN_SCENARIO[clamped - 1] : null;
  const lastResult = clamped > 0 ? results[clamped - 1] : null;
  const lessonRoute = step?.learnMoreLessonId ? getLessonRoute(step.learnMoreLessonId) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Step explainer */}
      <Card variant="elevated" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div>
          <Badge variant="secondary" size="sm">
            {clamped === 0 ? s.introHeading : `${s.currentStep}: ${clamped} / ${totalSteps}`}
          </Badge>
        </div>
        <h3 className="title-lg" style={{ margin: 0, color: 'var(--md-sys-color-on-surface)' }}>
          {step ? (isBn ? step.title.bn : step.title.en) : g.guidedTitle}
        </h3>
        <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.7 }}>
          {step ? (isBn ? step.explanation.bn : step.explanation.en) : g.guidedSubtitle}
        </p>
        {step && (
          <div style={{ maxWidth: '560px' }}>
            <CommandBlock command={step.command} />
          </div>
        )}
      </Card>

      <SimulationControls
        stepIndex={clamped}
        totalSteps={totalSteps}
        canPrev={clamped > 0}
        canNext={clamped < totalSteps}
        onPrev={() => setStepIndex((i) => Math.max(0, i - 1))}
        onNext={() => setStepIndex((i) => Math.min(totalSteps, i + 1))}
        onRunAll={() => setStepIndex(totalSteps)}
        onReset={() => setStepIndex(0)}
        onGoTo={(i) => setStepIndex(Math.max(0, Math.min(totalSteps, i)))}
      />

      {/* Workflow visualizer */}
      <PrPipeline state={state} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
        <PrStatePanel state={state} />
        <PrDiff />
      </div>

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
        {step && (
          <Card variant="filled" padding="md" style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <p className="body-sm" style={{ margin: 0 }}>
              <strong>{s.expected}: </strong>
              {isBn ? step.expected.bn : step.expected.en}
            </p>
            <p className="body-sm" style={{ margin: 0 }}>
              <strong>{s.whyMatters}: </strong>
              {isBn ? step.whyItMatters.bn : step.whyItMatters.en}
            </p>
            {lessonRoute && (
              <Link to={lessonRoute.path} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}>
                {s.learnMore} →
              </Link>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
