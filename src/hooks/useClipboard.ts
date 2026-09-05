import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseClipboardOptions {
  timeout?: number;
}

export function useClipboard({ timeout = 2000 }: UseClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<number | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }

        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else if (
          typeof document.execCommand === 'function' &&
          typeof document.createElement === 'function'
        ) {
          // Fallback for non-secure contexts or legacy browsers.
          // execCommand reports success synchronously — honor a `false`
          // return instead of claiming a copy that never happened.
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.setAttribute('readonly', '');
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const succeeded = document.execCommand('copy');
          textArea.remove();
          if (!succeeded) throw new Error('Fallback copy reported failure');
        } else {
          throw new Error('No clipboard API available');
        }

        setCopied(true);
        setError(null);

        timerRef.current = window.setTimeout(() => {
          setCopied(false);
        }, timeout);

        return true;
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        setError(err instanceof Error ? err : new Error('Failed to copy'));
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { copy, copied, error };
}
