// chips.js — shared box-chip sprites used across all three ebooks.
"use strict";
module.exports = {
  outdir: require("path").join(__dirname, "..", "artifacts", "sprite"),
  figs: [
    { file: "chip-scenario.svg", type: "chip", tone: "indigo",  glyph: "▶", title: "Scenario",   sub: "the situation this chapter solves" },
    { file: "chip-short-version.svg", type: "chip", tone: "go",   glyph: "✓", title: "Short version", sub: "the idea in four lines" },
    { file: "chip-do-this.svg", type: "chip", tone: "violet", glyph: "✦", title: "Do this",     sub: "one concrete action, right now" },
    { file: "chip-warning.svg", type: "chip", tone: "warm",  glyph: "!", title: "Watch out",   sub: "the mistake most engineers make here" },
    { file: "chip-cheat-sheet.svg", type: "chip", tone: "violet", glyph: "§", title: "Cheat sheet", sub: "keep this number where you can see it" },
    { file: "chip-knowledge-check.svg", type: "chip", tone: "go", glyph: "?", title: "Knowledge check", sub: "three questions. answers in the back" },
    { file: "chip-nightmare.svg", type: "chip", tone: "warm",  glyph: "×", title: "Nightmare card", sub: "how this goes wrong, and the fix" },
    { file: "chip-key-number.svg", type: "chip", tone: "indigo", glyph: "#", title: "Key number", sub: "the metric that matters this chapter" },
    { file: "chip-evidence.svg", type: "chip", tone: "go", glyph: "◇", title: "Evidence",  sub: "record it as a result, not an activity" },
    { file: "chip-script.svg", type: "chip", tone: "indigo", glyph: "¶", title: "Script",     sub: "say this. then be quiet and listen" },
    { file: "chip-worksheet.svg", type: "chip", tone: "violet", glyph: "≡", title: "Worksheet", sub: "fill it in before you move on" },
    { file: "chip-tip.svg", type: "chip", tone: "ambersoft", glyph: "★", title: "Tip", sub: "the shortcut that costs you nothing" },
    { file: "chip-living-book.svg", type: "chip", tone: "go", glyph: "✓", title: "A living book", sub: "this edition is v1.x. Refined editions — free for buyers." },
  ],
};