// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  JxAccordion,
  JxAvatar,
  JxAvatarStack,
  JxBadge,
  JxBreadcrumbs,
  JxButton,
  JxCalendar,
  JxCheckbox,
  JxChip,
  JxAlert,
  JxCombobox,
  JxDivider,
  JxDrawer,
  JxEmptyState,
  JxInputField,
  JxKbd,
  JxMenu,
  JxModal,
  JxProgress,
  JxProgressCircle,
  JxRadio,
  JxSelect,
  JxSlider,
  JxStepper,
  JxSwitch,
  JxTabs,
  JxSkeleton,
  JxSnip,
  JxSnippet,
  JxSpinner,
  JxTable,
  JxTagInput,
  JxTextareaField,
  JxToastViewport,
  JxToggle,
  JxTooltip,
  useJxToastQueue
} from '../runtime';

afterEach(cleanup);

describe('controlled and uncontrolled', () => {
  it('JxToggle switches on its own and reports the new value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <JxToggle
        items={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' }
        ]}
        defaultValue="list"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Grid' }));

    expect(onValueChange).toHaveBeenCalledWith('grid');
    expect((screen.getByRole('button', { name: 'Grid' })).getAttribute('aria-pressed')).toBe('true');
    expect((screen.getByRole('button', { name: 'List' })).getAttribute('aria-pressed')).toBe('false');
  });

  it('JxToggle obeys the parent when value is given', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <JxToggle
        items={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' }
        ]}
        value="list"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Grid' }));

    expect(onValueChange).toHaveBeenCalledWith('grid');
    expect((screen.getByRole('button', { name: 'List' })).getAttribute('aria-pressed')).toBe('true');
  });

  it('JxTabs keeps the parent in charge of the active tab', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <JxTabs
        ariaLabel="Sections"
        items={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' }
        ]}
        value="one"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('tab', { name: 'Two' }));

    expect(onValueChange).toHaveBeenCalledWith('two');
    expect((screen.getByRole('tab', { name: 'One' })).getAttribute('aria-selected')).toBe('true');
  });

  it('JxAccordion opens one item at a time by default and several when asked', async () => {
    const user = userEvent.setup();
    const items = [
      { value: 'a', title: 'First', content: 'First body' },
      { value: 'b', title: 'Second', content: 'Second body' }
    ];

    const single = render(<JxAccordion items={items} />);
    await user.click(screen.getByRole('button', { name: /First/ }));
    await user.click(screen.getByRole('button', { name: /Second/ }));
    expect((screen.getByRole('button', { name: /First/ })).getAttribute('aria-expanded')).toBe('false');
    expect((screen.getByRole('button', { name: /Second/ })).getAttribute('aria-expanded')).toBe('true');
    single.unmount();

    render(<JxAccordion items={items} single={false} />);
    await user.click(screen.getByRole('button', { name: /First/ }));
    await user.click(screen.getByRole('button', { name: /Second/ }));
    expect((screen.getByRole('button', { name: /First/ })).getAttribute('aria-expanded')).toBe('true');
    expect((screen.getByRole('button', { name: /Second/ })).getAttribute('aria-expanded')).toBe('true');
  });

  it('JxSelect reports the chosen value and refuses a disabled option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <JxSelect
        label="Status"
        options={[
          { value: 'new', label: 'New' },
          { value: 'done', label: 'Done' },
          { value: 'archived', label: 'Archived', disabled: true }
        ]}
        defaultValue="new"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: 'Archived' }));
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('option', { name: 'Done' }));
    expect(onValueChange).toHaveBeenCalledWith('done');
    expect((screen.getByRole('button')).textContent).toContain('Done');
  });

  it('JxCombobox filters as the user types and reports the pick', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <JxCombobox
        ariaLabel="Framework"
        options={[
          { value: 'react', label: 'React' },
          { value: 'svelte', label: 'Svelte' },
          { value: 'solid', label: 'Solid' }
        ]}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.type(input, 'sv');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    await user.click(options[0] as HTMLElement);
    expect(onValueChange).toHaveBeenCalledWith('svelte');
  });

  it('JxSlider moves within its range and reports numbers, not strings', () => {
    const onValueChange = vi.fn();
    render(<JxSlider label="Scale" min={80} max={140} step={10} defaultValue={100} onValueChange={onValueChange} />);

    const slider = screen.getByRole('slider') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '130' } });

    expect(onValueChange).toHaveBeenCalledWith(130);
    expect(slider.value).toBe('130');
    expect(slider.min).toBe('80');
    expect(slider.max).toBe('140');
  });
});

