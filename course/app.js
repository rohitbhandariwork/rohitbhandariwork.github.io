/* ── Sound Effects (Web Audio API) ── */
let _audioCtx = null;
function _getCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}

function playSound(type) {
  try {
    const ctx = _getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const g = ctx.createGain();
    g.connect(ctx.destination);

    switch (type) {
      case 'complete': {
        // Ascending arpeggio — happy accomplishment
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = freq;
          const og = ctx.createGain();
          og.gain.setValueAtTime(0.3, now + i * 0.1);
          og.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
          o.connect(og).connect(ctx.destination);
          o.start(now + i * 0.1);
          o.stop(now + i * 0.1 + 0.4);
        });
        break;
      }
      case 'levelup': {
        // Fanfare — bright, celebratory
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const o = ctx.createOscillator();
          o.type = 'triangle';
          o.frequency.value = freq;
          const og = ctx.createGain();
          og.gain.setValueAtTime(0.25, now + i * 0.15);
          og.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.6);
          o.connect(og).connect(ctx.destination);
          o.start(now + i * 0.15);
          o.stop(now + i * 0.15 + 0.6);
        });
        break;
      }
      case 'quizpass': {
        // Two-tone chime — pleasant confirmation
        [880, 1108.73].forEach((freq, i) => {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = freq;
          const og = ctx.createGain();
          og.gain.setValueAtTime(0.2, now + i * 0.12);
          og.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.5);
          o.connect(og).connect(ctx.destination);
          o.start(now + i * 0.12);
          o.stop(now + i * 0.12 + 0.5);
        });
        break;
      }
      case 'quizfail': {
        // Descending tone — gentle "nope"
        [400, 300].forEach((freq, i) => {
          const o = ctx.createOscillator();
          o.type = 'sawtooth';
          o.frequency.value = freq;
          const og = ctx.createGain();
          og.gain.setValueAtTime(0.12, now + i * 0.15);
          og.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.35);
          o.connect(og).connect(ctx.destination);
          o.start(now + i * 0.15);
          o.stop(now + i * 0.15 + 0.35);
        });
        break;
      }
      case 'badge': {
        // Sparkle — rapid high notes
        [1318.5, 1568, 1760, 2093].forEach((freq, i) => {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = freq;
          const og = ctx.createGain();
          og.gain.setValueAtTime(0.15, now + i * 0.06);
          og.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
          o.connect(og).connect(ctx.destination);
          o.start(now + i * 0.06);
          o.stop(now + i * 0.06 + 0.25);
        });
        break;
      }
      case 'gem': {
        // Short coin — quick blip
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(1200, now);
        o.frequency.exponentialRampToValueAtTime(1800, now + 0.08);
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.2, now);
        og.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.connect(og).connect(ctx.destination);
        o.start(now);
        o.stop(now + 0.15);
        break;
      }
      case 'click': {
        // Subtle tick
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = 600;
        const og = ctx.createGain();
        og.gain.setValueAtTime(0.08, now);
        og.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        o.connect(og).connect(ctx.destination);
        o.start(now);
        o.stop(now + 0.06);
        break;
      }
    }
  } catch(e) { /* audio not available */ }
}

/* ── Utilities ── */
function readingTime(mod) {
  const wc = mod.content.reduce((t, p) => t + p.replace(/<[^>]*>/g, '').split(/\s+/).length, 0);
  return Math.max(1, Math.round(wc / 200));
}

function timeToMidnight() {
  const now = new Date();
  const ms = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function moduleById(id) { return MODULES.find(m => m.id === id); }

function moduleNameForCard(cardId) {
  for (const [mid, cards] of CONCEPT_CARDS)
    if (cards.some(c => c.id === cardId)) return moduleById(mid);
  return null;
}

function strip(html) {
  const d = document.createElement('div'); d.innerHTML = html;
  return d.textContent || d.innerText || '';
}

/* ── Visual Effects ── */
function spawnFloatText(x, y, text, color) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.cssText = `left:${x}px;top:${y}px;color:${color}`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function spawnConfetti(count) {
  const container = document.createElement('div');
  container.className = 'particles';
  const colors = ['#f0b429','#38bdf8','#34d399','#a855f7','#ef4444','#f97316','#ec4899','#06b6d4'];
  for (let i = 0; i < (count || 60); i++) {
    const p = document.createElement('div');
    const w = 4 + Math.random() * 8;
    const h = w * (0.4 + Math.random() * 0.6);
    p.style.cssText = `position:absolute;left:${Math.random()*100}%;top:${-10}%;width:${w}px;height:${h}px;background:${colors[i%colors.length]};border-radius:${Math.random()>0.5?'50%':'2px'};animation:confettiFall ${1.5+Math.random()*2}s ease-in forwards;animation-delay:${Math.random()*0.5}s;transform:rotate(${Math.random()*360}deg)`;
    container.appendChild(p);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 4000);
}

/* ── State ── */
const STORAGE_KEY = 'aikv_save';
const LEVELS = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800];
const LEVEL_NAMES = ['Apprentice','Explorer','Adept','Scholar','Architect','Sage','Luminary','Grandmaster','Transcendent'];
const DAILY_XP_CAP = 300;

