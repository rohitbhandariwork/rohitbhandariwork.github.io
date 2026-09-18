const API = 'https://api.rohitbuildsapp.tech';

const PRODUCTS = [
  {
    slug: 'career-leverage',
    img: 'salary-booster.png',
    title: 'Salary Booster',
    subtitle: 'Career Leverage: From Junior to Senior',
    desc: 'Promotions, salary negotiation, building influence, and interviews — the playbook for engineers who refuse to stay overlooked.',
    price: 499
  },
  {
    slug: 'real-engineering',
    img: 'bug-sniper.png',
    title: 'Bug Sniper',
    subtitle: 'Real Engineering: Beyond the Tutorial',
    desc: 'Production systems, debugging, architecture, CI/CD, and the trade-offs that actually matter after the tutorial ends.',
    price: 599
  },
  {
    slug: 'ai-working-engineer',
    img: 'ai-arsenal.png',
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
  try {
    const r = await fetch(API + '/shop/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!r.ok) throw new Error(String(r.status));
    const data = await r.json();
    res.textContent = data.status || 'No order found for that email yet.';
  } catch (err) {
    res.textContent = 'Status service unreachable. Email rohitbhandari.work@gmail.com.';
  } finally {
    btn.disabled = false;
  }
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
  btn.textContent = 'Submitting…';
  const orderId = 'RBP-' + Date.now().toString().slice(-6);
  try {
    const r = await fetch(API + '/shop/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error(String(r.status));
  } catch (err) {
    showToast('Server unreachable — will record on my side from this reference.', 'warning');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Purchase';
  }
  $id('orderId').textContent = '#' + orderId;
  $id('purchaseForm').style.display = 'none';
  $id('successView').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', renderProducts);

window.openBook = openBook;
window.closeModal = closeModal;
window.copyUPI = copyUPI;
window.toggleTrack = toggleTrack;
window.trackOrder = trackOrder;
window.submitPurchase = submitPurchase;