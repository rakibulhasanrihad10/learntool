import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { getModuleBySlug } from '@/content/github';
import { useTranslation } from '@/i18n/context';
import { useGamification } from '@/features/gamification/useGamification';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const ModuleDetailPage: React.FC = () => {
  const { subjectId, moduleId } = useParams<{ subjectId: string; moduleId: string }>();
  const { language, t } = useTranslation();
  const { isLessonCompleted } = useGamification();
  const navigate = useNavigate();

  const moduleData = getModuleBySlug(subjectId ?? 'git', moduleId ?? '');

  if (!moduleData) {
    return (
      <PageContainer maxWidth="sm" className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
        <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <h2 className="title-md">Module Not Found</h2>
          <p className="body-md" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            The requested module could not be located in the curriculum.
          </p>
          <Button variant="filled" size="md" onClick={() => navigate('/learn')}>
            {t.pages.notFound.exploreLearn}
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const title = language === 'bn' ? moduleData.titleBn : moduleData.title;
  const description = language === 'bn' ? moduleData.descriptionBn : moduleData.description;

  // Calculate module completion stats
  const completedCount = moduleData.lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPercent = Math.round((completedCount / moduleData.lessons.length) * 100);

  const breadcrumbItems = [
    { label: t.nav.learn, labelBn: 'লার্নিং ট্র্যাকস', path: '/learn' },
    { label: 'Git & GitHub', labelBn: 'গিট ও গিটহাব', path: '/learn' },
    { label: moduleData.title, labelBn: moduleData.titleBn, isCurrent: true },
  ];

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Module Header Card */}
        <Card
          variant="elevated"
          padding="lg"
          style={{
            background: 'linear-gradient(135deg, var(--md-sys-color-surface-container-low), var(--md-sys-color-surface-container))',
            border: '1px solid var(--md-sys-color-outline-variant)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Badge variant="primary" size="sm">Module {moduleData.order}</Badge>
                <Badge variant="outline" size="sm">{moduleData.difficulty}</Badge>
              </div>
              <h1 className="headline-md" style={{ color: 'var(--md-sys-color-on-surface)' }}>{title}</h1>
            </div>

            <Button
              variant="tonal"
              size="sm"
              iconLeft={<ArrowLeft size={14} />}
              onClick={() => navigate('/learn')}
            >
              All Tracks
            </Button>
          </div>

          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {description}
          </p>

          {/* Module Progress Bar */}
          <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
              <span>Progress: {completedCount} / {moduleData.lessons.length} completed</span>
              <span style={{ fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} height={7} color="primary" />
          </div>
        </Card>

        {/* Lessons List Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="title-lg">{t.pages.learn.moduleHeader}</h2>
            <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {moduleData.lessons.length} {t.pages.learn.lessonCount}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {moduleData.lessons.map((lesson, idx) => {
              const isCompleted = isLessonCompleted(lesson.id);
              const lessonTitle = language === 'bn' && lesson.titleBn ? lesson.titleBn : lesson.title;
              const lessonSummary = language === 'bn' && lesson.summaryBn ? lesson.summaryBn : lesson.summary;

              return (
                <Card
                  key={lesson.id}
                  variant="filled"
                  padding="md"
                  interactive
                  onClick={() => navigate(`/learn/${moduleData.subjectId}/${moduleData.slug}/${lesson.slug}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    borderLeft: isCompleted
                      ? '4px solid var(--md-sys-color-success)'
                      : '4px solid var(--md-sys-color-outline-variant)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isCompleted
                          ? 'var(--md-sys-color-success-container)'
                          : 'var(--md-sys-color-surface-container-high)',
                        color: isCompleted
                          ? 'var(--md-sys-color-on-success-container)'
                          : 'var(--md-sys-color-on-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        flexShrink: 0,
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={20} /> : `${idx + 1}`}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <h3 className="title-sm" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                        {lessonTitle}
                      </h3>
                      <p className="body-xs" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {lessonSummary}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.75rem' }}>
                      <Clock size={13} />
                      <span>{lesson.durationMinutes} min</span>
                    </div>

                    <Button variant="text" size="sm" iconRight={<ArrowRight size={14} />}>
                      {isCompleted ? 'Review' : 'Start'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
