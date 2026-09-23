import { useId } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { motion } from 'framer-motion';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export type JxToggleItem = {
  value: string;
  label: ReactNode;
};

export type JxToggleProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  ref?: Ref<HTMLDivElement>;
  items: JxToggleItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export function JxToggle({ items, value, defaultValue, onValueChange, className, ...rest }: JxToggleProps) {
  const groupId = useId();
  const fallback = defaultValue ?? items[0]?.value ?? '';
  const [active, setActive] = useControllableState(value, fallback, onValueChange);

  return (
    <div {...rest} className={cn('jx-toggle-group', className)} role="group">
      {items.map((item) => {
        const isActive = item.value === active;
        return (
          <button
            key={item.value}
            type="button"
            className={cn('jx-toggle-btn', isActive && 'is-active')}
            onClick={() => setActive(item.value)}
            aria-pressed={isActive}
          >
            {isActive ? (
              <motion.span
                layoutId={`jx-toggle-indicator-${groupId}`}
                className="jx-toggle-indicator-bg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 'calc(var(--jx-r) - 2px)',
                  boxShadow: '0 1px 2px rgba(0,0,0,.3)',
                  zIndex: 0
                }}
              />
            ) : null}
            <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
