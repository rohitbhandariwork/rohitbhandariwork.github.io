#!/usr/bin/env node
// figgen.js — data-driven SVG figure generator for the three ebooks.
// Zero dependencies. Usage:  node figgen.js <figures-data.js>  (writes SVGs next to data by 'outdir')
"use strict";
const fs = require("fs");
const path = require("path");
const op = require("path");

// ---- palette (brand tokens, Apple-HIG flat, light theme) ----
const IND = "#667eea", VIO = "#764ba2", DEEP = "#4338ca", SOFT = "#818cf8";
const INK = "#0f172a", SLATE = "#334155", MED = "#64748b", MUTE = "#94a3b8";
const SOFTY = "#f1f5f9", LINE = "#e2e8f0", WHITE = "#ffffff";
const WARM_A = "#f59e0b", WARM_B = "#ef4444", OK_GO = "#34d399", CYAN = "#06b6d4";
const FONT = "Manrope, Inter, -apple-system, 'Segoe UI', sans-serif";
const FMONO = "JetBrains Mono, Menlo, 'Courier New', monospace";
const A = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const w = (s, size) => String(s).length * 0.62 * size;
const fit = (s, maxW, size) => { let f = size; while (w(s, f) > maxW && f > 8) f -= 1; return f; };
const esc = A;

function grads(id) {
  return `<defs>
  <linearGradient id="${id}-grad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${IND}"/><stop offset="100%" stop-color="${VIO}"/>
  </linearGradient>
  <linearGradient id="${id}-warm" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${WARM_A}"/><stop offset="100%" stop-color="${WARM_B}"/>
  </linearGradient>
  <linearGradient id="${id}-go" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${OK_GO}"/><stop offset="100%" stop-color="${CYAN}"/>
  </linearGradient>
</defs>`;
}

function header(id, title, sub, w_, h) {
  return `<rect x="0" y="0" width="${w_}" height="118" rx="24" fill="url(#${id}-grad)"/>
<text x="40" y="52" font-family="${FONT}" font-size="31" font-weight="800" fill="${WHITE}">${esc(title)}</text>
<text x="42" y="84" font-family="${FONT}" font-size="17" font-weight="500" fill="rgba(255,255,255,.85)">${esc(sub || "")}</text>
<circle cx="${w_ - 66}" cy="59" r="26" fill="rgba(255,255,255,.16)"/>
<path d="M ${w_ - 84} 52 q 18 0 18 14 v 6 l 4 8 h -24 l 4 -8 v -6 q 0 -3 1.5 -6 q 2.5 -6 8 -8 z" fill="${WHITE}" opacity=".9"/>`;
}

// ---------------- templates ----------------

const chip = (s, id) => {
  const pal = { indigo: "#eef2ff", violet: "#f5f3ff", warm: "#fff7ed", go: "#ecfdf5", ambersoft: "#fef3c7" }[s.tone] || "#eef2ff";
  const fg = { indigo: DEEP, violet: VIO, warm: "#c2410c", go: "#047857", ambersoft: "#b45309" }[s.tone] || IND;
  const g = s.glyph || "◆";
  const W = s.width || 360, H = s.height || 92, r = 16;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}
<rect x="0" y="0" width="${W}" height="${H}" rx="${r}" fill="${pal}" stroke="${LINE}" stroke-width="1.5"/>
<rect x="0" y="0" width="10" height="${H}" rx="${r}" fill="url(#${id}-grad)"/>
<circle cx="${W - 52}" cy="${H / 2}" r="25" fill="url(#${id}-grad)"/>
<text x="${W - 52}" y="${H / 2 + 11}" font-size="26" text-anchor="middle" fill="${WHITE}" font-weight="700">${g}</text>
<text x="34" y="${H / 2 - 6}" font-size="${s.titleSize || 24}" font-weight="800" fill="${INK}">${esc(s.title)}</text>
<text x="34" y="${H / 2 + 20}" font-size="${s.subSize || 15}" font-weight="500" fill="${fg}">${esc(s.sub || "")}</text>
</svg>`;
};

const mindmap = (s, id) => {
  const W = s.width || 1200, H = s.height || 760, cx = W / 2, cy = H / 2;
  const R = s.radius || 330, n = s.nodes.length;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}
<circle cx="${cx}" cy="${cy}" r="${R + 90}" fill="${SOFTY}" opacity=".6"/>
<circle cx="${cx}" cy="${cy}" r="${R + 34}" fill="${WHITE}" stroke="${LINE}"/>`;
  const cw = 276, ch = 108;
  const pos = [];
  for (let i = 0; i < n; i++) {
    const ang = (-90 + i * 360 / n) * Math.PI / 180;
    const bx = cx + R * Math.cos(ang), by = cy + R * Math.sin(ang);
    pos.push({ bx, by, ang });
    const bw = s.nodeW || 218, bh = 84;
    const x1 = cx + cw / 2, y1 = cy;
    const x2 = bx - Math.cos(ang) * bw / 2, y2 = by - Math.sin(ang) * bh / 2;
    out += `<path d="M ${x1} ${y1} C ${x1 + Math.cos(ang) * 60} ${y1 + Math.sin(ang) * 60}, ${x2 - Math.cos(ang) * 40} ${y2 - Math.sin(ang) * 40}, ${x2} ${y2}" fill="none" stroke="${SOFT}" stroke-width="3"/>`;
    out += `<rect x="${bx - bw / 2}" y="${by - bh / 2}" width="${bw}" height="${bh}" rx="18" fill="${WHITE}" stroke="${LINE}" stroke-width="1.5" filter="drop-shadow(0 6px 10px rgba(15,23,42,.06))"/>`;
    const fs = fit(s.nodes[i].label, bw - 30, 18);
    out += `<text x="${bx}" y="${by - (s.nodes[i].sub ? 6 : 4)}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="${INK}">${esc(s.nodes[i].label)}</text>`;
    if (s.nodes[i].sub) {
      out += `<circle cx="${bx - w(s.nodes[i].sub, 13) / 2 - 10}" cy="${by + 22}" r="4" fill="url(#${id}-grad)"/>
<text x="${bx - 4}" y="${by + 27}" text-anchor="middle" font-size="13.5" font-weight="500" fill="${MED}">${esc(s.nodes[i].sub)}</text>`;
    }
  }
  out += `<rect x="${cx - cw / 2}" y="${cy - ch / 2}" width="${cw}" height="${ch}" rx="28" fill="url(#${id}-grad)" filter="drop-shadow(0 10px 16px rgba(102,126,234,.35))"/>`;
  const cfs = fit(s.title || "Topic", cw - 40, 26);
  out += `<text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="${cfs}" font-weight="800" fill="${WHITE}">${esc(s.title || "")}</text>`;
  out += `<text x="${cx}" y="${cy + 24}" text-anchor="middle" font-size="15" font-weight="500" fill="rgba(255,255,255,.85)">${esc(s.sub || "")}</text>`;
  return out + "</svg>";
};

