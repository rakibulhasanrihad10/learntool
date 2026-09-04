import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Chip } from '@/components/common/Chip/Chip';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { DecisionHelper } from '@/components/troubleshooting/DecisionHelper/DecisionHelper';
import { Wrench, Search, SearchX, ShieldCheck, ArrowRight, LifeBuoy } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { TROUBLESHOOTING_CATEGORIES, TROUBLESHOOTING_GUIDES, DECISION_TREES } from '@/content/git';
import { searchAndFilterScenarios } from '@/utils/troubleshootingSearch';
import { DifficultyLevel, TroubleshootingCategoryId, TroubleshootingSeverity } from '@/types/content';

type CategoryFilter = TroubleshootingCategoryId | 'All';
type DifficultyFilter = DifficultyLevel | 'All';

const SEVERITY_VARIANT: Record<TroubleshootingSeverity, 'secondary' | 'warning' | 'error'> = {
  low: 'secondary',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

export const TroubleshootingPage: React.FC = () => {
  const { language, t } = useTranslation();
  const isBn = language === 'bn';
  const ts = t.pages.troubleshooting;

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All');
  const [beginnerSafeOnly, setBeginnerSafeOnly] = useState(false);

  useEffect(() => {
    document.title = `${ts.title} | GitVerse`;
  }, [ts.title]);

  const hasActiveFilters =
    category !== 'All' || difficulty !== 'All' || beginnerSafeOnly || query.trim() !== '';

  const clearAll = () => {
    setCategory('All');
    setDifficulty('All');
    setBeginnerSafeOnly(false);
    setQuery('');
  };

  const filtered = useMemo(
    () =>
      searchAndFilterScenarios(TROUBLESHOOTING_GUIDES, query, {
        category,
        difficulty,
        beginnerSafe: beginnerSafeOnly ? true : undefined,
      }),
    [query, category, difficulty, beginnerSafeOnly]
  );

  const popular = useMemo(
    () => TROUBLESHOOTING_GUIDES.filter((g) => g.popular),
    []
  );

  const getScenarioTitle = (slug: string) => {
    const g = TROUBLESHOOTING_GUIDES.find((x) => x.slug === slug);
    return g ? (isBn ? g.title.bn : g.title.en) : undefined;
  };

  const severityLabel = (s: TroubleshootingSeverity) =>
    s === 'low' ? ts.severityLow : s === 'medium' ? ts.severityMedium : s === 'high' ? ts.severityHigh : ts.severityCritical;

  const difficultyLabel = (d: DifficultyLevel) =>
    d === 'beginner' ? t.common.badges.beginner : d === 'intermediate' ? t.common.badges.intermediate : t.common.badges.advanced;

  const categoryLabel = (id: TroubleshootingCategoryId) => {
    const c = TROUBLESHOOTING_CATEGORIES.find((x) => x.id === id);
    return c ? (isBn ? c.title.bn : c.title.en) : id;
  };

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Badge variant="error" size="md">
              <Wrench size={14} />
              <span>{ts.badge}</span>
            </Badge>
            <Badge variant="primary" size="sm">
              <LifeBuoy size={12} />
              <span>{TROUBLESHOOTING_GUIDES.length} {isBn ? 'টি গাইড' : 'Guides'}</span>
            </Badge>
          </div>
          <h1 className="headline-lg">{ts.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {ts.subtitle}
          </p>
        </div>

        {/* Popular problems */}
        <section aria-label={ts.popularTitle}>
          <h2 className="title-md" style={{ margin: '0 0 var(--space-1)' }}>{ts.popularTitle}</h2>
          <p className="body-sm" style={{ margin: '0 0 var(--space-3)', color: 'var(--md-sys-color-on-surface-variant)' }}>
            {ts.popularSubtitle}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-3)',
          }}>
            {popular.map((g) => (
              <Link
                key={g.id}
                to={`/troubleshooting/git/${g.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                aria-label={`${isBn ? g.title.bn : g.title.en} — ${ts.viewSolution}`}
              >
                <Card variant="filled" padding="md" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <Badge variant={SEVERITY_VARIANT[g.severity]} size="sm">{severityLabel(g.severity)}</Badge>
                  <span className="title-sm" style={{ color: 'var(--md-sys-color-on-surface)' }}>
                    {isBn ? g.title.bn : g.title.en}
                  </span>
                  <span className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {isBn ? g.shortDescription.bn : g.shortDescription.en}
                  </span>
                  <span className="label-sm" style={{ color: 'var(--md-sys-color-primary)', fontWeight: 700, marginTop: 'auto' }}>
                    {ts.viewSolution} →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Decision helpers */}
        <section aria-label={ts.helperTitle}>
          <h2 className="title-md" style={{ margin: '0 0 var(--space-1)' }}>{ts.helperTitle}</h2>
          <p className="body-sm" style={{ margin: '0 0 var(--space-3)', color: 'var(--md-sys-color-on-surface-variant)' }}>
            {ts.helperSubtitle}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            {DECISION_TREES.map((tree) => (
              <DecisionHelper key={tree.id} tree={tree} getScenarioTitle={getScenarioTitle} />
            ))}
          </div>
        </section>

        {/* Search + filters */}
        <section aria-label={ts.allScenarios} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2 className="title-md" style={{ margin: 0 }}>{ts.allScenarios}</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            backgroundColor: 'var(--md-sys-color-surface-container-low)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            maxWidth: '560px',
            width: '100%',
          }}>
            <Search size={16} color="var(--md-sys-color-on-surface-variant)" />
            <input
              type="search"
              aria-label={ts.searchPlaceholder}
              placeholder={ts.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--md-sys-color-on-surface)',
                width: '100%',
                fontSize: '0.875rem',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--md-sys-color-on-surface-variant)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }} role="group" aria-label={ts.allCategories}>
            <Chip selected={category === 'All'} onClick={() => setCategory('All')}>{ts.allCategories}</Chip>
            {TROUBLESHOOTING_CATEGORIES.map((c) => (
              <Chip key={c.id} selected={category === c.id} onClick={() => setCategory(c.id)}>
                {isBn ? c.title.bn : c.title.en}
              </Chip>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
            {(['All', 'beginner', 'intermediate', 'advanced'] as DifficultyFilter[]).map((level) => (
              <Chip key={level} selected={difficulty === level} onClick={() => setDifficulty(level)}>
                {level === 'All' ? ts.allLevels : difficultyLabel(level)}
              </Chip>
            ))}
            <Chip
              selected={beginnerSafeOnly}
              onClick={() => setBeginnerSafeOnly((v) => !v)}
              icon={<ShieldCheck size={13} />}
            >
              {ts.beginnerSafeOnly}
            </Chip>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                style={{ background: 'none', border: 'none', color: 'var(--md-sys-color-primary)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}
              >
                {ts.clearFilters}
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }} aria-live="polite">
            {isBn
              ? `${filtered.length}টি গাইড দেখানো হচ্ছে`
              : `Showing ${filtered.length} of ${TROUBLESHOOTING_GUIDES.length} guides`}
          </div>
        </section>

        {/* Scenario grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            {filtered.map((g) => (
              <Card key={g.id} variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <Badge variant={SEVERITY_VARIANT[g.severity]} size="sm">{severityLabel(g.severity)}</Badge>
                  <Badge variant="secondary" size="sm">{difficultyLabel(g.difficulty)}</Badge>
                  {g.safeForBeginners && (
                    <Badge variant="primary" size="sm">
                      <ShieldCheck size={11} />
                      <span>{ts.safeBadge}</span>
                    </Badge>
                  )}
                </div>
                <span className="label-sm" style={{ color: 'var(--md-sys-color-primary)' }}>
                  {categoryLabel(g.category)}
                </span>
                <h3 className="title-md" style={{ margin: 0, color: 'var(--md-sys-color-on-surface)' }}>
                  {isBn ? g.title.bn : g.title.en}
                </h3>
                <p className="body-sm" style={{ margin: 0, color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {isBn ? g.shortDescription.bn : g.shortDescription.en}
                </p>
                <Link
                  to={`/troubleshooting/git/${g.slug}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: 'auto', paddingTop: 'var(--space-2)', color: 'var(--md-sys-color-primary)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}
                  aria-label={`${isBn ? g.title.bn : g.title.en} — ${ts.viewSolution}`}
                >
                  {ts.viewSolution}
                  <ArrowRight size={14} />
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<SearchX size={36} />}
            title={ts.noResults}
            description={ts.noResultsHint}
            action={
              <button
                type="button"
                onClick={clearAll}
                style={{ background: 'var(--md-sys-color-primary)', color: 'var(--md-sys-color-on-primary)', border: 'none', borderRadius: 'var(--radius-full)', padding: 'var(--space-2) var(--space-5)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
              >
                {ts.clearFilters}
              </button>
            }
          />
        )}
      </div>
    </PageContainer>
  );
};
