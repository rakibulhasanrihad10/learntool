import { describe, expect, it } from 'vitest';
import { GITVERSE_MANIFEST } from './manifest';
import { installEligible } from './install';
import { requestAppUpdate, setUpdateHandler } from './update';

describe('PWA manifest', () => {
  it('carries complete installable metadata', () => {
    expect(GITVERSE_MANIFEST.name.length).toBeGreaterThan(0);
    expect(GITVERSE_MANIFEST.short_name.length).toBeGreaterThan(0);
    expect(GITVERSE_MANIFEST.description.length).toBeGreaterThan(0);
    expect(GITVERSE_MANIFEST.start_url).toBe('/');
    expect(GITVERSE_MANIFEST.scope).toBe('/');
    expect(GITVERSE_MANIFEST.display).toBe('standalone');
    expect(GITVERSE_MANIFEST.theme_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(GITVERSE_MANIFEST.background_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(GITVERSE_MANIFEST.lang).toBe('en');
  });

  it('declares 192/512 icons plus maskable variants', () => {
    const sizes = GITVERSE_MANIFEST.icons.map((i) => `${i.sizes}${i.purpose ? `:${i.purpose}` : ''}`);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
    expect(sizes).toContain('192x192:maskable');
    expect(sizes).toContain('512x512:maskable');
    for (const icon of GITVERSE_MANIFEST.icons) {
      expect(icon.src.endsWith('.png')).toBe(true);
      expect(icon.type).toBe('image/png');
    }
  });
});

describe('install eligibility (pure rule)', () => {
  const base = { standalone: false, hasPrompt: true, dismissedAt: null as string | null, now: Date.parse('2026-09-05T00:00:00Z') };

  it('shows when installable and never dismissed', () => {
    expect(installEligible(base)).toBe(true);
  });

  it('hides when installed, unsupported, or recently dismissed', () => {
    expect(installEligible({ ...base, standalone: true })).toBe(false);
    expect(installEligible({ ...base, hasPrompt: false })).toBe(false);
    expect(installEligible({ ...base, dismissedAt: '2026-09-01T00:00:00Z' })).toBe(false);
  });

  it('re-offers after 30 days and tolerates malformed timestamps', () => {
    expect(installEligible({ ...base, dismissedAt: '2026-07-01T00:00:00Z' })).toBe(true);
    expect(installEligible({ ...base, dismissedAt: 'not-a-date' })).toBe(true);
  });
});

describe('update bridge', () => {
  it('forwards explicit update requests and no-ops without a handler', () => {
    setUpdateHandler(null);
    expect(() => requestAppUpdate()).not.toThrow();
    let reloaded = false;
    setUpdateHandler(() => {
      reloaded = true;
    });
    requestAppUpdate();
    expect(reloaded).toBe(true);
    setUpdateHandler(null);
  });
});
