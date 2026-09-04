import React from 'react';
import { CopyButton } from '@/components/common/CopyButton/CopyButton';
import { cn } from '@/utils/classnames';
import './CodeBlock.css';

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  filename,
  showLineNumbers = false,
  copyable = true,
  className,
  ...props
}) => {
  const lines = code.trim().split('\n');

  return (
    <div className={cn('gv-code-block', className)} {...props}>
      {(filename || language || copyable) && (
        <div className="gv-code-block__header">
          <div className="gv-code-block__meta">
            {filename && <span className="gv-code-block__filename label-sm">{filename}</span>}
            {language && <span className="gv-code-block__language label-sm font-mono">{language}</span>}
          </div>
          {copyable && (
            <div className="gv-code-block__actions">
              <CopyButton text={code} variant="icon" size="sm" />
            </div>
          )}
        </div>
      )}

      <div className="gv-code-block__content">
        {showLineNumbers && (
          <div className="gv-code-block__line-numbers font-mono" aria-hidden="true">
            {lines.map((_, i) => (
              <span key={i} className="gv-code-block__line-number">
                {i + 1}
              </span>
            ))}
          </div>
        )}
        <pre className="gv-code-block__pre font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
