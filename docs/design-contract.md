# Design Contract

## Source

The accepted design source is the supplied Claude export:

- `C:\Users\kgn20\Downloads\jinx-ui.html`
- `C:\Users\kgn20\Downloads\jinx-app.css`
- `C:\Users\kgn20\Downloads\jinx-skins.css`
- `C:\Users\kgn20\Downloads\jinx-app.js`
- `C:\Users\kgn20\Downloads\jinx-preset.css`
- `C:\Users\kgn20\Downloads\jinx-tailwind.css`

The project now transfers that design directly. It is not a React recreation.

## Required Modes

| Mode | Role | Radius |
| --- | --- | --- |
| `brutal` | Default look | `4px` |
| `glass` | Secondary translucent look | `14px` |
| `minimal` | Quiet base look | `14px` |

The mode radius contract applies to standard Jinx radius tokens:

- `--jx-r-xs`
- `--jx-r-sm`
- `--jx-r`
- `--jx-r-lg`
- `--jx-r-xl`
- `--jx-r-pill`

## Allowed Changes From Source

- Default `data-style` is changed from the prototype default to `brutal`.
- Brutal radii are changed from `0px` to `4px`.
- Glass and minimal radii are normalized to `14px`.
- Cloudflare email-decode and Claude edit-mode host messaging are removed.
- Dynamic `innerHTML` insertion is replaced with DOM node creation.

No layout reinterpretation is allowed without an explicit new design decision.

## v1 Package Contract

The in-repo package split is part of the v1 contract:

- `packages/tokens`: source of truth for token and mode-level CSS variables.
- `packages/core`: `jx-*` CSS primitive layer (default entry), with showcase CSS as opt-in export.
- `packages/react`: interactive runtime primitives using the same `jx-*` contract.

Runtime mode switching for `brutal`, `glass`, and `minimal` must remain supported.

## Public API (v1)

### `@jinx-ui/tokens`

- Public surface:
  - mode-level CSS variables for `brutal`, `glass`, `minimal`
  - radius token contract (`--jx-r-xs`, `--jx-r-sm`, `--jx-r`, `--jx-r-lg`, `--jx-r-xl`, `--jx-r-pill`)
- Non-goals:
  - no component behavior
  - no React runtime logic

### `@jinx-ui/core`

- Public surface:
  - `jx-*` CSS primitive classes for core 8
  - primitive skin composition
  - optional showcase CSS export (separate from primitive-first default)
- Invariant:
  - `jx-*` namespace is stable during v1

### `@jinx-ui/react`

- Public surface:
  - interactive primitives for core 8:
    - button
    - input/textarea
    - select/combobox
    - tabs
    - toast
    - modal/drawer
    - accordion
  - controlled/uncontrolled contracts (`value` + `onChange`/`onValueChange` + `defaultValue`)
- Runtime invariants:
  - keyboard and ARIA behavior aligned with showcase contract
  - client-boundary compatibility for Next App Router

## Contract Governance

Before merging any contract-affecting change:

1. Confirm scope: token layer, primitive CSS layer, or React runtime behavior.
2. Preserve `jx-*` namespace unless migration is explicitly approved.
3. Keep mode-switch runtime support for all three modes (`brutal/glass/minimal`).
4. Update `src/design-contract.test.ts` with a failing assertion first.
5. Run local gate: `npm run test`, `npm run typecheck`, `npm run build` (or `npm run verify`).
6. Update docs (`README` + `docs/*`) when public behavior changes.

The repository must not introduce a parallel “second UI kit” until v1 extraction is complete.
