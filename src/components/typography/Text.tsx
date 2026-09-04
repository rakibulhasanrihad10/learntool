import React from 'react';
import { cn } from '@/utils/classnames';
import './Text.css';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'body-lg' | 'body-md' | 'body-sm' | 'caption' | 'label';
  as?: 'p' | 'span' | 'div' | 'label';
  color?: 'default' | 'muted' | 'subtle' | 'primary' | 'error' | 'success' | 'inherit';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body-md',
  as = 'p',
  color = 'default',
  weight,
  align,
  children,
  className,
  ...props
}) => {
  const Component = as as React.ElementType;

  return (
    <Component
      className={cn(
        'gv-text',
        `gv-text--${variant}`,
        `gv-text--color-${color}`,
        weight && `gv-text--weight-${weight}`,
        align && `gv-text--align-${align}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
