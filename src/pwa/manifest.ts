/**
 * Web App Manifest source of truth (Phase 18).
 *
 * Consumed by `vite.config.ts` (generates dist/manifest.webmanifest) and
 * by unit tests. Colors follow the existing brand: primary blue for the
 * theme, the icon's deep background for the launch splash.
 */

export interface PwaManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

export interface PwaManifest {
  name: string;
  short_name: string;
  description: string;
  id: string;
  start_url: string;
  scope: string;
  display: string;
  orientation?: string;
  theme_color: string;
  background_color: string;
  lang: string;
  dir: string;
  categories: string[];
  icons: PwaManifestIcon[];
}

export const GITVERSE_MANIFEST: PwaManifest = {
  name: 'GitVerse: Learn Git & GitHub',
  short_name: 'GitVerse',
  description: 'Learn deeply. Reference quickly. Practice confidently. Interactive Git lessons, command reference, practice labs, and interview prep.',
  id: '/',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  theme_color: '#1e40af',
  background_color: '#1B1F24',
  lang: 'en',
  dir: 'ltr',
  categories: ['education', 'productivity'],
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
