import React, { useEffect, useMemo, useState } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Code2, FlaskConical, Target } from 'lucide-react';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Chip } from '@/components/common/Chip/Chip';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { DailyChallengeCard } from '@/components/gamification/DailyChallengeCard/DailyChallengeCard';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import { PRACTICE_CATEGORIES, PRACTICE_EXERCISES } from '@/content/practice';
import { practiceStats, usePracticeProgress } from '@/features/practice/progress';
import { DifficultyLevel } from '@/types/content';
import { PracticeCategory } from '@/types/practice';

type StatusFilter = 'all' | 'completed' | 'in-progress' | 'not-started';

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

export const PracticePage: React.FC = () => {
  const { language, t } = useTranslation();

  useEffect(() => {
    setPageMeta({ title: t.pages.practice.title, description: t.pages.practice.subtitle });
  }, [t.pages.practice.title, t.pages.practice.subtitle]);
  const isBn = language === 'bn';
  const p = t.pages.practice;
  const navigate = useNavigate();
  const { dailyChallenge, completeDailyChallenge } = useGamification();
  const { progress } = usePracticeProgress();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PracticeCategory | 'all'>('all');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const L = (text: { en: string; bn?: string }) => (isBn && text.bn ? text.bn : text.en);
  const catLabel = (id: PracticeCategory) => {
    const meta = PRACTICE_CATEGORIES.find((c) => c.id === id)!;
    return (p as unknown as Record<string, string>)[meta.titleKey] ?? id;
  };

  const entryStatus = (exerciseId: string): 'completed' | 'in-progress' | 'not-started' => {
    const entry = progress[exerciseId];
    if (!entry) return 'not-started';
    if (entry.completed) return 'completed';
    return 'in-progress';
  };

  const filtered = useMemo(() => {
    const tokens = normalize(query).split(/[\s,;]+/).filter(Boolean);
    return PRACTICE_EXERCISES.filter((ex) => {
      if (category !== 'all' && ex.category !== category) return false;
      if (difficulty !== 'all' && ex.difficulty !== difficulty) return false;
      const st = entryStatus(ex.id);
      if (status === 'completed' && st !== 'completed') return false;
      if (status === 'in-progress' && st !== 'in-progress') return false;
      if (status === 'not-started' && st !== 'not-started') return false;
      if (tokens.length > 0) {
        const haystack = [
          ex.id,
          ex.title.en,
          ex.title.bn,
          ex.description.en,
          ex.description.bn,
          ex.objective.en,
          ex.objective.bn,
          ...ex.tags,
          ...ex.keywords,
          catLabel(ex.category),
        ]
          .join(' ')
          .toLowerCase();
        if (!tokens.every((tok) => haystack.includes(tok))) return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, difficulty, status, progress, isBn]);

  const stats = practiceStats(progress);
  const recentIds = useMemo(
    () =>
      PRACTICE_EXERCISES.filter((e) => progress[e.id])
        .sort((a, b) => (progress[b.id].lastAttemptAt > progress[a.id].lastAttemptAt ? 1 : -1))
        .slice(0, 3)
        .map((e) => e.id),
    [progress]
  );
  const continueId = useMemo(() => {
    const firstIncomplete = PRACTICE_EXERCISES.find((e) => !progress[e.id]?.completed);
    if (firstIncomplete) return firstIncomplete.id;
    const lastRecent = recentIds[0];
    return lastRecent ?? PRACTICE_EXERCISES[0].id;
  }, [progress, recentIds]);

  const recommended = useMemo(() => {
    const pool = PRACTICE_EXERCISES.filter((e) => !progress[e.id]?.completed);
    const beginner = pool.filter((e) => e.difficulty === 'beginner').slice(0, 2);
    const rest = pool.filter((e) => e.difficulty !== 'beginner').slice(0, 1);
    const picks = [...beginner, ...rest];
    if (picks.length > 0) return picks;
    return PRACTICE_EXERCISES.slice(0, 3);
  }, [progress]);

  const hasFilters = query.trim() !== '' || category !== 'all' || difficulty !== 'all' || status !== 'all';
  const clearAll = () => {
    setQuery('');
    setCategory('all');
    setDifficulty('all');
    setStatus('all');
  };

  const exerciseSlug = (id: string) => id.split('.').pop() as string;

  const renderCard = (exerciseId: string) => {
    const ex = PRACTICE_EXERCISES.find((e) => e.id === exerciseId)!;
    const entry = progress[ex.id];
    const st = entryStatus(ex.id);
    return (
      <Card key={ex.id} variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Badge variant="secondary" size="sm">{catLabel(ex.category)}</Badge>
          <Badge variant="outline" size="sm">{ex.difficulty}</Badge>
          {st === 'completed' && (
            <Badge variant="success" size="sm">
              <CheckCircle2 size={11} />
              <span>{p.completedBadge} · {entry?.bestScore ?? 0}</span>
            </Badge>
          )}
          {st === 'in-progress' && <Badge variant="primary" size="sm">{p.inProgressOnly}</Badge>}
        </div>
        <Link to={`/practice/${exerciseSlug(ex.id)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="title-md" style={{ margin: 0 }}>{L(ex.title)}</h3>
        </Link>
        <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
          {L(ex.objective)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
          <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {ex.tasks.length} {isBn ? 'টাস্ক' : ex.tasks.length === 1 ? 'task' : 'tasks'} · {ex.estimatedMinutes} {p.minutes} · +{ex.xpReward} XP
          </span>
          <Button
            variant={st === 'not-started' ? 'filled' : 'tonal'}
            size="sm"
            iconRight={<ArrowRight size={14} />}
            onClick={() => navigate(`/practice/${exerciseSlug(ex.id)}`)}
          >
            {st === 'completed' ? p.reviewLabel : st === 'in-progress' ? p.continueLabel : p.start}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Badge variant="success" size="md">
              <Code2 size={14} />
              <span>{p.badge}</span>
            </Badge>
            <Badge variant="primary" size="sm">
              <FlaskConical size={12} />
              <span>{PRACTICE_EXERCISES.length} {isBn ? 'টি অনুশীলন' : 'Exercises'}</span>
            </Badge>
          </div>
          <h1 className="headline-lg">{p.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {p.subtitle}
          </p>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
            {p.tagline}
          </p>
        </div>

        {/* Daily challenge + assessment */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)', alignItems: 'stretch' }}>
          <div>
            <h2 className="title-md" style={{ margin: '0 0 var(--space-2)' }}>{p.dailyChallengeTitle}</h2>
            <DailyChallengeCard challenge={dailyChallenge} onComplete={completeDailyChallenge} />
          </div>
          <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Target size={20} color="var(--md-sys-color-primary)" aria-hidden="true" />
              <h2 className="title-md" style={{ margin: 0 }}>{p.assessmentTitle}</h2>
            </div>
            <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
              {p.assessmentSubtitle}
            </p>
            <div>
              <Button variant="filled" size="md" iconRight={<ArrowRight size={16} />} onClick={() => navigate('/practice/assessment')}>
                {p.openAssessment}
              </Button>
            </div>
          </Card>
        </div>

        {/* Progress summary */}
        <Card variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span className="label-md">{p.progressTitle}</span>
          <div className="body-sm" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', color: 'var(--md-sys-color-on-surface-variant)' }}>
            <span><strong>{stats.completedCount}/{PRACTICE_EXERCISES.length}</strong> {p.exercisesCompleted}</span>
            <span><strong>{stats.averageBest}</strong> {p.averageScore}</span>
            <span><strong>{stats.totalAttempts}</strong> {p.totalAttempts}</span>
          </div>
          <ProgressBar
            value={Math.round((stats.completedCount / PRACTICE_EXERCISES.length) * 100)}
            height={6}
            color="primary"
          />
        </Card>

        {/* Continue + recommended */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <h2 className="title-md" style={{ margin: 0 }}>{p.continuePractice}</h2>
            <Button variant="filled" size="md" iconRight={<ArrowRight size={16} />} onClick={() => navigate(`/practice/${exerciseSlug(continueId)}`)}>
              {p.continueLabel}
            </Button>
          </div>
          <h3 className="title-sm" style={{ margin: '0 0 var(--space-2)' }}>{p.recommended}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {recommended.map((e) => renderCard(e.id))}
          </div>
        </div>

        {/* Recently attempted */}
        {recentIds.length > 0 && (
          <div>
            <h2 className="title-md" style={{ margin: '0 0 var(--space-3)' }}>{p.recentTitle}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {recentIds.map((id) => renderCard(id))}
            </div>
          </div>
        )}

        {/* Filters + full catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2 className="title-md" style={{ margin: 0 }}>{p.allExercises}</h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              backgroundColor: 'var(--md-sys-color-surface-container-low)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--md-sys-color-outline-variant)',
              maxWidth: '560px',
              width: '100%',
            }}
          >
            <input
              type="search"
              aria-label={p.searchPlaceholder}
              placeholder={p.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--md-sys-color-on-surface)',
                width: '100%',
                fontSize: '0.875rem',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--md-sys-color-on-surface-variant)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
              >
                ✕
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }} role="group" aria-label={p.allCategories}>
            <Chip selected={category === 'all'} onClick={() => setCategory('all')}>{p.allCategories}</Chip>
            {PRACTICE_CATEGORIES.map((c) => (
              <Chip key={c.id} selected={category === c.id} onClick={() => setCategory(c.id)}>
                {(p as unknown as Record<string, string>)[c.titleKey] ?? c.id}
              </Chip>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <Chip key={level} selected={difficulty === level} onClick={() => setDifficulty(level)}>
                {level === 'all' ? p.allLevels : t.common.badges[level]}
              </Chip>
            ))}
            {(['all', 'completed', 'in-progress', 'not-started'] as StatusFilter[]).map((s) => (
              <Chip key={s} selected={status === s} onClick={() => setStatus(s)}>
                {s === 'all' ? p.allStatuses : s === 'completed' ? p.completedOnly : s === 'in-progress' ? p.inProgressOnly : p.notStartedOnly}
              </Chip>
            ))}
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                style={{ background: 'none', border: 'none', color: 'var(--md-sys-color-primary)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}
              >
                {p.clearFilters}
              </button>
            )}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }} aria-live="polite">
            {isBn
              ? `${filtered.length}টি অনুশীলন দেখানো হচ্ছে`
              : `Showing ${filtered.length} of ${PRACTICE_EXERCISES.length} exercises`}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {filtered.map((e) => renderCard(e.id))}
          </div>
        ) : (
          <EmptyState
            title={p.noResults}
            description={p.noResultsHint}
            action={
              <Button variant="tonal" size="md" onClick={clearAll}>
                {p.clearFilters}
              </Button>
            }
          />
        )}
      </div>
    </PageContainer>
  );
};
