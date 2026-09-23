import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxDividerProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLElement>;
  label?: ReactNode;
};

export function JxDivider({ label, className, ref, ...rest }: JxDividerProps) {
  if (!label) {
    return <hr {...(rest as HTMLAttributes<HTMLHRElement>)} ref={ref as Ref<HTMLHRElement>} className={cn('jx-rule', className)} />;
  }
  return (
    <div {...rest} ref={ref as Ref<HTMLDivElement>} role="separator" aria-label={typeof label === 'string' ? label : undefined} className={cn('jx-divider', className)}>
      {label}
    </div>
  );
}
