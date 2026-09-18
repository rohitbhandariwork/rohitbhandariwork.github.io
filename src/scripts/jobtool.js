const API_BASE = (window.SHOP_API || '/tusk').replace(/\/+$/, '');
let currentMode = 'rohit';

function setMode(mode) {
  currentMode = mode;
  document.getElementById('toggleRohit').classList.toggle('active', mode === 'rohit');
  document.getElementById('toggleOther').classList.toggle('active', mode === 'other');
  const extra = document.getElementById('extraFields');
  extra.classList.toggle('visible', mode === 'other');
  document.getElementById('formTitle').textContent = mode === 'rohit' ? 'Quick Apply — Rohit' : 'Apply for Someone Else';
  document.getElementById('formSub').textContent = mode === 'rohit'
    ? 'Only the job description is needed — everything else is pre-filled.'
    : 'Fill in the candidate\'s details along with the job description.';

  if (mode === 'other') {
    document.getElementById('candName').required = true;
    document.getElementById('candEmail').required = true;
  } else {
    document.getElementById('candName').required = false;
    document.getElementById('candEmail').required = false;
  }
}

async function submitJob(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Generating (~5–7 min)...';

  const jd = document.getElementById('jd').value.trim();
  const company = document.getElementById('company').value.trim();

  const payload = { job_description: jd, company };

  if (currentMode === 'other') {
    const name = document.getElementById('candName').value.trim();
    const email = document.getElementById('candEmail').value.trim();
    if (!name || !email) {
      showToast('Name and Email are required for other candidates.', true);
      btn.disabled = false;
      btn.innerHTML = 'Generate &amp; Send';
      return;
    }
    payload.candidate_name = name;
    payload.candidate_email = email;
    payload.candidate_phone = document.getElementById('candPhone').value.trim();
    payload.candidate_linkedin = document.getElementById('candLinkedin').value.trim();
  }

  try {
    const resp = await fetch(API_BASE + '/job-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error('Server error: ' + resp.status);
    const data = await resp.json();
    document.getElementById('formCard').style.display = 'none';
    const who = data.candidate || 'Rohit Bhandari';
    const msg = `✅ Package for <strong>${who}</strong> — <strong>${data.position}</strong> @ <strong>${data.company}</strong> — sent to <strong>rohitbhandari.work@gmail.com</strong> for review. Check inbox in a few minutes.`;
    document.getElementById('resultMsg').innerHTML = msg;
    document.getElementById('resultCard').style.display = 'block';
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = 'Generate &amp; Send';
    showToast('Failed: ' + err.message, true);
  }
}

function showToast(msg, isError) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + (isError ? 'error' : 'success');
  setTimeout(() => { t.className = 'toast'; }, 4000);
}
function toggleNav(){document.getElementById('navLinks').classList.toggle('open')}