import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import { getAdjacentExercises, getExerciseById, PRACTICE_CATEGORIES } from '@/content/practice';
import { PracticeSession } from '@/components/practice/PracticeSession';

export const PracticeSessionPage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { language, t } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.practice;

  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [exerciseId]);

  const pageTitle = exercise ? (isBn && exercise.title.bn ? exercise.title.bn : exercise.title.en) : p.exerciseNotFound;
  useEffect(() => {
    document.title = `${pageTitle} | GitVerse`;
  }, [pageTitle]);

  if (!exercise) {
    return (
      <PageContainer maxWidth="sm" className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <h1 className="headline-md">{p.exerciseNotFound}</h1>
        <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--space-2)' }}>
          {p.exerciseNotFoundHint}
        </p>
        <Link to="/practice" style={{ display: 'inline-block', marginTop: 'var(--space-4)', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
          ← {p.backToPractice}
        </Link>
      </PageContainer>
    );
  }

  const { prev, next } = getAdjacentExercises(exercise.id);
  const catMeta = PRACTICE_CATEGORIES.find((c) => c.id === exercise.category);
  const catLabel = catMeta ? (p as unknown as Record<string, string>)[catMeta.titleKey] ?? exercise.category : exercise.category;
  const L = (text: { en: string; bn?: string }) => (isBn && text.bn ? text.bn : text.en);

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Breadcrumb
          items={[
            { label: p.title, path: '/practice' },
            { label: catLabel, path: '/practice' },
            { label: L(exercise.title), isCurrent: true },
          ]}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Badge variant="success" size="md">
              <BookOpen size={14} />
              <span>{p.badge}</span>
            </Badge>
            <Badge variant="secondary" size="sm">{catLabel}</Badge>
            <Badge variant="outline" size="sm">{exercise.difficulty}</Badge>
            <Badge variant="outline" size="sm">
              {exercise.estimatedMinutes} {p.minutes} · +{exercise.xpReward} XP
            </Badge>
          </div>
          <h1 className="headline-lg">{L(exercise.title)}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {L(exercise.description)}
          </p>
        </div>

        <PracticeSession
          key={exercise.id}
          exercise={exercise}
          prevExercise={prev}
          nextExercise={next}
        />

        {(prev || next) && (
          <Card variant="outlined" padding="md" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span>
              {prev && (
                <Link to={`/practice/${prev.id.split('.').pop()}`} style={{ textDecoration: 'none' }}>
                  <Button variant="text" size="sm">← {isBn && prev.title.bn ? prev.title.bn : prev.title.en}</Button>
                </Link>
              )}
            </span>
            <span>
              {next && (
                <Link to={`/practice/${next.id.split('.').pop()}`} style={{ textDecoration: 'none' }}>
                  <Button variant="text" size="sm">{isBn && next.title.bn ? next.title.bn : next.title.en} →</Button>
                </Link>
              )}
            </span>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
