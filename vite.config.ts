import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { GITVERSE_MANIFEST } from './src/pwa/manifest';

function withBase(value: string, base: string): string {
  if (!value.startsWith('/')) return value;
  return `${base === '/' ? '' : base.replace(/\/+$/, '')}${value}`;
}

/**
 * PWA strategy (Phase 18), documented in docs/pwa.md:
 * - Full precache of versioned app assets (shell + all route chunks +
 *   icons): bounded (~2 MB), content-hashed, cleaned on deploy.
 * - Offline navigation falls back to index.html; the router then serves
 *   whatever is cached (all content is local-first, no backend exists).
 * - Google Fonts runtime-cache only (stylesheets revalidate, font files
 *   cache-first with expiry). Nothing else external is cached.
 * - Updates are prompt-driven: no silent reloads (see src/pwa/update.ts).
 */
export default defineConfig(({ mode }) => {
  // Phase 19: optional subpath hosting (e.g. VITE_BASE_PATH=/gitverse/).
  // Defaults to domain root, the recommended setup (see docs/deployment.md).
  const env = loadEnv(mode, process.cwd(), '');
  const rawBase = (env.VITE_BASE_PATH ?? '/').trim() || '/';
  const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;

  return {
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'icons/*.png', 'robots.txt', 'og-cover.svg'],
      manifest: {
        ...GITVERSE_MANIFEST,
        id: withBase(GITVERSE_MANIFEST.id, base),
        start_url: withBase(GITVERSE_MANIFEST.start_url, base),
        scope: withBase(GITVERSE_MANIFEST.scope, base),
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  };
});
