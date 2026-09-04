import React from 'react';
import { CopyButton } from '@/components/common/CopyButton/CopyButton';
import { Terminal } from 'lucide-react';
import { cn } from '@/utils/classnames';
import './CommandBlock.css';

export interface CommandBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  command: string;
  description?: string;
  size?: 'sm' | 'md';
}

export const CommandBlock: React.FC<CommandBlockProps> = ({
  command,
  description,
  size = 'md',
  className,
  ...props
}) => {
  return (
    <div
      className={cn('gv-command-block', `gv-command-block--${size}`, className)}
      {...props}
    >
      <div className="gv-command-block__main">
        <span className="gv-command-block__prompt" aria-hidden="true">
          <Terminal size={size === 'sm' ? 14 : 16} />
        </span>
        <code className="gv-command-block__code font-mono">{command}</code>
      </div>
      {description && (
        <span className="gv-command-block__desc body-sm">{description}</span>
      )}
      <div className="gv-command-block__action">
        <CopyButton text={command} size={size === 'sm' ? 'sm' : 'sm'} variant="icon" />
      </div>
    </div>
  );
};
