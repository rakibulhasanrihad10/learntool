import React, { useEffect, useMemo } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Terminal,
  GitBranch,
  Wrench,
  Code2,
  CheckCircle2,
  Undo2,
  Users,
  Compass,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { useNavigate } from 'react-router-dom';
import { useGamification } from '@/features/gamification/useGamification';
import { GIT_MODULES } from '@/content/structure/gitModules';
import { AnimatedGitStory } from '@/components/home/AnimatedGitStory/AnimatedGitStory';
import { MentalModelCards } from '@/components/home/MentalModelCards/MentalModelCards';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { progress } = useGamification();
  const isBn = language === 'bn';

  useEffect(() => {
    setPageMeta({ title: 'GitVerse', description: t.home.hero.subtitle });
  }, [t.home.hero.subtitle]);

  // Activity-based returning user detection
  const activityData = useMemo(() => {
    const completedIds = progress.completedLessonIds || [];
    const learningEntries = Object.values(progress.learningProgress || {});

    // In-progress lessons (started but not completed)
    const inProgress = learningEntries.filter(
      (entry) => entry.status === 'in_progress' || (entry.progressPercent > 0 && entry.progressPercent < 100)
    );

    const hasActivity = completedIds.length > 0 || inProgress.length > 0;

    if (!hasActivity) {
      return {
        hasActivity: false,
        activeLesson: null,
        parentModule: null,
        targetUrl: '/learn/git/fundamentals/what-is-git',
        percent: 0,
      };
    }

    // 1. If there is an active in-progress lesson, find it
    if (inProgress.length > 0) {
      const activeEntry = inProgress[0];
      for (const mod of GIT_MODULES) {
        const found = mod.lessons.find((l) => l.id === activeEntry.contentId);
        if (found) {
          return {
            hasActivity: true,
            activeLesson: found,
            parentModule: mod,
            targetUrl: `/learn/git/${mod.slug}/${found.slug}`,
            percent: activeEntry.progressPercent,
          };
        }
      }
    }

    // 2. Otherwise find the first unfinished lesson in the curriculum
    for (const mod of GIT_MODULES) {
      const nextUnfinished = mod.lessons.find((l) => !completedIds.includes(l.id));
      if (nextUnfinished) {
        const completedInMod = mod.lessons.filter((l) => completedIds.includes(l.id)).length;
        const modPercent = Math.round((completedInMod / mod.lessons.length) * 100);
        return {
          hasActivity: true,
          activeLesson: nextUnfinished,
          parentModule: mod,
          targetUrl: `/learn/git/${mod.slug}/${nextUnfinished.slug}`,
          percent: modPercent,
        };
      }
    }

    // If all completed, return the first lesson of the last module or review
    return {
      hasActivity: true,
      activeLesson: GIT_MODULES[0].lessons[0],
      parentModule: GIT_MODULES[0],
      targetUrl: '/learn',
      percent: 100,
    };
  }, [progress]);

  const totalModulesCount = GIT_MODULES.length;

  return (
    <PageContainer maxWidth="lg" className="home-page animate-fade-in">
      {/* ─────────────────────────────────────────────────────────────
          TIER 1: Hero (Highest Visual Weight)
          Answers "Why Git?" for newcomers, or welcomes returning learners
          ───────────────────────────────────────────────────────────── */}
      <section className="home-hero" aria-labelledby="hero-title">
        {activityData.hasActivity && activityData.activeLesson ? (
          /* Returning User Experience: Continue where you left off */
          <div className="home-hero__content home-hero__content--returning">
            <div className="home-hero__badge-row">
              <Badge variant="success" size="md">
                <Sparkles size={14} />
                <span>{t.home.hero.inProgressBadge}</span>
              </Badge>
            </div>

            <h1 id="hero-title" className="home-hero__title display-sm">
              {t.home.hero.returningTitle}
            </h1>

            <p className="home-hero__subtitle body-lg">
              {t.home.hero.returningSubtitle}
            </p>

            {/* Spotlight Resume Card */}
            <Card variant="elevated" padding="lg" className="home-resume-card">
              <div className="home-resume-card__header">
                <div>
                  <span className="label-sm home-resume-card__module-name">
                    {isBn ? activityData.parentModule?.titleBn : activityData.parentModule?.title}
                  </span>
                  <h3 className="title-md home-resume-card__lesson-title">
                    {isBn ? activityData.activeLesson.titleBn : activityData.activeLesson.title}
                  </h3>
                </div>
                <div className="home-resume-card__percent">
                  <span className="title-md">{activityData.percent}%</span>
                </div>
              </div>

              <ProgressBar value={activityData.percent} height={6} color="primary" />

              <div className="home-resume-card__actions">
                <Button
                  variant="filled"
                  size="lg"
                  iconRight={<ArrowRight size={18} />}
                  onClick={() => navigate(activityData.targetUrl)}
                >
                  {t.home.hero.continueCta}
                </Button>
                <Button
                  variant="text"
                  size="md"
                  onClick={() => navigate('/learn')}
                >
                  {t.home.whatYoullLearn.curriculumCta} →
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          /* First-Time User Experience: Why Git matters & First step */
          <div className="home-hero__content">
            <div className="home-hero__badge-row">
              <Badge variant="primary" size="md">
                <Compass size={14} />
                <span>{t.home.hero.eyebrow}</span>
              </Badge>
            </div>

            <h1 id="hero-title" className="home-hero__title display-sm">
              {t.home.hero.title}
            </h1>

            <p className="home-hero__subtitle body-lg">
              {t.home.hero.subtitle}
            </p>

            <div className="home-hero__actions">
              <Button
                variant="filled"
                size="lg"
                className="home-hero__primary-btn"
                iconRight={<ArrowRight size={18} />}
                onClick={() => navigate('/learn/git/fundamentals/what-is-git')}
              >
                {t.home.hero.ctaPrimary}
              </Button>

              <Button
                variant="text"
                size="lg"
                className="home-hero__secondary-btn"
                onClick={() => navigate('/learn')}
              >
                {t.home.hero.ctaSecondary} →
              </Button>
            </div>

            <div className="home-hero__trust-badge caption">
              <CheckCircle2 size={15} className="home-hero__trust-icon" />
              <span>{t.home.hero.trustBadge}</span>
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PROGRESSIVE DISCLOSURE LEVEL 1:
          15-Second Animated Visual Story (Your code changes → Git remembers → GitHub connects)
          ───────────────────────────────────────────────────────────── */}
      <AnimatedGitStory />

      {/* ─────────────────────────────────────────────────────────────
          PROGRESSIVE DISCLOSURE LEVEL 2:
          The Mental Model (Git vs GitHub vs Together)
          ───────────────────────────────────────────────────────────── */}
      <MentalModelCards />

      {/* ─────────────────────────────────────────────────────────────
          PROGRESSIVE DISCLOSURE LEVEL 3:
          Why Git Matters (The Relatable Developer Story & Superpowers)
          ───────────────────────────────────────────────────────────── */}
      <section className="home-section" aria-labelledby="why-git-title">
        <div className="home-section__header-compact">
          <span className="label-sm home-section__eyebrow">{t.home.whyGit.tagline}</span>
          <h2 id="why-git-title" className="title-lg home-section__title">
            {t.home.whyGit.headline}
          </h2>
        </div>

        {/* Story progression box */}
        <div className="home-story-box">
          <p className="home-story-box__timeline body-md">
            {t.home.whyGit.storyBefore}
          </p>
          <p className="home-story-box__resolution body-sm">
            {t.home.whyGit.storyAfter}
          </p>
        </div>

        {/* 4 Core Superpowers */}
        <div className="home-superpowers-grid">
          <Card variant="filled" padding="md" className="home-superpower-card">
            <div className="home-superpower-card__icon home-superpower-card__icon--track">
              <BookOpen size={20} />
            </div>
            <h3 className="title-sm">{t.home.whyGit.trackTitle}</h3>
            <p className="body-sm home-superpower-card__desc">{t.home.whyGit.trackDesc}</p>
          </Card>

          <Card variant="filled" padding="md" className="home-superpower-card">
            <div className="home-superpower-card__icon home-superpower-card__icon--experiment">
              <GitBranch size={20} />
            </div>
            <h3 className="title-sm">{t.home.whyGit.experimentTitle}</h3>
            <p className="body-sm home-superpower-card__desc">{t.home.whyGit.experimentDesc}</p>
          </Card>

          <Card variant="filled" padding="md" className="home-superpower-card">
            <div className="home-superpower-card__icon home-superpower-card__icon--collaborate">
              <Users size={20} />
            </div>
            <h3 className="title-sm">{t.home.whyGit.collaborateTitle}</h3>
            <p className="body-sm home-superpower-card__desc">{t.home.whyGit.collaborateDesc}</p>
          </Card>

          <Card variant="filled" padding="md" className="home-superpower-card">
            <div className="home-superpower-card__icon home-superpower-card__icon--recover">
              <Undo2 size={20} />
            </div>
            <h3 className="title-sm">{t.home.whyGit.recoverTitle}</h3>
            <p className="body-sm home-superpower-card__desc">{t.home.whyGit.recoverDesc}</p>
          </Card>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TIER 4: Your First 10 Minutes with Git (Orientation Stepper)
          Quiet milestones that show the beginner path
          ───────────────────────────────────────────────────────────── */}
      <section className="home-section" aria-labelledby="journey-title">
        <div className="home-section__header-compact">
          <span className="label-sm home-section__eyebrow">{t.home.journey.label}</span>
          <h2 id="journey-title" className="title-lg home-section__title">
            {t.home.journey.title}
          </h2>
          <p className="body-sm home-section__subtitle">
            {t.home.journey.subtitle}
          </p>
        </div>

        <div className="home-journey-stepper" role="list">
          <div className="home-journey-step home-journey-step--active" role="listitem">
            <div className="home-journey-step__num">1</div>
            <span className="body-sm home-journey-step__label">{t.home.journey.step1}</span>
          </div>

          <div className="home-journey-connector" aria-hidden="true" />

          <div className="home-journey-step" role="listitem">
            <div className="home-journey-step__num">2</div>
            <span className="body-sm home-journey-step__label">{t.home.journey.step2}</span>
          </div>

          <div className="home-journey-connector" aria-hidden="true" />

          <div className="home-journey-step" role="listitem">
            <div className="home-journey-step__num">3</div>
            <span className="body-sm home-journey-step__label">{t.home.journey.step3}</span>
          </div>

          <div className="home-journey-connector" aria-hidden="true" />

          <div className="home-journey-step" role="listitem">
            <div className="home-journey-step__num">4</div>
            <span className="body-sm home-journey-step__label">{t.home.journey.step4}</span>
          </div>

          <div className="home-journey-connector" aria-hidden="true" />

          <div className="home-journey-step" role="listitem">
            <div className="home-journey-step__num">5</div>
            <span className="body-sm home-journey-step__label">{t.home.journey.step5}</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TIER 5: What You'll Eventually Learn (Lightweight Roadmap)
          Quiet, bird's-eye view with dynamic module count
          ───────────────────────────────────────────────────────────── */}
      <section className="home-section home-section--quiet" aria-labelledby="curriculum-title">
        <div className="home-curriculum-strip">
          <div className="home-curriculum-strip__text">
            <span className="label-sm home-section__eyebrow">{t.home.whatYoullLearn.label}</span>
            <h2 id="curriculum-title" className="title-md home-curriculum-strip__title">
              {t.home.whatYoullLearn.title}
            </h2>
            <p className="body-sm home-curriculum-strip__desc">
              {t.home.whatYoullLearn.subtitle} · {totalModulesCount} {t.home.whatYoullLearn.modulesBadge}
            </p>
          </div>

          <Button
            variant="outlined"
            size="md"
            iconRight={<ArrowRight size={16} />}
            onClick={() => navigate('/learn')}
          >
            {t.home.whatYoullLearn.curriculumCta}
          </Button>
        </div>

        {/* Linear roadmap pills */}
        <div className="home-roadmap-pills">
          <span className="home-roadmap-pill">Git Basics</span>
          <span className="home-roadmap-arrow">→</span>
          <span className="home-roadmap-pill">Everyday Workflow</span>
          <span className="home-roadmap-arrow">→</span>
          <span className="home-roadmap-pill">Branching & Merging</span>
          <span className="home-roadmap-arrow">→</span>
          <span className="home-roadmap-pill">GitHub & PRs</span>
          <span className="home-roadmap-arrow">→</span>
          <span className="home-roadmap-pill">Undo & Recovery</span>
          <span className="home-roadmap-arrow">→</span>
          <span className="home-roadmap-pill">Git Internals</span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TIER 6: Experienced Developers Jump Links
          Quiet, minimal reference access
          ───────────────────────────────────────────────────────────── */}
      <section className="home-quick-jump" aria-label="Reference Jump Links">
        <span className="caption home-quick-jump__title">{t.home.quickJump.title}</span>
        <div className="home-quick-jump__links">
          <button
            type="button"
            className="home-quick-jump__link"
            onClick={() => navigate('/commands')}
          >
            <Terminal size={14} />
            <span>{t.home.quickJump.commands}</span>
          </button>
          <button
            type="button"
            className="home-quick-jump__link"
            onClick={() => navigate('/workflows')}
          >
            <GitBranch size={14} />
            <span>{t.home.quickJump.workflows}</span>
          </button>
          <button
            type="button"
            className="home-quick-jump__link"
            onClick={() => navigate('/troubleshooting')}
          >
            <Wrench size={14} />
            <span>{t.home.quickJump.troubleshooting}</span>
          </button>
          <button
            type="button"
            className="home-quick-jump__link"
            onClick={() => navigate('/practice')}
          >
            <Code2 size={14} />
            <span>{t.home.quickJump.practice}</span>
          </button>
        </div>
      </section>
    </PageContainer>
  );
};
