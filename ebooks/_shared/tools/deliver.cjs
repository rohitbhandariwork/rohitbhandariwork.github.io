"use strict";
// deliver.cjs — fulfillment tool: turn a verified shop order into an email draft.
// Usage: node ebooks/_shared/tools/deliver.cjs <slug> <name> <email> [orderId] [--link]
//   slug   : catalog slug (career-leverage | real-engineering | ai-working-engineer) — folder names also accepted
//   orderId: optional; recorded in the ledger and the subject line
//   --link : deliver a download URL instead of an attachment (needs DL_TOKEN and a deployed dist/dl/<token>/)
// Behavior: validates the PDF exists, opens a Mail draft for review/send, writes a branded HTML
//   preview, and appends a row to deliveries/ledger.jsonl. The email cross-sells the other
//   two titles, with descriptions read from docs/SHOP-CATALOG.md.
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { ROOT, LEDGER_DIR, LEDGER } = require("./paths.cjs");
const { loadEnv, requireToken } = require("./dl-config.cjs");
const { CANONICAL, bookOf, canonicalSlug, descriptions, shopLink, shopUrl, othersThan, downloadUrl, SITE } = require("./books.cjs");

const args = process.argv.slice(2);
const useLink = args.includes("--link");
const [slug, name, email, orderId] = args.filter((a) => !a.startsWith("--"));

if (!slug || !name || !email || !bookOf(slug)) {
  console.error(`usage: node ebooks/_shared/tools/deliver.cjs <slug> <name> <email> [orderId] [--link]`);
  console.error(`  slugs: ${CANONICAL.join(" | ")}   (folder names work too)`);
  process.exit(1);
}

const book = bookOf(slug);
const canon = canonicalSlug(slug);
const pdf = path.join(ROOT, book.pdf);
if (!fs.existsSync(pdf)) {
  console.error(`missing deliverable: ${pdf}`);
  console.error(`the paid PDFs are not in git — restore them from your own copy:`);
  for (const c of CANONICAL) console.error(`  ${bookOf(c).pdf}`);
  process.exit(1);
}

let linkUrl = null;
if (useLink) {
  const token = (loadEnv().DL_TOKEN || "").trim();
  if (!token) {
    console.error("--link needs DL_TOKEN. Set it in .env (see .env.example), then:");
    console.error(`  npm run build && node ebooks/_shared/tools/deploy-dl.cjs`);
    console.error(`or drop --link to deliver the PDF as an attachment instead.`);
    process.exit(1);
  }
  linkUrl = downloadUrl(token, canon);
  if (!linkUrl.endsWith("/" + book.file)) {
    console.error(`refusing to build a mismatched download URL: ${linkUrl}`);
    process.exit(1);
  }
}

const orderRef = orderId || "manual-" + Date.now().toString(36);
const subject = `Your ebook: ${book.title} (order ${orderRef})`;

const descs = descriptions();
const crossSell = othersThan(canon).map((s) => {
  const b = bookOf(s);
  const line = descs[s] ? `${b.title} (${b.price}) — ${descs[s]}` : `${b.title} (${b.price})`;
  return `  • ${line}`;
});

const bodyText = [
  `Hi ${name},`,
  ``,
  `Thanks for your order of ${book.title} — ${book.sub} (${book.price}).`,
  ``,
  linkUrl
    ? `Download your copy (v1.0): ${linkUrl}`
    : `Attached is your copy, v1.0.`,
  ``,
  `${book.title} is a living book: refined editions ship free to buyers. When an edition updates, you'll get an email with the new file — no repurchase, ever.`,
  ``,
  `Two more books you might want`,
  ...crossSell,
  `  Browse both: ${shopUrl()}`,
  ``,
  `Anything look off, or did the payment not attach, reply to this email and I'll fix it within 24 hours.`,
  ``,
  `— Rohit, Rohit Builds`,
].join("\n");

