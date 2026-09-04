import React from 'react';
import { ShieldCheck, Shield, TriangleAlert, OctagonAlert } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { CommandSafetyLevel } from '@/types/content';
import { cn } from '@/utils/classnames';
import './SafetyBadge.css';

export interface SafetyBadgeProps {
  level: CommandSafetyLevel;
  className?: string;
}

const ICONS: Record<CommandSafetyLevel, React.ReactNode> = {
  safe: <ShieldCheck size={13} aria-hidden="true" />,
  'usually-safe': <Shield size={13} aria-hidden="true" />,
  destructive: <TriangleAlert size={13} aria-hidden="true" />,
  'high-risk': <OctagonAlert size={13} aria-hidden="true" />,
};

/**
 * Risk label for a command line. Meaning is carried by icon + text,
 * never by color alone.
 */
export const SafetyBadge: React.FC<SafetyBadgeProps> = ({ level, className }) => {
  const { t } = useTranslation();
  const labels: Record<CommandSafetyLevel, string> = {
    safe: t.pages.troubleshooting.safetySafe,
    'usually-safe': t.pages.troubleshooting.safetyUsuallySafe,
    destructive: t.pages.troubleshooting.safetyDestructive,
    'high-risk': t.pages.troubleshooting.safetyHighRisk,
  };

  return (
    <span className={cn('safety-badge', `safety-badge--${level}`, className)} title={labels[level]}>
      <span className="safety-badge__icon" aria-hidden="true">{ICONS[level]}</span>
      <span className="safety-badge__label">{labels[level]}</span>
    </span>
  );
};