const CONCEPT_CARDS = [
  [1, [{ id:'transformer', icon:'⚡', name:'Transformer', desc:'Neural architecture using self-attention, no recurrence' },
        { id:'multi-head', icon:'👁️', name:'Multi-Head Attention', desc:'Parallel attention heads learning different patterns' }]],
  [2, [{ id:'self-attention', icon:'🕸️', name:'Self-Attention', desc:'Mechanism weighing every word against every other word' }]],
  [3, [{ id:'rag', icon:'🔗', name:'RAG', desc:'Retrieval-Augmented Generation for grounded answers' },
        { id:'embedding', icon:'🧩', name:'Embeddings', desc:'Vectors capturing semantic meaning of text' }]],
  [4, [{ id:'fine-tuning', icon:'⚒️', name:'Fine-Tuning', desc:'Specializing a pre-trained model on new data' },
        { id:'lora', icon:'📎', name:'LoRA', desc:'Low-Rank Adaptation for efficient fine-tuning' }]],
  [5, [{ id:'prompt-eng', icon:'📝', name:'Prompt Engineering', desc:'Crafting inputs for optimal LLM outputs' },
        { id:'cot', icon:'🧮', name:'Chain-of-Thought', desc:'Step-by-step reasoning prompting' }]],
  [6, [{ id:'vector-db', icon:'🗄️', name:'Vector DB', desc:'Database for similarity search over embeddings' },
        { id:'semantic-search', icon:'🔎', name:'Semantic Search', desc:'Search by meaning, not keywords' }]],
  [7, [{ id:'eval', icon:'📏', name:'Evaluation', desc:'Measuring model performance and quality' },
        { id:'benchmark', icon:'📊', name:'Benchmarks', desc:'Standardized tests for model comparison' }]],
  [8, [{ id:'multimodal', icon:'🎨', name:'Multimodal AI', desc:'Processing text, images, audio in one model' },
        { id:'clip', icon:'🔗', name:'CLIP', desc:'Joint text-image embeddings for cross-modal search' }]],
  [9, [{ id:'agent', icon:'🤖', name:'AI Agent', desc:'LLM-powered system that reasons and uses tools' },
        { id:'react', icon:'🔄', name:'ReAct', desc:'Reasoning + Acting loop for agent decision-making' }]],
  [10, [{ id:'alignment', icon:'🛡️', name:'Alignment', desc:'Ensuring AI does what humans actually want' },
        { id:'rlhf', icon:'🏅', name:'RLHF', desc:'Reinforcement Learning from Human Feedback' }]]
];

function defaultState() {
  return { xp:0, gems:0, level:1, streak:0, lastLogin:null, completedModules:[], quizScores:{}, eggsFound:[], lastModuleDate:null, conceptCards:[], seenBadgeIds:[], knowSecret:false, streakFreezes:0, dailyModuleCount:0 };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      const d = defaultState();
      for (const k of Object.keys(d)) if (!(k in p)) p[k] = d[k];
      return p;
    }
  } catch(e) {}
  return defaultState();
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

let state = loadState();

/* ── Streak ── */
function checkStreak() {
  const today = new Date().toISOString().slice(0,10);
  if (state.lastLogin === today) { state.dailyModuleCount = 0; saveState(); return; }
  const yesterday = new Date(Date.now()-864e5).toISOString().slice(0,10);
  if (state.lastLogin === yesterday) {
    state.streak += 1;
  } else if (state.lastLogin && state.lastLogin !== today) {
    if (state.streakFreezes > 0) {
      state.streakFreezes -= 1;
      showToast('🛡️ Streak Shield activated! Your streak is protected.', 'cyan');
    } else {
      state.streak = 1;
    }
  }
  state.lastLogin = today;
  state.dailyModuleCount = 0;
  if (state.streak === 3) checkBadgeUnlocks();
  if (state.streak === 7) checkBadgeUnlocks();
  saveState();
}

/* ── Gamification ── */
function addXP(amount) {
  state.xp += amount;
  const newLevel = LEVELS.findIndex(l => state.xp < l) - 1;
  const effectiveLevel = newLevel < 0 ? LEVELS.length - 1 : newLevel;
  if (effectiveLevel > state.level) {
    for (let l = state.level + 1; l <= effectiveLevel; l++) {
      if (LEVEL_NAMES[l]) showLevelUp(l);
    }
    state.level = effectiveLevel;
    checkBadgeUnlocks();
  } else if (effectiveLevel < 0) {
    state.level = LEVELS.length - 1;
  } else {
    state.level = Math.max(1, effectiveLevel);
  }
  saveState();
  updateDisplay();
}

function addGems(amount) {
  state.gems += amount;
  if (amount > 0) playSound('gem');
  saveState();
  updateDisplay();
}

function getXPForLevel(lvl) { return LEVELS[lvl] ?? 9999; }
function getXPProgress() {
  const cur = LEVELS[state.level] || 0;
  const next = LEVELS[state.level + 1] || cur + 200;
  return { cur, next, pct: Math.min(100, ((state.xp - cur) / (next - cur)) * 100) };
}

function getLevelName(lvl) { return LEVEL_NAMES[lvl] || 'Transcendent'; }

