import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type JxEmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  title: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
};

const defaultIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-5-5" />
  </svg>
);

export function JxEmptyState({ icon, title, message, action, className, ...rest }: JxEmptyStateProps) {
  return (
    <div {...rest} className={cn('jx-empty', className)}>
      <div className="jx-empty-icon">{icon ?? defaultIcon}</div>
      <div className="jx-empty-title">{title}</div>
      {message ? <div className="jx-empty-msg">{message}</div> : null}
      {action ? <div style={{ marginTop: 6 }}>{action}</div> : null}
    </div>
  );
}
