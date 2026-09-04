import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/gamificationContext';
import {
  INTERVIEW_CATEGORIES,
  filterInterviewQuestions,
  getAdjacentQuestions,
  getQuestionsByCategory,
} from '@/content/interview';
import { InterviewCategory } from '@/types/interview';
import { QuestionAttempt, useInterviewProgress } from '@/features/interview/progress';
import { getUnlockedAchievementsForInterview } from '@/features/interview/achievements';
import { InterviewPracticeCard } from '@/components/interview/InterviewPracticeCard';

const CATEGORY_IDS = new Set(INTERVIEW_CATEGORIES.map((c) => c.id));

export const InterviewTopicPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.interview;
  const { progress, mockHistory, recordQuestion } = useInterviewProgress();
  const { awardXp, grantAchievements, progress: gameProgress } = useGamification();

  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [type, setType] = useState<'all' | 'conceptual' | 'choice' | 'scenario' | 'compare' | 'state' | 'graph'>('all');
  const [reviewedOnly, setReviewedOnly] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  const category = CATEGORY_IDS.has((categoryId ?? '') as InterviewCategory)
    ? INTERVIEW_CATEGORIES.find((c) => c.id === categoryId)!
    : undefined;

  const questions = useMemo(
    () => (category ? getQuestionsByCategory(category.id as InterviewCategory) : []),
    [category]
  );

  const filtered = useMemo(
    () =>
      filterInterviewQuestions(questions, {
        difficulty,
        type,
        reviewedOnly,
        reviewedIds: new Set(Object.keys(progress).filter((id) => progress[id]?.reviewed)),
      }),
    [questions, difficulty, type, reviewedOnly, progress]
  );

  useEffect(() => {
    document.title = category
      ? `${isBn ? category.title.bn : category.title.en} | ${p.title} | GitVerse`
      : `${p.notFound} | GitVerse`;
  }, [category, isBn, p.title, p.notFound]);

  if (!category) {
    return (
      <PageContainer maxWidth="sm" className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <h1 className="headline-md">{p.notFound}</h1>
        <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--space-2)' }}>
          {p.notFoundHint}
        </p>
        <Link to="/interview/git" style={{ display: 'inline-block', marginTop: 'var(--space-4)', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
          ← {p.allTopics}
        </Link>
      </PageContainer>
    );
  }

  const handleAttempt = (attempt: QuestionAttempt) => {
    const { isFirstCompletion } = recordQuestion(attempt);
    if (isFirstCompletion) {
      awardXp(5, `interview:${attempt.questionId}`);
      const reviewedIds = [
        ...Object.keys(progress).filter((id) => progress[id]?.reviewed),
        attempt.questionId,
      ];
      grantAchievements(
        getUnlockedAchievementsForInterview(reviewedIds, mockHistory, gameProgress.unlockedAchievementIds)
      );
    }
  };

  const idx = INTERVIEW_CATEGORIES.findIndex((c) => c.id === category.id);
  const prevCat = idx > 0 ? INTERVIEW_CATEGORIES[idx - 1] : undefined;
  const nextCat = idx < INTERVIEW_CATEGORIES.length - 1 ? INTERVIEW_CATEGORIES[idx + 1] : undefined;
  const sample = filtered[0] ? getAdjacentQuestions(filtered[0].id) : undefined;
  void sample;

  const reviewedCount = questions.filter((q) => progress[q.id]?.reviewed).length;

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Breadcrumb
          items={[
            { label: p.title, path: '/interview' },
            { label: p.allTopics, path: '/interview/git' },
            { label: isBn ? category.title.bn : category.title.en, isCurrent: true },
          ]}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="secondary" size="md">{isBn ? category.title.bn : category.title.en}</Badge>
            <Badge variant="outline" size="sm">{reviewedCount}/{questions.length} {isBn ? 'পর্যালোচিত' : 'reviewed'}</Badge>
          </div>
          <h1 className="headline-lg">{isBn ? category.title.bn : category.title.en}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {isBn ? category.blurb.bn : category.blurb.en}
          </p>
        </div>

        <Card variant="outlined" padding="md" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <label className="body-sm">
            {p.filterDifficulty}{' '}
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}>
              <option value="all">{p.allLevels}</option>
              <option value="beginner">beginner</option>
              <option value="intermediate">intermediate</option>
              <option value="advanced">advanced</option>
            </select>
          </label>
          <label className="body-sm">
            {p.filterType}{' '}
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="all">{p.allTypes}</option>
              <option value="conceptual">conceptual</option>
              <option value="choice">choice</option>
              <option value="scenario">scenario</option>
              <option value="compare">compare</option>
              <option value="state">state</option>
              <option value="graph">graph</option>
            </select>
          </label>
          <label className="body-sm" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
            <input type="checkbox" checked={reviewedOnly} onChange={(e) => setReviewedOnly(e.target.checked)} />
            {p.reviewedOnly}
          </label>
          {(difficulty !== 'all' || type !== 'all' || reviewedOnly) && (
            <Button
              variant="text"
              size="sm"
              onClick={() => {
                setDifficulty('all');
                setType('all');
                setReviewedOnly(false);
              }}
            >
              {p.clearFilters}
            </Button>
          )}
        </Card>

        {filtered.length === 0 ? (
          <Card variant="filled" padding="lg" style={{ textAlign: 'center' }}>
            <p className="body-md">{p.noResults}</p>
            <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{p.noResultsHint}</p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {filtered.map((q) => (
              <InterviewPracticeCard
                key={q.id}
                question={q}
                reviewed={Boolean(progress[q.id]?.reviewed)}
                onAttempt={handleAttempt}
              />
            ))}
          </div>
        )}

        <Card variant="outlined" padding="md" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span>
            {prevCat && (
              <Link to={`/interview/git/${prevCat.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="text" size="sm">← {isBn ? prevCat.title.bn : prevCat.title.en}</Button>
              </Link>
            )}
          </span>
          <span>
            {nextCat && (
              <Link to={`/interview/git/${nextCat.id}`} style={{ textDecoration: 'none' }}>
                <Button variant="text" size="sm">{isBn ? nextCat.title.bn : nextCat.title.en} →</Button>
              </Link>
            )}
          </span>
        </Card>
      </div>
    </PageContainer>
  );
};
