# Shop Delivery Flow — Rohit Builds

How a paid order becomes an emailed ebook. The site has **no backend**: the buyer pays by UPI,
then sends you an order email, and you fulfill it by hand. Fulfillment is **manual by design**.

## Pipeline

```
Buyer pays UPI → buyer fills the shop form → their mail app opens a pre-written order
   to rohitbhandari.work@gmail.com (book, price, UPI id, name, email, txn_id, RBP-YYYYMMDD-nnnn)
   → they press Send
   → YOU verify the UPI txn in the bank app (amount + txn_id + payer name)
   → YOU forward the saved email for that book — nothing to run, nothing to fill in
```

The order reference is generated **client-side** in `src/scripts/shop.js`. There is no server
copy of the order, so your inbox is the record of what was ordered and what you sent. The
optional `deliver.cjs` tool below writes a `deliveries/ledger.jsonl` row if you want a local
log, but the saved-email flow needs no tooling at all.

## Verify before you deliver

- Amount matches the book price: Salary Booster ₹499 · Bug Sniper ₹599 · AI Arsenal ₹699.
- `txn_id` in the order matches the bank/UPI notification.
- Email looks real (no obvious typo, no disposable-pattern address).
- One order = one book. Pass the **catalog slug** to `deliver.cjs` (folder names are accepted too):
  `career-leverage` · `real-engineering` · `ai-working-engineer`.

## Deliver — forward the saved email

**This is the whole flow.** Nothing to run, nothing to fill in.

1. Buyer pays, then emails you the order from the shop form.
2. Verify the UPI txn in your bank app (amount must match the book price).
3. In Mail, forward the saved delivery email for that book.

One draft per book is already sitting in Mail, addressed to you:

| Subject | Book |
| :-- | :-- |
| `Your ebook: Salary Booster` | Salary Booster, ₹499 |
| `Your ebook: Bug Sniper` | Bug Sniper, ₹599 |
| `Your ebook: AI Arsenal` | AI Arsenal, ₹699 |

Forward the matching one. Nothing to run, nothing to fill in, nothing to edit.

If Mail is ever reset, recreate them in one command:

```bash
osascript ebooks/_shared/tools/make-mail-drafts.applescript \
  "/Users/rohitbhandari/Library/Application Support/RohitBuilds/delivery-emails"
```

The same six source files (`.html` and `.txt` per book) are kept in that folder and in
`docs/emails/`, so you can also just open a file, select all, and paste into a new message.

AppleScript reads a file as Mac Roman unless told otherwise, which turns `—` into `‚Äî`. Both the
draft tool and `deliver.cjs` pass `as «class utf8»` on the read; keep that or the punctuation
breaks.

There are **no placeholders and no per-order edits** — the emails are complete as written, which
is why the buyer name, transaction id, and order reference are absent. The amount comes from the
catalog price, so a wrong figure cannot be sent. Each email carries the working download link,
four concrete highlights from that book, the living-book promise, and the other two titles
linking to `/shop/#<slug>`.

HTML is written for Gmail: table layout, inline styles only, `bgcolor` fallbacks beside every
gradient, and a preheader line for the inbox preview.

If the copy ever needs changing, `npm run emails` rewrites these three files from
`docs/SHOP-CATALOG.md`. You never need to run it to sell a book.

## Deliver — Mail draft (attachment or link)

Use this when you would rather let Apple Mail assemble the draft.

```bash
node ebooks/_shared/tools/deliver.cjs <slug> "<Buyer Name>" <email> [orderId]
node ebooks/_shared/tools/deliver.cjs <slug> "<Buyer Name>" <email> [orderId] --link
```

Without `--link` the PDF is attached; with it, the download URL goes in the body instead. Both
write a ledger row. Verified working: Mail's AppleScript must use
`make new to recipient at end of to recipients` — setting `toRecipient` to a string fails
with error `-1700` and silently drops you into the manual fallback.

## Deploying

```bash
npm run build
```

Then copy `dist/` onto `gh-pages` as usual. The PDFs sit in `public/dl/<token>/`, which the build
copies into `dist/` by itself — there is no second command and no separate deploy step.

## The download path

`/dl/<token>/` where the token is 12 random hex chars in `.env` (gitignored; `.env.example`
documents it). The PDFs live at `public/dl/<token>/<file>.pdf` in the working tree, gitignored so
they never enter git, and the build publishes them. Properties:

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

Check `dist/` size before pushing. **The PDFs are already-compressed and
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
When you ship updates: replace the PDFs in `public/dl/<token>/`, redeploy, and email past buyers from the
ledger (`email` column). The ledger is that list.

## Files

| Path | Role |
| :-- | :-- |
| `docs/emails/*.html` | the three finished delivery emails, committed and ready to forward |
| `public/dl/<token>/*.pdf` | canonical paid deliverables, gitignored, restored from your own copy |
| `ebooks/_shared/tools/prep-emails.cjs` | rewrites `docs/emails/` from the catalog; optional |
| `ebooks/_shared/tools/deliver.cjs` | fulfillment: Mail draft, HTML preview, ledger row |
| `ebooks/_shared/tools/make-mail-drafts.applescript` | recreates the three Mail drafts |
| `ebooks/_shared/tools/books.cjs` | catalog + slugs; reads descriptions from the canonical doc |
| `ebooks/_shared/tools/dl-config.cjs` | `.env` loading and token validation |
| `ebooks/_shared/tools/paths.cjs` | repo root and ledger paths |
| `deliveries/ledger.jsonl` | proof-of-delivery record (buyer PII, gitignored) |
