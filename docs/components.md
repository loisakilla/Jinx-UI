# Component Notes

## Transferred Surface

The visible component inventory is the one in the supplied static showcase.
The specimen section currently keeps all 25 `.jx-spec-row` rows.

The page includes examples for:

- Buttons and button states.
- Inputs, textarea, select, input group, and tag input.
- Badges, chips, kbd, alerts, toast, modal, drawer, accordion, menu, combobox, calendar, pagination, avatar, progress, slider, table, snippets, and installation examples.

## Interaction Notes

- The transferred `src/jinx-app.js` keeps the prototype interactions needed for the showcase.
- Toast and tag input no longer use `innerHTML`.
- Tweaks panel updates theme, accent, style, and custom radius in local page state.
- Style mode defaults to `brutal`.

## Current Boundary

The static showcase remains the visual reference, and the repository now also contains in-repo package layers:

- `packages/tokens`: variables and style-mode contract.
- `packages/core`: CSS primitives and skin composition for core 8. Showcase-specific CSS is exported separately.
- `packages/react`: runtime primitives for button, input/textarea, select/combobox, tabs, toast, modal/drawer, accordion.

`jx-*` namespace is the public contract for v1. Do not introduce a second naming system during v1.

React runtime entrypoint is client-boundary compatible for Next App Router (`'use client'` in package entry).
Modal and Drawer runtime now include focus trap basics (`Tab` loop + `Escape` close + opener focus restore).
Showcase tabs now support `ArrowLeft` / `ArrowRight` / `Home` / `End` keyboard navigation in opt-in tablists (`data-tabs-nav`).
Showcase Tweaks panel now has explicit open/close control and is intentionally non-modal (`aria-modal="false"`, no hard `Tab` trap across the page).
