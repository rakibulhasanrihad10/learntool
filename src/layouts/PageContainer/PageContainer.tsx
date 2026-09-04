import React from 'react';
import { cn } from '@/utils/classnames';
import './PageContainer.css';

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = 'lg',
  ...props
}) => {
  return (
    <div className={cn('page-container', `page-container--${maxWidth}`, className)} {...props}>
      {children}
    </div>
  );
};
