const TOPICS = [
  {
    id: 'python',
    name: '🐍 Python Basics',
    realm: 'Realm 1: The Awakening',
    cards: [
      { q: 'What does `len()` return for a string?', a: 'The number of characters.', extra: 'len("hello") -> 5. Works on any sequence: str, list, tuple, dict, set.' },
      { q: 'Difference between list and tuple?', a: 'Lists are mutable, tuples immutable.', extra: 'Tuples are also faster and can be dict keys. Use a tuple for fixed data.' },
      { q: 'What does `import random` let you do?', a: 'Generate random numbers / pick random items.', extra: 'random.randint(a,b), random.choice(seq), random.shuffle(list).' },
      { q: 'What is a dictionary?', a: 'Key→value pairs (hash map).', extra: 'd = {"name": "Rohit"}; d["name"]; d.get(key, default). O(1) lookups.' },
      { q: 'What does `range(3)` produce?', a: '0, 1, 2 (stop exclusive).', extra: 'range(start, stop, step). Lazy — pair with list() or iterate directly.' },
      { q: 'What is a function?', a: 'A reusable block of code called by name.', extra: 'def greet(name): return f"Hi {name}". Parameters, default values, *args, **kwargs.' },
      { q: 'What is a module?', a: 'A .py file that can be imported.', extra: 'import math; math.sqrt(16). Packages are folders of modules with __init__.py.' }
    ]
  },
  {
    id: 'sql',
    name: '🗄️ SQL',
    realm: 'Realm 2: The Data Mines',
    cards: [
      { q: 'What does SELECT do?', a: 'Fetches columns from a table.', extra: 'SELECT name, age FROM users WHERE age > 18 ORDER BY name LIMIT 10.' },
      { q: 'Difference INNER JOIN vs LEFT JOIN?', a: 'INNER keeps only matches; LEFT keeps all left rows.', extra: 'LEFT JOIN fills unmatched right side with NULL. Use LEFT when you want every user regardless of orders.' },
      { q: 'What does GROUP BY do?', a: 'Groups rows into aggregates.', extra: 'SELECT dept, COUNT(*) FROM employees GROUP BY dept. Always pairs with aggregate: COUNT, SUM, AVG, MAX.' },
      { q: 'What is an index?', a: 'A structure that speeds lookups.', extra: 'CREATE INDEX idx_email ON users(email). Costs write speed, helps reads. Great for WHERE/JOIN columns.' },
      { q: 'What is a PRIMARY KEY?', a: 'A unique, non-null identifier per row.', extra: 'Usually an auto-increment id or UUID. Guarantees uniqueness and speeds joins.' },
      { q: 'What is normalization?', a: 'Reducing redundant data.', extra: 'Split repeated data into tables + relations. 1NF/2NF/3NF remove duplication and update anomalies.' },
      { q: 'What does WHERE vs HAVING filter?', a: 'WHERE filters rows; HAVING filters groups.', extra: 'SELECT dept, COUNT(*) FROM e GROUP BY dept HAVING COUNT(*) > 3.' }
    ]
  },
  {
    id: 'fastapi',
    name: '⚡ FastAPI',
    realm: 'Realm 3: The API Forges',
    cards: [
      { q: 'What is a route?', a: 'A URL path mapped to a function.', extra: '@app.get("/items/{id}") def get_item(id: int). FastAPI builds docs automatically.' },
      { q: 'How does FastAPI validate JSON?', a: 'Via Pydantic models.', extra: 'class Item(BaseModel): name: str; price: float. Reject invalid payloads with 422.' },
      { q: 'Path vs query parameters?', a: 'Path is part of URL; query after ?.', extra: '/users/42 vs /users?page=2. Path = identity, query = options/filters.' },
      { q: 'What is `async def` for?', a: 'Non-blocking concurrency for I/O.', extra: 'await on external calls (HTTP, DB). CPU-bound logic should stay sync or use threadpoolexecutor.' },
      { q: 'What is CORS?', a: 'Browser security rule for cross-origin calls.', extra: 'Backend sends Access-Control-Allow-Origin. FastAPI: CORSMiddleware with allowed_origins.' },
      { q: 'What is uvicorn?', a: 'The ASGI server that runs FastAPI.', extra: 'uvicorn app:app --reload --port 8000. --reload auto-restarts on edits.' },
      { q: 'What is a dependency?', a: 'Shared logic injected into routes.', extra: 'Depends(get_db) reuses DB sessions/auth. Clean, testable, removes boilerplate.' }
    ]
  },
  {
    id: 'react',
    name: '⚛️ React',
    realm: 'Realm 4: The Component Cathedral',
    cards: [
      { q: 'What is a component?', a: 'A function returning JSX.', extra: 'function Card({title}) { return <div>{title}</div> }. Reusable UI block.' },
      { q: 'Props vs state?', a: 'Props are passed in; state is internal.', extra: 'Props immutable from child. Learn: one-way data flow parent→child.' },
      { q: 'What is useState?', a: 'A hook storing reactive data.', extra: 'const [count, setCount] = useState(0). Changing state re-renders the component.' },
      { q: 'What is a controlled input?', a: 'Value bound to state + onChange.', extra: '<input value={v} onChange={e=>setV(e.target.value)} />. Single source of truth.' },
      { q: 'What is useEffect for?', a: 'Side effects after render.', extra: 'Fetch, subscriptions, timers. useEffect(() => {...}, [deps]). Cleanup via returned fn.' },
      { q: 'What is the virtual DOM?', a: 'A JS replica React diffs before painting.', extra: 'Reconciliation: compare old/new virtual tree, batch minimal real-DOM changes.' },
      { q: 'Why keys in lists?', a: 'React tracks items by key.', extra: 'key={item.id} stable + unique. Missing keys cause render bugs and wasted work.' }
    ]
  },
  {
    id: 'concurrency',
    name: '⚙️ Concurrency',
    realm: 'Realm 5: The Parallel Realms',
    cards: [
      { q: 'Threads vs processes?', a: 'Threads share memory; processes are separate.', extra: 'Threads light, blocked by GIL; processes parallel CPU work, more overhead.' },
      { q: 'What is the GIL?', a: 'A lock letting one Python thread run bytecode at a time.', extra: 'Limits CPU-bound threading. I/O-bound is fine — releases GIL on waits.' },
      { q: 'What is a thread pool?', a: 'A fixed set of reusable workers.', extra: 'from concurrent.futures import ThreadPoolExecutor. Bounded concurrency, no thread churn.' },
      { q: 'What is async/await?', a: 'Cooperative single-threaded concurrency.', extra: 'one event loop, many tasks, await yields control during I/O. async def + await call.' },
      { q: 'Blocking vs non-blocking?', a: 'Blocking waits; non-blocking continues.', extra: 'Fetch a URL = blocking call. Event-loop apps never block: schedule then resume on ready.' },
      { q: 'What is a queue for?', a: 'Buffering work between producers/consumers.', extra: 'Backend job queues tame bursts: requests enqueue, workers drain at steady rate.' },
      { q: 'What is idempotency?', a: 'Running an operation twice = once.', extra: 'Same order id, same result. Critical for retries and payments (avoid double charges).' }
    ]
  }
];

