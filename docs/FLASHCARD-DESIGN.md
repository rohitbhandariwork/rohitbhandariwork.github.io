# Flashcard Design

Design reference for the Flashcard tool (`/flashcard/`). This document defines *how
flashcards should work*: the learner psychology, the scheduling model, the user flow,
and the UI spec we build against.

Source: internet research on memory science, spaced-repetition algorithms, and
Apple Human Interface Guidelines (see [References](#references)).

---

## 1. Why flashcards work (the science)

A flashcard is a **retrieval practice** device, not a presentation device. The
learning happens in the act of *attempting* to recall the answer before seeing it.

### 1.1 Active recall / the testing effect

- Retrieving information strengthens memory more than re-reading it. This is the
  **testing effect** (Roediger & Karpicke): tests are learning events, not just
  measurement.
- Every flashcard review is a tiny test: front cue shown, answer attempted, back
  revealed. The harder the attempt, the stronger the reinforced trace — *as long as*
  the learner can still succeed at the end.

### 1.2 The spacing effect

- Memory for anything is dramatically better when practice repeats are **spaced in
  time** rather than massed together ("cramming").
- Kornell (2009), modelling real flashcard use: **spacing helped 90% of
  participants**, yet **72% believed massing had worked better** — people's intuition
  about their own learning is systematically wrong.
- Practical implication: **one large, shuffled review set beats several small topic
  stacks** (interleaving within a session). Multi-day spacing beats single-day
  repetition. Sessions must repeat content **across days**, not only within.
- Linear learning curves are wrong: the same content should come back at
  1 day → 3 days → 7 days → 21 days → etc.

### 1.3 Desirable difficulties (Bjork)

Some conditions that *feel* harder in the moment produce stronger long-term memory:

- **Spacing** (vs massing)
- **Retrieval practice** (vs re-reading)
- **Interleaving** (vs blocking topics)
- **Reduced/withheld feedback** (the moment of uncertainty is the learning moment)
- **Effortful generation** (produce, don't recognize)

Design corollary: the product should *encourage* momentary difficulty and not paper
over it. Instant easy wins (e.g. "got it" bodies up front) feel good but transfer
poorly.

### 1.4 Forgetting and the "New Theory of Disuse"

- **Storage strength** (permanence) and **retrieval strength** (current accessibility)
  are separate. Forgetting lowers retrieval strength but re-retrieval rebuilds it
  *more* when it has dropped than when it hasn't — this is why spacing works.
- Ebbinghaus's forgetting curve: retention decays sharply within hours–days and
  levels off. Each re-review at an increasing interval flattens the curve.

### 1.5 Metacognition: learners misjudge themselves

- Judgments of learning (JOLs) are poorly calibrated; people study easy items too
  long and hard items too little.
- Overconfidence is the flashcard killer: a learner who taps "Got it" without really
  generating the answer trains nothing.
- Product implication:
  - The **self-assessment step must come before** the answer is revealed (a yes/no
    "I knew it" is worthless after seeing the back — separate *recall attempt* from
    *answer reveal*, or require a self-grade that is honest by construction).
  - Calibration nudges: occasionally prompt "Did you really produce this, or recognize
    it?" and periodically show the user their recall accuracy stats (the spacing
    benefit is counter-intuitive — 72% of learners believe the wrong thing, so the UI
    must communicate it).

### 1.6 Motivation: intrinsic beats extrinsic

- Extrinsic currency (XP, gems, streaks) can drive habit formation, but it also
  invites *gaming* — clicking the easy answer to farm points, which defeats the
  learning loop.
- Better loop design: reward **scheduled completion** (did your reviews today?) and
  **honesty** (accurate self-grades), not raw card throughput.
- A visible **retention line** (predicted vs actual recall over days) turns
  meta-cognition itself into the motivating feedback.

---

## 2. Scheduling algorithms

| | Leitner boxes | SM-2 (Anki classic) | FSRS v4/5 (Anki current) |
| :--- | :--- | :--- | :--- |
| Model | Fixed box intervals (1,3,7 days) | Ease factor + interval | Stability + Difficulty + Retrievability (3-component model) |
| Personalization | None | None | ML-fit 21 weights per user |
| Parameters | 0 | 3 | 21 trainable |
| Retention target | None | None | Yes (70–99%) |
| Known problems | Boxes don't adapt to card difficulty | "Ease hell" — hard cards stuck at short intervals | Needs review history to optimize (cold start uses defaults) |
| Data needed | None | Small | Defaults first, improves with data |

**Decision for this app:**

- Ship with **SM-2** as the default scheduler — it is well specified, needs zero
  training data, and is good enough at small scale (the app has no login; progress is
  local to the browser).
- Design the data model (review log) so an **FSRS optimizer can be dropped in later**
  without a schema rewrite. Every review records: card id, grade (again/hard/good/
  easy), timestamp, interval, ease, and difficulty — the raw material FSRS needs.
- Optional: a single **"leisure mode"** with plain Leitner-style boxes for users who
  want zero mental overhead.

---

## 3. The rating model

Standard states, aligned to the science and to user expectations (Anki vocabulary is
now familiar to learners): **Again · Hard · Good · Easy** (4 grades).

| Grade | Meaning (learner did recall attempt first) | Scheduling effect |
| :--- | :--- | :--- |
| Again | Could not recall, or recall was wrong | Relearn now; interval resets to learning steps (1m, 10m, then ~1d) |
| Hard | Recalled, but effortful / shaky | Interval ~ +1.2x, ease down |
| Good | Recalled normally | Interval ~ +1.5–2.5x (per ease), ease stable |
| Easy | Recalled instantly with confidence | Interval + big jump, ease up |

Rules that keep the machine honest:

1. **Grade after generating, not after peeking.** The interaction is: read front →
   *say/think the answer* → reveal back → decide. Recording the grade *before*
   revealing (compulsory) makes overdaiming visible, not rewarded.
2. **"Again" must be re-shopped within the same session** (relearn the card there and
   then, then it returns only per schedule — this is Anki's *learning steps* behavior).
3. Do not let "Hard/Good/Easy" flood: after grading a card, it leaves today's queue;
   "Again" cards stay and are retested until passed at least once today.

---

## 4. User flow (target)

### 4.1 Global states

```
boot
 ├─ first run  → onboarding (compact, 3 steps, skippable, never again)
 └─ returning  → review queue view (what is due today)
```

### 4.2 Core loop (a study session)

```
due list          → for each due card:
                      1. SHOW FRONT            (question visible, answer hidden)
                      2. RECALL                (user attempts silently, "Show answer" button)
                      3. REVEAL                (card flips on request)
                      4. SELF-GRADE            (Again / Hard / Good / Easy)
                          ├─ Again → card stays in today's queue (relearn now)
                          └─ else  → card scheduled for the future
  session end      → summary: cards reviewed, again %, accuracy trend, next-due preview
```

Key UX rule (from §1.3, §1.5): **the flip is user-initiated.** Nothing auto-reveals.
This preserves the retrieval attempt and prevents "read the back, call it a review".

### 4.3 Tiers (content depth)

The existing Normal / Detailed / Expert model is good and stays:

- Normal → prompt tier (front / concise answer)
- Detailed → answer + explanation/example (the `extra` field today)
- Expert → no peek-able syntax, requires explaining in your own words (question +
  answer blank, self-graded free recall — "grade honestly")

Tier is now a **per-card** depth preference set at scheduling time, and Expert always
increases relative difficulty in the scheduler (it is not a free XP boost).

### 4.4 Powers / gamification (revised)

Keep the light game layer but re-wire incentives (see §1.6):

- **Streak** → counts completing *scheduled* reviews on consecutive days (real
  spacing), not random visits.
- **Mystery / Booster** → kept as optional flavor, but XP is granted for honest
  grades + completing the daily queue, and gems cannot be *farmed* by flipping cards
  without grading.
- **Calibration report** (new): a rolling line showing predicted recall (from the
  scheduler's model) vs. your actual grades. Watching yourself beat the model is the
  retention feedback loop.

### 4.5 Timer mode

Optional racing mode for extra focus sessions: pick a duration, the queue keeps
pulling the leas-t-urgent due cards until the timer ends. No XP multiplier — it's a
focus tool, not an exploit farm.

---

## 5. Existing implementation audit

Current `/flashcard/` (as of this doc): topic picker → single shuffled deck →
tap-to-flip → rate (Got it / Tricky / Again) → XP/gems/streak/levels →
deck-complete screen.

Problems found against the science:

| # | Issue | Science violation |
| :- | :--- | :--- |
| 1 | No scheduler — cards never come back across days | No spacing effect (the main benefit) |
| 2 | "Again" cards aren't retested in-session | No relearning step |
| 3 | Rating buttons shown only *after* reveal, no forced recall gate | Weak active recall; over-claiming ("Got it" bias) |
| 4 | "Got it" body farmable → learning bypassed | Extrinsic > intrinsic (gamification defeats the loop) |
| 5 | 6-step tutorial every visit | Blocks content; kills retention of flow |
| 6 | Topic-stack massing encouraged | Kornell: large shuffled set > small stacks |
| 7 | Deck-complete = single pass | One-pass "completion" has no memory target |
| 8 | Streak = daily visit | Rewards the wrong behavior |
| 9 | No calibration / accuracy feedback | Learners misjudge retention (72% wrong about massing) |

---

## 6. UI spec (Apple HIG)

Only the deltas vs. the current implementation; visual details stay in
`brand.css` tokens.

- **Hierarchy**: study card is the hero, centered, fills most of the width
  (max ~560px), stable height. All controls are clearly *below* the card. Nothing
  overlaps the card (fixed stable-height faces, content scrolls inside).
- **Touch targets**: every control >= 44pt; action row uses 44pt segmented buttons.
- **Segmented controls (HIG)**: tier selector and the Again/Hard/Good/Easy grader are
  segmented control style, not emotionally-labeled floating buttons. Use neutral,
  information-carrying labels; the learner should read **state**, not *vibe*.
- **One primary action per screen**: during a session, the primary action is
  "Show answer"; on the review screen it is "Start today's review".
- **Motion**: flip is a short, single rotation (<= 500ms), no spring exaggerations;
  grade transition is opacity + 160px slide, direction consistent with queue order.
- **Progressive disclosure**: onboarding = 3 cards max; powers live behind an
  "(i)"/settings affordance, not a floating row of 4 emote buttons.
- **Error-free states**: Empty queue → positive "All reviews done" with next-due
  preview; first run → short explainer (retrieval + spacing) not a 6-step tutorial.

---

## 7. Data model

Local-only (no backend; same constraint as the rest of the site).

```
review log:  [{ cardId, ts, grade, interval, ease, difficulty }]
card state:  { cardId, due, interval, ease, lapses, lastGrade }
daily queue: derived from card states where due <= now
progress:    { xp, gems, streak, lastStudyDay, tier, calibration[] }
```

Schema is written as append-only (log) so an FSRS optimizer and analytics can be
added later without a migration. Storage is `localStorage` (documented in
`flashcard.js`), structured as one JSON document.

---

## 8. Success metrics

- **Stickiness**: % of returning learners who maintain a >3-day streak of *scheduled*
  completion.
- **Honesty**: distribution of grade counts — a healthy learner is ~20–30% Again.
  Withdrawal of over-claiming is a signal the recall gate works.
- **Calibration**: mean absolute error of self-grades vs. the scheduler's predicted
  retrievability (target: showing improvement over the first 14 days).
- **Layout health**: zero overlapping-hit-area incidents on mobile (measured via
  element-region collision checks on 390/768/1280px).

---

## References

- Kornell, N. (2009). *Optimising learning using flashcards: Spacing is more effective
  than cramming.* Applied Cognitive Psychology, 23, 1297–1317.
- Bjork, R.A. & Bjork, E.L. (2020). *Desirable difficulties in theory and practice.*
  Journal of Applied Research in Memory and Cognition, 9(4).
- Roediger & Karpicke (2006). *Test-enhanced learning.* Psychological Science, 17.
- Latimier, Peyre & Ramus (2021). *Benefit of spacing out retrieval practice episodes.*
  Educational Psychology Review, 33(3), 959–987.
- Open Spaced Repetition. *The FSRS algorithm* (fsrs4anki wiki) and FSRS-5 default
  parameters.
- Anki Manual / FAQ. *What spaced repetition algorithm does Anki use?* (SM-2 + FSRS).
- Apple. *Human Interface Guidelines* (developer.apple.com/design).