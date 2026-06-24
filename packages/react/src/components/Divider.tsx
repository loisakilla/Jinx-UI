import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type JxDividerProps = HTMLAttributes<HTMLDivElement> & {
  label?: ReactNode;
};

export function JxDivider({ label, className, ...rest }: JxDividerProps) {
  if (!label) {
    return <hr {...(rest as HTMLAttributes<HTMLHRElement>)} className={cn('jx-rule', className)} />;
  }
  return (
    <div {...rest} role="separator" aria-label={typeof label === 'string' ? label : undefined} className={cn('jx-divider', className)}>
      {label}
    </div>
  );
}
