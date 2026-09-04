import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './StatusState.css';

export type StatusStateType = 'success' | 'warning' | 'error' | 'info';

export interface StatusStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  type?: StatusStateType;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
}

export const StatusState: React.FC<StatusStateProps> = ({
  type = 'info',
  title,
  description,
  action,
  compact = false,
  className,
  ...props
}) => {
  const icons: Record<StatusStateType, React.ReactNode> = {
    success: <CheckCircle2 size={compact ? 18 : 24} />,
    warning: <AlertTriangle size={compact ? 18 : 24} />,
    error: <XCircle size={compact ? 18 : 24} />,
    info: <Info size={compact ? 18 : 24} />,
  };

  return (
    <div
      role="status"
      className={cn(
        'gv-status-state',
        `gv-status-state--${type}`,
        compact && 'gv-status-state--compact',
        className
      )}
      {...props}
    >
      <div className="gv-status-state__icon">{icons[type]}</div>
      <div className="gv-status-state__content">
        <div className="gv-status-state__title label-lg">{title}</div>
        {description && (
          <div className="gv-status-state__description body-sm">{description}</div>
        )}
      </div>
      {action && <div className="gv-status-state__action">{action}</div>}
    </div>
  );
};

export const SuccessState: React.FC<Omit<StatusStateProps, 'type'>> = (props) => (
  <StatusState type="success" {...props} />
);

export const WarningState: React.FC<Omit<StatusStateProps, 'type'>> = (props) => (
  <StatusState type="warning" {...props} />
);

export const ErrorState: React.FC<Omit<StatusStateProps, 'type'>> = (props) => (
  <StatusState type="error" {...props} />
);

export const InfoState: React.FC<Omit<StatusStateProps, 'type'>> = (props) => (
  <StatusState type="info" {...props} />
);
