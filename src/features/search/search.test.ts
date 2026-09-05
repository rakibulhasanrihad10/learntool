import { describe, expect, it } from 'vitest';
import { getSearchIndex } from './searchIndex';
import {
  SUGGESTED_QUERIES,
  didYouMean,
  relatedResults,
  unifiedSearch,
} from './searchEngine';
import { addSearchHistory, clearSearchHistory } from './searchHistory';
import { SEARCH_RESULT_TYPES, SearchResultType } from './searchTypes';
import { formatSearchParams, parseSearchParams } from './searchUrl';

describe('unified index coverage', () => {
  it('covers every major content source with real routes', () => {
    const index = getSearchIndex();
    const byType = new Map<SearchResultType, number>();
    for (const item of index) byType.set(item.type, (byType.get(item.type) ?? 0) + 1);
    for (const type of SEARCH_RESULT_TYPES) {
      expect(byType.get(type) ?? 0, `index should include ${type}`).toBeGreaterThan(0);
    }
    expect(index.length).toBeGreaterThan(200);
    for (const item of index) {
      expect(item.route.startsWith('/'), `${item.id} route`).toBe(true);
      expect(item.title.en.trim().length, `${item.id} title`).toBeGreaterThan(0);
    }
  });

  it('is cached, not rebuilt per call', () => {
    expect(getSearchIndex()).toBe(getSearchIndex());
  });
});

describe('representative searches discover the right types', () => {
  const topTypes = (query: string, n = 3) =>
    unifiedSearch(query, { limit: n }).map((r) => r.item.type);
  const topIds = (query: string, n = 5) =>
    unifiedSearch(query, { limit: n }).map((r) => r.item.id);

  it('git add → the command first', () => {
    const results = unifiedSearch('git add', { limit: 5 });
    expect(results[0].item.id).toBe('git.add');
    expect(results[0].item.type).toBe('command');
  });

  it('add → still surfaces git add', () => {
    expect(topIds('add')).toContain('git.add');
  });

  it('reset hard → git reset above bystanders', () => {
    const results = unifiedSearch('reset hard', { limit: 5 });
    expect(results[0].item.id).toBe('git.reset');
  });

  it('merge conflict → troubleshooting + practice + interview discoverable', () => {
    const types = new Set(unifiedSearch('merge conflict', { limit: 12 }).map((r) => r.item.type));
    expect(types.has('troubleshooting')).toBe(true);
    expect(types.has('practice') || types.has('lesson')).toBe(true);
    expect(topIds('merge conflict', 12).some((id) => id.includes('merge-conflict'))).toBe(true);
  });

  it('origin upstream → origin vs upstream content', () => {
    const ids = topIds('origin upstream', 8);
    expect(ids.some((id) => id.includes('origin'))).toBe(true);
  });

  it('detached HEAD → detached head resources', () => {
    expect(topIds('detached HEAD', 6).some((id) => id.includes('detached'))).toBe(true);
  });

  it('undo commit → reset/revert/recovery resources via expansion', () => {
    const ids = topIds('undo commit', 10);
    expect(ids.some((id) => id.includes('reset') || id.includes('revert') || id.includes('recover') || id.includes('restore'))).toBe(true);
  });

  it('git fetch → fetch command; fetch vs pull → comparison content', () => {
    expect(unifiedSearch('git fetch', { limit: 5 })[0].item.id).toBe('git.fetch');
    const ids = topIds('git fetch vs pull', 8);
    expect(ids.some((id) => id.includes('fetch'))).toBe(true);
  });

  it('rebase → rebase command and lessons', () => {
    const types = new Set(topTypes('rebase', 6));
    expect(types.has('command')).toBe(true);
  });

  it('pull request → GitHub PR resources', () => {
    const types = new Set(topTypes('pull request', 8));
    expect(types.has('github') || types.has('workflow') || types.has('lesson')).toBe(true);
  });

  it('git internals → internals topics', () => {
    expect(topTypes('git internals', 5)).toContain('internals');
  });

  it('recover deleted branch → recovery cookbook first', () => {
    const ids = topIds('recover deleted branch', 6);
    expect(ids.some((id) => id.includes('deleted-branch') || id.includes('recover'))).toBe(true);
  });

  it('what is HEAD → HEAD explanations (stopwords dropped)', () => {
    const ids = topIds('what is HEAD', 8);
    expect(ids.some((id) => id.includes('head'))).toBe(true);
  });

  it('download remote changes → fetch via expansion', () => {
    expect(topIds('download remote changes', 8).some((id) => id.includes('fetch') || id.includes('pull'))).toBe(true);
  });

  it('send commits → push via expansion', () => {
    expect(topIds('send commits', 8).some((id) => id.includes('push'))).toBe(true);
  });

  it('discovers the Phase 16 additions', () => {
    expect(unifiedSearch('git stash', { limit: 3 })[0].item.id).toBe('git.stash');
    expect(unifiedSearch('git tag', { limit: 3 })[0].item.id).toBe('git.tag');
    expect(unifiedSearch('git revert', { limit: 3 })[0].item.id).toBe('git.revert');
    expect(unifiedSearch('git config', { limit: 3 })[0].item.id).toBe('git.config');
    expect(topIds('unrelated histories', 6).some((id) => id.includes('unrelated'))).toBe(true);
    expect(topIds('gitignore not working', 6).some((id) => id.includes('gitignore'))).toBe(true);
    expect(topIds('stale remote branch', 8).some((id) => id.includes('stale'))).toBe(true);
    expect(topIds('reset vs revert', 8).some((id) => id.includes('reset-vs-revert'))).toBe(true);
  });

  it('every suggested query resolves to real results', () => {
    for (const s of SUGGESTED_QUERIES) {
      expect(unifiedSearch(s.query, { limit: 5 }).length, `"${s.query}"`).toBeGreaterThan(0);
    }
  });
});

