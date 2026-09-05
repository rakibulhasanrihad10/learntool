import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from '@/components/feedback/Modal/Modal';
import { Chip } from '@/components/common/Chip/Chip';
import {
  Search, BookOpen, Terminal, ArrowRight, History, Trash2, Sparkles, ListOrdered,
} from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { useNavigate } from 'react-router-dom';
import { POPULAR_TOPICS, SUGGESTED_QUERIES, unifiedSearch } from '@/features/search/searchEngine';
import { useSearchHistory } from '@/features/search/searchHistory';
import { useSearchMode } from '@/features/search/searchMode';
import { SEARCH_RESULT_TYPES } from '@/features/search/searchTypes';
import { TYPE_ICONS, typeLabel } from '@/components/search/SearchResultCard';
import './SearchModal.css';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GROUP_LIMIT = 3;
const TOTAL_LIMIT = 12;

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mode, setMode } = useSearchMode();
  const { history, record, clear } = useSearchHistory();

  const results = useMemo(
    () => (query.trim() ? unifiedSearch(query, { mode, limit: TOTAL_LIMIT }) : []),
    [query, mode]
  );

  // Grouped for display, order preserved from ranking.
  const groups = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const r of results) {
      const list = map.get(r.item.type) ?? [];
      if (list.length < GROUP_LIMIT) list.push(r);
      map.set(r.item.type, list);
    }
    return [...map.entries()];
  }, [results]);

  const flatResults = useMemo(() => groups.flatMap(([, list]) => list), [groups]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      // Focus the input on open (autoFocus is unreliable inside portals).
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, mode]);

  const handleSelect = (path: string) => {
    if (query.trim()) record(query);
    onClose();
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      const target = flatResults[activeIndex];
      if (target) handleSelect(target.item.route);
      else if (query.trim()) {
        record(query);
        onClose();
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const hasQuery = query.trim().length > 0;
  const s = t.common.search;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" className="search-modal">
      <div className="search-modal__input-wrapper">
        <Search size={18} className="search-modal__icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-modal__input"
          placeholder={t.common.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={hasQuery}
          aria-controls="search-modal-results"
          aria-activedescendant={flatResults.length > 0 ? `search-result-${activeIndex}` : undefined}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-2)', padding: '0 var(--space-4)' }} role="group" aria-label={t.common.mode.activeMode}>
        <Chip role="radio" aria-checked={mode === 'learning'} selected={mode === 'learning'} onClick={() => setMode('learning')}>
          {s.modeLearning}
        </Chip>
        <Chip role="radio" aria-checked={mode === 'reference'} selected={mode === 'reference'} onClick={() => setMode('reference')}>
          {s.modeReference}
        </Chip>
      </div>

      {!hasQuery && (
        <div className="search-modal__section">
          {history.length > 0 && (
            <>
              <span className="label-sm search-modal__section-title">
                <History size={13} style={{ verticalAlign: '-2px' }} /> {s.historyTitle}
              </span>
              <div className="search-modal__list">
                {history.map((q) => (
                  <button key={q} type="button" className="search-modal__item" onClick={() => setQuery(q)}>
                    <div className="search-modal__item-left">
                      <div className="search-modal__item-icon"><History size={16} /></div>
                      <div><div className="search-modal__item-label body-md">{q}</div></div>
                    </div>
                  </button>
                ))}
                <button type="button" className="search-modal__item" onClick={clear} aria-label={s.clearHistory}>
                  <div className="search-modal__item-left">
                    <div className="search-modal__item-icon"><Trash2 size={16} /></div>
                    <div><div className="search-modal__item-label body-md">{s.clearHistory}</div></div>
                  </div>
                </button>
              </div>
            </>
          )}

          <span className="label-sm search-modal__section-title" style={{ marginTop: 'var(--space-2)' }}>
            <Sparkles size={13} style={{ verticalAlign: '-2px' }} /> {s.suggestionsTitle}
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', padding: '0 var(--space-4)' }}>
            {SUGGESTED_QUERIES.map((item) => (
              <Chip key={item.query} onClick={() => setQuery(item.query)}>
                <code>{item.label}</code>
              </Chip>
            ))}
          </div>

          <span className="label-sm search-modal__section-title" style={{ marginTop: 'var(--space-3)' }}>
            <ListOrdered size={13} style={{ verticalAlign: '-2px' }} /> {s.popularTitle}
          </span>
          <div className="search-modal__list">
            {POPULAR_TOPICS.slice(0, 4).map((topic) => (
              <button key={topic.route} type="button" className="search-modal__item" onClick={() => handleSelect(topic.route)}>
                <div className="search-modal__item-left">
                  <div className="search-modal__item-icon"><BookOpen size={16} /></div>
                  <div>
                    <div className="search-modal__item-label body-md">{language === 'bn' ? topic.labelBn : topic.label}</div>
                  </div>
                </div>
                <ArrowRight size={14} className="search-modal__item-arrow" />
              </button>
            ))}
          </div>

          <span className="label-sm search-modal__section-title" style={{ marginTop: 'var(--space-3)' }}>{s.quickNavLabel}</span>
          <div className="search-modal__list">
            <button type="button" className="search-modal__item" onClick={() => handleSelect('/commands')}>
              <div className="search-modal__item-left">
                <div className="search-modal__item-icon"><Terminal size={16} /></div>
                <div>
                  <div className="search-modal__item-label body-md">{s.viewAllCommands}</div>
                  <span className="search-modal__item-cat label-sm">{s.commandsGroup}</span>
                </div>
              </div>
              <ArrowRight size={14} className="search-modal__item-arrow" />
            </button>
            <button type="button" className="search-modal__item" onClick={() => handleSelect('/learn/paths')}>
              <div className="search-modal__item-left">
                <div className="search-modal__item-icon"><BookOpen size={16} /></div>
                <div>
                  <div className="search-modal__item-label body-md">{t.nav.paths}</div>
                  <span className="search-modal__item-cat label-sm">{t.pages.paths.subtitle}</span>
                </div>
              </div>
              <ArrowRight size={14} className="search-modal__item-arrow" />
            </button>
          </div>
        </div>
      )}

      {hasQuery && (
        <div className="search-modal__section" id="search-modal-results" role="listbox">
          <span className="label-sm search-modal__section-title">
            {s.resultsLabel} ({results.length})
          </span>

          <div className="search-modal__list">
            {groups.map(([type, list]) => (
              <React.Fragment key={type}>
                <span className="label-sm search-modal__section-title" style={{ marginTop: 'var(--space-2)' }}>
                  {typeLabel(type as (typeof SEARCH_RESULT_TYPES)[number], t)}
                </span>
                {list.map((r) => {
                  const globalIdx = flatResults.indexOf(r);
                  const Icon = TYPE_ICONS[r.item.type];
                  return (
                    <button
                      key={r.item.id}
                      id={`search-result-${globalIdx}`}
                      type="button"
                      role="option"
                      aria-selected={globalIdx === activeIndex}
                      className="search-modal__item"
                      style={globalIdx === activeIndex ? { backgroundColor: 'var(--md-sys-color-surface-container-high)' } : undefined}
                      onMouseEnter={() => setActiveIndex(globalIdx)}
                      onClick={() => handleSelect(r.item.route)}
                    >
                      <div className="search-modal__item-left">
                        <div className="search-modal__item-icon"><Icon size={16} /></div>
                        <div>
                          <div className="search-modal__item-label body-md">
                            {r.item.type === 'command' ? (
                              <code>{language === 'bn' ? r.item.title.bn : r.item.title.en}</code>
                            ) : (
                              <>{language === 'bn' ? r.item.title.bn : r.item.title.en}</>
                            )}
                          </div>
                          <span className="search-modal__item-cat label-sm">
                            {language === 'bn' ? r.item.description.bn : r.item.description.en}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="search-modal__item-arrow" />
                    </button>
                  );
                })}
              </React.Fragment>
            ))}

            {flatResults.length === 0 && (
              <div className="search-modal__empty body-sm">
                {s.emptyState}
              </div>
            )}
          </div>

          {results.length > 0 && (
            <button
              type="button"
              className="search-modal__item"
              style={{ marginTop: 'var(--space-2)', fontWeight: 600 }}
              onClick={() => {
                record(query);
                onClose();
                navigate(`/search?q=${encodeURIComponent(query.trim())}&mode=${mode}`);
              }}
            >
              <div className="search-modal__item-left">
                <div className="search-modal__item-icon"><Search size={16} /></div>
                <div><div className="search-modal__item-label body-md">{s.seeAllResults} ({results.length})</div></div>
              </div>
              <ArrowRight size={14} className="search-modal__item-arrow" />
            </button>
          )}
        </div>
      )}
    </Modal>
  );
};
