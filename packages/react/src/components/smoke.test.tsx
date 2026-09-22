// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Jinx from '../runtime';

let consoleErrors: string[] = [];

beforeEach(() => {
  consoleErrors = [];
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    consoleErrors.push(args.map((arg) => String(arg)).join(' '));
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const cases: Record<string, ReactElement> = {
  JxAccordion: <Jinx.JxAccordion items={[{ value: 'a', title: 'First', content: 'Body' }]} />,
  JxAlert: <Jinx.JxAlert title="Heads up">Something happened</Jinx.JxAlert>,
  JxAvatar: <Jinx.JxAvatar>GK</Jinx.JxAvatar>,
  JxAvatarStack: (
    <Jinx.JxAvatarStack>
      <Jinx.JxAvatar>GK</Jinx.JxAvatar>
    </Jinx.JxAvatarStack>
  ),
  JxBadge: <Jinx.JxBadge tone="success">Active</Jinx.JxBadge>,
  JxBreadcrumbs: <Jinx.JxBreadcrumbs items={[{ label: 'Projects', href: '/' }, { label: 'Current' }]} />,
  JxButton: <Jinx.JxButton variant="primary">Save</Jinx.JxButton>,
  JxCalendar: <Jinx.JxCalendar />,
  JxDateRangePicker: <Jinx.JxDateRangePicker />,
  JxCheckbox: <Jinx.JxCheckbox label="I agree" />,
  JxChip: <Jinx.JxChip>Tag</Jinx.JxChip>,
  JxCombobox: <Jinx.JxCombobox options={[{ value: 'a', label: 'First' }]} />,
  JxDivider: <Jinx.JxDivider label="More" />,
  JxDrawer: (
    <Jinx.JxDrawer title="Panel" open onOpenChange={() => undefined}>
      Body
    </Jinx.JxDrawer>
  ),
  JxEmptyState: <Jinx.JxEmptyState title="Nothing here" message="Create the first one" />,
  JxInputField: <Jinx.JxInputField label="Name" />,
  JxPasswordField: <Jinx.JxPasswordField label="Password" />,
  JxKbd: <Jinx.JxKbd>Ctrl</Jinx.JxKbd>,
  JxMenu: <Jinx.JxMenu items={[{ label: 'Open' }, { type: 'divider' }, { label: 'Delete', danger: true }]} />,
  JxModal: (
    <Jinx.JxModal title="Title" open onOpenChange={() => undefined}>
      <Jinx.JxButton>Ok</Jinx.JxButton>
    </Jinx.JxModal>
  ),
  JxPagination: <Jinx.JxPagination total={10} />,
  JxProgress: <Jinx.JxProgress value={40} />,
  JxProgressCircle: <Jinx.JxProgressCircle value={40} showValue />,
  JxRadio: <Jinx.JxRadio label="Option" name="group" />,
  JxSelect: <Jinx.JxSelect label="Language" options={[{ value: 'en', label: 'English' }]} />,
  JxSkeleton: <Jinx.JxSkeleton width={80} height={16} />,
  JxSlider: <Jinx.JxSlider label="Scale" defaultValue={50} showOutput />,
  JxSnip: <Jinx.JxSnip>onChange</Jinx.JxSnip>,
  JxSnippet: <Jinx.JxSnippet prompt="$">npm install</Jinx.JxSnippet>,
  JxSpinner: <Jinx.JxSpinner />,
  JxStepper: <Jinx.JxStepper steps={[{ label: 'First' }, { label: 'Second' }]} current={0} />,
  JxSwitch: <Jinx.JxSwitch label="Notifications" />,
  JxTable: (
    <Jinx.JxTable>
      <tbody>
        <tr>
          <td>Cell</td>
        </tr>
      </tbody>
    </Jinx.JxTable>
  ),
  JxTabs: <Jinx.JxTabs items={[{ value: 'a', label: 'First' }]} />,
  JxTagInput: <Jinx.JxTagInput ariaLabel="Tags" />,
  JxTextareaField: <Jinx.JxTextareaField label="Description" />,
  JxToast: <Jinx.JxToast title="Done" />,
  JxToastViewport: <Jinx.JxToastViewport items={[{ id: '1', title: 'Done' }]} onDismiss={() => undefined} />,
  JxToggle: <Jinx.JxToggle items={[{ value: 'a', label: 'First' }]} />,
  JxTooltip: (
    <Jinx.JxTooltip tip="Explains the button">
      <Jinx.JxButton>Hover me</Jinx.JxButton>
    </Jinx.JxTooltip>
  ),
};

const exported = Object.keys(Jinx).filter((name) => name.startsWith('Jx'));

describe('every exported component', () => {
  it('has a smoke case, so a new component cannot slip in untested', () => {
    expect(Object.keys(cases).sort()).toEqual(exported.sort());
  });

  for (const [name, element] of Object.entries(cases)) {
    it(`${name} mounts without throwing and without React warnings`, () => {
      expect(() => render(element)).not.toThrow();
      expect(consoleErrors).toEqual([]);
    });
  }
});
