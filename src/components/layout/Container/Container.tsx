import React from 'react';
import { cn } from '@/utils/classnames';
import './Container.css';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: 'reading' | 'doc' | 'wide' | 'full';
  center?: boolean;
  gutters?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  width = 'wide',
  center = true,
  gutters = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'gv-container',
        `gv-container--${width}`,
        center && 'gv-container--center',
        gutters && 'gv-container--gutters',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
