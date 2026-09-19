# AI Arsenal — Outline (v2)

Working title: **AI Arsenal: AI for Working Engineers**
Format: Markdown manuscript, single source for ebook output.
Target: ~35 pages (owner allows raising). Visual-dense: 2–3 elements per page.
Slug: `ai-working-engineer`
Subtitle: *AI for Working Engineers*
Tagline: *LLMs, RAG, AI-assisted coding, and production AI — practical tools for engineers who want to stay ahead of the shift.*

Spine: **The Build Path** — *Understand → Augment → Verify → Ship*. Every chapter plugs into the
path. Evaluation is the anchor: you only improve what you measure, so **eval-first development** appears
early and runs through everything.

Voice: dry, confident, second person. Scenario openers. Personas: **Nora** (data/platform engineer putting
an LLM feature into a real product), **Vik** (backend engineer adopting AI-assisted coding at work),
**Simran** (owns evals and the production AI stack).

Reuses shared visual system + whole-book framework (navigator, master map, personas, living book, scorecards,
nightmare cards, knowledge checks, glossary, cheat sheet, artifact kits: eval template, prompt kit, cost
worksheet). Implementation-level: prompt snippets, Python-style eval sketches, cost math.

---

## Manuscript structure

### Front matter
Preface, Introduction (roadmap), Reader navigator, master mind map, persona opener, living book.

### Part 1 — Understand the Engine
1. **The probabilistic machine.** Tokens, context, next-token; how an LLM "thinks" — nothing like a
   computer. (Named: *The Probabilistic Mindset.*)
2. **Capabilities and honest limits.** Hallucination, no fact-checking, brittleness; what you can and
   cannot trust, and why.
3. **Determinism on purpose.** Temperature, structured output, constrained decoding; glue code as the
   predictable partner.

### Part 2 — Augment
4. **Prompting as engineering.** The prompt kit (role, task, context, format, constraints); few-shot;
   iterating with an eval, not a vibe.
5. **RAG done right.** Index, embed, retrieve, rerank, generate; when RAG is the wrong tool (long context,
   knowledge in weights). (Named: *The Retrieval Loop.*)
6. **Agents & tool use.** When an agent is worth it; loops, tool allowlists, budgets, guardrails.
7. **Fine-tuning when it's worth it.** Form, not facts; PEFT/LoRA; dataset quality over size.

### Part 3 — Verify & Ship
8. **Eval-first development.** Define success, build a golden set, score offline, gate on it; LLM-as-judge
   with caution. (Named: *The Eval Loop.*)
9. **Production AI.** Token math, latency and cost budgets, caching, streaming, fallbacks, the boring AI stack.
10. **Guardrails & safety.** PII, prompt injection, moderation, output filtering, logging for abuse control.

### Part 4 — The Working Engineer
11. **AI-assisted coding, deliberately.** The pair loop (plan → prompt → review → test); when to trust and
    when to write by hand.
12. **Picking AI projects with real ROI.** The opportunity filter; small wins first; what to not build.
13. **The 12-week AI engineer.** Week-by-week: foundation → pick → build → evals → ship → review.

### Back matter
Glossary, eval template + prompt kit, FAQ, knowledge-check answers.
Cheat sheet — the 5 numbers: token cost per 1M, latency budget, eval floor, retrieval top-k, context usage.

## Recurring boxes (every chapter)
Scenario opener, Short version, Do this, Watch out, Nightmare card, Knowledge check.

## Writing order
Figure manifest → chapters 1–13 in order → back matter. Review gate: owner read-through after initial draft.