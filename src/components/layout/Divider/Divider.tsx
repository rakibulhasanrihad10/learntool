import React from 'react';
import { cn } from '@/utils/classnames';
import './Divider.css';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  label?: React.ReactNode;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  spacing = 'md',
  label,
  className,
  ...props
}) => {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'gv-divider',
        `gv-divider--${orientation}`,
        `gv-divider--spacing-${spacing}`,
        Boolean(label) && 'gv-divider--with-label',
        className
      )}
      {...props}
    >
      {label && <span className="gv-divider__label label-sm">{label}</span>}
    </div>
  );
};
