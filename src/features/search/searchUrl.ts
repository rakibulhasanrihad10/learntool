/**
 * Shareable search URL state (Phase 14, §20).
 *
 * `/search?q=git+reset&type=command&mode=reference&difficulty=beginner`
 * initializes the page; typing/filters rewrite the URL (replace) so
 * browser back/forward behaves naturally. Pure parse/format helpers are
 * unit-tested; the page binds them to `useSearchParams`.
 */
import { DifficultyLevel } from '@/types/content';
import { SEARCH_RESULT_TYPES, SearchMode, SearchResultType } from './searchTypes';

export interface SearchUrlState {
  q: string;
  type: SearchResultType | 'all';
  mode: SearchMode;
  difficulty: DifficultyLevel | 'all';
}

export const DEFAULT_SEARCH_URL_STATE: SearchUrlState = {
  q: '',
  type: 'all',
  mode: 'learning',
  difficulty: 'all',
};

export function parseSearchParams(params: URLSearchParams): SearchUrlState {
  const type = params.get('type') ?? 'all';
  const mode = params.get('mode') ?? 'learning';
  const difficulty = params.get('difficulty') ?? 'all';
  return {
    q: params.get('q') ?? '',
    type: (SEARCH_RESULT_TYPES as string[]).includes(type) ? (type as SearchResultType) : 'all',
    mode: mode === 'reference' ? 'reference' : 'learning',
    difficulty: ['beginner', 'intermediate', 'advanced'].includes(difficulty)
      ? (difficulty as DifficultyLevel)
      : 'all',
  };
}

export function formatSearchParams(state: Partial<SearchUrlState>): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q?.trim()) params.set('q', state.q.trim());
  if (state.type && state.type !== 'all') params.set('type', state.type);
  if (state.mode && state.mode !== 'learning') params.set('mode', state.mode);
  if (state.difficulty && state.difficulty !== 'all') params.set('difficulty', state.difficulty);
  return params;
}
