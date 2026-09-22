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

### Contrast and skin audit across six combinations

A script drove the built showcase through all three skins in both themes and measured every text node against the colour actually painted behind it, compositing translucent layers. The first pass reported invisible and sub-AA text in five of six combinations; the last pass reports none.

- The glass skin repainted `.jx-badge` and `.jx-tab` and did not cover their states, so a solid badge lost its fill and kept dark ink on a dark pill, and an underline tab was drawn as a filled one. Both are covered now, and the contract test derives the rule: a skin that repaints a component must repaint its states too.
- `--jx-text-3` failed AA as body text in both themes; it moved to `#8d84a8` on dark and `#6b6379` on light.
- The light-theme status tones, the danger button fill, the info avatar and the second accent's ink were all below 4.5:1 against the surfaces they sit on.
- Out-of-month calendar days were dimmer than 2:1 while staying clickable.
- The showcase forced its default accent as an inline custom property at mount, so switching to the light theme kept the dark accent and washed out every accented label. The accent now follows the theme until a preset is picked.
- `.jx-tabs` and `.jx-toggle-group` are `inline-flex` but were stretched by any column flex parent, which is what left a segmented control with dead space beside its segments. They carry `width: fit-content`, and the Tweaks rows opt into full width with equal segments.

The static contract test now recomputes contrast for text and status tokens against `--jx-bg` and `--jx-surface` in dark, light, brutal light and brutal dark, so a palette change that breaks readability fails the build without a browser.

## 2026-09-22

### The snippet row rendered as plain text

`JxSnippet` and `JxSnip` were written against `.jx-snippet`, `.jx-snippet-prompt`, `.jx-snippet-code`, `.jx-snippet-copy`, `.jx-snippet--block` and `.jx-snip` — none of which existed in the CSS layer, in any commit. The specimen row and both install blocks therefore drew unstyled spans: no mono font, no border, newlines collapsed by `white-space: normal`, and a copy button left at the browser default with a `0x0` icon. All six classes are defined now, with a brutal-skin pass so the snippet gets the same 2px border and hard shadow as the other surfaces.

Writing them surfaced two more defects in the row itself. The block snippet passed `copyText="import '@jinx-ui/core';"` while rendering four lines, so its copy button put one import on the clipboard and dropped the rest; the prop is gone and the component falls back to the whole string. And `scrollbar-width: thin` on the code element silently disabled the `::-webkit-scrollbar` rules meant to theme the bar — Chromium ignores the legacy pseudo-elements as soon as the standard property is set — so a block that overflowed drew the raw OS scrollbar. Block snippets wrap instead of scrolling now.

### A fill token was used as ink

The `alt` tone painted its prompt with `--jx-accent-2`. That token is tuned as a background, always paired with `--jx-accent-2-ink`, and as text it measures 3.05:1 on white — under the 4.5:1 floor this repository enforces everywhere else. Darkening the token was not an option: it would have dropped `.jx-badge--alt` and `.jx-avatar--alt` ink below the same floor. The prompt mixes 70% of the second accent into `--jx-text` instead, which measures 16.00 / 5.25 / 15.47 / 5.25 across minimal and brutal in both themes. The dead `.jx-codeblock .var` rule had the same defect and took the same fix, and the contract test now fails on any rule that paints text with a fill token.

### The glass skin was removed

Glass and minimal shared the same radius contract and differed only in backdrop blur and translucency, which made them read as one mode with a slightly softer background. Glass is gone: its block in `jinx-skins.css`, its selector in the tokens package, its entry in the Tweaks style switcher and the `.jx-atm` orb CSS it was the only consumer of — that markup was never rendered by the showcase at all. Two modes remain, `brutal` and `minimal`. The first sweep of the prose missed two lines — one of them in the README that ships with `@jinx-ui/react` — so the contract test now checks the tokens, the skins, the app CSS, both showcase files and every shipped README, and names the file that still carries the word. `CHANGELOG.md` and this log are deliberately outside it: they record what happened.

### A component-wide sweep across both skins and both themes

The snippet pass had only checked its own work, so the next look at the page turned up six defects it had walked past. Five were real, and the sweep that followed found five more.

