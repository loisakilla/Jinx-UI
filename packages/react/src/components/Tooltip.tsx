import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type JxTooltipProps = HTMLAttributes<HTMLDivElement> & {
  tip: ReactNode;
  children: ReactNode;
};

export function JxTooltip({ tip, children, className, ...rest }: JxTooltipProps) {
  return (
    <div {...rest} className={cn('jx-tooltip', className)}>
      {children}
      <span className="jx-tooltip-tip" role="tooltip">
        {tip}
      </span>
    </div>
  );
}
