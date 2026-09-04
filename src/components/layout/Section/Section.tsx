import React from 'react';
import { cn } from '@/utils/classnames';
import './Section.css';

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  action,
  spacing = 'md',
  children,
  className,
  ...props
}) => {
  return (
    <section
      className={cn('gv-section', `gv-section--spacing-${spacing}`, className)}
      {...props}
    >
      {(title || subtitle || action) && (
        <header className="gv-section__header">
          <div className="gv-section__title-group">
            {title && (
              typeof title === 'string' ? (
                <h2 className="gv-section__title title-lg">{title}</h2>
              ) : (
                title
              )
            )}
            {subtitle && (
              typeof subtitle === 'string' ? (
                <p className="gv-section__subtitle body-sm">{subtitle}</p>
              ) : (
                subtitle
              )
            )}
          </div>
          {action && <div className="gv-section__action">{action}</div>}
        </header>
      )}
      <div className="gv-section__content">{children}</div>
    </section>
  );
};
