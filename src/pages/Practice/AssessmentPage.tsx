import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, RotateCcw, Target } from 'lucide-react';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import { ASSESSMENT_QUIZ_ID } from '@/features/paths/signals';
import { ASSESSMENT_ITEMS, getExerciseById } from '@/content/practice';
import { TaskRunner } from '@/components/practice/TaskRunner';
import {
  overallLevel,
  OVERALL_LEVEL_META,
  scoreAssessment,
} from '@/features/practice/scoring';
import { AssessmentSectionId } from '@/types/practice';

const SECTION_ORDER: AssessmentSectionId[] = [
  'fundamentals',
  'branching',
  'merging-rebasing',
  'remote',
  'recovery',
  'internals',
];

export const AssessmentPage: React.FC = () => {
  const { language, t } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.practice;

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { correct: boolean; retries: number }>>({});
  const [finished, setFinished] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const { passQuiz } = useGamification();
  const recordedRef = useRef(false);

  // Record completion through the existing quiz store so learning paths
  // can treat the assessment as done — no separate assessment progress.
  useEffect(() => {
    if (finished && !recordedRef.current) {
      recordedRef.current = true;
      passQuiz(ASSESSMENT_QUIZ_ID);
    }
    if (!finished) recordedRef.current = false;
  }, [finished, passQuiz]);

  useEffect(() => {
    document.title = `${p.assessmentTitle} | GitVerse`;
  }, [p.assessmentTitle]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const items = useMemo(
    () =>
      ASSESSMENT_ITEMS.map((item) => {
        const exercise = getExerciseById(item.exerciseId);
        const task = exercise?.tasks.find((ts) => ts.id === item.taskId);
        return { item, exercise, task };
      }).filter(
        (entry): entry is { item: (typeof ASSESSMENT_ITEMS)[number]; exercise: NonNullable<ReturnType<typeof getExerciseById>>; task: NonNullable<ReturnType<typeof getExerciseById>>['tasks'][number] } =>
          Boolean(entry.exercise && entry.task)
      ),
    []
  );

  const sectionOf = (section: AssessmentSectionId) => items.filter((e) => e.item.section === section);
  const answeredCount = Object.keys(answers).length;
  const results = useMemo(
    () =>
      scoreAssessment(
        items.map((e) => ({
          itemId: e.item.id,
          section: e.item.section,
          correct: answers[e.item.id]?.correct ?? false,
        }))
      ),
    [items, answers]
  );
  const overall = overallLevel(results);
  const allAnswered = items.length > 0 && items.every((e) => answers[e.item.id] !== undefined);

  const sectionLabel = (section: AssessmentSectionId) => {
    const map: Record<AssessmentSectionId, string> = {
      fundamentals: p.catFundamentals,
      branching: p.catBranching,
      'merging-rebasing': `${p.catMerging} / ${p.catRebasing}`,
      remote: p.catRemote,
      recovery: p.catRecovery,
      internals: p.catInternals,
    };
    return map[section];
  };

  const levelLabel = (level: string) =>
    level === 'strong' ? p.levelStrong : level === 'developing' ? p.levelDeveloping : p.levelNeedsPractice;

  const resetAll = () => {
    setAnswers({});
    setFinished(false);
    setStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!started) {
    return (
      <PageContainer maxWidth="md" className="animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Breadcrumb items={[{ label: p.title, path: '/practice' }, { label: p.assessmentTitle, isCurrent: true }]} />
          <Card variant="elevated" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <Badge variant="primary" size="md">
              <Target size={14} />
              <span>{p.assessmentBadge}</span>
            </Badge>
            <h1 className="headline-lg" style={{ margin: 0 }}>{p.assessmentTitle}</h1>
            <p className="body-lg" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
              {p.assessmentSubtitle}
            </p>
            <p className="body-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
              {p.assessmentIntro}
            </p>
            <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
              {p.assessmentDisclaimer}
            </p>
            <Button variant="filled" size="lg" iconRight={<ArrowRight size={16} />} onClick={() => setStarted(true)}>
              {p.beginAssessment}
            </Button>
          </Card>
        </div>
      </PageContainer>
    );
  }

  if (finished) {
    const answered = results.filter((r) => r.total > 0);
    return (
      <PageContainer maxWidth="md" className="animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Breadcrumb items={[{ label: p.title, path: '/practice' }, { label: p.assessmentTitle, isCurrent: true }]} />
          <Card variant="elevated" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center', textAlign: 'center' }}>
            <Award size={40} color="var(--md-sys-color-primary)" aria-hidden="true" />
            <h1 className="headline-md" style={{ margin: 0 }}>{p.overallResult}</h1>
            <div className="headline-lg" style={{ color: 'var(--md-sys-color-primary)' }}>
              {isBn ? OVERALL_LEVEL_META[overall].bn : OVERALL_LEVEL_META[overall].en}
            </div>
            <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
              {p.assessmentDisclaimer}
            </p>
          </Card>

          <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h2 className="title-md" style={{ margin: 0 }}>{p.sectionResults}</h2>
            {answered.map((r) => (
              <div key={r.section} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <span className="body-md" style={{ fontWeight: 600 }}>{sectionLabel(r.section)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span className="label-sm font-mono">{r.correct}/{r.total}</span>
                    <Badge variant={r.level === 'strong' ? 'success' : r.level === 'developing' ? 'primary' : 'warning'} size="sm">
                      {levelLabel(r.level)}
                    </Badge>
                  </span>
                </div>
                <ProgressBar value={r.total === 0 ? 0 : Math.round((r.correct / r.total) * 100)} height={6} color="primary" />
                {r.level !== 'strong' && (
                  <Link
                    to={`/practice/${items.find((e) => e.item.section === r.section)?.exercise.id.split('.').pop() ?? ''}`}
                    style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
                  >
                    {p.openExercise} →
                  </Link>
                )}
              </div>
            ))}
          </Card>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Button variant="outlined" size="md" iconLeft={<RotateCcw size={16} />} onClick={resetAll}>
              {p.retakeAssessment}
            </Button>
            <Link to="/practice" style={{ textDecoration: 'none' }}>
              <Button variant="text" size="md">← {p.backToPractice}</Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Breadcrumb items={[{ label: p.title, path: '/practice' }, { label: p.assessmentTitle, isCurrent: true }]} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <Badge variant="primary" size="md">
            <Target size={14} />
            <span>{p.assessmentBadge}</span>
          </Badge>
          <h1 className="headline-lg">{p.assessmentTitle}</h1>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }} aria-live="polite">
            {answeredCount}/{items.length}
          </p>
          <ProgressBar value={items.length === 0 ? 0 : Math.round((answeredCount / items.length) * 100)} height={6} color="primary" />
        </div>

        {SECTION_ORDER.map((section) => {
          const entries = sectionOf(section);
          if (entries.length === 0) return null;
          return (
            <section key={section} aria-label={sectionLabel(section)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h2 className="title-lg" style={{ margin: 0 }}>{sectionLabel(section)}</h2>
              {entries.map((entry, idx) => {
                const answered = answers[entry.item.id] !== undefined;
                return (
                  <Card key={entry.item.id} id={`assess-${entry.item.id}`} variant={answered ? 'filled' : 'elevated'} padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', scrollMarginTop: '5rem' }}>
                    <span className="label-sm" style={{ color: 'var(--md-sys-color-primary)' }}>
                      {sectionLabel(section)} · {idx + 1}/{entries.length}
                    </span>
                    <TaskRunner
                      task={entry.task}
                      exerciseId={entry.exercise.id}
                      difficulty={entry.exercise.difficulty}
                      taskNumber={1}
                      taskCount={1}
                      onPass={(retries) => {
                        setAnswers((prev) => {
                          if (prev[entry.item.id]) return prev;
                          return { ...prev, [entry.item.id]: { correct: true, retries } };
                        });
                      }}
                      onNext={() => {
                        const nextUnanswered = items.find(
                          (e) => e.item.id !== entry.item.id && answersRef.current[e.item.id] === undefined
                        );
                        const target = nextUnanswered
                          ? document.getElementById(`assess-${nextUnanswered.item.id}`)
                          : document.getElementById('assess-finish');
                        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    />
                    {answered && entry.exercise.id && (
                      <Link
                        to={`/practice/${entry.exercise.id.split('.').pop()}`}
                        style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
                      >
                        {p.openExercise} →
                      </Link>
                    )}
                  </Card>
                );
              })}
            </section>
          );
        })}

        <div id="assess-finish" style={{ display: 'flex', justifyContent: 'flex-end', scrollMarginTop: '5rem' }}>
          <Button variant="filled" size="lg" disabled={!allAnswered} onClick={() => { setFinished(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            {p.overallResult}
          </Button>
        </div>
        {!allAnswered && (
          <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'right', margin: 0 }}>
            {answeredCount}/{items.length}
          </p>
        )}
      </div>
    </PageContainer>
  );
};
