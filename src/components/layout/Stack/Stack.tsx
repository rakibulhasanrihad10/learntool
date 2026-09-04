import React from 'react';
import { cn } from '@/utils/classnames';
import './Stack.css';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'column',
  gap = '4',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'gv-stack',
        `gv-stack--${direction}`,
        `gv-stack--gap-${gap}`,
        `gv-stack--align-${align}`,
        `gv-stack--justify-${justify}`,
        wrap && 'gv-stack--wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
