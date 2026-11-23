# Components and Interactions — Rohit Builds

## Principles

- Use plain Astro components and plain HTML/CSS/JavaScript.
- Reuse a component instead of duplicating markup, styling, or behavior.
- Keep page content in `src/content/pages/*.html` or content collections where established patterns apply.
- Use shared design tokens from `public/assets/css/brand.css`; do not invent page-local colors or fonts.
- Preserve the light-only visual identity.

## Layout

Every public page wraps content with `BaseLayout` and includes `Topbar` and `Footer` slots unless the page has a documented exception.

```astro
<BaseLayout title="Page title">
  <Topbar slot="topbar" active="..." />
  <main>Content</main>
  <Footer slot="footer" />
</BaseLayout>
```

## Component ownership

| Component area | Responsibility |
| :--- | :--- |
| `src/components/topbar/` | Global navigation and responsive menu |
| `src/components/footer/` | Global footer |
| `src/components/home/` | Portfolio-home sections |
| `src/components/course/` | Course and curriculum structures |
| `src/components/news/` | News editorial UI |
| `src/components/ui/` | Small reusable UI patterns |

Before creating a component, search existing component directories and shared CSS for an equivalent.

## Interaction rules

- Use semantic HTML controls: links for navigation and buttons for actions.
- Do not use JavaScript to replace native behavior without a necessary reason.
- Preserve visible state and keyboard focus on menus, dialogs, toggles, tabs, and form validation.
- Escape user-derived content and never interpolate untrusted HTML.
- Do not add dependencies for interactions that plain JavaScript can implement safely.
- Motion must be optional and respect `prefers-reduced-motion`.

## Styling rules

- Reuse existing `.btn`, card, layout, spacing, radius, and shadow classes when applicable.
- Keep media-query behavior in shared CSS where a pattern is reusable.
- Avoid adding component-specific names that duplicate an existing global pattern.
- Prefer CSS custom properties from `brand.css` over literal values.

## Review checklist

- Desktop and mobile layouts remain readable.
- Interactive elements have clear hover, active, focus, and disabled states.
- The component has no inaccessible keyboard trap or focus loss.
- Empty, loading, error, and success states are defined where applicable.
- The page is usable without a mouse and without JavaScript for static content.
