/**
 * Deterministic unified ranking (Phase 14).
 *
 * Pipeline: tokenize → drop stopwords → expand concepts → filter by
 * type/difficulty → score → sort. AND semantics over content tokens;
 * when AND yields nothing, a deterministic OR fallback returns the best
 * partial matches (flagged `partial: true`) instead of an empty page.
 *
 * Ranking tiers (per token, summed; exact-query bonuses added once):
 *  1. exact title match ............ +100
 *  2. exact command match .......... +80 on the reference itself
 *     (command/cheatsheet), +40 on content merely about it
 *  2b. syntax-substring match ...... +70 / +35  ("reset hard" ⊂ `git reset --hard`,
 *     punctuation-insensitive; same type weighting as above)
 *  4. title substring .............. +30
 *  5. keyword hit .................. +20
 *  6. alias hit .................... +18
 *  7. topic/category hit ........... +12
 *  8. description hit .............. +8
 *  9. tag hit ...................... +6
 * Mode bias ........................ +10  (preferred types per mode)
 * Full-query title phrase .......... +50
 *
 * Stable tie-break: score → mode type rank → catalog order → id.
 * No randomness, no network, no AI — identical inputs, identical output.
 */
import { tokenizeQuery } from '@/utils/commandSearch';
import { getSearchIndex } from './searchIndex';
import { expandToken, STOPWORDS } from './searchAliases';
import {
  RankedResult,
  SearchIndexItem,
  SearchMode,
  SearchOptions,
  SearchResultType,
} from './searchTypes';

const LEARNING_FIRST: SearchResultType[] = ['lesson', 'path', 'workflow', 'practice', 'interview', 'github'];
const REFERENCE_FIRST: SearchResultType[] = ['command', 'cheatsheet', 'troubleshooting', 'internals', 'workflow'];

export function contentTokens(query: string): string[] {
  return tokenizeQuery(query).filter((t) => !STOPWORDS.has(t));
}

function lower(v: string | undefined): string {
  return (v ?? '').toLowerCase();
}

function includes(haystack: string | undefined, needle: string): boolean {
  return lower(haystack).includes(needle);
}

function exactEquals(haystack: string | undefined, needle: string): boolean {
  return lower(haystack).trim() === needle;
}

function stripGitPrefix(query: string): string {
  return query.toLowerCase().trim().replace(/^git\s+/, '').trim();
}

function tokenScore(item: SearchIndexItem, token: string): number {
  const expansions = expandToken(token);
  let best = 0;
  for (const variant of expansions) {
    let score = 0;
    if (item.techTerms.some((t) => exactEquals(t, variant))) score = Math.max(score, 40);
    else if (includes(item.title.en, variant) || includes(item.title.bn, variant)) score = Math.max(score, 30);
    else if (item.keywords.some((k) => includes(k, variant))) score = Math.max(score, 20);
    else if (item.aliases.some((a) => includes(a, variant))) score = Math.max(score, 18);
    else if (
      includes(item.category, variant) ||
      includes(item.topic?.en, variant) ||
      includes(item.topic?.bn, variant)
    ) score = Math.max(score, 12);
    else if (includes(item.description.en, variant) || includes(item.description.bn, variant)) score = Math.max(score, 8);
    else if (item.tags.some((t) => includes(t, variant))) score = Math.max(score, 6);
    best = Math.max(best, score);
  }
  return best;
}

function matchesAllTokens(item: SearchIndexItem, tokens: string[]): boolean {
  return tokens.every((t) => tokenScore(item, t) > 0);
}

function modeBonus(item: SearchIndexItem, mode: SearchMode | undefined): number {
  if (!mode) return 0;
  const preferred = mode === 'learning' ? LEARNING_FIRST : REFERENCE_FIRST;
  return preferred.includes(item.type) ? 10 : 0;
}

