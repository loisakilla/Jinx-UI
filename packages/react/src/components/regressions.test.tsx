// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { JxModal } from './Modal';
import { JxPagination } from './Pagination';
import { useJxToastQueue } from './Toast';
import { JxToggle } from './Toggle';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

const currentPage = () => screen.getAllByRole('button').find((button) => button.getAttribute('aria-current') === 'page');
const byName = (name: string) => screen.getByRole('button', { name }) as HTMLButtonElement;

describe('pagination stays inside its range', () => {
  it('clamps a page that is past the last one', () => {
    render(<JxPagination total={3} page={9} />);
    expect(currentPage()?.textContent).toBe('3');
    expect(byName('Next').disabled).toBe(true);
  });

  it('survives an empty collection', () => {
    render(<JxPagination total={0} />);
    expect(byName('Previous').disabled).toBe(true);
    expect(byName('Next').disabled).toBe(true);
  });

  it('follows the page down when the collection shrinks', () => {
    const { rerender } = render(<JxPagination total={9} defaultPage={7} />);
    expect(currentPage()?.textContent).toBe('7');
    rerender(<JxPagination total={2} defaultPage={7} />);
    expect(currentPage()?.textContent).toBe('2');
  });
});

describe('an open dialog locks the page behind it', () => {
  function Host() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          open
        </button>
        <JxModal title="Confirm" open={open} onOpenChange={setOpen}>
          <button type="button">ok</button>
        </JxModal>
      </>
    );
  }

  it('hides body overflow while open and restores it on close', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'auto';
    render(<Host />);

    expect(document.body.style.overflow).toBe('auto');
    await user.click(screen.getByRole('button', { name: 'open' }));
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).toBe('auto');
  });
});

describe('toast queue', () => {
  it('drops its timers when the component goes away', () => {
    vi.useFakeTimers();

    function Host() {
      const queue = useJxToastQueue();
      return (
        <button type="button" onClick={() => queue.push({ title: 'Saved', duration: 1000 })}>
          push
        </button>
      );
    }

    const { unmount } = render(<Host />);
    act(() => {
      screen.getByRole('button', { name: 'push' }).click();
    });
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(() => act(() => vi.advanceTimersByTime(5000))).not.toThrow();
    vi.useRealTimers();
  });
});

describe('segmented controls keep the active label readable', () => {
  const appCss = readFileSync(resolve(process.cwd(), 'packages/core/src/jinx-app.css'), 'utf-8');

  it('paints the indicator inside the active button', () => {
    render(<JxToggle items={[{ value: 'a', label: 'Dark' }, { value: 'b', label: 'Light' }]} defaultValue="a" />);
    const active = screen.getByRole('button', { name: 'Dark' });
    expect(active.querySelector('.jx-toggle-indicator-bg')).not.toBeNull();
  });

  it('positions the button so the indicator cannot escape it', () => {
    expect(appCss).toMatch(/\.jx-toggle-btn \{[^}]*position: relative/s);
  });

  it('leaves indicator colours to css, where a skin can override them', () => {
    expect(appCss).toContain('.jx-toggle-indicator-bg { background: var(--jx-accent); }');
    expect(appCss).toContain('[data-style="brutal"] .jx-tabs-indicator-segment { background: var(--jx-accent); }');
    expect(readFileSync(resolve(process.cwd(), 'packages/react/src/components/Toggle.tsx'), 'utf-8')).not.toContain("background: 'var(--jx-surface)'");
  });
});
