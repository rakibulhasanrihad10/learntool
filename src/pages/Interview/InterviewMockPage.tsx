import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/gamificationContext';
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS } from '@/content/interview';
import { InterviewCategory, MockAnswer, MockConfig, SelfRating } from '@/types/interview';
import { QuestionAttempt, useInterviewProgress } from '@/features/interview/progress';
import { createMockRecord, selectMockQuestions } from '@/features/interview/mock';
import { scoreMock, scoreObjective } from '@/features/interview/scoring';
import { computeReadiness } from '@/features/interview/readiness';
import { getUnlockedAchievementsForInterview } from '@/features/interview/achievements';
import { RepositoryState } from '@/components/simulation/RepositoryState/RepositoryState';
import { CommitGraph } from '@/components/simulation/CommitGraph/CommitGraph';
import { ReadinessCard } from '@/components/interview/ReadinessCard';

export const InterviewMockPage: React.FC = () => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.interview;
  const { progress, mockHistory, recordQuestions, recordMock } = useInterviewProgress();
  const { awardXp, grantAchievements, progress: gameProgress } = useGamification();

  const [difficulty, setDifficulty] = useState<MockConfig['difficulty']>('mixed');
  const [focus, setFocus] = useState<MockConfig['focus']>('mixed');
  const [count, setCount] = useState<MockConfig['count']>(10);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [questions, setQuestions] = useState<typeof INTERVIEW_QUESTIONS>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<MockAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${p.mockTitle} | GitVerse`;
  }, [p.mockTitle]);

  const readiness = useMemo(() => computeReadiness(progress, mockHistory), [progress, mockHistory]);
  const current = questions[index];
  const hasOptions = current && Array.isArray(current.options) && current.options.length > 0;

  const start = () => {
    const config: MockConfig = { difficulty, focus: focus as InterviewCategory | 'mixed', count };
    const picked = selectMockQuestions(INTERVIEW_QUESTIONS, config, mockHistory.length);
    setQuestions(picked);
    setAnswers([]);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setFinished(false);
    setStartedAt(new Date().toISOString());
  };

  const advance = (answer: MockAnswer) => {
    const next = [...answers, answer];
    setAnswers(next);
    setSelected(null);
    setRevealed(false);
    if (index + 1 >= questions.length) {
      finish(next);
    } else {
      setIndex(index + 1);
    }
  };

  const finish = (finalAnswers: MockAnswer[]) => {
    const config: MockConfig = { difficulty, focus: focus as InterviewCategory | 'mixed', count };
    const { score } = scoreMock(finalAnswers);
    const record = createMockRecord(questions, finalAnswers, config, startedAt ?? new Date().toISOString());
    const { isFirstCompletion } = recordMock({
      id: record.id,
      finishedAt: record.finishedAt,
      config,
      score,
      total: finalAnswers.length,
    });
    if (isFirstCompletion) awardXp(25, 'interview:mock-first');

    const attempts: QuestionAttempt[] = finalAnswers.map((a) => ({
      questionId: a.questionId,
      correct: a.correct,
      selfRating: a.selfRating,
    }));
    const { firstCompletions } = recordQuestions(attempts);
    if (firstCompletions > 0) awardXp(5 * firstCompletions, 'interview:questions');

    const reviewedIds = Array.from(
      new Set([
        ...Object.keys(progress).filter((id) => progress[id]?.reviewed),
        ...finalAnswers.map((a) => a.questionId),
      ])
    );
    grantAchievements(
      getUnlockedAchievementsForInterview(
        reviewedIds,
        [...mockHistory, { id: record.id, finishedAt: record.finishedAt, config, score, total: finalAnswers.length }],
        gameProgress.unlockedAchievementIds
      )
    );
    setFinished(true);
  };

  const submitObjective = () => {
    if (!current || !selected) return;
    const correct = scoreObjective(current, selected);
    advance({ questionId: current.id, correct, selfRating: null, retries: 0 });
  };

  const submitRating = (rating: SelfRating) => {
    if (!current) return;
    advance({ questionId: current.id, correct: null, selfRating: rating, retries: 0 });
  };

  if (questions.length === 0 || finished) {
    const lastScore = answers.length > 0 ? scoreMock(answers) : undefined;
    return (
      <PageContainer maxWidth="lg" className="animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Breadcrumb
            items={[
              { label: p.title, path: '/interview' },
              { label: p.allTopics, path: '/interview/git' },
              { label: p.mockTitle, isCurrent: true },
            ]}
          />
          <h1 className="headline-lg">{p.mockTitle}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{p.mockSubtitle}</p>

          {finished && lastScore && (
            <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Badge variant="success" size="md">{isBn ? 'সম্পন্ন' : 'Finished'} · {lastScore.score}/100</Badge>
              <p className="body-md">
                {lastScore.correctCount}/{lastScore.total} {isBn ? 'শক্তিশালী বা ভালো' : 'strong or better'}
              </p>
              <ReadinessCard readiness={computeReadiness(progress, mockHistory)} />
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <Button variant="filled" size="sm" onClick={start}>{isBn ? 'আবার মক' : 'Run another mock'}</Button>
                <Link to="/interview/git" style={{ textDecoration: 'none' }}>
                  <Button variant="tonal" size="sm">{p.allTopics}</Button>
                </Link>
              </div>
            </Card>
          )}

          <ReadinessCard readiness={readiness} />

          <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <label className="body-sm">
                {p.filterDifficulty}{' '}
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as MockConfig['difficulty'])}>
                  <option value="mixed">{p.allLevels}</option>
                  <option value="beginner">beginner</option>
                  <option value="intermediate">intermediate</option>
                  <option value="advanced">advanced</option>
                </select>
              </label>
              <label className="body-sm">
                {p.filterType === undefined ? 'Focus' : p.mockFocus}{' '}
                <select value={focus} onChange={(e) => setFocus(e.target.value as MockConfig['focus'])}>
                  <option value="mixed">{p.allTopics}</option>
                  {INTERVIEW_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{isBn ? c.title.bn : c.title.en}</option>
                  ))}
                </select>
              </label>
              <label className="body-sm">
                {p.mockCount}{' '}
                <select value={count} onChange={(e) => setCount(Number(e.target.value) as MockConfig['count'])}>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </label>
            </div>
            <div>
              <Button variant="filled" size="md" onClick={start}>{p.startMock}</Button>
            </div>
            <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{p.honestyNote}</p>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Breadcrumb
          items={[
            { label: p.title, path: '/interview' },
            { label: p.allTopics, path: '/interview/git' },
            { label: p.mockTitle, isCurrent: true },
          ]}
        />
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Badge variant="secondary" size="sm">{index + 1}/{questions.length}</Badge>
          <Badge variant="outline" size="sm">{current.category} · {current.difficulty}</Badge>
        </div>
        <div style={{ height: '8px', borderRadius: '999px', backgroundColor: 'var(--md-sys-color-surface-container-highest)', overflow: 'hidden' }}>
          <div style={{ width: `${Math.round((index / questions.length) * 100)}%`, height: '100%', backgroundColor: 'var(--md-sys-color-primary)' }} />
        </div>

        <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2 className="title-lg">{isBn ? current.question.bn : current.question.en}</h2>
          {current.stateSnapshot &&
            (current.snapshotView === 'graph' ? (
              <CommitGraph state={current.stateSnapshot} />
            ) : (
              <RepositoryState state={current.stateSnapshot} />
            ))}

          {hasOptions ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {current.options!.map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--md-sys-color-surface-container)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name={`mock-${current.id}`}
                    checked={selected === opt.id}
                    onChange={() => setSelected(opt.id)}
                  />
                  <code>{opt.label}</code>
                </label>
              ))}
              <div>
                <Button variant="filled" size="sm" onClick={submitObjective} disabled={!selected}>
                  {isBn ? 'জমা ও পরেরটি' : 'Submit & next'}
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {!revealed ? (
                <div>
                  <Button variant="tonal" size="sm" onClick={() => setRevealed(true)}>
                    {isBn ? 'উত্তর দেখুন' : 'Reveal answer'}
                  </Button>
                </div>
              ) : (
                <>
                  <div style={{ backgroundColor: 'var(--md-sys-color-surface-container)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                    <p className="body-md">{isBn ? current.shortAnswer.bn : current.shortAnswer.en}</p>
                    <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {isBn ? current.explanation.bn : current.explanation.en}
                    </p>
                  </div>
                  <span className="label-sm">{isBn ? 'সৎ স্ব-মূল্যায়ন:' : 'Honest self-rating:'}</span>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <Button variant="tonal" size="sm" onClick={() => submitRating('knew')}>{isBn ? 'জানতাম' : 'I knew it'}</Button>
                    <Button variant="tonal" size="sm" onClick={() => submitRating('partial')}>{isBn ? 'আংশিক' : 'Partially'}</Button>
                    <Button variant="outlined" size="sm" onClick={() => submitRating('review')}>{isBn ? 'পর্যালোচনা' : 'Need review'}</Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};
