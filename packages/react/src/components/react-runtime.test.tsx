// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { JxAccordion } from './Accordion';
import { JxCombobox } from './Combobox';
import { JxDrawer } from './Drawer';
import { JxModal } from './Modal';
import { JxSelect } from './Select';
import { JxTabs } from './Tabs';
import { JxToastViewport } from './Toast';

afterEach(() => {
  cleanup();
});

describe('react runtime primitives', () => {
  it('supports keyboard selection for custom select', async () => {
    const user = userEvent.setup();
    render(
      <JxSelect
        label="Framework"
        options={[
          { value: 'react18', label: 'React 18' },
          { value: 'react19', label: 'React 19' }
        ]}
      />
    );

    const trigger = screen.getByRole('button', { name: /react 18/i });
    trigger.focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(trigger.textContent).toContain('React 19');
  });

  it('supports keyboard navigation for combobox', async () => {
    const user = userEvent.setup();
    render(
      <JxCombobox
        options={[
          { value: 'button', label: 'Button', subLabel: '1.2 kb' },
          { value: 'toast', label: 'Toast', subLabel: '2.1 kb' }
        ]}
      />
    );

    const input = screen.getByRole('combobox') as HTMLInputElement;
    await user.click(input);
    await user.type(input, 'to');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(input.value).toContain('Toast');
  });

  it('keeps tab aria-selected contract', async () => {
    const user = userEvent.setup();
    render(
      <JxTabs
        items={[
          { value: 'overview', label: 'Overview' },
          { value: 'activity', label: 'Activity' }
        ]}
      />
    );

    const overview = screen.getByRole('tab', { name: 'Overview' });
    const activity = screen.getByRole('tab', { name: 'Activity' });

    expect(overview.getAttribute('aria-selected')).toBe('true');
    await user.click(activity);
    expect(activity.getAttribute('aria-selected')).toBe('true');
  });

  it('supports ArrowLeft/ArrowRight/Home/End tab keyboard contract', async () => {
    const user = userEvent.setup();
    render(
      <JxTabs
        defaultValue="activity"
        items={[
          { value: 'overview', label: 'Overview' },
          { value: 'activity', label: 'Activity' },
          { value: 'settings', label: 'Settings' }
        ]}
      />
    );

    const overview = screen.getByRole('tab', { name: 'Overview' });
    const activity = screen.getByRole('tab', { name: 'Activity' });
    const settings = screen.getByRole('tab', { name: 'Settings' });

    activity.focus();
    await user.keyboard('{ArrowRight}');
    expect(settings.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(settings);

    await user.keyboard('{ArrowRight}');
    expect(overview.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(overview);

    await user.keyboard('{End}');
    expect(settings.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(settings);

    await user.keyboard('{Home}');
    expect(overview.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(overview);
  });

  it('keeps roving tabIndex and emits controlled tab changes from keyboard', async () => {
    const user = userEvent.setup();
    const changes: string[] = [];

    function Harness() {
      const [value, setValue] = useState('activity');
      return (
        <JxTabs
          value={value}
          onValueChange={(nextValue) => {
            changes.push(nextValue);
            setValue(nextValue);
          }}
          items={[
            { value: 'overview', label: 'Overview' },
            { value: 'activity', label: 'Activity' },
            { value: 'settings', label: 'Settings' }
          ]}
        />
      );
    }

    render(<Harness />);

    const overview = screen.getByRole('tab', { name: 'Overview' });
    const activity = screen.getByRole('tab', { name: 'Activity' });
    const settings = screen.getByRole('tab', { name: 'Settings' });

    expect(overview.getAttribute('tabindex')).toBe('-1');
    expect(activity.getAttribute('tabindex')).toBe('0');
    expect(settings.getAttribute('tabindex')).toBe('-1');

    activity.focus();
    await user.keyboard('{End}');
    expect(changes[changes.length - 1]).toBe('settings');
    expect(settings.getAttribute('tabindex')).toBe('0');
    expect(activity.getAttribute('tabindex')).toBe('-1');

    await user.keyboard('{Home}');
    expect(changes[changes.length - 1]).toBe('overview');
    expect(overview.getAttribute('tabindex')).toBe('0');
    expect(settings.getAttribute('tabindex')).toBe('-1');
  });

  it('closes modal on Escape', async () => {
    render(<JxModal defaultOpen title="Delete workspace" message="Confirm action" />);

    expect(screen.queryByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  it('keeps modal open when nested escape handling prevents default', () => {
    render(
      <JxModal defaultOpen title="Delete workspace" message="Confirm action">
        <input
          aria-label="Modal input"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
            }
          }}
        />
      </JxModal>
    );

    const input = screen.getByRole('textbox', { name: /modal input/i });
    input.focus();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeTruthy();
  });

  it('links modal message through aria-describedby', () => {
    render(<JxModal defaultOpen title="Delete workspace" message="Confirm action" />);

    const dialog = screen.getByRole('dialog');
    const describedBy = dialog.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const descriptionNode = document.getElementById(describedBy as string);
    expect(descriptionNode?.textContent).toContain('Confirm action');
  });

  it('traps tab inside modal and restores focus to opener', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open modal
          </button>
          <JxModal open={open} onOpenChange={setOpen} title="Confirm delete" message="Action is irreversible">
            <button type="button">Cancel</button>
            <button type="button">Delete</button>
          </JxModal>
        </>
      );
    }

    render(<Harness />);
    const opener = screen.getByRole('button', { name: /open modal/i });
    await user.click(opener);

    const close = screen.getByRole('button', { name: /close/i });
    expect(document.activeElement).toBe(close);

    opener.focus();
    await user.keyboard('{Tab}');
    expect(document.activeElement).toBe(close);

    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(screen.getByRole('button', { name: 'Delete' })).toBe(document.activeElement);

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(opener);
    });
  });

  it('toggles accordion item with keyboard enter', async () => {
    const user = userEvent.setup();
    render(
      <JxAccordion
        items={[
          { value: 'a', title: 'First', content: 'One' },
          { value: 'b', title: 'Second', content: 'Two' }
        ]}
      />
    );

    const first = screen.getByRole('button', { name: /first/i });
    first.focus();
    await user.keyboard('{Enter}');
    expect(first.getAttribute('aria-expanded')).toBe('true');
  });

  it('focuses drawer close button and closes on escape', async () => {
    render(<JxDrawer defaultOpen title="Filters">Body</JxDrawer>);
    const closeButton = screen.getByRole('button', { name: /close/i });
    await waitFor(() => {
      expect(document.activeElement).toBe(closeButton);
    });

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  it('renders toast viewport as aria-live region', async () => {
    const user = userEvent.setup();
    const onDismiss = (id: string) => {
      dismissed = id;
    };
    let dismissed = '';

    render(
      <JxToastViewport
        items={[
          { id: '1', title: 'Build queued', message: 'Waiting for runner...' }
        ]}
        onDismiss={onDismiss}
      />
    );

    const region = document.getElementById('toast-stack');
    expect(region?.getAttribute('aria-live')).toBe('polite');

    const closeButton = within(region as HTMLElement).getByRole('button', { name: /close/i });
    await user.click(closeButton);
    expect(dismissed).toBe('1');
  });
});
