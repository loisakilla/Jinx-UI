import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export type JxAccordionItem = {
  value: string;
  title: ReactNode;
  content: ReactNode;
};

export type JxAccordionProps = {
  items: JxAccordionItem[];
  single?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
};

export function JxAccordion({
  items,
  single = true,
  value,
  defaultValue,
  onValueChange,
  className
}: JxAccordionProps) {
  const [openValues, setOpenValues] = useControllableState(value, defaultValue ?? [], onValueChange);
  const openSet = useMemo(() => new Set(openValues), [openValues]);

  const toggle = (itemValue: string) => {
    const isOpen = openSet.has(itemValue);
    if (single) {
      setOpenValues(isOpen ? [] : [itemValue]);
      return;
    }
    if (isOpen) {
      setOpenValues(openValues.filter((entry) => entry !== itemValue));
      return;
    }
    setOpenValues([...openValues, itemValue]);
  };

  return (
    <div className={cn('jx-accordion', className)} data-single={single ? 'true' : 'false'}>
      {items.map((item) => {
        const isOpen = openSet.has(item.value);
        return (
          <div key={item.value} className={cn('jx-accordion-item', isOpen && 'is-open')}>
            <button type="button" className="jx-accordion-trigger" aria-expanded={isOpen} onClick={() => toggle(item.value)}>
              <span>{item.title}</span>
              <svg className="jx-accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  className="jx-accordion-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="jx-accordion-body">{item.content}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
