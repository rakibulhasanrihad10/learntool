import React from 'react';
import { cn } from '@/utils/classnames';
import './CodeText.css';

export interface CodeTextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'primary';
}

export const CodeText: React.FC<CodeTextProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <code
      className={cn('gv-code-text', `gv-code-text--${variant}`, className)}
      {...props}
    >
      {children}
    </code>
  );
};
