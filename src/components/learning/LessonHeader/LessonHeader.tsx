import React from 'react';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { Badge } from '@/components/common/Badge/Badge';
import { Clock } from 'lucide-react';
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
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  moduleTitle,
  durationMinutes,
  difficulty,
  summary,
  className,
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
        {durationMinutes && (
          <span className="gv-lesson-header__duration label-sm">
            <Clock size={14} aria-hidden="true" />
            <span>
              {language === 'bn' ? `${durationMinutes} মিনিট` : `${durationMinutes} min read`}
            </span>
          </span>
        )}
      </div>

      <h1 className="gv-lesson-header__title headline-lg">{title}</h1>

      {summary && (
        <p className="gv-lesson-header__summary body-lg">{summary}</p>
      )}
    </header>
  );
};
