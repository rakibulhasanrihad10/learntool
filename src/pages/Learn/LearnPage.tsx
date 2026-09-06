import React, { useEffect, useMemo } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Chip } from '@/components/common/Chip/Chip';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { GIT_MODULES } from '@/content/structure/gitModules';
import { GITHUB_MODULES } from '@/content/github';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  ArrowRight,
  Sparkles,
  GitBranch,
  Cpu,
  CheckCircle2,
  Map,
} from 'lucide-react';
import './LearnPage.css';

type CategoryType = 'all' | 'beginner' | 'intermediate' | 'advanced';

export const LearnPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { isLessonCompleted } = useGamification();
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSubject = subjectId === 'github' ? 'github' : 'git';
  const modules = activeSubject === 'github' ? GITHUB_MODULES : GIT_MODULES;
  const isBn = language === 'bn';

  const categoryParam = searchParams.get('category') as CategoryType | null;
  const selectedCategory: CategoryType =
    categoryParam && ['beginner', 'intermediate', 'advanced'].includes(categoryParam)
      ? categoryParam
      : 'all';

  const handleSelectCategory = (cat: CategoryType) => {
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.set('category', cat);
      setSearchParams(searchParams, { replace: true });
    }
  };

  useEffect(() => {
    setPageMeta({ title: t.pages.learn.title, description: t.pages.learn.subtitle });
  }, [t.pages.learn.title, t.pages.learn.subtitle]);

  // Compute stats per difficulty category
  const categoryStats = useMemo(() => {
    const calc = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
      const catModules = modules.filter((m) => m.difficulty === difficulty);
      const catLessons = catModules.flatMap((m) => m.lessons);
      const completed = catLessons.filter((l) => isLessonCompleted(l.id)).length;
      const totalLessons = catLessons.length;
      const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

      return {
        modulesCount: catModules.length,
        totalLessons,
        completed,
        percent,
      };
    };

    return {
      beginner: calc('beginner'),
      intermediate: calc('intermediate'),
      advanced: calc('advanced'),
    };
  }, [modules, isLessonCompleted]);

  // Filtered modules based on selected category
  const filteredModules = useMemo(() => {
    if (selectedCategory === 'all') return modules;
    return modules.filter((m) => m.difficulty === selectedCategory);
  }, [modules, selectedCategory]);

  const categoriesConfig = [
    {
      key: 'beginner' as const,
      title: t.pages.learn.beginnerTitle,
      desc: t.pages.learn.beginnerDesc,
      badge: t.pages.learn.beginnerCategory,
      badgeVariant: 'success' as const,
      icon: Sparkles,
      colorClass: 'learn-cat-card--beginner',
      pathId: activeSubject === 'git' ? 'git-beginner' : null,
      stats: categoryStats.beginner,
    },
    {
      key: 'intermediate' as const,
      title: t.pages.learn.intermediateTitle,
      desc: t.pages.learn.intermediateDesc,
      badge: t.pages.learn.intermediateCategory,
      badgeVariant: 'secondary' as const,
      icon: GitBranch,
      colorClass: 'learn-cat-card--intermediate',
      pathId: activeSubject === 'git' ? 'git-intermediate' : null,
      stats: categoryStats.intermediate,
    },
    {
      key: 'advanced' as const,
      title: t.pages.learn.advancedTitle,
      desc: t.pages.learn.advancedDesc,
      badge: t.pages.learn.advancedCategory,
      badgeVariant: 'warning' as const,
      icon: Cpu,
      colorClass: 'learn-cat-card--advanced',
      pathId: activeSubject === 'git' ? 'git-advanced' : null,
      stats: categoryStats.advanced,
    },
  ];

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div className="learn-page">
        {/* 1. Page Header */}
        <div className="learn-header">
          <div className="learn-header__meta">
            <Badge variant="primary" size="md">
              <BookOpen size={14} />
              <span>{t.pages.learn.badge}</span>
            </Badge>
            <Badge variant="outline" size="md">
              {modules.length} {isBn ? 'টি মডিউল' : 'Core Modules'}
            </Badge>
          </div>
          <h1 className="headline-lg learn-header__title">{t.pages.learn.title}</h1>
          <p className="body-lg learn-header__subtitle">
            {t.pages.learn.subtitle}
          </p>

          {/* Subject track switcher */}
          <div
            role="tablist"
            aria-label={t.pages.learn.subjectLabel}
            className="learn-track-switcher"
          >
            <Chip
              role="tab"
              aria-selected={activeSubject === 'git'}
              selected={activeSubject === 'git'}
              onClick={() => navigate('/learn/git')}
            >
              {t.pages.learn.gitTrack}
            </Chip>
            <Chip
              role="tab"
              aria-selected={activeSubject === 'github'}
              selected={activeSubject === 'github'}
              onClick={() => navigate('/learn/github')}
            >
              {t.pages.learn.githubTrack}
            </Chip>
          </div>
          {activeSubject === 'github' && (
            <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 'var(--space-1)' }}>
              {isBn
                ? 'গিটের ভিত্তির ওপরে দাঁড়িয়ে টিম সহযোগিতা: রিপোজিটরি, ব্রাঞ্চ, পুল রিকোয়েস্ট, রিভিউ ও ওয়ার্কফ্লো।'
                : 'Team collaboration on top of your Git foundation: repositories, branches, pull requests, reviews, and workflows.'}
            </p>
          )}
        </div>

        {/* Guided journeys entry */}
        <Card
          variant="elevated"
          padding="lg"
          interactive
          onClick={() => navigate('/learn/paths')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <span className="title-md">{t.pages.paths.title} →</span>
            <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t.pages.paths.subtitle}
            </span>
          </div>
          <Button variant="filled" size="md" iconRight={<ArrowRight size={16} />}>
            {t.pages.paths.badge}
          </Button>
        </Card>

        {/* 2. Three Interactive Level Category Cards */}
        <section className="learn-categories-section" aria-label="Curriculum Categories">
          <div className="learn-categories-grid">
            {categoriesConfig.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const Icon = cat.icon;

              return (
                <div
                  key={cat.key}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => handleSelectCategory(isSelected ? 'all' : cat.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectCategory(isSelected ? 'all' : cat.key);
                    }
                  }}
                  className={`learn-cat-card ${cat.colorClass} ${
                    isSelected ? 'learn-cat-card--active' : ''
                  }`}
                >
                  <div className="learn-cat-card__top">
                    <div className="learn-cat-card__badges">
                      <Badge variant={cat.badgeVariant} size="sm">
                        {cat.badge}
                      </Badge>
                      {isSelected && (
                        <Badge variant="primary" size="sm">
                          {isBn ? 'বাছাইকৃত' : 'Active'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="learn-cat-card__body">
                    <h2 className="title-md learn-cat-card__title">
                      <Icon size={18} />
                      <span>{cat.title}</span>
                    </h2>
                    <p className="body-sm learn-cat-card__desc">{cat.desc}</p>
                  </div>

                  <div className="learn-cat-card__footer">
                    <div className="learn-cat-card__progress-info">
                      <span>
                        {cat.stats.modulesCount} {t.pages.learn.modulesCount} · {cat.stats.totalLessons} {t.pages.learn.lessonCount}
                      </span>
                      <span style={{ fontWeight: 600, color: isSelected ? 'var(--md-sys-color-primary)' : 'inherit' }}>
                        {cat.stats.percent}%
                      </span>
                    </div>
                    <ProgressBar
                      value={cat.stats.percent}
                      height={5}
                      color={isSelected ? 'primary' : 'secondary'}
                    />

                    <div className="learn-cat-card__action-row">
                      <span className="learn-cat-card__select-label">
                        {isSelected ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>{isBn ? 'ফিল্টার সক্রিয়' : 'Showing Modules'}</span>
                          </>
                        ) : (
                          <span>{t.pages.learn.viewModules} →</span>
                        )}
                      </span>

                      {cat.pathId && (
                        <Button
                          variant="text"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/learn/paths/${cat.pathId}`);
                          }}
                        >
                          <Map size={14} style={{ marginRight: 4 }} />
                          <span>{t.pages.paths.badge}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Filter Toolbar & Section Header */}
        <div className="learn-filter-toolbar">
          <div className="learn-filter-pills" role="tablist" aria-label="Module level filter">
            <Chip
              role="tab"
              aria-selected={selectedCategory === 'all'}
              selected={selectedCategory === 'all'}
              onClick={() => handleSelectCategory('all')}
            >
              {t.pages.learn.allModules} ({modules.length})
            </Chip>
            <Chip
              role="tab"
              aria-selected={selectedCategory === 'beginner'}
              selected={selectedCategory === 'beginner'}
              onClick={() => handleSelectCategory('beginner')}
            >
              {t.pages.learn.beginnerCategory} ({categoryStats.beginner.modulesCount})
            </Chip>
            <Chip
              role="tab"
              aria-selected={selectedCategory === 'intermediate'}
              selected={selectedCategory === 'intermediate'}
              onClick={() => handleSelectCategory('intermediate')}
            >
              {t.pages.learn.intermediateCategory} ({categoryStats.intermediate.modulesCount})
            </Chip>
            <Chip
              role="tab"
              aria-selected={selectedCategory === 'advanced'}
              selected={selectedCategory === 'advanced'}
              onClick={() => handleSelectCategory('advanced')}
            >
              {t.pages.learn.advancedCategory} ({categoryStats.advanced.modulesCount})
            </Chip>
          </div>

          {selectedCategory !== 'all' && (
            <Button
              variant="text"
              size="sm"
              onClick={() => handleSelectCategory('all')}
            >
              {isBn ? 'সকল মডিউল দেখুন' : 'Show All Modules'} ({modules.length})
            </Button>
          )}
        </div>

        {/* 4. Contextual Guided Journey Banner when a category is selected */}
        {selectedCategory !== 'all' && activeSubject === 'git' && (
          <div className="learn-category-banner">
            <div className="learn-category-banner__content">
              <h3 className="learn-category-banner__title">
                {selectedCategory === 'beginner' && (isBn ? 'গিট বিগিনার কারিকুলাম' : 'Git Beginner Curriculum')}
                {selectedCategory === 'intermediate' && (isBn ? 'গিট ইন্টারমিডিয়েট কারিকুলাম' : 'Git Intermediate Curriculum')}
                {selectedCategory === 'advanced' && (isBn ? 'গিট এডভান্সড ও ইন্টারনালস কারিকুলাম' : 'Git Advanced & Internals Curriculum')}
              </h3>
              <p className="learn-category-banner__text">
                {selectedCategory === 'beginner' && (isBn
                  ? 'মৌলিক স্ন্যাপশট ও দৈনন্দিন ওয়ার্কফ্লো শেষ করুন। সম্পূর্ণ হ্যান্ডস-অন অনুশীলনের জন্য গাইডেড জার্নি বেছে নিতে পারেন।'
                  : 'Master fundamentals & everyday workflows. Want structured hands-on drills & terminal simulations?')}
                {selectedCategory === 'intermediate' && (isBn
                  ? 'ব্রাঞ্চিং, ৩-ওয়ে মার্জ, রিবেসিং ও কনফ্লিক্ট নিরসন আয়ত্ত করুন।'
                  : 'Level up branching, 3-way merges, rebasing, and GitHub collaboration etiquette.')}
                {selectedCategory === 'advanced' && (isBn
                  ? 'গিট অবজেক্ট, রেফারেন্স, DAG গ্রাফ ও প্যাকফাইল স্টোরেজ মেকানিক্স গভীরভাবে জানুন।'
                  : 'Explore under the hood: object database, commit graphs, refs, and storage internals.')}
              </p>
            </div>
            <Button
              variant="filled"
              size="md"
              iconRight={<ArrowRight size={16} />}
              onClick={() => navigate(`/learn/paths/git-${selectedCategory}`)}
            >
              {t.pages.learn.guidedPathCta}
            </Button>
          </div>
        )}

        {/* 5. Modules Grid */}
        <div className="learn-modules-grid">
          {filteredModules.map((mod) => {
            const title = language === 'bn' ? mod.titleBn : mod.title;
            const description = language === 'bn' ? mod.descriptionBn : mod.description;
            const completedCount = mod.lessons.filter((l) => isLessonCompleted(l.id)).length;
            const percent = Math.round((completedCount / mod.lessons.length) * 100);

            return (
              <Card
                key={mod.id}
                variant="filled"
                padding="lg"
                interactive
                onClick={() => navigate(`/learn/${activeSubject}/${mod.slug}`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Badge variant="primary" size="sm">Module {mod.order}</Badge>
                      <Badge
                        variant={
                          mod.difficulty === 'beginner'
                            ? 'success'
                            : mod.difficulty === 'intermediate'
                            ? 'secondary'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {mod.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="title-md" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                    {title}
                  </h3>
                  <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: 'var(--space-3)' }}>
                  {/* Progress indicator */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
                      <span>{completedCount} of {mod.lessons.length} {t.pages.learn.completedCount}</span>
                      <span style={{ fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>{percent}%</span>
                    </div>
                    <ProgressBar value={percent} height={5} color="primary" />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="label-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={14} />
                      <span>{mod.lessons.length} {t.pages.learn.lessonCount}</span>
                    </span>

                    <Button variant="text" size="sm" iconRight={<ArrowRight size={14} />}>
                      {completedCount > 0 ? (isBn ? 'চালিয়ে যান' : 'Continue') : t.common.actions.startLearning}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};
