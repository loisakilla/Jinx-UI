import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type JxRadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label?: ReactNode;
  wrapClassName?: string;
};

export function JxRadio({ label, wrapClassName, className, ...rest }: JxRadioProps) {
  const input = <input type="radio" className={cn('jx-radio', className)} {...rest} />;
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
