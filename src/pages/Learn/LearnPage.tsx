import React from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const LearnPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { isLessonCompleted } = useGamification();
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const activeSubject = subjectId === 'github' ? 'github' : 'git';
  const modules = activeSubject === 'github' ? GITHUB_MODULES : GIT_MODULES;
  const isBn = language === 'bn';

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Badge variant="primary" size="md">
              <BookOpen size={14} />
              <span>{t.pages.learn.badge}</span>
            </Badge>
            <Badge variant="outline" size="md">{modules.length} {isBn ? 'টি মডিউল' : 'Core Modules'}</Badge>
          </div>
          <h1 className="headline-lg">{t.pages.learn.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {t.pages.learn.subtitle}
          </p>
          {/* Subject track switcher */}
          <div role="tablist" aria-label={t.pages.learn.subjectLabel} style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
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
            <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
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
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}
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

        {/* Modules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
          {modules.map((mod) => {
            const title = language === 'bn' ? mod.titleBn : mod.title;
            const description = language === 'bn' ? mod.descriptionBn : mod.description;
            const completedCount = mod.lessons.filter((l) => isLessonCompleted(l.id)).length;
            const percent = Math.round((completedCount / mod.lessons.length) * 100);

            // Total estimated duration
            const totalMins = mod.lessons.reduce((acc, l) => acc + l.durationMinutes, 0);

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

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.75rem' }}>
                      <Clock size={13} />
                      <span>{totalMins} mins</span>
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
                      <span>{completedCount} of {mod.lessons.length} completed</span>
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
                      {completedCount > 0 ? 'Continue' : t.common.actions.startLearning}
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
