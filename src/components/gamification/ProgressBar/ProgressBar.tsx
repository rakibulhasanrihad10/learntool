import React from 'react';
import { cn } from '@/utils/classnames';
import './ProgressBar.css';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  height?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  height = 8,
  color = 'primary',
  showLabel = false,
  label,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={cn('m3-progress-bar-container', className)}>
      {(showLabel || label) && (
        <div className="m3-progress-bar__label-row">
          <span className="body-xs m3-progress-bar__label">{label}</span>
          <span className="label-xs m3-progress-bar__percent">{percentage}%</span>
        </div>
      )}
      <div
        className="m3-progress-bar"
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn('m3-progress-bar__fill', `m3-progress-bar__fill--${color}`)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
