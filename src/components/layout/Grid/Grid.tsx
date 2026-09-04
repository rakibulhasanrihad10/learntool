import React from 'react';
import { cn } from '@/utils/classnames';
import './Grid.css';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: '2' | '3' | '4' | '6' | '8';
  responsive?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 3,
  gap = '4',
  responsive = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'gv-grid',
        `gv-grid--cols-${columns}`,
        `gv-grid--gap-${gap}`,
        responsive && 'gv-grid--responsive',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
