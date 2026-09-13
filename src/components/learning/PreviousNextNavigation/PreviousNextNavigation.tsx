import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Check } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './PreviousNextNavigation.css';

export interface NavItem {
  title: string;
  url: string;
  sublabel?: string;
}

export interface PreviousNextNavigationProps {
  prev?: NavItem;
  next?: NavItem;
  className?: string;
  completion?: {
    isCompleted: boolean;
    onToggle: () => void;
  };
}

export const PreviousNextNavigation: React.FC<PreviousNextNavigationProps> = ({
  prev,
  next,
  className,
  completion,
}) => {
  const { t, language } = useTranslation();

  return (
    <nav aria-label="Lesson navigation" className={cn('gv-prev-next-nav', className)}>
      {prev ? (
        <Link to={prev.url} className="gv-prev-next-nav__link gv-prev-next-nav__link--prev">
          <ArrowLeft size={16} className="gv-prev-next-nav__arrow" aria-hidden="true" />
          <div className="gv-prev-next-nav__text-group">
            <span className="gv-prev-next-nav__sublabel label-sm">{prev.sublabel ?? t.common.actions.prevLesson}</span>
            <span className="gv-prev-next-nav__title title-sm">{prev.title}</span>
          </div>
        </Link>
      ) : (
        <div className="gv-prev-next-nav__spacer" />
      )}

      {completion && (
        <div className="gv-prev-next-nav__completion">
          <button
            type="button"
            onClick={completion.onToggle}
            disabled={completion.isCompleted}
            className={cn(
              'gv-prev-next-nav__complete-btn',
              completion.isCompleted && 'gv-prev-next-nav__complete-btn--completed'
            )}
            aria-label={
              completion.isCompleted
                ? (language === 'bn' ? 'পাঠ সম্পন্ন হয়েছে' : 'Lesson completed')
                : (language === 'bn' ? 'পাঠ সমাপ্ত চিহ্নিত করুন' : 'Mark as complete')
            }
          >
            {completion.isCompleted ? (
              <>
                <CheckCircle2 size={18} className="gv-prev-next-nav__complete-icon" aria-hidden="true" />
                <span>{language === 'bn' ? 'সম্পন্ন হয়েছে' : 'Completed'}</span>
              </>
            ) : (
              <>
                <Check size={18} className="gv-prev-next-nav__complete-icon" aria-hidden="true" />
                <span>{language === 'bn' ? 'সমাপ্ত চিহ্নিত করুন' : 'Mark as Complete'}</span>
              </>
            )}
          </button>
        </div>
      )}

      {next ? (
        <Link to={next.url} className="gv-prev-next-nav__link gv-prev-next-nav__link--next">
          <div className="gv-prev-next-nav__text-group">
            <span className="gv-prev-next-nav__sublabel label-sm">{next.sublabel ?? t.common.actions.nextLesson}</span>
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
