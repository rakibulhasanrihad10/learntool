/**
 * Pure sitemap builders (Phase 19). Framework-free so both the build
 * script and vitest can import this file directly.
 */

/** Keep only meaningful indexable routes: no params, no query states. */
export function indexableRoutes(paths) {
  return paths.filter((p) => !p.includes(':'));
}

export function buildSitemapXml({ siteUrl, routes, today }) {
  const urls = routes
    .map((route) => `  <url><loc>${siteUrl}${route}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildRobotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\nDisallow: /search?\nDisallow: /*?\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}