function alnum(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Exact-query bonuses (max wins, never stacked). The full weight goes to
 * the reference itself (command/cheatsheet); content that merely mentions
 * or links the command earns half, so `git reset` ranks the command above
 * guides that reference it.
 */
function exactQueryBonus(item: SearchIndexItem, rawQuery: string): number {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return 0;
  if (exactEquals(item.title.en, q) || exactEquals(item.title.bn, q)) return 100;
  const bare = stripGitPrefix(q);
  if (!bare) return 0;
  const isReference = item.type === 'command' || item.type === 'cheatsheet';
  if (
    item.techTerms.some((t) => exactEquals(t, bare)) ||
    item.aliases.some((a) => exactEquals(a, bare))
  ) {
    return isReference ? 80 : 40;
  }
  // Punctuation-insensitive syntax containment: "reset hard" ⊂ `git reset --hard`.
  const bareNorm = alnum(bare);
  if (
    bareNorm.length >= 4 &&
    item.techTerms.some((t) => {
      const norm = alnum(t);
      return norm.length > bareNorm.length && norm.includes(bareNorm);
    })
  ) {
    return isReference ? 70 : 35;
  }
  if (includes(item.title.en, q) || includes(item.title.bn, q)) return 50;
  return 0;
}

function typeRank(type: SearchResultType, mode: SearchMode | undefined): number {
  const order = mode === 'reference' ? REFERENCE_FIRST : LEARNING_FIRST;
  const idx = order.indexOf(type);
  return idx === -1 ? order.length : idx;
}

function sortRanked(results: RankedResult[], mode: SearchMode | undefined): RankedResult[] {
  return results.sort(
    (a, b) =>
      b.score - a.score ||
      typeRank(a.item.type, mode) - typeRank(b.item.type, mode) ||
      a.item.order - b.item.order ||
      (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0)
  );
}

export function unifiedSearch(rawQuery: string, options: SearchOptions = {}): RankedResult[] {
  const { mode, types, difficulties, limit = 50 } = options;
  const query = rawQuery.trim();
  if (!query) return [];
  const tokens = contentTokens(query);
  if (tokens.length === 0) return [];

  const pool = getSearchIndex().filter((item) => {
    if (types && types.length > 0 && !types.includes(item.type)) return false;
    if (difficulties && difficulties.length > 0) {
      if (!item.difficulty || !difficulties.includes(item.difficulty)) return false;
    }
    return true;
  });

  const scoreItem = (item: SearchIndexItem): number =>
    tokens.reduce((sum, t) => sum + tokenScore(item, t), 0) +
    modeBonus(item, mode) +
    exactQueryBonus(item, query);

  // Strict AND first…
  let matched = pool.filter((item) => matchesAllTokens(item, tokens));
  let partial = false;
  // …deterministic OR fallback when nothing satisfies every token
  // (e.g. "checkout vs switch" names two tools at once).
  if (matched.length === 0) {
    partial = true;
    matched = pool.filter((item) => tokens.some((t) => tokenScore(item, t) > 0));
  }

  return sortRanked(
    matched.map((item) => ({ item, score: scoreItem(item), partial })),
    mode
  ).slice(0, limit);
}

/* ---------------- suggestions & popular (real destinations only) ---------------- */

export interface QuerySuggestion {
  query: string;
  label: string;
}

/** Curated starter queries — every one resolves to real results (covered by tests). */
export const SUGGESTED_QUERIES: QuerySuggestion[] = [
  { query: 'git add', label: 'git add' },
  { query: 'git commit', label: 'git commit' },
  { query: 'git reset', label: 'git reset' },
  { query: 'merge conflict', label: 'merge conflict' },
  { query: 'detached HEAD', label: 'detached HEAD' },
  { query: 'origin vs upstream', label: 'origin vs upstream' },
  { query: 'git rebase', label: 'git rebase' },
  { query: 'recover deleted commit', label: 'recover deleted commit' },
  { query: 'GitHub pull request', label: 'GitHub pull request' },
];

export interface PopularTopic {
  label: string;
  labelBn: string;
  route: string;
}

export const POPULAR_TOPICS: PopularTopic[] = [
  { label: 'Git basics', labelBn: 'গিট বেসিক', route: '/learn/paths/git-beginner' },
  { label: 'Branching', labelBn: 'ব্রাঞ্চিং', route: '/learn/git/branching' },
  { label: 'Merge vs rebase', labelBn: 'মার্জ বনাম রিবেস', route: '/interview/git/branching' },
  { label: 'Undo & recovery', labelBn: 'আনডু ও রিকভারি', route: '/troubleshooting' },
  { label: 'Remote repositories', labelBn: 'রিমোট রিপোজিটরি', route: '/learn/git/remote-and-github' },
  { label: 'GitHub workflow', labelBn: 'গিটহাব প্রবাহ', route: '/workflows/github-pr' },
  { label: 'Git internals', labelBn: 'গিট ইন্টারনালস', route: '/git/internals' },
];

/* ---------------- did-you-mean (deterministic, local) ---------------- */

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= n; j++) {
      const next = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = prev[j];
      prev[j] = next;
    }
  }
  return prev[n];
}