/* ── Badges ── */
function checkBadgeUnlocks() {
  const bd = BADGES;
  const len = state.completedModules.length;
  const lvl = state.level;
  let unlocked = false;
  bd.forEach(b => {
    if (state.seenBadgeIds.includes(b.id)) return;
    if (b.id === 'apprentice' && len >= 1) {
      state.seenBadgeIds.push(b.id);
      showToast(`🏅 Badge unlocked: ${b.icon} ${b.name}`, 'gold');
      unlocked = true;
      return;
    }
    if (b.level && lvl >= b.level) {
      state.seenBadgeIds.push(b.id);
      showToast(`🏅 Badge unlocked: ${b.icon} ${b.name}`, 'gold');
      unlocked = true;
    }
  });
  if (len >= 10 && !state.seenBadgeIds.includes('completionist')) {
    state.seenBadgeIds.push('completionist');
    showToast('🏅 Badge unlocked: 🏆 Completionist', 'gold');
    unlocked = true;
  }
  if (state.eggsFound.length >= 3 && !state.seenBadgeIds.includes('egg_hunter')) {
    state.seenBadgeIds.push('egg_hunter');
    showToast('🥚 Badge unlocked: 🥚 Egg Hunter', 'gold');
    unlocked = true;
  }
  if (state.streak >= 3 && !state.seenBadgeIds.includes('streak_3')) {
    state.seenBadgeIds.push('streak_3');
    showToast('🏅 Badge unlocked: 🔥 Streak Starter', 'gold');
    unlocked = true;
  }
  if (state.streak >= 7 && !state.seenBadgeIds.includes('streak_7')) {
    state.seenBadgeIds.push('streak_7');
    showToast('🏅 Badge unlocked: 🔥 Streak Master', 'gold');
    unlocked = true;
  }
  if (unlocked) {
    playSound('badge');
    spawnConfetti(40);
  }
  saveState();
}

/* ── SPA Router ── */
let _routing = false;

function navigate(hash) {
  location.hash = hash;
}

function doRender(path) {
  if (_routing) return;
  _routing = true;
  const c = document.getElementById('content');
  updateSidebar(path);
  if (path === '/' || path === '') { renderDashboard(c); _routing = false; return; }
  if (path === '/module/mystery') { renderMysteryModule(c); _routing = false; return; }
  const m = path.match(/^\/module\/(\d+)$/);
  if (m) { renderModule(parseInt(m[1]), c); _routing = false; return; }
  const q = path.match(/^\/quiz\/(\d+)$/);
  if (q) { renderQuiz(parseInt(q[1]), c); _routing = false; return; }
  if (path === '/vault') { renderVault(c); _routing = false; return; }
  if (path === '/badges') { renderBadges(c); _routing = false; return; }
  if (path === '/search') { renderSearch(c); _routing = false; return; }
  if (path === '/levels') { renderLevels(c); _routing = false; return; }
  renderDashboard(c);
  _routing = false;
}

