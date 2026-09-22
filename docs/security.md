# Security Notes

## Rules

- No `innerHTML`, no `dangerouslySetInnerHTML`, anywhere in the packages or the showcase.
- Text and markup travel through `children` and `ReactNode` props.
- Treat every value a user types — tag input, combobox, toast text — as untrusted text, and never log it.
- No host `postMessage` integration and no Cloudflare `/cdn-cgi/` email-decode artifacts in shipped code.

## Applied

- Toast and tag chips build DOM nodes instead of assembling HTML strings.
- Obfuscated email placeholders were replaced with plain static text.
- Edit-mode host messaging and the dead modal trigger branch were removed.
- The toast stack carries an ARIA live region; dialogs carry dialog semantics, a focus trap and focus restore to the opener.

## Boundary

The packages are workspace-private and are consumed from this repository, so there is no npm supply chain to defend yet. What does exist is covered: every exported component renders in `smoke.test.tsx` with a spy on React warnings, dialog and keyboard flows have behaviour tests, and `src/design-contract.test.ts` fails if an unsafe API reappears in the source.

Before the packages are published, two things are still open: an accessibility audit against a real screen reader, and a decision about how consumers pin versions of the CSS layer, which is where a breaking change hurts most.