function esc(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function mailDraft() {
  const tmpl = path.join(os.tmpdir(), `deliver-${orderRef}.scpt`);
  const bodyFile = path.join(os.tmpdir(), `deliver-${orderRef}-body.txt`);
  fs.writeFileSync(bodyFile, bodyText);
  const attach = linkUrl ? "" : `      make new attachment with properties {file name:(POSIX file "${esc(pdf)}")} at after the last paragraph of content\n`;
  const scpt = `
on run
  tell application "Mail"
    set newMsg to make new outgoing message with properties {subject:"${esc(subject)}", content:"", visible:true}
    tell newMsg
      make new to recipient at end of to recipients with properties {address:"${esc(email)}"}
      set content of newMsg to (read (POSIX file "${esc(bodyFile)}"))
${attach}    end tell
    activate
  end tell
end run`;
  fs.writeFileSync(tmpl, scpt);
  const res = spawnSync("osascript", [tmpl], { encoding: "utf8", timeout: 20000, killSignal: "SIGKILL" });
  fs.unlinkSync(tmpl);
  fs.unlinkSync(bodyFile);
  res.detail = (res.stdout || "").trim() + (res.stderr || "").trim();
  return res;
}

function htmlPreview() {
  const file = path.join(LEDGER_DIR, `preview-${orderRef}.html`);
  fs.mkdirSync(LEDGER_DIR, { recursive: true });
  const delivery = linkUrl
    ? `<p style="font-size:14px;line-height:1.6;margin:0 0 14px">Your copy: <a href="${esc(linkUrl)}" style="color:#4338ca">${esc(linkUrl)}</a></p>`
    : `<p style="font-size:14px;line-height:1.6;margin:0 0 14px">Your copy is attached: v1.0.</p>`;
  const cross = othersThan(canon).map((s) => {
    const b = bookOf(s);
    const d = descs[s] ? ` — ${esc(descs[s])}` : "";
    return `<li style="margin:0 0 6px"><a href="${esc(shopLink(s))}" style="color:#4338ca"><strong>${esc(b.title)}</strong> (${esc(b.price)})</a>${d}</li>`;
  }).join("\n        ");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Email preview — ${book.title}</title></head>
<body style="margin:0;background:#f1f5f9;font-family:Inter,-apple-system,'Segoe UI',sans-serif;color:#1e293b">
<div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,.12)">
  <div style="padding:28px 28px 16px;background:linear-gradient(135deg,#667eea,#764ba2)">
    <div style="font-family:Manrope,sans-serif;font-size:20px;font-weight:800;color:#fff">Rohit Builds</div>
    <div style="font-size:13px;color:#e2e8f0;margin-top:2px">Ebooks for working engineers</div>
  </div>
  <div style="padding:24px 28px">
    <p style="font-size:16px;margin:0 0 14px">Hi ${name.replace(/[<>]/g, "")},</p>
    <p style="font-size:14px;line-height:1.6;margin:0 0 14px">Thanks for your order of <strong>${book.title}</strong> — ${book.sub} (<strong>${book.price}</strong>).</p>
    ${delivery}
    <table style="border-collapse:collapse;margin:8px 0 18px"><tr>
      <td style="vertical-align:top"><img src="${SITE}${book.cover}" style="width:132px;border-radius:8px;box-shadow:0 4px 14px rgba(15,23,42,.18)" alt="${book.title} cover"></td>
      <td style="vertical-align:top;padding-left:18px;font-size:13px;line-height:1.6;color:#475569">
        <strong style="color:#334155">Order</strong> ${orderRef}<br>
        <strong style="color:#334155">Book</strong> ${book.title}<br>
        <strong style="color:#334155">Paid</strong> ${book.price}<br>
        <strong style="color:#334155">Version</strong> v1.0<br>
        <strong style="color:#334155">Via</strong> ${linkUrl ? "download link" : "email attachment"}
      </td>
    </tr></table>
    <p style="font-size:14px;line-height:1.6;margin:0 0 14px">This is a <em>living book</em>: refined editions ship free to buyers. When an edition updates, you'll get an email with the new file — no repurchase, ever.</p>
    <p style="font-size:14px;font-weight:700;margin:0 0 6px">Two more books you might want</p>
    <ul style="font-size:13px;line-height:1.6;margin:0 0 16px;padding-left:20px">
        ${cross}
    </ul>
    <p style="font-size:14px;line-height:1.6;margin:0 0 14px">Anything look off? Reply to this email and I'll fix it within 24 hours.</p>
    <p style="font-size:14px;margin:0">— Rohit, Rohit Builds</p>
  </div>
</div></body></html>`;
  fs.writeFileSync(file, html);
  return file;
}

function logLedger(method) {
  fs.mkdirSync(LEDGER_DIR, { recursive: true });
  const row = {
    ts: new Date().toISOString(),
    order: orderRef,
    slug: canon,
    title: book.title,
    price: book.price,
    name,
    email,
    method,
    pdf: book.file,
  };
  if (linkUrl) row.link = linkUrl;
  fs.appendFileSync(LEDGER, JSON.stringify(row) + "\n");
}

const res = mailDraft();
const preview = htmlPreview();
if (res.status === 0) {
  logLedger(useLink ? "mail-draft-link" : "mail-draft");
  console.log(`draft opened in Mail → to ${email}`);
  if (linkUrl) {
    console.log(`download link: ${linkUrl}`);
    console.log(`cross-sell: ${othersThan(canon).map(bookOf).map((b) => b.title).join(", ")}`);
  } else {
    console.log(`known pdf file ok: ${book.file} (${(fs.statSync(pdf).size / 1048576).toFixed(1)} MB)`);
  }
  console.log(`review in Mail, then Send. html preview: ${preview}`);
  console.log(`ledger: ${LEDGER}`);
} else {
  logLedger(useLink ? "manual-fallback-link" : "manual-fallback");
  console.error(`osascript issue (${res.detail || "no output; see permissions note below"})`);
  console.error(`tip: first run, macOS asks to allow this terminal to control Mail — if it hung or was refused, use the fallback.`);
  console.log(`use the mailto fallback and attach the file yourself:`);
  console.log(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText.slice(0, 900))}`);
  if (linkUrl) console.log(`link to include: ${linkUrl}`);
  else console.log(`attachment to add manually: ${pdf}`);
  console.log(`html preview: ${preview}`);
  console.log(`ledger: ${LEDGER}`);
  process.exitCode = 2;
}
