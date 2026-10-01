const ORDERS_EMAIL = 'rohitbhandari.work@gmail.com';
const UPI_ID = '8989059838@axisb';
const SITE_ORIGIN = 'https://rohitbhandariwork.github.io';

const PRODUCTS = [
  {
    slug: 'career-leverage',
    img: 'salary-booster.jpg',
    title: 'Salary Booster',
    subtitle: 'Career Leverage: From Junior to Senior',
    desc: 'Promotions, salary negotiation, building influence, and interviews — the playbook for engineers who refuse to stay overlooked.',
    price: 499
  },
  {
    slug: 'real-engineering',
    img: 'bug-sniper.jpg',
    title: 'Bug Sniper',
    subtitle: 'Real Engineering: Beyond the Tutorial',
    desc: 'Production systems, debugging, architecture, CI/CD, and the trade-offs that actually matter after the tutorial ends.',
    price: 599
  },
  {
    slug: 'ai-working-engineer',
    img: 'ai-arsenal.jpg',
    title: 'AI Arsenal',
    subtitle: 'AI for Working Engineers',
    desc: 'LLMs, RAG, AI-assisted coding, and production AI — practical tools for engineers who want to stay ahead of the shift.',
    price: 699
  }
];

let currentBook = null;

function $id(x) { return document.getElementById(x); }

function showToast(msg, type) {
  const t = $id('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || 'success');
  setTimeout(() => (t.className = 'toast'), 3000);
}

function renderProducts() {
  const grid = $id('productGrid');
  grid.innerHTML = '';
  for (const b of PRODUCTS) {
    const card = document.createElement('div');
    card.className = 'book-tile';
    card.innerHTML = `
      <div class="book-cover"><img src="/assets/img/${b.img}" alt="${b.title} cover" loading="lazy"></div>
      <p class="book-kicker">${b.subtitle}</p>
      <h3 class="book-title">${b.title}</h3>
      <p class="book-desc">${b.desc}</p>
      <div class="book-foot">
        <div class="book-price">₹${b.price}<span>one-time</span></div>
        <button class="btn btn-primary btn-md" onclick="openBook('${b.slug}')">Get</button>
      </div>
    `;
    grid.appendChild(card);
  }
}

function openBook(slug) {
  const b = PRODUCTS.find((p) => p.slug === slug);
  if (!b) return;
  currentBook = b;
  $id('ebookSlug').value = b.slug;
  $id('modalCover').src = '/assets/img/' + b.img;
  $id('modalCover').alt = b.title + ' cover';
  $id('modalCover').style.display = 'block';
  $id('modalTitle').textContent = b.title;
  $id('modalSub').textContent = 'Complete your order in 3 quick steps.';
  $id('modalPrice').innerHTML = `₹${b.price}<span>one-time</span>`;
  $id('payLink').href = 'upi://pay?pa=8989059838@axisb&am=' + b.price + '&cu=INR&tn=' + b.slug;
  $id('successView').style.display = 'none';
  $id('purchaseForm').style.display = 'block';
  $id('modal').classList.add('open');
}

function closeModal() {
  $id('modal').classList.remove('open');
}

function copyUPI() {
  const v = '8989059838@axisb';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(v).then(() => showToast('UPI ID copied!')).catch(() => showToast('Copy: ' + v, 'info'));
  } else {
    showToast('Copy: ' + v, 'info');
  }
}

function copyOrder() {
  const raw = $id('orderRaw');
  const text = raw ? raw.value : '';
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Order details copied — paste into your email app.'))
      .catch(() => { raw.select(); showToast('Press Cmd/Ctrl+C to copy the selected details.', 'info'); });
  } else {
    raw.select();
    showToast('Press Cmd/Ctrl+C to copy the selected details.', 'info');
  }
}

function toggleTrack() {
  const p = $id('trackPanel');
  const shown = p.style.display !== 'none';
  p.style.display = shown ? 'none' : 'block';
  $id('trackToggle').textContent = shown ? 'Already purchased? Track your order' : 'Close track';
}

async function trackOrder() {
  const email = $id('trackEmail').value.trim();
  const res = $id('trackResult');
  if (!email) { res.textContent = 'Enter the email you used at purchase.'; return; }
  res.textContent = 'Checking…';
  const btn = $id('trackBtn');
  btn.disabled = true;
  const mine = lastSubmittedOrder(email);
  res.textContent = mine
    ? 'On this device: order ' + mine.ref + ' — ' + mine.title + ' — sent ' + mine.when +
      '. (I can only see submissions made on this device. For the real status, email ' + ORDERS_EMAIL + '.)'
    : 'No submission found on this device for that email. Order status is checked by hand — email ' +
      ORDERS_EMAIL + ' and you will get an answer within 24 hours.';
  btn.disabled = false;
}

function saveSubmittedOrder(order) {
  try {
    const all = JSON.parse(localStorage.getItem('rb_orders') || '[]');
    all.push(order);
    localStorage.setItem('rb_orders', JSON.stringify(all.slice(-20)));
  } catch (err) {}
  try {
    localStorage.setItem('rb_last_order', JSON.stringify(order));
  } catch (err) {}
}

function lastSubmittedOrder(email) {
  const needle = String(email || '').trim().toLowerCase();
  if (!needle) return null;
  let all = [];
  try {
    all = JSON.parse(localStorage.getItem('rb_orders') || '[]');
  } catch (err) {
    return null;
  }
  for (let i = all.length - 1; i >= 0; i--) {
    if (String(all[i].email || '').toLowerCase() === needle) return all[i];
  }
  return null;
}

