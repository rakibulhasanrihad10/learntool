import React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './StreakBadge.css';

export interface StreakBadgeProps {
  days: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  days,
  size = 'sm',
  className,
}) => {
  return (
    <span className={cn('gv-streak-badge', `gv-streak-badge--${size}`, className)}>
      <Flame size={size === 'sm' ? 14 : 16} className="gv-streak-badge__icon" aria-hidden="true" />
      <span className="gv-streak-badge__label font-mono">
        {days}d streak
      </span>
    </span>
  );
};
