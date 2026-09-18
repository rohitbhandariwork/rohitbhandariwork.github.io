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

const TUTORIAL = [
  { icon: '🎯', title: 'Welcome, Scholar!', desc: "You've entered the knowledge realm. Let's start your learning journey!" },
  { icon: '🃏', title: 'Tap to flip', desc: 'Tap any card to reveal its answer. Front asks, back answers.' },
  { icon: '↔️', title: 'Navigate the deck', desc: 'Use the arrows or the ❤️ / 🔖 / 🔄 buttons to rate each card.' },
  { icon: '⚡', title: 'Powers & Timer', desc: 'Spend gems on Mystery 🎁 and XP Booster ⚡. Use the timer to race yourself.' },
  { icon: '🔥', title: 'Tiers matter', desc: 'Detailed shows richer answers and grants more XP. Expert is the real test.' },
  { icon: '🏆', title: 'Keep your streak', desc: 'Study daily, earn XP, level up, and watch your realm progress.' }
];

const LS = 'flashcard_progress';

function $id(x) { return document.getElementById(x); }

let state = { tier: 'normal', idx: 0, known: new Set(), tricky: new Set(), again: new Set(), xp: 0, gems: 0, streak: 0, lastDay: '' };

function save() {
  try {
    localStorage.setItem(LS, JSON.stringify({
      tier: state.tier,
      known: [...state.known], tricky: [...state.tricky], again: [...state.again],
      xp: state.xp, gems: state.gems
    }));
  } catch (e) {}
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(LS));
    if (!d) return;
    state.tier = d.tier || 'normal';
    state.known = new Set(d.known || []);
    state.tricky = new Set(d.tricky || []);
    state.again = new Set(d.again || []);
    state.xp = d.xp || 0;
    state.gems = d.gems || 0;
  } catch (e) {}
}

let topic = null;
let deck = [];
let flipped = false;
let timerId = null;
let seconds = 300;
let tutorialStep = 0;

function showToast(msg, type) {
  const t = $id('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || 'success');
  setTimeout(() => (t.className = 'toast'), 2500);
}

function renderTopics() {
  const grid = $id('topicGrid');
  grid.innerHTML = '';
  for (const tp of TOPICS) {
    const el = document.createElement('button');
    el.className = 'topic-btn';
    el.textContent = tp.name;
    el.onclick = () => selectTopic(tp.id);
    grid.appendChild(el);
  }
}

function selectTopic(id) {
  topic = TOPICS.find((t) => t.id === id);
  if (!topic) return;
  deck = topic.cards.slice();
  $id('narrText').innerHTML = `<strong>${topic.name.replace(/^[^ ]+ /, '')}</strong> — Knowledge unlocked.`;
  $id('narrStage').textContent = topic.realm;
  state.idx = 0;
  $id('topicArea').style.display = 'none';
  $id('flashcardArea').style.display = 'block';
  renderCard();
  updateCounters();
}

function backToTopics() {
  $id('flashcardArea').style.display = 'none';
  $id('topicArea').style.display = 'block';
  renderTopics();
}

function tierCards() {
  return deck;
}

function renderCard() {
  const cards = tierCards();
  const idx = Math.min(state.idx, cards.length - 1);
  const card = cards[idx];
  flipped = false;
  $id('cardInner').classList.remove('flipped');
  $id('frontText').textContent = card.q;
  $id('backText').textContent = state.tier === 'expert' ? card.extra : card.a;
  $id('cardInner').dataset.card = idx;
  updateCounters();
}

function handleCardTap() {
  if (!topic) return;
  $id('cardInner').classList.toggle('flipped');
  flipped = !flipped;
}

function nextCard() {
  if (!topic) return;
  const cards = tierCards();
  state.idx = (state.idx + 1) % Math.max(1, cards.length);
  renderCard();
}
function prevCard() {
  if (!topic) return;
  const cards = tierCards();
  state.idx = (state.idx - 1 + cards.length) % Math.max(1, cards.length);
  renderCard();
}

function rateCard(rating) {
  if (!topic) return;
  const card = tierCards()[Math.min(state.idx, tierCards().length - 1)];
  const keyIn = card.q;
  if (rating >= 3) {
    if (!state.known.has(keyIn)) {
      state.known.add(keyIn);
      state.xp += state.tier === 'expert' ? 15 : 10;
      showToast('❤️ Got it! ' + (state.tier === 'expert' ? '+15' : '+10') + ' XP', 'success');
    }
    state.tricky.delete(keyIn);
    state.again.delete(keyIn);
  } else if (rating === 2) {
    state.tricky.add(keyIn);
    state.again.delete(keyIn);
    showToast('🔖 Marked tricky', 'info');
  } else {
    state.again.add(keyIn);
    state.tricky.delete(keyIn);
    showToast('🔄 We\'ll revisit this one', 'warning');
  }
  save();
  updateCounters();
  setTimeout(nextCard, 250);
}

function updateCounters() {
  const cards = tierCards();
  const known = cards.filter((c) => state.known.has(c.q)).length;
  const again = cards.filter((c) => state.again.has(c.q)).length;
  $id('counter').textContent = `${Math.min(state.idx + 1, cards.length)}/${cards.length}`;
  $id('knownCount').textContent = known;
  $id('stillCount').textContent = Math.max(0, cards.length - known);
  $id('progressFill').style.width = Math.round((known / Math.max(1, cards.length)) * 100) + '%';
  $id('srsState').textContent = `Known ${known} · Tricky ${state.tricky.size} · Again ${again}`;
  const done = cards.length > 0 && known === cards.length;
  if (done && topic) {
    $id('deckComplete').style.display = 'block';
    $id('deckCompleteXP').textContent = `+${state.tier === 'expert' ? 75 : 50} XP + 💎3 Gems`;
  } else if ($id('deckComplete')) {
    $id('deckComplete').style.display = 'none';
  }
  $id('topLvlNum').textContent = Math.max(1, Math.floor(state.xp / 100) + 1);
  $id('topGems').textContent = '💎' + state.gems;
}

function switchTier(t) {
  state.tier = t;
  $id('tierNormal').classList.toggle('active', t === 'normal');
  $id('tierHard').classList.toggle('active', t === 'hard');
  $id('tierExpert').classList.toggle('active', t === 'expert');
  state.idx = 0;
  renderCard();
  save();
}

function toggleTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    $id('timerBtn').textContent = '▶️';
    return;
  }
  if (seconds <= 0) seconds = 300;
  timerId = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(timerId);
      timerId = null;
      $id('timerBtn').textContent = '▶️';
      showToast('⏰ Time\u2019s up!', 'error');
      return;
    }
    const m = Math.floor(seconds / 60), s = seconds % 60;
    $id('timerDisplay').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, 1000);
  $id('timerBtn').textContent = '⏸️';
}
function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  seconds = 300;
  $id('timerDisplay').textContent = '05:00';
  $id('timerBtn').textContent = '▶️';
}

