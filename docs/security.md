# Security Notes

## Current Rules

- Do not use `innerHTML`.
- Do not use `dangerouslySetInnerHTML`.
- Do not keep Claude edit-mode `postMessage` integration in shipped code.
- Do not keep Cloudflare `/cdn-cgi/` email decode artifacts.
- Treat tag input values as untrusted text.
- Do not log user input.

## Applied Hardening

- Replaced toast HTML string insertion with DOM node creation.
- Replaced tag chip HTML string insertion with DOM node creation.
- Replaced obfuscated email placeholders with plain static text.
- Removed edit-mode host messaging.
- Removed dead modal trigger branch from shipped runtime.
- Added ARIA live region on toast stack and dialog semantics on tweaks panel.

## Remaining Boundary

This is still a static showcase. Before turning it into a production package, each interactive primitive needs focused behavioral tests and accessibility review.
