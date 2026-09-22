# Changelog

## 0.1.0 — unreleased

First version prepared for npm. The packages are not published yet; everything below is what a first publish would carry.

### Packages

- `@jinx-ui/tokens` — every `--jx-*` variable: themes, three style modes, radii, fonts, easing.
- `@jinx-ui/core` — the `jx-*` CSS layer with the tokens it reads; `./app` and `./skins` stay available separately.
- `@jinx-ui/react` — 38 components and 3 hooks, built to ESM with type declarations and a preserved `'use client'` entry.

### Fixed before the first release

- The token palette was declared twice; the copy in `jinx-app.css` shadowed every theme value from the tokens package.
- Status colours had no light-theme values, so `--jx-success` sat at 1.9:1 on white.
- The `brutal` and `glass` skins overrode `.jx-chip` without `.jx-chip--active`, hiding the selected state.
- `JxToggle` positioned its indicator against the nearest positioned ancestor; both segmented indicators painted over a skin's accent fill.
- `JxPagination` trusted the page number it was given and left an empty collection navigable.
- `useDialogA11y` did not lock body scroll behind a modal; `useJxToastQueue` left timers running after unmount.
