const EBOOKS = [
  { slug: 'career-leverage', img: 'salary-booster.png', title: 'Salary Booster', subtitle: 'Career Leverage: From Junior to Senior', desc: 'Promotions, salary negotiation, building influence, and interviews — the playbook for engineers who refuse to stay overlooked.', price: 499 },
  { slug: 'real-engineering', img: 'bug-sniper.png', title: 'Bug Sniper', subtitle: 'Real Engineering: Beyond the Tutorial', desc: 'Production systems, debugging, architecture, CI/CD, and the trade-offs that actually matter after the tutorial ends.', price: 599 },
  { slug: 'ai-working-engineer', img: 'ai-arsenal.png', title: 'AI Arsenal', subtitle: 'AI for Working Engineers', desc: 'LLMs, RAG, AI-assisted coding, and production AI — practical tools for engineers who want to stay ahead of the shift.', price: 699 },
];

const grid = document.getElementById('productGrid');
EBOOKS.forEach(b => {
  grid.innerHTML += `
    <div class="product-card">
      <div class="product-illustration"><img src="/assets/site/assets/img/${b.img}" alt="${b.title} illustration"></div>
      <h3>${b.title}</h3>
      <p class="product-subtitle">${b.subtitle}</p>
      <p>${b.desc}</p>
      <div class="product-footer">
        <div class="product-price">₹${b.price}<span>one-time</span></div>
        <button class="btn btn-primary btn-md" onclick="openModal('${b.slug}','${b.title.replace(/'/g,"\\'")}')">Get</button>
      </div>
    </div>`;
});

function openModal(slug, title) {
  const book = EBOOKS.find(b => b.slug === slug);
  document.getElementById('ebookSlug').value = slug;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalPrice').innerHTML = '₹' + book.price + '<span>one-time</span>';
  document.getElementById('payLink').href = 'upi://pay?pa=8989059838@axisb&am=' + book.price + '&cu=INR&tn=' + slug;
  document.getElementById('purchaseForm').style.display = '';
  document.getElementById('successView').style.display = 'none';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('submitBtn').textContent = 'Submit Purchase';
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('purchaseForm').reset();
}

function copyUPI() {
  navigator.clipboard.writeText('8989059838@axisb').then(() => showToast('UPI ID copied'));
}

function toggleTrack() {
  const p = document.getElementById('trackPanel');
  p.style.display = p.style.display === 'none' ? '' : 'none';
}

var SHOP_API = 'https://sustained-jacksonville-annually-criticism.trycloudflare.com/tusk';
function getApiBase() {
  return (window.SHOP_API || '').replace(/\/+$/, '').replace(/\/tusk$/, '/greed');
}

async function trackOrder() {
  const email = document.getElementById('trackEmail').value.trim();
  const btn = document.getElementById('trackBtn');
  const result = document.getElementById('trackResult');
  if (!email) { result.innerHTML = '<span class="status-pill rejected">Enter your email first</span>'; return; }
  btn.disabled = true; btn.textContent = 'Checking...';
  try {
    const r = await fetch(getApiBase() + '/shop/status?email=' + encodeURIComponent(email));
    if (r.status === 404) { result.innerHTML = '<span class="status-pill rejected">No order found for this email</span>'; return; }
    if (!r.ok) throw new Error('Server error: ' + r.status);
    const d = await r.json();
    const pill = d.status === 'approved' ? '✅ Delivered' : d.status === 'rejected' ? '❌ Rejected' : '⏳ Pending verification';
    const cls = d.status === 'approved' ? 'approved' : d.status === 'rejected' ? 'rejected' : 'pending';
    result.innerHTML = '<div><span class="status-pill ' + cls + '">' + pill + '</span></div><div style="margin-top:8px;color:var(--slate-400);font-size:13px;">' + d.ebook_title + ' · Order #' + d.order_id + '</div>';
  } catch (err) {
    result.innerHTML = '<span class="status-pill rejected">Could not check status. Try again.</span>';
  } finally {
    btn.disabled = false; btn.textContent = 'Check status';
  }
}

async function submitPurchase(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Submitting...';
  const data = new FormData(document.getElementById('purchaseForm'));
  try {
    const r = await fetch(getApiBase() + '/shop/purchase', { method: 'POST', body: data });
    if (!r.ok) throw new Error('Server error: ' + r.status);
    const d = await r.json();
    document.getElementById('orderId').textContent = '#' + d.order_id;
    document.getElementById('purchaseForm').style.display = 'none';
    document.getElementById('successView').style.display = '';
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Submit Purchase';
    showToast(err.message, true);
  }
}

function showToast(msg, isError) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (isError ? 'error' : 'success');
  setTimeout(() => { t.className = 'toast'; }, 4000);
}

function toggleNav() { document.getElementById('navLinks').classList.toggle('open'); }