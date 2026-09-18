# Topbar — Single Source of Truth

One navigation bar, used by every page. Do not define another nav anywhere else; if a page needs the topbar, render `<Topbar slot="topbar" ... />`.

Implementation: `src/components/topbar/Topbar.astro`. That file is the code source of truth; this doc is the human/agent spec. Keep both in sync.

## Nav items (exact order — do not reorder)

| # | Item | Label | Href | Active when |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Home | 🏠 Home | `/` | `active === 'home'` |
| 2 | Applications | 📱 Applications ▾ (dropdown) | — | `active === 'applications'` (highlights the dropdown trigger) |
| 2a–2e | Ages | 👶 Ages 4–7, 🧒 Ages 8–11, 🧑 Ages 12–15, 🎓 Ages 15–17, 💼 Ages 18+ | `/applications/4-7`, `/applications/8-11`, `/applications/12-15`, `/applications/15-17`, `/applications/18+` | — |
| 3 | Courses | 📚 Courses | `/courses/` | `active === 'courses'` |
| 4 | Pomoflow | 🍅 Pomoflow | `/pomoflow/` | `active === 'pomoflow'` |
| 5 | Flashcard | 🃏 Flashcard | `/flashcard/` | `active === 'flashcard'` |
| 6 | Interview | 🎤 Interview | `/interview/` | `active === 'interview'` |
| 7 | Jobtool | 📝 Jobtool | `/jobtool/` | `active === 'jobtool'` |
| 8 | Shop | 🛒 Shop | `/shop/` | `active === 'shop'` |
| 9 | News | 📰 News | `/news/` | `active === 'news'` |
| 10 | Contact | ✉️ Contact | `/#contact` | `active === 'contact'` |

All ten items render on every page. Sub-pages set `active` to their section (e.g. a course module uses `active="courses"`; the applications hubs use `active="applications"`).

## Props

| Prop | Type | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `active` | `string` | none | Which nav item gets the `.active` class. Values in the table above. |
| `backHref` | `string \| null` | `null` | Optional "← Back" link rendered left of the hamburger. Omit on top-level pages; use on app/course pages. |
| `variant` | `'flashcard' \| 'pomoflow' \| 'interview' \| 'shop' \| 'jobtool' \| 'quiz'` | none | Renders page-specific extras: `flashcard` shows the level/gems mini-pill, `pomoflow` shows the stats panel. Other values set no extra UI but may be passed for semantics. |

## Usage

Top-level and content pages:

```astro
<Topbar slot="topbar" active="courses" />
```

App / tool pages (add Back + active + optional variant):

```astro
<Topbar slot="topbar" active="pomoflow" backHref="/" variant="pomoflow" />
```

Course module pages:

```astro
<Topbar slot="topbar" active="courses" backHref="/courses/bot-buddies/" variant="quiz" />
```

## Rules

- Never hardcode nav links in an `.astro` page or an imported `?raw` HTML file. Use this component only.
- Never add, remove, or relabel an item without updating this file and the component together.
- The active highlight uses `.nav-links a.active` styling from `public/assets/css/brand.css`.
- `toggleNav()` (mobile hamburger) is defined in `src/scripts/nav.js`, injected by `BaseLayout`.
- `portfolio.astro` is a pure redirect page and legitimately renders no topbar.