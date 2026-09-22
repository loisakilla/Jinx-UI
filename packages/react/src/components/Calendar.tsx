import { useMemo, useState } from 'react';
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
  const [cursor, setCursor] = useState<Date>(() => new Date((selected ?? new Date()).getFullYear(), (selected ?? new Date()).getMonth(), 1));

  const today = useMemo(() => startOfDay(new Date()), []);
  const grid = useMemo(() => buildGrid(cursor), [cursor]);

  const formatted = monthFormatter
    ? monthFormatter(cursor)
    : (() => {
        try {
          const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(cursor);
          return { month, year: String(cursor.getFullYear()) };
        } catch {
          return { month: MONTH_NAMES_DEFAULT[cursor.getMonth()], year: String(cursor.getFullYear()) };
        }
      })();

  return (
    <div {...rest} className={cn('jx-calendar', className)}>
      <div className="jx-cal-head">
        <div className="jx-cal-month">
          {formatted.month} <em>{formatted.year}</em>
        </div>
        <div className="jx-cal-nav">
          <button type="button" aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      <div className="jx-cal-grid">
        {DOW_DEFAULT.map((day, index) => (
          <div key={`dow-${index}`} className="jx-cal-dow">
            {day}
          </div>
        ))}
        {grid.map(({ date, out }, index) => {
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selected);
          const isInRange = inRange(date, rangeHover);
          return (
            <motion.button
              key={index}
              type="button"
              className={cn(
                'jx-cal-day',
                out && 'jx-cal-day--out',
                isToday && 'jx-cal-day--today',
                isSelected && 'jx-cal-day--selected',
                isInRange && 'jx-cal-day--in-range'
              )}
              aria-pressed={isSelected}
              aria-current={isToday ? 'date' : undefined}
              whileHover={out ? undefined : { y: -1 }}
              transition={{ duration: 0.12 }}
              onClick={() => {
                if (out) {
                  setCursor(new Date(date.getFullYear(), date.getMonth(), 1));
                }
                setSelected(date);
              }}
            >
              {date.getDate()}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
