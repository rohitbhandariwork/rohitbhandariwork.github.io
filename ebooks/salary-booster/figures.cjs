// figures.js — Salary Booster figure manifest (drives figgen).
"use strict";
module.exports = {
  outdir: require("path").join(__dirname, "artifacts", "img"),
  figs: [
    // ---- front matter ----
    { file: "fm-master-map.svg", type: "mindmap", title: "SALARY BOOSTER", sub: "the career leverage playbook",
      nodes: [
        { label: "Know the game", sub: "Part 1" }, { label: "Know your number", sub: "Ch 3" },
        { label: "Raise the ceiling", sub: "Part 2" }, { label: "Visibility flywheel", sub: "Ch 5" },
        { label: "The exit lever", sub: "Part 3" }, { label: "Negotiation", sub: "Ch 10" },
        { label: "The 12-week system", sub: "Part 4" }, { label: "Review & repeat", sub: "Ch 12" },
      ] },
    { file: "fm-navigator.svg", type: "fanout", question: "Which situation is yours?", sub: "start where you live, not at page one",
      branches: [
        { tag: "Ask",   label: "I'm about to ask for a raise", outcome: "Read Ch 2, 6, 7 first — then 3." },
        { tag: "Level", label: "I'm stuck at the same level", outcome: "Start with Ch 4 and 5 (visibility + promotion)." },
        { tag: "Exit",  label: "I'm ready to interview",      outcome: "Go straight to Ch 8, 9, 10." },
        { tag: "Plan",  label: "I want the full system",      outcome: "Read in order. That's what Chapter 12 is for." },
      ] },
    { file: "fm-persona.svg", type: "spot", scene: "ladder", caption: "Three engineers. Three paths. One leverage stack." },
    { file: "fm-update.svg", type: "chip", tone: "go", glyph: "✓", title: "A living book",
      sub: "this edition is v1.x. You get refined editions, free — see the changelog." },

    // ---- ch1 ----
    { file: "ch01-map.svg", type: "mindmap", title: "PERCEIVED VALUE", sub: "pay follows what decision-makers believe",
      nodes: [
        { label: "Who sees your work", sub: "mechanic 1" }, { label: "How it's framed", sub: "mechanic 2" },
        { label: "What the manager repeats", sub: "mechanic 3" }, { label: "Evidence", sub: "the antidote" },
        { label: "Ceiling vs check", sub: "the split" }, { label: "Visible wins", sub: "the lever" },
      ] },
    { file: "ch01-mechanics.svg", type: "flow", steps: [
        { label: "Who sees it", desc: "work visible to the decider outperforms hidden work" },
        { label: "How it's framed", desc: "\"cut release blockers 40%\" beats \"cleaned a module\"" },
        { label: "What gets repeated", desc: "your manager retells your win in review" } ] },
    { file: "ch01-scale.svg", type: "spot", scene: "scale", caption: "Compensation is a belief market." },

    // ---- ch2 ----
    { file: "ch02-stack.svg", type: "stackbar", title: "THE COMPENSATION STACK",
      segments: [ { label: "Base", pct: 55 }, { label: "Bonus", pct: 15 }, { label: "Equity", pct: 20 }, { label: "Other", pct: 10 } ],
      footer: "illustrative split — your band varies by level and company" },
    { file: "ch02-raise-vs-offer.svg", type: "compare",
      left: { title: "A raise — capped", sub: "inside the same role", items: ["Bound to your current band", "Review cycle timing", "Incremental, budget-capped", "Hard to make big jumps"] },
      right: { title: "An offer — uncapped", sub: "new market price", items: ["Priced to the market band", "Your timing", "Negotiable up and down", "Big jumps are normal"] } },
    { file: "ch02-deciders.svg", type: "bench", title: "WHO DECIDES EACH NUMBER", sub: "know who holds the pen",
      columns: ["Part", "Who decides", "How fixed"],
      rows: [ ["Base", "band + review cycle", "semi-fixed"], ["Bonus", "company pool + rating", "formula-driven"],
              ["Equity", "grant committee", "lumpy, at grant"], ["Offer", "hiring manager + recruiter", "most negotiable"] ] },
    { file: "ch02-negotiable.svg", type: "fanout", question: "Which parts can move?", sub: "when and if you ask",
      branches: [
        { tag: "Moves", label: "offer size · equity · joining bonus", outcome: "negotiable at offer time" },
        { tag: "Slow",  label: "base inside the band · review cycle", outcome: "semi-fixed, time-bound" },
        { tag: "Locked", label: "the band itself, this cycle", outcome: "fight the right hill" },
      ] },

    // ---- ch3 ----
    { file: "ch03-ritual.svg", type: "loop", title: "MARKET-RATE RITUAL", sub: "quarterly, one hour",
      labels: ["until signal", "quarterly", "then start"],
      nodes: [ { label: "Research", sub: "fresh comp data" }, { label: "Estimate", sub: "within 10%" },
               { label: "Check", sub: "quarterly re-run" }, { label: "Act on signal", sub: "≈10% gap below market" } ] },
    { file: "ch03-grid.svg", type: "cheatsheet", title: "KNOW YOUR NUMBER", sub: "fill in your own — not these example figures",
      items: [ { label: "Market rate (your level)", value: "₹34–38L" },
               { label: "Your honest estimate", value: "₹30L" },
               { label: "Gap vs market", value: "–22%" },
               { label: "Next ritual check", value: "quarterly" },
               { label: "Signal to act", value: "≥10% gap" },
               { label: "Primary sources", value: "levels.fyi + 3 human calls" } ], footer: "a number you can't source isn't a number — it's a guess" },

    // ---- ch4 ----
    { file: "ch04-packet.svg", type: "flow", steps: [
        { label: "Draft the packet", desc: "evidence, in reviewer language" },
        { label: "Map to the rubric", desc: "tick each level requirement" },
        { label: "Sponsor review", desc: "someone who shifts decisions" },
        { label: "Submit on cycle", desc: "don't miss the window" },
        { label: "Pre-brief the committee", desc: "no surprises in the room" } ] },
    { file: "ch04-rubric.svg", type: "bench", title: "THE LEVELING RUBRIC, READ TWO WAYS", sub: "skills on the left, what you must prove",
      columns: ["Level", "Scope", "You must show"],
      rows: [ ["SDE I–II", "own tasks", "clean delivery + reliable code"],
              ["Senior", "own project", "design + influence + unblock others"],
              ["Staff", "own area", "roadmap, cross-team leverage"] ] },

    // ---- ch5 ----
    { file: "ch05-flywheel.svg", type: "loop", title: "VISIBILITY FLYWHEEL", sub: "momentum compounds",
      labels: ["feeds back", "feeds back", "feeds back"],
      nodes: [ { label: "Do visible work", sub: "aligned to goals" }, { label: "Package it", sub: "artifacts, not activity" },
               { label: "Get it seen", sub: "demos, docs, leadership" }, { label: "Get it repeated", sub: "manager retells it" } ] },
    { file: "ch05-artifacts.svg", type: "bench", title: "THE ARTIFACT MENU", sub: "evidence you can point at",
      columns: ["Artifact", "Audience", "Cadence"],
      rows: [ ["Demo / launch note", "team + leadership", "every ship"],
              ["One-pager design note", "reviewers", "each design"],
              ["Metrics snapshot", "manager", "monthly"],
              ["Internal talk", "company", "quarterly"] ] },

    // ---- ch6 ----
    { file: "ch06-calendar.svg", type: "timeline", title: "THE ASK CALENDAR", sub: "sponsorship before the formal cycle",
      span: 12,
      phases: [
        { start: 0,  end: 2,  label: "INVENTORY",  color: "#818cf8", note: "evidence bank, updated" },
        { start: 2,  end: 4,  label: "SPONSOR CONVO", color: "#667eea" },
        { start: 4,  end: 5,  label: "PACKET DRAFT", color: "#667eea" },
        { start: 5,  end: 6,  label: "SUBMIT", color: "#764ba2" },
        { start: 8,  end: 9,  label: "DECISION", color: "#764ba2" },
        { start: 10, end: 12, label: "APPEAL / NEXT", color: "#4338ca" } ] },
    { file: "ch06-convo.svg", type: "compare",
      left: { title: "Sponsorship conversation", sub: "months before the cycle", items: ["\"I want to be a senior. Help me build the case.\"", "Ask for specific support", "Manager becomes co-author"] },
      right: { title: "Formal promotion conversation", sub: "inside the cycle", items: ["You present the packet", "Ask for a decision", "Manager becomes referee"] } },

    // ---- ch7 ----
    { file: "ch07-tree.svg", type: "fanout", question: "Your counter was refused", sub: "three exits that keep goodwill",
      branches: [
        { tag: "COUNTER", label: "What would it take?", outcome: "turn reflexive no into a price" },
        { tag: "SPLIT",   label: "Meet in the middle",   outcome: "time-boxed, bounded concession" },
        { tag: "WAIT",    label: "Retreat to the system", outcome: "walk away, run the 12-week plan" } ] },
    { file: "ch07-scripts.svg", type: "cheatsheet", title: "COUNTER-OFFER SCRIPTS", sub: "the lines that keep goodwill",
      items: [ { label: "On-the-spot pushback", value: "\"What would it take?\"" },
               { label: "\"No budget this cycle\"", value: "\"Then the timeline — when?\"" },
               { label: "Title pushback", value: "\"What's the gap, exactly?\"" },
               { label: "Exploding deadline", value: "\"I need it in writing to move\"" },
               { label: "Scope of the counter", value: "one ask per conversation" } ] },

    // ---- ch8 ----
    { file: "ch08-before-after.svg", type: "compare",
      left: { title: "Activity bullet", sub: "what everyone writes", items: ["Fixed bugs in payments", "Maintained the ETL layer", "Helped with design reviews", "Worked on the dashboard"] },
      right: { title: "Outcome bullet", sub: "what screens you in", items: ["Cut payment failure rate by 40%", "Shipped 5 pipelines to prod, on time", "Ran design review for the billing rewrite", "Dashboard: 300 users, weekly"] } },
    { file: "ch08-keywords.svg", type: "bench", title: "SCREENER KEYWORDS, DEMYSTIFIED", sub: "what the filter is actually matching",
      columns: ["Keyword", "Screener meaning", "Use it in"],
      rows: [ ["\u201cscaled\u201d", "handled growth", "impact sentence"],
              ["\u201cowned\u201d", "end-to-end responsibility", "first line of each bullet"],
              ["\u201creduced / cut\u201d", "quantified outcome", "every big win"],
              ["\u201cbuild / shipped\u201d", "delivery, not activity", "project bullets"] ] },

    // ---- ch9 ----
    { file: "ch09-three.svg", type: "flow", steps: [
        { label: "Code questions", desc: "algorithms + data structures — deliberate practice" },
        { label: "Behavioral", desc: "STAR, from your evidence bank — rehearsed stories" },
        { label: "System design", desc: "one known architecture, drawn calmly" } ] },
    { file: "ch09-bank.svg", type: "worksheet", title: "THE EVIDENCE BANK", sub: "build it now; interview in calm",
      prompts: [
        { label: "Result you caused", hint: "one sentence, outcome first" },
        { label: "The number (metric)", hint: "before → after" },
        { label: "Your role in it", hint: "owned, led, or majorly contributed" },
        { label: "Your manager can repeat it", hint: "yes = evidence bank material" } ] },

    // ---- ch10 ----
    { file: "ch10-anchor.svg", type: "spot", scene: "target", caption: "Anchoring: whoever states the first number sets the range." },
    { file: "ch10-defense.svg", type: "fanout", question: "They asked for your number", sub: "answer without giving one first",
      branches: [
        { tag: "DEFEND", label: "First-Number Defense", outcome: "\"What's budgeted for the role?\"" },
        { tag: "ANCHOR", label: "State your researched number", outcome: "market-backed, calmly" },
        { tag: "WAIT",   label: "Buy time", outcome: "\"I'll get back to you today\" — then table it" } ] },
    { file: "ch10-scripts.svg", type: "cheatsheet", title: "NEGOTIATION MOVES", sub: "named, practiced, low-temp",
      items: [ { label: "First-Number Defense", value: "echo the question" },
               { label: "Time-block the gap", value: "reply within 24–48h" },
               { label: "Exploding-offer defense", value: "\"in writing, or it didn't happen\"" },
               { label: "Written offer anchor", value: "negotiate on paper" },
               { label: "Golden rule", value: "one ask, then silence" } ] },

    // ---- ch11 ----
    { file: "ch11-timeline.svg", type: "timeline", title: "THE 12 / 24 / 36 REVIEW", sub: "three horizons, one honest spreadsheet",
      span: 36,
      phases: [
        { start: 0,  end: 12, label: "COMP vs GROWTH", color: "#818cf8" },
        { start: 12, end: 24, label: "GROWTH vs RISK", color: "#667eea" },
        { start: 24, end: 36, label: "STAY OR SWITCH", color: "#764ba2" } ] },
    { file: "ch11-matrix.svg", type: "scorecard", title: "STAY-OR-SWITCH SCORECARD", sub: "rate 1–5, re-run every quarter",
      score: "— / 25",
      rows: [
        { label: "Growth ceiling",  hint: "is there room above you?" },
        { label: "Comp alignment",  hint: "vs your market number" },
        { label: "Risk balance",    hint: "volatility you can afford" },
        { label: "Energy",          hint: "burning out quietly?" },
        { label: "Mission pull",    hint: "do you still want the work?" } ] },

    // ---- ch12 ----
    { file: "ch12-plan.svg", type: "timeline", title: "THE 12-WEEK SALARY BOOSTER", sub: "choose a track, run it, review",
      span: 12,
      phases: [
        { start: 0,  end: 2,  label: "FOUNDATION", color: "#818cf8", note: "know your number" },
        { start: 2,  end: 4,  label: "VISIBILITY", color: "#667eea", note: "flywheel + artifacts" },
        { start: 4,  end: 6,  label: "PACKET / INTERVIEW", color: "#667eea" },
        { start: 6,  end: 8,  label: "THE ASK", color: "#764ba2" },
        { start: 8,  end: 10, label: "COUNTER / OFFERS", color: "#764ba2" },
        { start: 10, end: 12, label: "REVIEW & RE-RUN", color: "#4338ca" } ] },
    { file: "ch12-path.svg", type: "fanout", question: "Pick your track", sub: "the plan, served three ways",
      branches: [
        { tag: "PROMO",   label: "Promotion track", outcome: "chapters 4, 5, 6 — stay and level up" },
        { tag: "ASK",     label: "Ask track",       outcome: "chapters 2, 3, 6, 7 — raise the check" },
        { tag: "EXIT",    label: "Interview track", outcome: "chapters 8, 9, 10 — the market sets it" } ] },

    // ---- ch13 ----
    { file: "ch13-kit.svg", type: "cheatsheet", title: "SCRIPTS & TEMPLATES", sub: "your copy-paste legal kit",
      items: [ { label: "Comp conversation email", value: "§13.1" },
               { label: "Promotion case study", value: "§13.2" },
               { label: "First-number defense", value: "§13.3" },
               { label: "Counter-offer script", value: "§13.4" },
               { label: "Offer acceptance note", value: "§13.5" },
               { label: "Evidence bank sheet", value: "§13.6" } ] },

    // ---- back matter ----
    { file: "bm-cheatsheet.svg", type: "cheatsheet", title: "THE 5 NUMBERS", sub: "every engineer should know their own",
      items: [ { label: "Market rate", value: "₹__L", hl: true },
               { label: "Walk-away number", value: "₹__L", hl: true },
               { label: "Target title", value: "______" },
               { label: "Promotion timing", value: "next cycle" },
               { label: "Exit timeline", value: "12/24/36" },
               { label: "Earliest, the tethers snap", value: "when 2–3 feel wrong" } ], footer: "companies don't pay your loyalty — they pay your leverage" },
    { file: "bm-score.svg", type: "scorecard", title: "SELF-AUDIT — AFTER", sub: "re-take the start-of-book audit",
      score: "— / 25",
      rows: [
        { label: "I can quote my market number", hint: "from sources, not guesses" },
        { label: "My evidence bank is current", hint: "updated in the last 2 weeks" },
        { label: "My manager can repeat my wins", hint: "without prompting" },
        { label: "I have a named ask", hint: "written, timed, sponsored" },
        { label: "I know my exit timeline", hint: "12/24/36 written down" } ] },
  ],
};