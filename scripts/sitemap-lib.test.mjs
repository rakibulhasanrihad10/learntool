import { describe, expect, it } from 'vitest';
import { buildRobotsTxt, buildSitemapXml, indexableRoutes } from './sitemap-lib.mjs';

describe('sitemap lib', () => {
  it('keeps only static indexable routes', () => {
    expect(indexableRoutes(['/', '/learn', '/learn/:subjectId', '/search'])).toEqual([
      '/',
      '/learn',
      '/search',
    ]);
  });

  it('builds valid XML with absolute URLs and no params', () => {
    const xml = buildSitemapXml({
      siteUrl: 'https://example.com',
      routes: ['/', '/learn', '/commands'],
      today: '2026-09-05',
    });
    expect(xml).toContain('<loc>https://example.com/</loc>');
    expect(xml).toContain('<loc>https://example.com/learn</loc>');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.every((loc) => !loc.slice('https://'.length).includes(':'))).toBe(true);
    expect(xml).toContain('<lastmod>2026-09-05</lastmod>');
  });

  it('points robots at the sitemap without blocking content', () => {
    const robots = buildRobotsTxt('https://example.com');
    expect(robots).toContain('Sitemap: https://example.com/sitemap.xml');
    expect(robots).toMatch(/^User-agent: \*\nAllow: \//m);
    expect(robots).not.toMatch(/^Disallow: \/$/m);
  });
});
