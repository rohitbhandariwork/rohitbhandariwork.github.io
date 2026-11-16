const ORDERS_EMAIL = 'rohitbhandari.work@gmail.com';
const UPI_ID = '8989059838@axisb';
const SITE_ORIGIN = 'https://rohitbhandariwork.github.io';

function $id(x) { return document.getElementById(x); }

function showToast(msg, type) {
  const t = $id('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + (type || 'success');
  setTimeout(() => (t.className = 'toast'), 3000);
}

function copyUPI() {
  const v = UPI_ID;
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
  if (!p) return;
  const shown = p.style.display !== 'none';
  p.style.display = shown ? 'none' : 'block';
  const btn = $id('trackToggle');
  if (btn) btn.textContent = shown ? 'Already purchased? Track your order' : 'Close track';
}

async function trackOrder() {
  const email = $id('trackEmail').value.trim();
  const res = $id('trackResult');
  if (!email) { res.textContent = 'Enter the email you used at purchase.'; return; }
  res.textContent = 'Checking…';
  const btn = $id('trackBtn');
  if (btn) btn.disabled = true;
  const mine = lastSubmittedOrder(email);
  res.textContent = mine
    ? 'On this device: order ' + mine.ref + ' — ' + mine.title + ' — sent ' + mine.when +
      '. (I can only see submissions made on this device. For the real status, email ' + ORDERS_EMAIL + '.)'
    : 'No submission found on this device for that email. Order status is checked by hand — email ' +
      ORDERS_EMAIL + ' and you will get an answer within 24 hours.';
  if (btn) btn.disabled = false;
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

function submitPurchase(e, product) {
  if (!product) product = window.checkoutProduct;
  if (!product) return;
  e.preventDefault();
  const btn = $id('submitBtn');
  const form = $id('purchaseForm');
  const data = new FormData(form);
  const payload = {
    ebook_slug: product.slug,
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
    title: product.title,
    sub: product.subtitle,
    price: '₹' + product.price,
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
    '— sent from ' + SITE_ORIGIN + '/shop/checkout/' + product.slug
  ].join('\n');

  const mailto = 'mailto:' + ORDERS_EMAIL +
    '?subject=' + encodeURIComponent('New order ' + ref + ' — ' + order.title) +
    '&body=' + encodeURIComponent(body);

  saveSubmittedOrder(order);

  const raw = $id('orderRaw');
  if (raw) raw.value = 'To: ' + ORDERS_EMAIL + '\nSubject: New order ' + ref + ' — ' + order.title + '\n\n' + body;
  const again = $id('orderMailto');
  if (again) again.href = mailto;

  const orderId = $id('orderId');
  if (orderId) orderId.textContent = ref;
  const echo = $id('orderIdEcho');
  if (echo) echo.textContent = ref;
  const conf = $id('confirmEmail');
  if (conf) conf.textContent = email;

  const purchaseForm = $id('purchaseForm');
  const successView = $id('successView');
  if (purchaseForm) purchaseForm.style.display = 'none';
  if (successView) successView.style.display = 'block';

  btn.disabled = false;
  btn.textContent = 'Submit Purchase';

  window.location.href = mailto;
}

window.copyUPI = copyUPI;
window.copyOrder = copyOrder;
window.toggleTrack = toggleTrack;
window.trackOrder = trackOrder;
window.submitPurchase = submitPurchase;
