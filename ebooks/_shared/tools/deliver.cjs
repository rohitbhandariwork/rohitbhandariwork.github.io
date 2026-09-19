// deliver.cjs — fulfillment tool: turn a verified shop order into an email draft with the ebook attached.
// Usage: node ebooks/_shared/tools/deliver.cjs <slug> <name> <email> [orderId]
//   slug   : catalog slug (career-leverage | real-engineering | ai-working-engineer) — folder names also accepted
//   orderId: optional; recorded in the ledger and the subject line
// Behavior: validates the PDF exists, opens a Mail draft (attachment attached) for review/send,
//   writes a branded HTML preview, and appends a row to deliveries/ledger.jsonl.
"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..", "..");
const LEDGER_DIR = path.join(ROOT, "deliveries");
const LEDGER = path.join(LEDGER_DIR, "ledger.jsonl");

const BOOKS = {
  "career-leverage": { dir: "salary-booster", title: "Salary Booster", sub: "Career Leverage: From Junior to Senior", price: "₹499", cover: "/assets/img/salary-booster.jpg" },
  "salary-booster": { dir: "salary-booster", title: "Salary Booster", sub: "Career Leverage: From Junior to Senior", price: "₹499", cover: "/assets/img/salary-booster.jpg" },
  "real-engineering": { dir: "bug-sniper", title: "Bug Sniper", sub: "Real Engineering: Beyond the Tutorial", price: "₹599", cover: "/assets/img/bug-sniper.jpg" },
  "bug-sniper": { dir: "bug-sniper", title: "Bug Sniper", sub: "Real Engineering: Beyond the Tutorial", price: "₹599", cover: "/assets/img/bug-sniper.jpg" },
  "ai-working-engineer": { dir: "ai-arsenal", title: "AI Arsenal", sub: "AI for Working Engineers", price: "₹699", cover: "/assets/img/ai-arsenal.jpg" },
  "ai-arsenal": { dir: "ai-arsenal", title: "AI Arsenal", sub: "AI for Working Engineers", price: "₹699", cover: "/assets/img/ai-arsenal.jpg" },
};

const [slug, name, email, orderId] = process.argv.slice(2);
if (!slug || !name || !email || !BOOKS[slug]) {
  console.error(`usage: node ebooks/_shared/tools/deliver.js <slug> <name> <email> [orderId]`);
  console.error(`  slugs: ${Object.keys(BOOKS).slice(0, 3).join(" | ")}   (folder names work too)`);
  process.exit(1);
}

const book = BOOKS[slug];
const pdf = path.join(ROOT, "ebooks", book.dir, "dist", `${book.dir}.pdf`);
if (!fs.existsSync(pdf)) {
  console.error(`missing deliverable: ${pdf}`);
  console.error(`run first:  node ebooks/_shared/tools/render-book.cjs ${book.dir}`);
  process.exit(1);
}

const orderRef = orderId || "manual-" + Date.now().toString(36);
const subject = `Your ebook: ${book.title} (order ${orderRef})`;

const bodyText = [
  `Hi ${name},`,
  ``,
  `Thanks for your order of ${book.title} — ${book.sub} (${book.price}). Attached is your copy, v1.0.`,
  ``,
  `${book.title} is a living book: refined editions ship free to buyers. When an edition updates, you'll get an email with the new file — no repurchase, ever.`,
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
  const scpt = `
on run
  tell application "Mail"
    set newMsg to make new outgoing message with properties {subject:"${esc(subject)}", content:"", visible:true}
    set toRecipient of newMsg to "${esc(email)}"
    tell newMsg
      set theBody to read (POSIX file "${esc(bodyFile)}")
      set content of newMsg to theBody
      make new attachment with properties {file name:(POSIX file "${esc(pdf)}")} at after the last paragraph of content
    end tell
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
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Email preview — ${book.title}</title></head>
<body style="margin:0;background:#f1f5f9;font-family:Inter,-apple-system,'Segoe UI',sans-serif;color:#1e293b">
<div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,.12)">
  <div style="padding:28px 28px 16px;background:linear-gradient(135deg,#667eea,#764ba2)">
    <div style="font-family:Manrope,sans-serif;font-size:20px;font-weight:800;color:#fff">Rohit Builds</div>
    <div style="font-size:13px;color:#e2e8f0;margin-top:2px">Ebooks for working engineers</div>
  </div>
  <div style="padding:24px 28px">
    <p style="font-size:16px;margin:0 0 14px">Hi ${name.replace(/[<>]/g, "")},</p>
    <p style="font-size:14px;line-height:1.6;margin:0 0 14px">Thanks for your order of <strong>${book.title}</strong> — ${book.sub} (<strong>${book.price}</strong>). Your copy is attached: v1.0.</p>
    <table style="border-collapse:collapse;margin:8px 0 18px"><tr>
      <td style="vertical-align:top"><img src="https://rohitbuilds.dev${book.cover}" style="width:132px;border-radius:8px;box-shadow:0 4px 14px rgba(15,23,42,.18)" alt="${book.title} cover"></td>
      <td style="vertical-align:top;padding-left:18px;font-size:13px;line-height:1.6;color:#475569">
        <strong style="color:#334155">Order</strong> ${orderRef}<br>
        <strong style="color:#334155">Book</strong> ${book.title}<br>
        <strong style="color:#334155">Paid</strong> ${book.price}<br>
        <strong style="color:#334155">Version</strong> v1.0
      </td>
    </tr></table>
    <p style="font-size:14px;line-height:1.6;margin:0 0 14px">This is a <em>living book</em>: refined editions ship free to buyers. When an edition updates, you'll get an email with the new file — no repurchase, ever.</p>
    <p style="font-size:14px;line-height:1.6;margin:0 0 14px">Anything look off? Reply to this email and I'll fix it within 24 hours.</p>
    <p style="font-size:14px;margin:0">— Rohit, Rohit Builds</p>
  </div>
</div></body></html>`;
  fs.writeFileSync(file, html);
  return file;
}

function logLedger(method) {
  fs.mkdirSync(LEDGER_DIR, { recursive: true });
  const row = { ts: new Date().toISOString(), order: orderRef, slug, title: book.title, price: book.price, name, email, method, pdf: path.basename(pdf) };
  fs.appendFileSync(LEDGER, JSON.stringify(row) + "\n");
}

const res = mailDraft();
const preview = htmlPreview();
if (res.status === 0) {
  logLedger("mail-draft");
  console.log(`draft opened in Mail → to ${email}`);
  console.log(`known pdf file ok: ${path.basename(pdf)} (${(fs.statSync(pdf).size / 1048576).toFixed(1)} MB)`);
  console.log(`review in Mail, then Send. html preview: ${preview}`);
  console.log(`ledger: ${LEDGER}`);
} else {
  logLedger("manual-fallback");
  console.error(`osascript issue (${res.detail || "no output; see permissions note below"})`);
  console.error(`tip: first run, macOS asks to allow this terminal to control Mail — if it hung or was refused, use the fallback.`);
  console.log(`use the mailto fallback and attach the file yourself:`);
  console.log(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText.slice(0, 900))}`);
  console.log(`attachment to add manually: ${pdf}`);
  console.log(`html preview: ${preview}`);
  console.log(`ledger: ${LEDGER}`);
  process.exitCode = 2;
}