const LS = 'flashcard_progress';
const DAY = 86400000;
const MAX_CYCLES = 3;

function $id(x) { return document.getElementById(x); }
function dayKey(ts) {
  const d = new Date(ts || Date.now());
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

let S = {
  tier: 'normal',
  onboarded: false,
  meta: { xp: 0, gems: 0, streak: 0, lastStudyDay: '', totalReviews: 0 },
  cards: {},
  log: []
};

function save() {
  try { localStorage.setItem(LS, JSON.stringify(Object.assign({ v: 2 }, S))); } catch (e) {}
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(LS));
    if (d && d.v === 2) {
      S.tier = d.tier || 'normal';
      S.onboarded = !!d.onboarded;
      S.meta = Object.assign({ xp: 0, gems: 0, streak: 0, lastStudyDay: '', totalReviews: 0 }, d.meta || {});
      S.cards = d.cards || {};
      S.log = d.log || [];
    }
  } catch (e) {}
}

function cardFor(key) {
  const [tid, qi] = key.split('::');
  const t = TOPICS.find((x) => x.id === tid);
  return t ? { topic: t, idx: Number(qi), card: t.cards[Number(qi)] } : null;
}
function keyOf(topic, idx) { return topic.id + '::' + idx; }
function getCard(key) {
  if (!S.cards[key]) S.cards[key] = { ease: 2.5, iv: 0, due: 0, reps: 0, lapses: 0, state: 'new' };
  return S.cards[key];
}

