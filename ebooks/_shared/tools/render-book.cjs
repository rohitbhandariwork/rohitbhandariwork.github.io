// render-book.cjs — turn ebook manuscripts into a single, styled, printable book (HTML + PDF).
// Usage: node ebooks/_shared/tools/render-book.cjs           -> render all three books
//        node ebooks/_shared/tools/render-book.cjs salary-booster  -> render one book
"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { marked } = require("marked");

const ROOT = path.join(__dirname, "..", "..", "..");
const BOOKS = [
  {
    slug: "salary-booster",
    title: "Salary Booster",
    sub: "Career Leverage: From Junior to Senior",
    tag: "Promotions, salary negotiation, building influence, and interviews — the playbook for engineers who refuse to stay overlooked.",
    price: "₹499",
    cover: "salary-booster.jpg",
  },
  {
    slug: "bug-sniper",
    title: "Bug Sniper",
    sub: "Real Engineering: Beyond the Tutorial",
    tag: "Production systems, debugging, architecture, CI/CD, and the trade-offs that actually matter after the tutorial ends.",
    price: "₹599",
    cover: "bug-sniper.jpg",
  },
  {
    slug: "ai-arsenal",
    title: "AI Arsenal",
    sub: "AI for Working Engineers",
    tag: "LLMs, RAG, AI-assisted coding, and production AI — practical tools for engineers who want to stay ahead of the shift.",
    price: "₹699",
    cover: "ai-arsenal.jpg",
  },
];

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
];

const IMG_RE = /!\[([^\]]*)\]\(([^)\n]+)\)/g;

const CSS = `
:root{
  --indigo:#667eea; --violet:#764ba2; --deep:#4338ca; --soft:#818cf8;
  --slate-900:#1e293b; --slate-700:#334155; --slate-500:#64748b; --slate-400:#94a3b8;
  --slate-200:#e2e8f0; --slate-100:#f1f5f9; --slate-50:#f8fafc; --white:#ffffff;
}
@page { size: A4; margin: 16mm 14mm 18mm 14mm; }
* { box-sizing: border-box; }
html,body{ margin:0; padding:0; }
body{ font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; color:var(--slate-900); font-size:10.5pt; line-height:1.55; }

.cover{ page-break-after:always; }
.cover-body{ text-align:center; padding:14mm 0 0; }
.cover-img{ width:auto; max-height:148mm; border-radius:6px; box-shadow:0 6px 22px rgba(15,23,42,.20); }
.cover hgroup{ margin-top:9mm; padding:0 8mm; }
.cover h1{ font-family:'Manrope',sans-serif; font-size:26pt; font-weight:800; letter-spacing:-.5px; margin:0 0 2mm; }
.cover .sub{ font-family:'Manrope',sans-serif; font-size:13pt; font-weight:600; color:var(--deep); }
.cover .tag{ font-style:italic; font-size:11pt; color:var(--slate-500); margin-top:4mm; }
.cover .price{ display:inline-block; margin-top:8mm; background:linear-gradient(135deg,var(--indigo),var(--violet)); color:#fff;
  font-family:'Manrope',sans-serif; font-weight:700; font-size:12pt; padding:2.5mm 8mm; border-radius:999px; }

.chapter{ page-break-before:always; }
.chapter:first-of-type{ page-break-before:auto; }

h1{ font-family:'Manrope',sans-serif; font-size:17pt; font-weight:800; letter-spacing:-.3px; color:var(--deep);
  margin:2mm 0 4mm; padding-bottom:2.4mm; border-bottom:2.5px solid transparent;
  border-image:linear-gradient(90deg,var(--indigo),var(--violet)) 1; page-break-after:avoid; }
h2{ font-family:'Manrope',sans-serif; font-size:12.5pt; font-weight:700; color:var(--deep); margin:6mm 0 2.2mm; page-break-after:avoid; }
h3{ font-family:'Manrope',sans-serif; font-size:11pt; font-weight:700; color:var(--slate-700); margin:4.5mm 0 1.8mm; page-break-after:avoid; }
p{ margin:0 0 2.8mm; }
strong{ font-weight:700; }
ul,ol{ margin:0 0 2.8mm; padding-left:6mm; }
li{ margin-bottom:1mm; }
blockquote{ margin:3mm 0; padding:2.6mm 4mm; background:var(--slate-50); border-left:3px solid var(--indigo);
  border-radius:0 4px 4px 0; color:var(--slate-700); font-style:italic; page-break-inside:avoid; }
code{ font-family:'JetBrains Mono',ui-monospace,'SF Mono',monospace; font-size:8.2pt; background:var(--slate-50);
  border:1px solid var(--slate-200); border-radius:3px; padding:0 1.5mm; }
pre{ background:var(--slate-50); border:1px solid var(--slate-200); border-radius:4px; padding:3mm; page-break-inside:avoid; }
pre code{ background:none; border:0; padding:0; font-size:8.4pt; }
table{ border-collapse:collapse; width:100%; margin:3mm 0 3.5mm; font-size:8.7pt; }
th,td{ border:1px solid var(--slate-200); padding:1.6mm 2.5mm; text-align:left; vertical-align:top; }
th{ background:var(--slate-50); font-family:'Manrope',sans-serif; font-weight:700; color:var(--deep); }
tr{ page-break-inside:avoid; }
hr{ border:0; border-top:1px solid var(--slate-200); margin:5mm 0; }
.fig{ margin:3.4mm 0; page-break-inside:avoid; }
.fig svg{ width:100%; height:auto; display:block; }
.fig img{ width:100%; height:auto; display:block; }
.fig.chip{ width:64%; margin:3mm auto; }
.fig.missing{ border:1.5px dashed var(--soft); color:var(--slate-500); padding:3mm; border-radius:4px; font-style:italic; }
`;

