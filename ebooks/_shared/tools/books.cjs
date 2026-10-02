"use strict";
const fs = require("fs");
const path = require("path");
const { requireToken } = require("./dl-config.cjs");

const ROOT = path.join(__dirname, "..", "..", "..");
const CATALOG = path.join(ROOT, "docs", "SHOP-CATALOG.md");

const SITE = "https://rohitbhandariwork.github.io";

// `file` is both the download filename and the PDF's filename under public/dl/<token>/, so there
// is one name per book rather than a path that can drift from the URL in the emails.
const BOOKS = {
  "career-leverage": { file: "salary-booster.pdf", title: "Salary Booster", sub: "Career Leverage: From Junior to Senior", price: "₹499", cover: "/assets/img/salary-booster.jpg" },
  "salary-booster": { file: "salary-booster.pdf", title: "Salary Booster", sub: "Career Leverage: From Junior to Senior", price: "₹499", cover: "/assets/img/salary-booster.jpg" },
  "real-engineering": { file: "bug-sniper.pdf", title: "Bug Sniper", sub: "Real Engineering: Beyond the Tutorial", price: "₹599", cover: "/assets/img/bug-sniper.jpg" },
  "bug-sniper": { file: "bug-sniper.pdf", title: "Bug Sniper", sub: "Real Engineering: Beyond the Tutorial", price: "₹599", cover: "/assets/img/bug-sniper.jpg" },
  "ai-working-engineer": { file: "ai-arsenal.pdf", title: "AI Arsenal", sub: "AI for Working Engineers", price: "₹699", cover: "/assets/img/ai-arsenal.jpg" },
  "ai-arsenal": { file: "ai-arsenal.pdf", title: "AI Arsenal", sub: "AI for Working Engineers", price: "₹699", cover: "/assets/img/ai-arsenal.jpg" },
};

const CANONICAL = ["career-leverage", "real-engineering", "ai-working-engineer"];

function isKnown(slug) {
  return typeof slug === "string" && Object.prototype.hasOwnProperty.call(BOOKS, slug);
}

function canonicalSlug(slug) {
  if (!isKnown(slug)) return null;
  for (const c of CANONICAL) {
    if (BOOKS[c].file === BOOKS[slug].file) return c;
  }
  return CANONICAL[0];
}

function pdfPath(file) {
  return path.join(ROOT, "public", "dl", requireToken(), file);
}

function bookOf(slug) {
  return BOOKS[canonicalSlug(slug)];
}

function descriptions() {
  const out = {};
  let text = "";
  try {
    text = fs.readFileSync(CATALOG, "utf8");
  } catch (err) {
    return out;
  }
  for (const slug of CANONICAL) {
    const b = BOOKS[slug];
    const esc = b.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^- \\*\\*Description:\\*\\* (.+)$`, "gm");
    let m, blocks = text.split(/^## /m);
    for (const block of blocks) {
      if (block.indexOf(`**Title:** ${esc}`) === -1) continue;
      m = re.exec(block);
      if (m) out[slug] = m[1].trim();
    }
  }
  return out;
}

function shopLink(slug) {
  return `${SITE}/shop/#${slug}`;
}

function shopUrl() {
  return `${SITE}/shop/`;
}

function othersThan(slug) {
  return CANONICAL.filter((s) => s !== canonicalSlug(slug));
}

function downloadUrl(token, slug) {
  return `${SITE}/dl/${token}/${BOOKS[canonicalSlug(slug)].file}`;
}

module.exports = { ROOT, CATALOG, SITE, BOOKS, CANONICAL, isKnown, canonicalSlug, bookOf, descriptions, shopLink, othersThan, downloadUrl, shopUrl, pdfPath };