const GRADES = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 };

function schedule(key, grade) {
  const c = getCard(key);
  const now = Date.now();
  c.reps++;
  S.meta.totalReviews++;
  S.log.push({ c: key, g: grade, ts: now });
  if (S.log.length > 500) S.log = S.log.slice(-500);

  if (grade === GRADES.AGAIN) {
    c.lapses++;
    c.ease = Math.max(1.3, +(c.ease - 0.2).toFixed(2));
    c.iv = 1;
    c.due = now;
  } else if (c.state === 'new') {
    c.iv = grade === GRADES.EASY ? 3 : 1;
    c.state = 'review';
    c.due = now + c.iv * DAY;
    if (grade === GRADES.EASY) c.ease = Math.min(2.6, +(c.ease + 0.15).toFixed(2));
  } else {
    if (grade === GRADES.HARD) {
      c.ease = Math.max(1.3, +(c.ease - 0.15).toFixed(2));
      c.iv = Math.max(1, Math.round(c.iv * 1.2));
    } else if (grade === GRADES.GOOD) {
      c.iv = Math.max(1, Math.round(c.iv * c.ease));
    } else {
      c.ease = Math.min(2.6, +(c.ease + 0.15).toFixed(2));
      c.iv = Math.max(1, Math.round(c.iv * c.ease * 1.3));
    }
    c.iv = Math.min(365, c.iv);
    c.due = now + c.iv * DAY;
  }
  save();
  return c.iv;
}

function xpFor(grade) {
  const base = [0, 2, 3, 5][grade];
  const mult = S.tier === 'expert' ? 1.4 : S.tier === 'hard' ? 1.2 : 1;
  return Math.round(base * mult);
}

function freshView() {
  return { queue: [], pos: 0, again: [], cycles: 0, revealed: false, graded: 0, againCount: 0, xp: 0 };
}
let view = freshView();

function showView(name) {
  ['onboardView', 'queueView', 'topicsView', 'sessionView', 'doneView'].forEach((v) => {
    $id(v).style.display = v === name ? 'block' : 'none';
  });
}

function showToast(msg, type) {
  const t = $id('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || 'success');
  setTimeout(() => (t.className = 'toast'), 2400);
}

function dueList() {
  const now = Date.now();
  return Object.keys(S.cards)
    .filter((k) => S.cards[k].state !== 'new' && S.cards[k].due <= now)
    .sort((a, b) => S.cards[a].due - S.cards[b].due);
}
function dueNow() { return dueList().length; }
function nextDueIn() {
  const f = Object.keys(S.cards)
    .map((k) => S.cards[k])
    .filter((c) => c.state !== 'new' && c.due > Date.now())
    .sort((a, b) => a.due - b.due)[0];
  return f ? f.due - Date.now() : null;
}
function fmtDelay(ms) {
  if (ms == null) return 'later';
  const h = Math.round(ms / 3600000);
  if (h < 1) return 'under an hour';
  if (h < 48) return h + 'h';
  return Math.round(h / 24) + ' days';
}

function availableNew() {
  const have = new Set(Object.keys(S.cards));
  const all = [];
  TOPICS.forEach((t) => t.cards.forEach((_, i) => { const k = keyOf(t, i); if (!have.has(k) || S.cards[k].state === 'new') all.push(k); }));
  return all;
}

function renderQueue() {
  const due = dueNow();
  const fresh = availableNew().length;
  $id('qvSub').textContent = due ? 'You have cards waiting' : 'Nothing due — perfect.';
  $id('qmDue').textContent = due;
  $id('qmNew').textContent = fresh;
  $id('qmNext').textContent = due ? 'now' : fmtDelay(nextDueIn());
  $id('qvLevel').textContent = level();
  $id('qvGems').textContent = '💎' + S.meta.gems;
  $id('qvStreak').textContent = '🔥 ' + S.meta.streak + ' day streak';
  $id('qvTotal').textContent = S.meta.totalReviews + ' reviews';
  $id('startBtn').textContent = due ? 'Start review' : fresh ? 'Study new cards' : 'All caught up';
  $id('startBtn').disabled = !(due || fresh);
  renderSpark();
}

function renderSpark() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const map = {};
  S.log.forEach((e) => { const k = dayKey(e.ts); (map[k] = map[k] || []).push(e.g); });
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const list = map[dayKey(today.getTime() - i * DAY)] || [];
    days.push(list.length ? Math.round(list.filter((g) => g >= GRADES.GOOD).length / list.length * 100) : null);
  }
  $id('spark').innerHTML = days.map((p) =>
    `<span class="${p == null ? 'spk spk-none' : p >= 75 ? 'spk spk-ok' : p >= 50 ? 'spk spk-mid' : 'spk spk-low'}" style="height:${p == null ? 4 : Math.max(8, p)}%"></span>`
  ).join('');
  const recent = days.slice(-7).filter((p) => p != null);
  $id('qvCalibPct').textContent = recent.length ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length) + '%' : '—';
}

