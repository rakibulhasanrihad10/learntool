import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { useTranslation } from '@/i18n/context';
import { stepRoute } from '@/features/paths/progress';
import { WhatNext } from '@/features/paths/recommend';
import { Compass } from 'lucide-react';

/**
 * "What next?" after a completed lesson: the deterministic follow-up
 * step in each containing path, plus upcoming practice / cookbook /
 * interview steps. Links open existing experiences; nothing duplicated.
 */
export const WhatNextCard: React.FC<{ whatNext: WhatNext; completedTitle: string }> = ({
  whatNext,
  completedTitle,
}) => {
  const { t, language } = useTranslation();
  const isBn = language === 'bn';
  const p = t.pages.paths;
  const empty =
    whatNext.pathFollowups.length === 0 &&
    whatNext.practice.length === 0 &&
    whatNext.troubleshooting.length === 0 &&
    whatNext.interview.length === 0;
  if (empty) return null;

  const renderSteps = (
    steps: WhatNext['practice'],
    badge: string
  ) =>
    steps.map((s) => {
      const route = stepRoute(s);
      const label = isBn ? s.title.bn : s.title.en;
      return (
        <li key={s.id} className="body-sm">
          <Badge variant="secondary" size="sm">{badge}</Badge>{' '}
          {route ? (
            <Link to={route} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
              {label}
            </Link>
          ) : (
            <span>{label}</span>
          )}
        </li>
      );
    });

  return (
    <Card variant="outlined" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Compass size={18} aria-hidden="true" />
        <h2 className="title-md" style={{ margin: 0 }}>{p.whatNextTitle}</h2>
      </div>
      <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
        {p.youCompleted}: <strong>{completedTitle}</strong>
      </p>
      <ol className="body-sm" style={{ margin: 0, paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        {whatNext.pathFollowups.map(({ path, nextStep }) => {
          if (!nextStep) return null;
          const route = stepRoute(nextStep);
          const label = isBn ? nextStep.title.bn : nextStep.title.en;
          const pathLabel = isBn ? path.title.bn : path.title.en;
          return (
            <li key={path.id}>
              <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{pathLabel}: </span>
              {route ? (
                <Link to={route} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
                  {label}
                </Link>
              ) : (
                <span>{label}</span>
              )}
            </li>
          );
        })}
        {renderSteps(whatNext.practice, p.typePractice)}
        {renderSteps(whatNext.troubleshooting, p.typeTroubleshooting)}
        {renderSteps(whatNext.interview, p.typeInterview)}
      </ol>
    </Card>
  );
};
