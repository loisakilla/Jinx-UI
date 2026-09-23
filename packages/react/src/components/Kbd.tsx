import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxKbdProps = HTMLAttributes<HTMLSpanElement> & {
  ref?: Ref<HTMLSpanElement>;
  children?: ReactNode;
};

export function JxKbd({ className, children, ...rest }: JxKbdProps) {
  return (
    <span {...rest} className={cn('jx-kbd', className)}>
      {children}
    </span>
  );
}
