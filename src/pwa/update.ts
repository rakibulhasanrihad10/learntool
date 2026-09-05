/**
 * Service-worker update bridge (Phase 18).
 *
 * `main.tsx` (never imported by tests) wires the real updater from
 * `virtual:pwa-register`; UI calls `requestAppUpdate()` only from an
 * explicit user action. No silent reloads, ever.
 */

export const PWA_UPDATE_EVENT = 'gitverse:pwa-update-available';

type UpdateHandler = (reload: boolean) => void | Promise<void>;

let handler: UpdateHandler | null = null;

export function setUpdateHandler(next: UpdateHandler | null): void {
  handler = next;
}

export function requestAppUpdate(): void {
  try {
    handler?.(true);
  } catch (error) {
    console.warn('[pwa] update request failed:', error);
  }
}
