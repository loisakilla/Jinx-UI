import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxSwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  ref?: Ref<HTMLInputElement>;
  label?: ReactNode;
  wrapClassName?: string;
};

export function JxSwitch({ label, wrapClassName, className, id, ...rest }: JxSwitchProps) {
  const control = (
    <span className={cn('jx-switch', className)}>
      <input type="checkbox" id={id} {...rest} />
      <span className="jx-switch-slider" />
    </span>
  );
  if (!label) {
    return control;
  }
  return (
    <label className={cn(wrapClassName)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      {control}
      <span style={{ fontSize: 14 }}>{label}</span>
    </label>
  );
}
