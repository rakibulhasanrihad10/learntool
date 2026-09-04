import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { HelpCircle, Layers, Timer, Target } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { INTERVIEW_CATEGORIES, INTERVIEW_QUESTIONS } from '@/content/interview';
import { useInterviewProgress } from '@/features/interview/progress';
import { computeReadiness } from '@/features/interview/readiness';
import { ReadinessCard } from '@/components/interview/ReadinessCard';

export const InterviewPage: React.FC = () => {
  const { t } = useTranslation();
  const { progress, mockHistory } = useInterviewProgress();
  const readiness = computeReadiness(progress, mockHistory);

  useEffect(() => {
    document.title = `${t.pages.interview.title} | GitVerse`;
  }, [t.pages.interview.title]);

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Badge variant="tertiary" size="md">
              <HelpCircle size={14} />
              <span>{t.pages.interview.badge}</span>
            </Badge>
          </div>
          <h1 className="headline-lg">{t.pages.interview.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {t.pages.interview.subtitle}
          </p>
        </div>

        <ReadinessCard readiness={readiness} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Layers size={20} />
            <strong className="title-md">{INTERVIEW_QUESTIONS.length}</strong>
            <span className="body-sm">{t.pages.interview.statQuestions}</span>
          </Card>
          <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Target size={20} />
            <strong className="title-md">{INTERVIEW_CATEGORIES.length}</strong>
            <span className="body-sm">{t.pages.interview.statTopics}</span>
          </Card>
          <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Timer size={20} />
            <strong className="title-md">10–20</strong>
            <span className="body-sm">{t.pages.interview.statMocks}</span>
          </Card>
        </div>

        <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <p className="body-md">{t.pages.interview.honestyNote}</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Link to="/interview/git" style={{ textDecoration: 'none' }}>
              <Button variant="filled" size="md">{t.pages.interview.browseTopics}</Button>
            </Link>
            <Link to="/interview/git/mock" style={{ textDecoration: 'none' }}>
              <Button variant="tonal" size="md">{t.pages.interview.startMock}</Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
