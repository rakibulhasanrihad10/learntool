import React from 'react';
import { cn } from '@/utils/classnames';
import './EmptyState.css';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('m3-empty-state', className)}>
      {icon && <div className="m3-empty-state__icon">{icon}</div>}
      <h3 className="m3-empty-state__title title-md">{title}</h3>
      {description && <p className="m3-empty-state__desc body-md">{description}</p>}
      {action && <div className="m3-empty-state__action">{action}</div>}
    </div>
  );
};
