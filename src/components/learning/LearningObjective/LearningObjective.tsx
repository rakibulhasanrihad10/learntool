import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/i18n/context';
import { cn } from '@/utils/classnames';
import './LearningObjective.css';

export interface LearningObjectiveProps {
  objectives: string[];
  title?: string;
  className?: string;
}

export const LearningObjective: React.FC<LearningObjectiveProps> = ({
  objectives,
  title,
  className,
}) => {
  const { language } = useTranslation();
  const defaultTitle = language === 'bn' ? 'আপনি যা শিখবেন' : 'What you will learn';

  return (
    <div className={cn('gv-learning-objective', className)}>
      <div className="gv-learning-objective__header">
        <Target size={18} className="gv-learning-objective__icon" aria-hidden="true" />
        <h3 className="gv-learning-objective__title label-lg">{title || defaultTitle}</h3>
      </div>
      <ul className="gv-learning-objective__list">
        {objectives.map((obj, i) => (
          <li key={i} className="gv-learning-objective__item body-sm">
            <CheckCircle2 size={16} className="gv-learning-objective__item-icon" aria-hidden="true" />
            <span>{obj}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
