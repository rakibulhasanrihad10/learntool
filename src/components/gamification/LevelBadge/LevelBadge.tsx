import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/utils/classnames';
import { useTranslation } from '@/i18n/context';
import './LevelBadge.css';

export interface LevelBadgeProps {
  level: number;
  title?: string;
  titleBn?: string;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  title,
  titleBn,
  size = 'md',
  showTitle = false,
  className,
}) => {
  const { language } = useTranslation();
  const displayTitle = language === 'bn' && titleBn ? titleBn : title;

  return (
    <div className={cn('m3-level-badge', `m3-level-badge--${size}`, className)}>
      <div className="m3-level-badge__icon-wrapper">
        <Shield size={size === 'sm' ? 14 : size === 'lg' ? 22 : 18} />
        <span className="m3-level-badge__number">{level}</span>
      </div>
      {showTitle && displayTitle && (
        <span className="m3-level-badge__title label-sm">{displayTitle}</span>
      )}
    </div>
  );
};
