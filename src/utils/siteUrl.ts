/**
 * Production URL configuration (Phase 19).
 *
 * - `VITE_SITE_URL`: public origin, e.g. `https://example.com`.
 *   Optional. When unset, no canonical/absolute URLs are emitted —
 *   a missing canonical beats a wrong (localhost) one.
 * - `VITE_BASE_PATH`: subpath deployment, e.g. `/gitverse/`.
 *   Defaults to `/` (domain root, the recommended setup).
 *
 * Both are build-time only and fully public. No secrets here, ever.
 */

export function getSiteUrl(): string | undefined {
  const raw =
    typeof import.meta !== 'undefined'
      ? (import.meta.env?.VITE_SITE_URL as string | undefined)
      : undefined;
  if (!raw) return undefined;
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!/^https?:\/\/[^/]+$/i.test(trimmed)) return undefined;
  return trimmed;
}

export function getBasePath(): string {
  const raw =
    typeof import.meta !== 'undefined'
      ? (import.meta.env?.VITE_BASE_PATH as string | undefined)
      : undefined;
  if (!raw) return '/';
  const trimmed = raw.trim();
  if (trimmed === '' || trimmed === '/') return '/';
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

/** Canonical path: no trailing slash (except root), no query, no hash. */
export function canonicalPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function canonicalUrl(siteUrl: string, pathname: string): string {
  return `${siteUrl}${canonicalPath(pathname)}`;
}
