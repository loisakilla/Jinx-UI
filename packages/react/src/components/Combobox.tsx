import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export type JxComboboxOption = {
  value: string;
  label: string;
  subLabel?: string;
  icon?: ReactNode;
};

export type JxComboboxProps = {
  options: JxComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  ariaLabel?: string;
};

export function JxCombobox({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Search...',
  emptyText = 'No matches. Try fewer letters.',
  className,
  ariaLabel
}: JxComboboxProps) {
  const [selected, setSelected] = useControllableState(value, defaultValue ?? options[0]?.value ?? '', onValueChange);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const inputId = useId();

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(0, filtered.length - 1)));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) {
        setSelected(option.value);
        setQuery(option.label);
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setQuery('');
      setActiveIndex(0);
    }
  };

  const activeId = filtered[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined;

  return (
    <div className={cn('jx-combobox', className)}>
      <input
        id={inputId}
        className="jx-combobox-input"
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-controls={listId}
        aria-expanded="true"
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        aria-label={ariaLabel}
      />
      <div id={listId} className="jx-combobox-list" role="listbox">
        {filtered.map((option, index) => {
          const isActive = index === activeIndex;
          const isSelected = option.value === selected;
          return (
            <div
              key={option.value}
              id={`${listId}-opt-${index}`}
              role="option"
              aria-selected={isSelected}
              className={cn('jx-combobox-option', isActive && 'is-active')}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setSelected(option.value);
                setQuery(option.label);
                setActiveIndex(index);
              }}
            >
              {option.icon}
              {option.label}
              {option.subLabel ? <span className="jx-combobox-option-sub">{option.subLabel}</span> : null}
            </div>
          );
        })}
        {filtered.length === 0 ? <div className="jx-combobox-empty">{emptyText}</div> : null}
      </div>
    </div>
  );
}
