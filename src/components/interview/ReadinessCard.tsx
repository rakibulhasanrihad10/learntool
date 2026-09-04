import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { useTranslation } from '@/i18n/context';
import { INTERVIEW_READINESS_META, ReadinessResult } from '@/features/interview/readiness';
import { INTERVIEW_CATEGORIES } from '@/content/interview';

export const ReadinessCard: React.FC<{ readiness: ReadinessResult }> = ({ readiness }) => {
  const { language } = useTranslation();
  const isBn = language === 'bn';
  const meta = INTERVIEW_READINESS_META[readiness.level];
  const weakLabels = readiness.weakCategories.map((id) => {
    const cat = INTERVIEW_CATEGORIES.find((c) => c.id === id);
    return cat ? (isBn ? cat.title.bn : cat.title.en) : id;
  });

  return (
    <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Badge variant="tertiary" size="md">{isBn ? 'প্রস্তুতি' : 'Readiness'}</Badge>
        <Badge variant="secondary" size="sm">{isBn ? meta.bn : meta.en}</Badge>
      </div>
      <div style={{ height: '10px', borderRadius: '999px', backgroundColor: 'var(--md-sys-color-surface-container-highest)', overflow: 'hidden' }}>
        <div
          style={{
            width: `${readiness.coveragePct}%`,
            height: '100%',
            backgroundColor: 'var(--md-sys-color-primary)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <p className="body-md">
        {readiness.reviewedCount}/{readiness.total} {isBn ? 'পর্যালোচিত' : 'reviewed'}
        {readiness.avgMockScore !== undefined &&
          ` · ${isBn ? 'মক গড়' : 'mock avg'} ${readiness.avgMockScore}`}
        {` · ${readiness.mocksFinished} ${isBn ? 'মক' : 'mocks'}`}
      </p>
      {weakLabels.length > 0 && (
        <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {isBn ? 'দুর্বল ক্ষেত্র: ' : 'Weak areas: '}
          {weakLabels.map((label, i) => (
            <span key={label}>
              <Link
                to={`/interview/git/${readiness.weakCategories[i]}`}
                style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}
              >
                {label}
              </Link>
              {i < weakLabels.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}
    </Card>
  );
};
