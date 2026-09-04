import React from 'react';
import { CopyButton } from '@/components/common/CopyButton/CopyButton';
import { Terminal } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './TerminalPreview.css';

export interface TerminalPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  command: string;
  output?: string;
  title?: string;
  path?: string;
  copyable?: boolean;
}

export const TerminalPreview: React.FC<TerminalPreviewProps> = ({
  command,
  output,
  title = 'bash',
  path = '~/projects/gitverse',
  copyable = true,
  className,
  ...props
}) => {
  return (
    <div className={cn('gv-terminal-preview', className)} {...props}>
      <div className="gv-terminal-preview__titlebar">
        <div className="gv-terminal-preview__controls" aria-hidden="true">
          <span className="gv-terminal-preview__dot gv-terminal-preview__dot--close" />
          <span className="gv-terminal-preview__dot gv-terminal-preview__dot--minimize" />
          <span className="gv-terminal-preview__dot gv-terminal-preview__dot--expand" />
        </div>
        <div className="gv-terminal-preview__title font-mono">
          <Terminal size={12} className="gv-terminal-preview__title-icon" />
          <span>{title} — {path}</span>
        </div>
        <div className="gv-terminal-preview__actions">
          {copyable && <CopyButton text={command} variant="icon" size="sm" />}
        </div>
      </div>

      <div className="gv-terminal-preview__window">
        <div className="gv-terminal-preview__line font-mono">
          <span className="gv-terminal-preview__prompt-symbol" aria-hidden="true">$</span>
          <span className="gv-terminal-preview__command-text">{command}</span>
        </div>

        {output && (
          <pre className="gv-terminal-preview__output font-mono">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
};
