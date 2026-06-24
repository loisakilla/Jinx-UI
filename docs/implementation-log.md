# Implementation Log

## 2026-05-20

### v1 Foundation

- Added in-repo package split:
  - `packages/tokens` for token + mode variable contract.
  - `packages/core` for CSS primitive layer.
  - `packages/react` for interactive React runtime primitives.

### Baseline Stabilization

- Added downloadable build artifacts in `public/` for:
  - `jinx-preset.css`
  - `jinx-tailwind.css`
- Removed dead modal trigger branch from runtime script artifacts.
- Fixed tweaks radius init guard to use `4px` baseline logic.
- Added tweaks panel dialog semantics and toast `aria-live` region.
- Added keyboard enhancement script for custom select and combobox in showcase runtime.

### React Runtime (core 8)

- Added controlled/uncontrolled primitives for:
  - button
  - input/textarea
  - select
  - combobox
  - tabs
  - toast
  - modal/drawer
  - accordion

### Testing and Docs

- Expanded static design contract tests for package boundaries and new baseline invariants.
- Added React behavior tests (`jsdom` + Testing Library) for keyboard/ARIA/runtime flows.
- Updated README and docs for package contract governance.

### Follow-up refinement

- Narrowed `@jinx-ui/core` default entry to primitive CSS only (`primitives.css` + `primitives-skins.css`).
- Moved full showcase CSS to separate opt-in export (`@jinx-ui/core/showcase`).
- Added runtime demo page (`react-demo.html` + `src/react-demo.tsx`) to validate React package consumption in Vite.
- Added keyboard/focus tests for `Accordion` and `Drawer`.
- Added CI workflow gate (`test`, `typecheck`, `build`) and local `npm run verify` shortcut.
- Added shared dialog accessibility hook for Modal/Drawer (focus trap + focus restore) and runtime tests.
- Hardened dialog a11y hook for edge-cases:
  - respects `event.defaultPrevented` for nested `Escape` handlers
  - restores trap when focus escapes container
  - skips hidden/inert focus targets
- Added modal `aria-describedby` wiring for message content.
- Added showcase Tweaks panel open/close control with keyboard handling; panel remains non-modal and does not hard-trap `Tab` across the page.
- Added `workspace-brutal.html` + `src/workspace-brutal.tsx`: a single-page brutal-mode demo that uses all available React runtime components directly from workspace packages.

## 2026-05-19

### Correction

The first implementation incorrectly rebuilt the design as a React approximation. That changed the visual result and was the wrong approach for this request.

The project was corrected to use the supplied Claude files as the source of truth.

### Transferred Files

- `C:\Users\kgn20\Downloads\jinx-ui.html` -> `index.html`
- `C:\Users\kgn20\Downloads\jinx-app.css` -> `src/jinx-app.css`
- `C:\Users\kgn20\Downloads\jinx-skins.css` -> `src/jinx-skins.css`
- `C:\Users\kgn20\Downloads\jinx-app.js` -> `src/jinx-app.js`
- `C:\Users\kgn20\Downloads\jinx-preset.css` -> `src/jinx-preset.css`
- `C:\Users\kgn20\Downloads\jinx-tailwind.css` -> `src/jinx-tailwind.css`

### Contract Changes

- Default style is `brutal`.
- Brutal radius tokens are `4px`.
- Glass radius tokens are `14px`.
- Minimal radius tokens are `14px`.
- The Tweaks panel default selection matches `brutal`.
- The radius control default shows `4px`.

### Cleanup

- Removed the discarded React approximation files.
- Removed React and Testing Library dependencies from `package.json`.
- Simplified Vite and Vitest config for a static app.
- Removed Cloudflare email-decode and Claude edit-mode host messaging.
- Replaced dynamic `innerHTML` usage with DOM node creation.

### Documentation

- Updated README and docs to describe the actual static transfer.
- Added a static design contract test that fails if the app drifts back into the React approximation or breaks the radius/default-mode contract.

### Verification Plan

- `npm run test`
- `npm run typecheck`
- `npm run build`
- Browser screenshot and manual mode switch check at `http://127.0.0.1:5173/`
