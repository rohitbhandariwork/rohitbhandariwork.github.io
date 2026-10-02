"use strict";
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");
const LEDGER_DIR = path.join(ROOT, "deliveries");
const LEDGER = path.join(LEDGER_DIR, "ledger.jsonl");

module.exports = { ROOT, LEDGER_DIR, LEDGER };
