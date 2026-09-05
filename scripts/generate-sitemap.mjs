/**
 * Post-build sitemap + robots generation (Phase 19).
 *
 * Reads the canonical route registry straight from source (no duplication),
 * emits dist/sitemap.xml + dist/robots.txt (with Sitemap line) using
 * VITE_SITE_URL. Skips silently without a configured origin — a missing
 * sitemap beats one full of localhost URLs. Windows-safe (plain node).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { buildRobotsTxt, buildSitemapXml, indexableRoutes } from './sitemap-lib.mjs';

const siteUrl = (process.env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '');
if (!siteUrl) {
  console.log('[sitemap] VITE_SITE_URL not set — skipping sitemap.xml (preview/local build).');
  process.exit(0);
}
if (!/^https?:\/\/[^/]+$/i.test(siteUrl)) {
  console.error(`[sitemap] refusing invalid VITE_SITE_URL: ${siteUrl}`);
  process.exit(1);
}

const source = readFileSync(new URL('../src/app/routePaths.ts', import.meta.url), 'utf8');
const paths = [...source.matchAll(/'(\/[^']*)'/g)]
  .map((m) => m[1])
  .filter((p, i, all) => all.indexOf(p) === i);
const routes = indexableRoutes(paths);
const today = new Date().toISOString().slice(0, 10);

mkdirSync(new URL('../dist', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/sitemap.xml', import.meta.url), buildSitemapXml({ siteUrl, routes, today }));
writeFileSync(new URL('../dist/robots.txt', import.meta.url), buildRobotsTxt(siteUrl));
console.log(`[sitemap] wrote ${routes.length} URLs for ${siteUrl}`);
