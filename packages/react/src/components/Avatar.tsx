import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type JxAvatarTone = 'default' | 'accent' | 'info';
export type JxAvatarSize = 'sm' | 'md' | 'lg';

export type JxAvatarProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: JxAvatarTone;
  size?: JxAvatarSize;
  status?: boolean;
  children?: ReactNode;
};

const toneClass: Record<Exclude<JxAvatarTone, 'default'>, string> = {
  accent: 'jx-avatar--accent',
  info: 'jx-avatar--info'
};

const sizeClass: Record<JxAvatarSize, string> = {
  sm: 'jx-avatar--sm',
  md: '',
  lg: 'jx-avatar--lg'
};

export function JxAvatar({ tone = 'default', size = 'md', status = false, className, children, ...rest }: JxAvatarProps) {
  return (
    <span
      {...rest}
      className={cn('jx-avatar', sizeClass[size], tone !== 'default' && toneClass[tone], className)}
    >
      {children}
      {status ? <span className="jx-avatar-status" aria-hidden="true" /> : null}
    </span>
  );
}

export type JxAvatarStackProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export function JxAvatarStack({ className, children, ...rest }: JxAvatarStackProps) {
  return (
    <div {...rest} className={cn('jx-avatar-stack', className)}>
      {children}
    </div>
  );
}
