import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useControllableState } from '../hooks/useControllableState';
import { useDialogA11y } from '../hooks/useDialogA11y';
import { cn } from '../utils/cn';

export type JxModalIntent = 'default' | 'danger' | 'warning' | 'info' | 'success';

export type JxModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  message?: ReactNode;
  intent?: JxModalIntent;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
};

function defaultIntentIcon(intent: JxModalIntent) {
  if (intent === 'danger') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4" strokeLinecap="round" />
        <circle cx="12" cy="17.2" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (intent === 'warning') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4" strokeLinecap="round" />
        <circle cx="12" cy="17.2" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (intent === 'success') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (intent === 'info') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 12v4" strokeLinecap="round" />
        <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return null;
}

const intentColor: Record<Exclude<JxModalIntent, 'default'>, string> = {
  danger: 'var(--jx-danger)',
  warning: 'var(--jx-warning)',
  info: 'var(--jx-info)',
  success: 'var(--jx-success)'
};

export function JxModal({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  message,
  intent = 'default',
  icon,
  children,
  className
}: JxModalProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const titleId = useId();
  const messageId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogA11y({
    isOpen,
    onClose: () => setOpen(false),
    containerRef: dialogRef,
    initialFocusRef: closeRef
  });

  const resolvedIcon = icon ?? (intent !== 'default' ? defaultIntentIcon(intent) : null);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="jx-modal-overlay is-open"
          onClick={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={message ? messageId : undefined}
            className={cn('jx-modal-frame', className)}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <button ref={closeRef} className="jx-modal-close" aria-label="Close" type="button" onClick={() => setOpen(false)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            {resolvedIcon ? (
              <div
                className="jx-modal-icon"
                style={
                  intent !== 'default'
                    ? {
                        background: `color-mix(in oklab, ${intentColor[intent]} 14%, transparent)`,
                        color: intentColor[intent]
                      }
                    : undefined
                }
              >
                {resolvedIcon}
              </div>
            ) : null}
            <div id={titleId} className="jx-modal-title">
              {title}
            </div>
            {message ? (
              <div id={messageId} className="jx-modal-msg">
                {message}
              </div>
            ) : null}
            {children ? <div className="jx-modal-actions">{children}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
