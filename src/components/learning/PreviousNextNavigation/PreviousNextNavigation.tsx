import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './PreviousNextNavigation.css';

export interface NavItem {
  title: string;
  url: string;
}

export interface PreviousNextNavigationProps {
  prev?: NavItem;
  next?: NavItem;
  className?: string;
}

export const PreviousNextNavigation: React.FC<PreviousNextNavigationProps> = ({
  prev,
  next,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <nav aria-label="Lesson navigation" className={cn('gv-prev-next-nav', className)}>
      {prev ? (
        <Link to={prev.url} className="gv-prev-next-nav__link gv-prev-next-nav__link--prev">
          <ArrowLeft size={16} className="gv-prev-next-nav__arrow" aria-hidden="true" />
          <div className="gv-prev-next-nav__text-group">
            <span className="gv-prev-next-nav__sublabel label-sm">{t.common.actions.prevLesson}</span>
            <span className="gv-prev-next-nav__title title-sm">{prev.title}</span>
          </div>
        </Link>
      ) : (
        <div className="gv-prev-next-nav__spacer" />
      )}

      {next ? (
        <Link to={next.url} className="gv-prev-next-nav__link gv-prev-next-nav__link--next">
          <div className="gv-prev-next-nav__text-group">
            <span className="gv-prev-next-nav__sublabel label-sm">{t.common.actions.nextLesson}</span>
            <span className="gv-prev-next-nav__title title-sm">{next.title}</span>
          </div>
          <ArrowRight size={16} className="gv-prev-next-nav__arrow" aria-hidden="true" />
        </Link>
      ) : (
        <div className="gv-prev-next-nav__spacer" />
      )}
    </nav>
  );
};
