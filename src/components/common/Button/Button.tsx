import React, { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated' | 'icon' | 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'filled',
      size = 'md',
      iconLeft,
      iconRight,
      isLoading = false,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Map semantic alias variants to CSS classes
    const resolvedVariant =
      variant === 'primary' ? 'filled' :
      variant === 'secondary' ? 'tonal' :
      variant === 'tertiary' ? 'text' :
      variant;

    return (
      <button
        ref={ref}
        className={cn(
          'm3-btn',
          `m3-btn--${resolvedVariant}`,
          `m3-btn--${size}`,
          isLoading && 'm3-btn--loading',
          fullWidth && 'm3-btn--full-width',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="m3-btn__spinner" aria-hidden="true" />
        ) : (
          <>
            {iconLeft && <span className="m3-btn__icon-left">{iconLeft}</span>}
            {children && <span className="m3-btn__label">{children}</span>}
            {iconRight && <span className="m3-btn__icon-right">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
