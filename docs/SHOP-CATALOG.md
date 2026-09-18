# Shop Catalog — Rohit Builds (CANONICAL)

Single source of truth for everything sold in the Shop. DO NOT change, reorder, reprice, or remove any product without the owner's explicit instruction. `src/scripts/shop.js` (the `PRODUCTS` array) MUST mirror this file exactly; if they ever disagree, this file wins.

## Payment

- UPI ID: `8989059838@axisb`
- Currency: INR, one-time payment
- Delivery: manual verification, ebook emailed within ~24 hours

## Catalog

| # | Slug | Title | Price (₹) | Cover image |
| :-- | :--- | :--- | :--- | :--- |
| 1 | `career-leverage` | Salary Booster | 499 | `/assets/img/salary-booster.jpg` |
| 2 | `real-engineering` | Bug Sniper | 599 | `/assets/img/bug-sniper.jpg` |
| 3 | `ai-working-engineer` | AI Arsenal | 699 | `/assets/img/ai-arsenal.jpg` |

Order slug is used by the order API and stored in purchase records — never change a slug. UPI intent links must include `am=<price>&cu=INR&tn=<slug>`.

## Book 1 — Salary Booster

- **Slug:** `career-leverage`
- **Title:** Salary Booster
- **Subtitle:** Career Leverage: From Junior to Senior
- **Description:** Promotions, salary negotiation, building influence, and interviews — the playbook for engineers who refuse to stay overlooked.
- **Price:** ₹499

## Book 2 — Bug Sniper

- **Slug:** `real-engineering`
- **Title:** Bug Sniper
- **Subtitle:** Real Engineering: Beyond the Tutorial
- **Description:** Production systems, debugging, architecture, CI/CD, and the trade-offs that actually matter after the tutorial ends.
- **Price:** ₹599

## Book 3 — AI Arsenal

- **Slug:** `ai-working-engineer`
- **Title:** AI Arsenal
- **Subtitle:** AI for Working Engineers
- **Description:** LLMs, RAG, AI-assisted coding, and production AI — practical tools for engineers who want to stay ahead of the shift.
- **Price:** ₹699

## Shop page copy

- Kicker: "Shop"
- Headline: "Ebooks for working engineers."
- Sub: "Three topics, three books — career leverage, real engineering, and working with AI. One-time price, delivered to your inbox."
- Books section header: "The books" / "Three books. One topic each."
- How-it-works steps: 1) Pay with UPI — Google Pay, PhonePe, or Paytm (amount shown on Get); 2) Fill the order form — name, email, UPI transaction ID; 3) Get the ebook — verified within 24 hours, delivered by email.

## Order API

- Base: `https://api.rohitbuildsapp.tech`
- Submit order: `POST /shop/order` with `{ ebook_slug, name, email, txn_id }`
- Order status: `POST /shop/status` with `{ email }`