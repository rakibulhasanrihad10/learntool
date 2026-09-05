/**
 * Unified knowledge-discovery model (Phase 14).
 *
 * The index is METADATA ONLY — titles, descriptions, routes, and match
 * signals that reference existing stable content IDs. Full content objects
 * are never duplicated here. Reuses the per-type search utilities where
 * they already exist; this layer adds cross-type ranking, aliases, modes,
 * history, and suggestions on top.
 */
import { DifficultyLevel, LocalText } from '@/types/content';

export type SearchResultType =
  | 'lesson'
  | 'command'
  | 'workflow'
  | 'troubleshooting'
  | 'practice'
  | 'interview'
  | 'internals'
  | 'github'
  | 'path'
  | 'cheatsheet';

export const SEARCH_RESULT_TYPES: SearchResultType[] = [
  'lesson',
  'command',
  'workflow',
  'troubleshooting',
  'practice',
  'interview',
  'internals',
  'github',
  'path',
  'cheatsheet',
];

/** Learning Mode explains; Reference Mode looks up. Same index, different rank bias. */
export type SearchMode = 'learning' | 'reference';

export interface SearchIndexItem {
  /** Existing stable content id (e.g. `git.status`, `git.interview.merge-vs-rebase`). */
  id: string;
  type: SearchResultType;
  title: LocalText;
  description: LocalText;
  /** Existing route that delivers the content. */
  route: string;
  /** Human grouping label id/slug (module, command category, path…), untranslated. */
  category: string;
  /** Localized topic label where the source provides one (e.g. module title). */
  topic?: LocalText;
  tags: string[];
  /** Curated match phrases — natural language, both languages where useful. */
  keywords: string[];
  /** Alternate names / spellings (command aliases, "checkout" for switch…). */
  aliases: string[];
  /**
   * Exact technical terms: command names, flags, syntax fragments.
   * Never translated, matched exactly (case-insensitive).
   */
  techTerms: string[];
  difficulty?: DifficultyLevel;
  /** Canonical ordering inside the source catalog (stable tie-break). */
  order: number;
}

export interface RankedResult {
  item: SearchIndexItem;
  score: number;
  /** True when only a subset of tokens matched (OR fallback, see engine). */
  partial: boolean;
}

export interface SearchOptions {
  mode?: SearchMode;
  types?: SearchResultType[];
  difficulties?: DifficultyLevel[];
  limit?: number;
}
