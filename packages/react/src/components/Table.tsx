import type { TableHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type JxTableProps = TableHTMLAttributes<HTMLTableElement>;

export function JxTable({ className, ...rest }: JxTableProps) {
  return <table {...rest} className={cn('jx-table', className)} />;
}
