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
  onToggleComplete?: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  moduleTitle,
  difficulty,
  summary,
  className,
  isCompleted,
  onToggleComplete,
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
          onToggleComplete ? (
            <button
              type="button"
              onClick={onToggleComplete}
              disabled={isCompleted}
              className={cn(
                'gv-lesson-header__status-badge',
                'gv-lesson-header__status-badge--interactive',
                isCompleted
                  ? 'gv-lesson-header__status-badge--completed'
                  : 'gv-lesson-header__status-badge--incomplete'
              )}
              title={
                isCompleted
                  ? (language === 'bn' ? 'পাঠ সম্পন্ন হয়েছে' : 'Lesson completed')
                  : (language === 'bn' ? 'সম্পন্ন হিসেবে চিহ্নিত করতে ক্লিক করুন' : 'Click to mark as complete')
              }
            >
              {isCompleted ? (
                <CheckCircle2 size={14} aria-hidden="true" />
              ) : (
                <Circle size={14} aria-hidden="true" />
              )}
              <span>
                {isCompleted
                  ? (language === 'bn' ? 'সম্পন্ন' : 'Completed')
                  : (language === 'bn' ? 'অসম্পূর্ণ (চিহ্নিত করুন)' : 'Mark as Complete')}
              </span>
            </button>
          ) : (
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
          )
        )}
      </div>

      {summary && (
        <p className="gv-lesson-header__summary body-lg">{summary}</p>
      )}
    </header>
  );
};