const loop = (s, id) => {
  const W = s.width || 1040, H = s.height || 640, cx = W / 2, cy = H / 2;
  const rx = s.rx || 360, ry = s.ry || 210, n = s.nodes.length, bw = 190, bh = 96;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}<path d="M ${cx - (rx + 70)} ${cy} l ${(rx + 70) * 2} 0" stroke="${LINE}" stroke-width="1.5" />`;
  for (let i = 0; i < n; i++) {
    const a0 = -90 + (i * 360 / n), a1 = -90 + ((i + 1) * 360 / n);
    const p0x = cx + rx * Math.cos(a0 * Math.PI / 180), p0y = cy + ry * Math.sin(a0 * Math.PI / 180);
    const p1x = cx + rx * Math.cos(a1 * Math.PI / 180), p1y = cy + ry * Math.sin(a1 * Math.PI / 180);
    const mx = cx + rx * Math.cos((a0 + a1) / 2 * Math.PI / 180), my = cy + ry * Math.sin((a0 + a1) / 2 * Math.PI / 180);
    const tx = cx + rx * Math.cos((a0 + a1) / 2 * Math.PI / 180), ty = cy + ry * Math.sin((a0 + a1) / 2 * Math.PI / 180) - 30;
    const seg = (a1 - a0 + 360) % 360;
    out += `<path d="M ${p0x} ${p0y} A ${rx} ${ry} 0 0 1 ${p1x} ${p1y}" fill="none" stroke="${SOFT}" stroke-width="4" marker-end="url(#${id}-arr)"/>`;
    out += `<text x="${tx - 70}" y="${ty - 26}" font-family="${FONT}" font-size="15" font-weight="700" fill="${MED}">${esc(s.labels ? s.labels[i] : "next")}</text>`;
  }
  for (let i = 0; i < n; i++) {
    const a = -90 + (i * 360 / n);
    const bx = cx + rx * Math.cos(a * Math.PI / 180), by = cy + ry * Math.sin(a * Math.PI / 180);
    out += `<rect x="${bx - bw / 2}" y="${by - bh / 2}" width="${bw}" height="${bh}" rx="20" fill="${WHITE}" stroke="${LINE}" stroke-width="1.5" filter="drop-shadow(0 6px 10px rgba(15,23,42,.07))"/>`;
    out += `<circle cx="${bx - bw / 2 + 26}" cy="${by - bh / 2 + 26}" r="14" fill="url(#${id}-grad)"/>
