# Testing

## Stack

- Vitest
- TypeScript
- Vite
- GitHub Actions CI (`.github/workflows/ci.yml`)

The stack now has two test layers:

- Static contract tests for showcase and package boundaries.
- React runtime behavior tests (`jsdom` + Testing Library) for interactive primitives.
- Dialog a11y tests cover `Escape`, focus trap (`Tab` loop), and opener focus restore.
- Dialog edge-case tests cover nested `Escape` handling (`preventDefault`) and modal `aria-describedby`.
- Contract tests use structural JSDOM assertions for key DOM/ARIA invariants instead of brittle attribute-order string matching.
- Contract tests also verify runtime sync between inline showcase scripts (`index.html`) and `src/jinx-app.js`.

## TDD Rule

For each design contract change:

1. Add or update a failing assertion in `src/design-contract.test.ts`.
2. Apply the smallest HTML/CSS/JS change.
3. Run `npm run test`.
4. Run `npm run typecheck`.
5. Run `npm run build`.
6. Optional shortcut: `npm run verify`.
7. Browser-check the rendered page.

## Current Coverage

- `index.html` is the transferred static showcase shell.
- The specimen inventory remains 25 rows.
- Default mode is `brutal`.
- `brutal` radius is `4px`.
- `glass` and `minimal` radius is `14px`.
- Source artifacts are present in `src/jinx-*`.
- Download artifacts are present in `public/`.
- Package split exists in `packages/tokens`, `packages/core`, `packages/react`.
- `packages/core` default entry stays primitive-focused; showcase CSS is opt-in.
- Vite build keeps both `index.html` and `react-demo.html` entries.
- CI runs `test`, `typecheck`, and `build` on push and pull request.
- Old React approximation files are absent.
- Prototype host messaging, Cloudflare email decode, and unsafe HTML insertion APIs are not shipped.
