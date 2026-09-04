import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import { ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './ProgressCard.css';

export interface ProgressCardProps {
  title: string;
  moduleName: string;
  progressPercent: number;
  progressLabel?: string;
  badge?: string;
  ctaText?: string;
  onAction?: () => void;
  className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  moduleName,
  progressPercent,
  progressLabel,
  badge,
  ctaText = 'Resume Lesson',
  onAction,
  className,
}) => {
  return (
    <Card className={cn('progress-card', className)} padding="lg" variant="elevated">
      <div className="progress-card__header">
        <div className="progress-card__title-area">
          <div className="progress-card__badge-row">
            <span className="label-sm progress-card__section-label">{title}</span>
            {badge && <Badge variant="primary" size="sm">{badge}</Badge>}
          </div>
          <h3 className="title-lg progress-card__module-name">{moduleName}</h3>
        </div>
        <div className="progress-card__action">
          <Button
            variant="filled"
            size="md"
            iconRight={<ArrowRight size={16} />}
            onClick={onAction}
          >
            {ctaText}
          </Button>
        </div>
      </div>

      <div className="progress-card__body">
        <div className="progress-card__meta">
          <span className="body-sm progress-card__meta-item">
            <BookOpen size={14} />
            <span>Interactive Guide</span>
          </span>
          <span className="label-sm progress-card__percent">
            {progressLabel || `${progressPercent}% Completed`}
          </span>
        </div>
        <div className="progress-card__track">
          <div
            className="progress-card__fill"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
