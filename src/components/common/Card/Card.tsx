import React, { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'filled' | 'elevated' | 'outlined' | 'highlighted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      padding = 'md',
      interactive = false,
      className,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = variant === 'default' ? 'filled' : variant;

    return (
      <div
        ref={ref}
        className={cn(
          'm3-card',
          `m3-card--${resolvedVariant}`,
          `m3-card--padding-${padding}`,
          interactive && 'm3-card--interactive',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