function readCover(book) {
  const p = path.join(ROOT, "public", "assets", "img", book.cover);
  if (!fs.existsSync(p)) return null;
  return "data:image/jpeg;base64," + fs.readFileSync(p).toString("base64");
}

function collectImages(mdText, mdDir) {
  const list = [];
  let idx = 0;
  const staged = mdText.replace(IMG_RE, (m, alt, rel) => {
    const src = path.resolve(mdDir, rel);
    list.push({ alt, rel, src, srcPath: path.resolve(mdDir, rel) });
    return `\u0000IMG${idx++}\u0000`;
  });
  return { staged, list };
}

function imageToHtml(entry) {
  const { alt, src, rel } = entry;
  if (!fs.existsSync(src)) {
    return `<div class="fig missing">Missing image: ${rel}</div>`;
  }
  const ext = path.extname(src).toLowerCase();
  if (ext === ".svg") {
    let svg = fs.readFileSync(src, "utf8");
    const w = /(?:width|viewBox\s*=\s*"[0-9.]+ [0-9.]+ [0-9.]+ )([0-9.]+)"/.exec(svg);
    const isChip = w && Number(w[1]) <= 520;
    svg = svg.replace(/^<svg([^>]*)>/, (m, attrs) => {
      const cleaned = attrs.replace(/\s+width="[^"]*"/, "").replace(/\s+height="[^"]*"/, "");
      return `<svg${cleaned}>`;
    });
    return `<div class="fig${isChip ? " chip" : ""}">${svg}</div>`;
  }
  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    const b64 = fs.readFileSync(src).toString("base64");
    const mime = ext === ".png" ? "image/png" : "image/jpeg";
    return `<div class="fig"><img src="data:${mime};base64,${b64}" alt="${alt}" /></div>`;
  }
  return `<div class="fig missing">Unsupported image type: ${rel}</div>`;
}

function renderBook(book) {
  const bookDir = path.join(ROOT, "ebooks", book.slug);
  const distDir = path.join(bookDir, "dist");
  fs.mkdirSync(distDir, { recursive: true });

  const mdFiles = fs.readdirSync(bookDir).filter((f) => /^\d{2}-[^/]*\.md$/.test(f)).sort();
  let body = "";
  let first = true;
  for (const f of mdFiles) {
    const mdPath = path.join(bookDir, f);
    const raw = fs.readFileSync(mdPath, "utf8");
    const { staged, list } = collectImages(raw, bookDir);
    let html = marked.parse(staged, { gfm: true });
    let i = 0;
    html = html.replace(/\u0000IMG\d+\u0000/g, () => imageToHtml(list[i++]));
    body += `<section class="chapter">${html}</section>`;
    first = false;
  }

  const cover = readCover(book);
  const coverHtml = `<section class="cover"><div class="cover-body">
    ${cover ? `<img class="cover-img" src="${cover}" alt="${book.title} cover" />` : ""}
    <hgroup>
      <h1>${book.title}</h1>
      <div class="sub">${book.sub}</div>
      <div class="tag">${book.tag}</div>
      <div class="price">${book.price}</div>
    </hgroup>
  </div></section>`;

  const htmlDoc = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${book.title} — ${book.sub}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Manrope:wght@500;700;800&family=JetBrains+Mono:wght@400;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>${coverHtml}${body}</body></html>`;

  const htmlOut = path.join(distDir, `${book.slug}.html`);
  fs.writeFileSync(htmlOut, htmlDoc);
  const pdfOut = htmlToPdf(htmlOut, path.join(distDir, `${book.slug}.pdf`));
  console.log(`  ${book.slug}: html=${htmlOut.split("/").pop()} pdf=${pdfOut ? "OK" : "FAILED"} (${mdFiles.length} md, ${body.length} bytes body)`);
  return pdfOut;
}

function findChrome() {
  for (const c of CHROME_CANDIDATES) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function htmlToPdf(htmlPath, pdfPath) {
  const chrome = findChrome();
  if (!chrome) {
    console.error(`    no Chrome/Chromium found; HTML written, PDF skipped`);
    return false;
  }
  const fileUrl = "file://" + htmlPath;
  const res = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--no-pdf-header-footer",
      "--virtual-time-budget=12000",
      `--print-to-pdf=${pdfPath}`,
      fileUrl,
    ],
    { encoding: "utf8", timeout: 120000 }
  );
  if (res.status !== 0) {
    console.error("    chrome stderr:", (res.stderr || "").split("\n").slice(0, 4).join(" | "));
    return false;
  }
  return fs.existsSync(pdfPath) && fs.statSync(pdfPath).size > 0;
}

const wanted = process.argv.slice(2);
const targets = wanted.length ? BOOKS.filter((b) => wanted.includes(b.slug)) : BOOKS;
if (!targets.length) {
  console.error("unknown book(s). valid slugs: " + BOOKS.map((b) => b.slug).join(", "));
  process.exit(1);
}
targets.forEach(renderBook);
console.log("done.");