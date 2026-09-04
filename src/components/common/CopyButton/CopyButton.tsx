import React from 'react';
import { useClipboard } from '@/hooks/useClipboard';
import { useTranslation } from '@/i18n/context';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './CopyButton.css';

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  variant?: 'icon' | 'tonal' | 'outlined' | 'text';
  onCopied?: () => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  showLabel = false,
  size = 'sm',
  variant = 'icon',
  onCopied,
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const { copy, copied } = useClipboard();

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const success = await copy(text);
    if (success && onCopied) {
      onCopied();
    }
  };

  const copyLabel = copied ? t.common.actions.copied : t.common.actions.copy;

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copyLabel}
      title={copyLabel}
      className={cn(
        'gv-copy-btn',
        `gv-copy-btn--${variant}`,
        `gv-copy-btn--${size}`,
        copied && 'gv-copy-btn--copied',
        className
      )}
      {...props}
    >
      <span className="gv-copy-btn__icon" aria-hidden="true">
        {copied ? <Check size={size === 'sm' ? 14 : 16} /> : <Copy size={size === 'sm' ? 14 : 16} />}
      </span>
      {showLabel && <span className="gv-copy-btn__label">{copyLabel}</span>}
    </button>
  );
};
