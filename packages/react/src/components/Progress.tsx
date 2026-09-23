import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export type JxProgressProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  value: number;
  max?: number;
  label?: string;
};

export function JxProgress({ value, max = 100, label, className, ...rest }: JxProgressProps) {
  const clamped = Math.max(0, Math.min(max, value));
  const pct = (clamped / max) * 100;
  return (
    <div
      {...rest}
      className={cn('jx-progress', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-label={label}
    >
      <motion.div
        className="jx-progress-bar"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export type JxProgressCircleProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  value: number;
  max?: number;
  showValue?: boolean;
};

export function JxProgressCircle({ value, max = 100, showValue = true, className, style, ...rest }: JxProgressCircleProps) {
  const clamped = Math.max(0, Math.min(max, value));
  const pct = (clamped / max) * 100;
  const merged: CSSProperties = { ...(style ?? {}), ['--_v' as never]: pct };
  return (
    <div
      {...rest}
      className={cn('jx-progress-circle', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      style={merged}
    >
      <svg viewBox="0 0 50 50" aria-hidden="true">
        <circle className="track" cx="25" cy="25" r="22" />
        <circle className="fill" cx="25" cy="25" r="22" />
      </svg>
      {showValue ? <span className="jx-progress-circle-val">{Math.round(pct)}%</span> : null}
    </div>
  );
}
