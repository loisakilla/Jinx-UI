import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type JxKbdProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function JxKbd({ className, children, ...rest }: JxKbdProps) {
  return (
    <span {...rest} className={cn('jx-kbd', className)}>
      {children}
    </span>
  );
}
