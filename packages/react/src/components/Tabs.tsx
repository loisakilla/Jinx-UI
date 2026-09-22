import { useId, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export type JxTabItem = {
  value: string;
  label: string;
};

export type JxTabsProps = {
  items: JxTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'segmented' | 'underline';
  className?: string;
  ariaLabel?: string;
};

export function JxTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'segmented',
  className,
  ariaLabel
}: JxTabsProps) {
  const groupId = useId();
  const fallback = defaultValue ?? items[0]?.value ?? '';
  const [selected, setSelected] = useControllableState(value, fallback, onValueChange);
  const selectedIndex = useMemo(() => Math.max(0, items.findIndex((item) => item.value === selected)), [items, selected]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activateIndex = (index: number) => {
    const target = items[index];
    if (!target) return;
    setSelected(target.value);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!items.length) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      activateIndex((index + 1) % items.length);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      activateIndex((index - 1 + items.length) % items.length);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      activateIndex(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      activateIndex(items.length - 1);
    }
  };

  return (
    <div
      className={cn(variant === 'underline' ? 'jx-tabs--underline' : 'jx-tabs', className)}
      role="tablist"
      data-tabs-nav
      aria-label={ariaLabel}
    >
      {items.map((item, index) => {
        const isSelected = selectedIndex === index;
        return (
          <button
            key={item.value}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            className="jx-tab"
            aria-selected={isSelected ? 'true' : 'false'}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => setSelected(item.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            style={{ position: 'relative' }}
          >
            {isSelected ? (
              <motion.span
                layoutId={`jx-tab-indicator-${groupId}`}
                className={variant === 'underline' ? 'jx-tabs-indicator-underline' : 'jx-tabs-indicator-segment'}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                style={
                  variant === 'underline'
                    ? {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: -1,
                        height: 2,
                        background: 'var(--jx-accent)',
                        borderRadius: 999,
                        zIndex: 0
                      }
                    : {
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        zIndex: 0
                      }
                }
                aria-hidden="true"
              />
            ) : null}
            <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
