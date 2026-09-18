const QUESTIONS = [
  { area: 'Python', q: 'What is the difference between a list and a tuple in Python?', keys: ['immut', 'mutable'] },
  { area: 'Python', q: 'How does a decorator work in Python? Can you write a simple one?', keys: ['function', 'wraps', 'args', 'return'] },
  { area: 'Python', q: 'What does the `with` statement do, and why is it useful?', keys: ['context', 'close', 'auto', 'resource'] },
  { area: 'Python', q: 'Explain the difference between `__str__` and `__repr__`.', keys: ['string', 'represent', 'user', 'debug'] },
  { area: 'FastAPI', q: 'What is FastAPI and why would you choose it over Flask for an API?', keys: ['async', 'type', 'validation', 'openapi', 'speed'] },
  { area: 'FastAPI', q: 'How does FastAPI handle request validation of a JSON body?', keys: ['pydantic', 'model', 'schema', 'type'] },
  { area: 'FastAPI', q: 'What is the difference between a path parameter and a query parameter?', keys: ['path', 'query', 'url', 'optional'] },
  { area: 'FastAPI', q: 'How do you add CORS support in FastAPI?', keys: ['middleware', 'allow', 'origin', 'headers'] },
  { area: 'FastAPI', q: 'How do you run FastAPI with uvicorn, and how does auto-reload work?', keys: ['uvicorn', 'reload', 'host', 'port'] },
  { area: 'Concurrency', q: 'What is the difference between threads and processes?', keys: ['memory', 'gil', 'parallel', 'context'] },
  { area: 'Concurrency', q: 'What is a thread pool, and when would you use one?', keys: ['limit', 'reuse', 'tasks', 'io'] },
  { area: 'Concurrency', q: 'What is the GIL in Python and why does it matter?', keys: ['gil', 'thread', 'bytecode', 'lock'] },
  { area: 'Concurrency', q: 'What happens if lots of requests hit a single server?', keys: ['queue', 'timeout', 'load', 'scale'] },
  { area: 'Concurrency', q: 'Why would you use async/await in Python?', keys: ['io', 'async', 'await', 'event'] },
  { area: 'React', q: 'What is a controlled component in React?', keys: ['state', 'value', 'onchange', 'input'] },
  { area: 'React', q: 'What is the difference between props and state?', keys: ['props', 'state', 'immut', 'parent'] },
  { area: 'React', q: 'What is the virtual DOM and how does React use it?', keys: ['virtual', 'diff', 'reconcile', 'batch'] },
  { area: 'React', q: 'When would you use `useEffect`?', keys: ['effect', 'subscribe', 'fetch', 'cleanup'] },
  { area: 'SQL', q: 'What is an index in SQL and why is it used?', keys: ['index', 'lookup', 'speed', 'query'] },
  { area: 'SQL', q: 'What is the difference between INNER JOIN and LEFT JOIN?', keys: ['join', 'left', 'inner', 'match', 'null'] },
  { area: 'SQL', q: 'Why would you use GROUP BY?', keys: ['group', 'count', 'aggregate', 'sum'] }
];

let idx = 0;
let score = 0;
let chatDone = false;
let timerId = null;
let secondsLeft = 120;

function $id(x) { return document.getElementById(x); }

function showToast(msg, type) {
  const t = $id('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || 'success');
  setTimeout(() => (t.className = 'toast'), 2500);
}

function startInterview() {
  $id('startScreen').style.display = 'none';
  $id('interviewView').style.display = 'block';
  idx = 0;
  score = 0;
  $id('answerInput').disabled = false;
  $id('sendBtn').disabled = false;
  addMsg('assistant', 'Hi! I\'m your AI recruiter. Ready? Start by telling me a bit about yourself.');
  nextQuestion();
  beginTimer();
}

function beginTimer() {
  secondsLeft = 120;
  $id('timerRing').textContent = secondsLeft;
  $id('timerText').textContent = '2:00 remaining';
  clearInterval(timerId);
  timerId = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) { clearInterval(timerId); finish(); return; }
    const m = Math.floor(secondsLeft / 60), s = secondsLeft % 60;
    $id('timerRing').textContent = secondsLeft;
    $id('timerText').textContent = `${m}:${String(s).padStart(2, '0')} remaining`;
    if (secondsLeft <= 30) $id('timerRing').style.color = '#ef4444';
  }, 1000);
}

function addMsg(role, text) {
  const box = $id('chatBox');
  const el = document.createElement('div');
  el.className = 'chat-msg ' + role;
  el.textContent = text;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

function nextQuestion() {
  if (idx >= QUESTIONS.length) { finish(); return; }
  const q = QUESTIONS[idx];
  $id('progressLabel').textContent = `Question ${idx + 1} of ${QUESTIONS.length}`;
  $id('progressFill').style.width = ((idx / QUESTIONS.length) * 100) + '%';
  addMsg('assistant', '[' + q.area + '] ' + q.q);
  secondsLeft = 120;
}

function sendAnswer() {
  const input = $id('answerInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addMsg('user', text);
  const q = QUESTIONS[idx];
  const lower = text.toLowerCase();
  let matched = 0;
  for (const k of q.keys) {
    const kk = k.replace('_', '');
    if (lower.replace(/[^a-z]/g, '').includes(kk)) matched++;
  }
  const pct = Math.min(1, matched / Math.max(1, q.keys.length));
  const gained = Math.round(pct * 20);
  score += gained;
  const verdict = pct >= 0.6 ? 'Strong answer — ' + gained + ' pts.' : (pct > 0 ? 'Decent — covered some ground. ' + gained + ' pts.' : 'Hmm, thin. We\'ll move on.');
  addMsg('assistant', verdict);
  idx++;
  nextQuestion();
}

function finish() {
  clearInterval(timerId);
  $id('interviewView').style.display = 'none';
  $id('resultCard').style.display = 'block';
  const total = QUESTIONS.length * 20;
  const pct = Math.round((score / total) * 100);
  $id('resultSub').textContent = 'Score: ' + score + '/' + total + ' (' + pct + '%)';
  const areas = {};
  for (const q of QUESTIONS) areas[q.area] = { count: 0, got: 0 };
  let name = '';
  if (pct >= 80) name = 'Rock-solid. You\u2019d get to the next round.';
  else if (pct >= 60) name = 'Solid fundamentals. Tighten your examples.';
  else if (pct >= 40) name = 'Decent base; deep-dive on the core concepts.';
  else name = 'Wobbly. Go back to basics and retry.';
  $id('summaryText').textContent = name;
  $id('scoreGrid').innerHTML = '';

  const list = document.createElement('ul');
  list.style.cssText = 'list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px;';
  for (const [area, a] of Object.entries(areas)) {
    const li = document.createElement('li');
    li.style.cssText = 'display:flex;justify-content:space-between;font-size:14px;';
    li.innerHTML = `<span style="font-weight:700">${area}</span><span>reviewed</span>`;
    list.appendChild(li);
  }
  $id('scoreGrid').appendChild(list);
}

$id('sendBtn').addEventListener('click', sendAnswer);
$id('answerInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAnswer(); }
});

window.startInterview = startInterview;