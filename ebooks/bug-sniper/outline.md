# Bug Sniper — Outline (v2)

Working title: **Bug Sniper: Real Engineering — Beyond the Tutorial**
Format: Markdown manuscript, single source for ebook output.
Target: ~30 pages (owner allows raising). Visual-dense: 2–3 elements per page.
Slug: `real-engineering`
Subtitle: *Real Engineering: Beyond the Tutorial*
Tagline: *The production playbook for engineers past the tutorial.*

Spine: **The Production Loop** — *Debug → Observe → Harden → Ship*. Every chapter plugs into
the loop. Unifying claim: the engineers who own production don't debug better by instinct —
they run the same loop, in the same order, with tools for each stage.

Voice: dry, confident, second person. Scenario openers per chapter. Personas: **Rhea** (on-call/incident
lead), **Sam** (feature dev facing a first production incident), **Meera** (platform/stability owner).
Case-study thread runs across chapters.

Reuses the shared system (figgen.cjs, chips, brand palette) and the whole-book framework:
navigator, master mind map, personas, update promise, scorecards, nightmare cards, knowledge checks,
glossary, cheat sheet, runbook/incident checklists, real commands/snippets.

---

## Manuscript structure

### Front matter
- Preface, Introduction (roadmap), Reader navigator, master mind map, persona opener, living book.
- The Production Loop postcard.

### Part 1 — The Debug Loop
1. **Debugging is a system, not a talent.** First prod incident; the loop as the antidote to
   theory-hopping. Negative results are data, not failure.
2. **Reproduce it.** Capture everything, control variables, shrink the case. (Named technique:
   *Shrink the Case*.) Real capture commands.
3. **Diagnose like a scientist.** Hypothesis → test → verdict; bisecting with history and
   dashboards; the explain-it-first rule. (Named technique: *Bisect the Change Space.*)
4. **Fix the cause, not the symptom.** Root cause vs trigger; writing the fix that holds;
   proving the fix with the same repro. (Named: *The Fit-For-Good Fix.*)
5. **Reflect.** Blameless postmortems, action items that survive, the timeline artifact.

### Part 2 — See Your System
6. **The production senses.** Logs, metrics, traces — which to reach for and when; the golden
   signals; correlation beats intuition.
7. **SLOs, error budgets, and alerts that aren't noise.** Target/downstream SLOs, the four-nines
   table, alert teardown (actionable? urgent? owner?). (Named: *The Alert Teardown.*)
8. **Production realities.** Deploys, config, env drift, on-call 101, the first thing you check.

### Part 3 — Harden
9. **The stability patterns.** Named, reviewable: timeouts, circuit breaker, bulkhead, backpressure,
   fail fast. When each pays and what it costs.
10. **The trade-offs that matter.** Load path, partial failure, queues and batching, retries with
    jitter, consistency vs availability.
11. **Failure in practice.** Failure injection, blast radius, game days, and the boring stack.

### Part 4 — Ship & Stay Out
12. **CI/CD that defends production.** Gates, canary, rollback, feature flags, the deploy discipline.
13. **Incident response & the 12-week production-readiness runbook.** Severity ladder, roles,
    comms, timeline; week-by-week readiness plan.

### Back matter
- Runbook template, incident checklist, FAQ, glossary, knowledge-check answers.
- Cheat sheet — the 5 numbers: p99 target, error budget %, MTTR, deploy lead time, SLO %.

## Recurring boxes (every chapter)
- Scenario opener, Short version, Do this, Watch out, Nightmare card, Knowledge check.
- Real CLI/snippet callouts inside Debug and Ship parts.

## Writing order
Figures manifest → chapters 1–13 in order → back matter. Review gate: owner read-through after
initial draft (tone inherited from Salary Booster's approved Ch 1).