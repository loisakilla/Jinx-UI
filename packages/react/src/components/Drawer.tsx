import { useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useControllableState } from '../hooks/useControllableState';
import { useDialogA11y } from '../hooks/useDialogA11y';
import { useJxPortal } from '../hooks/usePortal';
import { cn } from '../utils/cn';

export type JxDrawerSide = 'right' | 'left';

export type JxDrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  side?: JxDrawerSide;
  children?: ReactNode;
  className?: string;
};

export function JxDrawer({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  side = 'right',
  children,
  className
}: JxDrawerProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const portal = useJxPortal();

  useDialogA11y({
    isOpen,
    onClose: () => setOpen(false),
    containerRef: dialogRef,
    initialFocusRef: closeRef
  });

  const sideX = side === 'right' ? 40 : -40;

  return portal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="jx-modal-overlay jx-modal-overlay--drawer is-open"
          style={{ justifyContent: side === 'right' ? 'flex-end' : 'flex-start', alignItems: 'stretch' }}
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
            className={cn('jx-drawer', `jx-drawer--${side}`, className)}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, x: sideX }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: sideX }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}

          >
            <div className="jx-drawer-head">
              <span id={titleId} className="jx-drawer-title">
                {title}
              </span>
              <button ref={closeRef} className="jx-modal-close" aria-label="Close" type="button" onClick={() => setOpen(false)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="jx-drawer-body">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
