/**
 * Search mode preference (Phase 14, §11).
 *
 * Learning Mode explains (lessons, paths, workflows, practice first);
 * Reference Mode looks up (commands, cheatsheets, troubleshooting first).
 * One underlying index — the mode only biases deterministic ranking.
 * Persisted locally; defaults to learning.
 */
import { useCallback, useState } from 'react';
import { storage } from '@/utils/storage';
import { SearchMode } from './searchTypes';

export const SEARCH_MODE_KEY = 'gitverse_search_mode';

export function loadSearchMode(): SearchMode {
  const raw = storage.get<string>(SEARCH_MODE_KEY, 'learning');
  return raw === 'reference' ? 'reference' : 'learning';
}

export function useSearchMode() {
  const [mode, setModeState] = useState<SearchMode>(loadSearchMode);

  const setMode = useCallback((next: SearchMode) => {
    setModeState(next);
    storage.set(SEARCH_MODE_KEY, next);
  }, []);

  return { mode, setMode };
}
