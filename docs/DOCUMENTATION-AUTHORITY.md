# Documentation Authority — Rohit Builds

This document defines precedence and ownership among repository documentation.

## Read order

Before making a change, read:

1. `AGENTS.md` for repository workflow and guardrails.
2. `README.md` for project setup and architecture.
3. `BRAND.md` plus `brand/voice.md` and `brand/visual.md` for brand behavior and style.
4. `docs/SITE-STRUCTURE.md` for routes and content ownership.
5. The domain-specific source of truth named below.

## Source-of-truth hierarchy

1. A canonical document controls its named domain.
2. Existing implementation is descriptive only unless it is explicitly canonical in this hierarchy.
3. Code must be updated if a source-of-truth document changes.
4. If documents disagree, stop and report the conflict before editing when the disagreement changes behavior or public copy.

## Canonical documents

| Domain | Source of truth |
| :--- | :--- |
| Agent workflow | `AGENTS.md` |
| Brand and positioning | `BRAND.md` |
| Brand voice | `brand/voice.md` |
| Visual design | `brand/visual.md` and `public/assets/css/brand.css` |
| Routes and content ownership | `docs/SITE-STRUCTURE.md` |
| Top navigation | `docs/TOPBAR.md` |
| Shop catalog | `docs/SHOP-CATALOG.md` |
| Shop delivery | `docs/SHOP-DELIVERY.md` |
| Flashcard UX | `docs/FLASHCARD-DESIGN.md` |
| Components and interactions | `docs/COMPONENTS.md` |
| Accessibility | `docs/ACCESSIBILITY.md` |
| Content models | `docs/CONTENT-MODEL.md` |
| Testing | `docs/TESTING.md` |
| Deployment | `docs/DEPLOYMENT.md` |
| Analytics and privacy | `docs/ANALYTICS.md` |
| SEO and machine-readable discovery | `docs/SEO.md` |
| Security | `docs/SECURITY.md` |

## Sync requirements

- Route changes update `docs/SITE-STRUCTURE.md`, `public/llms.txt`, `public/llms-full.txt`, and redirect code as applicable.
- Navigation changes update `docs/TOPBAR.md` and the Topbar implementation together.
- Brand or visual changes update `BRAND.md`, `brand/visual.md`, and `public/assets/css/brand.css` as applicable.
- Catalog changes update `docs/SHOP-CATALOG.md`, `src/scripts/shop.js`, and checkout behavior together.
- Content-model changes update the relevant schema or frontmatter loader and existing content.
