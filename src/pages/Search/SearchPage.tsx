import React, { useEffect, useMemo, useState } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, BookOpen, FlaskConical, MessagesSquare } from 'lucide-react';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Breadcrumb } from '@/components/navigation/Breadcrumb/Breadcrumb';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { useTranslation } from '@/i18n/context';
import { contentTokens, didYouMean, relatedResults, unifiedSearch } from '@/features/search/searchEngine';
import { useSearchHistory } from '@/features/search/searchHistory';
import { SEARCH_RESULT_TYPES, SearchResultType } from '@/features/search/searchTypes';
import { formatSearchParams, parseSearchParams } from '@/features/search/searchUrl';
import { Highlight, SearchResultCard, typeLabel } from '@/components/search/SearchResultCard';
import { SearchFilters } from '@/components/search/SearchFilters';
import { DifficultyLevel } from '@/types/content';

const PAGE_LIMIT = 100;

export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const p = t.pages.search;
  const [params, setParams] = useSearchParams();
  const initial = useMemo(() => parseSearchParams(params), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [input, setInput] = useState(initial.q);
  const [type, setType] = useState<SearchResultType | 'all'>(initial.type);
  const [mode, setMode] = useState(initial.mode);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>(initial.difficulty);
  const { record } = useSearchHistory();

  // Keep the URL in sync (replace: typing never spams history).
  useEffect(() => {
    setParams(formatSearchParams({ q: input, type, mode, difficulty }), { replace: true });
  }, [input, type, mode, difficulty, setParams]);

  useEffect(() => {
    setPageMeta({ title: p.title, description: p.subtitle });
    window.scrollTo(0, 0);
  }, [p.title, p.subtitle]);

  const query = input.trim();
  const tokens = useMemo(() => contentTokens(query), [query]);

  const results = useMemo(
    () =>
      query
        ? unifiedSearch(query, {
            mode,
            types: type === 'all' ? undefined : [type],
            difficulties: difficulty === 'all' ? undefined : [difficulty],
            limit: PAGE_LIMIT,
          })
        : [],
    [query, mode, type, difficulty]
  );

  const suggestion = useMemo(
    () => (query && results.length === 0 ? didYouMean(query) : undefined),
    [query, results.length]
  );

  const grouped = useMemo(() => {
    const order = type === 'all' ? SEARCH_RESULT_TYPES : [type];
    return order
      .map((t) => ({ type: t, list: results.filter((r) => r.item.type === t) }))
      .filter((g) => g.list.length > 0);
  }, [results, type]);

  const counts = useMemo(() => {
    const map: Partial<Record<SearchResultType, number>> = {};
    for (const r of results) map[r.item.type] = (map[r.item.type] ?? 0) + 1;
    return map;
  }, [results]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) record(query);
  };

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Breadcrumb items={[{ label: t.nav.home, path: '/' }, { label: p.title, isCurrent: true }]} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Badge variant="primary" size="md">
              <Search size={14} />
              <span>{p.badge}</span>
            </Badge>
          </div>
          <h1 className="headline-lg" style={{ margin: 0 }}>{p.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>{p.subtitle}</p>
        </div>

        <form onSubmit={submit} role="search" aria-label={p.title}>
          <div className="search-modal__input-wrapper" style={{ border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 'var(--radius-lg)' }}>
            <Search size={18} className="search-modal__icon" aria-hidden="true" />
            <input
              type="text"
              className="search-modal__input"
              placeholder={p.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label={p.placeholder}
              autoComplete="off"
            />
          </div>
        </form>

        <SearchFilters
          mode={mode}
          onModeChange={setMode}
          activeType={type}
          onTypeChange={setType}
          activeDifficulty={difficulty}
          onDifficultyChange={setDifficulty}
          counts={query ? counts : undefined}
        />

        {!query && (
          <EmptyState
            title={p.emptyTitle}
            description={p.emptyBody}
          />
        )}

        {query && (
          <div role="status" aria-live="polite" className="body-md">
            {results.length > 0 ? (
              <span>
                {p.resultsFor} “<Highlight text={query} tokens={[]} />” — <strong>{results.length}</strong> {p.resultsCount}
              </span>
            ) : (
              <span>{p.noResultsFor} “{query}”</span>
            )}
          </div>
        )}

        {query && results.length === 0 && (
          <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
            <strong className="title-md">{p.noResultsTitle}</strong>
            {suggestion && (
              <p className="body-md" style={{ margin: 0 }}>
                {p.didYouMeanLabel}{' '}
                <Button variant="text" size="sm" onClick={() => { setInput(suggestion); record(suggestion); }}>
                  <code>{suggestion}</code>
                </Button>
              </p>
            )}
            <ul className="body-md" style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
              <li>{p.tipSpelling}</li>
              <li>{p.tipFewerWords}</li>
              <li>{p.tipCommand}</li>
            </ul>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Link to="/learn/git/fundamentals" style={{ textDecoration: 'none' }}>
                <Button variant="tonal" size="sm" iconLeft={<BookOpen size={14} />}>{p.browseFundamentals}</Button>
              </Link>
              <Link to="/troubleshooting" style={{ textDecoration: 'none' }}>
                <Button variant="tonal" size="sm">{p.browseTroubleshooting}</Button>
              </Link>
              <Link to="/commands" style={{ textDecoration: 'none' }}>
                <Button variant="tonal" size="sm">{p.browseCommands}</Button>
              </Link>
            </div>
          </Card>
        )}

        {grouped.map(({ type: groupType, list }) => (
          <section key={groupType} aria-label={typeLabel(groupType, t)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {type === 'all' && (
                <h2 className="title-md" style={{ margin: 0 }}>
                  {typeLabel(groupType, t)} ({list.length})
                </h2>
              )}
              {list.slice(0, 20).map((r) => (
                <SearchResultCard
                  key={r.item.id}
                  item={r.item}
                  tokens={tokens}
                  related={relatedResults(r.item, 3)}
                  onNavigate={() => record(query)}
                />
              ))}
            </div>
          </section>
        ))}

        {query && results.length > 0 && (
          <Card variant="outlined" padding="md" style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{p.keepExploring}</span>
            <Link to="/learn/paths" style={{ textDecoration: 'none' }}><Button variant="text" size="sm" iconLeft={<BookOpen size={14} />}>{t.nav.paths}</Button></Link>
            <Link to="/practice" style={{ textDecoration: 'none' }}><Button variant="text" size="sm" iconLeft={<FlaskConical size={14} />}>{t.nav.practice}</Button></Link>
            <Link to="/interview" style={{ textDecoration: 'none' }}><Button variant="text" size="sm" iconLeft={<MessagesSquare size={14} />}>{t.nav.interview}</Button></Link>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};
