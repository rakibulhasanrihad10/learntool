/**
 * Lightweight recent searches (Phase 14, §17).
 *
 * localStorage only, newest-first, max 8 entries. Stores bare query
 * strings — nothing sensitive, no account, no backend. Reuses the
 * existing crash-resilient `storage` utility.
 */
import { useCallback, useState } from 'react';
import { storage } from '@/utils/storage';

export const SEARCH_HISTORY_KEY = 'gitverse_search_history';
export const SEARCH_HISTORY_LIMIT = 8;

export function loadSearchHistory(): string[] {
  const raw = storage.get<string[]>(SEARCH_HISTORY_KEY, []);
  return Array.isArray(raw) ? raw.filter((q) => typeof q === 'string').slice(0, SEARCH_HISTORY_LIMIT) : [];
}

function saveSearchHistory(history: string[]): void {
  storage.set(SEARCH_HISTORY_KEY, history.slice(0, SEARCH_HISTORY_LIMIT));
}

export function addSearchHistory(prev: string[], query: string): string[] {
  const q = query.trim();
  if (!q) return prev;
  const next = [q, ...prev.filter((entry) => entry.toLowerCase() !== q.toLowerCase())];
  const capped = next.slice(0, SEARCH_HISTORY_LIMIT);
  saveSearchHistory(capped);
  return capped;
}

export function clearSearchHistory(): string[] {
  storage.remove(SEARCH_HISTORY_KEY);
  return [];
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(loadSearchHistory);

  const record = useCallback((query: string) => {
    setHistory((prev) => addSearchHistory(prev, query));
  }, []);

  const clear = useCallback(() => {
    setHistory(clearSearchHistory());
  }, []);

  return { history, record, clear };
}