**Two variants that painted the same pixels.** `[data-style="brutal"] .jx-btn--alt` repainted the alt button with `--jx-accent`, the primary button's own fill, so the two were identical whenever a viewer picked an accent. `.jx-btn--ghost` inherited brutal's 2px border and hard shadow from the base `.jx-btn` rule, and because the brutal dark palette set `--jx-bg` and `--jx-surface` to the same `#1a1726`, ghost and secondary were also indistinguishable. Ghost is borderless in brutal now, and the second accent is gone entirely: `--jx-accent-2`, `--jx-accent-2-ink` and the `alt` variant of `JxButton`, `JxBadge`, `JxAvatar` and `JxSnippet` were removed, and the contract test fails if any of them reappears. One accent carries the system.

**A palette that fought its own accent.** Brutal dark wrote `#f5ff3d` into `--jx-text`, `--jx-text-2`, `--jx-border`, `--jx-border-2`, `--jx-rule` and all three shadows. Every surface on the page was outlined in yellow regardless of the accent the viewer chose. Those tokens are neutral now; yellow survives as `--jx-accent`, which is what the Tweaks panel swaps.

**The browser default that nobody reset.** `.jx-toast-close`, `.jx-modal-close`, `.jx-tw-close`, `.jx-page-btn`, `.jx-cal-nav button` and `.jx-tw-color` all set an explicit width and height and centred their icon with `place-items: center`, but none of them reset the UA `padding: 1px 6px` on `<button>`. On a 20px toast close that leaves 8px of content box for a 12px icon, and the glyph lands 2px right of centre. A measurement pass over every button under 40px now reports zero offsets in all four skin-theme combinations.

**The keycap that sat too high.** `.jx-kbd` draws its keycap with `border-bottom-width: 2px` against 1px elsewhere, but kept symmetric `padding: 2px 6px`. With `box-sizing: border-box` that puts the content box centre half a pixel above the element centre. The padding is `3px 6px 2px` now, which cancels the extra border exactly.

**A rule that ran past its last tab.** `.jx-tabs--underline .jx-tab` carried `margin-right: 24px`, the last tab included, so the strip's `border-bottom` extended 24px beyond the final tab. The spacing moved to `gap` on the container.

**A countdown bar that escaped its corner.** `.jx-toast::after` animated `width` from 100% to 0 inside a `.jx-toast` that had a 14px radius and no `overflow: hidden`, so the square-ended bar drew outside the rounded corner; and `[data-style="brutal"] .jx-toast::after { display: none }` removed it from brutal altogether. The toast clips its children now, the bar animates `transform: scaleX()` instead of a layout property, and brutal gets a 4px bar in the accent.

**A palette declared twice.** `packages/tokens/src/index.css` and `jinx-skins.css` both carried the full brutal palette, 42 declarations, byte-identical. They had not drifted yet, and the change above would have had to be made in both. The skins file carries rules only now, and the contract test asserts that neither `jinx-app.css` nor `jinx-skins.css` declares a `--jx-*` at all.

Two components were missing rather than broken. `JxPasswordField` wraps the input with a reveal toggle that swaps `type` and reports itself through `aria-pressed`. `JxDateRangePicker` picks a span with a hover preview of the pending end date. Both it and `JxCalendar` now render a shared day grid, which is where the keyboard support landed: arrows by day and week, `Home` and `End` across the week, `PageUp` and `PageDown` by month, focus following the cursor across a month boundary. Each day's accessible name is its full date — a bare "17" told a screen reader nothing — which is why the calendar behaviour test now queries by date rather than by number. An earlier attempt put `role="grid"` and `role="gridcell"` on the container and the days; without `role="row"` between them that is an invalid grid, so the markup uses a labelled group of plain buttons instead.

Nothing on the page honoured `prefers-reduced-motion`. It does now.

Two things the sweep reported turned out to be measurement error rather than defects, and both are worth recording. A contrast pass that flipped `data-theme` and sampled 200ms later read the values mid-transition, because `body` carries `transition: background-color 200ms` and `getComputedStyle` returns the interpolated value; it reported 41 failures in brutal light and 51 in minimal light, including body text at a ratio of exactly 1.00. With transitions disabled the same pass reports zero failures in all four combinations, with the modal, the drawer and a toast open. Separately, an overflow check run while the preview pane had collapsed to zero width reported the button row spilling its column; at a real 1280px viewport there is no overflow anywhere.

