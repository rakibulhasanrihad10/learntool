import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal } from '@/components/feedback/Modal/Modal';
import { Search, BookOpen, FlaskConical, Terminal, Wrench, ArrowRight, MessagesSquare, Route } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { useNavigate } from 'react-router-dom';
import { GIT_COMMANDS, TROUBLESHOOTING_GUIDES } from '@/content/git';
import { GIT_MODULES } from '@/content/structure/gitModules';
import { GITHUB_MODULES, GITHUB_SEARCH_ENTRIES } from '@/content/github';
import { INTERNALS_SEARCH_ENTRIES } from '@/content/git/internalsShared';
import { PRACTICE_EXERCISES } from '@/content/practice';
import { searchCommands, tokenizeQuery } from '@/utils/commandSearch';
import { searchScenarios } from '@/utils/troubleshootingSearch';
import { searchGithubConcepts } from '@/utils/githubSearch';
import { searchPractice } from '@/utils/practiceSearch';
import { searchInterviewQuestions } from '@/features/interview/search';
import { searchLearningPaths } from '@/features/paths/search';
import './SearchModal.css';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LessonHit {
  id: string;
  title: string;
  subjectId: string;
  moduleSlug: string;
  lessonSlug: string;
  summary: string;
}

const ALL_LESSONS: LessonHit[] = [...GIT_MODULES, ...GITHUB_MODULES].flatMap((mod) =>
  mod.lessons.map((l) => ({
    id: l.id,
    title: l.title,
    subjectId: mod.subjectId,
    moduleSlug: mod.slug,
    lessonSlug: l.slug,
    summary: l.summary,
  }))
);

function searchLessons(query: string): LessonHit[] {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return [];
  // Match against titles, ids, slugs, summaries, and module context.
  return ALL_LESSONS.filter((lesson) => {
    const haystack = `${lesson.title} ${lesson.id} ${lesson.lessonSlug} ${lesson.summary}`.toLowerCase();
    return tokens.every((t) => haystack.includes(t));
  }).slice(0, 3);
}

