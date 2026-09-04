import React from 'react';
import { BookmarkCheck, Check } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './TakeawayCard.css';

export interface TakeawayCardProps {
  takeaways: string[];
  title?: string;
  className?: string;
}

export const TakeawayCard: React.FC<TakeawayCardProps> = ({
  takeaways,
  title,
  className,
}) => {
  const { language } = useTranslation();
  const defaultTitle = language === 'bn' ? 'মূল শিক্ষণীয় বিষয়সমূহ' : 'Key Takeaways';

  return (
    <div className={cn('gv-takeaway-card', className)}>
      <div className="gv-takeaway-card__header">
        <BookmarkCheck size={20} className="gv-takeaway-card__icon" aria-hidden="true" />
        <h3 className="gv-takeaway-card__title title-sm">{title || defaultTitle}</h3>
      </div>
      <ul className="gv-takeaway-card__list">
        {takeaways.map((point, index) => (
          <li key={index} className="gv-takeaway-card__item body-sm">
            <span className="gv-takeaway-card__bullet" aria-hidden="true">
              <Check size={14} />
            </span>
            <span className="gv-takeaway-card__text">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
