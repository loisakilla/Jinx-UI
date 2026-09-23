import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxTooltipProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
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