function searchGithub(query: string) {
  if (!query.trim()) return [];
  return searchGithubConcepts(query, [...GITHUB_SEARCH_ENTRIES, ...INTERNALS_SEARCH_ENTRIES]).slice(0, 2);
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandResults = useMemo(
    () => (query.trim() ? searchCommands(query, GIT_COMMANDS).slice(0, 6) : []),
    [query]
  );
  const lessonResults = useMemo(() => (query.trim() ? searchLessons(query) : []), [query]);
  const githubResults = useMemo(() => searchGithub(query), [query]);
  const troubleshootingResults = useMemo(
    () => (query.trim() ? searchScenarios(query, TROUBLESHOOTING_GUIDES).slice(0, 4) : []),
    [query]
  );
  const practiceResults = useMemo(
    () => (query.trim() ? searchPractice(query, PRACTICE_EXERCISES).slice(0, 3) : []),
    [query]
  );
  const interviewResults = useMemo(
    () => (query.trim() ? searchInterviewQuestions(query, 3) : []),
    [query]
  );
  const pathResults = useMemo(
    () => (query.trim() ? searchLearningPaths(query, 3) : []),
    [query]
  );

  const flatResults = useMemo(
    () => [
      ...commandResults.map((c) => ({ kind: 'command' as const, path: `/commands/git/${c.slug}`, label: c.command, sub: language === 'bn' && c.titleBn ? c.titleBn : c.title })),
      ...troubleshootingResults.map((g) => ({ kind: 'troubleshooting' as const, path: `/troubleshooting/git/${g.slug}`, label: language === 'bn' ? g.title.bn : g.title.en, sub: language === 'bn' ? g.shortDescription.bn : g.shortDescription.en })),
      ...lessonResults.map((l) => ({ kind: 'lesson' as const, path: `/learn/${l.subjectId}/${l.moduleSlug}/${l.lessonSlug}`, label: l.title, sub: l.id })),
      ...githubResults.map((g) => ({ kind: 'lesson' as const, path: g.route, label: language === 'bn' ? g.titleBn : g.title, sub: language === 'bn' ? g.subtitleBn : g.subtitle })),
      ...practiceResults.map((e) => ({ kind: 'practice' as const, path: `/practice/${e.id.split('.').pop()}`, label: language === 'bn' ? e.title.bn : e.title.en, sub: language === 'bn' ? e.objective.bn : e.objective.en })),
      ...interviewResults.map((r) => ({ kind: 'interview' as const, path: `/interview/git/${r.question.category}`, label: language === 'bn' ? r.question.question.bn : r.question.question.en, sub: r.question.id })),
      ...pathResults.map((r) => ({ kind: 'path' as const, path: `/learn/paths/${r.path.id}`, label: language === 'bn' ? r.path.title.bn : r.path.title.en, sub: language === 'bn' ? r.path.description.bn : r.path.description.en })),
    ],
    [commandResults, troubleshootingResults, lessonResults, githubResults, practiceResults, interviewResults, pathResults, language]
  );

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
  }, [query]);

  const handleSelect = (path: string) => {
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
      if (target) handleSelect(target.path);
    }
  };

  const hasQuery = query.trim().length > 0;

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

      {!hasQuery && (
        <div className="search-modal__section">
          <span className="label-sm search-modal__section-title">{t.common.search.quickNavLabel}</span>
          <div className="search-modal__list">
            <button type="button" className="search-modal__item" onClick={() => handleSelect('/commands')}>
              <div className="search-modal__item-left">
                <div className="search-modal__item-icon"><Terminal size={16} /></div>
                <div>
                  <div className="search-modal__item-label body-md">{t.common.search.viewAllCommands}</div>
                  <span className="search-modal__item-cat label-sm">{t.common.search.commandsGroup}</span>
                </div>
              </div>
              <ArrowRight size={14} className="search-modal__item-arrow" />
            </button>
            <button type="button" className="search-modal__item" onClick={() => handleSelect('/learn')}>
              <div className="search-modal__item-left">
                <div className="search-modal__item-icon"><BookOpen size={16} /></div>
                <div>
                  <div className="search-modal__item-label body-md">Git Architecture & Plumbing</div>
                  <span className="search-modal__item-cat label-sm">{t.common.search.lessonsGroup}</span>
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
            {t.common.search.resultsLabel} ({flatResults.length})
          </span>

          <div className="search-modal__list">
            {commandResults.length > 0 && (
              <span className="label-sm search-modal__section-title">{t.common.search.commandsGroup}</span>
            )}
            {commandResults.map((item) => {
              const globalIdx = flatResults.findIndex(
                (r) => r.kind === 'command' && r.path === `/commands/git/${item.slug}`
              );
              return (
                <button
                  key={item.id}
                  id={`search-result-${globalIdx}`}
                  type="button"
                  role="option"
                  aria-selected={globalIdx === activeIndex}
                  className="search-modal__item"
                  style={globalIdx === activeIndex ? { backgroundColor: 'var(--md-sys-color-surface-container-high)' } : undefined}
                  onMouseEnter={() => setActiveIndex(globalIdx)}
                  onClick={() => handleSelect(`/commands/git/${item.slug}`)}
                >
                  <div className="search-modal__item-left">
                    <div className="search-modal__item-icon"><Terminal size={16} /></div>
                    <div>
                      <div className="search-modal__item-label body-md font-mono">{item.command}</div>
                      <span className="search-modal__item-cat label-sm">
                        {language === 'bn' && item.titleBn ? item.titleBn : item.title}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="search-modal__item-arrow" />
                </button>
              );
            })}

            {troubleshootingResults.length > 0 && (
              <span className="label-sm search-modal__section-title" style={{ marginTop: 'var(--space-2)' }}>
                {t.common.search.troubleshootingGroup}
              </span>
            )}
            {troubleshootingResults.map((guide) => {
              const path = `/troubleshooting/git/${guide.slug}`;
              const globalIdx = flatResults.findIndex((r) => r.kind === 'troubleshooting' && r.path === path);
              return (
                <button
                  key={guide.id}
                  id={`search-result-${globalIdx}`}
                  type="button"
                  role="option"
                  aria-selected={globalIdx === activeIndex}
                  className="search-modal__item"
                  style={globalIdx === activeIndex ? { backgroundColor: 'var(--md-sys-color-surface-container-high)' } : undefined}
                  onMouseEnter={() => setActiveIndex(globalIdx)}
                  onClick={() => handleSelect(path)}
                >
                  <div className="search-modal__item-left">
                    <div className="search-modal__item-icon"><Wrench size={16} /></div>
                    <div>
                      <div className="search-modal__item-label body-md">{language === 'bn' ? guide.title.bn : guide.title.en}</div>
                      <span className="search-modal__item-cat label-sm">{language === 'bn' ? guide.shortDescription.bn : guide.shortDescription.en}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="search-modal__item-arrow" />
                </button>
              );
            })}

            {(lessonResults.length > 0 || githubResults.length > 0) && (
              <span className="label-sm search-modal__section-title" style={{ marginTop: 'var(--space-2)' }}>
                {t.common.search.lessonsGroup}
              </span>
            )}
            {lessonResults.map((lesson) => {
              const path = `/learn/${lesson.subjectId}/${lesson.moduleSlug}/${lesson.lessonSlug}`;
              const globalIdx = flatResults.findIndex((r) => r.kind === 'lesson' && r.path === path);
              return (
                <button
                  key={lesson.id}
                  id={`search-result-${globalIdx}`}
                  type="button"
                  role="option"
                  aria-selected={globalIdx === activeIndex}
                  className="search-modal__item"
                  style={globalIdx === activeIndex ? { backgroundColor: 'var(--md-sys-color-surface-container-high)' } : undefined}
                  onMouseEnter={() => setActiveIndex(globalIdx)}
                  onClick={() => handleSelect(path)}
                >
                  <div className="search-modal__item-left">
                    <div className="search-modal__item-icon"><BookOpen size={16} /></div>
                    <div>
                      <div className="search-modal__item-label body-md">{lesson.title}</div>
                      <span className="search-modal__item-cat label-sm">{lesson.id}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="search-modal__item-arrow" />
                </button>
              );
            })}
            {githubResults.map((entry) => {
              const globalIdx = flatResults.findIndex((r) => r.kind === 'lesson' && r.path === entry.route);
              return (
                <button
                  key={entry.id}
                  id={`search-result-${globalIdx}`}
                  type="button"
                  role="option"
                  aria-selected={globalIdx === activeIndex}
                  className="search-modal__item"
                  style={globalIdx === activeIndex ? { backgroundColor: 'var(--md-sys-color-surface-container-high)' } : undefined}
                  onMouseEnter={() => setActiveIndex(globalIdx)}
                  onClick={() => handleSelect(entry.route)}
                >
                  <div className="search-modal__item-left">
                    <div className="search-modal__item-icon"><BookOpen size={16} /></div>
                    <div>
                      <div className="search-modal__item-label body-md">{language === 'bn' ? entry.titleBn : entry.title}</div>
                      <span className="search-modal__item-cat label-sm">{language === 'bn' ? entry.subtitleBn : entry.subtitle}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="search-modal__item-arrow" />
                </button>
              );
            })}

            {practiceResults.length > 0 && (
              <span className="label-sm search-modal__section-title" style={{ marginTop: 'var(--space-2)' }}>
                {t.common.search.practiceGroup}
              </span>
            )}
            {practiceResults.map((exercise) => {
              const path = `/practice/${exercise.id.split('.').pop()}`;
              const globalIdx = flatResults.findIndex((r) => r.kind === 'practice' && r.path === path);
              return (
                <button
                  key={exercise.id}
                  id={`search-result-${globalIdx}`}
                  type="button"
                  role="option"
                  aria-selected={globalIdx === activeIndex}
                  className="search-modal__item"
                  style={globalIdx === activeIndex ? { backgroundColor: 'var(--md-sys-color-surface-container-high)' } : undefined}
                  onMouseEnter={() => setActiveIndex(globalIdx)}
                  onClick={() => handleSelect(path)}
                >
                  <div className="search-modal__item-left">
                    <div className="search-modal__item-icon"><FlaskConical size={16} /></div>
                    <div>
                      <div className="search-modal__item-label body-md">{language === 'bn' ? exercise.title.bn : exercise.title.en}</div>
                      <span className="search-modal__item-cat label-sm">{language === 'bn' ? exercise.objective.bn : exercise.objective.en}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="search-modal__item-arrow" />
                </button>
              );
            })}

            {interviewResults.length > 0 && (
              <span className="label-sm search-modal__section-title" style={{ marginTop: 'var(--space-2)' }}>
                {t.common.search.interviewGroup}
              </span>
            )}
            {interviewResults.map(({ question }) => {
              const path = `/interview/git/${question.category}`;
              const globalIdx = flatResults.findIndex((r) => r.kind === 'interview' && r.sub === question.id);
              return (
                <button
                  key={question.id}
                  id={`search-result-${globalIdx}`}
                  type="button"
                  role="option"
                  aria-selected={globalIdx === activeIndex}
                  className="search-modal__item"
                  style={globalIdx === activeIndex ? { backgroundColor: 'var(--md-sys-color-surface-container-high)' } : undefined}
                  onMouseEnter={() => setActiveIndex(globalIdx)}
                  onClick={() => handleSelect(path)}
                >
                  <div className="search-modal__item-left">
                    <div className="search-modal__item-icon"><MessagesSquare size={16} /></div>
                    <div>
                      <div className="search-modal__item-label body-md">{language === 'bn' ? question.question.bn : question.question.en}</div>
                      <span className="search-modal__item-cat label-sm">{question.id}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="search-modal__item-arrow" />
                </button>
              );
            })}

            {pathResults.length > 0 && (
              <span className="label-sm search-modal__section-title" style={{ marginTop: 'var(--space-2)' }}>
                {t.nav.paths}
              </span>
            )}
            {pathResults.map(({ path }) => {
              const target = `/learn/paths/${path.id}`;
              const globalIdx = flatResults.findIndex((r) => r.kind === 'path' && r.path === target);
              return (
                <button
                  key={path.id}
                  id={`search-result-${globalIdx}`}
                  type="button"
                  role="option"
                  aria-selected={globalIdx === activeIndex}
                  className="search-modal__item"
                  style={globalIdx === activeIndex ? { backgroundColor: 'var(--md-sys-color-surface-container-high)' } : undefined}
                  onMouseEnter={() => setActiveIndex(globalIdx)}
                  onClick={() => handleSelect(target)}
                >
                  <div className="search-modal__item-left">
                    <div className="search-modal__item-icon"><Route size={16} /></div>
                    <div>
                      <div className="search-modal__item-label body-md">{language === 'bn' ? path.title.bn : path.title.en}</div>
                      <span className="search-modal__item-cat label-sm">{language === 'bn' ? path.description.bn : path.description.en}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="search-modal__item-arrow" />
                </button>
              );
            })}

            {flatResults.length === 0 && (
              <div className="search-modal__empty body-sm">
                {t.common.search.emptyState}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
