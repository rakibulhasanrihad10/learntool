import React, { useState, useMemo, useEffect } from 'react';
import { setPageMeta } from '@/utils/pageMeta';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/layouts/PageContainer/PageContainer';
import { CommandCard } from '@/components/data-display/CommandCard/CommandCard';
import { Badge } from '@/components/common/Badge/Badge';
import { Chip } from '@/components/common/Chip/Chip';
import { EmptyState } from '@/components/common/EmptyState/EmptyState';
import { BookOpen, Terminal, Search, Sparkles, Star, SearchX } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { GIT_COMMANDS } from '@/content/git';
import { searchAndFilter } from '@/utils/commandSearch';
import { DifficultyLevel } from '@/types/content';

type DifficultyFilter = DifficultyLevel | 'All';

export const CommandsPage: React.FC = () => {
  const { language, t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('All');
  const [frequentlyUsedOnly, setFrequentlyUsedOnly] = useState<boolean>(false);
  const [filterQuery, setFilterQuery] = useState<string>('');

  const isBn = language === 'bn';

  useEffect(() => {
    setPageMeta({ title: t.pages.commands.title, description: t.pages.commands.subtitle });
  }, [t.pages.commands.title, t.pages.commands.subtitle]);

  const categories = ['All', 'setup', 'daily', 'inspection', 'branching', 'remote', 'recovery', 'advanced'];
  const difficulties: DifficultyFilter[] = ['All', 'beginner', 'intermediate', 'advanced'];

  const categoryLabelsBn: Record<string, string> = {
    All: 'সবগুলো',
    setup: 'সেটআপ',
    daily: 'দৈনন্দিন',
    inspection: 'নিরীক্ষণ',
    branching: 'ব্রাঞ্চিং',
    remote: 'রিমোট',
    recovery: 'রিকভারি',
    advanced: 'অ্যাডভান্সড',
  };

  const difficultyLabelsBn: Record<DifficultyFilter, string> = {
    All: 'সব লেভেল',
    beginner: 'প্রাথমিক',
    intermediate: 'মধ্যবর্তী',
    advanced: 'উন্নত',
  };

  const hasActiveFilters =
    selectedCategory !== 'All' || selectedDifficulty !== 'All' || frequentlyUsedOnly || filterQuery.trim() !== '';

  const clearAll = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setFrequentlyUsedOnly(false);
    setFilterQuery('');
  };

  const filtered = useMemo(() => {
    return searchAndFilter(GIT_COMMANDS, filterQuery, {
      category: selectedCategory,
      difficulty: selectedDifficulty,
      frequentlyUsed: frequentlyUsedOnly ? true : undefined,
    });
  }, [selectedCategory, selectedDifficulty, frequentlyUsedOnly, filterQuery]);

  return (
    <PageContainer maxWidth="lg" className="animate-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <Badge variant="secondary" size="md">
              <Terminal size={14} />
              <span>{t.pages.commands.badge}</span>
            </Badge>
            <Badge variant="primary" size="sm">
              <BookOpen size={12} />
              <span>{t.pages.commands.referenceMode}</span>
            </Badge>
            <Badge variant="primary" size="sm">
              <Sparkles size={12} />
              <span>{GIT_COMMANDS.length} {isBn ? 'টি কমান্ড' : 'Commands'}</span>
            </Badge>
          </div>
          <h1 className="headline-lg">{t.pages.commands.title}</h1>
          <p className="body-lg" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
            {t.pages.commands.subtitle}
          </p>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Quick Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            backgroundColor: 'var(--md-sys-color-surface-container-low)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--md-sys-color-outline-variant)',
            maxWidth: '480px',
            width: '100%',
          }}>
            <Search size={16} color="var(--md-sys-color-on-surface-variant)" />
            <input
              type="text"
              aria-label="Filter command syntax or description"
              placeholder={isBn ? 'কমান্ডের নাম, অপশন বা বিবরণ খুঁজুন...' : 'Filter command syntax or description...'}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: 'var(--md-sys-color-on-surface)',
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
            {filterQuery && (
              <button
                onClick={() => setFilterQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--md-sys-color-on-surface-variant)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {isBn && categoryLabelsBn[cat] ? categoryLabelsBn[cat] : cat}
              </Chip>
            ))}
          </div>

          {/* Difficulty + Frequently-used row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
            {difficulties.map((level) => (
              <Chip
                key={level}
                selected={selectedDifficulty === level}
                onClick={() => setSelectedDifficulty(level)}
              >
                {level === 'All'
                  ? t.pages.commands.allLevels
                  : isBn
                    ? difficultyLabelsBn[level]
                    : level}
              </Chip>
            ))}
            <Chip
              selected={frequentlyUsedOnly}
              onClick={() => setFrequentlyUsedOnly((prev) => !prev)}
              icon={<Star size={13} />}
            >
              {t.pages.commands.frequentlyUsedFilter}
            </Chip>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--md-sys-color-primary)',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                {t.pages.commands.clearFilters}
              </button>
            )}
          </div>
        </div>

        {/* Filter Count Feedback */}
        <div style={{ fontSize: '0.8125rem', color: 'var(--md-sys-color-on-surface-variant)' }}>
          {isBn
            ? `${filtered.length} টি কমান্ড প্রদর্শিত হচ্ছে`
            : `Showing ${filtered.length} of ${GIT_COMMANDS.length} commands`}
        </div>

        {/* Commands Grid */}
        {filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            {filtered.map((item) => {
              const explanation = isBn && item.whatItDoesBn ? item.whatItDoesBn : item.whatItDoes;
              const contextText = isBn && item.whenToUseBn ? item.whenToUseBn : item.whenToUse;
              const firstExample = item.examples && item.examples.length > 0 ? item.examples[0].command : undefined;
              const firstOutput = item.examples && item.examples.length > 0 ? item.examples[0].output : undefined;

              return (
                <Link
                  key={item.id}
                  to={`/commands/git/${item.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  aria-label={`${item.command} — full reference`}
                >
                  <CommandCard
                    command={item.command}
                    explanation={explanation}
                    syntax={item.syntax}
                    category={item.category}
                    difficulty={item.difficulty}
                    context={contextText}
                    example={firstExample}
                    output={firstOutput}
                    tags={item.tags}
                  />
                </Link>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <EmptyState
            icon={<SearchX size={36} />}
            title={t.pages.commands.noResults}
            description={t.pages.commands.noResultsHint}
            action={
              <button
                type="button"
                onClick={clearAll}
                style={{
                  background: 'var(--md-sys-color-primary)',
                  color: 'var(--md-sys-color-on-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: 'var(--space-2) var(--space-5)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {t.pages.commands.clearFilters}
              </button>
            }
          />
        )}
      </div>
    </PageContainer>
  );
};
