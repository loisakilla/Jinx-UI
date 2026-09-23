import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';

export type JxAlertIntent = 'info' | 'success' | 'warning' | 'danger';

export type JxAlertProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  intent?: JxAlertIntent;
  title: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
};

function defaultIcon(intent: JxAlertIntent) {
  if (intent === 'success') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (intent === 'warning') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4" />
        <circle cx="12" cy="17.2" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (intent === 'danger') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 12v4" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function JxAlert({ intent = 'info', title, icon, className, children, ...rest }: JxAlertProps) {
  return (
    <div {...rest} role="alert" className={cn('jx-alert', `jx-alert--${intent}`, className)}>
      <div className="jx-alert-icon">{icon ?? defaultIcon(intent)}</div>
      <div className="jx-alert-body">
        <div className="jx-alert-title">{title}</div>
        {children ? <div className="jx-alert-msg">{children}</div> : null}
      </div>
    </div>
  );
}
