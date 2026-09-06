import React from 'react';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { Badge } from '@/components/common/Badge/Badge';
import { CheckCircle2, Circle } from 'lucide-react';
import { DifficultyLevel } from '@/types/content';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './LessonHeader.css';

export interface LessonHeaderProps {
  title: string;
  moduleTitle?: string;
  durationMinutes?: number;
  difficulty?: DifficultyLevel;
  summary?: string;
  className?: string;
  isCompleted?: boolean;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  moduleTitle,
  difficulty,
  summary,
  className,
  isCompleted,
}) => {
  const { language } = useTranslation();

  return (
    <header className={cn('gv-lesson-header', className)}>
      <div className="gv-lesson-header__meta">
        {moduleTitle && (
          <Badge variant="secondary" size="sm">
            {moduleTitle}
          </Badge>
        )}
        {difficulty && <DifficultyBadge difficulty={difficulty} size="sm" />}
      </div>

      <div className="gv-lesson-header__title-row">
        <h1 className="gv-lesson-header__title headline-lg">{title}</h1>
        {isCompleted !== undefined && (
          <span
            className={cn(
              'gv-lesson-header__status-badge',
              isCompleted
                ? 'gv-lesson-header__status-badge--completed'
                : 'gv-lesson-header__status-badge--incomplete'
            )}
          >
            {isCompleted ? (
              <CheckCircle2 size={14} aria-hidden="true" />
            ) : (
              <Circle size={14} aria-hidden="true" />
            )}
            <span>
              {isCompleted
                ? (language === 'bn' ? 'সম্পন্ন' : 'Completed')
                : (language === 'bn' ? 'অসম্পূর্ণ' : 'Not Completed')}
            </span>
          </span>
        )}
      </div>

      {summary && (
        <p className="gv-lesson-header__summary body-lg">{summary}</p>
      )}
    </header>
  );
};
