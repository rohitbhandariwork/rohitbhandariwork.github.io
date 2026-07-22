/**
 * Session Time Manager
 * Tracks cumulative time across sessions (localStorage).
 * - Min 1 hour: popup ONLY on site exit (not internal navigation)
 * - Max 6 hours: warning every 15 min
 * - "You left early yesterday" banner (not on first day)
 * - Idle time NOT tracked
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'edu_session_time';
  var MIN_TIME = 60 * 60;       // 1 hour in seconds
  var MAX_TIME = 6 * 60 * 60;   // 6 hours in seconds
  var WARNING_INTERVAL = 15 * 60; // 15 min in seconds

  var sessionStart = Date.now();
  var lastWarningTime = 0;
  var popupShown = false;
  var navigatingInternally = false; // flag: skip beforeunload for internal links

  // ── Storage helpers ──────────────────────────────────────────────
  function getStoredData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && typeof d === 'object') return d;
      }
    } catch (e) {}
    return { totalSeconds: 0, lastDate: null, lastEarlyExitDate: null, earlyExitCount: 0 };
  }

  function saveData(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function todayStr() { return new Date().toDateString(); }

  function yesterdayStr() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toDateString();
  }

  // ── Time tracking ────────────────────────────────────────────────
  function getElapsedSeconds() {
    return Math.floor((Date.now() - sessionStart) / 1000);
  }

  function getTotalTime() {
    var data = getStoredData();
    return data.totalSeconds + getElapsedSeconds();
  }

  function saveSessionTime() {
    var data = getStoredData();
    data.totalSeconds += getElapsedSeconds();
    data.lastDate = todayStr();
    saveData(data);
    sessionStart = Date.now();
  }

  // ── Early exit tracking ──────────────────────────────────────────
  function logEarlyExit() {
    var data = getStoredData();
    data.earlyExitCount = (data.earlyExitCount || 0) + 1;
    data.lastEarlyExitDate = todayStr();
    saveData(data);
  }

  function isFirstDay() {
    var data = getStoredData();
    return !data.lastEarlyExitDate;
  }

  function checkEarlyExitYesterday() {
    if (isFirstDay()) return;
    var data = getStoredData();
    if (data.lastEarlyExitDate === yesterdayStr()) {
      showEarlyExitBanner();
    }
  }

  function showEarlyExitBanner() {
    if (document.getElementById('early-exit-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'early-exit-banner';
    banner.innerHTML =
      '<div style="' +
        'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);' +
        'background:rgba(239,68,68,.12);color:#dc2626;' +
        'border:1px solid rgba(239,68,68,.2);' +
        'padding:10px 20px;border-radius:999px;' +
        'font-family:Manrope,-apple-system,sans-serif;' +
        'font-size:13px;font-weight:600;z-index:99999;' +
        'animation:fadeInBanner .3s ease;cursor:pointer;' +
        'max-width:90%;text-align:center;' +
      '">' +
        'You left early yesterday. Try to stay for at least 1 hour today!' +
      '</div>' +
      '<style>@keyframes fadeInBanner{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}</style>';
    banner.onclick = function() { banner.remove(); };
    document.body.appendChild(banner);
    setTimeout(function() { banner.remove(); }, 8000);
  }

  // ── Styles ───────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('session-time-styles')) return;
    var s = document.createElement('style');
    s.id = 'session-time-styles';
    s.textContent =
      '.session-popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);z-index:200000;display:flex;align-items:center;justify-content:center;animation:sIn .3s ease}' +
      '@keyframes sIn{from{opacity:0}to{opacity:1}}' +
      '.session-popup-box{background:#fff;border-radius:24px;padding:32px 28px;max-width:380px;width:90%;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,.25);border:1px solid #e2e8f0;animation:sPop .4s cubic-bezier(.4,0,.2,1);font-family:Manrope,-apple-system,sans-serif}' +
      '@keyframes sPop{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}' +
      '.session-popup-icon{font-size:56px;margin-bottom:16px}' +
      '.session-popup-title{font-size:20px;font-weight:800;color:#1e293b;margin-bottom:8px}' +
      '.session-popup-text{font-size:14px;color:#64748b;line-height:1.6;margin-bottom:24px}' +
      '.session-popup-btn{padding:12px 28px;border-radius:999px;border:none;font-family:Manrope,-apple-system,sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:.2s;margin:0 6px}' +
      '.session-popup-btn:active{transform:scale(.97)}' +
      '.session-btn-primary{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}' +
      '.session-btn-primary:hover{box-shadow:0 4px 12px rgba(102,126,234,.3)}' +
      '.session-btn-secondary{background:#f1f5f9;color:#475569;border:1px solid #e2e8f0}' +
      '.session-btn-secondary:hover{background:#e2e8f0}';
    document.head.appendChild(s);
  }

  // ── Popups ───────────────────────────────────────────────────────
  function showMinTimePopup() {
    if (document.getElementById('session-min-popup')) return;
    injectStyles();
    var total = getTotalTime();
    var mins = Math.floor(total / 60);
    var ov = document.createElement('div');
    ov.id = 'session-min-popup';
    ov.className = 'session-popup-overlay';
    ov.innerHTML =
      '<div class="session-popup-box">' +
        '<div class="session-popup-icon">⏱️</div>' +
        '<div class="session-popup-title">Not yet!</div>' +
        '<div class="session-popup-text">' +
          "You've only been here for " + mins + " minute" + (mins !== 1 ? 's' : '') + '. ' +
          'Try to spend at least one hour learning today.' +
        '</div>' +
        '<div>' +
          '<button class="session-popup-btn session-btn-primary" onclick="document.getElementById(\'session-min-popup\').remove()">Stay & Continue</button>' +
          '<button class="session-popup-btn session-btn-secondary" onclick="window._sessionAllowLeave()">Leave Anyway</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
  }

  function showMaxTimePopup() {
    if (document.getElementById('session-max-popup')) return;
    injectStyles();
    var total = getTotalTime();
    var hrs = Math.floor(total / 3600);
    var mins = Math.floor((total % 3600) / 60);
    var ov = document.createElement('div');
    ov.id = 'session-max-popup';
    ov.className = 'session-popup-overlay';
    ov.innerHTML =
      '<div class="session-popup-box">' +
        '<div class="session-popup-icon">🌿</div>' +
        '<div class="session-popup-title">Time for a break!</div>' +
        '<div class="session-popup-text">' +
          "You've been studying for " + hrs + " hour" + (hrs !== 1 ? 's' : '') + ' ' +
          mins + " minute" + (mins !== 1 ? 's' : '') + ". That's amazing dedication!" +
          '<br><br>But remember: balance is key. Go outside. Talk to friends. ' +
          'The platform will be here when you get back.' +
        '</div>' +
        '<div>' +
          '<button class="session-popup-btn session-btn-primary" onclick="document.getElementById(\'session-max-popup\').remove()">I\'ll Take a Break</button>' +
          '<button class="session-popup-btn session-btn-secondary" onclick="document.getElementById(\'session-max-popup\').remove()">Keep Going</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
  }

  // ── Allow leave (called from popup button) ───────────────────────
  window._sessionAllowLeave = function() {
    var popup = document.getElementById('session-min-popup');
    if (popup) popup.remove();
    saveSessionTime();
    logEarlyExit();
    popupShown = true;
  };

  // ── Same-origin check ────────────────────────────────────────────
  function isSameOrigin(href) {
    try {
      var url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  // ── Click handler: the ONLY place we decide to block or allow ────
  function onClick(e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    // Internal navigation — save time, set flag, let it through
    if (isSameOrigin(href)) {
      navigatingInternally = true;
      saveSessionTime();
      return; // don't prevent default — navigation happens
    }

    // External navigation — check minimum time
    if (!popupShown) {
      var total = getTotalTime();
      if (total < MIN_TIME) {
        e.preventDefault();
        e.stopPropagation();
        showMinTimePopup();
        logEarlyExit();
        popupShown = true;
      } else {
        saveSessionTime();
      }
    }
  }

  // ── beforeunload: ONLY for tab close / browser-level navigation ──
  function onBeforeUnload(e) {
    // Skip if we already know it's internal navigation
    if (navigatingInternally) return;
    if (popupShown) return;

    var total = getTotalTime();
    if (total < MIN_TIME) {
      saveSessionTime();
      logEarlyExit();
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
    saveSessionTime();
  }

  // ── Periodic max-time warning ────────────────────────────────────
  function periodicCheck() {
    var total = getTotalTime();
    if (total >= MAX_TIME) {
      var since = total - lastWarningTime;
      if (since >= WARNING_INTERVAL || lastWarningTime === 0) {
        showMaxTimePopup();
        lastWarningTime = total;
      }
    }
  }

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    checkEarlyExitYesterday();
    document.addEventListener('click', onClick, true);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', function() { saveSessionTime(); });
    setInterval(periodicCheck, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
