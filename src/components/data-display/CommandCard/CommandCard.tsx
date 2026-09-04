import React, { useState } from 'react';
import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { DifficultyBadge } from '@/components/common/DifficultyBadge/DifficultyBadge';
import { CopyButton } from '@/components/common/CopyButton/CopyButton';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { DifficultyLevel } from '@/types/content';
import { cn } from '@/utils/classnames';
import './CommandCard.css';

export interface CommandCardProps {
  command: string;
  explanation: string;
  category?: string;
  difficulty?: DifficultyLevel;
  context?: string;
  example?: string;
  output?: string;
  tags?: string[];
  syntax?: string;
  className?: string;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  explanation,
  category,
  difficulty,
  context,
  example,
  output,
  tags = [],
  syntax,
  className,
}) => {
  const [showOutput, setShowOutput] = useState(false);

  return (
    <Card className={cn('command-card', className)} padding="md" variant="filled">
      <div className="command-card__header">
        <div className="command-card__badges">
          {difficulty && <DifficultyBadge difficulty={difficulty} size="sm" />}
          {category && <Badge variant="secondary" size="sm">{category}</Badge>}
          {tags.map((tag) => (
            <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
          ))}
        </div>
        <CopyButton text={command} showLabel size="sm" variant="tonal" />
      </div>

      <div className="command-card__code-container">
        <div className="command-card__icon-prefix">
          <Terminal size={15} />
        </div>
        <code className="command-card__code font-mono">{command}</code>
      </div>

      <p className="command-card__explanation body-sm">{explanation}</p>

      {context && (
        <div className="command-card__context body-sm">
          <strong className="label-sm">Context:</strong> {context}
        </div>
      )}

      {example && (
        <div className="command-card__example">
          <span className="label-sm command-card__label">Example:</span>
          <code className="command-card__example-code font-mono">{example}</code>
        </div>
      )}

      {syntax && (
        <div className="command-card__syntax">
          <span className="label-sm command-card__syntax-label">Syntax:</span>
          <code className="code-inline">{syntax}</code>
        </div>
      )}

      {output && (
        <div className="command-card__output-section">
          <button
            type="button"
            className="command-card__output-toggle label-sm"
            onClick={() => setShowOutput((prev) => !prev)}
            aria-expanded={showOutput}
          >
            <span>Preview Output</span>
            {showOutput ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showOutput && (
            <pre className="command-card__output font-mono">{output}</pre>
          )}
        </div>
      )}
    </Card>
  );
};
