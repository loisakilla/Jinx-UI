import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export type JxTagInputProps = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
};

export function JxTagInput({
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Add tag…',
  className,
  ariaLabel
}: JxTagInputProps) {
  const [tags, setTags] = useControllableState<string[]>(value, defaultValue ?? [], onValueChange);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (raw: string) => {
    const next = raw.trim();
    if (!next || tags.includes(next)) {
      return;
    }
    setTags([...tags, next]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      if (draft.trim()) {
        event.preventDefault();
        commit(draft);
        setDraft('');
      }
      return;
    }
    if (event.key === 'Backspace' && !draft && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div
      className={cn('jx-taginput', className)}
      onClick={() => inputRef.current?.focus()}
      role="group"
      aria-label={ariaLabel}
    >
      <AnimatePresence initial={false}>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            layout
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="jx-chip jx-chip--active"
          >
            {tag}
            <button
              type="button"
              className="jx-chip-x"
              aria-label={`Remove ${tag}`}
              onClick={(event) => {
                event.stopPropagation();
                setTags(tags.filter((existing) => existing !== tag));
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        ref={inputRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}