<text x="${bx - bw / 2 + 26}" y="${by - bh / 2 + 31}" font-size="15" font-weight="800" text-anchor="middle" fill="${WHITE}">${i + 1}</text>`;
    const fs = fit(s.nodes[i].label, bw - 52, 18.5);
    out += `<text x="${bx - 8}" y="${by + 6}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="${INK}">${esc(s.nodes[i].label)}</text>`;
    if (s.nodes[i].sub) {
      out += `<text x="${bx - 8}" y="${by + 30}" text-anchor="middle" font-size="13.5" font-weight="500" fill="${MED}">${esc(s.nodes[i].sub)}</text>`;
    }
  }
  out += `<circle cx="${cx}" cy="${cy}" r="104" fill="url(#${id}-grad)" filter="drop-shadow(0 10px 16px rgba(102,126,234,.35))"/>`;
  const cfs = fit(s.title, 170, 20);
  out += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="${cfs}" font-weight="800" fill="${WHITE}">${esc(s.title)}</text>`;
  out += `<text x="${cx}" y="${cy + 22}" text-anchor="middle" font-size="13" font-weight="500" fill="rgba(255,255,255,.85)">${esc(s.sub || "")}</text>`;
  return out + `<defs><marker id="${id}-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${SOFT}"/></marker></defs></svg>`;
};

const flow = (s, id) => {
  const W = s.width || 1120, H = s.height || 340, n = s.steps.length;
  const stepW = Math.min(250, (W - (n + 1) * 46) / n);
  const x0 = 40, y0 = 120, gap = (W - 40 * 2 - stepW * n) / (n - 1);
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}`;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * (stepW + gap), st = s.steps[i];
    out += `<circle cx="${x + stepW / 2}" cy="${y0 - 22}" r="20" fill="url(#${id}-grad)"/>
<text x="${x + stepW / 2}" y="${y0 - 16}" font-size="17" font-weight="800" text-anchor="middle" fill="${WHITE}">${i + 1}</text>
<rect x="${x}" y="${y0}" width="${stepW}" height="${H - y0 - 46}" rx="18" fill="${WHITE}" stroke="${LINE}" stroke-width="1.5" filter="drop-shadow(0 6px 10px rgba(15,23,42,.06))"/>`;
    const fs = fit(st.label, stepW - 26, 19);
    out += `<text x="${x + stepW / 2}" y="${y0 + 40}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="${INK}">${esc(st.label)}</text>`;
    const sfs = fit(st.desc, stepW - 32, 13.5);
    out += `<text x="${x + stepW / 2}" y="${y0 + 66}" text-anchor="middle" font-size="${sfs}" font-weight="500" fill="${MED}">${esc(st.desc)}</text>`;
    if (i < n - 1) {
      const ax = x + stepW + 8, ay = y0 + (H - y0 - 46) / 2;
      out += `<path d="M ${ax} ${ay - 8} l 12 8 l -12 8 z" fill="${SOFT}"/>`;
      const lx = x + stepW / 2 + 4, ly = y0 - 2;
      out += `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${MED}" transform="rotate(-90 ${lx} ${ly})">${esc(s.labels ? s.labels[i] : "")}</text>`;
    }
  }
  if (s.title) {
    const fs = fit(s.title, W, 24);
    out += `<text x="${W / 2}" y="44" text-anchor="middle" font-size="${Math.min(fs, 24)}" font-weight="800" fill="${INK}">${esc(s.title)}</text>`;
  }
  return out + "</svg>";
};

const fanout = (s, id) => {
  const W = s.width || 1120, H = s.height || 620, n = s.branches.length;
  const cw = 300, ch = 84, cx = W / 2, by0 = 130, bw = Math.min(310, (W - 120) / n);
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}
<rect x="${cx - cw / 2}" y="40" width="${cw}" height="${ch}" rx="22" fill="url(#${id}-grad)" filter="drop-shadow(0 10px 16px rgba(102,126,234,.35))"/>
<text x="${cx}" y="${66 + 24}" text-anchor="middle" font-size="${fit(s.question, cw - 34, 19)}" font-weight="800" fill="${WHITE}">${esc(s.question)}</text>
<text x="${cx}" y="${66 + 48}" text-anchor="middle" font-size="14" font-weight="500" fill="rgba(255,255,255,.85)">${esc(s.sub || "ask honestly")}</text>`;
  for (let i = 0; i < n; i++) {
    const b = s.branches[i];
    const bx = 60 + i * (W - 120) / (n - 1) + (n === 1 ? 0 : (n === 2 ? (W - 120) / 2 * (i === 0 ? -0.25 : 0.25) / (1) : 0));
    const bx2 = 60 + (n === 1 ? (W - 120) / 2 : i * (W - 120) / (n - 1));
    const xc = bx2 + bw / 2;
    out += `<path d="M ${cx} ${40 + ch} C ${cx} ${by0 - 30}, ${xc} ${by0 - 30}, ${xc} ${by0 - 6}" fill="none" stroke="${SOFT}" stroke-width="3" marker-end="url(#${id}-arr)"/>`;
    const tag = (b.tag || "").toUpperCase();
    const tcol = { GO: OK_GO, WAIT: WARM_A, COUNTER: IND, NO: "#f87171", YES: OK_GO, WALK: "#f87171", KEEP: MED }[tag] || MED;
    out += `<rect x="${bx2}" y="${by0}" width="${bw}" height="124" rx="18" fill="${WHITE}" stroke="${LINE}" stroke-width="1.5" filter="drop-shadow(0 6px 10px rgba(15,23,42,.06))"/>`;
    out += `<rect x="${bx2}" y="${by0 + 16}" width="${Math.min(w(b.label, 14) + 26, bw - 24)}" height="34" rx="10" fill="${tcol}" opacity=".92"/>
