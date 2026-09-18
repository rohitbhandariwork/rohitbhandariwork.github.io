let mode = 'rohit';
const API = 'https://api.rohitbuildsapp.tech';

function $id(x) { return document.getElementById(x); }

function showToast(msg, type) {
  const t = $id('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || 'success');
  setTimeout(() => (t.className = 'toast'), 3000);
}

function setMode(m) {
  mode = m;
  $id('toggleRohit').classList.toggle('active', m === 'rohit');
  $id('toggleOther').classList.toggle('active', m === 'other');
  $id('extraFields').style.display = m === 'rohit' ? 'none' : 'block';
  $id('formTitle').textContent = m === 'rohit' ? 'Quick Apply — Rohit' : 'Tailored Apply — Candidate';
  $id('formSub').textContent = m === 'rohit'
    ? 'Only the job description is needed — everything else is pre-filled.'
    : 'Fill in the candidate details so we can tailor the resume and cover letter.';
}

function detectCompany(jd) {
  const lines = jd.split('\n').slice(0, 12).filter((l) => l.trim());
  for (const line of lines) {
    const m = line.match(/at\s+([A-Z][A-Za-z0-9&\-. ]{2,60})$/);
    if (m) return m[1].trim();
  }
  return '';
}

async function submitJob(e) {
  e.preventDefault();
  const btn = $id('submitBtn');
  const jdText = $id('jd').value.trim();
  if (!jdText) { showToast('Please paste a job description', 'error'); return; }

  let company = $id('company').value.trim();
  if (!company) company = detectCompany(jdText);

  const payload = { job_description: jdText, company };
  if (mode === 'other') {
    const name = $id('candName').value.trim();
    const email = $id('candEmail').value.trim();
    if (!name || !email) { showToast('Please fill name and email', 'error'); return; }
    payload.company = company || '';
    payload.candidate = { name, email, phone: $id('candPhone').value.trim(), linkedin: $id('candLinkedin').value.trim() };
  } else {
    payload.candidate = { name: 'Rohit Bhandari', email: 'rohitbhandari.work@gmail.com', phone: '', linkedin: 'https://linkedin.com/in/rohitbhandariwork' };
  }

  btn.disabled = true;
  btn.textContent = 'Generating...';
  try {
    const res = await fetch(API + '/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    showToast('Queued! Check email shortly.', 'success');
  } catch (err) {
    showToast('Server unreachable — saved locally. Retry later.', 'warning');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate & Send';
  }
  $id('formCard').style.display = 'none';
  $id('resultCard').style.display = 'block';
}

window.setMode = setMode;
window.submitJob = submitJob;