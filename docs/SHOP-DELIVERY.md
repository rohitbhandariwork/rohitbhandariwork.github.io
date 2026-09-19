# Shop Delivery Flow — Rohit Builds

How a paid order becomes an emailed ebook. Works with the current no-backend site +
external order API (`https://api.rohitbuildsapp.tech`). Fulfillment is **manual by design**:
a human verifies the payment, then the draft is one command away.

## Pipeline

```
Buyer pays UPI → submits order {ebook_slug, name, email, txn_id} via /shop/order
   → order visible via /shop/status {email}
   → YOU verify the UPI txn in the bank app (amount + txn_id + payer name)
   → run deliver.js → Mail draft with PDF attached → review → Send
```

## Verify before you deliver

- Amount matches the book price: Salary Booster ₹499 · Bug Sniper ₹599 · AI Arsenal ₹699.
- `txn_id` in the order matches the bank/UPAI notification.
- Email looks real (no obvious typo, no disposable-pattern address).
- One order = one book. The order API stores `ebook_slug` — the deliver command takes
  that **catalog slug**, not the folder name (folder names are accepted too).

## Deliver

```bash
node ebooks/_shared/tools/deliver.cjs <slug> "<Buyer Name>" <email> [orderId]
```

Examples:

```bash
node ebooks/_shared/tools/deliver.cjs career-leverage "Priya Sharma" priya@example.com ORD-1001
node ebooks/_shared/tools/deliver.cjs real-engineering "Rahul Verma" rahul@example.com
node ebooks/_shared/tools/deliver.cjs ai-working-engineer "Ananya Rao" ananya@example.com
```

Slugs (`ebook_slug`): `career-leverage` · `real-engineering` · `ai-working-engineer`

## What the command does

1. Resolves the book, validates the rendered PDF exists:
   `ebooks/<dir>/dist/<dir>.pdf` (render first with `npm run render-ebooks` if missing).
2. Opens a **Mail draft** (attachment attached, To + subject + plain-text body filled)
   for you to review and press Send.
3. Writes a branded HTML preview:
   `deliveries/preview-<order>.html` (visual only; Mail gets the text body).
4. Appends a ledger row to `deliveries/ledger.jsonl`
   (`ts, order, slug, title, price, name, email, method, pdf`).

`deliveries/` is gitignored (buyer PII). The ledger is your proof-of-delivery record for
support and refund queries.

## Fallback if Mail isn't available

The command prints a `mailto:` link and the path to the PDF; attach the file manually.
Keep the version note in the email: the book is v1.0 and a **living book** — refined
editions go free to this buyer's email.

## The one user promise

The catalog promises delivery within ~24 hours and "refined editions free for buyers".
When you ship updates: re-render the PDFs, re-run `deliver.js` per past buyer from the
ledger, and the email says "your free refined edition". The ledger's `email` column is
that list.