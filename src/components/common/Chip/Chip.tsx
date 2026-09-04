import React from 'react';
import { cn } from '@/utils/classnames';
import './Chip.css';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: React.ReactNode;
  onRemove?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  selected = false,
  icon,
  onRemove,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn('m3-chip', selected && 'm3-chip--selected', className)}
      {...props}
    >
      {icon && <span className="m3-chip__icon">{icon}</span>}
      <span className="m3-chip__label">{children}</span>
      {onRemove && (
        <span
          className="m3-chip__remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove"
        >
          &times;
        </span>
      )}
    </button>
  );
};