function openTopics() {
  showView('topicsView');
  const grid = $id('topicGrid');
  grid.innerHTML = '';
  TOPICS.forEach((t) => {
    const el = document.createElement('button');
    el.className = 'topic-btn';
    el.textContent = t.name;
    el.onclick = () => startTopic(t.id);
    grid.appendChild(el);
  });
}

function startTopic(id) {
  const t = TOPICS.find((x) => x.id === id);
  if (!t) return;
  t.cards.forEach((_, i) => getCard(keyOf(t, i)));
  view = freshView();
  view.queue = t.cards.map((_, i) => keyOf(t, i));
  view.topicTitle = t.name.replace(/^[^ ]+ /, '');
  enterSession();
}

function startQueue() {
  const keys = dueList();
  if (!keys.length) {
    const fresh = availableNew();
    const pick = fresh[Math.floor(Math.random() * fresh.length)];
    if (pick) keys.push(pick);
  }
  view = freshView();
  view.queue = keys;
  view.topicTitle = '';
  enterSession();
}

function enterSession() {
  if (!view.queue.length) { backToQueue(); return; }
  $id('shTopic').style.display = view.topicTitle ? 'block' : 'none';
  if (view.topicTitle) $id('shTopic').textContent = view.topicTitle;
  counter();
  showView('sessionView');
  renderCard();
}

function currentKey() {
  return view.queue.length ? view.queue[Math.min(view.pos, view.queue.length - 1)] : null;
}
function counter() {
  $id('shCount').textContent = (view.pos + 1) + ' / ' + view.queue.length;
}

function renderCard() {
  const key = currentKey();
  view.revealed = false;
  const inner = $id('cardInner');
  inner.classList.remove('flipped');
  $id('graderBar').style.display = 'none';
  $id('revealBtn').style.display = 'block';
  $id('cardHint').textContent = 'Try to recall the answer, then reveal';
  $id('revealZone').innerHTML = '';
  if (!key) return;
  const c = cardFor(key);
  if (!c) return;
  $id('frontText').textContent = c.card.q;
  $id('cardLabel').textContent = 'QUESTION · ' + nice(c.topic.name);
  $id('backText').textContent = tierAnswer(c);
  counter();
}

function tierAnswer(c) {
  if (S.tier === 'expert') return 'Expert mode: answer hidden. Say it in your own words, then grade yourself.';
  return S.tier === 'hard' ? c.card.extra : c.card.a;
}

function reveal() {
  if (!currentKey() || view.revealed) return;
  view.revealed = true;
  $id('cardInner').classList.add('flipped');
  $id('revealBtn').style.display = 'none';
  $id('graderBar').style.display = 'flex';
  $id('cardHint').textContent = 'How well did you recall it?';
}

