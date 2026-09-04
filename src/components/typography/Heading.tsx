import React from 'react';
import { cn } from '@/utils/classnames';
import './Heading.css';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  color?: 'default' | 'primary' | 'secondary' | 'dimmed' | 'inherit';
  align?: 'left' | 'center' | 'right';
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  as,
  color = 'default',
  align = 'left',
  children,
  className,
  ...props
}) => {
  const Component = as || (`h${level}` as React.ElementType);

  return (
    <Component
      className={cn(
        'gv-heading',
        `gv-heading--level-${level}`,
        `gv-heading--color-${color}`,
        `gv-heading--align-${align}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