function confirmMystery() {
  if (state.gems < 2) { showToast('Need 💎2 gems for a mystery card', 'warning'); return; }
  openPopup('🎁 Mystery Card', 'A random card — flip it for surprise XP!');
  state.gems -= 2;
  save();
}
function confirmBooster() {
  if (state.gems < 1) { showToast('Need 💎1 gem for XP booster', 'warning'); return; }
  state.gems -= 1;
  state.xp += 25;
  flashLucky('+25 XP booster!');
  save();
  updateCounters();
}

function showCardPopup() {
  if (!topic) return;
  const cards = tierCards();
  openPopup('🔢 Deck Progress', `${Math.min(state.idx + 1, cards.length)} of ${cards.length} cards shown\nKnown: ${cards.filter((c) => state.known.has(c.q)).length}`);
}
function showStatsPopup() {
  openPopup('🌟 Player Stats', `XP: ${state.xp} · Gems: 💎${state.gems} · Tier: ${state.tier}${topic ? `\nTopic: ${topic.name}` : ''}`);
}
function showInsightPopup() {
  openPopup('🧭 Your Journey', `Level ${Math.max(1, Math.floor(state.xp / 100) + 1)} Scholar\nKeep studying daily to strengthen your streak and unlock new realms.`);
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

function flashLucky(text) {
  $id('luckyAmount').textContent = text;
  $id('luckyNotice').classList.add('show');
  setTimeout(() => $id('luckyNotice').classList.remove('show'), 1800);
}

function showLevelUp(level, title) {
  $id('lvlModalNum').textContent = level;
  $id('lvlModalTitle').textContent = title;
  $id('lvlModal').classList.add('open');
}
function closeLvlModal() {
  $id('lvlModal').classList.remove('open');
}

function nextTutorialStep() {
  tutorialStep++;
  if (tutorialStep >= TUTORIAL.length) { $id('tutCard').style.display = 'none'; return; }
  const s = TUTORIAL[tutorialStep];
  $id('tutStep').textContent = `Step ${tutorialStep + 1}/${TUTORIAL.length}`;
  $id('tutIcon').textContent = s.icon;
  $id('tutTitle').textContent = s.title;
  $id('tutDesc').textContent = s.desc;
  $id('tutNextBtn').textContent = tutorialStep === TUTORIAL.length - 1 ? 'Start' : 'Next →';
}
function skipTutorial() {
  $id('tutCard').style.display = 'none';
}

function closeWeeklySummary() {
  $id('weeklySummary').style.display = 'none';
}

$id('weeklySummary').style.display = 'none';

function init() {
  load();
  renderTopics();
  updateCounters();
  showLvlIfNew();
  const tutSeen = localStorage.getItem('flashcard_tut');
  if (!tutSeen) {
    $id('tutCard').style.display = 'block';
    tutorialStep = 0;
    $id('tutStep').textContent = 'Step 1/6';
    $id('tutIcon').textContent = TUTORIAL[0].icon;
    $id('tutTitle').textContent = TUTORIAL[0].title;
    $id('tutDesc').textContent = TUTORIAL[0].desc;
    $id('tutNextBtn').textContent = 'Next →';
  } else {
    $id('tutCard').style.display = 'none';
  }
}
function showLvlIfNew() {
  const lvl = Math.floor(state.xp / 100) + 1;
  const seen = localStorage.getItem('flashcard_lvl') || '0';
  if (parseInt(seen, 10) < lvl) {
    localStorage.setItem('flashcard_lvl', String(lvl));
    setTimeout(() => showLevelUp(lvl, lvl === 1 ? 'Novice' : lvl === 2 ? 'Student' : 'Journeyman'), 400);
  }
}

window.backToTopics = backToTopics;
window.handleCardTap = handleCardTap;
window.nextCard = nextCard;
window.prevCard = prevCard;
window.rateCard = rateCard;
window.switchTier = switchTier;
window.toggleTimer = toggleTimer;
window.resetTimer = resetTimer;
window.confirmMystery = confirmMystery;
window.confirmBooster = confirmBooster;
window.showCardPopup = showCardPopup;
window.showStatsPopup = showStatsPopup;
window.showInsightPopup = showInsightPopup;
window.openPopup = openPopup;
window.closePopup = closePopup;
window.closeLvlModal = closeLvlModal;
window.nextTutorialStep = nextTutorialStep;
window.skipTutorial = skipTutorial;
window.closeWeeklySummary = closeWeeklySummary;

init();