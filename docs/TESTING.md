# Testing — Rohit Builds

## Required checks

Before completing a change, run:

```bash
npm run astro check
npm run build
```

Run additional checks when a change affects an interaction or content collection.

## Build validation

- The build completes without collection or route regressions.
- `./dist/` is generated.
- Dynamic routes resolve and have valid output paths.
- Raw HTML content imports successfully.
- News and certification collections are not accidentally empty.
- Static assets referenced by `/`-root paths are present.

## Functional validation

Test primary journeys by page type:

- Portfolio home: navigation, social links, certifications, anchors, contact actions.
- News: edition listing and article routes.
- Courses: course routes and collapsible curriculum controls.
- Applications: age-specific route content and interactive controls.
- Flashcards: onboarding, review, grading, progress, and reset behavior.
- Interview: chat/result flows and timer behavior.
- PomoFlow: timer, session, break, and reset behavior.
- Jobtool: form validation and generated output.
- Shop: catalog, checkout selection, and delivery instructions.

## Responsive validation

Test at narrow mobile, tablet, laptop, and wide desktop widths. Confirm:

- No horizontal overflow.
- Topbar menu behavior is usable.
- Cards and grids collapse correctly.
- Text remains readable.
- Controls do not overlap or become inaccessible.

## Accessibility validation

Follow `docs/ACCESSIBILITY.md`. Validate keyboard focus, labels, semantics, contrast, zoom, reduced motion, and dynamic status announcements.

## Before deployment

- Verify `main` contains the source change.
- Verify `npm run build` succeeds.
- Deploy only the contents of `./dist/` to `gh-pages`.
- Smoke-test the deployed routes on GitHub Pages.
