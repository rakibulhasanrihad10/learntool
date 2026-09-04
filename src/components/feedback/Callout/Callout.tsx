import React from 'react';
import { useTranslation } from '@/i18n/context';
import { Info, Lightbulb, AlertCircle, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './Callout.css';

export type CalloutType = 'note' | 'tip' | 'important' | 'warning' | 'danger' | 'interviewTip';

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  type?: CalloutType;
  title?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({
  type = 'note',
  title,
  icon,
  children,
  className,
  ...props
}) => {
  const { t } = useTranslation();

  const defaultTitles: Record<CalloutType, string> = {
    note: t.common.callouts.note,
    tip: t.common.callouts.tip,
    important: t.common.callouts.important,
    warning: t.common.callouts.warning,
    danger: t.common.callouts.danger,
    interviewTip: t.common.callouts.interviewTip,
  };

  const defaultIcons: Record<CalloutType, React.ReactNode> = {
    note: <Info size={18} aria-hidden="true" />,
    tip: <Lightbulb size={18} aria-hidden="true" />,
    important: <AlertCircle size={18} aria-hidden="true" />,
    warning: <AlertTriangle size={18} aria-hidden="true" />,
    danger: <AlertOctagon size={18} aria-hidden="true" />,
    interviewTip: <HelpCircle size={18} aria-hidden="true" />,
  };

  const resolvedTitle = title !== undefined ? title : defaultTitles[type];
  const resolvedIcon = icon !== undefined ? icon : defaultIcons[type];
  const role = (type === 'warning' || type === 'danger') ? 'alert' : 'note';

  return (
    <div
      role={role}
      className={cn('gv-callout', `gv-callout--${type}`, className)}
      {...props}
    >
      <div className="gv-callout__icon-wrapper">{resolvedIcon}</div>
      <div className="gv-callout__content">
        {resolvedTitle && (
          <div className="gv-callout__title label-lg">{resolvedTitle}</div>
        )}
        <div className="gv-callout__body body-md">{children}</div>
      </div>
    </div>
  );
};
