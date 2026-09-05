import React, { useEffect } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { StatCard } from '@/components/data-display/StatCard/StatCard';
import { ProgressCard } from '@/components/data-display/ProgressCard/ProgressCard';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { XPProgress } from '@/components/gamification/XPProgress/XPProgress';
import { StreakCard } from '@/components/gamification/StreakCard/StreakCard';
import { DailyChallengeCard } from '@/components/gamification/DailyChallengeCard/DailyChallengeCard';
import { AchievementCard } from '@/components/gamification/AchievementCard/AchievementCard';
import {
  BookOpen,
  Terminal,
  Wrench,
  Flame,
  ArrowRight,
  GitBranch,
  FolderGit2,
  RotateCcw,
  CloudUpload,
  History,
  Sparkles,
  Award,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import { useLearningSignals } from '@/features/paths/signals';
import { getContinueTarget, stepRoute } from '@/features/paths/progress';
import { useProgressDashboard } from '@/features/progress/dashboard';
import { LEARNING_PATHS } from '@/content/paths';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { t, language } = useTranslation();

  useEffect(() => {
    setPageMeta({ title: 'GitVerse', description: t.dashboard.welcomeSubtitle });
  }, [t.dashboard.welcomeSubtitle]);
  const isBn = language === 'bn';
  const { userLevel, progress, achievements, dailyChallenge, completeDailyChallenge } = useGamification();
  const navigate = useNavigate();
  const signals = useLearningSignals();
  const continueTarget = getContinueTarget(LEARNING_PATHS, signals);
  const continuePath = continueTarget?.path ?? LEARNING_PATHS[0];
  const continueStep = continueTarget
    ? continueTarget.path.steps.find((s) => s.id === continueTarget.summary.currentStepId)
    : undefined;
  const continueRoute = (() => {
    if (continueStep) {
      const route = stepRoute(continueStep);
      if (route) return route;
    }
    return `/learn/paths/${continuePath.id}`;
  })();
  // Concise snapshot only — full analytics live on /progress.
  const snapshot = useProgressDashboard();

  return (
    <PageContainer maxWidth="lg" className="home-page animate-fade-in">
      {/* 1. Hero / Welcome Banner */}
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-hero__content">
          <div className="home-hero__badge-row">
            <Badge variant="secondary" size="md">
              <Sparkles size={13} />
              <span>Interactive Learning Architecture</span>
            </Badge>
            <Badge variant="outline" size="md">Interactive Simulator & Labs</Badge>
          </div>

          <h1 id="hero-title" className="home-hero__title display-sm">
            {t.dashboard.welcomeTitle}
          </h1>

          <p className="home-hero__subtitle body-lg">
            {t.dashboard.welcomeSubtitle}
          </p>

          <div className="home-hero__actions">
            <Button
              variant="filled"
              size="lg"
              iconRight={<ArrowRight size={18} />}
              onClick={() => navigate('/learn/paths')}
            >
              {t.dashboard.heroCtaPrimary}
            </Button>
            <Button
              variant="outlined"
              size="lg"
              iconLeft={<Terminal size={18} />}
              onClick={() => navigate('/commands')}
            >
              {t.dashboard.heroCtaSecondary}
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Gamification Status Row (XP Progress & Streak Card) */}
      <section className="home-gamification-grid" aria-label="Learner progression">
        <XPProgress userLevel={userLevel} totalXp={progress.totalXp} />
        <StreakCard streak={progress.streak} />
      </section>

      {/* 3. Key Metrics & Stat Counters */}
      <section className="home-stats-grid" aria-label="Learning statistics">
        <StatCard
          label={t.dashboard.stats.modulesCompleted}
          value="8 Tracks"
          trend="Fundamentals to Internals"
          icon={<BookOpen size={20} />}
          color="primary"
        />
        <StatCard
          label={t.dashboard.stats.commandsMastered}
          value="48+"
          trend="Flag & syntax breakdowns"
          icon={<Terminal size={20} />}
          color="secondary"
        />
        <StatCard
          label={t.dashboard.stats.troubleshootSolved}
          value="24 Scenarios"
          trend="Step-by-step recovery"
          icon={<Wrench size={20} />}
          color="tertiary"
        />
        <StatCard
          label={t.dashboard.stats.dailyStreak}
          value={`${progress.streak.currentStreak} Days`}
          trend="Active Daily Practice"
          icon={<Flame size={20} />}
          color="success"
        />
      </section>

      {/* 4. Featured / Continue Learning Path */}
      <section className="home-section" aria-labelledby="continue-learning-title">
        <div className="home-section__header">
          <div>
            <h2 id="continue-learning-title" className="title-lg">{t.dashboard.continueLearning.title}</h2>
            <p className="body-sm home-section__subtitle">{t.dashboard.continueLearning.subtitle}</p>
          </div>
        </div>

        <ProgressCard
          title={isBn ? continuePath.title.bn : continuePath.title.en}
          moduleName={
            continueStep
              ? (isBn ? continueStep.title.bn : continueStep.title.en)
              : t.dashboard.continueLearning.subtitle
          }
          progressPercent={continueTarget?.summary.percent ?? 0}
          progressLabel={
            continueTarget
              ? `${continueTarget.summary.requiredCompleted}/${continueTarget.summary.requiredTotal} ${t.pages.paths.stepsLabel} · ${continueTarget.summary.percent}%`
              : t.dashboard.continueLearning.subtitle
          }
          badge={
            continueTarget
              ? t.pages.paths.inProgressBadge
              : t.pages.paths.notStartedBadge
          }
          ctaText={t.dashboard.continueLearning.resumeButton}
          onAction={() => navigate(continueRoute)}
        />

        <Card variant="outlined" padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <span className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {t.pages.progress.curriculumTitle}: <strong>{snapshot.curriculum.percent}%</strong>
            {' · '}{t.pages.progress.skillTitle}: <strong>{snapshot.practice.completed}/{snapshot.practice.total}</strong>
            {' · '}{t.pages.progress.readyTitle}: <strong>{snapshot.interview.reviewed}/{snapshot.interview.total}</strong>
          </span>
          <Button variant="text" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/progress')}>
            {t.pages.progress.title}
          </Button>
        </Card>
      </section>

      {/* 5. Daily Challenge & Achievements Showcase Dual Column */}
      <div className="home-dual-grid">
        {/* Daily Challenge Component */}
        <section className="home-section" aria-labelledby="daily-challenge-heading">
          <div className="home-section__header">
            <div>
              <h2 id="daily-challenge-heading" className="title-lg">{t.dashboard.dailyChallenge.title}</h2>
            </div>
          </div>

          <DailyChallengeCard
            challenge={dailyChallenge}
            onComplete={completeDailyChallenge}
          />
        </section>

        {/* Achievements Showcase */}
        <section className="home-section" aria-labelledby="achievements-heading">
          <div className="home-section__header">
            <div>
              <h2 id="achievements-heading" className="title-lg">{t.dashboard.achievementsPreview.title}</h2>
              <p className="body-sm home-section__subtitle">{t.dashboard.achievementsPreview.subtitle}</p>
            </div>
            <Badge variant="primary" size="sm">
              <Award size={13} />
              <span>{progress.unlockedAchievementIds.length} / {achievements.length} Unlocked</span>
            </Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {achievements.slice(0, 3).map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </div>
        </section>
      </div>

      {/* 6. Quick Access Hub */}
      <section className="home-section" aria-labelledby="quick-access-title">
        <div className="home-section__header">
          <div>
            <h2 id="quick-access-title" className="title-lg">{t.dashboard.quickAccess.title}</h2>
            <p className="body-sm home-section__subtitle">{t.dashboard.quickAccess.subtitle}</p>
          </div>
          <Button variant="text" size="sm" onClick={() => navigate('/commands')}>
            {t.common.actions.viewAll}
          </Button>
        </div>

        <div className="home-quick-grid">
          <Card
            variant="filled"
            padding="md"
            interactive
            className="home-quick-card"
            onClick={() => navigate('/commands')}
          >
            <div className="home-quick-card__icon home-quick-card__icon--primary">
              <FolderGit2 size={22} />
            </div>
            <div className="home-quick-card__content">
              <h3 className="title-sm">{t.dashboard.quickAccess.gitInitTitle}</h3>
              <p className="body-sm">{t.dashboard.quickAccess.gitInitDesc}</p>
            </div>
          </Card>

          <Card
            variant="filled"
            padding="md"
            interactive
            className="home-quick-card"
            onClick={() => navigate('/workflows')}
          >
            <div className="home-quick-card__icon home-quick-card__icon--secondary">
              <GitBranch size={22} />
            </div>
            <div className="home-quick-card__content">
              <h3 className="title-sm">{t.dashboard.quickAccess.branchingTitle}</h3>
              <p className="body-sm">{t.dashboard.quickAccess.branchingDesc}</p>
            </div>
          </Card>

          <Card
            variant="filled"
            padding="md"
            interactive
            className="home-quick-card"
            onClick={() => navigate('/troubleshooting')}
          >
            <div className="home-quick-card__icon home-quick-card__icon--tertiary">
              <RotateCcw size={22} />
            </div>
            <div className="home-quick-card__content">
              <h3 className="title-sm">{t.dashboard.quickAccess.undoMistakesTitle}</h3>
              <p className="body-sm">{t.dashboard.quickAccess.undoMistakesDesc}</p>
            </div>
          </Card>

          <Card
            variant="filled"
            padding="md"
            interactive
            className="home-quick-card"
            onClick={() => navigate('/workflows')}
          >
            <div className="home-quick-card__icon home-quick-card__icon--success">
              <CloudUpload size={22} />
            </div>
            <div className="home-quick-card__content">
              <h3 className="title-sm">{t.dashboard.quickAccess.remoteSyncTitle}</h3>
              <p className="body-sm">{t.dashboard.quickAccess.remoteSyncDesc}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* 7. Recently Explored / Activity Log */}
      <section className="home-section" aria-labelledby="recent-activity-title">
        <div className="home-section__header">
          <div>
            <h2 id="recent-activity-title" className="title-lg">{t.dashboard.recentItems.title}</h2>
            <p className="body-sm home-section__subtitle">{t.dashboard.recentItems.subtitle}</p>
          </div>
        </div>

        <EmptyState
          icon={<History size={26} />}
          title="History Ready"
          description={t.dashboard.recentItems.emptyState}
          action={
            <Button variant="outlined" size="sm" onClick={() => navigate('/commands')}>
              Browse Commands
            </Button>
          }
        />
      </section>
    </PageContainer>
  );
};
