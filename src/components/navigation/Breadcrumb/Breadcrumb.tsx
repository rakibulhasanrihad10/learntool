import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/classnames';
import { useTranslation } from '@/i18n/context';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  labelBn?: string;
  path?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  className,
}) => {
  const { language } = useTranslation();

  return (
    <nav className={cn('m3-breadcrumb', className)} aria-label="Breadcrumb">
      <ol className="m3-breadcrumb__list">
        {showHome && (
          <li className="m3-breadcrumb__item">
            <Link to="/" className="m3-breadcrumb__link" aria-label="Home">
              <Home size={15} />
            </Link>
            <ChevronRight size={14} className="m3-breadcrumb__separator" aria-hidden="true" />
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent;
          const displayLabel = (language === 'bn' && item.labelBn) ? item.labelBn : item.label;

          return (
            <li key={index} className="m3-breadcrumb__item">
              {isLast || !item.path ? (
                <span
                  className="m3-breadcrumb__current"
                  aria-current="page"
                >
                  {displayLabel}
                </span>
              ) : (
                <Link to={item.path} className="m3-breadcrumb__link">
                  {displayLabel}
                </Link>
              )}

              {!isLast && (
                <ChevronRight size={14} className="m3-breadcrumb__separator" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
