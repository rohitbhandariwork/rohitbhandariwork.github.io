"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const DIST = path.join(ROOT, "dist");
const WARN_BYTES = 52428800;
const REJECT_BYTES = 104857600;

function loadEnv() {
  const file = path.join(ROOT, ".env");
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

function requireToken() {
  const token = (loadEnv().DL_TOKEN || "").trim();
  if (!token) {
    console.error("DL_TOKEN is not set.");
    console.error("create .env in the Website root with:");
    console.error("  DL_TOKEN=" + require("crypto").randomBytes(6).toString("hex"));
    process.exit(1);
  }
  if (!/^[a-z0-9]{8,64}$/i.test(token)) {
    console.error(`DL_TOKEN must be 8-64 hex/alnum chars (got "${token}").`);
    process.exit(1);
  }
  return token;
}

const FILES = [
  { src: "products/salary-booster.pdf", out: "salary-booster.pdf" },
  { src: "products/bug-sniper.pdf", out: "bug-sniper.pdf" },
  { src: "products/ai-arsenal.pdf", out: "ai-arsenal.pdf" },
];

module.exports = { ROOT, DIST, FILES, WARN_BYTES, REJECT_BYTES, loadEnv, requireToken };