function grade(g) {
  const key = currentKey();
  if (!key || !view.revealed) {
    if (!view.revealed) showToast('Reveal the answer first', 'info');
    return;
  }
  schedule(key, g);
  view.graded++;
  if (g === GRADES.AGAIN) { view.againCount++; view.again.push(key); }
  const xp = xpFor(g);
  view.xp += xp;
  S.meta.xp += xp;
  save();
  showToast(g === GRADES.AGAIN ? 'Will retry shortly' : '+' + xp + ' XP', g === GRADES.AGAIN ? 'warning' : 'success');
  nextCard();
}

function nextCard() {
  view.pos++;
  if (view.pos < view.queue.length) { renderCard(); counter(); return; }
  finishSession();
}
function prevCard() {
  if (view.pos > 0) { view.pos--; renderCard(); counter(); }
}

function finishSession() {
  if (view.again.length && view.cycles < MAX_CYCLES) {
    view.queue = view.again.slice();
    view.again = [];
    view.cycles++;
    view.pos = 0;
    renderCard();
    counter();
    showToast('Retrying cards you missed', 'info');
    return;
  }
  endSession();
}

function endSession() {
  const bonus = 50;
  const today = dayKey();
  if (S.meta.lastStudyDay !== today) {
    const yesterday = dayKey(Date.now() - DAY);
    S.meta.streak = S.meta.lastStudyDay === yesterday ? S.meta.streak + 1 : 1;
    S.meta.lastStudyDay = today;
  }
  S.meta.xp += bonus;
  S.meta.gems += 3;
  save();

  $id('doneCount').textContent = view.graded;
  $id('doneAgainPct').textContent = Math.round((view.againCount / Math.max(1, view.graded)) * 100) + '%';
  $id('doneXp').textContent = '+' + (bonus + view.xp);
  $id('doneStreak').textContent = S.meta.streak;
  $id('doneNext').textContent = fmtDelay(nextDueIn());
  showView('doneView');
  confetti();
  setTimeout(() => { $id('luckyAmount').textContent = 'Queue complete! +50 XP +💎3'; $id('luckyNotice').classList.add('show'); }, 500);
  setTimeout(() => $id('luckyNotice').classList.remove('show'), 2600);
}

function backToQueue() {
  stopTimer();
  renderQueue();
  showView('queueView');
}

function nice(name) { return name.replace(/^[^ ]+ /, ''); }
function level() { return Math.max(1, Math.floor(S.meta.xp / 250) + 1); }

function switchTier(t) {
  S.tier = t;
  $id('tierNormal').classList.toggle('active', t === 'normal');
  $id('tierHard').classList.toggle('active', t === 'hard');
  $id('tierExpert').classList.toggle('active', t === 'expert');
  save();
  if (currentKey()) renderCard();
}

let timerId = null;
let seconds = 300;
function toggleTimer() {
  if (timerId) { stopTimer(); return; }
  if (seconds <= 0) seconds = 300;
  const disp = $id('timerDisplay');
  timerId = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      stopTimer();
      seconds = 300;
      showToast('Focus session done', 'success');
      return;
    }
    disp.textContent = fmt(seconds);
  }, 1000);
  $id('timerBtn').textContent = '⏸️';
}
function stopTimer() {
  if (timerId) { clearInterval(timerId); timerId = null; $id('timerBtn').textContent = '▶️'; }
}
function resetTimer() {
  stopTimer();
  seconds = 300;
  $id('timerDisplay').textContent = '05:00';
}
function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }

function mystery() {
  if (S.meta.gems < 2) { showToast('Need 2 gems for a mystery card', 'warning'); return; }
  const keys = [];
  TOPICS.forEach((t) => t.cards.forEach((_, i) => keys.push(keyOf(t, i))));
  const k = keys[Math.floor(Math.random() * keys.length)];
  getCard(k);
  S.meta.gems -= 2;
  view.queue.splice(view.pos + 1, 0, k);
  save();
  openPopup('Mystery Card', 'A random card joined your queue — bonus practice.');
  counter();
}

