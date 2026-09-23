import type { Ref, TableHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type JxTableProps = TableHTMLAttributes<HTMLTableElement> & {
  ref?: Ref<HTMLTableElement>;
};

export function JxTable({ className, ...rest }: JxTableProps) {
  return <table {...rest} className={cn('jx-table', className)} />;
}
