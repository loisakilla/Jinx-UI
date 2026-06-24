import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export type JxSelectOption = {
  value: string;
  label: string;
  meta?: string;
  group?: string;
  disabled?: boolean;
};

export type JxSelectProps = {
  options: JxSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
};

type FlatRow =
  | { kind: 'option'; option: JxSelectOption; index: number }
  | { kind: 'group'; label: string }
  | { kind: 'divider' };

function flatten(options: JxSelectOption[]): FlatRow[] {
  const rows: FlatRow[] = [];
  let currentGroup: string | undefined;
  let optionIndex = 0;
  options.forEach((option) => {
    if (option.group && option.group !== currentGroup) {
      if (currentGroup) rows.push({ kind: 'divider' });
      rows.push({ kind: 'group', label: option.group });
      currentGroup = option.group;
    }
    rows.push({ kind: 'option', option, index: optionIndex });
    optionIndex += 1;
  });
  return rows;
}

export function JxSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select',
  className,
  label
}: JxSelectProps) {
  const fallback = defaultValue ?? options[0]?.value ?? '';
  const [selectedValue, setSelectedValue] = useControllableState(value, fallback, onValueChange);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((o) => o.value === fallback)));
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const rows = useMemo(() => flatten(options), [options]);
  const selectedOption = useMemo(() => options.find((option) => option.value === selectedValue), [options, selectedValue]);

  useEffect(() => {
    const onWindowClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', onWindowClick);
    return () => window.removeEventListener('click', onWindowClick);
  }, []);

  useEffect(() => {
    if (!open) {
      const idx = options.findIndex((option) => option.value === selectedValue);
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [open, options, selectedValue]);

  const pick = (option: JxSelectOption) => {
    if (option.disabled) return;
    setSelectedValue(option.value);
    setOpen(false);
  };

  const moveActive = (delta: number) => {
    setActiveIndex((index) => {
      let next = index;
      const limit = options.length;
      for (let step = 0; step < limit; step += 1) {
        next = Math.max(0, Math.min(limit - 1, next + delta));
        if (!options[next].disabled) return next;
        if (next === 0 || next === limit - 1) return index;
      }
      return index;
    });
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) setOpen(true);
      moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) {
        const option = options[activeIndex];
        if (option) pick(option);
        return;
      }
      setOpen(true);
      return;
    }
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const onOptionKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const option = options[index];
      if (option) pick(option);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={cn('jx-field', className)}>
      {label ? <label className="jx-label">{label}</label> : null}
      <div className="jx-select" data-select ref={rootRef}>
        <button
          className="jx-select-trigger"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open ? 'true' : 'false'}
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={onTriggerKeyDown}
        >
          <span className={cn('jx-select-value', !selectedOption && 'jx-select-placeholder')}>
            {selectedOption?.label ?? placeholder}
          </span>
          <svg className="jx-select-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <AnimatePresence>
          {open ? (
            <motion.ul
              id={listId}
              className="jx-select-menu is-open"
              role="listbox"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {rows.map((row, rowIndex) => {
                if (row.kind === 'divider') {
                  return <li key={`div-${rowIndex}`} className="jx-select-divider" role="separator" />;
                }
                if (row.kind === 'group') {
                  return (
                    <li key={`g-${rowIndex}`} className="jx-select-group">
                      {row.label}
                    </li>
                  );
                }
                const option = row.option;
                const isSelected = option.value === selectedValue;
                return (
                  <li
                    key={option.value}
                    role="option"
                    tabIndex={open && activeIndex === row.index ? 0 : -1}
                    className="jx-select-option"
                    aria-selected={isSelected ? 'true' : 'false'}
                    aria-disabled={option.disabled || undefined}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => pick(option)}
                    onKeyDown={(event) => onOptionKeyDown(event, row.index)}
                  >
                    <span className="jx-select-option-label">{option.label}</span>
                    {option.meta ? <span className="jx-select-option-meta">{option.meta}</span> : null}
                    <svg className="jx-select-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </li>
                );
              })}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