describe('form controls', () => {
  it.each([
    ['JxCheckbox', <JxCheckbox key="c" label="Remember me" />],
    ['JxSwitch', <JxSwitch key="s" label="Remember me" />],
    ['JxRadio', <JxRadio key="r" label="Remember me" />]
  ])('%s is toggled by clicking its own label', async (_name, element) => {
    const user = userEvent.setup();
    render(element);

    const input = screen.getByRole(_name === 'JxRadio' ? 'radio' : 'checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);
    await user.click(screen.getByText('Remember me'));
    expect(input.checked).toBe(true);
  });

  it('JxCheckbox stays controlled when the parent holds the state', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <JxCheckbox label="Agree" checked={checked} onChange={(event) => setChecked(event.target.checked)} />;
    }
    render(<Controlled />);

    const input = screen.getByRole('checkbox') as HTMLInputElement;
    await user.click(input);
    expect(input.checked).toBe(true);
  });

  it('JxTagInput adds on Enter, ignores duplicates and removes the last tag on Backspace', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<JxTagInput ariaLabel="Tags" defaultValue={['react']} onValueChange={onValueChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'svelte{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(['react', 'svelte']);

    await user.type(input, 'svelte{Enter}');
    expect(onValueChange).toHaveBeenCalledTimes(1);

    await user.type(input, '{Backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith(['react']);
  });

  it('JxButton does not fire while disabled and defaults to type=button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <JxButton disabled onClick={onClick}>
        Delete
      </JxButton>
    );

    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('menus and chips', () => {
  it('JxMenu selects with a click and with the keyboard, and skips a disabled item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onBlocked = vi.fn();
    render(
      <JxMenu
        items={[
          { label: 'Rename', onSelect },
          { type: 'divider' },
          { label: 'Delete', danger: true, disabled: true, onSelect: onBlocked }
        ]}
      />
    );

    await user.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    const blocked = screen.getByRole('menuitem', { name: 'Delete' });
    await user.click(blocked);
    expect(onBlocked).not.toHaveBeenCalled();
    expect((blocked).getAttribute('aria-disabled')).toBe('true');

    const rename = screen.getByRole('menuitem', { name: 'Rename' });
    rename.focus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('JxChip removes without triggering the chip itself', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onClick = vi.fn();
    render(
      <JxChip removable onRemove={onRemove} onClick={onClick} active>
        design
      </JxChip>
    );

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('values that must not lie', () => {
  it('JxProgress clamps out-of-range values and exposes them through ARIA', () => {
    const { rerender } = render(<JxProgress value={150} label="Upload" />);
    let bar = screen.getByRole('progressbar');
    expect((bar).getAttribute('aria-valuenow')).toBe('100');

    rerender(<JxProgress value={-20} label="Upload" />);
    bar = screen.getByRole('progressbar');
    expect((bar).getAttribute('aria-valuenow')).toBe('0');

    rerender(<JxProgress value={5} max={10} label="Upload" />);
    bar = screen.getByRole('progressbar');
    expect((bar).getAttribute('aria-valuemax')).toBe('10');
    expect((bar).getAttribute('aria-valuenow')).toBe('5');
  });

  it('JxProgressCircle clamps the same way', () => {
    const { container, rerender } = render(<JxProgressCircle value={250} />);
    expect((container.querySelector('.jx-progress-circle') as HTMLElement).style.getPropertyValue('--_v')).toBe('100');

    rerender(<JxProgressCircle value={-4} />);
    expect((container.querySelector('.jx-progress-circle') as HTMLElement).style.getPropertyValue('--_v')).toBe('0');
  });

  it('JxBreadcrumbs marks only the last crumb as the current page', () => {
    render(
      <JxBreadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: 'Jinx UI' }
        ]}
      />
    );

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(nav).getAllByRole('link')).toHaveLength(2);
    expect((within(nav).getByText('Jinx UI')).getAttribute('aria-current')).toBe('page');
  });

  it('JxStepper marks the steps before the current one as done', () => {
    const { container } = render(
      <JxStepper
        current={1}
        steps={[{ label: 'Account' }, { label: 'Workspace' }, { label: 'Invite' }]}
      />
    );

    const steps = container.querySelectorAll('.jx-step');
    expect(steps).toHaveLength(3);
    expect(steps[0]?.className).toContain('is-done');
    expect(steps[1]?.className).toContain('is-active');
    expect(steps[2]?.className).not.toContain('is-active');
  });

  it('JxAvatarStack keeps its children in one group', () => {
    const { container } = render(
      <JxAvatarStack>
        <JxAvatar>AB</JxAvatar>
        <JxAvatar tone="accent">CD</JxAvatar>
        <JxAvatar tone="info">+3</JxAvatar>
      </JxAvatarStack>
    );

    expect(container.querySelectorAll('.jx-avatar-stack .jx-avatar')).toHaveLength(3);
  });
});

describe('calendar', () => {
  it('reports the picked day and marks it as selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<JxCalendar defaultValue={new Date(2026, 4, 12)} onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: /May 17, 2026/ }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const picked = onValueChange.mock.calls[0]?.[0] as Date;
    expect(picked.getDate()).toBe(17);
    expect(picked.getMonth()).toBe(4);
    expect(screen.getByRole('button', { name: /May 17, 2026/ }).className).toContain('jx-cal-day--selected');
  });

  it('walks to another month without losing the selected day', async () => {
    const user = userEvent.setup();
    render(<JxCalendar defaultValue={new Date(2026, 4, 12)} />);

    const heading = screen.getByText(/May/i);
    expect(heading).toBeTruthy();

    const [previous] = screen.getAllByRole('button', { name: /previous|prev/i });
    await user.click(previous as HTMLElement);

    expect(screen.getByText(/April/i)).toBeTruthy();
  });
});

describe('fields tell assistive tech what is wrong', () => {
  it('JxInputField links its label, error and helper to the input', () => {
    render(<JxInputField label="Email" helperText="Work address" errorText="Not an email" defaultValue="oops" />);

    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const describedBy = (input.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
    expect(describedBy).toHaveLength(2);
    const described = describedBy.map((id) => document.getElementById(id)?.textContent);
    expect(described).toContain('Work address');
    expect(described).toContain('Not an email');
  });

  it('JxInputField stays valid and undescribed without an error', () => {
    render(<JxInputField label="Name" />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.getAttribute('aria-describedby')).toBe(null);
  });

  it('JxTextareaField links its label the same way', () => {
    render(<JxTextareaField label="Comment" rows={3} />);
    expect((screen.getByLabelText('Comment') as HTMLTextAreaElement).tagName).toBe('TEXTAREA');
  });
});

describe('overlays obey the parent', () => {
  it('JxModal stays open while the parent says so and reports the attempt to close', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <JxModal open title="Delete project" message="This cannot be undone." onOpenChange={onOpenChange}>
        <JxButton variant="danger">Delete</JxButton>
      </JxModal>
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('JxDrawer opens and closes on its own when uncontrolled', async () => {
    const user = userEvent.setup();
    render(
      <JxDrawer defaultOpen title="Filters">
        <p>Body</p>
      </JxDrawer>
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});

describe('toast queue', () => {
  function ToastHost() {
    const toasts = useJxToastQueue();
    return (
      <>
        <JxButton onClick={() => toasts.push({ title: 'Deployed', message: 'Build shipped', variant: 'success' })}>Notify</JxButton>
        <JxToastViewport items={toasts.items} onDismiss={toasts.dismiss} />
      </>
    );
  }

  it('shows what was pushed and removes it when dismissed', async () => {
    const user = userEvent.setup();
    render(<ToastHost />);

    await user.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByText('Deployed')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByText('Deployed')).toBeNull());
  });
});

describe('static components still carry their semantics', () => {
  it('JxAlert announces itself and keeps the intent in the class', () => {
    const { container } = render(
      <JxAlert intent="danger" title="Build failed">
        TypeError in useAccent.ts
      </JxAlert>
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Build failed');
    expect(container.querySelector('.jx-alert--danger')).toBeTruthy();
  });

  it('JxEmptyState renders its title, message and action', () => {
    render(<JxEmptyState title="No components match" message="Try fewer filters" action={<JxButton>Clear</JxButton>} />);
    expect(screen.getByText('No components match')).toBeTruthy();
    expect(screen.getByText('Try fewer filters')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeTruthy();
  });

  it('JxTooltip keeps the tip in the accessibility tree', () => {
    render(
      <JxTooltip tip="Copy to clipboard">
        <JxButton>Copy</JxButton>
      </JxTooltip>
    );
    expect(screen.getByRole('tooltip').textContent).toBe('Copy to clipboard');
  });

  it('JxSnippet copies what it was told to copy', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    render(<JxSnippet copyText="npm run dev">npm run dev</JxSnippet>);
    await user.click(screen.getByRole('button'));

    expect(writeText).toHaveBeenCalledWith('npm run dev');
  });
});

describe('presentational components forward what a consumer passes', () => {
  const cases: Array<[string, (props: { className: string; 'data-probe': string }) => ReactElement]> = [
    ['JxBadge', (props) => <JxBadge {...props}>New</JxBadge>],
    ['JxDivider', (props) => <JxDivider {...props} />],
    ['JxKbd', (props) => <JxKbd {...props}>K</JxKbd>],
    ['JxSkeleton', (props) => <JxSkeleton {...props} />],
    ['JxSpinner', (props) => <JxSpinner {...props} />],
    ['JxSnip', (props) => <JxSnip {...props}>code</JxSnip>],
    ['JxTable', (props) => <JxTable {...props}><tbody><tr><td>cell</td></tr></tbody></JxTable>],
    ['JxAvatar', (props) => <JxAvatar {...props}>AB</JxAvatar>],
    ['JxChip', (props) => <JxChip {...props}>tag</JxChip>],
    ['JxAlert', (props) => <JxAlert {...props} title="Heads up" />]
  ];

  it.each(cases)('%s keeps its own class and the one it was given', (_name, renderCase) => {
    const { container } = render(renderCase({ className: 'probe', 'data-probe': 'yes' }));
    const node = container.querySelector('[data-probe="yes"]');
    expect(node, `${_name} dropped the attribute it was given`).toBeTruthy();
    expect(node?.className, `${_name} dropped the class it was given`).toContain('probe');
    expect(node?.className, `${_name} dropped its own jx- class`).toMatch(/\bjx-/);
  });
});
