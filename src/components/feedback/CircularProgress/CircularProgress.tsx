import React from 'react';
import { cn } from '@/utils/classnames';
import './CircularProgress.css';

export interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'tertiary';
  showLabel?: boolean;
  centerNode?: React.ReactNode;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 64,
  strokeWidth = 6,
  variant = 'primary',
  showLabel = true,
  centerNode,
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('gv-circular-progress', `gv-circular-progress--${variant}`, className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="gv-circular-progress__svg"
      >
        <circle
          className="gv-circular-progress__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="gv-circular-progress__indicator"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gv-circular-progress__center">
        {centerNode !== undefined ? (
          centerNode
        ) : showLabel ? (
          <span className="gv-circular-progress__label label-sm font-mono">
            {Math.round(clampedValue)}%
          </span>
        ) : null}
      </div>
    </div>
  );
};