describe('ranking rules', () => {
  it('prefers exact title/command matches over mere mentions', () => {
    const results = unifiedSearch('git reset', { limit: 10 });
    expect(results[0].item.id).toBe('git.reset');
  });

  it('is deterministic across runs', () => {
    const a = unifiedSearch('merge conflict', { limit: 15 });
    const b = unifiedSearch('merge conflict', { limit: 15 });
    expect(a).toEqual(b);
  });

  it('biases by mode without changing the index', () => {
    const learning = unifiedSearch('rebase', { mode: 'learning', limit: 10 });
    const reference = unifiedSearch('rebase', { mode: 'reference', limit: 10 });
    // Reference mode must surface the command at least as early.
    const refIdx = reference.findIndex((r) => r.item.id === 'git.rebase');
    const learnIdx = learning.findIndex((r) => r.item.id === 'git.rebase');
    expect(refIdx).toBeGreaterThanOrEqual(0);
    expect(learnIdx).toBeGreaterThanOrEqual(0);
    expect(refIdx).toBeLessThanOrEqual(learnIdx);
  });

  it('filters by type and difficulty', () => {
    const commands = unifiedSearch('merge', { types: ['command'], limit: 20 });
    expect(commands.length).toBeGreaterThan(0);
    expect(commands.every((r) => r.item.type === 'command')).toBe(true);
    const beginner = unifiedSearch('branch', { difficulties: ['beginner'], limit: 20 });
    expect(beginner.every((r) => r.item.difficulty === 'beginner')).toBe(true);
  });

  it('returns empty for blank queries and no duplicates', () => {
    expect(unifiedSearch('')).toEqual([]);
    expect(unifiedSearch('   ')).toEqual([]);
    const results = unifiedSearch('git status', { limit: 50 });
    const ids = results.map((r) => r.item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('did-you-mean', () => {
  it('corrects close typos deterministically', () => {
    expect(didYouMean('git rebas')).toBe('rebase');
    expect(didYouMean('merge confict')).toBe('merge conflict');
  });

  it('stays silent when nothing is close', () => {
    expect(didYouMean('xyzzy-no-such-thing')).toBeUndefined();
    expect(didYouMean('')).toBeUndefined();
  });
});

describe('related results', () => {
  it('links companions across types without duplicating content', () => {
    const [reset] = unifiedSearch('git reset', { limit: 1 });
    const related = relatedResults(reset.item, 3);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((r) => r.id !== reset.item.id)).toBe(true);
    expect(new Set(related.map((r) => r.id)).size).toBe(related.length);
  });
});

describe('search URL state', () => {
  it('round-trips q/type/mode/difficulty and sanitizes unknowns', () => {
    const params = formatSearchParams({ q: 'git reset', type: 'command', mode: 'reference', difficulty: 'beginner' });
    expect(params.get('q')).toBe('git reset');
    const parsed = parseSearchParams(params);
    expect(parsed).toEqual({ q: 'git reset', type: 'command', mode: 'reference', difficulty: 'beginner' });

    const dirty = parseSearchParams(new URLSearchParams('q=x&type=nope&mode=weird&difficulty=expert'));
    expect(dirty).toEqual({ q: 'x', type: 'all', mode: 'learning', difficulty: 'all' });

    const defaults = parseSearchParams(new URLSearchParams(''));
    expect(defaults).toEqual({ q: '', type: 'all', mode: 'learning', difficulty: 'all' });
    expect(formatSearchParams({ q: '  ' }).toString()).toBe('');
  });
});

describe('search history (pure helpers)', () => {
  it('dedupes, caps, and clears', () => {
    let history: string[] = [];
    history = addSearchHistory(history, 'git reset');
    history = addSearchHistory(history, 'merge conflict');
    history = addSearchHistory(history, 'GIT RESET');
    expect(history).toEqual(['GIT RESET', 'merge conflict']);
    for (let i = 0; i < 12; i++) history = addSearchHistory(history, `q${i}`);
    expect(history.length).toBeLessThanOrEqual(8);
    expect(clearSearchHistory()).toEqual([]);
    expect(addSearchHistory([], '  ')).toEqual([]);
  });
});
