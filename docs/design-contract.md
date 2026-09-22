# Design Contract

## Source of truth

The design started as a static prototype and was transferred into this repository once; the prototype is no longer a reference. Today the source of truth is the repository itself:

- `packages/tokens/src/index.css` — every `--jx-*` variable, per theme and per style mode. Nothing else may declare one.
- `packages/core/src/jinx-app.css` and `jinx-skins.css` — the `jx-*` classes and the three skins.
- `src/showcase/Specimen.tsx` — how each component is supposed to look and behave.

A change to any of the three is a contract change and goes through the governance steps below.

## Style modes

| Mode | Role | Radius |
| --- | --- | --- |
| `brutal` | Default look: 2px borders, hard offset shadows, monospace | `4px` |
| `glass` | Translucent look with backdrop blur | `14px` |
| `minimal` | Quiet base look | `14px` |

The radius contract covers `--jx-r-xs`, `--jx-r-sm`, `--jx-r`, `--jx-r-lg`, `--jx-r-xl` and `--jx-r-pill`. Runtime switching between the three modes must keep working; it is a plain `data-style` attribute on the document element, with `data-theme` for light and dark.

A skin may restyle a component, but then it owns that component's states too. `.jx-chip--active` was invisible under `brutal` and `glass` for exactly this reason, and the contract test now derives the list of skins from the stylesheet and demands an active state from each.

## Colour

Status colours (`--jx-success`, `--jx-warning`, `--jx-danger`, `--jx-info`) are theme-specific: a palette tuned on a dark background falls apart on a light one. The light theme declares its own values, and the contract test computes their contrast against white and requires 4.5:1.

## Package contract

- `packages/tokens` — token and mode variables. No component behaviour, no React.
- `packages/core` — the `jx-*` CSS layer. `index.css` imports tokens, app styles and skins, so one import is enough; `./app` and `./skins` stay available for a consumer who wants them apart.
- `packages/react` — the TSX runtime over the same `jx-*` classes: 38 components and 3 hooks, exported from `src/runtime.ts` behind `'use client'`.

Invariants:

- The `jx-*` namespace is stable; a second naming system is not introduced.
- Every stateful primitive exposes the controlled pair (`value` + `onValueChange`, `open` + `onOpenChange`) and an uncontrolled default (`defaultValue`, `defaultOpen`), both implemented by `useControllableState`.
- Keyboard and ARIA behaviour matches what the specimen demonstrates.
- The React entry stays client-boundary compatible for the Next.js App Router.

## Governance

Before merging a contract-affecting change:

1. Name the layer it touches: tokens, CSS, or runtime behaviour.
2. Add a failing assertion to `src/design-contract.test.ts` first.
3. Keep the `jx-*` namespace and the three style modes working.
4. Run the gate: `npm run test`, `npm run typecheck`, `npm run build`, or `npm run verify`.
5. Update `README.md` and `docs/*` in the same commit when public behaviour changes. A number stated in prose should be derived by a test, not retyped.
