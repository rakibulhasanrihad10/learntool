import React, { useEffect } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gauge,
  BookOpen,
  FlaskConical,
  MessagesSquare,
  Trophy,
  ListChecks,
  History,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { StatCard } from '@/components/data-display/StatCard/StatCard';
import { ProgressCard } from '@/components/data-display/ProgressCard/ProgressCard';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { StreakCard } from '@/components/gamification/StreakCard/StreakCard';
import { DailyChallengeCard } from '@/components/gamification/DailyChallengeCard/DailyChallengeCard';
import { AchievementCard } from '@/components/gamification/AchievementCard/AchievementCard';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import { INTERVIEW_CATEGORIES } from '@/content/interview';
import { PRACTICE_CATEGORIES } from '@/content/practice';
import { INTERVIEW_READINESS_META } from '@/features/interview/readiness';
import { useProgressDashboard } from '@/features/progress/dashboard';
import { LearningPathCard } from '@/components/paths/LearningPathCard';
import { MasteryPanel } from '@/components/paths/MasteryPanel';
import {
  ActivityItemRow,
  ProgressEmptyState,
  RecommendationCard,
  WeakAreaCard,
} from '@/components/progress/ProgressCards';

function SectionTitle({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <h2 className="title-lg" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span aria-hidden="true" style={{ color: 'var(--md-sys-color-primary)', display: 'inline-flex' }}>{icon}</span>
        {title}
      </h2>
      {action}
    </div>
  );
}

