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

## 2026-09-22

### Defects found by rendering every component

- Added `smoke.test.tsx`: renders all exported components with a spy on React warnings. It immediately caught two invented props in the test itself and five real defects.
- `JxToggle` positioned its indicator against the nearest positioned ancestor, so it stretched across the page; the button got `position: relative`.
- Both segmented indicators painted `--jx-surface` over a button a skin had already filled with the accent colour, hiding the active label. The colour moved into CSS where a skin can override it.
- `JxPagination` trusted the page number it was given: a page past the end left every button unhighlighted and kept Next enabled on an empty collection. The page is clamped now.
- `useDialogA11y` trapped focus but let the page behind a modal scroll; it locks body overflow and restores the previous value, nested dialogs included.
- `useJxToastQueue` left dismiss timers running after unmount; they are cleared on dismiss, clear and unmount.
- The contract test asserted that `dist` does not exist, which holds only until the first build. It now asserts what it meant: no build output is tracked by git.

### Licensing and entry points

- Added the MIT license and `license` fields to the root and the three packages.
- Renamed the `@jinx-ui/core` subpath `./tokens` to `./app`, which is what it actually exports.

### Theme defects found by dressing another project in the library

Context Lab switched its own interface to `brutal` light, which surfaced three problems:

- The token palette lived in two files — `packages/tokens/src/index.css` and a full copy at the top of `jinx-app.css`, imported later. Every theme value in the tokens package was silently overridden, the light theme rendered dark-tuned status colours, and generated documentation described values the runtime never used. The copy is gone; the contract test fails if `jinx-app.css` declares any `--jx-*`.
- Status colours had no light-theme values: `--jx-success` sat at 1.9:1 on white. The light theme declares its own, and the test computes the contrast instead of trusting the hex.
- `.jx-chip--active` was overridden by the `brutal` and `glass` skins, so a selected chip looked unselected. Both skins carry an active state, and the test derives the list of skins from the stylesheet.

### Documentation caught up with the code

- README described `react-demo.html`, `workspace-brutal.html`, `public/jinx-*.css` and `src/jinx-*`, all removed long ago, and pointed at a source file on a personal machine. Rewritten around what the repository actually contains, with the live specimen link.
- The install block on the site offered `npm i @jinx-ui/core @jinx-ui/react` while the packages are workspace-private and absent from npm. It now says so and shows the clone.
- The hero claimed 25 components and `~30kb gz`; the runtime exports 38 and the size was never measured. The count is derived from the runtime at render time, and the contract test checks that the README and the showcase agree with it.
- `docs/testing.md` described a single contract layer and a build entry that no longer exists; `docs/components.md` described "core 8" and a deleted runtime script; `docs/design-contract.md` pointed at prototype files on a personal machine.

### Behaviour audit across the component surface

`behaviour.test.tsx` walks the whole kit: the controlled and uncontrolled contract, disabled semantics, keyboard paths, field wiring, overlays, the toast queue, and attribute forwarding. Writing it found two defects.

- `JxCalendar` rendered its days as `motion.div` with an `onClick`. The date picker could not be reached from the keyboard and a screen reader saw plain numbers. Days are buttons now, with `aria-pressed` on the selected one and `aria-current="date"` on today; the CSS carries the button reset so the grid looks the same.
- `JxProgress` and `JxProgressCircle` clamped the bar but announced the raw number, so a value of 150 drew a full bar and told assistive tech "150 out of 100". Both now clamp once and report the clamped value.

Two apparent failures turned out to be exit animations rather than defects: a drawer and a toast stay mounted while framer-motion plays them out, so the assertions wait for removal.
