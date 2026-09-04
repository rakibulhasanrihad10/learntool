import { describe, it, expect } from 'vitest';
import { GIT_COMMANDS } from '@/content/git/commands';
import {
  searchCommands,
  filterCommands,
  searchAndFilter,
  getCommandById,
  getCommandBySlug,
  getRelatedCommands,
  getAdjacentCommands,
} from './commandSearch';

describe('commandSearch — lookups', () => {
  it('resolves a command by id', () => {
    expect(getCommandById(GIT_COMMANDS, 'git.status')?.command).toBe('git status');
  });

  it('resolves a command by slug', () => {
    expect(getCommandBySlug(GIT_COMMANDS, 'commit')?.id).toBe('git.commit');
  });

  it('returns undefined for unknown ids/slugs', () => {
    expect(getCommandById(GIT_COMMANDS, 'git.nope')).toBeUndefined();
    expect(getCommandBySlug(GIT_COMMANDS, 'nope')).toBeUndefined();
  });
});

describe('commandSearch — text search', () => {
  it('finds a command by exact name', () => {
    const results = searchCommands('git rebase', GIT_COMMANDS);
    expect(results.some((c) => c.id === 'git.rebase')).toBe(true);
  });

  it('is case-insensitive', () => {
    const lower = searchCommands('git status', GIT_COMMANDS);
    const upper = searchCommands('GIT STATUS', GIT_COMMANDS);
    expect(upper.map((c) => c.id)).toEqual(lower.map((c) => c.id));
  });

  it('matches via search keywords', () => {
    const results = searchCommands('squash', GIT_COMMANDS);
    expect(results.some((c) => c.id === 'git.rebase')).toBe(true);
  });

  it('matches via aliases', () => {
    const results = searchCommands('co', GIT_COMMANDS);
    expect(results.some((c) => c.id === 'git.checkout')).toBe(true);
  });

  it('returns no results for gibberish queries', () => {
    expect(searchCommands('zzz-no-such-command-zzz', GIT_COMMANDS)).toHaveLength(0);
  });

  it('returns all commands for an empty query', () => {
    expect(searchCommands('   ', GIT_COMMANDS)).toHaveLength(GIT_COMMANDS.length);
  });
});

describe('commandSearch — structural filters', () => {
  it('filters by category', () => {
    const results = filterCommands(GIT_COMMANDS, { category: 'remote' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((c) => c.category === 'remote')).toBe(true);
  });

  it('filters by difficulty', () => {
    const results = filterCommands(GIT_COMMANDS, { difficulty: 'beginner' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((c) => c.difficulty === 'beginner')).toBe(true);
  });

  it('filters to frequently used commands', () => {
    const results = filterCommands(GIT_COMMANDS, { frequentlyUsed: true });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((c) => c.frequentlyUsed === true)).toBe(true);
  });

  it('combines filters with AND semantics', () => {
    const results = searchAndFilter(GIT_COMMANDS, '', { category: 'remote', difficulty: 'beginner' });
    expect(results.every((c) => c.category === 'remote' && c.difficulty === 'beginner')).toBe(true);
  });

  it('combines text query with structural filters', () => {
    const results = searchAndFilter(GIT_COMMANDS, 'push', { category: 'remote' });
    expect(results.some((c) => c.id === 'git.push')).toBe(true);
    expect(results.every((c) => c.category === 'remote')).toBe(true);
  });
});

describe('commandSearch — relations & navigation', () => {
  it('resolves related commands to real objects', () => {
    const status = getCommandById(GIT_COMMANDS, 'git.status');
    expect(status).toBeDefined();
    const related = getRelatedCommands(status!, GIT_COMMANDS);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((c) => c.id !== 'git.status')).toBe(true);
  });

  it('skips unknown related ids gracefully', () => {
    const reset = getCommandById(GIT_COMMANDS, 'git.reset');
    expect(reset).toBeDefined();
    // git.reset references git.revert which has no entry yet — must not throw.
    const related = getRelatedCommands(reset!, GIT_COMMANDS);
    expect(related.every((c) => typeof c.command === 'string')).toBe(true);
  });

  it('provides previous/next neighbours in order', () => {
    const status = getCommandById(GIT_COMMANDS, 'git.status')!;
    const { prev, next } = getAdjacentCommands(status, GIT_COMMANDS);
    expect(prev?.order).toBeLessThan(status.order);
    expect(next?.order).toBeGreaterThan(status.order);
  });
});