<text x="${bx2 + 13}" y="${by0 + 38}" font-size="13" font-weight="800" fill="${WHITE}">${tag}</text>`;
    out += `<text x="${bx2 + 16}" y="${by0 + 82}" font-size="${fit(b.label, bw - 32, 18)}" font-weight="800" fill="${INK}">${esc(b.label)}</text>`;
    out += `<text x="${bx2 + 16}" y="${by0 + 106}" font-size="${fit(b.outcome, bw - 32, 13.5)}" font-weight="500" fill="${MED}">${esc(b.outcome)}</text>`;
  }
  return out + `<defs><marker id="${id}-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${SOFT}"/></marker></defs></svg>`;
};

const cheatsheet = (s, id) => {
  const W = s.width || 900, H = s.height || 940, rows = s.items, y0 = 178;
  const rh = Math.min(68, (H - y0 - 90) / rows.length);
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}${header(id, s.title, s.sub, W, 118)}
<rect x="24" y="136" width="${W - 48}" height="${H - 170}" rx="20" fill="${WHITE}" stroke="${LINE}" stroke-width="1.5" filter="drop-shadow(0 8px 14px rgba(15,23,42,.05))"/>`;
  rows.forEach((r, i) => {
    const y = y0 + i * rh;
    if (i > 0) out += `<line x1="52" y1="${y - rh / 2 + 8}" x2="${W - 52}" y2="${y - rh / 2 + 8}" stroke="${LINE}" stroke-width="1"/>`;
    out += `<circle cx="54" cy="${y - rh * 0.5 + (r.hl ? 14 : 0)}" r="8" fill="${r.hl ? "url(#" + id + "-grad)" : SOFTY}" stroke="${r.hl ? "none" : LINE}"/>`;
    out += `<text x="78" y="${y - rh * 0.5 + 6}" font-size="${fit(r.label, W - 520, 19)}" font-weight="700" fill="${INK}">${esc(r.label)}</text>`;
    const val = r.value, mono = /^[\d₹.%+\-/A-Za-z ]+$/.test(val) && w(val, 15) < 300;
    out += `<text x="${W - 52}" y="${y - rh * 0.5 + 6}" text-anchor="end" font-size="15.5" font-weight="700" fill="${r.hl ? DEEP : SLATE}" font-family="${mono ? FMONO : FONT}">${esc(val)}</text>`;
  });
  out += `<text x="${W / 2}" y="${H - 26}" text-anchor="middle" font-size="13" font-weight="500" fill="${MUTE}">${esc(s.footer || "Keep it where you can see it.")}</text>`;
  return out + "</svg>";
};

const scorecard = (s, id) => {
  const W = s.width || 900, H = s.height || 860, rows = s.rows, y0 = 180;
  const rh = Math.min(88, (H - y0 - 96) / rows.length);
  const marks = ["1", "2", "3", "4", "5"];
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}${header(id, s.title, s.sub, W, 118)}
<rect x="24" y="140" width="${W - 48}" height="${H - 190}" rx="20" fill="${WHITE}" stroke="${LINE}" stroke-width="1.5" filter="drop-shadow(0 8px 14px rgba(15,23,42,.05))"/>`;
  rows.forEach((r, i) => {
    const y = y0 + i * rh;
    out += `<circle cx="72" cy="${y - rh / 2 + 18}" r="7" fill="url(#${id}-grad)"/>`;
    out += `<text x="94" y="${y - rh / 2 + 23}" font-size="${fit(r.label, W - 420, 17.5)}" font-weight="700" fill="${INK}">${esc(r.label)}</text>`;
    out += `<text x="94" y="${y - rh / 2 + 46}" font-size="${fit(r.hint, W - 420, 13)}" font-weight="500" fill="${MED}">${esc(r.hint)}</text>`;
    const s0 = W - 300, cd = 26;
    marks.forEach((m, k) => {
      const hx = s0 + k * cd + 70;
      out += (k === 0 ? `<text x="${hx - 34}" y="${y - rh / 2 + 23}" font-size="12.5" font-weight="600" fill="${MUTE}" text-anchor="end">rate</text>` : "");
      out += `<circle cx="${hx}" cy="${y - rh / 2 + 20}" r="12" fill="${k <= 1 ? "#eef2ff" : k <= 3 ? SOFTY : "#fef3c7"}" stroke="${k <= 1 ? SOFT : LINE}" stroke-width="2"/><text x="${hx}" y="${y - rh / 2 + 25}" text-anchor="middle" font-size="12.5" font-weight="800" fill="${k <= 1 ? DEEP : MED}">${m}</text>`;
    });
  });
  out += `<rect x="24" y="${H - 128}" width="${W - 48}" height="72" rx="16" fill="#eef2ff"/>
<text x="48" y="${H - 92}" font-size="16" font-weight="800" fill="${DEEP}">${esc(s.scoreLabel || "Score")}</text>
<text x="${W - 56}" y="${H - 92}" text-anchor="end" font-size="20" font-weight="800" font-family="${FMONO}" fill="${DEEP}">${esc(s.score || "— / " + rows.length * 5)}</text>
<text x="${W - 56}" y="${H - 66}" text-anchor="end" font-size="12.5" font-weight="500" fill="${DEEP}" opacity=".8">${esc(s.footer || "re-take this at the end of the book")}</text>`;
  return out + "</svg>";
};

