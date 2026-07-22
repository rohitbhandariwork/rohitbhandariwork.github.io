/**
 * Session Time Manager
 * Tracks cumulative time across sessions.
 * Shows popup on exit if < 1 hour.
 * Shows warning every 15 min after 6 hours.
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'edu_session_time';
  const MIN_TIME = 60 * 60; // 1 hour in seconds
  const MAX_TIME = 6 * 60 * 60; // 6 hours in seconds
  const WARNING_INTERVAL = 15 * 60; // 15 minutes in seconds

  let sessionStart = Date.now();
  let lastWarningTime = 0;
  let popupShown = false;

  // Load cumulative time from localStorage
  function getStoredData() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (data && typeof data === 'object') return data;
    } catch (e) {}
    return { totalSeconds: 0, lastDate: null, earlyExits: 0 };
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  // Get current total time including this session
  function getTotalTime() {
    const data = getStoredData();
    const today = new Date().toDateString();
    let sessionSeconds = Math.floor((Date.now() - sessionStart) / 1000);
    
    // Reset if new day
    if (data.lastDate !== today) {
      data.totalSeconds = 0;
      data.lastDate = today;
      saveData(data);
    }
    
    return data.totalSeconds + sessionSeconds;
  }

  // Log early exit
  function logEarlyExit() {
    const data = getStoredData();
    data.earlyExits = (data.earlyExits || 0) + 1;
    data.lastEarlyExit = new Date().toDateString();
    saveData(data);
  }

  // Check if user left early yesterday
  function checkEarlyExit() {
    const data = getStoredData();
    const today = new Date().toDateString();
    if (data.lastEarlyExit === today && data.earlyExits > 0) {
      showEarlyExitMessage();
    }
  }

  function showEarlyExitMessage() {
    const existing = document.getElementById('early-exit-banner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.id = 'early-exit-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(239, 68, 68, 0.12);
        color: #dc2626;
        border: 1px solid rgba(239, 68, 68, 0.2);
        padding: 10px 20px;
        border-radius: 999px;
        font-family: 'Manrope', -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 600;
        z-index: 99999;
        animation: fadeInBanner .3s ease;
        cursor: pointer;
      ">
        ⚠️ You left early yesterday. Try to stay for at least 1 hour today!
      </div>
      <style>
        @keyframes fadeInBanner { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      </style>
    `;
    banner.onclick = () => banner.remove();
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 8000);
  }

  // Create popup styles
  function injectStyles() {
    if (document.getElementById('session-time-styles')) return;
    const style = document.createElement('style');
    style.id = 'session-time-styles';
    style.textContent = `
      .session-popup-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 200000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: sessionFadeIn .3s ease;
      }
      @keyframes sessionFadeIn { from { opacity: 0; } to { opacity: 1; } }
      .session-popup-box {
        background: #fff;
        border-radius: 24px;
        padding: 32px 28px;
        max-width: 380px;
        width: 90%;
        text-align: center;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        border: 1px solid #e2e8f0;
        animation: sessionPopIn .4s cubic-bezier(.4, 0, .2, 1);
        font-family: 'Manrope', -apple-system, sans-serif;
      }
      @keyframes sessionPopIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .session-popup-icon { font-size: 56px; margin-bottom: 16px; }
      .session-popup-title { font-size: 20px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
      .session-popup-text { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
      .session-popup-btn {
        padding: 12px 28px;
        border-radius: 999px;
        border: none;
        font-family: 'Manrope', -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: .2s;
        margin: 0 6px;
      }
      .session-popup-btn:active { transform: scale(0.97); }
      .session-btn-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: #fff;
      }
      .session-btn-primary:hover { box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
      .session-btn-secondary {
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
      }
      .session-btn-secondary:hover { background: #e2e8f0; }
    `;
    document.head.appendChild(style);
  }

  // Show minimum time popup
  function showMinTimePopup() {
    if (document.getElementById('session-min-popup')) return;
    injectStyles();

    const totalTime = getTotalTime();
    const minutes = Math.floor(totalTime / 60);
    
    const overlay = document.createElement('div');
    overlay.id = 'session-min-popup';
    overlay.className = 'session-popup-overlay';
    overlay.innerHTML = `
      <div class="session-popup-box">
        <div class="session-popup-icon">⏱️</div>
        <div class="session-popup-title">Not yet!</div>
        <div class="session-popup-text">
          You've only been here for ${minutes} minute${minutes !== 1 ? 's' : ''}. 
          Try to spend at least one hour learning today.
        </div>
        <div>
          <button class="session-popup-btn session-btn-primary" onclick="document.getElementById('session-min-popup').remove()">
            Stay & Continue
          </button>
          <button class="session-popup-btn session-btn-secondary" onclick="allowLeave()">
            Leave Anyway
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Show max time warning
  function showMaxTimePopup() {
    if (document.getElementById('session-max-popup')) return;
    injectStyles();

    const totalTime = getTotalTime();
    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime % 3600) / 60);
    
    const overlay = document.createElement('div');
    overlay.id = 'session-max-popup';
    overlay.className = 'session-popup-overlay';
    overlay.innerHTML = `
      <div class="session-popup-box">
        <div class="session-popup-icon">🌿</div>
        <div class="session-popup-title">Time for a break!</div>
        <div class="session-popup-text">
          You've been studying for ${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}. 
          That's amazing dedication!
          <br><br>
          But remember: balance is key. Go outside. Talk to friends. 
          The platform will be here when you get back.
        </div>
        <div>
          <button class="session-popup-btn session-btn-primary" onclick="document.getElementById('session-max-popup').remove()">
            I'll Take a Break
          </button>
          <button class="session-popup-btn session-btn-secondary" onclick="document.getElementById('session-max-popup').remove()">
            Keep Going
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Allow navigation
  window.allowLeave = function() {
    const popup = document.getElementById('session-min-popup');
    if (popup) popup.remove();
    const totalSeconds = Math.floor((Date.now() - sessionStart) / 1000);
    const data = getStoredData();
    const today = new Date().toDateString();
    if (data.lastDate !== today) {
      data.totalSeconds = totalSeconds;
      data.lastDate = today;
    } else {
      data.totalSeconds += totalSeconds;
    }
    saveData(data);
    sessionStart = Date.now();
  };

  // Save time before leaving
  function saveSessionTime() {
    const totalSeconds = Math.floor((Date.now() - sessionStart) / 1000);
    const data = getStoredData();
    const today = new Date().toDateString();
    if (data.lastDate !== today) {
      data.totalSeconds = totalSeconds;
      data.lastDate = today;
    } else {
      data.totalSeconds += totalSeconds;
    }
    saveData(data);
  }

  // Check on exit attempt
  function onExitAttempt(e) {
    const totalTime = getTotalTime();
    
    if (totalTime < MIN_TIME && !popupShown) {
      e.preventDefault();
      e.returnValue = '';
      showMinTimePopup();
      logEarlyExit();
      popupShown = true;
      return '';
    }
    
    saveSessionTime();
  }

  // Periodic check for max time warnings
  function periodicCheck() {
    const totalTime = getTotalTime();
    
    if (totalTime >= MAX_TIME) {
      const timeSinceLastWarning = totalTime - lastWarningTime;
      if (timeSinceLastWarning >= WARNING_INTERVAL || lastWarningTime === 0) {
        showMaxTimePopup();
        lastWarningTime = totalTime;
      }
    }
  }

  // Initialize
  function init() {
    checkEarlyExit();
    window.addEventListener('beforeunload', onExitAttempt);
    window.addEventListener('pagehide', saveSessionTime);
    setInterval(periodicCheck, 30000); // Check every 30 seconds
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();