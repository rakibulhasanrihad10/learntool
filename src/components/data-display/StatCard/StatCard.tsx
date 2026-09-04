import React from 'react';
import { Card } from '@/components/common/Card/Card';
import { cn } from '@/utils/classnames';
import './StatCard.css';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'success';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = 'primary',
  className,
}) => {
  return (
    <Card className={cn('stat-card', `stat-card--${color}`, className)} padding="md">
      <div className="stat-card__header">
        <span className="stat-card__label label-md">{label}</span>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>
      <div className="stat-card__value headline-md">{value}</div>
      {trend && <div className="stat-card__trend body-sm">{trend}</div>}
    </Card>
  );
};
