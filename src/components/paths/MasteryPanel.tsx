import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { ProgressBar } from '@/components/gamification/ProgressBar/ProgressBar';
import { useTranslation } from '@/i18n/context';
import { MASTERY_LEVEL_META } from '@/features/paths/mastery';
import { TopicMastery } from '@/types/learningPath';

/**
 * Topic-level mastery bars. Levels use icon-free text badges (no
 * color-only signalling) and the panel always carries the disclaimer
 * that this is a learning estimate, not certification.
 */
export const MasteryPanel: React.FC<{ mastery: TopicMastery[]; showLinks?: boolean }> = ({
  mastery,
  showLinks = false,
}) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.paths;

  const levelVariant = (level: TopicMastery['level']) =>
    level === 'strong' ? ('success' as const) : level === 'familiar' ? ('primary' as const) : ('outline' as const);

  return (
    <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div>
        <h2 className="title-md" style={{ margin: 0 }}>{p.masteryTitle}</h2>
        <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic', margin: 'var(--space-1) 0 0' }}>
          {p.masteryDisclaimer}
        </p>
      </div>
      {mastery.map((m) => (
        <div key={m.topicId} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span className="body-md" style={{ fontWeight: 600 }}>{isBn ? m.title.bn : m.title.en}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="label-sm font-mono">{m.score}%</span>
              <Badge variant={levelVariant(m.level)} size="sm">
                {isBn ? MASTERY_LEVEL_META[m.level].bn : MASTERY_LEVEL_META[m.level].en}
              </Badge>
            </span>
          </div>
          <ProgressBar value={m.score} height={8} color={m.score >= 80 ? 'success' : m.score >= 60 ? 'primary' : 'warning'} />
          {showLinks && (
            <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {p.lessonsLabel}: {m.lessonsDone}/{m.lessonsTotal} · {p.practiceLabel}: {m.practiceDone}/{m.practiceTotal}{' '}
              <Link to="/learn/paths" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
                {p.improveLabel} →
              </Link>
            </span>
          )}
        </div>
      ))}
    </Card>
  );
};
