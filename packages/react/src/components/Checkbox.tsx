import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  ref?: Ref<HTMLInputElement>;
  label?: ReactNode;
  wrapClassName?: string;
};

export function JxCheckbox({ label, wrapClassName, className, ...rest }: JxCheckboxProps) {
  const input = <input type="checkbox" className={cn('jx-check', className)} {...rest} />;
  if (!label) {
    return input;
  }
  return (
    <label className={cn(wrapClassName)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      {input}
      <span style={{ fontSize: 14 }}>{label}</span>
    </label>
  );
}
