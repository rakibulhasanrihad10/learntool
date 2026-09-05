/**
 * Centralized document metadata (Phase 17, SEO foundation).
 *
 * Sets the page title plus the description / Open Graph / Twitter tags
 * from existing content metadata (hub subtitles, lesson summaries, guide
 * descriptions). Tags are created once and updated in place — never
 * duplicated. Titles/descriptions come from the localized strings the
 * page already renders, so language switching stays correct.
 */

import { canonicalPath, getSiteUrl } from './siteUrl';

export interface PageMeta {
  title: string;
  description?: string;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  if (typeof document === 'undefined') return;
  const selector = `meta[${attr}="${key}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  if (typeof document === 'undefined') return;
  const selector = `link[rel="${rel}"]`;
  let tag = document.head.querySelector<HTMLLinkElement>(selector);
  if (!tag) {
    tag = document.createElement('link') as HTMLLinkElement;
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

export function setPageMeta({ title, description }: PageMeta): void {
  if (typeof document === 'undefined') return;
  const fullTitle = title.includes('GitVerse') ? title : `${title} | GitVerse`;
  document.title = fullTitle;
  if (description) {
    const text = description.trim();
    if (text.length === 0) return;
    upsertMeta('name', 'description', text);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', text);
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', text);
  }
  // Canonical + og:url only when a production origin is configured —
  // never localhost, never a guess.
  const site = getSiteUrl();
  if (site && typeof window !== 'undefined' && window.location?.pathname) {
    const url = `${site}${canonicalPath(window.location.pathname)}`;
    upsertLink('canonical', url);
    upsertMeta('property', 'og:url', url);
  }
}
