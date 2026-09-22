import { useCallback, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export type JxCalendarProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  rangeHover?: { from: Date; to: Date } | null;
  monthFormatter?: (date: Date) => { month: string; year: string };
  locale?: string;
};

export type JxDateRange = { from: Date | null; to: Date | null };

export type JxDateRangePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  value?: JxDateRange;
  defaultValue?: JxDateRange;
  onValueChange?: (value: JxDateRange) => void;
  monthFormatter?: (date: Date) => { month: string; year: string };
  locale?: string;
  fromLabel?: string;
  toLabel?: string;
};

const MONTH_NAMES_DEFAULT = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW_DEFAULT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function isSameDay(a: Date | null | undefined, b: Date | null | undefined) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function inRange(date: Date, range: { from: Date; to: Date } | null | undefined) {
  if (!range) return false;
  const lo = startOfDay(range.from).getTime();
  const hi = startOfDay(range.to).getTime();
  const t = startOfDay(date).getTime();
  return t >= Math.min(lo, hi) && t <= Math.max(lo, hi);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function monthStartOf(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildGrid(monthStart: Date) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const first = new Date(year, month, 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: Array<{ date: Date; out: boolean }> = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ date: new Date(year, month - 1, daysInPrev - firstWeekday + 1 + i), out: true });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month, day), out: false });
  }
  while (cells.length % 7 !== 0) {
    const next = cells.length - firstWeekday - daysInMonth + 1;
    cells.push({ date: new Date(year, month + 1, next), out: true });
  }
  return cells;
}

function useMonthFormat(cursor: Date, locale: string, monthFormatter?: (date: Date) => { month: string; year: string }) {
  if (monthFormatter) return monthFormatter(cursor);
  try {
    const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(cursor);
    return { month, year: String(cursor.getFullYear()) };
  } catch {
    return { month: MONTH_NAMES_DEFAULT[cursor.getMonth()], year: String(cursor.getFullYear()) };
  }
}

