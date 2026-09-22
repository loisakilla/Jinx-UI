import type { HTMLAttributes } from 'react';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export type JxPaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
  total: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
};

function buildPages(total: number, current: number, sibling: number): Array<number | 'ellipsis'> {
  const pages: Array<number | 'ellipsis'> = [];
  if (total <= sibling * 2 + 5) {
    for (let i = 1; i <= total; i += 1) pages.push(i);
    return pages;
  }
  const left = Math.max(2, current - sibling);
  const right = Math.min(total - 1, current + sibling);
  pages.push(1);
  if (left > 2) pages.push('ellipsis');
  for (let i = left; i <= right; i += 1) pages.push(i);
  if (right < total - 1) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

const prevIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const nextIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export function JxPagination({
  total,
  page,
  defaultPage,
  onPageChange,
  siblingCount = 1,
  className,
  ...rest
}: JxPaginationProps) {
  const [requested, setCurrent] = useControllableState<number>(page, defaultPage ?? 1, onPageChange);
  const lastPage = Math.max(1, total);
  const current = Math.min(Math.max(1, requested), lastPage);
  const items = buildPages(lastPage, current, siblingCount);

  const go = (next: number) => {
    const clamped = Math.max(1, Math.min(lastPage, next));
    if (clamped !== current) setCurrent(clamped);
  };

  return (
    <nav {...rest} className={cn('jx-pagination', className)} role="navigation" aria-label="Pagination">
      <button
        type="button"
        className="jx-page-btn jx-page-btn--ghost"
        aria-label="Previous"
        disabled={current === 1}
        onClick={() => go(current - 1)}
      >
        {prevIcon}
      </button>
      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`e-${index}`} className="jx-page-ellipsis" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className="jx-page-btn"
            aria-current={item === current ? 'page' : undefined}
            onClick={() => go(item)}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        className="jx-page-btn jx-page-btn--ghost"
        aria-label="Next"
        disabled={current === lastPage}
        onClick={() => go(current + 1)}
      >
        {nextIcon}
      </button>
    </nav>
  );
}
