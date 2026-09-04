import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './XPBadge.css';

export interface XPBadgeProps {
  xp: number;
  showIcon?: boolean;
  prefix?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const XPBadge: React.FC<XPBadgeProps> = ({
  xp,
  showIcon = true,
  prefix = '+',
  size = 'sm',
  className,
}) => {
  return (
    <span className={cn('gv-xp-badge', `gv-xp-badge--${size}`, className)}>
      {showIcon && <Zap size={size === 'sm' ? 12 : 14} className="gv-xp-badge__icon" aria-hidden="true" />}
      <span className="gv-xp-badge__label font-mono">
        {prefix}{xp} XP
      </span>
    </span>
  );
};
