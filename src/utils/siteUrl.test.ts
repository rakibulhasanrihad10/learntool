import { describe, expect, it } from 'vitest';
import { canonicalPath, canonicalUrl } from './siteUrl';

describe('site URL helpers (pure)', () => {
  it('normalizes canonical paths', () => {
    expect(canonicalPath('/')).toBe('/');
    expect(canonicalPath('')).toBe('/');
    expect(canonicalPath('/learn/')).toBe('/learn');
    expect(canonicalPath('/commands')).toBe('/commands');
  });

  it('builds absolute canonical URLs', () => {
    expect(canonicalUrl('https://example.com', '/learn/')).toBe('https://example.com/learn');
    expect(canonicalUrl('https://example.com', '/')).toBe('https://example.com/');
  });
});
