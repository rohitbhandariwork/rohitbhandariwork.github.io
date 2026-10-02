# Shop Delivery Flow — Rohit Builds

How a paid order becomes an emailed ebook. The site has **no backend**: the buyer pays by UPI,
then sends you an order email, and you fulfill it by hand. Fulfillment is **manual by design**.

## Pipeline

```
Buyer pays UPI → buyer fills the shop form → their mail app opens a pre-written order
   to rohitbhandari.work@gmail.com (book, price, UPI id, name, email, txn_id, RBP-YYYYMMDD-nnnn)
   → they press Send
   → YOU verify the UPI txn in the bank app (amount + txn_id + payer name)
   → run deliver.cjs → Mail draft with the PDF attached or a download link → review → Send
   → row appended to deliveries/ledger.jsonl
```

The order reference is generated **client-side** in `src/scripts/shop.js`. There is no server
copy of the order; the ledger is your record of what you sent.

## Verify before you deliver

- Amount matches the book price: Salary Booster ₹499 · Bug Sniper ₹599 · AI Arsenal ₹699.
- `txn_id` in the order matches the bank/UPI notification.
- Email looks real (no obvious typo, no disposable-pattern address).
- One order = one book. Pass the **catalog slug** to `deliver.cjs` (folder names are accepted too):
  `career-leverage` · `real-engineering` · `ai-working-engineer`.

## Deliver — attachment (default)

```bash
node ebooks/_shared/tools/deliver.cjs <slug> "<Buyer Name>" <email> [orderId]
```

Opens a Mail draft with the PDF attached. Verified working: Mail's AppleScript must use
`make new to recipient at end of to recipients` — setting `toRecipient` to a string fails
with error `-1700` and silently drops you into the manual fallback.

## Deliver — download link

```bash
node ebooks/_shared/tools/deliver.cjs <slug> "<Buyer Name>" <email> [orderId] --link
```

Puts `https://rohitbhandariwork.github.io/dl/<token>/<file>.pdf` in the email body instead of
attaching. Needs `DL_TOKEN` in `.env` and the PDFs deployed under `dist/dl/<token>/` (below).
The ledger row records the exact `link` sent, so you can audit which buyer got which URL.

### Deploying the PDFs

```bash
npm run build
node ebooks/_shared/tools/deploy-dl.cjs            # copy into dist/dl/<token>/
node ebooks/_shared/tools/deploy-dl.cjs --check    # report sizes only, no copy
```

Then copy `dist/` onto `gh-pages` as usual.

## The download path

`/dl/<token>/` where the token is 12 random hex chars in `.env` (gitignored; `.env.example`
documents it). Properties:

- **Unguessable**, so the books are not discoverable by browsing or searching.
- `Disallow: /dl/` in `public/robots.txt`, and no page links to it, and it never enters the sitemap.
- **Not access control.** Anyone holding the URL can download and forward it. This is a
  deliberate trade-off, not a leak — the owner has decided that reach matters more than DRM.
  To invalidate every outstanding link, change `DL_TOKEN` and redeploy; the old path 404s.
- **Stable across editions.** Replacing the PDF at the same path keeps old links working,
  which is what makes the "living book" promise true: every past buyer re-downloads v1.1 by
  re-using their original link.

## Limits to know about

| Limit | Value | Consequence |
| :-- | :-- | :-- |
| GitHub hard file cap | 100 MB | `ai-arsenal.pdf` at 62.9 MB is under it but warns (>50 MB) |
| Published site cap | 1 GB | Currently ~160 MB of ~1 GB used |
| Repo history growth | +153 MB per full edition | ~6 editions before hitting the 1 GB *recommendation* |
| Bandwidth (soft) | 100 GB/month | ~650 full downloads/month |

`deploy-dl.cjs` refuses to copy when a file is missing or over 100 MB, and reports the total
`dist/` size, so GitHub never rejects a push mid-deploy. **The PDFs are already-compressed and
image-only (no text layer), so git cannot deduplicate them — every edition adds history that can
never be garbage-collected.** Check the repo size before publishing a new edition.

## The cross-sell

Every delivery email lists the other two titles with their catalog descriptions, read at
runtime from `docs/SHOP-CATALOG.md`, so pricing and copy can never drift from the canonical
catalog. Each entry deep-links to `/shop/#<slug>`, which opens that book's modal directly.

## Fallback if Mail isn't available

The command prints a `mailto:` link with the full body, plus either the attachment path or the
download link. Keep the version note in the email: the book is v1.0 and a **living book** —
refined editions go free to this buyer's email.

## The one user promise

The catalog promises delivery within ~24 hours and "refined editions free for buyers".
When you ship updates: replace the PDFs in `products/`, redeploy, and email past buyers from the
ledger (`email` column). The ledger is that list.

## Files

| Path | Role |
| :-- | :-- |
| `products/*.pdf` | canonical paid deliverables, gitignored, restored from your own copy |
| `ebooks/_shared/tools/deliver.cjs` | fulfillment: Mail draft, HTML preview, ledger row |
| `ebooks/_shared/tools/deploy-dl.cjs` | copy PDFs into `dist/dl/<token>/`, with size guard |
| `ebooks/_shared/tools/books.cjs` | catalog + slugs; reads descriptions from the canonical doc |
| `ebooks/_shared/tools/dl-config.cjs` | `.env` loading and token validation |
| `ebooks/_shared/tools/paths.cjs` | repo root and ledger paths |
| `deliveries/ledger.jsonl` | proof-of-delivery record (buyer PII, gitignored) |
