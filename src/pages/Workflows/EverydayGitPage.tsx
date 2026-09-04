import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Badge } from '@/components/common/Badge/Badge';
import { Chip } from '@/components/common/Chip/Chip';
import { FlaskConical, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { SIM_SCENARIOS, getScenario } from '@/features/simulation/scenarios';
import { WorkflowPlayer } from '@/components/simulation/WorkflowPlayer/WorkflowPlayer';
import { FreePlaySection } from '@/components/simulation/FreePlaySection/FreePlaySection';

/**
 * /workflows/everyday-git — Interactive Git Simulator.
 * Scenario tabs (?scenario=everyday|merge|rebase|fetch-pull, ?step=n) share one
 * deterministic engine; the free-play sandbox below reuses the same components.
 */
export const EverydayGitPage: React.FC = () => {
  const { language, t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isBn = language === 'bn';
  const s = t.pages.simulator;

  const scenario = useMemo(
    () => getScenario(searchParams.get('scenario') ?? 'everyday'),
    [searchParams]
  );

  const initialStep = useMemo(() => {
    const raw = Number.parseInt(searchParams.get('step') ?? '', 10);
    if (!Number.isFinite(raw)) return 0;
    return Math.min(Math.max(0, raw), scenario.steps.length);
  }, [searchParams, scenario]);

  const selectScenario = (id: string) => {
    setSearchParams(id === 'everyday' ? {} : { scenario: id });
    window.scrollTo(0, 0);
  };

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Breadcrumb
          items={[
            { label: t.pages.workflows.title, path: '/workflows' },
            { label: s.title, isCurrent: true },
          ]}
        />

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Badge variant="primary" size="md">
              <FlaskConical size={14} />
              <span>{s.badge}</span>
            </Badge>
            <Badge variant="secondary" size="sm">
              <ShieldCheck size={12} />
              <span>{s.simulatedNote}</span>
            </Badge>
          </div>
          <h1 className="headline-lg">{s.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {s.subtitle}
          </p>
        </div>

        {/* Scenario tabs */}
        <div role="tablist" aria-label={s.scenarioLabel} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {SIM_SCENARIOS.map((sc) => (
            <Chip
              key={sc.id}
              role="tab"
              aria-selected={sc.id === scenario.id}
              selected={sc.id === scenario.id}
              onClick={() => selectScenario(sc.id)}
            >
              {isBn ? sc.title.bn : sc.title.en}
            </Chip>
          ))}
        </div>

        {/* Guided scenario */}
        <section aria-label={s.guidedTitle}>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 0 }}>
            {isBn ? scenario.subtitle.bn : scenario.subtitle.en}
          </p>
          <WorkflowPlayer key={scenario.id} scenario={scenario} initialStep={initialStep} />
        </section>

        {/* Free play */}
        <section aria-label={s.freePlayTitle} style={{ marginTop: 'var(--space-4)' }}>
          <FreePlaySection key={`free-${scenario.id}`} initial={scenario.initial} />
        </section>
      </div>
    </PageContainer>
  );
};
