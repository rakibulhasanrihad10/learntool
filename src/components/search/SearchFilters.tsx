import React from 'react';
import { Chip } from '@/components/common/Chip/Chip';
import { useTranslation } from '@/i18n/context';
import { DifficultyLevel } from '@/types/content';
import { SEARCH_RESULT_TYPES, SearchMode, SearchResultType } from '@/features/search/searchTypes';
import { typeLabel } from './SearchResultCard';

export interface SearchFiltersProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  activeType: SearchResultType | 'all';
  onTypeChange: (type: SearchResultType | 'all') => void;
  activeDifficulty: DifficultyLevel | 'all';
  onDifficultyChange: (difficulty: DifficultyLevel | 'all') => void;
  counts?: Partial<Record<SearchResultType, number>>;
}

/**
 * Mode toggle + type/difficulty chips. Horizontally scrollable so the
 * filter row never overflows small viewports; chips expose pressed state.
 */
export const SearchFilters: React.FC<SearchFiltersProps> = ({
  mode,
  onModeChange,
  activeType,
  onTypeChange,
  activeDifficulty,
  onDifficultyChange,
  counts,
}) => {
  const { t } = useTranslation();
  const s = t.common.search;

  const rowStyle: React.CSSProperties = {
    display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-1)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} role="group" aria-label={t.pages.search.filtersLabel}>
      <div style={rowStyle} role="group" aria-label={t.common.mode.activeMode}>
        <Chip role="radio" aria-checked={mode === 'learning'} selected={mode === 'learning'} onClick={() => onModeChange('learning')}>
          {s.modeLearning}
        </Chip>
        <Chip role="radio" aria-checked={mode === 'reference'} selected={mode === 'reference'} onClick={() => onModeChange('reference')}>
          {s.modeReference}
        </Chip>
      </div>
      <div style={rowStyle} role="group" aria-label={t.pages.search.typeFilterLabel}>
        <Chip role="radio" aria-checked={activeType === 'all'} selected={activeType === 'all'} onClick={() => onTypeChange('all')}>
          {s.allFilter} {counts ? '' : ''}
        </Chip>
        {SEARCH_RESULT_TYPES.map((type) => (
          <Chip
            key={type}
            role="radio"
            aria-checked={activeType === type}
            selected={activeType === type}
            onClick={() => onTypeChange(type)}
          >
            {typeLabel(type, t)}
            {counts?.[type] !== undefined ? ` (${counts[type]})` : ''}
          </Chip>
        ))}
      </div>
      <div style={rowStyle} role="group" aria-label={t.pages.search.difficultyFilterLabel}>
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((d) => (
          <Chip
            key={d}
            role="radio"
            aria-checked={activeDifficulty === d}
            selected={activeDifficulty === d}
            onClick={() => onDifficultyChange(d)}
          >
            {d === 'all' ? s.allFilter : t.common.badges[d]}
          </Chip>
        ))}
      </div>
    </div>
  );
};
