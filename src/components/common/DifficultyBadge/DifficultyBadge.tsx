import React from 'react';
import { Badge } from '@/components/common/Badge/Badge';
import { DifficultyLevel } from '@/types/content';
import { useTranslation } from '@/i18n/context';
import './DifficultyBadge.css';

export interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  size?: 'sm' | 'md';
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = 'sm',
  className,
}) => {
  const { t } = useTranslation();

  const labels: Record<DifficultyLevel, string> = {
    beginner: t.common.badges.beginner,
    intermediate: t.common.badges.intermediate,
    advanced: t.common.badges.advanced,
  };

  const variants: Record<DifficultyLevel, 'success' | 'warning' | 'tertiary'> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'tertiary',
  };

  return (
    <Badge
      variant={variants[difficulty]}
      size={size}
      className={`gv-difficulty-badge gv-difficulty-badge--${difficulty} ${className || ''}`}
    >
      {labels[difficulty]}
    </Badge>
  );
};
