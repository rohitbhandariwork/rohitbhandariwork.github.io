# Topbar — Single Source of Truth

One navigation bar, used by every page. Do not define another nav anywhere else; if a page needs the topbar, render `<Topbar slot="topbar" ... />`.

Implementation: `src/components/topbar/Topbar.astro`. This document is the human/agent specification for navigation; keep both in sync.

## Target information architecture

The topbar presents five primary categories and Contact:

1. Portfolio
2. Education
3. Applications
4. News
5. Shop
6. Contact

Keep labels concise and avoid emojis in navigation items.

## Exact nav order

| # | Item | Label | Href | Active when |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Portfolio | Portfolio | `/` | `active === 'portfolio'` or `active === 'home'` |
| 2 | Education | Education ▾ | Dropdown | `active === 'education'` or `active === 'courses'` |
| 2a | Bot Buddies | Ages 4–7 | `/applications/4-7/` | `active === 'applications'` and optional age state |
| 2b | Code Kids | Ages 8–11 | `/applications/8-11/` | `active === 'applications'` and optional age state |
| 2c | Code Quest | Ages 12–15 | `/applications/12-15/` | `active === 'applications'` and optional age state |
| 2d | AI Lab | Ages 15–17 | `/applications/15-17/` | `active === 'applications'` and optional age state |
| 2e | Career Launcher | Ages 18+ | `/applications/18+/` | `active === 'applications'` and optional age state |
| 3 | Applications | Applications ▾ | Dropdown | `active === 'applications-tools'` |
| 3a | PomoFlow | PomoFlow | `/pomoflow/` | `active === 'pomoflow'` |
| 3b | Flashcard | Flashcard | `/flashcard/` | `active === 'flashcard'` |
| 3c | Interview | Interview | `/interview/` | `active === 'interview'` |
| 3d | Jobtool | Jobtool | `/jobtool/` | `active === 'jobtool'` |
| 4 | News | News | `/news/` | `active === 'news'` |
| 5 | Shop | Shop | `/shop/` | `active === 'shop'` |
| 6 | Contact | Contact | `/#contact` | `active === 'contact'` |

## Education dropdown

Education owns the five age-group entry points and course destinations:

- Ages 4–7 — Bot Buddies
- Ages 8–11 — Code Kids
- Ages 12–15 — Code Quest
- Ages 15–17 — AI Lab
- Ages 18+ — Career Launcher

A direct link to `/courses/` should remain available as the first education destination. Course modules inherit `active="education"` or `active="courses"` for backward compatibility.

## Applications dropdown

Applications owns standalone tools:

- PomoFlow
- Flashcard
- Interview
- Jobtool

The existing application age hubs belong under Education, not Applications.

## Props

| Prop | Type | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `active` | `string` | none | Which nav item receives the active state |
| `backHref` | `string \| null` | `null` | Optional Back link rendered left of the hamburger |
| `variant` | `'flashcard' \| 'pomoflow' \| 'interview' \| 'shop' \| 'jobtool' \| 'quiz'` | none | Renders page-specific utility controls |

## Active values

Use these values consistently:

- `portfolio`
- `education`
- `applications-tools`
- `pomoflow`
- `flashcard`
- `interview`
- `jobtool`
- `news`
- `shop`
- `contact`

Backward-compatible values `home` and `courses` may remain mapped to Portfolio and Education until all pages are migrated.

## Usage

Top-level page:

```astro
<Topbar slot="topbar" active="education" />
```

App or tool page:

```astro
<Topbar slot="topbar" active="pomoflow" backHref="/" variant="pomoflow" />
```

Course module page:

```astro
<Topbar slot="topbar" active="education" backHref="/courses/bot-buddies/" variant="quiz" />
```

## Responsive rules

- The desktop layout uses text labels and dropdown menus.
- The mobile hamburger reveals the same categories and destinations.
- Dropdown items remain keyboard accessible and expose their open state.
- Portfolio and flagship destinations News and Shop remain visible at the top level.
- Education and Applications use dropdowns to prevent the topbar from becoming overcrowded.

## Rules

- Never hardcode topbar links in an `.astro` page or imported `?raw` HTML file.
- Never add, remove, or relabel an item without updating this file and `src/components/topbar/Topbar.astro` together.
- The active highlight uses `.nav-links a.active` styling from `public/assets/css/brand.css`.
- `toggleNav()` is defined in `src/scripts/nav.js` and injected by `BaseLayout`.
- `portfolio.astro` is a redirect page and legitimately renders no topbar.
