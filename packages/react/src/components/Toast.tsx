import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../utils/cn';

export type JxToastVariant = 'default' | 'success' | 'warning' | 'danger';

export type JxToastItem = {
  id: string;
  title: ReactNode;
  message?: ReactNode;
  variant?: JxToastVariant;
  duration?: number;
};

function toastIcon(variant: JxToastVariant) {
  if (variant === 'success') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (variant === 'warning') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4" />
        <circle cx="12" cy="17.2" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (variant === 'danger') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

export type JxToastProps = {
  title: ReactNode;
  message?: ReactNode;
  variant?: JxToastVariant;
  onClose?: () => void;
  showIcon?: boolean;
};

export function JxToast({ title, message, variant = 'default', onClose, showIcon = true }: JxToastProps) {
  return (
    <div className={cn('jx-toast', variant !== 'default' && `jx-toast--${variant}`)} role="status">
      {showIcon ? <div className="jx-toast-icon">{toastIcon(variant)}</div> : null}
      <div className="jx-toast-body">
        <div className="jx-toast-title">{title}</div>
        {message ? <div className="jx-toast-msg">{message}</div> : null}
      </div>
      {onClose ? (
        <button className="jx-toast-close" aria-label="Close" type="button" onClick={onClose}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export type JxToastViewportProps = {
  items: JxToastItem[];
  onDismiss: (id: string) => void;
  position?: 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left';
};

const positions: Record<NonNullable<JxToastViewportProps['position']>, React.CSSProperties> = {
  'bottom-left': { bottom: 20, left: 20 },
  'bottom-right': { bottom: 20, right: 20 },
  'top-right': { top: 20, right: 20 },
  'top-left': { top: 20, left: 20 }
};

export function JxToastViewport({ items, onDismiss, position = 'bottom-left' }: JxToastViewportProps) {
  return (
    <div
      id="toast-stack"
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 1100,
        ...positions[position]
      }}
    >
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: position.endsWith('right') ? 20 : -20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: position.endsWith('right') ? 20 : -20 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <JxToast
              title={item.title}
              message={item.message}
              variant={item.variant ?? 'default'}
              onClose={() => onDismiss(item.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useJxToastQueue(initial: JxToastItem[] = []) {
  const [items, setItems] = useState<JxToastItem[]>(initial);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (item: Omit<JxToastItem, 'id'>) => {
      const id = crypto.randomUUID();
      const duration = item.duration ?? 5000;
      setItems((current) => [...current, { id, ...item }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const clear = useCallback(() => setItems([]), []);

  useEffect(() => () => setItems([]), []);

  return { items, push, dismiss, clear };
}
