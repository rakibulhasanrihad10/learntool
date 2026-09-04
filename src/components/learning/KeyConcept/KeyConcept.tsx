import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './KeyConcept.css';

export interface KeyConceptProps {
  title: string;
  children: React.ReactNode;
  conceptKey?: string;
  className?: string;
}

export const KeyConcept: React.FC<KeyConceptProps> = ({
  title,
  children,
  conceptKey,
  className,
}) => {
  return (
    <aside className={cn('gv-key-concept', className)}>
      <div className="gv-key-concept__badge">
        <Sparkles size={14} aria-hidden="true" />
        <span className="label-sm">Key Concept</span>
        {conceptKey && <span className="gv-key-concept__tag font-mono">{conceptKey}</span>}
      </div>
      <h3 className="gv-key-concept__title title-md">{title}</h3>
      <div className="gv-key-concept__content body-md">{children}</div>
    </aside>
  );
};
