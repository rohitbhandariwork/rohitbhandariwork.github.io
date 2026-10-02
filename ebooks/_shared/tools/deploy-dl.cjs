"use strict";
// deploy-dl.cjs — copy the paid PDFs into dist/dl/<token>/ so they ship alongside the site.
// Usage: node ebooks/_shared/tools/deploy-dl.cjs [--check]
//   --check  report sizes and exit without copying
const fs = require("fs");
const path = require("path");
const { ROOT, DIST, FILES, WARN_BYTES, REJECT_BYTES, requireToken } = require("./dl-config.cjs");

const token = requireToken();
const checkOnly = process.argv.includes("--check");
const outDir = path.join(DIST, "dl", token);

const rows = [];
let rejected = false;

for (const f of FILES) {
  const src = path.join(ROOT, f.src);
  if (!fs.existsSync(src)) {
    console.error(`  MISSING  ${f.src}`);
    console.error(`  the paid PDFs are not in git — restore them from your own copy`);
    rejected = true;
    continue;
  }
  const size = fs.statSync(src).size;
  let flag = "ok";
  if (size > REJECT_BYTES) { flag = "REJECTED"; rejected = true; }
  else if (size > WARN_BYTES) { flag = "warn >50MB";
  }
  rows.push({ ...f, size, flag });
}

const total = rows.reduce((n, r) => n + r.size, 0);
console.log(`token: ${token}`);
console.log(`out:   dist/dl/${token}/`);
for (const r of rows) {
  console.log(`  ${r.flag.padEnd(13)} ${(r.size / 1048576).toFixed(1).padStart(6)} MB  ${r.out}`);
}
console.log(`  ${"total".padEnd(13)} ${(total / 1048576).toFixed(1).padStart(6)} MB`);

if (rejected) {
  console.error("\naborting: a file is missing or over GitHub's 100MB hard limit.");
  process.exit(1);
}

if (checkOnly) {
  console.log("\n--check only, nothing copied");
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
for (const r of rows) {
  fs.copyFileSync(path.join(ROOT, r.src), path.join(outDir, r.out));
}
console.log(`\ncopied ${rows.length} files into dist/dl/${token}/`);

const distTotal = (function walk(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    n += e.isDirectory() ? walk(p) : fs.statSync(p).size;
  }
  return n;
})(DIST);

console.log(`dist total: ${(distTotal / 1048576).toFixed(1)} MB (GitHub Pages published limit is 1 GB)`);
if (distTotal > 1024 * 1024 * 1024) {
  console.error("  OVER the 1 GB published-site limit — do not push.");
  process.exit(1);
}
