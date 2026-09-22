# Jinx UI Kit

Static Vite showcase plus in-repo UI kit packages.

## Visual Contract

- Source of truth: `C:\Users\kgn20\Downloads\jinx-ui.html` and the related `jinx-*` files.
- Default mode: `brutal`, radius `4px`.
- Secondary mode: `glass`, radius `14px`.
- Third mode: `minimal`, radius `14px`.
- The previous React approximation was removed because it changed the design.
- Current v1 direction: CSS-first (`jx-*`) with React runtime primitives in a separate package layer.

## Files

- `index.html`: showcase shell and interaction demo.
- `react-demo.html`: minimal runtime demo for `@jinx-ui/react`.
- `workspace-brutal.html`: full brutal-mode component page built through workspace packages.
- `public/jinx-preset.css`, `public/jinx-tailwind.css`: downloadable build artifacts.
- `src/jinx-*`: transferred source artifacts and baseline contract inputs.
- `packages/tokens`: token and mode variable contract (`brutal/glass/minimal`).
- `packages/core`: CSS primitives and skin integration.
- `packages/react`: React interactive primitives (core 8 runtime API).
- `src/design-contract.test.ts`: static contract tests for showcase and package boundaries.

## Commands

```bash
npm run dev
npm run verify
npm run test
npm run typecheck
npm run build
```

## Verification

1. Run `npm run test`.
2. Run `npm run typecheck`.
3. Run `npm run build`.
4. Or run `npm run verify` for the full local gate.
5. Open `http://127.0.0.1:5173/` after `npm run dev`.
6. Check first render is `brutal`.
7. Switch `Brutal`, `Glass`, `Minimal` in the Tweaks panel.
8. Confirm radii: `brutal = 4px`, `glass = 14px`, `minimal = 14px`.
9. Close and reopen Tweaks panel and verify `Escape` close; because it is non-modal (`aria-modal="false"`), `Tab` must continue through the page.
10. Check keyboard behavior for custom select and combobox in specimen.
11. Check that download buttons return `jinx-preset.css` and `jinx-tailwind.css`.
12. Open `http://127.0.0.1:5173/react-demo.html` and verify runtime primitives.
13. Open `http://127.0.0.1:5173/workspace-brutal.html` and verify all runtime components on a single brutal-mode page.

## Docs

- `docs/design-contract.md`
- `docs/components.md`
- `docs/testing.md`
- `docs/security.md`
- `docs/implementation-log.md`

## License

MIT. See [LICENSE](LICENSE).
