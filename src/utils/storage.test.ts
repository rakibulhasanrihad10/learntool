import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { storage } from './storage';

function memoryStore(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return {
    getItem: (key: string) => (key in data ? data[key] : null),
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
    removeItem: (key: string) => {
      delete data[key];
    },
  };
}

describe('storage — crash resilience', () => {
  const realWindow = (globalThis as Record<string, unknown>).window;

  beforeEach(() => {
    (globalThis as Record<string, unknown>).window = { localStorage: memoryStore() };
  });

  afterEach(() => {
    (globalThis as Record<string, unknown>).window = realWindow;
  });

  it('round-trips JSON values', () => {
    expect(storage.set('k', { a: 1 })).toBe(true);
    expect(storage.get('k', {})).toEqual({ a: 1 });
    expect(storage.remove('k')).toBe(true);
    expect(storage.get('k', 'fallback')).toBe('fallback');
  });

  it('returns the default for malformed JSON instead of throwing', () => {
    (globalThis as Record<string, unknown>).window = {
      localStorage: memoryStore({ broken: '{not-json' }),
    };
    expect(storage.get('broken', 'safe')).toBe('safe');
  });

  it('survives throwing localStorage implementations', () => {
    (globalThis as Record<string, unknown>).window = {
      localStorage: {
        getItem: () => {
          throw new Error('denied');
        },
        setItem: () => {
          throw new Error('denied');
        },
        removeItem: () => {
          throw new Error('denied');
        },
      },
    };
    expect(storage.get('x', 42)).toBe(42);
    expect(storage.set('x', 1)).toBe(false);
    expect(storage.remove('x')).toBe(false);
  });

  it('is inert without a window (SSR-safe)', () => {
    delete (globalThis as Record<string, unknown>).window;
    expect(storage.get('x', 'd')).toBe('d');
    expect(storage.set('x', 1)).toBe(false);
    expect(storage.remove('x')).toBe(false);
  });
});
