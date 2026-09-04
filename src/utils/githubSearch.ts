import { GithubSearchEntry } from '@/content/github/githubSearchIndex';
import { tokenizeQuery } from './commandSearch';

/**
 * Concept search over the GitHub collaboration index.
 * Pure function — same token-AND semantics as the other search engines.
 * Results fold into SearchModal's existing lesson group.
 */

function normalize(value: string | undefined | null): string {
  return (value ?? '').toLowerCase().trim();
}

function entryMatchesToken(entry: GithubSearchEntry, token: string): boolean {
  const t = normalize(token);
  if (!t) return true;
  const haystack = [
    entry.id,
    entry.title,
    entry.titleBn,
    entry.subtitle,
    entry.subtitleBn,
    ...entry.keywords,
  ].map(normalize);
  return haystack.some((field) => field.includes(t));
}

function entryScore(entry: GithubSearchEntry, token: string): number {
  const t = normalize(token);
  if (!t) return 0;
  const has = (v: string | undefined) => normalize(v).includes(t);
  if (entry.keywords.some((k) => normalize(k) === t)) return 4;
  if (has(entry.title) || has(entry.titleBn)) return 3;
  if (entry.keywords.some((k) => has(k))) return 2;
  return entryMatchesToken(entry, t) ? 1 : 0;
}

export function searchGithubConcepts(
  query: string,
  entries: GithubSearchEntry[]
): GithubSearchEntry[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];
  return entries
    .map((entry) => ({
      entry,
      score: tokens.reduce((sum, t) => sum + entryScore(entry, t), 0),
    }))
    .filter((s) => tokens.every((t) => entryScore(s.entry, t) > 0))
    .sort((a, b) => b.score - a.score)
    .map((s) => s.entry);
}
