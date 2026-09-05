# Knowledge Discovery — Unified Search (Phase 14)

> One deterministic, local-first search across the whole GitVerse
> knowledge base. No backend, no AI, no tracking.

## Architecture

```
src/features/search/
  searchTypes.ts    SearchResultType (10) · SearchMode · SearchIndexItem (metadata only) · RankedResult
  searchIndex.ts    buildSearchIndex() — ~290 metadata items from existing catalogs, cached per session
  searchAliases.ts  QUERY_EXPANSIONS (undo→reset/revert/…), STOPWORDS
  searchEngine.ts   unifiedSearch() · didYouMean() · relatedResults() · suggestions/popular
  searchHistory.ts  localStorage recents (max 8) via existing `storage` util
  searchMode.ts     learning/reference preference (`gitverse_search_mode`)
  searchUrl.ts      /search?q=&type=&mode=&difficulty= parse/format
src/components/search/
  SearchModal/      global overlay — unified groups, history, suggestions, mode toggle, see-all
  SearchResultCard  compact card + accessible <mark> Highlight + related links
  SearchFilters     mode toggle + type/difficulty chips (pressed states, scrollable)
src/pages/Search/   /search — input, counts, filters, grouped results, no-results, related
```

The legacy per-type utilities (`utils/commandSearch`, `practiceSearch`,
`troubleshootingSearch`, `githubSearch`, interview/path search) still
power their catalog pages; the modal and `/search` now rank through the
unified engine instead of running seven independent searches.

## Searchable content

Commands (27) · lessons (~96 via `ALL_MODULES`) · workflows (git + GitHub)
· troubleshooting (20) · practice (30) · interview (80) · internals
entries · GitHub concept entries · learning paths (3) · cheatsheets (2).
Index items carry titles, descriptions, routes, categories, tags,
keywords, aliases, exact tech terms, difficulty, and catalog order —
never full content.

## Ranking (deterministic)

Pipeline: tokenize → drop stopwords → expand concepts → filter →
score → stable sort. AND over content tokens; a deterministic OR
fallback (flagged `partial`) fires only when AND finds nothing
(e.g. “checkout vs switch” names two tools).

Per-token tiers: exact tech term 40 · title 30 · keyword 20 · alias 18 ·
topic/category 12 · description 8 · tag 6. Query bonuses (max wins):
exact title 100 · exact command 80 on the reference itself (40 on content
merely about it) · punctuation-insensitive syntax containment 70/35 with
the same reference weighting (“reset hard” ⊂ `git reset --hard`) ·
full-query title phrase 50. Mode bias +10 for preferred types.
Tie-break: score → mode type rank → catalog order → id.

Learning Mode prefers lessons/paths/workflows/practice/interview/GitHub;
Reference Mode prefers commands/cheatsheets/troubleshooting/internals.
Same index, different bias — no separate engines.

## Behavior notes

- Suggestions (`git add`, `merge conflict`, …) and popular topics link
  only to real routes; every suggestion is covered by tests.
- `didYouMean` uses Levenshtein ≤ 2 over index vocabulary — conservative,
  deterministic, local.
- Related results share category/tag/keyword overlap, preferring
  different types so `git reset` shows lessons, cookbook, labs, interview.
- Highlighting wraps matches in `<mark>`; command text is never altered.
- History stores bare query strings only (max 8, dedupe, clearable).
