# SEO and Discovery — Rohit Builds

## Page metadata

Every public page should define:

- A concise, unique `title`.
- A meaningful `description`.
- A canonical path appropriate for GitHub Pages.
- Relevant Open Graph metadata where supported.
- A clear heading structure beginning with one primary `h1`.

Use `BaseLayout title="..."` and add page-specific metadata when the layout supports it.

## Canonical identity

- Brand name: Rohit Builds.
- Public domain: `https://rohitbhandariwork.github.io/`.
- Legacy `/portfolio/` routes to `/` and must not become competing canonical destinations.

## Sitemap and discovery

Keep these synchronized:

- Astro routes.
- `public/llms.txt`.
- `public/llms-full.txt`.
- Sitemap configuration and generated output.
- `docs/SITE-STRUCTURE.md`.

## Content quality

- Titles describe the actual page purpose.
- Descriptions summarize rather than repeat a slogan.
- Link text describes its destination.
- News articles use stable routes and meaningful headlines.
- Do not keyword-stuff or duplicate page metadata.

## Social previews

When adding page-specific previews:

- Use the brand indigo/violet palette only when it supports readability.
- Keep the brand name and page purpose legible at small sizes.
- Avoid text-heavy images.

## Structured data

Use structured data only for factual, visible page content. Do not add organization or person schema that conflicts with `BRAND.md`.
