import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { setPageMeta } from './pageMeta';
import { getSiteUrl } from './siteUrl';

interface FakeTag {
  attrs: Record<string, string>;
  setAttribute: (k: string, v: string) => void;
}

function fakeDocument() {
  const tags: FakeTag[] = [];
  const makeTag = (): FakeTag => ({
    attrs: {},
    setAttribute(k: string, v: string) {
      this.attrs[k] = v;
    },
  });
  return {
    title: '',
    head: {
      querySelector: (selector: string) => {
        const meta = selector.match(/^meta\[(name|property)="([^"]+)"\]$/);
        if (meta) return tags.find((t) => t.attrs[meta[1]] === meta[2]) ?? null;
        const link = selector.match(/^link\[rel="([^"]+)"\]$/);
        if (link) return tags.find((t) => t.attrs.rel === link[1]) ?? null;
        return null;
      },
      appendChild: (tag: FakeTag) => {
        tags.push(tag);
        return tag;
      },
    },
    createElement: () => makeTag(),
    __tags: tags,
  };
}

describe('pageMeta', () => {
  const realDocument = (globalThis as Record<string, unknown>).document;
  let doc: ReturnType<typeof fakeDocument>;

  beforeEach(() => {
    doc = fakeDocument();
    (globalThis as Record<string, unknown>).document = doc;
  });

  afterEach(() => {
    (globalThis as Record<string, unknown>).document = realDocument;
  });

  it('suffixes plain titles and preserves full brand titles', () => {
    setPageMeta({ title: 'Git Commands' });
    expect(doc.title).toBe('Git Commands | GitVerse');
    setPageMeta({ title: 'GitVerse — Handbook' });
    expect(doc.title).toBe('GitVerse — Handbook');
  });

  it('creates description/OG tags once and updates them in place', () => {
    setPageMeta({ title: 'A', description: 'First' });
    setPageMeta({ title: 'B', description: 'Second' });
    const descriptions = doc.__tags.filter((t) => t.attrs.name === 'description');
    expect(descriptions).toHaveLength(1);
    expect(descriptions[0].attrs.content).toBe('Second');
    const og = doc.__tags.find((t) => t.attrs.property === 'og:description');
    expect(og?.attrs.content).toBe('Second');
    expect(doc.title).toBe('B | GitVerse');
  });

  it('skips empty descriptions and survives missing DOM', () => {
    const before = doc.__tags.length;
    setPageMeta({ title: 'A', description: '   ' });
    expect(doc.__tags.length).toBe(before);
    delete (globalThis as Record<string, unknown>).document;
    expect(() => setPageMeta({ title: 'A', description: 'B' })).not.toThrow();
  });

  it('emits no canonical without a configured site URL (never localhost)', () => {
    // import.meta.env has no VITE_SITE_URL under vitest — production code
    // must behave exactly like this on unconfigured builds.
    setPageMeta({ title: 'Git Commands', description: 'Reference' });
    expect(doc.__tags.some((t) => t.attrs.rel === 'canonical')).toBe(false);
    expect(doc.__tags.some((t) => t.attrs.property === 'og:url')).toBe(false);
  });

  it('emits canonical + og:url for trailing-slash paths when configured', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.com/');
    expect(getSiteUrl()).toBe('https://example.com');
    (globalThis as Record<string, unknown>).window = { location: { pathname: '/learn/' } };
    try {
      setPageMeta({ title: 'Learn', description: 'Tracks' });
      expect(doc.__tags.find((t) => t.attrs.rel === 'canonical')?.attrs.href).toBe(
        'https://example.com/learn'
      );
      expect(
        doc.__tags.find((t) => t.attrs.property === 'og:url')?.attrs.content
      ).toBe('https://example.com/learn');
    } finally {
      vi.unstubAllEnvs();
      delete (globalThis as Record<string, unknown>).window;
    }
  });

  it('rejects non-http origins for canonical URLs', () => {
    vi.stubEnv('VITE_SITE_URL', 'not-a-url');
    expect(getSiteUrl()).toBeUndefined();
    vi.unstubAllEnvs();
  });

  it('reflects language switches by overwriting', () => {
    setPageMeta({ title: 'Quick Cheatsheet', description: 'English text' });
    setPageMeta({ title: 'কুইক চিটশিট', description: 'বাংলা পাঠ্য' });
    expect(doc.title).toBe('কুইক চিটশিট | GitVerse');
    expect(doc.__tags.find((t) => t.attrs.name === 'description')?.attrs.content).toBe('বাংলা পাঠ্য');
  });
});
