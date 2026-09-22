# @jinx-ui/core

CSS for Jinx UI: imports `@jinx-ui/tokens` and provides every `jx-*` class used by `@jinx-ui/react` components and the showcase page.

```ts
import '@jinx-ui/core';
```

Set `data-style="brutal|minimal"` and `data-theme="dark|light"` on the document root to switch visual modes.

## Consuming it

`@jinx-ui/core` imports `@jinx-ui/tokens` by package name from CSS, so it needs a bundler that resolves bare specifiers in `@import` (Vite, webpack, Next.js, Parcel all do). For a plain `<link>` setup, concatenate `@jinx-ui/tokens/src/index.css`, `./src/jinx-app.css` and `./src/jinx-skins.css` yourself.

Live specimen: https://jinx-ui.vercel.app
