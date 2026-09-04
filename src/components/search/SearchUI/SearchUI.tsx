import React from 'react';
import { Search, X, Folder, Terminal, HelpCircle, GitFork } from 'lucide-react';
import { Badge } from '@/components/common/Badge/Badge';
import { cn } from '@/utils/classnames';
import './SearchUI.css';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onClear,
  placeholder = 'Search GitVerse...',
  className,
  ...props
}) => {
  return (
    <div className={cn('gv-search-input-wrapper', className)}>
      <Search size={18} className="gv-search-input__icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        className="gv-search-input body-md"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search query"
          className="gv-search-input__clear"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export interface SearchResultItemProps {
  title: string;
  category: string;
  description?: string;
  iconType?: 'lesson' | 'command' | 'workflow' | 'interview';
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  title,
  category,
  description,
  iconType = 'lesson',
  isActive = false,
  onClick,
  className,
}) => {
  const icons = {
    lesson: <Folder size={16} />,
    command: <Terminal size={16} />,
    workflow: <GitFork size={16} />,
    interview: <HelpCircle size={16} />,
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        'gv-search-result',
        isActive && 'gv-search-result--active',
        className
      )}
    >
      <div className="gv-search-result__icon" aria-hidden="true">
        {icons[iconType]}
      </div>
      <div className="gv-search-result__content">
        <div className="gv-search-result__title label-md">{title}</div>
        {description && (
          <div className="gv-search-result__description body-sm">{description}</div>
        )}
      </div>
      <div className="gv-search-result__category">
        <Badge variant="neutral" size="sm">
          {category}
        </Badge>
      </div>
    </div>
  );
};

export interface SearchResultGroupProps {
  title: string;
  count?: number;
  children: React.ReactNode;
  className?: string;
}

export const SearchResultGroup: React.FC<SearchResultGroupProps> = ({
  title,
  count,
  children,
  className,
}) => {
  return (
    <div className={cn('gv-search-result-group', className)}>
      <div className="gv-search-result-group__header label-sm">
        <span>{title}</span>
        {count !== undefined && <span className="gv-search-result-group__count">({count})</span>}
      </div>
      <div className="gv-search-result-group__list">{children}</div>
    </div>
  );
};

export interface SearchEmptyStateProps {
  query?: string;
  suggestions?: string[];
  onSelectSuggestion?: (s: string) => void;
  className?: string;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  query,
  suggestions = ['git status', 'git commit', 'merge vs rebase', 'undo commit'],
  onSelectSuggestion,
  className,
}) => {
  return (
    <div className={cn('gv-search-empty', className)}>
      <Search size={32} className="gv-search-empty__icon" aria-hidden="true" />
      <h4 className="gv-search-empty__title title-sm">
        {query ? `No results for "${query}"` : 'Type to search across GitVerse'}
      </h4>
      <p className="gv-search-empty__desc body-sm">
        Try searching for commands, workflows, interview questions, or core concepts.
      </p>

      {suggestions.length > 0 && (
        <div className="gv-search-empty__suggestions">
          <span className="label-sm gv-search-empty__suggestions-title">Popular searches:</span>
          <div className="gv-search-empty__chips">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="gv-search-empty__chip label-sm"
                onClick={() => onSelectSuggestion?.(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
