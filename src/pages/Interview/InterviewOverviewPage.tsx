import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { useTranslation } from '@/i18n/context';
import { INTERVIEW_CATEGORIES, getQuestionsByCategory } from '@/content/interview';
import { useInterviewProgress } from '@/features/interview/progress';
import { computeReadiness } from '@/features/interview/readiness';
import { ReadinessCard } from '@/components/interview/ReadinessCard';
import { ArrowRight } from 'lucide-react';

export const InterviewOverviewPage: React.FC = () => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.interview;
  const { progress, mockHistory } = useInterviewProgress();
  const readiness = computeReadiness(progress, mockHistory);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${p.title} | GitVerse`;
  }, [p.title]);

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Breadcrumb
          items={[{ label: p.title, path: '/interview' }, { label: p.allTopics, isCurrent: true }]}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <h1 className="headline-lg">{p.allTopics}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{p.subtitle}</p>
        </div>

        <ReadinessCard readiness={readiness} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          {INTERVIEW_CATEGORIES.map((cat) => {
            const items = getQuestionsByCategory(cat.id);
            const reviewed = items.filter((q) => progress[q.id]?.reviewed).length;
            return (
              <Link key={cat.id} to={`/interview/git/${cat.id}`} style={{ textDecoration: 'none' }}>
                <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge variant="secondary" size="sm">{isBn ? cat.title.bn : cat.title.en}</Badge>
                    <Badge variant="outline" size="sm">{reviewed}/{items.length}</Badge>
                  </div>
                  <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {isBn ? cat.blurb.bn : cat.blurb.en}
                  </p>
                  <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {p.openTopic} <ArrowRight size={14} />
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card variant="outlined" padding="lg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <div>
            <strong className="title-md">{p.mockTitle}</strong>
            <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{p.mockSubtitle}</p>
          </div>
          <Link to="/interview/git/mock" style={{ textDecoration: 'none' }}>
            <Button variant="filled" size="md">{p.startMock}</Button>
          </Link>
        </Card>
      </div>
    </PageContainer>
  );
};
