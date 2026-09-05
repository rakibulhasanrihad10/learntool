/**
 * Install-prompt state (Phase 18).
 *
 * Pure eligibility logic (unit-tested) + a thin hook over the
 * `beforeinstallprompt` event. Dismissals persist locally and re-offer
 * after 30 days — the banner never nags. Everything degrades to "normal
 * website" where the platform offers no install affordance.
 */
import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/utils/storage';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const INSTALL_DISMISS_KEY = 'gitverse_pwa_install_dismissed';
const REOFFER_AFTER_MS = 30 * 24 * 60 * 60 * 1000;

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

export interface InstallEligibility {
  standalone: boolean;
  hasPrompt: boolean;
  dismissedAt: string | null;
  now: number;
}

/** Pure rule: show only when installable, not installed, and not recently dismissed. */
export function installEligible(state: InstallEligibility): boolean {
  if (state.standalone || !state.hasPrompt) return false;
  if (!state.dismissedAt) return true;
  const dismissed = Date.parse(state.dismissedAt);
  if (Number.isNaN(dismissed)) return true;
  return state.now - dismissed >= REOFFER_AFTER_MS;
}

export function loadInstallDismissedAt(): string | null {
  return storage.get<string | null>(INSTALL_DISMISS_KEY, null);
}

function saveInstallDismissedAt(iso: string): void {
  storage.set(INSTALL_DISMISS_KEY, iso);
}

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissedAt, setDismissedAt] = useState<string | null>(loadInstallDismissedAt);
  const [installed, setInstalled] = useState<boolean>(() => isStandalone());

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const eligible = installEligible({
    standalone: installed,
    hasPrompt: promptEvent !== null,
    dismissedAt,
    now: Date.now(),
  });

  const promptInstall = useCallback(async (): Promise<void> => {
    if (!promptEvent) return;
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'dismissed') {
        const at = new Date().toISOString();
        saveInstallDismissedAt(at);
        setDismissedAt(at);
      }
    } catch (error) {
      console.warn('[pwa] install prompt failed:', error);
    }
  }, [promptEvent]);

  const dismiss = useCallback(() => {
    const at = new Date().toISOString();
    saveInstallDismissedAt(at);
    setDismissedAt(at);
  }, []);

  return { eligible, promptInstall, dismiss };
}
