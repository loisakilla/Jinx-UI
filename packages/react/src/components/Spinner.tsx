import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxSpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  ref?: Ref<HTMLSpanElement>;
  variant?: 'ring' | 'dots';
  size?: number;
};

export function JxSpinner({ variant = 'ring', size, className, style, ...rest }: JxSpinnerProps) {
  if (variant === 'dots') {
    return (
      <span {...rest} className={cn('jx-spinner--dots', className)} aria-label="Loading" role="status" style={style}>
        <span />
        <span />
        <span />
      </span>
    );
  }
  const ringStyle: CSSProperties | undefined = size
    ? { width: size, height: size, borderWidth: Math.max(2, Math.round(size / 8)), ...style }
    : style;
  return (
    <span {...rest} className={cn('jx-spinner', className)} aria-label="Loading" role="status" style={ringStyle} />
  );
}
