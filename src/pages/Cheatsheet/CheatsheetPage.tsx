import React, { useEffect, useMemo, useState } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Button } from '@/components/common/Button/Button';
import { Chip } from '@/components/common/Chip/Chip';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { FileText, Printer, ArrowRight, Search, Zap } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { QUICK_ACTIONS as CHEAT_QUICK_ACTIONS } from '@/content/cheatsheet/cheatSheet';
import { COMMAND_COMPARISONS, UNDO_SITUATIONS, WORKFLOW_RECIPES } from '@/content/cheatsheet/cheatSheetExtras';
import { filterSections, resolveSections } from '@/features/cheatsheet/cheatsheet';
import { CheatEntryCard } from '@/components/cheatsheet/CheatEntryCard';
import { ComparisonCard, GitHubFlow, RecipeCard, UndoCard } from '@/components/cheatsheet/CheatCollections';

export const CheatsheetPage: React.FC = () => {
  const { t, language } = useTranslation();

  useEffect(() => {
    setPageMeta({ title: t.pages.cheatsheet.title, description: t.pages.cheatsheet.subtitle });
  }, [t.pages.cheatsheet.title, t.pages.cheatsheet.subtitle]);
  const isBn = language === 'bn';
  const p = t.pages.cheatsheet;
  const [query, setQuery] = useState('');
  const [section, setSection] = useState<string>('all');

  const resolved = useMemo(() => resolveSections(), []);
  const visible = useMemo(() => {
    const filtered = filterSections(query, resolved);
    return section === 'all' ? filtered : filtered.filter((s) => s.section.id === section);
  }, [query, section, resolved]);

  const anchor = (id: string) => `cheat-${id}`;

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Badge variant="primary" size="md">
                <FileText size={14} />
                <span>{p.badge}</span>
              </Badge>
            </div>
            <h1 className="headline-lg" style={{ margin: 0 }}>{p.title}</h1>
            <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
              {p.subtitle}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Link to="/cheatsheet/git" style={{ textDecoration: 'none' }}>
              <Button variant="tonal" size="md" iconRight={<ArrowRight size={16} />}>
                {p.git.title}
              </Button>
            </Link>
            <Button variant="outlined" size="md" iconLeft={<Printer size={16} />} onClick={() => window.print()}>
              {p.git.print}
            </Button>
          </div>
        </div>

        {/* What do you want to do? */}
        <section aria-label={p.quickActionsTitle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h2 className="title-md" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Zap size={18} aria-hidden="true" />
              {p.quickActionsTitle}
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {CHEAT_QUICK_ACTIONS.map((action) => (
                <Link key={action.id} to={action.route} style={{ textDecoration: 'none' }}>
                  <Chip>
                    {isBn ? action.intent.bn : action.intent.en} · <code>{action.command}</code>
                  </Chip>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Search + section filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div className="search-modal__input-wrapper" style={{ border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 'var(--radius-lg)' }}>
            <Search size={18} className="search-modal__icon" aria-hidden="true" />
            <input
              type="text"
              className="search-modal__input"
              placeholder={p.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={p.searchPlaceholder}
              autoComplete="off"
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-1)' }} role="group" aria-label={p.sectionNavLabel}>
            <Chip role="radio" aria-checked={section === 'all'} selected={section === 'all'} onClick={() => setSection('all')}>
              {p.allSections}
            </Chip>
            {resolved.map(({ section: s }) => (
              <Chip
                key={s.id}
                role="radio"
                aria-checked={section === s.id}
                selected={section === s.id}
                onClick={() => setSection(s.id)}
              >
                {isBn ? s.title.bn : s.title.en}
              </Chip>
            ))}
          </div>
        </div>

        {/* Section jump nav */}
        {visible.length > 1 && (
          <nav aria-label={p.sectionNavLabel} style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-1)' }}>
            {visible.map(({ section: s }) => (
              <a
                key={s.id}
                href={`#${anchor(s.id)}`}
                className="body-sm"
                style={{ whiteSpace: 'nowrap', color: 'var(--md-sys-color-primary)', fontWeight: 600 }}
              >
                {isBn ? s.title.bn : s.title.en}
              </a>
            ))}
          </nav>
        )}

        {/* Sections */}
        {visible.length === 0 ? (
          <EmptyState
            title={p.noMatches}
            description={p.noMatchesHint}
            action={
              <Link to={`/search?q=${encodeURIComponent(query)}`} style={{ textDecoration: 'none' }}>
                <Button variant="filled" size="sm">{p.searchAllGitVerse}</Button>
              </Link>
            }
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-5)' }}>
            {visible.map(({ section: s, entries }) => (
              <Card
                key={s.id}
                id={anchor(s.id)}
                variant="filled"
                padding="lg"
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', scrollMarginTop: '80px' }}
              >
                <div>
                  <h2 className="title-md" style={{ margin: 0, paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
                    {isBn ? s.title.bn : s.title.en}
                  </h2>
                  <p className="body-sm" style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 'var(--space-2) 0 0' }}>
                    {isBn ? s.description.bn : s.description.en}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {entries.map((entry) => (
                    <CheatEntryCard key={entry.key} entry={entry} />
                  ))}
                </div>
                <Link
                  to={s.learnRoute}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--md-sys-color-primary)', textDecoration: 'none' }}
                >
                  {isBn ? s.learnLabel.bn : s.learnLabel.en}
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Workflow recipes */}
        <section aria-label={p.recipesTitle} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2 className="title-lg" style={{ margin: 0 }}>{p.recipesTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {WORKFLOW_RECIPES.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* Comparisons */}
        <section aria-label={p.comparisonsTitle} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2 className="title-lg" style={{ margin: 0 }}>{p.comparisonsTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {COMMAND_COMPARISONS.map((comparison) => (
              <ComparisonCard key={comparison.id} comparison={comparison} />
            ))}
          </div>
        </section>

        {/* Undo quick reference */}
        <section aria-label={p.undoTitle} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2 className="title-lg" style={{ margin: 0 }}>{p.undoTitle}</h2>
          <Card variant="filled" padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {UNDO_SITUATIONS.map((situation) => (
              <UndoCard key={situation.id} situation={situation} />
            ))}
          </Card>
        </section>

        {/* GitHub flow */}
        <section aria-label={p.githubTitle} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <h2 className="title-lg" style={{ margin: 0 }}>{p.githubTitle}</h2>
          <GitHubFlow />
        </section>
      </div>
    </PageContainer>
  );
};
