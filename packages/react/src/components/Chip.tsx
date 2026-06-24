import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type JxChipProps = HTMLAttributes<HTMLSpanElement> & {
  active?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  children?: ReactNode;
};

export function JxChip({ active = false, removable = false, onRemove, className, children, ...rest }: JxChipProps) {
  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemove?.();
  };

  return (
    <span {...rest} className={cn('jx-chip', active && 'jx-chip--active', className)}>
      {children}
      {removable ? (
        <button type="button" className="jx-chip-x" aria-label="Remove" onClick={handleRemove}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </span>
  );
}
