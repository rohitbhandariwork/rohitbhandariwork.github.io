# Security — Rohit Builds

## Scope

The site is a static Astro site without a backend. Security risks are primarily in dependencies, external links, third-party scripts, content injection, and accidental secret publication.

## Secrets

- Never commit API keys, access tokens, passwords, certificates, or private credentials.
- `.env.example` is documentation only; do not put real values in it.
- Do not deploy secrets into `dist/` or `gh-pages`.
- Static public files must be assumed readable by anyone.

## Content and markup

- Render static raw HTML only from trusted repository content.
- Escape dynamic or user-derived values used in HTML or JavaScript.
- Do not add `innerHTML` sinks for untrusted input.
- Validate external URLs before exposing them as links.
- Avoid executable third-party embeds unless explicitly required and reviewed.

## Dependencies

- Pin or review dependency changes.
- Run the build and Astro checks after dependency upgrades.
- Prefer small, maintenance-friendly dependencies.
- Remove unused packages instead of accumulating supply-chain risk.

## Browser storage

- Do not store secrets or payment credentials in localStorage or sessionStorage.
- Treat all browser-storage data as user-editable.
- Validate stored values before application use.

## External services

Document any API or data exchange in `docs/ANALYTICS.md` and `docs/SECURITY.md` before implementation.

## Reporting and fixes

Document a clear responsible-disclosure contact on the repository or remove private vulnerability details from public pages. Fix exploitable issues before unrelated visual work.