export const ProgressPage: React.FC = () => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.progress;
  const dashboard = useProgressDashboard();
  const { progress, achievements, dailyChallenge, completeDailyChallenge } = useGamification();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setPageMeta({ title: p.title, description: p.subtitle });
  }, [p.title, p.subtitle]);

  const practiceCatTitle = (id: string): string => {
    const cat = PRACTICE_CATEGORIES.find((c) => c.id === id);
    const key = cat?.titleKey as keyof typeof t.pages.practice | undefined;
    return (key && t.pages.practice[key]) || id;
  };
  const interviewCatTitle = (id: string): string => {
    const cat = INTERVIEW_CATEGORIES.find((c) => c.id === id);
    return cat ? (isBn ? cat.title.bn : cat.title.en) : id;
  };
  const readinessMeta = INTERVIEW_READINESS_META[dashboard.interview.readiness.level];

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <Breadcrumb items={[{ label: t.nav.home, path: '/' }, { label: p.title, isCurrent: true }]} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Badge variant="primary" size="md">
              <Gauge size={14} />
              <span>{p.badge}</span>
            </Badge>
          </div>
          <h1 className="headline-lg" style={{ margin: 0 }}>{p.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{p.subtitle}</p>
        </div>

        {/* 1. Continue Learning */}
        <section aria-labelledby="progress-current">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle icon={<BookOpen size={20} />} title={p.secCurrent} />
            {dashboard.current ? (
              <ProgressCard
                title={isBn ? dashboard.current.context.bn : dashboard.current.context.en}
                moduleName={isBn ? dashboard.current.title.bn : dashboard.current.title.en}
                progressPercent={dashboard.curriculum.percent}
                progressLabel={`${dashboard.curriculum.lessonStepsDone}/${dashboard.curriculum.lessonStepsTotal} ${t.pages.paths.stepsLabel}`}
                badge={isBn ? dashboard.current.status.bn : dashboard.current.status.en}
                ctaText={isBn ? dashboard.current.status.bn : dashboard.current.status.en}
                onAction={() => { if (dashboard.current) navigate(dashboard.current.route); }}
              />
            ) : (
              <ProgressEmptyState
                icon={<BookOpen size={22} />}
                title={p.emptyJourneyTitle}
                body={p.emptyJourneyBody}
                actionLabel={p.startPath}
                actionTo="/learn/paths/git-beginner"
              />
            )}
          </div>
        </section>

        {/* 2. Overview — three distinct numbers, never one misleading percent */}
        <section aria-labelledby="progress-overview">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle icon={<Gauge size={20} />} title={p.secOverview} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
              <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <strong className="title-md">{p.curriculumTitle}</strong>
                <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{p.curriculumDesc}</p>
                <span className="headline-md font-mono">{dashboard.curriculum.percent}%</span>
                <ProgressBar value={dashboard.curriculum.percent} height={8} color="primary" />
                <span className="body-sm">{dashboard.curriculum.lessonStepsDone}/{dashboard.curriculum.lessonStepsTotal} {t.pages.paths.stepsLabel}</span>
              </Card>
              <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <strong className="title-md">{p.skillTitle}</strong>
                <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{p.skillDesc}</p>
                <span className="headline-md font-mono">{dashboard.practice.completed}/{dashboard.practice.total}</span>
                <ProgressBar value={Math.round((dashboard.practice.completed / dashboard.practice.total) * 100)} height={8} color="secondary" />
                <span className="body-sm">{p.avgScore}: {dashboard.practice.avgBest}</span>
              </Card>
              <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <strong className="title-md">{p.readyTitle}</strong>
                <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{p.readyDesc}</p>
                <span><Badge variant="tertiary" size="md">{isBn ? readinessMeta.bn : readinessMeta.en}</Badge></span>
                <span className="body-sm">{dashboard.interview.reviewed}/{dashboard.interview.total} {p.statInterview}</span>
              </Card>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
              <StatCard label={p.statLessons} value={`${dashboard.curriculum.lessonsDone}/${dashboard.curriculum.lessonsTotal}`} icon={<BookOpen size={20} />} color="primary" />
              <StatCard label={p.statPaths} value={`${dashboard.pathsCompleted}/${dashboard.paths.length}`} icon={<ListChecks size={20} />} color="secondary" />
              <StatCard label={p.statStrong} value={`${dashboard.topicsStrong}/${dashboard.mastery.length}`} icon={<Sparkles size={20} />} color="tertiary" />
              <StatCard label={isBn ? 'কারিকুলাম সমাপ্তি' : 'Curriculum Progress'} value={`${dashboard.curriculum.percent}%`} icon={<CheckCircle2 size={20} />} color="success" />
            </div>
          </div>
        </section>

        {/* 3. Recommended next steps */}
        <section aria-labelledby="progress-next">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle icon={<ListChecks size={20} />} title={p.secNext} />
            {dashboard.recommendations.length === 0 ? (
              <Card variant="outlined" padding="lg"><p className="body-md" style={{ margin: 0 }}>{p.noWeakAreas}</p></Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {dashboard.recommendations.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Weak areas */}
        <section aria-labelledby="progress-weak">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle icon={<FlaskConical size={20} />} title={p.secWeak} />
            {dashboard.weakAreas.length === 0 ? (
              <Card variant="outlined" padding="lg"><p className="body-md" style={{ margin: 0 }}>{p.noWeakAreas}</p></Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                {dashboard.weakAreas.map((w) => (
                  <WeakAreaCard key={w.topic.topicId} weak={w} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. Learning paths */}
        <section aria-labelledby="progress-paths">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle
              icon={<ListChecks size={20} />}
              title={p.secPaths}
              action={<Link to="/learn/paths" style={{ textDecoration: 'none' }}><Button variant="text" size="sm" iconRight={<ArrowRight size={14} />}>{t.pages.paths.title}</Button></Link>}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {dashboard.paths.map(({ path, summary }) => (
                <LearningPathCard key={path.id} path={path} summary={summary} />
              ))}
            </div>
          </div>
        </section>

        {/* 6. Topic mastery (reuses Phase 12 system) */}
        <section aria-labelledby="progress-mastery">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle icon={<Sparkles size={20} />} title={p.secMastery} />
            <MasteryPanel mastery={dashboard.mastery} />
          </div>
        </section>

        {/* 7. Practice performance */}
        <section aria-labelledby="progress-practice">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle
              icon={<FlaskConical size={20} />}
              title={p.secPractice}
              action={<Link to="/practice" style={{ textDecoration: 'none' }}><Button variant="text" size="sm" iconRight={<ArrowRight size={14} />}>{p.openPractice}</Button></Link>}
            />
            {dashboard.practice.attempted === 0 ? (
              <ProgressEmptyState
                icon={<FlaskConical size={22} />}
                title={p.emptyPracticeTitle}
                body={p.emptyPracticeBody}
                actionLabel={p.startPractice}
                actionTo="/practice"
              />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
                  <StatCard label={p.practiceCompleted} value={`${dashboard.practice.completed}/${dashboard.practice.total}`} color="primary" />
                  <StatCard label={p.avgScore} value={dashboard.practice.avgBest} color="secondary" />
                  <StatCard label={p.bestScore} value={dashboard.practice.best} color="tertiary" />
                  <StatCard label={p.extraAttempts} value={dashboard.practice.extraAttempts} color="success" />
                </div>
                <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <strong className="title-sm">{p.byCategory}</strong>
                  {dashboard.practice.byCategory.filter((c) => c.total > 0).map((c) => (
                    <div key={c.category} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        <span className="body-sm" style={{ fontWeight: 600 }}>{practiceCatTitle(c.category)}</span>
                        <span className="label-sm font-mono">{c.done}/{c.total} · {p.avgScore} {c.attempted > 0 ? c.avgBest : '—'}</span>
                      </div>
                      <ProgressBar value={c.total === 0 ? 0 : Math.round((c.done / c.total) * 100)} height={6} color="primary" />
                    </div>
                  ))}
                  {(dashboard.practice.strongest || dashboard.practice.weakest) && (
                    <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
                      {dashboard.practice.strongest && <span>{p.strongestCat}: <strong>{practiceCatTitle(dashboard.practice.strongest.category)}</strong> ({dashboard.practice.strongest.avgBest})</span>}
                      {dashboard.practice.strongest && dashboard.practice.weakest && dashboard.practice.strongest.category !== dashboard.practice.weakest.category && <span> · </span>}
                      {dashboard.practice.weakest && dashboard.practice.strongest?.category !== dashboard.practice.weakest.category && (
                        <span>{p.weakestCat}: <strong>{practiceCatTitle(dashboard.practice.weakest.category)}</strong> ({dashboard.practice.weakest.avgBest})</span>
                      )}
                    </p>
                  )}
                </Card>
              </>
            )}
          </div>
        </section>

        {/* 8. Interview performance */}
        <section aria-labelledby="progress-interview">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle
              icon={<MessagesSquare size={20} />}
              title={p.secInterview}
              action={<Link to="/interview" style={{ textDecoration: 'none' }}><Button variant="text" size="sm" iconRight={<ArrowRight size={14} />}>{p.openInterview}</Button></Link>}
            />
            {dashboard.interview.reviewed === 0 ? (
              <ProgressEmptyState
                icon={<MessagesSquare size={22} />}
                title={p.emptyInterviewTitle}
                body={p.emptyInterviewBody}
                actionLabel={p.startInterview}
                actionTo="/interview"
              />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
                  <StatCard label={p.interviewReviewed} value={`${dashboard.interview.reviewed}/${dashboard.interview.total}`} color="primary" />
                  <StatCard
                    label={p.objectiveAccuracy}
                    value={dashboard.interview.objectiveAttempted === 0 ? '—' : `${Math.round((dashboard.interview.objectiveCorrect / dashboard.interview.objectiveAttempted) * 100)}%`}
                    color="secondary"
                  />
                  <StatCard
                    label={p.mockAvg}
                    value={dashboard.interview.readiness.avgMockScore === undefined ? '—' : dashboard.interview.readiness.avgMockScore}
                    color="tertiary"
                  />
                </div>
                <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <strong className="title-sm">{p.readinessLabel}:</strong>
                    <Badge variant="tertiary" size="sm">{isBn ? readinessMeta.bn : readinessMeta.en}</Badge>
                  </div>
                  {dashboard.interview.byCategory.map((c) => (
                    <div key={c.category} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        <Link to={`/interview/git/${c.category}`} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }} className="body-sm">
                          {interviewCatTitle(c.category)}
                        </Link>
                        <span className="label-sm font-mono">{c.reviewed}/{c.total}</span>
                      </div>
                      <ProgressBar value={c.total === 0 ? 0 : Math.round((c.reviewed / c.total) * 100)} height={6} color="primary" />
                    </div>
                  ))}
                  <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic', margin: 0 }}>
                    {p.selfVsObjective}
                  </p>
                </Card>
              </>
            )}
          </div>
        </section>

        {/* 9. Achievements & XP (reuses gamification display) */}
        <section aria-labelledby="progress-gamification">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle icon={<Trophy size={20} />} title={p.secAchievements} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              <Card variant="filled" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <CheckCircle2 size={18} color="var(--md-sys-color-primary)" />
                    <span className="title-sm">{isBn ? 'সামগ্রিক কারিকুলাম অগ্রগতি' : 'Overall Curriculum Progress'}</span>
                  </div>
                  <span className="label-sm font-mono" style={{ fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                    {dashboard.curriculum.percent}%
                  </span>
                </div>
                <ProgressBar value={dashboard.curriculum.percent} height={8} color="primary" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  <span>{dashboard.curriculum.lessonsDone} / {dashboard.curriculum.lessonsTotal} {isBn ? 'পাঠ সম্পন্ন' : 'lessons completed'}</span>
                  <span>{dashboard.curriculum.lessonStepsDone} / {dashboard.curriculum.lessonStepsTotal} {t.pages.paths.stepsLabel}</span>
                </div>
              </Card>
              <StreakCard streak={progress.streak} />
            </div>
            <DailyChallengeCard challenge={dailyChallenge} onComplete={completeDailyChallenge} />
            {dashboard.achievementsUnlocked === 0 ? (
              <ProgressEmptyState
                icon={<Trophy size={22} />}
                title={p.emptyAchTitle}
                body={p.emptyAchBody}
                actionLabel={p.startPath}
                actionTo="/learn/paths/git-beginner"
              />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)' }}>
                  {achievements.filter((a) => a.isUnlocked).slice(0, 6).map((a) => (
                    <AchievementCard key={a.id} achievement={a} />
                  ))}
                </div>
                {achievements.filter((a) => !a.isUnlocked).length > 0 && (
                  <details>
                    <summary className="body-md" style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>
                      {p.lockedAchievements} ({achievements.filter((a) => !a.isUnlocked).length})
                    </summary>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                      {achievements.filter((a) => !a.isUnlocked).map((a) => (
                        <AchievementCard key={a.id} achievement={a} />
                      ))}
                    </div>
                  </details>
                )}
              </>
            )}
          </div>
        </section>

        {/* 10. Recent activity */}
        <section aria-labelledby="progress-activity">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SectionTitle icon={<History size={20} />} title={p.secActivity} />
            {dashboard.activity.length === 0 ? (
              <Card variant="outlined" padding="lg"><p className="body-md" style={{ margin: 0 }}>{p.activityEmpty}</p></Card>
            ) : (
              <Card variant="outlined" padding="md">
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {dashboard.activity.map((item) => (
                    <ActivityItemRow key={item.id} item={item} />
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
  );
};