function formatFullDate(date: Date, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  } catch {
    return `${MONTH_NAMES_DEFAULT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
}

function formatShortDate(date: Date, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date);
  } catch {
    return `${MONTH_NAMES_DEFAULT[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
  }
}

type DayState = {
  selected: boolean;
  inRange: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
};

type DayGridProps = {
  cursor: Date;
  onCursorChange: (next: Date) => void;
  locale: string;
  monthFormatter?: (date: Date) => { month: string; year: string };
  focusDate: Date;
  onFocusDateChange: (next: Date) => void;
  dayState: (date: Date) => DayState;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
  gridLabel: string;
};

function DayGrid({
  cursor,
  onCursorChange,
  locale,
  monthFormatter,
  focusDate,
  onFocusDateChange,
  dayState,
  onSelect,
  onHover,
  gridLabel
}: DayGridProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const grid = useMemo(() => buildGrid(cursor), [cursor]);
  const formatted = useMonthFormat(cursor, locale, monthFormatter);
  const pendingFocus = useRef<string | null>(null);

  const moveFocus = useCallback(
    (next: Date) => {
      const day = startOfDay(next);
      pendingFocus.current = day.toDateString();
      onFocusDateChange(day);
      if (day.getMonth() !== cursor.getMonth() || day.getFullYear() !== cursor.getFullYear()) {
        onCursorChange(monthStartOf(day));
      }
    },
    [cursor, onCursorChange, onFocusDateChange]
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, date: Date) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in step) {
      event.preventDefault();
      moveFocus(addDays(date, step[event.key]));
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      moveFocus(addDays(date, -((date.getDay() + 6) % 7)));
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      moveFocus(addDays(date, 6 - ((date.getDay() + 6) % 7)));
      return;
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      const delta = event.key === 'PageUp' ? -1 : 1;
      moveFocus(new Date(date.getFullYear(), date.getMonth() + delta, date.getDate()));
    }
  };

  return (
    <>
      <div className="jx-cal-head">
        <div className="jx-cal-month">
          {formatted.month} <em>{formatted.year}</em>
        </div>
        <div className="jx-cal-nav">
          <button type="button" aria-label="Previous month" onClick={() => onCursorChange(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" aria-label="Next month" onClick={() => onCursorChange(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="jx-cal-grid" role="group" aria-label={gridLabel} onPointerLeave={() => onHover(null)}>
        {DOW_DEFAULT.map((day, index) => (
          <div key={`dow-${index}`} className="jx-cal-dow" aria-hidden="true">
            {day}
          </div>
        ))}
        {grid.map(({ date, out }, index) => {
          const isToday = isSameDay(date, today);
          const state = dayState(date);
          const isFocusTarget = isSameDay(date, focusDate);
          return (
            <motion.button
              key={index}
              type="button"
              ref={(node) => {
                if (node && isFocusTarget && pendingFocus.current === startOfDay(date).toDateString()) {
                  pendingFocus.current = null;
                  node.focus();
                }
              }}
              className={cn(
                'jx-cal-day',
                out && 'jx-cal-day--out',
                isToday && 'jx-cal-day--today',
                state.selected && 'jx-cal-day--selected',
                state.inRange && 'jx-cal-day--in-range',
                state.rangeStart && 'jx-cal-day--range-start',
                state.rangeEnd && 'jx-cal-day--range-end'
              )}
              aria-label={formatFullDate(date, locale)}
              aria-pressed={state.selected}
              aria-current={isToday ? 'date' : undefined}
              tabIndex={isFocusTarget ? 0 : -1}
              whileHover={out ? undefined : { y: -1 }}
              transition={{ duration: 0.12 }}
              onKeyDown={(event) => onKeyDown(event, date)}
              onPointerEnter={() => onHover(date)}
              onFocus={() => onFocusDateChange(startOfDay(date))}
              onClick={() => {
                if (out) onCursorChange(monthStartOf(date));
                onSelect(date);
              }}
            >
              {date.getDate()}
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

export function JxCalendar({
  value,
  defaultValue,
  onValueChange,
  rangeHover,
  monthFormatter,
  locale = 'en-US',
  className,
  ...rest
}: JxCalendarProps) {
  const initial = defaultValue ?? null;
  const [selected, setSelected] = useControllableState<Date | null>(value, initial, onValueChange);
  const [cursor, setCursor] = useState<Date>(() => monthStartOf(selected ?? new Date()));
  const [focusDate, setFocusDate] = useState<Date>(() => startOfDay(selected ?? new Date()));

  const dayState = useCallback(
    (date: Date): DayState => ({
      selected: isSameDay(date, selected),
      inRange: inRange(date, rangeHover),
      rangeStart: isSameDay(date, rangeHover?.from),
      rangeEnd: isSameDay(date, rangeHover?.to)
    }),
    [rangeHover, selected]
  );

  return (
    <div {...rest} className={cn('jx-calendar', className)}>
      <DayGrid
        cursor={cursor}
        onCursorChange={setCursor}
        locale={locale}
        monthFormatter={monthFormatter}
        focusDate={focusDate}
        onFocusDateChange={setFocusDate}
        dayState={dayState}
        onSelect={setSelected}
        onHover={() => undefined}
        gridLabel="Choose a date"
      />
    </div>
  );
}

export function JxDateRangePicker({
  value,
  defaultValue,
  onValueChange,
  monthFormatter,
  locale = 'en-US',
  fromLabel = 'From',
  toLabel = 'To',
  className,
  ...rest
}: JxDateRangePickerProps) {
  const initial = defaultValue ?? { from: null, to: null };
  const [range, setRange] = useControllableState<JxDateRange>(value, initial, onValueChange);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [cursor, setCursor] = useState<Date>(() => monthStartOf(range.from ?? new Date()));
  const [focusDate, setFocusDate] = useState<Date>(() => startOfDay(range.from ?? new Date()));

  const preview = useMemo(() => {
    if (range.from && range.to) return { from: range.from, to: range.to };
    if (range.from && hovered) return { from: range.from, to: hovered };
    return null;
  }, [hovered, range.from, range.to]);

  const dayState = useCallback(
    (date: Date): DayState => {
      const isStart = isSameDay(date, range.from);
      const isEnd = isSameDay(date, range.to);
      const covered = inRange(date, preview);
      return {
        selected: isStart || isEnd,
        inRange: covered && !isStart && !isEnd,
        rangeStart: isStart,
        rangeEnd: isEnd
      };
    },
    [preview, range.from, range.to]
  );

  const onSelect = useCallback(
    (date: Date) => {
      const day = startOfDay(date);
      if (!range.from || range.to) {
        setRange({ from: day, to: null });
        return;
      }
      if (day.getTime() < startOfDay(range.from).getTime()) {
        setRange({ from: day, to: range.from });
        return;
      }
      setRange({ from: range.from, to: day });
    },
    [range.from, range.to, setRange]
  );

  return (
    <div {...rest} className={cn('jx-calendar jx-daterange', className)}>
      <div className="jx-daterange-fields">
        <div className="jx-daterange-field">
          <span className="jx-daterange-field-label">{fromLabel}</span>
          <span className={cn('jx-daterange-field-value', !range.from && 'is-empty')}>
            {range.from ? formatShortDate(range.from, locale) : '—'}
          </span>
        </div>
        <svg className="jx-daterange-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <div className="jx-daterange-field">
          <span className="jx-daterange-field-label">{toLabel}</span>
          <span className={cn('jx-daterange-field-value', !range.to && 'is-empty')}>
            {range.to ? formatShortDate(range.to, locale) : '—'}
          </span>
        </div>
        <button
          type="button"
          className="jx-daterange-clear"
          onClick={() => setRange({ from: null, to: null })}
          disabled={!range.from && !range.to}
        >
          Clear
        </button>
      </div>
      <DayGrid
        cursor={cursor}
        onCursorChange={setCursor}
        locale={locale}
        monthFormatter={monthFormatter}
        focusDate={focusDate}
        onFocusDateChange={setFocusDate}
        dayState={dayState}
        onSelect={onSelect}
        onHover={setHovered}
        gridLabel="Choose a date range"
      />
      <span className="jx-daterange-status" role="status">
        {range.from && range.to
          ? `${formatFullDate(range.from, locale)} to ${formatFullDate(range.to, locale)}`
          : range.from
            ? `${formatFullDate(range.from, locale)} selected, pick the end date`
            : 'Pick the start date'}
      </span>
    </div>
  );
}
