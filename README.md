# Jinx UI

A small React component kit for loud interfaces: CSS-first, one `jx-*` namespace, two style modes, a TSX runtime animated with framer-motion.

Live specimen: **https://jinx-ui.vercel.app**

- 40 components and 3 hooks in `@jinx-ui/react`, all rendered on one page.
- Two style modes — `brutal` (default, radius `4px`) and `minimal` (`14px`) — switched at runtime through `data-style` on the document element.
- Light and dark themes through `data-theme`; every colour, radius, shadow and font comes from a `--jx-*` token.
- No `innerHTML`, no `dangerouslySetInnerHTML`, no global stores: every stateful primitive takes `value` / `defaultValue` / `onValueChange`.

## Not on npm

The three packages are built and ready to publish, but they are not on npm yet, so they are consumed straight from this repository — as a clone, or as a git submodule. That is how [Context Lab](https://github.com/loisakilla/context-lab) uses them.

```bash
git clone https://github.com/loisakilla/Jinx-UI.git
cd Jinx-UI
npm install
npm run dev
```

```tsx
import '@jinx-ui/core';
import { JxButton, JxModal } from '@jinx-ui/react';

<JxButton variant="primary">Ship it</JxButton>;
```

`@jinx-ui/core` pulls in `@jinx-ui/tokens` itself, so one import brings tokens, primitives and skins. The CSS layer works without the React runtime: the same `jx-*` markup can be written by hand.

## Packages

| Package | What it holds |
| --- | --- |
| `packages/tokens` | The only place `--jx-*` variables are declared: themes, style modes, radii, fonts, easing. |
| `packages/core` | `jx-*` CSS: `index.css` (everything), `./app` (components and page styles), `./skins` (style modes). |
| `packages/react` | The TSX runtime: 40 components and 3 hooks, re-exported from `src/runtime.ts` behind a `'use client'` boundary. |

## Repository

- `index.html`, `src/main.tsx` — the shell that mounts the showcase.
- `src/showcase/App.tsx` — hero, doctrine, install and the Tweaks panel.
- `src/showcase/Specimen.tsx` — 25 rows covering the component surface.
- `src/design-contract.test.ts` — static contract tests over the repository itself.
- `packages/react/src/components/*.test.tsx` — behaviour tests in jsdom.
- `docs/` — design contract, component notes, testing, security, implementation log.

## Commands

```bash
npm run dev        # vite dev server on http://127.0.0.1:5173/
npm run test       # vitest: contract tests plus jsdom behaviour tests
npm run typecheck  # tsc over the app and packages/react
npm run build      # typecheck, then vite build
npm run verify     # test, typecheck and build in one gate
```

CI runs `test`, `typecheck` and `build` on every push and pull request.

## Manual check after a visual change

1. `npm run dev`, open `http://127.0.0.1:5173/`.
2. The first render is `brutal`, radius `4px`.
3. Switch `Brutal` and `Minimal` in Tweaks; radii become `4px` and `14px`.
4. Switch the theme; status colours stay readable on both.
5. Open and close Tweaks with `Escape`; because the panel is non-modal (`aria-modal="false"`), `Tab` keeps moving through the page.
6. Walk the specimen with the keyboard: select, combobox, tabs, calendar, modal and drawer all have to be reachable and closeable.

## Docs

- [docs/design-contract.md](docs/design-contract.md) — what may and may not change.
- [docs/components.md](docs/components.md) — the component surface and where it is demonstrated.
- [docs/testing.md](docs/testing.md) — the two test layers and the rule for changing the contract.
- [docs/security.md](docs/security.md) — the rules that keep untrusted text out of the DOM.
- [docs/implementation-log.md](docs/implementation-log.md) — dated log of what changed and why.

## License

MIT. See [LICENSE](LICENSE).