### A second look, at the parts the sweep could not reach

A measurement pass only sees what is on screen. The overlays were shut for most of the first sweep, and what it did catch inside them was geometry rather than stacking — so four more defects surfaced once the drawer was actually opened and looked at.

The drawer was the deep one. `.jx-drawer` declared `width: 320px; height: 360px` while the component overrode the height inline with `100%`, and it kept a full border and a corner radius on the edge flush to the viewport; under brutal its `4px 4px 0` hard shadow pointed off-screen. Worse, its header was invisible. `main, header, footer, section { position: relative; z-index: 1 }` — a rule left over from the atmospheric orbs deleted with the glass skin — made every section a stacking context, so an overlay at `z-index: 1200` was trapped inside one and the sticky nav at `z-index: 100` painted over the drawer title and its close button. Raising the overlay would not have helped. The fix is to leave the tree: `JxModal`, `JxDrawer` and `JxToastViewport` render through a portal on `document.body`, the vestigial `z-index` is gone, and a hit test at the nav's own coordinates now returns the drawer.

The brutal skin also listed `.jx-drawer` among the surfaces it repaints with a `border: 2px solid` shorthand, which silently overrode the `border-right: 0` that makes a right-hand drawer sit flush. The drawer has its own brutal rule now.

The segmented tab drew its motion indicator at `calc(var(--jx-r) - 2px)` inside a tab rounded to `calc(var(--jx-r) - 4px)`. Two radii for one shape: at 14px that is 12px inside 10px, and the tab showed through at each corner. The indicator inherits the radius, so the two cannot disagree again.

`JxCombobox` had no way to clear what had been typed. The Tweaks accent picker still offered the lime swatch after the second accent was deleted, and the hero paragraph still claimed three style modes.

One note on measuring any of this. The preview pane stops painting when it is not the front window, which stops `requestAnimationFrame`, which stops framer-motion; overlays then sit at their `initial` state, `opacity: 0`, indefinitely. That is a harness artefact rather than a defect, but it is the same failure a headless renderer would show, and it is worth recording that these components are invisible until their enter animation runs. The `prefers-reduced-motion` block added earlier covers CSS animations only — framer-motion drives JS transforms and is not affected by it.

### The skin that was really a second theme

The yellow took three passes to remove, which is the tell that it was not a colour problem. `[data-style="brutal"]` declared a full palette — `--jx-bg`, three surfaces, three border tokens, four text tokens, the accent, its soft and ink partners, and all three shadows — layered on top of the `[data-theme]` palette it was supposed to sit over. A skin that redefines colour is a second theme wearing a skin's name, and every complaint so far traced back to it: the accent picker had no effect on the tokens brutal had already pinned, the borders were whatever brutal said they were, and each fix moved the yellow somewhere else rather than removing it.

Brutal carries shape now. It sets the 4px radius contract and one derived colour, `--jx-edge`, mixed as `color-mix(in oklab, var(--jx-text) 82%, var(--jx-bg))`, which is what its hard borders, rules and offset shadows are drawn in. Everything else comes from the theme. The mix is what fixes the second half of the complaint: at 82% the edge is a strong hard line in either direction rather than the stark near-white the earlier pass had left on dark. One accent now answers for every skin, and `[data-style="brutal"][data-theme="dark"]` is gone entirely.

Chasing the last of the yellow turned up the Tailwind preset, which nothing had checked. Its header claims it maps "the same single source of truth"; it did not. The accent was `#ff2d80` where the token said `#c9a3ff`, the light accent `#c8155e` against `#6f3fcc`, `--color-ink-3` a shade behind `--jx-text-3`, the light block missing every status colour and `--radius-jx-pill`, the deleted second accent still exposed, and the usage snippet importing `@jinx/ui`, a package that has never existed. The file is generated from the tokens now, and the contract test walks all 34 mappings on both themes and fails on any disagreement — a drift of one hex is enough.

`.jx-hero-meta` laid out `repeat(4, 1fr)` for three children, so a quarter of the row was an empty cell with a divider beside it. It is `repeat(auto-fit, minmax(220px, 1fr))`, which fills the row at any count and wraps on narrow screens.
