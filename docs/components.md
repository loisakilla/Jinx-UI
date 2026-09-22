# Component Notes

## Surface

`@jinx-ui/react` exports 38 components and 3 hooks from `packages/react/src/runtime.ts`. That file is the public list: the contract test compares it against a written inventory, so a component added without being exported — or exported without being demonstrated — fails the build.

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

## Style modes

`data-style` on the document element switches `brutal`, `glass` and `minimal`; `data-theme` switches `light` and `dark`. Both are plain attributes — no provider, no context. A skin may restyle a component, and when it does it must cover the component's states as well: the contract test checks that for chips, because a skin once swallowed the active state.