const worksheet = (s, id) => {
  const W = s.width || 900, H = s.height || 700, rows = s.prompts, y0 = 170;
  const rh = Math.min(100, (H - y0 - 60) / rows.length);
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}${header(id, s.title, s.sub, W, 118)}
<rect x="24" y="140" width="${W - 48}" height="${H - 190}" rx="20" fill="${WHITE}" stroke="${LINE}" stroke-width="1.5"/>`;
  rows.forEach((r, i) => {
    const y = y0 + i * rh;
    out += `<text x="52" y="${y + 12}" font-size="${fit(r.label, W - 100, 17)}" font-weight="800" fill="${INK}">${esc(r.label)}</text>`;
    const lines = r.lines || 3, ly = y + 42;
    for (let k = 0; k < lines; k++) {
      out += `<line x1="52" y1="${ly + k * 22}" x2="${W - 52}" y2="${ly + k * 22}" stroke="${LINE}" stroke-width="1.5" stroke-dasharray="3 8"/>`;
    }
    if (r.hint) out += `<text x="52" y="${y + 30}" font-size="12.5" font-weight="500" fill="${MUTE}">${esc(r.hint)}</text>`;
  });
  return out + "</svg>";
};

const timeline = (s, id) => {
  const W = s.width || 1120, H = s.height || 430;
  const x0 = 70, x1 = W - 70, y = 240, total = s.span || 12;
  const k = (x1 - x0) / total;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}
<rect x="0" y="0" width="${W}" height="104" rx="22" fill="url(#${id}-grad)"/>
<text x="${W / 2}" y="44" text-anchor="middle" font-size="26" font-weight="800" fill="${WHITE}">${esc(s.title)}</text>
<text x="${W / 2}" y="74" text-anchor="middle" font-size="15" font-weight="500" fill="rgba(255,255,255,.85)">${esc(s.sub || "")}</text>
<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${SLATE}" stroke-width="3" stroke-linecap="round"/>`;
  for (let i = 0; i <= total; i++) {
    const x = x0 + i * k;
    const lab = i === 0 ? "week 0" : "w" + i;
    out += `<line x1="${x}" y1="${y - 10}" x2="${x}" y2="${y + 10}" stroke="${SLATE}" stroke-width="2.5"/>
<text x="${x}" y="${y + 34}" text-anchor="middle" font-size="12.5" font-weight="600" font-family="${FMONO}" fill="${MED}">${lab}</text>`;
  }
  s.phases.forEach((p) => {
    const px = x0 + p.start * k, pw = (p.end - p.start) * k;
    const col = p.color || IND;
    out += `<rect x="${px}" y="${y - 74}" width="${pw}" height="46" rx="14" fill="${col}" opacity=".92" filter="drop-shadow(0 6px 10px rgba(15,23,42,.08))"/>`;
    out += `<text x="${px + pw / 2}" y="${y - 43}" text-anchor="middle" font-size="${fit(p.label, pw - 10, 15)}" font-weight="800" fill="${WHITE}">${esc(p.label)}</text>`;
    if (p.note) out += `<text x="${px + pw / 2}" y="${y - 88}" text-anchor="middle" font-size="12" font-weight="500" fill="${MED}">${esc(p.note)}</text>`;
    out += `<line x1="${px + pw / 2}" y1="${y - 28}" x2="${px + pw / 2}" y2="${y}" stroke="${col}" stroke-width="2" stroke-dasharray="4 4"/>`;
  });
  return out + "</svg>";
};

const bench = (s, id) => {
  const W = s.width || 960, H = s.height || 620;
  const cols = s.columns, n = cols.length, data = s.rows;
  const cw = (W - 80) / n, y0 = 170, rhm = Math.min(46, (H - y0 - 60) / data.length);
  const rx = 40, rw = W - 80;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}${header(id, s.title, s.sub, W, 118)}
<rect x="${rx}" y="${y0}" width="${rw}" height="${Math.max(34, rhm)}" rx="12" fill="url(#${id}-grad)"/>`;
  cols.forEach((c, i) => {
    out += `<text x="${rx + i * cw + cw / 2}" y="${y0 + 22}" text-anchor="middle" font-size="${fit(c, cw - 12, 13.5)}" font-weight="800" fill="${WHITE}">${esc(c)}</text>`;
  });
  data.forEach((row, ri) => {
    const y = y0 + rhm + 12 + ri * rhm;
    const alt = ri % 2 === 0;
    out += `<rect x="${rx}" y="${y}" width="${rw}" height="${rhm - 6}" rx="10" fill="${alt ? SOFTY : WHITE}" stroke="${LINE}" stroke-width="1"/>`;
    cols.forEach((c, ci) => {
      const v = row[ci] || "";
      const fw = ci === 0 ? 700 : 500, fs = fit(v, cw - 16, ci === 0 ? 14.5 : 13.5);
      out += `<text x="${rx + ci * cw + cw / 2}" y="${y + rhm / 2 - 2}" text-anchor="middle" font-size="${fs}" font-weight="${fw}" fill="${ci === 0 ? INK : SLATE}" font-family="${/^[\d.%₹A-Za-z×]+$/.test(v) && ci > 0 ? FMONO : FONT}">${esc(v)}</text>`;
    });
  });
  if (s.footer) out += `<text x="${W / 2}" y="${H - 18}" text-anchor="middle" font-size="12.5" font-weight="500" fill="${MUTE}">${esc(s.footer)}</text>`;
  return out + "</svg>";
};

const compare = (s, id) => {
  const W = s.width || 1140, H = s.height || 470, cw = 470, cy0 = 150;
  const sides = [s.left, s.right], tones = ["indigo", "violet"];
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}`;
  sides.forEach((side, i) => {
    const x = 30 + i * (cw + 130);
    const base = i === 0 ? "url(#" + id + "-grad)" : "url(#" + id + "-grad)";
    out += `<rect x="${x}" y="${cy0}" width="${cw}" height="${H - cy0 - 26}" rx="24" fill="${i === 0 ? "#eef2ff" : "#f5f3ff"}" stroke="${LINE}" stroke-width="1.5"/>`;
    out += `<rect x="${x}" y="${cy0}" width="${cw}" height="54" rx="24" fill="${base}" opacity=".95"/>`;
    out += `<text x="${x + cw / 2}" y="${cy0 + 22}" text-anchor="middle" font-size="17" font-weight="800" fill="${WHITE}">${esc(side.title)}</text>`;
    if (side.sub) out += `<text x="${x + cw / 2}" y="${cy0 + 40}" text-anchor="middle" font-size="12.5" font-weight="500" fill="rgba(255,255,255,.85)">${esc(side.sub)}</text>`;
    side.items.forEach((it, k) => {
      const y = cy0 + 88 + k * 66;
      out += `<circle cx="${x + 28}" cy="${y + 6}" r="7" fill="url(#${id}-grad)"/>`;
      out += `<text x="${x + 48}" y="${y + 11}" font-size="${fit(it, cw - 76, 15)}" font-weight="${side.bold ? 800 : 600}" fill="${INK}">${esc(it)}</text>`;
    });
  });
  const vx = W / 2;
  out += `<circle cx="${vx}" cy="${(cy0 + H - 20) / 2}" r="44" fill="url(#${id}-warm)"/>
<text x="${vx}" y="${(cy0 + H - 20) / 2 + 10}" text-anchor="middle" font-size="28" font-weight="800" fill="${WHITE}">VS</text>`;
  return out + "</svg>";
};

