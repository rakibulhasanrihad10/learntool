import React, { useEffect, useMemo } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import { LEARNING_PATHS } from '@/content/paths';
import { useLearningSignals } from '@/features/paths/signals';
import { getContinueTarget, summarizePath } from '@/features/paths/progress';
import { computeMastery } from '@/features/paths/mastery';
import { getWeakAreaReviews } from '@/features/paths/recommend';
import { LearningPathCard } from '@/components/paths/LearningPathCard';
import { MasteryPanel } from '@/components/paths/MasteryPanel';
import { Map, ArrowRight } from 'lucide-react';

export const PathsPage: React.FC = () => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.paths;
  const signals = useLearningSignals();

  const summaries = useMemo(() => {
    const map: Record<string, ReturnType<typeof summarizePath>> = {};
    for (const path of LEARNING_PATHS) map[path.id] = summarizePath(path, signals);
    return map;
  }, [signals]);

  const continueTarget = useMemo(() => getContinueTarget(LEARNING_PATHS, signals), [signals]);
  const mastery = useMemo(() => computeMastery(signals), [signals]);
  const weakAreas = useMemo(() => getWeakAreaReviews(mastery, signals, 2), [mastery, signals]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta({ title: p.title, description: p.subtitle });
  }, [p.title, p.subtitle]);

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Breadcrumb items={[{ label: t.nav.learn, path: '/learn' }, { label: p.title, isCurrent: true }]} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Badge variant="primary" size="md">
              <Map size={14} />
              <span>{p.badge}</span>
            </Badge>
          </div>
          <h1 className="headline-lg" style={{ margin: 0 }}>{p.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
            {p.subtitle}
          </p>
        </div>

        {continueTarget && (() => {
          const step = continueTarget.path.steps.find((s) => s.id === continueTarget.summary.currentStepId);
          return (
            <Card variant="elevated" padding="lg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <div>
                <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{p.continueTitle}</span>
                <div className="title-md" style={{ marginTop: 'var(--space-1)' }}>
                  {isBn ? continueTarget.path.title.bn : continueTarget.path.title.en}
                  {step && <> → {isBn ? step.title.bn : step.title.en}</>}
                </div>
                <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {continueTarget.summary.requiredCompleted}/{continueTarget.summary.requiredTotal} {p.stepsLabel} · {continueTarget.summary.percent}%
                </span>
              </div>
              <Link to={`/learn/paths/${continueTarget.path.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="filled" size="md" iconRight={<ArrowRight size={16} />}>{p.continueButton}</Button>
              </Link>
            </Card>
          );
        })()}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          {LEARNING_PATHS.map((path) => (
            <LearningPathCard key={path.id} path={path} summary={summaries[path.id]} />
          ))}
        </div>

        <MasteryPanel mastery={mastery} showLinks />

        {weakAreas.length > 0 && (
          <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <h2 className="title-md" style={{ margin: 0 }}>{p.reviewTitle}</h2>
            {weakAreas.map(({ topic, lessonRoute, troubleshootingRoute, interviewRoute }) => (
              <div key={topic.topicId} className="body-sm" style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                <strong>{isBn ? topic.title.bn : topic.title.en}</strong>
                {lessonRoute && <Link to={lessonRoute} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>{p.reviewLesson}</Link>}
                {troubleshootingRoute && <Link to={troubleshootingRoute} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>{p.reviewCookbook}</Link>}
                {interviewRoute && <Link to={interviewRoute} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>{p.reviewInterview}</Link>}
              </div>
            ))}
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
