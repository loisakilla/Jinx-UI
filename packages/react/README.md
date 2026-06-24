# @jinx-ui/react

React runtime primitives for core Jinx components.

## Next.js App Router

Entry point includes `'use client'` so interactive primitives are client-safe.

## Covered primitives (core 8)

- Button
- Input / Textarea
- Select
- Combobox
- Tabs
- Toast
- Modal / Drawer
- Accordion

## State model

Interactive components use explicit controlled/uncontrolled APIs (`value` + `onChange` + `defaultValue`).

Tabs keyboard contract is part of the runtime baseline: `ArrowLeft` / `ArrowRight` / `Home` / `End` activate tabs, and only the active tab stays in tab order (`tabIndex=0`, others `-1`).

## Export

- `@jinx-ui/react` -> `src/index.ts`
- `@jinx-ui/react/runtime` -> `src/runtime.ts` (no module directives, useful for generic browser bundling)