const stackbar = (s, id) => {
  const W = s.width || 1080, H = s.height || 300;
  const x0 = 40, bw = W - 80, y = 150, bh = 96;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}`;
  if (s.title) out += `<text x="${W / 2}" y="40" text-anchor="middle" font-size="23" font-weight="800" fill="${INK}">${esc(s.title)}</text>`;
  const total = s.segments.reduce((a, b) => a + b.pct, 0);
  let acc = 0;
  s.segments.forEach((seg) => {
    const pw = bw * seg.pct / total, px = x0 + acc * bw / total;
    out += `<rect x="${px}" y="${y}" width="${pw}" height="${bh}" rx="6" fill="${seg.color || SOFT}" stroke="${WHITE}" stroke-width="3"/>`;
    const lx = px + pw / 2;
    out += `<text x="${lx}" y="${y + (seg.label ? 50 : 0)}" text-anchor="middle" font-size="${fit((seg.label || "") + (seg.pct ? " " + seg.pct + "%" : ""), pw - 10, 15)}" font-weight="800" fill="${WHITE}">${esc(seg.label || "")}</text>`;
    out += `<text x="${lx}" y="${y + bh - 18}" text-anchor="middle" font-size="13.5" font-weight="700" fill="${WHITE}" opacity=".95">${esc(String(seg.pct) + "%")}</text>`;
    acc += seg.pct;
  });
  if (s.footer) out += `<text x="${W / 2}" y="${H - 16}" text-anchor="middle" font-size="13" font-weight="500" fill="${MED}">${esc(s.footer)}</text>`;
  return out + "</svg>";
};

const spot = (s, id) => {
  const W = s.width || 640, H = s.height || 460;
  const cx = W / 2, cy = H / 2, R = 176;
  const sc = s.scene || "target";
  let art = "";
  if (sc === "target") {
    for (let r = 150; r >= 40; r -= 30) art += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${r % 60 === 0 ? IND : LINE}" stroke-width="4"/>`;
    art += `<circle cx="${cx}" cy="${cy}" r="34" fill="url(#${id}-grad)"/>`;
    art += `<path d="M ${cx + 90} ${cy - 120} l ${-150} ${150}" stroke="${WARM_A}" stroke-width="10" stroke-linecap="round" marker-end="url(#${id}-arr)"/>`;
    art += `<path d="M ${cx + 60} ${cy - 150} l 0 30 l 30 40" fill="none" stroke="${WARM_A}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (sc === "radar") {
    art += `<circle cx="${cx}" cy="${cy}" r="150" fill="url(#${id}-go)" opacity=".08"/>`;
    art += `<circle cx="${cx}" cy="${cy}" r="150" fill="none" stroke="${LINE}" stroke-width="3"/>`;
    for (let r = 50; r <= 150; r += 50) art += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LINE}" stroke-width="1.5" stroke-dasharray="4 6"/>`;
    [-60, 30, 120, 210].forEach((a) => {
      const x = cx + 150 * Math.cos(a * Math.PI / 180), y = cy + 150 * Math.sin(a * Math.PI / 180);
      art += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${LINE}" stroke-width="1.5"/>`;
    });
    const sweep = Math.PI / 3;
    art += `<path d="M ${cx} ${cy} L ${cx + 150 * Math.cos(-0.6)} ${cy + 150 * Math.sin(-0.6)} A 150 150 0 0 1 ${cx + 150 * Math.cos(-0.6 + sweep)} ${cy + 150 * Math.sin(-0.6 + sweep)} Z" fill="url(#${id}-grad)" opacity=".55"/>`;
    [[80, -60], [40, 90], [-110, 10]].forEach((p) => { art += `<circle cx="${cx + p[0]}" cy="${cy + p[1]}" r="9" fill="${WARM_B}" opacity=".85"/>`; });
  } else if (sc === "ladder") {
    const bx = cx - 30, bw2 = 60, nRungs = 6;
    for (let i = 0; i <= nRungs; i++) {
      const yg = cy + 130 - i * 42;
      art += `<rect x="${bx}" y="${yg}" width="9" height="160" rx="4" fill="${DEEP}" opacity=".85"/>`;
      art += `<rect x="${bx + bw2 - 9}" y="${yg}" width="9" height="160" rx="4" fill="${DEEP}" opacity=".85"/>`;
      art += `<rect x="${bx}" y="${yg + 18}" width="${bw2}" height="12" rx="6" fill="${SOFT}"/>`;
      if (i === 0) art += `<circle cx="${bx + bw2 / 2}" cy="${yg - 24}" r="20" fill="url(#${id}-grad)"/>`;
    }
    art += `<text x="${bx + bw2 / 2}" y="${cy - 170}" text-anchor="middle" font-size="34" font-weight="800" fill="${INK}">↑</text>`;
  } else if (sc === "blocks") {
    const cols = ["#c7d2fe", IND, VIO];
    cols.forEach((c, i) => {
      const h = 60 - i * 10, yb = cy + 90 - i * 62;
      art += `<rect x="${cx - 70}" width="140" y="${yb - h}" height="${h}" rx="12" fill="${i === 0 ? SOFTY : c}" stroke="${LINE}" stroke-width="1.5"/>`;
      art += `<rect x="${cx - 70}" width="140" y="${yb - 24}" height="14" rx="7" fill="${WHITE}" opacity=".35"/>`;
    });
    art += `<circle cx="${cx + 120}" cy="${cy + 30}" r="26" fill="#fef3c7" stroke="${WARM_A}" stroke-width="3"/>`;
    art += `<text x="${cx + 120}" y="${cy + 37}" text-anchor="middle" font-size="24" font-weight="800" fill="${WARM_A}">+</text>`;
    art += `<rect x="${cx - 90}" y="${cy + 96}" width="180" height="10" rx="5" fill="${LINE}"/>`;
  } else if (sc === "gear") {
    art += `<circle cx="${cx}" cy="${cy}" r="74" fill="${SOFTY}" stroke="${LINE}" stroke-width="2"/>`;
    for (let i = 0; i < 10; i++) {
      const a = i * 36 * Math.PI / 180;
      art += `<rect x="${cx - 13}" y="${cy - 96}" width="26" height="24" rx="6" fill="${IND}" transform="rotate(${i * 36} ${cx} ${cy})"/>`;
    }
    art += `<circle cx="${cx}" cy="${cy}" r="52" fill="url(#${id}-grad)"/>`;
    art += `<circle cx="${cx}" cy="${cy}" r="18" fill="${WHITE}"/>`;
  } else if (sc === "shield") {
    art += `<path d="M ${cx} ${cy - 120} L ${cx + 130} ${cy - 84} V ${cy} Q ${cx + 130} ${cy + 96} ${cx} ${cy + 128} Q ${cx - 130} ${cy + 96} ${cx - 130} ${cy} V ${cy - 84} Z" fill="${SOFTY}" stroke="${LINE}" stroke-width="2"/>`;
    art += `<path d="M ${cx} ${cy - 120} L ${cx + 130} ${cy - 84} V ${cy} Q ${cx + 130} ${cy + 96} ${cx} ${cy + 128} Q ${cx - 130} ${cy + 96} ${cx - 130} ${cy} V ${cy - 84} Z" fill="${IND}" opacity=".14"/>`;
    const mark = "✓";
    art += `<circle cx="${cx}" cy="${cy}" r="58" fill="url(#${id}-grad)"/><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="56" font-weight="800" fill="${WHITE}">${mark}</text>`;
  } else if (sc === "scale") {
    art += `<path d="M ${cx - 170} ${cy + 90} L ${cx + 170} ${cy + 90}" stroke="${SLATE}" stroke-width="10" stroke-linecap="round"/>`;
    art += `<line x1="${cx}" y1="${cy + 90}" x2="${cx}" y2="${cy - 110}" stroke="${SLATE}" stroke-width="10" stroke-linecap="round"/>`;
    art += `<path d="M ${cx - 110} ${cy - 60} L ${cx - 10} ${cy - 60}" stroke="${SLATE}" stroke-width="8" stroke-linecap="round"/>`;
    art += `<path d="M ${cx + 10} ${cy - 60} L ${cx + 110} ${cy - 60}" stroke="${SLATE}" stroke-width="8" stroke-linecap="round"/>`;
    art += `<path d="M ${cx - 110} ${cy - 48} L ${cx - 60} ${cy - 12} L ${cx - 60} ${cy + 20}" stroke="${SLATE}" stroke-width="6" stroke-linecap="round"/>`;
    art += `<path d="M ${cx + 110} ${cy - 48} L ${cx + 60} ${cy - 12} L ${cx + 60} ${cy + 20}" stroke="${SLATE}" stroke-width="6" stroke-linecap="round"/>`;
    art += `<path d="M ${cx - 60} ${cy + 20} L ${cx - 120} ${cy + 40}" stroke="${SLATE}" stroke-width="6" stroke-linecap="round"/>`;
    const lean = -30;
    art += `<path d="M ${cx + 60} ${cy + 20} L ${cx + 90 + lean} ${cy + 40}" stroke="${SLATE}" stroke-width="6" stroke-linecap="round"/>`;
    art += `<circle cx="${cx - 120}" cy="${cy + 40}" r="14" fill="url(#${id}-grad)"/>`;
    art += `<circle cx="${cx + 90 + lean}" cy="${cy + 40}" r="14" fill="none" stroke="${WARM_A}" stroke-width="8"/>`;
  } else if (sc === "graph") {
    const gx0 = cx - 130, gy0 = cy + 90, gx1 = cx + 130, gy1 = cy - 90;
    art += `<line x1="${gx0}" y1="${gy0}" x2="${gx1}" y2="${gy0}" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;
    art += `<line x1="${gx0}" y1="${gy0}" x2="${gx0}" y2="${gy1}" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;
    const pts = [[0, 0], [44, -26], [88, -20], [132, -52], [176, -46], [220, -86], [260, -66]];
    const poly = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${gx0 + p[0]} ${gy0 + p[1]}`).join(" ");
    art += `<path d="${poly}" fill="none" stroke="url(#${id}-grad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
    art += `<path d="${poly} L ${gx0 + 260} ${gy0} L ${gx0} ${gy0} Z" fill="url(#${id}-grad)" opacity=".12"/>`;
    [[44, -26], [132, -52], [220, -86]].forEach((p) => { art += `<circle cx="${gx0 + p[0]}" cy="${gy0 + p[1]}" r="8" fill="${WHITE}" stroke="${IND}" stroke-width="4"/>`; });
  } else if (sc === "telescope") {
    art += `<line x1="${cx - 120}" y1="${cy + 100}" x2="${cx - 140}" y2="${cy + 150}" stroke="${SLATE}" stroke-width="14" stroke-linecap="round"/>`;
    art += `<rect x="${cx - 60}" y="${cy - 62}" width="${120}" height="${62}" rx="14" fill="url(#${id}-grad)" transform="rotate(-38 ${cx} ${cy})"/>`;
    art += `<rect x="${cx + 2}" y="${cy - 92}" width="${120}" height="${76}" rx="16" fill="${VIO}" opacity=".55" transform="rotate(-38 ${cx} ${cy})"/>`;
    art += `<circle cx="${cx}" cy="${cy}" r="${s.dot ? 0 : 16}" fill="${WHITE}" opacity="0"/>`;
    const ao = -38 * Math.PI / 180;
    art += `<circle cx="${cx + 300 * Math.cos(ao)}" cy="${cy + 300 * Math.sin(ao)}" r="18" fill="${WARM_A}"/>`;
    art += `<circle cx="${cx + 300 * Math.cos(ao) - 10}" cy="${cy + 300 * Math.sin(ao) - 14}" r="6" fill="${WHITE}"/>`;
  }
  let svgOut = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
