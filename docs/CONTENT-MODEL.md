# Content Model — Rohit Builds

## General rules

- Page copy belongs in `src/content/pages/*.html` when the established raw-content pattern applies.
- News articles and certifications use Astro content collections.
- Route-specific code belongs in `src/pages/`.
- Reusable presentation belongs in `src/components/`.
- Public copy must match `BRAND.md` and `brand/voice.md`.

## News editions

Location: `src/content/news/*.md`

Required frontmatter:

```yaml
---
date: YYYY-MM-DD
label: "Edition label"
headlines:
  - "Headline"
---
```

Rules:

- Filename is `YYYY-MM-DD.md`.
- `date` is an ISO date.
- `label` is the editorial edition label.
- `headlines` is an ordered list of summary strings.
- Do not add schema fields until `src/content.config.ts` and this document are updated together.
- Preserve the news pipeline conventions in `news_portal.py`.

## Certifications

Location: `src/content/certifications/*.md`

Frontmatter fields are validated by `src/content.config.ts`. Existing fields include `date`, `title`, `issuer`, `description`, `url`, and optional `pdf`.

Rules:

- Keep descriptions concise and factual.
- Use HTTPS URLs where available.
- Store downloadable PDFs in `public/` and refer to them by site-root path.

## Page content

Location: `src/content/pages/*.html`

- Use route-keyed filenames established in `docs/SITE-STRUCTURE.md`.
- Store long-form HTML and page sections in these files.
- Import content with `?raw` and render it intentionally, not dynamically.
- Keep scripts and reusable layout outside raw content unless that content owns the page behavior.

## Shop products

The canonical catalog is `docs/SHOP-CATALOG.md`. Runtime product metadata in `src/scripts/shop.js` must mirror it exactly.

## Naming and copy

- Use “Rohit Builds” exactly.
- Never restore retired names such as “Education Reimagined” or “RBPN”.
- Keep page titles concise and consistent with route purpose.
- Use factual, confident, non-hyped language unless the page is intentionally promotional.
