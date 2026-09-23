import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxBadgeTone = 'default' | 'accent' | 'info' | 'success' | 'warning' | 'danger' | 'solid';

export type JxBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  ref?: Ref<HTMLSpanElement>;
  tone?: JxBadgeTone;
  dot?: boolean;
  children?: ReactNode;
};

const toneClass: Record<Exclude<JxBadgeTone, 'default'>, string> = {
  accent: 'jx-badge--accent',
  info: 'jx-badge--info',
  success: 'jx-badge--success',
  warning: 'jx-badge--warning',
  danger: 'jx-badge--danger',
  solid: 'jx-badge--solid'
};

export function JxBadge({ tone = 'default', dot = false, className, children, ...rest }: JxBadgeProps) {
  return (
    <span
      {...rest}
      className={cn('jx-badge', tone !== 'default' && toneClass[tone], dot && 'jx-badge--dot', className)}
    >
      {children}
    </span>
  );
}