${grads(id)}
<circle cx="${cx}" cy="${cy}" r="${R}" fill="${SOFTY}"/>
<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${LINE}" stroke-width="1.5"/>${art}`;
  if (s.caption !== false && s.caption !== undefined) svgOut += `<text x="${W / 2}" y="${H - 26}" text-anchor="middle" font-size="14.5" font-weight="700" fill="${MED}">${esc(s.caption || "")}</text>`;
  return svgOut + `<defs><marker id="${id}-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${WARM_A}"/></marker></defs></svg>`;
};

const templates = { chip, mindmap, loop, flow, fanout, cheatsheet, scorecard, worksheet, timeline, bench, compare, stackbar, spot };
const spotScenes = ["target", "radar", "ladder", "blocks", "gear", "shield", "scale", "graph", "telescope"];

// ---------------- runner ----------------
const dataFile = process.argv[2];
if (!dataFile) { console.error("usage: node figgen.js <figures-data.js>"); process.exit(1); }
const data = require(path.resolve(dataFile));
const outDir = data.outdir || path.join(path.dirname(dataFile), "artifacts", "img");
fs.mkdirSync(outDir, { recursive: true });
let wrote = 0, failed = 0;
for (const f of data.figs) {
  const t = f.type;
  const fn = templates[t];
  if (!fn) { console.error("  !! unknown type " + t + " for " + f.file); failed++; continue; }
  const id = f.file.replace(/\.svg$/i, "").replace(/[^A-Za-z0-9]/g, "-");
  let svg;
  try { svg = fn(f, id); }
  catch (e) { console.error("  !! error " + t + " " + f.file + ": " + e.message); failed++; continue; }
  const outFile = path.join(outDir, f.file);
  if (!String(svg).trim().startsWith("<svg")) { console.error("  !! invalid svg for " + f.file); failed++; continue; }
  fs.writeFileSync(outFile, svg);
  wrote++;
  console.log("  wrote " + f.file);
}
console.log("figgen done: wrote=" + wrote + " failed=" + failed);