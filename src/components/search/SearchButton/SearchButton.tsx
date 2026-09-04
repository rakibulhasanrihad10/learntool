import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import '../SearchModal/SearchModal.css';

export interface SearchButtonProps {
  onClick: () => void;
  className?: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick, className }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={cn('search-trigger-btn', className)}
      onClick={onClick}
      aria-label={t.common.searchPlaceholder}
    >
      <Search size={16} className="search-trigger-btn__icon" />
      <span className="search-trigger-btn__text body-sm">
        {t.common.searchPlaceholder}
      </span>
      <kbd className="search-trigger-btn__kbd font-mono">{t.common.searchShortcut}</kbd>
    </button>
  );
};
