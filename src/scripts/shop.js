const API = 'https://api.rohitbuildsapp.tech';

const PRODUCTS = [
  {
    slug: 'python-foundations',
    title: 'Python: Think in Code',
    subtitle: 'From zero to writing idiomatic Python — data, functions, classes, and the mental model behind it all.',
    level: 'Beginner → Intermediate',
    price: 499,
    pages: '~180',
    rating: 4.9,
    badge: 'Bestseller'
  },
  {
    slug: 'deep-learning',
    title: 'Deep Learning: From Neurons to Networks',
    subtitle: 'Backpropagation, optimizers, CNNs, RNNs — built up layer by layer with intuition in every step.',
    level: 'Intermediate',
    price: 549,
    pages: '~220',
    rating: 4.8,
    badge: 'New'
  },
  {
    slug: 'transformers',
    title: 'Transformers & Attention: The Math That Changed AI',
    subtitle: 'Attention, self-attention, multi-head, and the architecture that powers modern LLMs — demystified.',
    level: 'Intermediate → Advanced',
    price: 599,
    pages: '~200',
    rating: 4.9
  },
  {
    slug: 'python-fastapi',
    title: 'FastAPI in Production',
    subtitle: 'Build, test, and ship async APIs with confidence. Includes auth, background tasks, and uvicorn in deployment.',
    level: 'Intermediate',
    price: 449,
    pages: '~160',
    rating: 4.7,
    badge: 'Popular'
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
    card.className = 'product-card';
    let badge = '';
    if (b.badge) badge = `<span class="product-badge">${b.badge}</span>`;
    card.innerHTML = `
      ${badge}
      <h3 class="product-title">${b.title}</h3>
      <p class="product-sub">${b.subtitle}</p>
      <div class="product-meta"><span>${b.level}</span><span>${b.pages} pages</span><span>★ ${b.rating}</span></div>
      <div class="product-foot"><span class="product-price">₹${b.price}</span>
      <button class="btn btn-primary btn-md" onclick="openBook('${b.slug}')">Buy now</button></div>
    `;
    grid.appendChild(card);
  }
}

function openBook(slug) {
  const b = PRODUCTS.find((p) => p.slug === slug);
  if (!b) return;
  currentBook = b;
  $id('ebookSlug').value = b.slug;
  $id('modalTitle').textContent = b.title;
  $id('modalSub').textContent = 'Complete your order in 3 quick steps.';
  $id('modalPrice').innerHTML = `₹${b.price}<span>one-time</span>`;
  $id('payLink').href = 'upi://pay?pa=8989059838@axisb&cu=INR';
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
  $id('trackToggle').textContent = shown ? '🔎 Track my order' : '✕ Close track';
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