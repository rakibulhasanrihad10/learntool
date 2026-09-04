import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import { getAdjacentPaths, getLearningPath } from '@/content/paths';
import { useLearningSignals } from '@/features/paths/signals';
import { getNextSteps, getWeakAreaReviews } from '@/features/paths/recommend';
import { stepRoute, summarizePath } from '@/features/paths/progress';
import { computeMastery } from '@/features/paths/mastery';
import { PathCurriculum } from '@/components/paths/PathCurriculum';
import { pathDuration } from '@/components/paths/LearningPathCard';
import { ArrowRight, Award, Clock } from 'lucide-react';

/** Path id → completion achievement id (added to the existing catalog). */
export function pathCompletionAchievementId(pathId: string): string | undefined {
  const map: Record<string, string> = {
    'git-beginner': 'path_beginner_complete',
    'git-intermediate': 'path_intermediate_complete',
    'git-advanced': 'path_advanced_complete',
  };
  return map[pathId];
}

export const PathDetailPage: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.paths;
  const signals = useLearningSignals();
  const { awardXp, grantAchievements } = useGamification();
  const celebratedRef = useRef<string | null>(null);

  const path = pathId ? getLearningPath(pathId) : undefined;
  const summary = useMemo(() => (path ? summarizePath(path, signals) : undefined), [path, signals]);
  const mastery = useMemo(() => computeMastery(signals), [signals]);
  const weakAreas = useMemo(() => getWeakAreaReviews(mastery, signals, 2), [mastery, signals]);
  const nextSteps = useMemo(
    () => (path && summary ? getNextSteps(path, summary, 3) : []),
    [path, summary]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathId]);

  useEffect(() => {
    document.title = path
      ? `${isBn ? path.title.bn : path.title.en} | GitVerse`
      : `${p.notFound} | GitVerse`;
  }, [path, isBn, p.notFound]);

  // Path completion reward — existing-compatible XP + achievement, once.
  useEffect(() => {
    if (!path || !summary?.complete || celebratedRef.current === path.id) return;
    celebratedRef.current = path.id;
    awardXp(150, `path:${path.id}`);
    const achievementId = pathCompletionAchievementId(path.id);
    if (achievementId) grantAchievements([achievementId]);
  }, [path, summary, awardXp, grantAchievements]);

  if (!path || !summary) {
    return (
      <PageContainer maxWidth="sm" className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <h1 className="headline-md">{p.notFound}</h1>
        <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--space-2)' }}>
          {p.notFoundHint}
        </p>
        <Link to="/learn/paths" style={{ display: 'inline-block', marginTop: 'var(--space-4)', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
          ← {p.title}
        </Link>
      </PageContainer>
    );
  }

  const { prev, next } = getAdjacentPaths(path.id);
  const currentStep = path.steps.find((s) => s.id === summary.currentStepId);
  const currentRoute = currentStep ? stepRoute(currentStep) : null;

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Breadcrumb
          items={[
            { label: t.nav.learn, path: '/learn' },
            { label: p.title, path: '/learn/paths' },
            { label: isBn ? path.title.bn : path.title.en, isCurrent: true },
          ]}
        />

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            <DifficultyBadge difficulty={path.difficulty} size="sm" />
            <Badge variant="outline" size="sm" >
              <Clock size={12} />
              <span>{p.estimatedLabel}: {pathDuration(path) >= 60
                ? `${Math.round(pathDuration(path) / 60)}${isBn ? ' ঘণ্টা' : 'h'}`
                : `${pathDuration(path)}${isBn ? ' মিনিট' : ' min'}`}</span>
            </Badge>
          </div>
          <h1 className="headline-lg" style={{ margin: 0 }}>{isBn ? path.title.bn : path.title.en}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
            {isBn ? path.description.bn : path.description.en}
          </p>
        </div>

        {/* Progress */}
        <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <strong className="title-md">{p.yourProgress}</strong>
            <span className="label-md font-mono">
              {summary.requiredCompleted}/{summary.requiredTotal} · {summary.percent}%
            </span>
          </div>
          <ProgressBar value={summary.percent} height={10} color={summary.complete ? 'success' : 'primary'} />
          {currentStep && !summary.complete && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-1)' }}>
              <span className="body-md">
                {p.continueLabel}: <strong>{isBn ? currentStep.title.bn : currentStep.title.en}</strong>
              </span>
              {currentRoute && (
                <Link to={currentRoute} style={{ textDecoration: 'none' }}>
                  <Button variant="filled" size="md" iconRight={<ArrowRight size={16} />}>{p.continueButton}</Button>
                </Link>
              )}
            </div>
          )}
        </Card>

        {/* Completion summary — a "GitVerse Completion Summary", never a certificate */}
        {summary.complete && (
          <Card variant="elevated" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Award size={22} aria-hidden="true" />
              <h2 className="title-lg" style={{ margin: 0 }}>{p.completeTitle}</h2>
            </div>
            <p className="body-md" style={{ margin: 0 }}>
              {p.completeSubtitle} — {summary.requiredCompleted}/{summary.requiredTotal} {p.stepsLabel} (+150 XP)
            </p>
            <div className="body-sm" style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {next && (
                <Link to={`/learn/paths/${next.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="filled" size="sm">{p.nextPath}: {isBn ? next.title.bn : next.title.en}</Button>
                </Link>
              )}
              <Link to="/practice/assessment" style={{ textDecoration: 'none' }}>
                <Button variant="tonal" size="sm">{p.takeAssessment}</Button>
              </Link>
              <Link to="/interview" style={{ textDecoration: 'none' }}>
                <Button variant="tonal" size="sm">{p.goInterview}</Button>
              </Link>
            </div>
            {weakAreas.length > 0 && (
              <div className="body-sm">
                <strong>{p.reviewTitle}: </strong>
                {weakAreas.map(({ topic }, i) => (
                  <span key={topic.topicId}>
                    {isBn ? topic.title.bn : topic.title.en}{i < weakAreas.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Up next */}
        {!summary.complete && nextSteps.length > 0 && (
          <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <h2 className="title-md" style={{ margin: 0 }}>{p.upNextTitle}</h2>
            <ol className="body-md" style={{ margin: 0, paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {nextSteps.map((s) => {
                const route = stepRoute(s);
                const label = isBn ? s.title.bn : s.title.en;
                return (
                  <li key={s.id}>
                    {route ? (
                      <Link to={route} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
                        {label}
                      </Link>
                    ) : (
                      <span>{label}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </Card>
        )}

        {/* Outcomes */}
        <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h2 className="title-md" style={{ margin: 0 }}>{p.outcomesTitle}</h2>
          <ul className="body-md" style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
            {path.outcomes.map((o, i) => (
              <li key={i}>{isBn ? o.bn : o.en}</li>
            ))}
          </ul>
        </Card>

        {/* Curriculum */}
        <div>
          <h2 className="title-lg" style={{ marginBottom: 'var(--space-3)' }}>{p.curriculumTitle}</h2>
          <PathCurriculum path={path} summary={summary} />
        </div>

        {/* Prev / next path */}
        <Card variant="outlined" padding="md" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span>
            {prev && (
              <Link to={`/learn/paths/${prev.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="text" size="sm">← {isBn ? prev.title.bn : prev.title.en}</Button>
              </Link>
            )}
          </span>
          <span>
            {next && (
              <Link to={`/learn/paths/${next.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="text" size="sm">{isBn ? next.title.bn : next.title.en} →</Button>
              </Link>
            )}
          </span>
        </Card>
      </div>
    </PageContainer>
  );
};
