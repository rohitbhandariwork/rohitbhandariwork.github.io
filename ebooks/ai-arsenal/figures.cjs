// figures.cjs — AI Arsenal figure manifest (drives figgen).
"use strict";
module.exports = {
  outdir: require("path").join(__dirname, "artifacts", "img"),
  figs: [
    // ---- front matter ----
    { file: "fm-master-map.svg", type: "mindmap", title: "AI ARSENAL", sub: "from first token to production AI",
      nodes: [
        { label: "Understand", sub: "Part 1" }, { label: "The engine", sub: "Ch 1" },
        { label: "Augment", sub: "Part 2" }, { label: "RAG · agents", sub: "Ch 5–6" },
        { label: "Verify", sub: "Part 3" }, { label: "Eval-first", sub: "Ch 8" },
        { label: "Ship", sub: "Part 3–4" }, { label: "Production AI", sub: "Ch 9–10" },
      ] },
    { file: "fm-navigator.svg", type: "fanout", question: "What do you actually need?", sub: "the path that matches the moment",
      branches: [
        { tag: "START",  label: "LLMs feel like black magic", outcome: "Ch 1–3. Understand first." },
        { tag: "BUILD",  label: "I'm building a feature",      outcome: "Ch 4–6. Prompt, RAG, agents." },
        { tag: "PROD",   label: "It must survive production",  outcome: "Ch 8–10. Evals, cost, guardrails." },
        { tag: "WORK",   label: "Help me work smarter",        outcome: "Ch 11–13. AI-assisted coding." },
      ] },
    { file: "fm-persona.svg", type: "spot", scene: "blocks", caption: "Nora, Vik, Simran — three engineers, one build path." },
    { file: "fm-spine.svg", type: "loop", title: "THE BUILD PATH", sub: "the spine of this book",
      labels: ["grok the engine", "wire it in", "prove it"],
      nodes: [ { label: "Understand", sub: "probabilistic mindset" }, { label: "Augment", sub: "prompt · RAG · agents" },
               { label: "Verify", sub: "evals, first" }, { label: "Ship", sub: "cost · guardrails · ops" } ] },

    // ---- ch1 ----
    { file: "ch01-map.svg", type: "mindmap", title: "THE PROBABILISTIC MACHINE", sub: "an LLM is a next-token guesser",
      nodes: [
        { label: "Tokens", sub: "the units" }, { label: "Context", sub: "the working memory" },
        { label: "Next-token", sub: "the single skill" }, { label: "Sampling", sub: "where randomness lives" },
        { label: "Not a computer", sub: "no memory, no check" }, { label: "Determinism", sub: "an engineering choice" },
      ] },
    { file: "ch01-pipeline.svg", type: "flow", steps: [
        { label: "Text → tokens", desc: "input split into ~4-char units" },
        { label: "Score tokens", desc: "the model ranks every candidate" },
        { label: "Sample", desc: "pick one, weighted" },
        { label: "Repeat", desc: "append, predict the next next token" } ] },
    { file: "ch01-guess.svg", type: "spot", scene: "target", caption: "The output is a weighted guess — not a computed answer." },

    // ---- ch2 ----
    { file: "ch02-trust.svg", type: "bench", title: "THE TRUST THERMOMETER", sub: "rank every use by what's at stake",
      columns: ["Task", "Trust it?", "Backstop"],
      rows: [ ["Summarize", "High", "skim it"],
              ["Rewrite / draft", "High", "edit it"],
              ["Extract structured", "Mid", "validate schema"],
              ["Facts / numbers", "Low", "verify against source"],
              ["Money / identity", "Never", "hard rules + human"] ] },
    { file: "ch02-hallucinate.svg", type: "fanout", question: "The model asserts a fact. What do you do?", sub: "hallucinations are confident by default",
      branches: [
        { tag: "SOURCE", label: "It cites nothing",  outcome: "anchor to a retrieved source or drop it" },
        { tag: "CHECK",  label: "It cites something", outcome: "verify the citation exists and says that" },
        { tag: "GATE",   label: "Stakes are high",    outcome: "hard rules + human approval, always" } ] },
    { file: "ch02-why.svg", type: "flow", steps: [
        { label: "Next-token", desc: "it keeps the story going, plausibly" },
        { label: "No memory", desc: "no fact store, just context" },
        { label: "No check", desc: "smoothness wins over truth" } ] },

    // ---- ch3 ----
    { file: "ch03-dial.svg", type: "flow", steps: [
        { label: "Temperature", desc: "0 = greedy (steady), 1+ = looser" },
        { label: "Structured output", desc: "JSON mode, schemas, constrained decode" },
        { label: "Glue code", desc: "the deterministic partner around the model" } ] },
    { file: "ch03-structured.svg", type: "cheatsheet", title: "MAKING A GUESSER BEHAVE", sub: "the dials that turn probability into product",
      items: [ { label: "temperature=0", value: "near-deterministic answers" },
               { label: "response_format=schema", value: "valid JSON, always" },
               { label: "constrained decoding", value: "only allowed tokens" },
               { label: "max tokens", value: "cap runaway output" },
               { label: "retries on schema", value: "1–2, then fail clean" } ] },
    { file: "ch03-glue.svg", type: "compare",
      left: { title: "The model handles", sub: "open, fuzzy, creative", items: ["tone, rewrite, first draft", "classification with buckets", "the 80% that's judgement-ish"] },
      right: { title: "The code handles", sub: "closed, exact, repeatable", items: ["math, money, retries", "schema, validation, security", "the output that must not vary"] } },

    // ---- ch4 ----
    { file: "ch04-kit.svg", type: "bench", title: "THE PROMPT KIT", sub: "five slots, filled deliberately",
      columns: ["Slot", "What goes in", "Example"],
      rows: [ ["Role", "who the model is", "senior data engineer"],
              ["Task", "the deliverable", "rewrite this error message…"],
              ["Context", "facts it needs", "here's the stack trace + diff"],
              ["Format", "exact output shape", "JSON: {title, cause, step}"],
              ["Constraints", "what not to do", "no jargon; max 2 lines"] ] },
    { file: "ch04-loop.svg", type: "loop", title: "THE ITERATION LOOP", sub: "vibe-checking is a cope; eval is a loop",
      labels: ["then score", "fix the gaps", "repeat"],
      nodes: [ { label: "Prompt", sub: "v1, written down" }, { label: "Run cases", sub: "the golden set" },
               { label: "Score", sub: "pass/fail per case" }, { label: "Refine", sub: "edit, then re-run" } ] },
    { file: "ch04-fewshot.svg", type: "cheatsheet", title: "FEW-SHOT, DONE RIGHT", sub: "examples beat adjectives",
      items: [ { label: "3–5 examples", value: "enough to set the pattern" },
               { label: "Real, varied", value: "edge cases, not the happy path" },
               { label: "Show the failure too", value: "what bad output looks like" },
               { label: "Update with evals", value: "examples that kill bugs stay" } ] },

    // ---- ch5 ----
    { file: "ch05-rag.svg", type: "loop", title: "THE RETRIEVAL LOOP", sub: "index · embed · retrieve · rerank · generate",
      labels: ["then generate", "rerank", "retrieve"],
      nodes: [ { label: "Index", sub: "chunk + embed your docs" }, { label: "Retrieve", sub: "top-k by similarity" },
               { label: "Rerank", sub: "order by relevance, not just cosine" }, { label: "Generate", sub: "grounded in the hits" } ] },
    { file: "ch05-when.svg", type: "fanout", question: "How should the model get its knowledge?", sub: "the honest decision tree",
      branches: [
        { tag: "RAG",   label: "Facts change often",   outcome: "retrieve fresh docs per query" },
        { tag: "CTX",   label: "Docs fit in context",  outcome: "long-context prompt, no pipeline" },
        { tag: "FT",    label: "Fixed style, many forms", outcome: "fine-tune form, not facts" } ] },
    { file: "ch05-chunk.svg", type: "cheatsheet", title: "CHUNKING WITHOUT SADNESS", sub: "retrieval lives or dies on units",
      items: [ { label: "Size", value: "200–500 tokens, semantic units" },
               { label: "Keep context", value: "headings + parent into the chunk" },
               { label: "Embed per chunk", value: "the chunk is the query target" },
               { label: "Eval retrieval", value: "hit@k on your own golden set" },
               { label: "Rerank top ~20", value: "then generate from the top 3" } ] },

    // ---- ch6 ----
    { file: "ch06-agent.svg", type: "flow", steps: [
        { label: "Perceive", desc: "read the task + tool results" },
        { label: "Plan", desc: "decide the next action" },
        { label: "Act", desc: "call a tool from the allowlist" },
        { label: "Observe", desc: "loop with the result" } ] },
    { file: "ch06-budget.svg", type: "cheatsheet", title: "AGENT GUARDRAILS", sub: "the irresponsible agent is an unbudgeted search",
      items: [ { label: "Tool allowlist", value: "fewer tools, fewer surprises" },
               { label: "Max steps", value: "3–8, hard stop" },
               { label: "Step cost cap", value: "failure isn't free" },
               { label: "Human-in-the-loop", value: "approve writes + money" },
               { label: "Read-only default", value: "escalate to act" } ] },
    { file: "ch06-when.svg", type: "compare",
      left: { title: "Deterministic glue", sub: "you wrote the steps", items: ["you know every path", "cheap, testable, reviewable", "right answer > flexibility"] },
      right: { title: "Agent, on budget", sub: "the model picks steps", items: ["many possible paths", "cost++, eval harder", "right for open-ended tasks"] } },

    // ---- ch7 ----
    { file: "ch07-when.svg", type: "fanout", question: "To fine-tune or not?", sub: "RAG ties facts; tuning ties behavior",
      branches: [
        { tag: "FORM",  label: "Fixed style/format",    outcome: "tune it — form, not facts" },
        { tag: "FACTS", label: "Facts change often",    outcome: "RAG, not tuning" },
        { tag: "NO",    label: "Prompt already works",  outcome: "don't — evals first, always" } ] },
    { file: "ch07-lora.svg", type: "compare",
      left: { title: "Full fine-tune", sub: "hospital-grade", items: ["retrains everything", "needs big data + GPU budget", "risk of catastrophic forgetting"] },
      right: { title: "PEFT / LoRA", sub: "the practical default", items: ["trains small adapters", "fast, cheap, swappable", "usually enough for form"] } },
    { file: "ch07-data.svg", type: "cheatsheet", title: "THE 3x3 DATA RULE", sub: "dataset quality over size, always",
      items: [ { label: "~300 examples", value: "start, don't collect forever" },
               { label: "Real + hard cases", value: "failures you've actually seen" },
               { label: "3 honest judges", value: "not one hurried expert" } ] },

    // ---- ch8 ----
    { file: "ch08-loop.svg", type: "loop", title: "EVAL-FIRST DEVELOPMENT", sub: "data → model → eval → gate",
      labels: ["then gate", "score", "feed back"],
      nodes: [ { label: "Data", sub: "the golden set" }, { label: "Model", sub: "prompt / RAG / tune" },
               { label: "Eval", sub: "score the set" }, { label: "Gate", sub: "merge into prod" } ] },
    { file: "ch08-types.svg", type: "bench", title: "EVAL TYPES, CHOSEN", sub: "match the grader to the task",
      columns: ["Type", "Best for", "Watch out"],
      rows: [ ["Exact match", "names, ids, code", "brittle on phrasing"],
              ["Semantic similarity", "summaries", "scores, not verdicts"],
              ["LLM-as-judge", "subjective quality", "judge bias — audit it"],
              ["Rubric scored", "multi-dimensional", "write the rubric first"] ] },
    { file: "ch08-judge.svg", type: "worksheet", title: "THE GOLDEN SET", sub: "20–50 cases, labeled, versioned",
      prompts: [
        { label: "Case (input)", hint: "one real production input" },
        { label: "Expected output", hint: "the 'good answer' token-for-token" },
        { label: "Type", hint: "exact · semantic · judge · rubric" },
        { label: "Why it's here", hint: "what failure it exists to catch" } ] },

    // ---- ch9 ----
    { file: "ch09-cost.svg", type: "cheatsheet", title: "TOKEN MATH THAT PAYS RENT", sub: "know your spend per user, per month",
      items: [ { label: "Price per 1M in", value: "__ ₹" },
               { label: "Price per 1M out", value: "≈ 3–4× input" },
               { label: "Tokens per request", value: "ctx × features" },
               { label: "Cost per user·mo", value: "req × tokens × price" },
               { label: "Where it leaks", value: "huge contexts, blind retries" } ] },
    { file: "ch09-cache.svg", type: "fanout", question: "Latency is too high", sub: "four levers, in order",
      branches: [
        { tag: "CACHE",   label: "Cache repeats",   outcome: "exact-hit KV + string cache" },
        { tag: "STREAM",  label: "Stream the answer", outcome: "time-to-first-token wins, not total" },
        { tag: "SMALL",   label: "Smaller model",   outcome: "cheap model first, escalate" },
        { tag: "WINDOW",  label: "Slash context",   outcome: "the 40k tokens you send, cost you pay" } ] },
    { file: "ch09-fallback.svg", type: "flow", steps: [
        { label: "Boring path", desc: "fast, cheap, deterministic" },
        { label: "Model, on budget", desc: "the AI path with caps" },
        { label: "Fallback", desc: "clean error, no mystery" } ] },

    // ---- ch10 ----
    { file: "ch10-guard.svg", type: "flow", steps: [
        { label: "Input filter", desc: "PII, blocklists, size caps" },
        { label: "Guardrail", desc: "prompt-injection checks" },
        { label: "Output filter", desc: "moderation + schema" },
        { label: "Audit log", desc: "who sent what, retained" } ] },
    { file: "ch10-inject.svg", type: "bench", title: "PROMPT-INJECTION, NAMED", sub: "the attack is hiding in the untrusted text",
      columns: ["Vector", "Looks like", "Defense"],
      rows: [ ["Direct", "\"ignore previous instructions\"", "treat instructions + data separately"],
              ["Indirect", "malicious text in a doc you RAG", "sanitize retrieved content"],
              ["Exfil", "\"repeat the system prompt\"", "never include secrets in prompt"] ] },
    { file: "ch10-pii.svg", type: "compare",
      left: { title: "Utility", sub: "send everything, get the best answer", items: ["leak surface = whole context", "retention questions", "cheap until it isn't"] },
      right: { title: "Privacy", sub: "send only what the task needs", items: ["minimize, mask, redact", "log what left the boundary", "laws follow the data"] } },

    // ---- ch11 ----
    { file: "ch11-pair.svg", type: "loop", title: "THE PAIR LOOP", sub: "plan · prompt · review · test",
      labels: ["then test", "review", "next diff"],
      nodes: [ { label: "Plan", sub: "you sketch the shape" }, { label: "Prompt", sub: "small, specific diffs" },
               { label: "Review", sub: "read every line" }, { label: "Test", sub: "the suite decides" } ] },
    { file: "ch11-trust.svg", type: "fanout", question: "Should you let the model write this?", sub: "the honest filter",
      branches: [
        { tag: "YES",    label: "Boilerplate + glue",   outcome: "let it write, you review shape" },
        { tag: "CAREFUL", label: "Logic + algorithm",   outcome: "you sketch, it fills, tests gate" },
        { tag: "NO",     label: "Security / money",     outcome: "human hand, human review" } ] },
    { file: "ch11-hand.svg", type: "compare",
      left: { title: "Let the model", sub: "the cheap parts", items: ["boilerplate, mocks, tests", "first drafts, refactors", "repetitive glue"] },
      right: { title: "Keep to yourself", sub: "the expensive parts", items: ["design decisions", "data + security boundaries", "code you can't easily prove"] } },

    // ---- ch12 ----
    { file: "ch12-filter.svg", type: "fanout", question: "Is this AI project worth building?", sub: "four gates, no exceptions",
      branches: [
        { tag: "ROI",    label: "Real ROI, measured",   outcome: "hours saved × users, estimated" },
        { tag: "EVAL",   label: "Success defined",      outcome: "a pass/fail, not a vibe" },
        { tag: "COST",   label: "Budgeted for real",    outcome: "token math on a napkin" },
        { tag: "RISK",   label: "Failure is cheap",     outcome: "a bad answer costs little" } ] },
    { file: "ch12-map.svg", type: "bench", title: "THE PROJECT MAP", sub: "rate each idea, then pick one",
      columns: ["Idea", "Hours saved / mo", "Eval-definable?", "Risk"],
      rows: [ ["Support triage", "12", "yes", "low"],
              ["Doc copilot", "8", "mid", "low"],
              ["Code assistant", "20", "mid", "mid"],
              ["Money autopilot", "40", "no", "high"]] },
    { file: "ch12-small.svg", type: "timeline", title: "SMALL WINS FIRST", sub: "two weeks to a shipped tool beats two months to a rev",
      span: 8,
      phases: [
        { start: 0, end: 2, label: "CHOOSE", color: "#818cf8" },
        { start: 2, end: 4, label: "BUILD", color: "#667eea" },
        { start: 4, end: 6, label: "EVAL", color: "#667eea" },
        { start: 6, end: 8, label: "SHIP", color: "#764ba2" } ] },

    // ---- ch13 ----
    { file: "ch13-plan.svg", type: "timeline", title: "THE 12-WEEK AI ENGINEER", sub: "understand, then ship small",
      span: 12,
      phases: [
        { start: 0,  end: 2,  label: "FOUNDATION", color: "#818cf8", note: "probabilistic mindset" },
        { start: 2,  end: 4,  label: "PICK", color: "#667eea", note: "one ROI-verified idea" },
        { start: 4,  end: 6,  label: "BUILD", color: "#667eea", note: "prompt / RAG prototype" },
        { start: 6,  end: 8,  label: "EVALS", color: "#764ba2", note: "golden set + gate" },
        { start: 8,  end: 10, label: "SHIP", color: "#764ba2", note: "guardrails + cost caps" },
        { start: 10, end: 12, label: "REVIEW", color: "#4338ca", note: "scorecard + next pick" } ] },
    { file: "ch13-stack.svg", type: "compare",
      left: { title: "The stack you own", sub: "defaults for solo builders", items: ["one managed model API", "schema'd JSON out", "a tiny eval harness", "token math + caps"] },
      right: { title: "The enterprise stack", sub: "what teams add", items: ["fine-tunes + routing", "agent frameworks, budgeted", "an eval pipeline in CI", "guardrails, audits, retention"] } },
    { file: "ch13-audit.svg", type: "scorecard", title: "THE AI SELF-AUDIT", sub: "score now, re-score in 12 weeks",
      score: "— / 25",
      rows: [
        { label: "I can explain next-token", hint: "and where randomness lives" },
        { label: "I prompt with a kit", hint: "role, task, context, format, limits" },
        { label: "I have a golden set", hint: "20–50 cases, labeled, versioned" },
        { label: "I know my token spend", hint: "per user, per month" },
        { label: "I shipped one small win", hint: "with guardrails + an eval gate" } ] },

    // ---- back matter ----
    { file: "bm-cheatsheet.svg", type: "cheatsheet", title: "THE 5 NUMBERS", sub: "working engineers carry these",
      items: [ { label: "Price per 1M tokens", value: "in __/ out __" },
               { label: "Latency budget", value: "first token __ ms", hl: true },
               { label: "Eval floor", value: "gate at __%", hl: true },
               { label: "Retrieval top-k", value: "retrieve __ / use __" },
               { label: "Context window usage", value: "use __ % max" },
               { label: "My last eval score", value: "passed on __ date" } ], footer: "if these aren't numbers, the feature isn't in production yet" },
    { file: "bm-score.svg", type: "scorecard", title: "THE AI SELF-AUDIT — AFTER", sub: "re-run the start-of-book audit",
      score: "— / 25",
      rows: [
        { label: "I can explain next-token", hint: "from memory, to a peer" },
        { label: "My prompts are eval'd", hint: "golden set pass/fail, recorded" },
        { label: "My RAG retrieval scores", hint: "hit@k on my own set" },
        { label: "My feature has cost caps", hint: "token math + hard budgets" },
        { label: "My one small win is live", hint: "and its numbers are visible" } ] },
  ],
};