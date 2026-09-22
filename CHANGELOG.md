# Changelog

## 0.1.0 — unreleased

First version prepared for npm. The packages are not published yet; everything below is what a first publish would carry.

### Packages

- `@jinx-ui/tokens` — every `--jx-*` variable: themes, two style modes, radii, fonts, easing.
- `@jinx-ui/core` — the `jx-*` CSS layer with the tokens it reads; `./app` and `./skins` stay available separately.
- `@jinx-ui/react` — 40 components and 3 hooks, built to ESM with type declarations and a preserved `'use client'` entry.

### Fixed before the first release

- The `brutal` skin declared a second full palette — background, surfaces, borders, text, accent and all three shadows — on top of the theme it was meant to sit over. That is why it kept fighting the accent picker, and why removing the yellow took three passes. It carries shape only now: the 4px radius contract and a `--jx-edge` mixed from `--jx-text` and `--jx-bg`, which is what its hard borders and offset shadows are drawn in. Colour comes from `[data-theme]`, so one accent answers for every skin.
- The Tailwind preset claimed to map "the same single source of truth" and did not. Its accent was `#ff2d80` against a real `#c9a3ff`, its light accent `#c8155e` against `#6f3fcc`, `--color-ink-3` was a shade behind, the light block was missing the status colours and `--radius-jx-pill` entirely, it still exposed the deleted second accent, and its usage snippet named a package (`@jinx/ui`) that does not exist. It is regenerated from the tokens, and the contract test now compares all 34 mappings value by value.
- `.jx-hero-meta` laid out `repeat(4, 1fr)` for three items, leaving a quarter of the row empty.

- `JxModal`, `JxDrawer` and `JxToastViewport` rendered their overlay in place. `main, header, footer, section` carried `z-index: 1`, left over from the removed atmospheric orbs, so every section was a stacking context and an overlay at `z-index: 1200` was trapped inside one — the sticky nav at `z-index: 100` painted over a full-height drawer and hid its title and close button. The three overlays render through a portal on `document.body` now, and the vestigial `z-index` is gone.
- `.jx-drawer` declared `width: 320px; height: 360px` while the component overrode the height inline, and kept a border and a corner radius on the edge flush to the viewport. In brutal its hard offset shadow pointed off-screen. It is a proper side panel now: full height, flush, rounded and bordered on the inner edge only.
- The segmented tab drew its indicator at `calc(var(--jx-r) - 2px)` inside a tab rounded to `calc(var(--jx-r) - 4px)`, so the two radii disagreed by 2px and the corners showed a sliver of the tab beneath. The indicator inherits the radius.
- `JxCombobox` had no way to clear the query.
- The Tweaks accent picker still offered the lime swatch after the second accent was removed, and the hero still claimed three style modes.

- The `brutal` skin repainted `.jx-btn--alt` with `--jx-accent`, so the alt button was pixel-identical to the primary one; and it gave `.jx-btn--ghost` the same border and hard shadow as `.jx-btn--secondary`, which on the brutal dark palette (`--jx-bg` equal to `--jx-surface`) made the two indistinguishable. The second accent is gone and ghost is borderless.
- `--jx-accent-2` and the `alt` variant were removed from `JxButton`, `JxBadge`, `JxAvatar` and `JxSnippet`. One accent now carries the whole system.
- The brutal dark palette painted text, borders and shadows in `#f5ff3d`, which fought any accent the viewer picked. Those are neutral now; yellow survives only as the default accent.
- Every close button (`.jx-toast-close`, `.jx-modal-close`, `.jx-tw-close`) and `.jx-page-btn`, `.jx-cal-nav button` and `.jx-tw-color` inherited the browser default `padding: 1px 6px`, which pushed the icon off-centre by up to 2px.
- `.jx-kbd` carried a 2px bottom border for the keycap effect but symmetric padding, so the glyph sat 1px above the visual centre.
- `.jx-tabs--underline` put a 24px right margin on every tab including the last, so the rule under the tab strip ran 24px past the final tab.
- The toast countdown animated `width` on an element whose rounded parent had no `overflow: hidden`, so the square bar spilled past the corner radius; and the brutal skin hid the bar entirely. It animates `transform` inside a clipped parent now, and brutal gets a 4px bar.
- The brutal palette was declared twice, in `packages/tokens` and again in `jinx-skins.css`. The skins file carries rules only, and the contract test fails if a variable reappears there.
- No stylesheet honoured `prefers-reduced-motion`.
- Two components were missing outright: a password field and a date range picker.
- `JxSnippet` and `JxSnip` shipped classes that no stylesheet defined, so every snippet on the page — the specimen row and both install blocks — rendered as raw text with a default browser button and a zero-sized copy icon.
- The block snippet in the specimen declared `copyText` as its first line only, so its copy button put one import on the clipboard and dropped the other three lines.
- The `alt` snippet tone painted its prompt with `--jx-accent-2`, a token tuned as a background fill; as text it sits at 3.05:1 on white. The contract test now rejects any rule that inks text with it.
- The `glass` skin was removed. It differed from `minimal` only in blur and translucency, and the two were indistinguishable at a glance; the dead atmospheric-orb CSS it was the only consumer of went with it.
- The token palette was declared twice; the copy in `jinx-app.css` shadowed every theme value from the tokens package.
- Status colours had no light-theme values, so `--jx-success` sat at 1.9:1 on white.
- The `brutal` and `glass` skins overrode `.jx-chip` without `.jx-chip--active`, hiding the selected state.
- `JxToggle` positioned its indicator against the nearest positioned ancestor; both segmented indicators painted over a skin's accent fill.
- `JxPagination` trusted the page number it was given and left an empty collection navigable.
- `useDialogA11y` did not lock body scroll behind a modal; `useJxToastQueue` left timers running after unmount.
- `JxCalendar` days were unfocusable divs: the picker could not be used from the keyboard.
- `JxProgress` and `JxProgressCircle` announced unclamped values through `aria-valuenow`.
- The glass skin repainted `.jx-badge` and `.jx-tab` without their states: a solid badge lost its fill and kept dark ink on a dark pill, and an underline tab was drawn as a filled one.
- `.jx-tabs` and `.jx-toggle-group` declared themselves inline but were stretched by any column flex parent, leaving a segmented control with dead space beside its segments.
- Muted text, the danger button, the info avatar and the light-theme status tones sat below 4.5:1; every theme and skin is now checked by the contract test.