/**
 * Closest correction per unknown token over command slugs/aliases/ids and
 * common keywords. Edit distance ≤ 2 only — conservative by design.
 * Returns the corrected full query, or undefined when nothing is close.
 */
export function didYouMean(rawQuery: string): string | undefined {
  const tokens = contentTokens(rawQuery);
  if (tokens.length === 0) return undefined;
  const index = getSearchIndex();
  const vocabulary = new Set<string>();
  for (const item of index) {
    for (const term of [...item.techTerms, ...item.aliases, ...item.keywords, ...item.tags]) {
      for (const word of lower(term).split(/[^a-z0-9+#-]+/).filter((w) => w.length >= 3)) {
        vocabulary.add(word);
      }
    }
  }

  let changed = false;
  const corrected = tokens.map((t) => {
    // Exact vocabulary membership means "known" — substring overlap alone
    // (e.g. "rebas" ⊂ "rebase") must still offer the correction.
    if (vocabulary.has(t)) return t;
    let bestWord: string | undefined;
    let bestDist = 3;
    for (const word of vocabulary) {
      if (Math.abs(word.length - t.length) > 2) continue;
      const d = levenshtein(t, word);
      if (d < bestDist || (d === bestDist && bestWord !== undefined && word < bestWord)) {
        bestDist = d;
        bestWord = word;
      }
    }
    if (bestWord && bestDist <= 2) {
      changed = true;
      return bestWord;
    }
    return t;
  });
  return changed ? corrected.join(' ') : undefined;
}

/* ---------------- related results ---------------- */

/**
 * Up to `limit` companions for a result: different types preferred,
 * sharing category/topic/tag/keyword tokens. Pure overlap count —
 * deterministic and explainable.
 */
export function relatedResults(item: SearchIndexItem, limit = 3): SearchIndexItem[] {
  const index = getSearchIndex();
  const signals = new Set(
    [item.category, item.topic?.en, ...item.tags, ...item.keywords]
      .filter((s): s is string => typeof s === 'string')
      .flatMap((s) => lower(s).split(/[^a-z0-9+#-]+/))
      .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
  );
  if (signals.size === 0) return [];
  const scored = index
    .filter((other) => other.id !== item.id)
    .map((other) => {
      const hay = new Set(
        [other.category, other.topic?.en, ...other.tags, ...other.keywords, other.title.en]
          .filter((s): s is string => typeof s === 'string')
          .flatMap((s) => lower(s).split(/[^a-z0-9+#-]+/))
      );
      let overlap = 0;
      for (const w of signals) if (hay.has(w)) overlap++;
      return { other, overlap };
    })
    .filter((s) => s.overlap > 0)
    .sort(
      (a, b) =>
        Number(b.other.type !== item.type) - Number(a.other.type !== item.type) ||
        b.overlap - a.overlap ||
        a.other.order - b.other.order
    );
  return scored.slice(0, limit).map((s) => s.other);
}
