import React from 'react';
import { Check, Pencil, Package, Trash2 } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './FileState.css';

export type FileVisualStatus = 'unmodified' | 'modified' | 'staged' | 'deleted';

export interface FileStateProps {
  name: string;
  status: FileVisualStatus;
  className?: string;
}

const ICONS: Record<FileVisualStatus, React.ReactNode> = {
  unmodified: <Check size={14} aria-hidden="true" />,
  modified: <Pencil size={14} aria-hidden="true" />,
  staged: <Package size={14} aria-hidden="true" />,
  deleted: <Trash2 size={14} aria-hidden="true" />,
};

/**
 * A single file with a visible state. State is communicated through icon +
 * text label, never color alone.
 */
export const FileState: React.FC<FileStateProps> = ({ name, status, className }) => {
  const { t } = useTranslation();
  const labels: Record<FileVisualStatus, string> = {
    unmodified: t.pages.simulator.unmodified,
    modified: t.pages.simulator.modified,
    staged: t.pages.simulator.staged,
    deleted: t.pages.simulator.deleted,
  };

  return (
    <div className={cn('sim-file', `sim-file--${status}`, className)}>
      <span className="sim-file__icon" aria-hidden="true">{ICONS[status]}</span>
      <code className="sim-file__name font-mono">{name}</code>
      <span className="sim-file__status">{labels[status]}</span>
    </div>
  );
};