function showStats() {
  const grades = S.log.slice(-200);
  const again = grades.filter((e) => e.g === GRADES.AGAIN).length;
  const pct = grades.length ? Math.round((1 - again / grades.length) * 100) : 100;
  openPopup('Statistics', [
    'Level ' + level() + ' · ' + S.meta.xp + ' XP',
    'Streak: ' + S.meta.streak + ' days',
    'Gems: ' + S.meta.gems,
    'Total reviews: ' + S.meta.totalReviews,
    'Recall accuracy (recent): ' + pct + '%',
    'Due now: ' + dueNow(),
    'Next review: ' + fmtDelay(nextDueIn())
  ].join('\n'));
}

const ONBOARD = [
  { icon: '🧠', title: 'Try to recall first', desc: 'Read the question, attempt the answer in your head, then reveal. The attempt is the learning.' },
  { icon: '📅', title: 'Space it out', desc: 'Cards return on a schedule — 1 day, 3 days, a week. This spacing is what makes it stick.' },
  { icon: '🎯', title: 'Grade honestly', desc: 'Again = couldn\'t recall. That\'s normal and it\'s exactly how the schedule helps you. An honest Again beats a bored Easy.' }
];
let obStep = 0;
function onboardNext() {
  obStep++;
  if (obStep >= ONBOARD.length) { finishOnboard(); return; }
  $id('obIcon').textContent = ONBOARD[obStep].icon;
  $id('obTitle').textContent = ONBOARD[obStep].title;
  $id('obDesc').textContent = ONBOARD[obStep].desc;
  [0, 1, 2].forEach((i) => $id('obDot' + i).classList.toggle('on', i === obStep));
  $id('obNext').textContent = obStep === ONBOARD.length - 1 ? 'Start' : 'Next';
}
function onboardSkip() { finishOnboard(); }
function finishOnboard() {
  S.onboarded = true;
  save();
  renderQueue();
  showView('queueView');
}

function openPopup(title, body) {
  $id('popupTitle').textContent = title;
  $id('popupBody').innerHTML = '<pre style="white-space:pre-wrap;font-family:inherit;margin:0;font-size:14px;color:var(--text-muted)">' + body + '</pre>';
  $id('popupOverlay').classList.add('show');
  $id('popupBox').style.display = 'block';
}
function closePopup() {
  $id('popupOverlay').classList.remove('show');
  $id('popupBox').style.display = 'none';
}

function confetti() {
  const c = $id('confettiCanvas');
  const ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const colors = ['#6366f1', '#22d3ee', '#f59e0b', '#a78bfa', '#34d399'];
  const parts = Array.from({ length: 90 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * 60, s: 5 + Math.random() * 6, v: 2 + Math.random() * 3, a: Math.random() * 6, c: colors[Math.floor(Math.random() * 5)] }));
  let frames = 0;
  const iv = setInterval(() => {
    ctx.clearRect(0, 0, c.width, c.height);
    parts.forEach((p) => { p.y += p.v; p.x += Math.sin(p.a) * 1.5; p.a += 0.08; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 7); ctx.fill(); });
    if (++frames > 110) { clearInterval(iv); ctx.clearRect(0, 0, c.width, c.height); }
  }, 20);
}

document.addEventListener('keydown', (e) => {
  if ($id('sessionView').style.display !== 'block') return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); reveal(); return; }
  if (e.key === '1') grade(0);
  if (e.key === '2') grade(1);
  if (e.key === '3') grade(2);
  if (e.key === '4') grade(3);
  if (e.key === 'ArrowRight') nextCard();
  if (e.key === 'ArrowLeft') prevCard();
});

window.onboardNext = onboardNext;
window.onboardSkip = onboardSkip;
window.startQueue = startQueue;
window.openTopics = openTopics;
window.startTopic = startTopic;
window.backToQueue = backToQueue;
window.reveal = reveal;
window.grade = grade;
window.prevCard = prevCard;
window.nextCard = nextCard;
window.switchTier = switchTier;
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.mystery = mystery;
window.showStats = showStats;
window.closePopup = closePopup;

function init() {
  load();
  stopTimer();
  if (S.onboarded) { renderQueue(); showView('queueView'); }
  else { showView('onboardView'); }
}
init();