window.addEventListener('hashchange', () => doRender(location.hash.replace(/^#/, '') || '/'));

/* ── Sidebar ── */
function updateSidebar(path) {
  document.querySelectorAll('.nav-item, .module-link').forEach(el => el.classList.remove('active'));
  const activeTab = document.querySelector(`[data-nav="${path}"]`);
  if (activeTab) activeTab.classList.add('active');
  if (path.match(/^\/(module|quiz)\/\d+/)) {
    const id = path.split('/')[2];
    const ml = document.querySelector(`.module-link[data-module="${id}"]`);
    if (ml) ml.classList.add('active');
  }
  renderModuleTree();
}

function renderModuleTree() {
  const container = document.getElementById('module-tree');
  const lockUntilTomorrow = state.lastModuleDate === new Date().toISOString().slice(0,10) && state.dailyModuleDone;
  container.innerHTML = MODULES.map(m => {
    const done = state.completedModules.includes(m.id);
    const locked = !done && lockUntilTomorrow;
    const unlocked = done || !lockUntilTomorrow;
    const cls = ['module-link', done?'completed':'', locked?'locked':''].filter(Boolean).join(' ');
    const icon = done ? '✅' : (locked ? '🔒' : '📖');
    const rt = readingTime(m);
    return `<a class="${cls}" data-module="${m.id}" onclick="event.preventDefault();navigate('#/module/${m.id}')">
      <span class="status-icon">${icon}</span><span>${m.icon} ${m.title}</span>
      <span class="module-meta">${locked ? '🔒 unlocks in '+timeToMidnight() : '⏱ '+rt+' min'}</span>
    </a>`;
  }).join('');
  if (state.completedModules.length === MODULES.length) {
    container.innerHTML += `<a class="module-link mystery-pulse" data-module="mystery" onclick="event.preventDefault();navigate('#/module/mystery')">
      <span class="status-icon">❓</span><span>🔮 Hidden Archive</span>
    </a>`;
  }
}

/* ── Dashboard ── */
function renderDashboard(c) {
  const progress = getXPProgress();
  const pct = Math.round(progress.pct);
  const lvlName = getLevelName(state.level);
  const nextName = getLevelName(state.level + 1);
  const nextXP = progress.next - state.xp;
  const allDone = state.completedModules.length === MODULES.length;
  const today = new Date().toISOString().slice(0,10);
  const lockUntilTomorrow = state.lastModuleDate === today && state.dailyModuleDone;

  c.innerHTML = `
    <div class="hero">
      <div class="hero-icon">🧠</div>
      <h1>AI Knowledge Vault</h1>
      <p>Master the foundations of modern AI — one module at a time. Each chamber of the vault reveals a core concept.</p>
      ${allDone ? '<a href="#/vault" class="hero-cta" onclick="navigate(\'#/vault\')">🗂️ Enter the Vault</a>'
               : `<a href="#/module/${nextModule()}" class="hero-cta" onclick="navigate('#/module/${nextModule()}')">${lockUntilTomorrow ? '📖 Review' : '▶ Continue Learning'}</a>`}
    </div>

    <div class="stats-grid">
      <div class="stat-card"><span class="val">${state.xp}</span><span class="label">Total XP</span></div>
      <div class="stat-card"><span class="val">${state.gems}</span><span class="label" title="💎 Gems are awarded for completing modules and passing quizzes. Use them to buy Streak Shields or unlock bonus content!">💎 Gems <span class="info-icon">ⓘ</span></span></div>
      <div class="stat-card"><span class="val">${state.streak}</span><span class="label">🔥 Day Streak</span></div>
      <div class="stat-card"><span class="val">${state.completedModules.length}/${MODULES.length}</span><span class="label">Modules Done</span></div>
    </div>

    <div class="xp-bar-wrap">
      <div class="xp-bar-fill" style="width:${pct}%"></div>
    </div>
    <div class="xp-label">
      <span>${lvlName}</span>
      <span>${state.xp} / ${progress.next} XP</span>
      <span>${nextName} in ${nextXP} XP</span>
    </div>

    <h2 style="margin-top:32px;font-family:Syne,sans-serif;font-size:18px">${allDone ? '🔄 Review Modules' : '📚 Modules'}</h2>
    <div class="module-grid">
      ${MODULES.map(m => {
        const done = state.completedModules.includes(m.id);
        const locked = !done && lockUntilTomorrow;
        const status = done ? '✅' : (locked ? '🔒' : '');
        const rt = readingTime(m);
        return `<div class="module-card ${done?'completed':''} ${locked?'locked':''}" onclick="${locked?'':'navigate(\'#/module/'+m.id+'\')'}" ${locked?'style=cursor:default':''}>
          <div class="card-top">
            <span class="track-tag">${m.track}</span>
            <span class="status-badge">${status}</span>
          </div>
          <div style="font-size:28px;margin-bottom:4px">${m.icon}</div>
          <h3>${m.title}</h3>
          <p>${m.lore.slice(0,80)}...</p>
          <div class="card-footer">
            <span>⭐ ${m.xp} XP</span>
            <span>⏱ ${rt} min</span>
          </div>
        </div>`;
      }).join('')}
      ${state.completedModules.length === MODULES.length ? `<div class="module-card" onclick="navigate('#/module/mystery')" style="border-color:rgba(168,85,247,.3)">
        <div class="card-top"><span class="track-tag mystery-badge" style="background:linear-gradient(135deg,#a855f7,#6366f1);color:#fff">SECRET</span><span class="status-badge">❓</span></div>
        <div style="font-size:28px;margin-bottom:4px">🔮</div>
        <h3>Hidden Archive</h3>
        <p>Something stirs in the depths of the vault...</p>
        <div class="card-footer"><span>??? XP</span><span>?? questions</span></div>
      </div>` : ''}
    </div>

    <div class="daily-info">
      <h3>📅 How Daily Progression Works</h3>
      <p>You can complete <strong>one module per day</strong> at full XP. After that, you can still grind extra modules at <strong>50% XP</strong> (max 3 per day, no streak credit). Your streak grows when you visit daily, and streaks unlock badges. If you miss a day, <strong>Streak Shields</strong> protect your progress.</p>
      <p style="margin-top:8px">${lockUntilTomorrow ? `⏳ Next module unlocks in <strong>${timeToMidnight()}</strong>.` : '✅ You can start the next module right now.'}</p>
      <div class="shield-shop">🛡️ Streak Shields: <strong>${state.streakFreezes || 0}</strong> owned · Buy for 30 💎 <button class="btn btn-gold" onclick="buyStreakShield()" style="min-height:36px;padding:0 16px;font-size:12px">Buy</button></div>
    </div>
  `;
}

function nextModule() {
  for (const m of MODULES) {
    if (!state.completedModules.includes(m.id)) return m.id;
  }
  return MODULES[0].id;
}

/* ── Module Lesson ── */
function renderModule(id, c) {
  const today = new Date().toISOString().slice(0,10);
  const lockUntilTomorrow = state.lastModuleDate === today && state.dailyModuleDone;

  const mod = MODULES.find(m => m.id === parseInt(id));
  if (!mod) { navigate('#/'); return; }

  const done = state.completedModules.includes(mod.id);
  const locked = !done && lockUntilTomorrow;
  const rt = readingTime(mod);

  c.innerHTML = `
    <div class="module-page">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:32px">${mod.icon}</span>
        <div>
          <div style="font-size:12px;color:var(--text-muted)">Module ${mod.id} · ${mod.track} · ⭐ ${mod.xp} XP · ⏱ ${rt} min read</div>
          <h2>${mod.title}</h2>
        </div>
      </div>
      ${locked ? `<div class="lore">⏳ One module per day. Come back tomorrow (${timeToMidnight()} left) to unlock this one. You can review completed modules in the meantime.</div>`
               : `<div class="lore">${mod.lore}</div>`}
      <div class="lesson-body">
        ${locked ? '<p style="color:var(--text-muted)">Complete a module each day to unlock the next chamber. Your streak grows with each daily visit.</p>'
                 : mod.content.map(p => `<p>${p}</p>`).join('')}
      </div>
      <div class="module-actions">
        <button class="btn btn-ghost" onclick="navigate('#/')">🔙 Back</button>
        ${!locked && !done ? `<button class="btn btn-gold" onclick="completeModule(${mod.id})">✅ Complete & Earn ${state.dailyModuleDone ? '50% ' : ''}XP</button>` : ''}
        ${done ? `<button class="btn btn-${state.quizScores[mod.id] === undefined ? 'gold' : 'cyan'}" onclick="navigate('#/quiz/${mod.id}')">📝 ${state.quizScores[mod.id] === undefined ? 'Take Quiz' : 'Retake Quiz'}</button>` : ''}
      </div>
    </div>
  `;
}

function renderMysteryModule(c) {
  c.innerHTML = `
    <div class="module-page">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:32px">🔮</span>
        <div>
          <div style="font-size:12px;color:var(--text-muted)">Hidden Archive · SECRET</div>
          <h2>The Hidden Archive</h2>
        </div>
      </div>
      <div class="lore">Some knowledge is earned only by those who seek everything. This final chamber contains no lesson — only a riddle.</div>
      <div class="lesson-body">
        <p>You've collected all seven shards of knowledge. The vault recognizes your dedication.</p>
        <p>But true mastery is not about knowing the answers — it's about knowing what questions to ask.</p>
        <p style="margin-top:20px;color:var(--accent);font-size:18px;text-align:center;font-style:italic">"The only true wisdom is in knowing you know nothing."<br><span style="font-size:14px;color:var(--text-muted)">— Socrates, probably</span></p>
        <p style="margin-top:20px">As a reward for your dedication, all concept cards are now unlocked. The vault is yours to explore.</p>
      </div>
      <div class="module-actions">
        <button class="btn btn-ghost" onclick="navigate('#/')">🔙 Back</button>
        <button class="btn btn-gold" onclick="unlockAllConcepts();navigate('#/vault')">🗂️ View Full Vault</button>
      </div>
    </div>
  `;
}

function unlockAllConcepts() {
  CONCEPT_CARDS.forEach(([mid, cards]) => {
    cards.forEach(c => { if (!state.conceptCards.includes(c.id)) state.conceptCards.push(c.id); });
  });
  if (!state.knowSecret) {
    state.gems += 50;
    state.knowSecret = true;
    showToast('🔮 50 💎 bonus gems for finding the Hidden Archive!', 'gold');
  }
  saveState();
}

function completeModule(id) {
  const mod = MODULES.find(m => m.id === id);
  if (!mod) return;
  if (state.completedModules.includes(id)) return;
  
  const today = new Date().toISOString().slice(0,10);
  const isExtra = state.lastModuleDate === today && state.dailyModuleDone;

  if (isExtra) {
    state.dailyModuleCount = (state.dailyModuleCount || 0) + 1;
    if (state.dailyModuleCount > 3) {
      showToast('⏳ Max 3 extra modules per day. See you tomorrow!', 'gold');
      return;
    }
  }

  state.completedModules.push(id);
  state.lastModuleDate = today;
  if (!isExtra) state.dailyModuleDone = true;

  // Award concept cards
  const cards = CONCEPT_CARDS.find(([mid]) => mid === id);
  if (cards) cards[1].forEach(c => { if (!state.conceptCards.includes(c.id)) state.conceptCards.push(c.id); });

  const xpMult = isExtra ? 0.5 : 1;
  const xpAward = Math.round(mod.xp * xpMult);

  playSound('complete');
  addXP(xpAward);
  const gemBonus = Math.floor(xpAward / 10) + 2;
  addGems(gemBonus);
  showToast(`✅ ${mod.title} complete! +${xpAward} XP${isExtra ? ' (50% grind mode)' : ''}, +${gemBonus} 💎`, 'gold');
  checkBadgeUnlocks();

  // Float text for XP + gems
  const btn = document.querySelector('.btn-gold');
  if (btn) {
    const r = btn.getBoundingClientRect();
    spawnFloatText(r.left + r.width/2 - 30, r.top - 10, `+${xpAward} XP`, 'var(--accent)');
    setTimeout(() => spawnFloatText(r.left + r.width/2 - 25, r.top - 40, `+${gemBonus} 💎`, 'var(--navy)'), 300);
  }

  // Check if all done — reveal mystery
  if (state.completedModules.length === MODULES.length) {
    showToast('🔮 All modules complete! The Hidden Archive stirs...', 'cyan');
  }

  spawnParticles();
  doRender(document.location.hash.replace(/^#/, '') || '/');
}

/* ── Quiz Engine ── */
let quizState = null;

function renderQuiz(id, c) {
  if (id === 'mystery') {
    c.innerHTML = `<div class="module-page"><p style="text-align:center;padding:40px 0;color:var(--text-muted)">The Hidden Archive has no quiz. Some mysteries are meant to stay mysterious.</p><div class="module-actions"><button class="btn btn-ghost" onclick="navigate('#/module/mystery')">🔙 Back</button></div></div>`;
    return;
  }
  const mod = MODULES.find(m => m.id === parseInt(id));
  if (!mod) { navigate('#/'); return; }
  if (!state.completedModules.includes(mod.id)) {
    navigate(`#/module/${id}`);
    return;
  }

  // Check if already done today
  const prevScore = state.quizScores[mod.id];
  if (prevScore !== undefined) {
    // Allow retake
  }

  quizState = { moduleId: mod.id, answers: {}, submitted: false };

  c.innerHTML = `
    <div class="module-page">
      <h2>📝 Quiz: ${mod.title}</h2>
      <p style="color:var(--text-muted);margin-bottom:16px">${mod.quiz.length} questions · ${prevScore !== undefined ? `Previous score: ${prevScore}/${mod.quiz.length}` : ''}</p>
      <div class="quiz-container" id="quiz-container"></div>
    </div>
  `;

  renderQuizQuestion(0);
}

function renderQuizQuestion(qIdx) {
  const mod = MODULES.find(m => m.id === quizState.moduleId);
  if (!mod || qIdx >= mod.quiz.length) { renderQuizResult(); return; }

  const q = mod.quiz[qIdx];
  const selected = quizState.answers[qIdx];
  const showResults = quizState.submitted;
  const pct = Math.round(((qIdx) / mod.quiz.length) * 100);

  const container = document.getElementById('quiz-container');
  container.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
      <span>${qIdx+1}/${mod.quiz.length}</span>
    </div>
    <div class="quiz-question">
      <div class="q-num">Question ${qIdx+1} of ${mod.quiz.length}</div>
      <div class="q-text">${q.q}</div>
    </div>
    <div class="quiz-options">
      ${q.opts.map((opt, oi) => {
        const cls = ['quiz-option'];
        if (selected === oi) cls.push('selected');
        if (showResults) {
          if (oi === q.ans) cls.push('correct');
          else if (selected === oi) cls.push('wrong');
        }
        return `<div class="${cls.join(' ')}" onclick="${showResults ? '' : 'selectQuizAnswer('+qIdx+','+oi+')'}">
          <span class="radio"></span><span>${opt}</span>
        </div>`;
      }).join('')}
    </div>
    ${showResults ? `<div class="quiz-explain">${selected === q.ans
      ? `✅ <strong>Correct!</strong> "${q.opts[q.ans]}" is right.`
      : `❌ <strong>Incorrect.</strong> The correct answer was: "${q.opts[q.ans]}".`}</div>` : ''}
    <div class="module-actions" style="margin-top:16px">
      ${!showResults ? `<button class="btn btn-gold" onclick="submitQuizAnswer(${qIdx})" ${selected === undefined ? 'disabled' : ''}>${qIdx === mod.quiz.length - 1 ? '📝 Submit Quiz' : '⏭ Next Question'}</button>` : ''}
      ${showResults && qIdx < mod.quiz.length - 1 ? `<button class="btn btn-cyan" onclick="renderQuizQuestion(${qIdx+1})">⏭ Next Question</button>` : ''}
      ${showResults && qIdx === mod.quiz.length - 1 ? `<button class="btn btn-gold" onclick="finishQuiz()">🔙 Back to Dashboard</button>` : ''}
    </div>
  `;
}

function selectQuizAnswer(qIdx, optIdx) {
  if (quizState.submitted) return;
  quizState.answers[qIdx] = optIdx;
  renderQuizQuestion(qIdx);
}

function submitQuizAnswer(qIdx) {
  const mod = MODULES.find(m => m.id === quizState.moduleId);
  if (!mod) return;
  if (quizState.answers[qIdx] === undefined) return;

  if (qIdx === mod.quiz.length - 1) {
    // Last question — show results
    quizState.submitted = true;
    renderQuizQuestion(qIdx);
    renderQuizResult();
  } else {
    renderQuizQuestion(qIdx + 1);
  }
}

function renderQuizResult() {
  const mod = MODULES.find(m => m.id === quizState.moduleId);
  if (!mod) return;
  let correct = 0;
  mod.quiz.forEach((q, i) => { if (quizState.answers[i] === q.ans) correct++; });
  
  // Find or create results container
  const existing = document.getElementById('quiz-result-box');
  if (existing) existing.remove();

  const container = document.getElementById('quiz-container');
  const total = mod.quiz.length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 60;
  const isRetake = state.quizScores[mod.id] !== undefined;
  const alreadyHad = state.quizScores[mod.id] || 0;

  let div = document.createElement('div');
  div.id = 'quiz-result-box';
  div.className = 'quiz-result';
  div.innerHTML = `
    <div class="big">${passed ? '🎉' : '😅'}</div>
    <h3>${passed ? 'Knowledge Acquired!' : 'Almost There!'}</h3>
    <p>${correct}/${total} correct (${pct}%)${passed ? '' : ' — review and try again'}</p>
    ${!isRetake && passed ? '<p style="margin-top:8px;color:var(--accent)">+15 💎 bonus for passing</p>' : ''}
    ${isRetake && passed && correct > alreadyHad ? '<p style="margin-top:8px;color:var(--accent)">New personal best! +5 💎</p>' : ''}
  `;
  container.appendChild(div);

  if (!quizState._resultsProcessed) {
    quizState._resultsProcessed = true;
    if (passed) {
      playSound('quizpass');
      spawnConfetti(30);
      if (!isRetake) {
        addGems(15);
        state.quizScores[mod.id] = correct;
        saveState();
        showToast(`📝 Quiz passed! +15 💎`, 'cyan');
      } else if (correct > alreadyHad) {
        addGems(5);
        state.quizScores[mod.id] = correct;
        saveState();
        showToast(`📝 New best! +5 💎`, 'cyan');
      }
    } else {
      playSound('quizfail');
    }
    // Scroll to results
    setTimeout(() => { const el = document.getElementById('quiz-result-box'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 200);
  }
}

function finishQuiz() {
  quizState = null;
  doRender(document.location.hash.replace(/^#/, '') || '/');
}

/* ── Vault ── */
function renderVault(c) {
  const allCards = CONCEPT_CARDS.flatMap(([mid, cards]) => cards);
  const unlocked = state.conceptCards;

  c.innerHTML = `
    <h2 style="font-family:Syne,sans-serif;font-size:22px;margin-bottom:4px">🗂️ Concept Vault</h2>
    <p style="color:var(--text-muted);margin-bottom:16px">Key concepts you've collected from each module. ${unlocked.length}/${allCards.length} unlocked.</p>
    <div class="vault-grid">
      ${allCards.map(card => {
        const has = unlocked.includes(card.id);
        const mod = moduleNameForCard(card.id);
        return `<div class="concept-card ${has?'':'locked'}">
          <div class="card-icon">${has ? card.icon : '🔒'}</div>
          <h4>${has ? card.name : '???'}</h4>
          <p>${has ? card.desc : (mod ? `Unlock by completing <strong>${mod.icon} ${mod.title}</strong>` : 'Complete the module to unlock')}</p>
        </div>`;
      }).join('')}
    </div>
    <div class="module-actions" style="margin-top:20px">
      <button class="btn btn-ghost" onclick="navigate('#/')">🔙 Back</button>
    </div>
  `;
}

/* ── Badges ── */
function renderBadges(c) {
  const bd = BADGES;
  c.innerHTML = `
    <h2 style="font-family:Syne,sans-serif;font-size:22px;margin-bottom:4px">🏅 Badges</h2>
    <p style="color:var(--text-muted);margin-bottom:16px">${state.seenBadgeIds.length}/${bd.length} earned</p>
    <div class="badge-grid">
      ${bd.map(b => {
        const earned = state.seenBadgeIds.includes(b.id);
        return `<div class="badge-item ${earned?'earned':''}">
          <div class="badge-icon">${earned ? b.icon : '🔒'}</div>
          <h4>${b.name}</h4>
          <p>${b.desc}${!earned ? '<br><span style="font-size:11px;color:var(--accent)">🔒 Locked</span>' : ' ✅'}</p>
        </div>`;
      }).join('')}
    </div>
    <div class="module-actions" style="margin-top:20px">
      <button class="btn btn-ghost" onclick="navigate('#/')">🔙 Back</button>
    </div>
  `;
}

/* ── UI Helpers ── */
function showToast(msg, type = '') {
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

function showLevelUp(lvl) {
  playSound('levelup');
  spawnConfetti(100);
  // Screen flash
  const flash = document.createElement('div');
  flash.className = 'screen-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 800);

  const overlay = document.createElement('div');
  overlay.className = 'level-up-overlay';
  overlay.onclick = () => overlay.remove();
  overlay.innerHTML = `
    <div class="level-up-card">
      <div class="big">⬆️</div>
      <h2>Level ${lvl}: ${LEVEL_NAMES[lvl]}!</h2>
      <p>Your knowledge deepens. The vault reveals more of its secrets.</p>
      <button class="btn btn-gold" onclick="this.closest('.level-up-overlay').remove()">✨ Continue</button>
    </div>
  `;
  document.body.appendChild(overlay);
  spawnParticles();
}

function spawnParticles() {
  const container = document.createElement('div');
  container.className = 'particles';
  const colors = ['#f0b429','#38bdf8','#34d399','#a855f7','#ef4444'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const x = 40 + Math.random() * 20;
    const y = 40 + Math.random() * 20;
    const dx = (Math.random() - 0.5) * 300;
    const dy = (Math.random() - 0.5) * 300;
    p.style.cssText = `left:${x}%;top:${y}%;background:${colors[i%colors.length]};--dx:${dx}px;--dy:${dy}px;animation-delay:${Math.random()*0.2}s`;
    container.appendChild(p);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 1500);
}

function updateDisplay() {
  document.getElementById('xp-display').textContent = `${state.xp} XP`;
  document.getElementById('gem-display').textContent = `${state.gems}`;
  document.getElementById('streak-display').textContent = `${state.streak} day${state.streak!==1?'s':''}`;
  document.getElementById('shield-display').textContent = `${state.streakFreezes || 0}`;
  document.getElementById('level-display').textContent = getLevelName(state.level);
}

/* ── Search ── */
function renderSearch(c) {
  const allCards = CONCEPT_CARDS.flatMap(([mid, cards]) => cards);
  let results = '';
  c.innerHTML = `
    <h2 style="font-family:Syne,sans-serif;font-size:22px;margin-bottom:4px">🔍 Search</h2>
    <p style="color:var(--text-muted);margin-bottom:16px">Search across modules, concepts, and badges.</p>
    <input id="search-input" class="search-input" placeholder="Type to search..." autofocus oninput="doSearch(this.value)">
    <div id="search-results"></div>
    <div class="module-actions" style="margin-top:20px">
      <button class="btn btn-ghost" onclick="navigate('#/')">🔙 Back</button>
    </div>
  `;
}

function doSearch(query) {
  const q = query.toLowerCase().trim();
  const container = document.getElementById('search-results');
  if (!q || q.length < 2) { container.innerHTML = '<p style="color:var(--text-muted);margin-top:16px">Type at least 2 characters to search.</p>'; return; }

  const allCards = CONCEPT_CARDS.flatMap(([mid, cards]) => cards);
  const hits = [];

  MODULES.forEach(m => {
    if (m.title.toLowerCase().includes(q) || m.track.toLowerCase().includes(q) || m.lore.toLowerCase().includes(q) || m.content.some(p => strip(p).toLowerCase().includes(q))) {
      hits.push({ type: 'module', icon: m.icon, label: m.title, sub: m.track + ' module', link: `/module/${m.id}` });
    }
  });
  allCards.forEach(c => {
    if (c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) {
      const mod = moduleNameForCard(c.id);
      hits.push({ type: 'concept', icon: c.icon, label: c.name, sub: mod ? mod.icon + ' ' + mod.title : 'concept card', link: mod ? `/module/${mod.id}` : '#/vault' });
    }
  });
  BADGES.forEach(b => {
    if (b.name.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q)) {
      hits.push({ type: 'badge', icon: b.icon, label: b.name, sub: b.desc, link: '#/badges' });
    }
  });

  if (hits.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);margin-top:16px">No results found.</p>';
    return;
  }
  container.innerHTML = hits.map(h => `<div class="search-hit" onclick="navigate('${h.link}')">
    <span style="font-size:24px">${h.icon}</span>
    <div><strong>${h.label}</strong><br><span style="font-size:13px;color:var(--text-muted)">${h.sub}</span></div>
    <span style="margin-left:auto;color:var(--text-muted);font-size:12px">${h.type}</span>
  </div>`).join('');
}

/* ── Levels Table ── */
function renderLevels(c) {
  c.innerHTML = `
    <h2 style="font-family:Syne,sans-serif;font-size:22px;margin-bottom:4px">📊 Tier Levels</h2>
    <p style="color:var(--text-muted);margin-bottom:16px">${state.xp} total XP · Current: <strong>${getLevelName(state.level)}</strong> (Level ${state.level})</p>
    <div class="levels-table-wrap">
      <table class="levels-table">
        <tr><th>Level</th><th>Title</th><th>XP Required</th><th>Status</th></tr>
        ${LEVELS.map((xp, i) => {
          if (i === 0) return '';
          const name = LEVEL_NAMES[i] || 'Transcendent';
          const prev = LEVELS[i - 1];
          const reached = state.level >= i;
          return `<tr class="${reached ? 'reached' : ''}">
            <td><strong>${i}</strong></td>
            <td>${name}</td>
            <td>${prev} XP</td>
            <td>${reached ? '✅' : (i === state.level + 1 ? '🎯 Next' : '🔒')}</td>
          </tr>`;
        }).join('')}
        <tr class="${state.level >= LEVELS.length ? 'reached' : ''}">
          <td><strong>${LEVELS.length}</strong></td>
          <td>Transcendent</td>
          <td>${LEVELS[LEVELS.length - 1]} XP</td>
          <td>${state.level >= LEVELS.length ? '✅' : '🔒'}</td>
        </tr>
      </table>
    </div>
    <div class="module-actions" style="margin-top:20px">
      <button class="btn btn-ghost" onclick="navigate('#/')">🔙 Back</button>
    </div>
  `;
}

/* ── Streak Shield Shop ── */
function buyStreakShield() {
  if (state.gems < 30) { showToast('❌ Not enough 💎 Gems! Need 30.', 'gold'); return; }
  state.gems -= 30;
  state.streakFreezes = (state.streakFreezes || 0) + 1;
  saveState();
  updateDisplay();
  playSound('gem');
  showToast('🛡️ Streak Shield purchased! You now have ' + state.streakFreezes + ' shield(s).', 'cyan');
}

/* ── Easter Egg handler ── */
document.addEventListener('click', function(e) {
  const egg = e.target.closest('.egg');
  if (egg) {
    const id = egg.dataset.eggId || 'unknown';
    if (!state.eggsFound.includes(id)) {
      state.eggsFound.push(id);
      addGems(5);
      checkBadgeUnlocks();
      spawnParticles();
      showToast(`🥚 Hidden relic found! +5 💎`, 'gold');
    } else {
      showToast('🥚 You already found this relic', 'cyan');
    }
  }
});

/* ── Init ── */
window.addEventListener('load', () => {
  checkStreak();
  updateDisplay();
  renderModuleTree();
  doRender(location.hash.replace(/^#/, '') || '/');
});
