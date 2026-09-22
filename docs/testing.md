# Testing

## Stack

- Vitest 4 with `environment: 'node'` as the default.
- jsdom plus Testing Library for behaviour tests; each such file opts in with a `// @vitest-environment jsdom` docblock.
- TypeScript and Vite for the build gate.
- GitHub Actions CI (`.github/workflows/ci.yml`) runs `test`, `typecheck` and `build` on push and pull request.

## Two layers

**Contract tests** — `src/design-contract.test.ts`, node environment. They read the repository as text and fail when it drifts from what the docs promise: the mounted TSX shell, the default `brutal` mode and the radius contract per style mode, one entry that ships tokens with skins, the full runtime export list, the component count claimed on the page and in the README, status-colour contrast on the light theme, an active state for chips in every skin, tokens declared in one file only, and the absence of files and claims that were removed.

**Behaviour tests** — `packages/react/src/components/*.test.tsx`, jsdom environment:

- `smoke.test.tsx` renders every exported component and fails on any React warning.
- `react-runtime.test.tsx` covers keyboard and ARIA flows: dialog `Escape`, focus trap, focus restore to the opener, select and combobox navigation, toast queue.
- `behaviour.test.tsx` walks the component surface: the controlled and uncontrolled contract, disabled semantics, label and error wiring in fields, menu and chip callbacks, clamped progress values, the toast queue, and that every component keeps both its own `jx-` class and the one a consumer passes.
- `regressions.test.tsx` pins bugs that were fixed once and must not come back.

## Rule for contract changes

1. Add or update a failing assertion in `src/design-contract.test.ts`.
2. Make the smallest change that satisfies it.
3. `npm run test`, `npm run typecheck`, `npm run build`, or `npm run verify` for all three.
4. Check the rendered page in the browser.

A claim that lives only in prose rots. When the docs or the showcase state a number or a promise — the component count, the radius per mode, a contrast floor — the contract test should derive it from the code instead of repeating it.

## What the contract currently pins

- The entry html is a thin shell that mounts `src/main.tsx`; no inline `<style>`, no showcase markup in html.
- Default style mode is `brutal`; radii are `4px` for brutal and `14px` for minimal, and the removed third skin is named nowhere in the tokens, the skins, the app CSS, the showcase or the shipped READMEs.
- `@jinx-ui/core` imports tokens, app CSS and skins from one entry.
- `--jx-*` variables are declared in `packages/tokens` only.
- Light-theme `success`, `warning`, `danger` and `info` reach 4.5:1 on white; the test computes the contrast.
- Every skin that restyles `.jx-chip` also restyles `.jx-chip--active`.
- `jinx-app.css` and `jinx-skins.css` declare no `--jx-*` variables at all; the tokens package is the only place a variable is written.
- Every `--color-*`, `--radius-jx*`, `--font-*`, `--shadow-jx*` and `--ease-jx*` in the Tailwind preset equals the `--jx-*` token it mirrors, on both themes.
- The runtime exports the full component and hook list.
- The specimen keeps 25 rows.
- The showcase and the README state the same component count as the runtime exports.
- Removed artifacts stay removed: `react-demo.html`, `workspace-brutal.html`, `public/jinx-*.css`, `src/jinx-*`, the old React approximation, `dist` in git.
- Prototype host messaging, Cloudflare email decode and unsafe HTML insertion are not shipped.
