# Component Notes

## Surface

`@jinx-ui/react` exports 40 components and 3 hooks from `packages/react/src/runtime.ts`. That file is the public list: the contract test compares it against a written inventory, so a component added without being exported — or exported without being demonstrated — fails the build.

Groups, as they appear in the specimen:

- **Actions** — Button, Toggle, Chip, Kbd.
- **Forms** — InputField, TextareaField, Select, Combobox, TagInput, Checkbox, Radio, Switch, Slider.
- **Navigation** — Tabs, Breadcrumbs, Pagination, Menu, Stepper.
- **Overlays** — Modal, Drawer, Tooltip, Toast with ToastViewport.
- **Feedback** — Alert, Badge, Progress, ProgressCircle, Spinner, Skeleton, EmptyState.
- **Content** — Table, Accordion, Calendar, Avatar with AvatarStack, Divider, Snippet, Snip.

Hooks: `useControllableState` for the controlled/uncontrolled pair, `useDialogA11y` for focus trap and `Escape`, `useJxToastQueue` for the toast queue.

## Where they are shown

`src/showcase/Specimen.tsx` renders 25 rows; a row holds one primitive or a natural pair (Avatar with AvatarStack, Toast with its viewport). The page is the reference: if a component renders differently there than in an application, the application is wrong about props, not about CSS.

## Rules that hold across the surface

- Every class starts with `jx-`. Components never take a class from another framework.
- State is controlled from outside through `value` / `onValueChange` and `open` / `onOpenChange`; `defaultValue` and `defaultOpen` switch a component to the uncontrolled mode. Both modes are implemented once, in `useControllableState`.
- Text and markup go through `children` and `ReactNode` props. No `innerHTML`.
- Colours, radii, shadows and fonts come from `--jx-*`. A component never hardcodes a hex value.
- The React entry carries `'use client'`, so the package drops into the Next.js App Router without a wrapper.

## Fields

`JxInputField` and `JxTextareaField` wrap a native control with a label, helper text and an error slot. `JxPasswordField` adds the reveal toggle: it swaps `type` between `password` and `text`, keeps `autoComplete="current-password"`, and reports its state through `aria-pressed` on the toggle rather than through the icon alone.

## Dates

`JxCalendar` picks one day, `JxDateRangePicker` picks a span. Both render the same day grid, so the keyboard contract is shared: arrows walk day by day and week by week, `Home` and `End` jump to the ends of the week, `PageUp` and `PageDown` change month, and focus follows the cursor across a month boundary. Each day carries its full date as the accessible name; the bare number is not a usable label.

## Overlays

`JxModal`, `JxDrawer` and `JxToastViewport` render through a portal on `document.body`. A fixed overlay with a high `z-index` is still trapped if any ancestor creates a stacking context, and in an application that ancestor is out of the component's hands — so the component leaves the tree rather than fighting it. `JxDrawer` takes `side`, sits flush against that edge, and is rounded and bordered on the inner edge only.

## Style modes

`data-style` on the document element switches `brutal` and `minimal`; `data-theme` switches `light` and `dark`. Both are plain attributes — no provider, no context. A skin may restyle a component, and when it does it must cover the component's states as well: the contract test checks that for chips, because a skin once swallowed the active state.