async function submitPurchase(e) {
  e.preventDefault();
  const btn = $id('submitBtn');
  if (!currentBook) return;
  const form = $id('purchaseForm');
  const data = new FormData(form);
  const payload = {
    ebook_slug: currentBook.slug,
    name: data.get('name'),
    email: data.get('email'),
    txn_id: data.get('txn_id')
  };
  btn.disabled = true;
  btn.textContent = 'Building your order…';

  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const txn = String(payload.txn_id || '').trim();
  if (!name || !email || !txn) {
    showToast('Fill name, email and UPI transaction ID.', 'warning');
    btn.disabled = false;
    btn.textContent = 'Submit Purchase';
    return;
  }

  const d = new Date();
  const stamp = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  const ref = 'RBP-' + stamp + '-' + rand;

  const order = {
    ref: ref,
    title: currentBook.title,
    sub: currentBook.subtitle,
    price: '₹' + currentBook.price,
    name: name,
    email: email,
    txn_id: txn,
    when: d.toLocaleString()
  };

  const body = [
    'NEW ORDER — Rohit Builds',
    '',
    'Order reference: ' + ref,
    'Book: ' + order.title + ' — ' + order.sub,
    'Price paid: ' + order.price,
    'Paid to UPI: ' + UPI_ID,
    '',
    'Name: ' + name,
    'Email: ' + email,
    'UPI transaction ID: ' + txn,
    '',
    'I have paid the amount above by UPI and want the ebook delivered to the email above.',
    '',
    '— sent from ' + SITE_ORIGIN + '/shop'
  ].join('\n');

  const mailto = 'mailto:' + ORDERS_EMAIL +
    '?subject=' + encodeURIComponent('New order ' + ref + ' — ' + order.title) +
    '&body=' + encodeURIComponent(body);

  saveSubmittedOrder(order);

  const raw = $id('orderRaw');
  if (raw) raw.value = 'To: ' + ORDERS_EMAIL + '\nSubject: New order ' + ref + ' — ' + order.title + '\n\n' + body;
  const again = $id('orderMailto');
  if (again) again.href = mailto;

  $id('orderId').textContent = ref;
  const echo = $id('orderIdEcho');
  if (echo) echo.textContent = ref;
  const conf = $id('confirmEmail');
  if (conf) conf.textContent = email;
  $id('purchaseForm').style.display = 'none';
  $id('successView').style.display = 'block';

  btn.disabled = false;
  btn.textContent = 'Submit Purchase';

  window.location.href = mailto;
}

const FLOW_STEPS = [
  {
    title: 'Pay with UPI',
    detail: '<div class="payment-upi">8989059838@axisb <button class="btn-icon" onclick="copyUPI()" aria-label="Copy UPI ID"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg></button></div><p class="flow-txt">Google Pay, PhonePe, or Paytm — the amount for each book shows when you tap <strong>Get</strong> on a book above.</p>'
  },
  {
    title: 'Fill the order form',
    detail: '<ul class="flow-list"><li><strong>Name</strong></li><li><strong>Email</strong></li><li><strong>UPI transaction ID</strong></li></ul><p class="flow-txt">Three fields in the order popup — that’s all. Find the transaction ID in your payment app right after you pay.</p>'
  },
  {
    title: 'Get the ebook',
    detail: '<div class="flow-deliver"><span class="flow-deliver-icon" aria-hidden="true">✓</span><div><strong>Within 24 hours</strong><span>Payment verified, ebook delivered to your inbox</span></div></div><p class="flow-txt">Usually much faster. Track your order anytime with the link below.</p>'
  }
];

let flowIndex = 0;
let flowTimer = null;
let flowReduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setFlow(i) {
  const stages = document.querySelectorAll('.flow-stage');
  if (!stages.length) return;
  flowIndex = (i + stages.length) % stages.length;
  stages.forEach((s, idx) => {
    const active = idx === flowIndex;
    s.classList.toggle('is-active', active);
    if (active) s.setAttribute('aria-current', 'step');
    else s.removeAttribute('aria-current');
  });
  const bar = $id('flowBar');
  const count = $id('flowCount');
  const title = $id('flowTitle');
  const detail = $id('flowDetail');
  if (bar) bar.style.width = ((flowIndex + 1) / stages.length) * 100 + '%';
  if (count) count.textContent = (flowIndex + 1) + ' of ' + stages.length;
  if (title && FLOW_STEPS[flowIndex]) title.textContent = FLOW_STEPS[flowIndex].title;
  if (detail && FLOW_STEPS[flowIndex]) detail.innerHTML = FLOW_STEPS[flowIndex].detail;
}

function startFlow() {
  if (flowTimer || flowReduceMotion) return;
  flowTimer = setInterval(() => setFlow(flowIndex + 1), 4000);
}

function pauseFlow() {
  if (flowTimer) { clearInterval(flowTimer); flowTimer = null; }
}

function initShopFlow() {
  const stages = document.querySelectorAll('.flow-stage');
  if (!stages.length) return;
  stages.forEach((s) =>
    s.addEventListener('click', () => {
      setFlow(+s.dataset.step);
      pauseFlow();
      startFlow();
    })
  );
  const flow = $id('shopFlow');
  if (flow) {
    flow.addEventListener('mouseenter', pauseFlow);
    flow.addEventListener('mouseleave', startFlow);
    flow.addEventListener('focusin', pauseFlow);
    flow.addEventListener('focusout', startFlow);
    flow.addEventListener('touchstart', pauseFlow, { passive: true });
    flow.addEventListener('touchend', () => setTimeout(startFlow, 800), { passive: true });
  }
  setFlow(0);
  startFlow();
}

window.setFlow = setFlow;

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  initShopFlow();
});

window.openBook = openBook;
window.closeModal = closeModal;
window.copyUPI = copyUPI;
window.toggleTrack = toggleTrack;
window.trackOrder = trackOrder;
window.submitPurchase = submitPurchase;