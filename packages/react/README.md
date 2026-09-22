# @jinx-ui/react

The React runtime for [Jinx UI](https://github.com/loisakilla/Jinx-UI): 40 components and 3 hooks over the `jx-*` CSS contract from `@jinx-ui/core`.

Live specimen: https://jinx-ui.vercel.app

```tsx
import '@jinx-ui/core';
import { JxButton, JxModal } from '@jinx-ui/react';

<JxButton variant="primary">Ship it</JxButton>;
```

## State model

Every stateful primitive is controlled from outside through `value` + `onValueChange` (or `open` + `onOpenChange`), and falls back to the uncontrolled mode through `defaultValue` / `defaultOpen`. Both modes are implemented once, in `useControllableState`. No global store, no context provider.

## Next.js App Router

The package entry carries `'use client'`, so the components drop into a server-component tree without a wrapper. `@jinx-ui/react/runtime` is the same surface without the directive, for generic browser bundling.

## Keyboard and ARIA

- Tabs: `ArrowLeft` / `ArrowRight` / `Home` / `End`; only the active tab stays in tab order.
- Modal and Drawer: focus trap, `Escape` to close, focus returned to the opener, body scroll locked while open.
- Select and Combobox: arrow navigation, type-ahead, `Escape` to close.

## Exports

| Entry | What it gives |
| --- | --- |
| `@jinx-ui/react` | All components and hooks, with `'use client'`. |
| `@jinx-ui/react/runtime` | The same exports without the directive. |

The CSS is a separate package: `@jinx-ui/core` brings tokens, component styles and both skins in one import.

## License

MIT.
