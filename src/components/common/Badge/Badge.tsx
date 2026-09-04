import React from 'react';
import { cn } from '@/utils/classnames';
import './Badge.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'outline' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <span
      className={cn('m3-badge', `m3-badge--${variant}`, `m3-badge--${size}`, className)}
      {...props}
    >
      {children}
    </span>
  );
};
