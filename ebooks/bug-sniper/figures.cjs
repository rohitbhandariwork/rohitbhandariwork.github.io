// figures.cjs — Bug Sniper figure manifest (drives figgen).
"use strict";
module.exports = {
  outdir: require("path").join(__dirname, "artifacts", "img"),
  figs: [
    // ---- front matter ----
    { file: "fm-master-map.svg", type: "mindmap", title: "BUG SNIPER", sub: "real engineering · the production loop",
      nodes: [
        { label: "Debug", sub: "Part 1" }, { label: "Reproduce", sub: "Ch 2" },
        { label: "Observe", sub: "Part 2" }, { label: "SLOs & alerts", sub: "Ch 7" },
        { label: "Harden", sub: "Part 3" }, { label: "Stability patterns", sub: "Ch 9" },
        { label: "Ship", sub: "Part 4" }, { label: "Incident response", sub: "Ch 13" },
      ] },
    { file: "fm-navigator.svg", type: "fanout", question: "What's your situation right now?", sub: "start where the pain is",
      branches: [
        { tag: "ONCALL", label: "I'm the one losing sleep", outcome: "Ch 1–5, 13. The loop, first." },
        { tag: "OBSERVE", label: "I can't see my system",  outcome: "Ch 6–8. Senses, SLOs, alerts." },
        { tag: "HARDEN",  label: "It survives, barely",    outcome: "Ch 9–11. Patterns + failure." },
        { tag: "SHIP",    label: "Deploys scare me",      outcome: "Ch 12, 13. Defend the pipe." },
      ] },
    { file: "fm-persona.svg", type: "spot", scene: "radar", caption: "Rhea, Sam, Meera — three engineers, one production loop." },
    { file: "fm-spine.svg", type: "loop", title: "THE PRODUCTION LOOP", sub: "the spine of this book",
      labels: ["find it", "see it", "hold it"],
      nodes: [ { label: "Debug", sub: "reproduce → fix" }, { label: "Observe", sub: "logs · metrics · traces" },
               { label: "Harden", sub: "patterns · trade-offs" }, { label: "Ship", sub: "gates · rollback" } ] },

    // ---- ch1 ----
    { file: "ch01-map.svg", type: "mindmap", title: "DEBUGGING IS A SYSTEM", sub: "the loop beats the instinct",
      nodes: [
        { label: "Reproduce", sub: "control the case" }, { label: "Diagnose", sub: "hypothesis first" },
        { label: "Fix", sub: "cause, not symptom" }, { label: "Reflect", sub: "learn, ship, move on" },
        { label: "Negative results", sub: "data, not failure" }, { label: "Theory-hopping", sub: "the enemy" },
      ] },
    { file: "ch01-first.svg", type: "spot", scene: "radar", caption: "First production incident — the panic is optional." },
    { file: "ch01-senses.svg", type: "flow", steps: [
        { label: "Calm down", desc: "the system will wait for the decider" },
        { label: "Grab a log", desc: "the incident is already written down" },
        { label: "Run the loop", desc: "reproduce · diagnose · fix · reflect" } ] },

    // ---- ch2 ----
    { file: "ch02-loop.svg", type: "loop", title: "SHRINK THE CASE", sub: "control variables, cut the field",
      labels: ["capture", "control", "cut"],
      nodes: [ { label: "Capture", sub: "logs, state, timing, before it's gone" }, { label: "Control", sub: "one variable at a time" },
               { label: "Shrink", sub: "smallest repro still failing" }, { label: "Name it", sub: "one sentence hypothesis" } ] },
    { file: "ch02-capture.svg", type: "cheatsheet", title: "THE CAPTURE LIST", sub: "what to save before the window closes",
      items: [ { label: "Timestamps", value: "exact, not 'around then'" },
               { label: "Input that broke it", value: "the actual payload" },
               { label: "State before/after", value: "config, schema, env" },
               { label: "The error verbatim", value: "stack + message" },
               { label: "What changed lately", value: "deploy, config, load" } ], footer: "assume logs don't survive. copy them out." },
    { file: "ch02-bisect.svg", type: "fanout", question: "The repro is flaky", sub: "change one thing, observe, fold",
      branches: [
        { tag: "WINDOW",  label: "Find the window", outcome: "perf + time-based triggers" },
        { tag: "SWAP",    label: "Swap suspects",   outcome: "binary search the change space" },
        { tag: "SHRINK",  label: "Cut the input",   outcome: "smallest payload still failing" } ] },

    // ---- ch3 ----
    { file: "ch03-hypothesis.svg", type: "loop", title: "DIAGNOSE LIKE A SCIENTIST", sub: "one hypothesis at a time",
      labels: ["then test", "verdict", "repeat"],
      nodes: [ { label: "Form hypothesis", sub: "explains the evidence" }, { label: "Design the test", sub: "smallest falsifying probe" },
               { label: "Get a verdict", sub: "not a theory" }, { label: "Update the model", sub: "kill the dead branches" } ] },
    { file: "ch03-senses.svg", type: "flow", steps: [
        { label: "Metrics", desc: "what changed? latency, errors, saturation" },
        { label: "Logs", desc: "what exactly happened, in order" },
        { label: "Traces", desc: "which path through the system" } ] },
    { file: "ch03-bisect-space.svg", type: "bench", title: "THE CHANGE SPACE", sub: "aim bisects at history, not guesses",
      columns: ["Dimension", "Where to look", "Tool"],
      rows: [ ["Deploys", "release log + diff", "git bisect"],
              ["Config", "config history", "diff + owners"],
              ["Load", "traffic pattern", "metrics before/after"],
              ["Data", "schema + partition", "migration history"] ] },

    // ---- ch4 ----
    { file: "ch04-cause-vs-trigger.svg", type: "compare",
      left: { title: "The trigger", sub: "what lit the fuse", items: ["a spike, a deploy, a payload", "changing, recurring", "mitigation: hotfix, restart, rollback"] },
      right: { title: "The cause", sub: "why the fuse existed", items: ["a design invariant that held by luck", "stable until it isn't", "mitigation: a fix that holds"] } },
    { file: "ch04-fit.svg", type: "flow", steps: [
        { label: "Write the fix", desc: "against the cause, not the trigger" },
        { label: "Replay the repro", desc: "pre-fix fails, post-fix passes" },
        { label: "Add the guard", desc: "a probe that would have caught it" },
        { label: "Ship small", desc: "fix · monitor · watch" } ] },
    { file: "ch04-fivewhy.svg", type: "worksheet", title: "FIVE WHYS — THE REAL ANSWER", sub: "the fifth why names the design fix",
      prompts: [
        { label: "Why #1 — what broke?", hint: "the visible failure" },
        { label: "Why #2 — what failed underneath?", hint: "the component" },
        { label: "Why #3 — what invariant was held 'by luck'?", hint: "the design gap" },
        { label: "Why #4 — why was the gap acceptable?", hint: "the process gap" },
        { label: "Why #5 — what's the systemic fix?", hint: "the fix that holds" } ] },

    // ---- ch5 ----
    { file: "ch05-timeline.svg", type: "timeline", title: "THE INCIDENT TIMELINE", sub: "the artifact every postmortem starts from",
      span: 12,
      phases: [
        { start: 0,  end: 3,  label: "DETECT", color: "#818cf8", note: "alert / user / monitor" },
        { start: 3,  end: 5,  label: "MITIGATE", color: "#667eea", note: "stop the bleed first" },
        { start: 5,  end: 8,  label: "DIAGNOSE", color: "#667eea" },
        { start: 8,  end: 10, label: "RESOLVE", color: "#764ba2" },
        { start: 10, end: 12, label: "ACTION", color: "#4338ca", note: "postmortem → fixes" } ] },
    { file: "ch05-blame.svg", type: "compare",
      left: { title: "Blame postmortem", sub: "the expensive default", items: ["stops at 'who did it'", "people hide evidence", "same incident, next month"] },
      right: { title: "Blameless postmortem", sub: "the one that works", items: ["asks 'what failed'", "evidence stays visible", "fixes the system instead"] } },
    { file: "ch05-actions.svg", type: "worksheet", title: "ACTION ITEMS THAT SURVIVE", sub: "one owner, one date, one test",
      prompts: [
        { label: "Action item", hint: "fix that holds, not a poll" },
        { label: "Owner", hint: "one human, name it" },
        { label: "Date due", hint: "this week if it burns" },
        { label: "How will we know it worked?", hint: "the probe that would've caught it" } ] },

    // ---- ch6 ----
    { file: "ch06-golden.svg", type: "flow", steps: [
        { label: "Latency", desc: "how long requests take — p50, p90, p99" },
        { label: "Traffic", desc: "how much is arriving — QPS curve" },
        { label: "Errors", desc: "the % that fail — the budget drain" },
        { label: "Saturation", desc: "how full the system is — queues, CPU, mem" } ] },
    { file: "ch06-which.svg", type: "fanout", question: "Which sense do you reach for first?", sub: "match the question to the signal",
      branches: [
        { tag: "WHAT",  label: "Something's wrong", outcome: "metrics — latency / errors first" },
        { tag: "WHEN",  label: "It happened at…",    outcome: "metrics around the timestamp" },
        { tag: "WHY",   label: "What exactly?",      outcome: "logs, then a trace" },
        { tag: "WHERE", label: "Which path is slow?", outcome: "traces — branch by branch" } ] },
    { file: "ch06-instrument.svg", type: "cheatsheet", title: "INSTRUMENT THE MISSING SENSES", sub: "a system you can't see isn't debuggable",
      items: [ { label: "Request id → logs", value: "correlate the story" },
               { label: "Metric per dependency", value: "latency, errors, saturation" },
               { label: "Trace at boundaries", value: "where systems meet" },
               { label: "Log the decisions", value: "what the code chose + why" } ] },

    // ---- ch7 ----
    { file: "ch07-fournines.svg", type: "cheatsheet", title: "THE FOUR-NINES TABLE", sub: "availability is a budget with a price",
      items: [ { label: "99%", value: "73h / month" },
               { label: "99.5%", value: "3.6h / month" },
               { label: "99.9%", value: "43 min / month" },
               { label: "99.95%", value: "22 min / month" },
               { label: "99.99%", value: "4 min / month" },
               { label: "Your target?", value: "pick, then price it" } ] },
    { file: "ch07-teardown.svg", type: "fanout", question: "Teardown each alert: does it pass?", sub: "if it fails three gates, silence it",
      branches: [
        { tag: "ACT",  label: "Actionable?",  outcome: "a human can act on it, now" },
        { tag: "URGENT?", label: "Urgent?",   outcome: "fails now = paging, else dashboard" },
        { tag: "OWNED", label: "Owned?",      outcome: "one team answers for it" } ] },
    { file: "ch07-budget.svg", type: "stackbar", title: "ONE MONTH OF 99.9%", footer: "43 minutes of failure most teams can't tax together",
      segments: [ { label: "Allowed", pct: 20 }, { label: "Already spent", pct: 80 } ] },

    // ---- ch8 ----
    { file: "ch08-mental.svg", type: "loop", title: "THE ON-CALL MENTAL SET", sub: "what to check, in order",
      labels: ["deploy?", "config?", "load?"],
      nodes: [ { label: "Deploys", sub: "what shipped lately" }, { label: "Config", sub: "what flipped recently" },
               { label: "Load", sub: "what traffic did" }, { label: "Panic", sub: "only after the three" } ] },
    { file: "ch08-env.svg", type: "compare",
      left: { title: "Prod", sub: "where it counts", items: ["secrets, real data, scale, OAuth", "the only environment that matters", "drift here costs customers"] },
      right: { title: "Dev", sub: "where you rehearse", items: ["mocks, subsets, noisy neighbors", "drift from prod is the bug factory", "parity is a discipline, not a setting"] } },
    { file: "ch08-first.svg", type: "cheatsheet", title: "THE FIRST THREE MINUTES OF ON-CALL", sub: "fight the instinct to guess",
      items: [ { label: "0:00", value: "read the alert, verbatim" },
               { label: "0:30", value: "metrics + logs + trace, correlated" },
               { label: "1:00", value: "deploy? config? load?" },
               { label: "2:00", value: "state hypothesis + capture evidence" },
               { label: "3:00", value: "act or escalate — with info" } ] },

    // ---- ch9 ----
    { file: "ch09-patterns.svg", type: "bench", title: "THE STABILITY PATTERNS", sub: "named so you can buy them at review time",
      columns: ["Pattern", "It fixes", "Cost"],
      rows: [ ["Timeouts", "a dead dependency hangs forever", "choosing the number"],
              ["Circuit breaker", "cascading failure on a sick dep", "fail-fast trade-offs"],
              ["Bulkhead", "one tenant starving the fleet", "partitioning capacity"],
              ["Backpressure", "influx overwhelming a service", "rejecting when full"],
              ["Fail fast", "glacial timeouts pass the pain on", "dropping instead of stalling"] ] },
    { file: "ch09-circuit.svg", type: "spot", scene: "shield", caption: "The circuit breaker: let the sick dependency fail alone." },
    { file: "ch09-when.svg", type: "fanout", question: "Which pattern first?", sub: "match the symptom to the buy",
      branches: [
        { tag: "HANGS",  label: "Slow, never failing",   outcome: "timeouts + fail fast" },
        { tag: "CASCADE", label: "One dep, many victims", outcome: "circuit breaker" },
        { tag: "TRAFFIC", label: "One tenant floods all", outcome: "bulkhead / backpressure" } ] },

    // ---- ch10 ----
    { file: "ch10-loadpath.svg", type: "flow", steps: [
        { label: "Ingress", desc: "LB, CDN, rate limit" },
        { label: "App", desc: "the service, bounded" },
        { label: "Queue", desc: "the buffer that saves you" },
        { label: "Deps", desc: "DB, cache, external" } ] },
    { file: "ch10-retry.svg", type: "fanout", question: "Should you retry?", sub: "three retry rules that don't make it worse",
      branches: [
        { tag: "IDEMP",  label: "Idempotent?",  outcome: "safe to retry — put a budget on it" },
        { tag: "JITTER", label: "Jitter it",    outcome: "stagger so your retries don't sync" },
        { tag: "CAP",    label: "Cap + backoff", outcome: "2–3 tries, exponential, then fail" } ] },
    { file: "ch10-tradeoff.svg", type: "compare",
      left: { title: "Consistency", sub: "every read agrees", items: ["strong reads, costly writes", "right for money + state", "fail closed under stress"] },
      right: { title: "Availability", sub: "reads keep working", items: ["stale is acceptable", "right for feeds + caches", "fail open under stress"] } },

    // ---- ch11 ----
    { file: "ch11-chaos.svg", type: "fanout", question: "What did we just break?", sub: "game days teach blast radius",
      branches: [
        { tag: "KILL",  label: "Kill one pod", outcome: "failover? or gap?" },
        { tag: "STALL", label: "Stall one dep", outcome: "timeouts hold? cascade?" },
        { tag: "SURGE", label: "Surge traffic", outcome: "scales? or throttles gracefully?" } ] },
    { file: "ch11-boring.svg", type: "compare",
      left: { title: "The boring stack", sub: "boring = proven", items: ["known failure modes", "tons of ops literature", "your sleep stays intact"] },
      right: { title: "The clever stack", sub: "clever = unproven", items: ["novel failure modes", "you are the documentation", "your first customer is the bug"] } },
    { file: "ch11-cadence.svg", type: "timeline", title: "THE GAME-DAY CADENCE", sub: "a chaotic hour, on purpose, quarterly",
      span: 12,
      phases: [
        { start: 0,  end: 2,  label: "PLAN", color: "#818cf8", note: "pick one simulation" },
        { start: 2,  end: 4,  label: "GAME DAY", color: "#667eea" },
        { start: 4,  end: 6,  label: "TEARDOWN", color: "#764ba2" },
        { start: 6,  end: 8,  label: "FIXES", color: "#4338ca", note: "real action items" },
        { start: 8,  end: 10, label: "REPLAY", color: "#664ba2" },
        { start: 10, end: 12, label: "RETURN", color: "#4338ca" } ] },

    // ---- ch12 ----
    { file: "ch12-pipeline.svg", type: "flow", steps: [
        { label: "Tests", desc: "unit + integration, fast and trusted" },
        { label: "Gates", desc: "lint, build, scan, size — automated" },
        { label: "Artifact", desc: "built once, promoted only" },
        { label: "Canary", desc: "a slice of real traffic" },
        { label: "Rollback", desc: "the eject button, rehearsed" } ] },
    { file: "ch12-strategies.svg", type: "compare",
      left: { title: "Canary first", sub: "small real traffic", items: ["5% of users, then ramp", "needs comparison metric", "the safe default"] },
      right: { title: "Feature flags", sub: "code behind a switch", items: ["dark launch patterns", "instant kill switch", "but flags are config — age them"] } },
    { file: "ch12-rollback.svg", type: "cheatsheet", title: "THE ROLLBACK CHECKLIST", sub: "rehearsed, not recalled",
      items: [ { label: "Know the path", value: "one command, rehearsed" },
               { label: "Data's compatible?", value: "migrations roll both ways" },
               { label: "State too?", value: "schema + queue + cache" },
               { label: "Who presses it?", value: "named human, 24×7" },
               { label: "When not to?", value: "roll forward if data moved" } ] },

    // ---- ch13 ----
    { file: "ch13-severity.svg", type: "bench", title: "THE SEVERITY LADDER", sub: "say the number, everyone knows the drill",
      columns: ["Level", "What it means", "Response"],
      rows: [ ["P1", "users down / data at risk", "page, mitigators, timeline"],
              ["P2", "major feature degraded", "page, workaround"],
              ["P3", "small / workaroundable", "fix in business hours"],
              ["P4", "itch", "backlog ticket"] ] },
    { file: "ch13-incident.svg", type: "timeline", title: "ACK · MITIGATE · DIAGNOSE · RESOLVE", sub: "the incident lifecycle",
      span: 12,
      phases: [
        { start: 0,  end: 1,  label: "ACK", color: "#818cf8" },
        { start: 1,  end: 3,  label: "MITIGATE", color: "#667eea", note: "stop the bleed" },
        { start: 3,  end: 6,  label: "DIAGNOSE", color: "#667eea" },
        { start: 6,  end: 8,  label: "RESOLVE", color: "#764ba2" },
        { start: 8,  end: 10, label: "POSTMORTEM", color: "#4338ca" },
        { start: 10, end: 12, label: "ACTIONS", color: "#4338ca" } ] },
    { file: "ch13-plan.svg", type: "timeline", title: "12-WEEK PRODUCTION-READINESS", sub: "minute 0 to boring stability",
      span: 12,
      phases: [
        { start: 0,  end: 2,  label: "MAP", color: "#818cf8", note: "deps, load path, runbook" },
        { start: 2,  end: 4,  label: "SENSES", color: "#667eea", note: "golden signals listed" },
        { start: 4,  end: 6,  label: "SLOs", color: "#667eea", note: "targets + error budget" },
        { start: 6,  end: 8,  label: "HARDEN", color: "#764ba2", note: "top 3 patterns" },
        { start: 8,  end: 10, label: "DRILL", color: "#764ba2", note: "game day + rollback" },
        { start: 10, end: 12, label: "RUN", color: "#4338ca", note: "on-call for real" } ] },

    // ---- back matter ----
    { file: "bm-cheatsheet.svg", type: "cheatsheet", title: "THE 5 NUMBERS", sub: "production engineers own these five",
      items: [ { label: "Latency target (p99)", value: "______ ms", hl: true },
               { label: "Error budget", value: "______ % / month", hl: true },
               { label: "MTTR", value: "______ min", hl: true },
               { label: "Deploy lead time", value: "______ min", hl: true },
               { label: "SLO target", value: "______ %" },
               { label: "Blast radius of the last drill", value: "______ pods" } ], footer: "if you can't state all five, start with the map (Ch 13)" },
    { file: "bm-score.svg", type: "scorecard", title: "PRODUCTION-READINESS AUDIT", sub: "self-score now and in 12 weeks",
      score: "— / 25",
      rows: [
        { label: "I can map my load path", hint: "ingress → app → queue → deps" },
        { label: "My senses exist", hint: "logs, metrics, traces correlated" },
        { label: "I have an SLO + budget", hint: "and the alerts pass the teardown" },
        { label: "My top patterns are in", hint: "timeouts, breaker, backpressure" },
        { label: "The eject button works", hint: "rollback rehearsed and recent" } ] },
  ],
};