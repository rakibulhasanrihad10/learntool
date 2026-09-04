import React from 'react';
import { LearningStatus } from '@/types/content';
import { useTranslation } from '@/i18n/context';
import { Circle, PlayCircle, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './StatusBadge.css';

export interface StatusBadgeProps {
  status: LearningStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  showIcon = true,
  className,
}) => {
  const { language } = useTranslation();

  const labels: Record<LearningStatus, { en: string; bn: string }> = {
    not_started: { en: 'Not Started', bn: 'শুরু হয়নি' },
    in_progress: { en: 'In Progress', bn: 'চলমান' },
    completed: { en: 'Completed', bn: 'সম্পন্ন' },
    locked: { en: 'Locked', bn: 'লক করা' },
  };

  const icons: Record<LearningStatus, React.ReactNode> = {
    not_started: <Circle size={size === 'sm' ? 12 : 14} />,
    in_progress: <PlayCircle size={size === 'sm' ? 12 : 14} />,
    completed: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
    locked: <Lock size={size === 'sm' ? 12 : 14} />,
  };

  return (
    <span
      className={cn(
        'gv-status-badge',
        `gv-status-badge--${status}`,
        `gv-status-badge--${size}`,
        className
      )}
    >
      {showIcon && <span className="gv-status-badge__icon">{icons[status]}</span>}
      <span className="gv-status-badge__label">{labels[status][language]}</span>
    </span>
  );
};
