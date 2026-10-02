"use strict";
// Writes the three delivery emails to docs/emails/.
// They contain no placeholders and need no tool to regenerate — this script only exists so the
// copy stays consistent with docs/SHOP-CATALOG.md if the catalog ever changes.
// Usage: node ebooks/_shared/tools/prep-emails.cjs
const fs = require("fs");
const path = require("path");
const { ROOT } = require("./paths.cjs");
const { CANONICAL, bookOf, descriptions, shopLink, shopUrl, othersThan, downloadUrl, SITE } = require("./books.cjs");

const OUT = path.join(ROOT, "docs", "emails");
const token = (fs.readFileSync(path.join(ROOT, ".env"), "utf8").match(/DL_TOKEN\s*=\s*(.+)/) || [])[1];
if (!token) {
  console.error("DL_TOKEN is not set in .env.");
  process.exit(1);
}

const PAGES = { "career-leverage": 40, "real-engineering": 44, "ai-working-engineer": 55 };

const HIGHLIGHTS = {
  "career-leverage": [
    ["Get the promotion you were passed over for", "How to build the case for a raise before you ever ask, including the exact numbers to bring and the framing that survives a no."],
    ["Negotiate without burning the relationship", "Scripts for the conversation, what to do when they say &quot;it is not in the budget,&quot; and how to read a genuinely final no."],
    ["Make your work visible to the people who decide", "Influence tactics for the engineer whose work is excellent and completely invisible to leadership."],
    ["Walk into interviews already winning", "How to frame years of work as a story instead of a list of tickets, and the questions that decide senior-level loops."],
  ],
  "real-engineering": [
    ["Debug like the bug is a symptom", "A repeatable method for finding root causes instead of patching symptoms and shipping the same bug twice."],
    ["Architecture decisions with real trade-offs", "Monolith vs services, queues vs cron, consistency vs availability, written the way senior engineers actually reason."],
    ["CI/CD that does not slow you down", "Pipeline design, caching, flaky-test triage, and the metrics that tell you your pipeline is the bottleneck."],
    ["Know what is actually happening in prod", "Logging, metrics, tracing, and reading them under pressure to answer &quot;is it me or is it them?&quot; faster."],
  ],
  "ai-working-engineer": [
    ["Use LLMs without guessing", "Where models genuinely help in day-to-day work, where they quietly do not, and how to tell the difference before you ship."],
    ["RAG that survives real data", "Chunking, retrieval, and evaluation strategies, plus the failure modes that appear only once your documents get messy."],
    ["AI-assisted coding, properly", "Using assistants to move faster without shipping code you cannot explain, debug, or maintain."],
    ["Production AI, honestly", "Cost, latency, evaluation, and failure handling for putting AI features in front of real users."],
  ],
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function htmlFor(book, link) {
  const descs = descriptions();
  const highlights = HIGHLIGHTS[book.slug].map(([h, d]) => `
          <tr><td style="padding:0 0 14px">
            <div style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 3px">${esc(h)}</div>
            <div style="font-size:14px;line-height:1.65;color:#475569;margin:0">${esc(d)}</div>
          </td></tr>`).join("");

  const cross = othersThan(book.slug).map((s) => {
    const b = bookOf(s);
    return `
          <tr><td style="padding:0 0 16px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td width="86" valign="top" style="padding:0">
                <img src="${SITE}${b.cover}" width="74" alt="${esc(b.title)} cover" style="width:74px;height:auto;border-radius:6px;display:block;box-shadow:0 2px 8px rgba(15,23,42,.14)">
              </td>
              <td valign="top" style="padding:0 0 0 14px">
                <div style="font-size:15px;font-weight:700;margin:0 0 2px">
                  <a href="${esc(shopLink(s))}" style="color:#4338ca;text-decoration:none">${esc(b.title)}</a>
                </div>
                <div style="font-size:13px;color:#64748b;margin:0 0 5px">${esc(b.sub)} &middot; ${esc(b.price)}</div>
                <div style="font-size:13px;line-height:1.6;color:#475569;margin:0">${esc(descs[s] || "")}</div>
              </td>
            </tr></table>
          </td></tr>`;
  }).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(book.title)} — your copy is ready</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7">
<div style="display:none;max-height:0;overflow:hidden">Your ${esc(book.title)} copy is ready — download link inside.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:24px 12px">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(15,23,42,.10);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">

    <tr><td bgcolor="#667eea" style="background-color:#667eea;background-image:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:26px 32px">
      <div style="font-size:19px;font-weight:800;color:#ffffff;letter-spacing:-.2px;margin:0">Rohit Builds</div>
      <div style="font-size:13px;color:#e0e7ff;margin:3px 0 0">Ebooks for working engineers</div>
    </td></tr>

    <tr><td style="padding:32px 32px 8px">
      <p style="font-size:16px;line-height:1.6;color:#0f172a;margin:0 0 16px">Hi, and thank you for your order.</p>
      <p style="font-size:15px;line-height:1.65;color:#334155;margin:0 0 24px">
        Your copy of <strong style="color:#0f172a">${esc(book.title)}</strong> &mdash;
        ${esc(book.sub)} is ready to download.
      </p>
    </td></tr>

    <tr><td style="padding:0 32px 8px">
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px"><tr>
        <td align="center" bgcolor="#4338ca" style="border-radius:10px">
          <a href="${esc(link)}" style="display:inline-block;padding:15px 34px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px">Download ${esc(book.title)}</a>
        </td>
      </tr></table>
      <p style="font-size:12.5px;line-height:1.6;color:#64748b;margin:0 0 28px">
        If the button does not work, copy this link into your browser:<br>
        <a href="${esc(link)}" style="color:#4338ca;word-break:break-all">${esc(link)}</a>
      </p>
    </td></tr>

    <tr><td style="padding:0 32px 24px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px">
        <tr><td style="padding:18px 20px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="74" valign="top" style="padding-right:16px">
              <img src="${SITE}${book.cover}" width="74" alt="${esc(book.title)} cover" style="width:74px;height:auto;border-radius:6px;display:block;box-shadow:0 2px 10px rgba(15,23,42,.16)">
            </td>
            <td valign="top" style="font-size:13px;line-height:1.75;color:#475569">
              <strong style="color:#0f172a">${esc(book.title)}</strong><br>
              ${esc(book.sub)}<br>
              <span style="color:#94a3b8">${book.pages} pages &middot; PDF &middot; edition v1.0</span>
            </td>
          </tr></table>
        </td></tr>
      </table>
      <p style="font-size:12.5px;line-height:1.65;color:#94a3b8;margin:12px 0 0">
        This link is your personal copy, licensed to you. Please keep it to yourself rather than forwarding it.
      </p>
    </td></tr>

    <tr><td style="padding:0 32px 26px">
      <div style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 12px">What is inside</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${highlights}
      </table>
    </td></tr>

    <tr><td style="padding:0 32px 26px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f5f3ff" style="background-color:#f5f3ff;border-left:3px solid #7c3aed;border-radius:0 10px 10px 0">
        <tr><td style="padding:16px 20px">
          <div style="font-size:14.5px;font-weight:700;color:#4c1d95;margin:0 0 5px">This book keeps improving</div>
          <div style="font-size:13.5px;line-height:1.65;color:#5b21b6;margin:0">
            ${esc(book.title)} is a living book. When a revised edition ships, you get an email with the
            new file at no extra cost &mdash; no repurchase, no new payment. The link above always serves
            the latest edition.
          </div>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:0 32px 26px">
      <div style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 14px">Two more books you might want</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cross}
      </table>
      <p style="font-size:13.5px;line-height:1.6;color:#475569;margin:6px 0 0">
        <a href="${esc(shopUrl())}" style="color:#4338ca">Browse both in the shop</a>
      </p>
    </td></tr>

    <tr><td style="padding:0 32px 28px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px">
        <tr><td style="padding:16px 20px">
          <div style="font-size:12.5px;font-weight:700;color:#334155;margin:0 0 8px;letter-spacing:.4px;text-transform:uppercase">Order details</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;line-height:1.85;color:#475569">
            <tr><td width="110" style="color:#94a3b8">Book</td><td style="color:#334155">${esc(book.title)}</td></tr>
            <tr><td style="color:#94a3b8">Amount</td><td style="color:#334155">${esc(book.price)}</td></tr>
            <tr><td style="color:#94a3b8">Paid to</td><td style="color:#334155">8989059838@axisb</td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:0 32px 32px">
      <p style="font-size:14px;line-height:1.65;color:#334155;margin:0 0 6px">
        If anything above looks wrong, or the payment did not go through, just reply to this email.
        I fix it within 24 hours.
      </p>
      <p style="font-size:14px;line-height:1.65;color:#0f172a;margin:0 0 20px">Enjoy it.</p>
      <p style="font-size:14px;color:#0f172a;margin:0 0 2px">&mdash; Rohit</p>
      <p style="font-size:13px;color:#64748b;margin:0">Rohit Builds</p>
    </td></tr>

  </table>
</td></tr></table>
</body>
</html>
`;
}

fs.mkdirSync(OUT, { recursive: true });
for (const slug of CANONICAL) {
  const book = { ...bookOf(slug), slug, pages: PAGES[slug] };
  const file = path.join(OUT, `${slug}.html`);
  fs.writeFileSync(file, htmlFor(book, downloadUrl(token, slug)));
  console.log(`  wrote ${path.relative(ROOT, file)}`);
}
console.log(`\nsubject: Your ebook: <Title> — copy is ready`);
