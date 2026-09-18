# Visual — Rohit Builds

Design tokens for the site, extracted from `public/assets/css/brand.css`. That CSS file is the single source of truth; keep this doc in sync when the CSS changes.

## Brand colors

| Token | Value | Use |
| :--- | :--- | :--- |
| `--indigo` | `#667eea` | Primary brand color, links, buttons, accents |
| `--violet` | `#764ba2` | Secondary brand color |
| `--deep-indigo` | `#4338ca` | Deep emphasis, focused states |
| `--soft-indigo` | `#818cf8` | Soft accent, active states |

## Gradients

| Token | Value | Use |
| :--- | :--- | :--- |
| `--gradient-brand` | `linear-gradient(135deg, #667eea, #764ba2)` | Headings, hero text, primary buttons |
| `--gradient-subtle` | `linear-gradient(135deg, #f8fafc, #e2e8f0)` | Section backgrounds |
| `--gradient-dark` | `linear-gradient(135deg, #1e293b, #0f172a)` | Dark bands/footers |
| `--gradient-warm` | `linear-gradient(135deg, #f59e0b, #ef4444)` | Warnings/highlights |

## Age-group colors

Each of the 5 age groups has a two-color identity:

| Group | Primary | Secondary |
| :--- | :--- | :--- |
| Ages 4-7 (Bot Buddies) | `#f472b6` (pink) | `#fbbf24` (amber) |
| Ages 8-11 (Code Kids) | `#34d399` (green) | `#60a5fa` (blue) |
| Ages 12-15 (Code Quest) | `#f59e0b` (amber) | `#ef4444` (red) |
| Ages 15-17 (AI Lab) | `#8b5cf6` (violet) | `#06b6d4` (cyan) |
| Ages 18+ (Career Launcher) | `#667eea` (indigo) | `#764ba2` (violet) |

## Neutrals

Slate scale: `#0f172a` (dark), `#1e293b`, `#334155`, `#64748b`, `#94a3b8`, `#e2e8f0`, `#f1f5f9`, `#f8fafc` (light), plus `#fff`.

## Typography

| Token | Stack | Use |
| :--- | :--- | :--- |
| `--font` | Manrope | UI, headings, buttons |
| `--font-reading` | Inter | Body text |
| `--font-editorial` | Playfair Display | Editorial/large headings |
| `--font-mono` | JetBrains Mono | Code, technical labels |

Loaded via Google Fonts (Manrope, Inter, Playfair Display, JetBrains Mono).

## Shape and effects

- Card radius: ~16px; pills/buttons rounded.
- Hover: subtle lift/scale (e.g. age cards shrink on hover with a soft shadow) and color transitions.
- Age-card icons sit on a 10% tint of their group color.
- Layout uses flexbox/grid sections, max-width ~800px content containers, generous vertical padding.

## Components reference

- Topbar: emoji-less text nav with active-state highlight (Home, Portfolio, Applications dropdown, Courses, Pomoflow, Flashcard, Interview, Jobtool, Shop, News, Contact).
- Button system: `.btn`, `.btn-outline`, `.btn-primary`, gradient fills.
- Age cards: `.age-card` grid on the homepage.

## Open questions to fill in together

- [FILL IN] Any accent color for the personal portfolio page distinct from the education branding.
- [FILL IN] Dark mode — currently light-first; decide if a dark variant is wanted.
- [FILL IN] Logomark: none today; decide if a simple mark is wanted (name-only is the current treatment).
- [FILL IN] Whether Playfair Display (editorial) should extend beyond news/editorial sections.