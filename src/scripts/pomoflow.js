let audioCtx;
function getCtx(){if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;audioCtx=new C();if(audioCtx.state==='suspended')audioCtx.resume()}return audioCtx}
function ensureAudio(){const c=getCtx();if(c.state==='suspended')c.resume();return c}
function tone(f,d,t,g){try{const c=ensureAudio(),o=c.createOscillator(),a=c.createGain();o.type=t||'sine';o.frequency.value=f;a.gain.setValueAtTime(g||.15,c.currentTime);a.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.connect(a);a.connect(c.destination);o.start();o.stop(c.currentTime+d)}catch(e){}}
function melody(notes){try{const c=ensureAudio();notes.forEach(([f,s,d,t,g])=>{const o=c.createOscillator(),a=c.createGain();o.type=t||'sine';o.frequency.value=f;a.gain.setValueAtTime(g||.12,c.currentTime+s);a.gain.exponentialRampToValueAtTime(.001,c.currentTime+s+d);o.connect(a);a.connect(c.destination);o.start(c.currentTime+s);o.stop(c.currentTime+s+d)})}catch(e){}}
function rain(dur){try{const c=ensureAudio(),buf=c.createBuffer(1,c.sampleRate*dur,c.sampleRate),dta=buf.getChannelData(0);for(let i=0;i<dta.length;i++)dta[i]=Math.random()*2-1;if(soothingNoise){soothingNoise.stop();soothingNoise=null}const src=c.createBufferSource();src.buffer=buf;const g=c.createGain();g.gain.setValueAtTime(.04,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=2000;f.Q.value=.5;src.connect(f);f.connect(g);g.connect(c.destination);src.start();src.stop(c.currentTime+dur);soothingNoise=src}catch(e){}}
const SND={
  click:()=>tone(1200,.04,'sine',.04),
  start:()=>melody([[523.25,0,.1,'sine',.1],[659.25,.08,.1,'sine',.1],[783.99,.16,.15,'sine',.1]]),
  pause:()=>melody([[659.25,0,.08,'sine',.08],[523.25,.08,.12,'sine',.08]]),
  complete:()=>melody([[523.25,0,.1,'sine',.1],[659.25,.1,.1,'sine',.1],[783.99,.2,.1,'sine',.1],[1046.5,.3,.15,'sine',.12],[1318.51,.4,.2,'sine',.12],[1567.98,.5,.35,'sine',.1]]),
  breakStart:()=>melody([[587.33,0,.1,'sine',.08],[783.99,.08,.1,'sine',.08],[1046.5,.16,.15,'sine',.1]]),
  alarm:()=>{for(let i=0;i<3;i++)setTimeout(()=>tone(880,.15,'square',.12),i*250)},
  levelUp:()=>melody([[523.25,0,.1,'square',.06],[659.25,.1,.1,'square',.06],[783.99,.2,.1,'square',.06],[1046.5,.3,.3,'square',.06]]),
  xp:()=>melody([[659.25,0,.1,'sine',.08],[880,.08,.15,'sine',.08]]),
  tick:()=>{}
};

const WORK_DUR=5, WORK_INCREMENT=5, LS_KEY='timer_stats';
let state={phase:'idle',timeLeft:WORK_DUR*60,totalTime:WORK_DUR*60,timerId:null};
let currentFocusDuration=WORK_DUR;
let soundEnabled=true,visualEnabled=true;
let soundMode='ticking', soothingNoise=null;

function loadStats(){try{const d=JSON.parse(localStorage.getItem(LS_KEY));if(d&&typeof d==='object')return d}catch(e){}return{xp:0,level:1,pomodoros:0,streak:0,streak_days:[],best_streak:0,best_focus:0}}
let stats=loadStats();
function saveStats(){try{localStorage.setItem(LS_KEY,JSON.stringify(stats))}catch(e){}}

const TITLES=[{minLevel:1,title:'Focus Beginner'},{minLevel:2,title:'Flow Starter'},{minLevel:4,title:'Concentration Pro'},{minLevel:7,title:'Deep Worker'},{minLevel:10,title:'Focus Master'},{minLevel:15,title:'Unshakeable'}];
function getTitle(level){let t=TITLES[0].title;for(const ti of TITLES){if(level>=ti.minLevel)t=ti.title}return t}
function xpNeeded(level){return level*50}

function showLevelUp(l){const t=getTitle(l);document.getElementById('lvlModalNum').textContent=l;document.getElementById('lvlModalTitle').textContent=t;document.getElementById('lvlModalDesc').textContent='You reached '+t+'! Keep building your focus streak.';document.getElementById('lvlModal').classList.add('open')}
function closeLvlModal(){document.getElementById('lvlModal').classList.remove('open')}

function addXP(amount){stats.xp+=amount;while(stats.xp>=xpNeeded(stats.level)){stats.xp-=xpNeeded(stats.level);stats.level++;SND.levelUp();spawnConfetti(40);showLevelUp(stats.level)}updateStatsUI();saveStats()}

function updateStatsUI(){
  const l=stats.level,xpL=stats.xp,need=xpNeeded(l),pct=Math.min(100,(xpL/need)*100);
  document.getElementById('lvlNum').textContent=l;
  document.getElementById('xpDisplay').textContent=xpL+' / '+need+' XP';
  document.getElementById('xpBar').style.width=pct+'%';
  document.getElementById('rankTitle').textContent=getTitle(l);
  document.getElementById('pomodoroCount').textContent=stats.pomodoros;
  document.getElementById('streakNum').textContent=stats.streak;
  document.getElementById('streakPill').classList.toggle('has-streak',(stats.streak||0)>0);
  document.getElementById('bestFocusDisplay').textContent=stats.best_focus||0;
  const chips=document.getElementById('daysChips');chips.innerHTML='';
  const days=stats.streak_days||[],today=new Date().toISOString().slice(0,10);
  for(let i=6;i>=0;i--){const d=new Date(Date.now()-i*86400000),ds=d.toISOString().slice(0,10),c=document.createElement('div');c.className='day-chip';if(days.includes(ds))c.classList.add('done');if(ds===today&&days.includes(ds))c.classList.add('today');if(!days.includes(ds)&&ds<today)c.classList.add('missed');c.textContent=['S','M','T','W','T','F','S'][d.getDay()];chips.appendChild(c)}
}

function updateStreak(){const today=new Date().toISOString().slice(0,10),days=stats.streak_days||[];if(!days.includes(today)){days.push(today);stats.streak_days=days;let streak=0;const d=new Date();while(true){const ds=d.toISOString().slice(0,10);if(days.includes(ds)){streak++;d.setDate(d.getDate()-1)}else break}stats.streak=streak;if(streak>stats.best_streak)stats.best_streak=streak;saveStats();updateStatsUI()}}

const CIRCUMFERENCE=2*Math.PI*44;
let endTime=null,lastTickSec=-1;

function updateRing(progress){const offset=CIRCUMFERENCE*(1-Math.min(1,Math.max(0,progress)));document.getElementById('timerRing').style.strokeDashoffset=offset}
function formatTime(secs){const m=Math.floor(secs/60),s=Math.floor(secs%60);return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}

function updateDisplay(){
  const phaseEl=document.getElementById('timerPhase'),ring=document.getElementById('timerRing');
  if(state.phase==='break'){phaseEl.textContent='☕ BREAK';phaseEl.className='timer-phase break';ring.style.stroke='#059669';document.getElementById('timerDisplay').textContent='Relax';document.getElementById('curDurDisplay').textContent=currentFocusDuration}
  else{phaseEl.textContent='FOCUS';phaseEl.className='timer-phase focus';ring.style.stroke='';document.getElementById('timerDisplay').textContent=formatTime(state.timeLeft);document.getElementById('curDurDisplay').textContent=currentFocusDuration}
  updateRing(state.totalTime>0?state.timeLeft/state.totalTime:0)
}

function flashScreen(cls){if(!visualEnabled)return;const ov=document.getElementById('flashOverlay');ov.className='flash-overlay show '+cls;setTimeout(()=>ov.className='flash-overlay',500)}
function spawnConfetti(count){if(!visualEnabled)return;const c=document.getElementById('confettiContainer'),colors=['#f59e0b','#ec4899','#22c55e','#3b82f6','#a855f7','#ef4444','#14b8a6'];for(let i=0;i<count;i++){const el=document.createElement('div');el.className='confetti-piece';el.style.left=Math.random()*100+'%';el.style.background=colors[Math.floor(Math.random()*colors.length)];el.style.width=(4+Math.random()*6)+'px';el.style.height=(4+Math.random()*6)+'px';el.style.borderRadius=Math.random()>.5?'50%':'2px';el.style.animationDuration=(1.5+Math.random()*1.5)+'s';el.style.animationDelay=Math.random()*.3+'s';c.appendChild(el);setTimeout(()=>el.remove(),3000)}}
function spawnFloat(text,color){const el=document.createElement('div');el.className='float-xp';el.textContent=text;el.style.color=color||'#f59e0b';el.style.left=(20+Math.random()*60)+'%';el.style.top=(30+Math.random()*40)+'%';document.body.appendChild(el);setTimeout(()=>el.remove(),1400)}

let toastTimer;
function showToast(msg,type){const t=document.getElementById('toast');t.textContent=msg;t.className='toast show '+(type||'success');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.className='toast',2500)}

function showControls(){
  ['startBtn','pauseBtn','endBreakBtn','interruptBtn'].forEach(id=>document.getElementById(id).style.display='none');
  if(state.phase==='break')document.getElementById('endBreakBtn').style.display='flex';
  else if(state.phase==='idle')document.getElementById('startBtn').style.display='flex';
  else if(state.phase==='running'){document.getElementById('pauseBtn').style.display='flex';document.getElementById('interruptBtn').style.display='flex'}
  else if(state.phase==='paused'){document.getElementById('startBtn').style.display='flex';document.getElementById('startBtn').textContent='▶ Resume';document.getElementById('interruptBtn').style.display='flex'}
}

function tick(){const remaining=Math.max(0,(endTime-Date.now())/1000);state.timeLeft=remaining;const curSec=Math.floor(remaining);if(curSec!==lastTickSec&&curSec<state.totalTime&&soundEnabled){lastTickSec=curSec;if(soundMode==='ticking')tone(1200,.02,'sine',.035)}updateDisplay();if(remaining<=0){clearInterval(state.timerId);state.timerId=null;if(soothingNoise){soothingNoise.stop();soothingNoise=null}focusComplete()}}

function startTimer(){if(state.timerId)return;state.phase='running';endTime=Date.now()+state.timeLeft*1000;lastTickSec=Math.ceil(state.timeLeft);state.timerId=setInterval(tick,100);showControls();if(soundEnabled){SND.start();if(soundMode==='soothing')rain(9999)}updateDisplay()}

document.addEventListener('visibilitychange',()=>{if(document.hidden||state.phase!=='running'||endTime===null)return;const remaining=Math.max(0,(endTime-Date.now())/1000);state.timeLeft=remaining;if(remaining<=0){clearInterval(state.timerId);state.timerId=null;focusComplete()}else updateDisplay()});

function pauseTimer(){if(!state.timerId)return;clearInterval(state.timerId);state.timerId=null;state.timeLeft=Math.max(0,(endTime-Date.now())/1000);endTime=null;lastTickSec=-1;state.phase='paused';showControls();if(soundEnabled)SND.pause();if(soothingNoise){soothingNoise.stop();soothingNoise=null}}

function focusComplete(){if(soothingNoise){soothingNoise.stop();soothingNoise=null}stats.pomodoros++;if(currentFocusDuration>stats.best_focus)stats.best_focus=currentFocusDuration;addXP(10);updateStreak();flashScreen('flash-complete');spawnConfetti(40);spawnFloat('+10 XP','#7c3aed');if(soundEnabled){SND.complete();setTimeout(()=>SND.alarm(),800)}showToast('🎉 Focus complete! +10 XP','success');currentFocusDuration+=WORK_INCREMENT;state.phase='break';showControls();updateDisplay();saveStats();updateStatsUI()}

function interruptTimer(){if(state.timerId){clearInterval(state.timerId);state.timerId=null}if(soothingNoise){soothingNoise.stop();soothingNoise=null}endTime=null;lastTickSec=-1;addXP(10);spawnFloat('+10 XP Interrupted','#ef4444');flashScreen('flash-red');if(soundEnabled)SND.pause();showToast('⛔ Interrupted — +10 XP, reset to '+WORK_DUR+' min','warning');currentFocusDuration=WORK_DUR;state.timeLeft=WORK_DUR*60;state.totalTime=WORK_DUR*60;state.phase='idle';state.timerId=null;showControls();updateDisplay();updateStatsUI()}

function endBreak(){if(soundEnabled){try{getCtx().resume()}catch(e){}SND.breakStart()}spawnFloat('+5 XP','#059669');showToast('✨ Break over! Ready for '+currentFocusDuration+' min','info');addXP(5);state.timeLeft=currentFocusDuration*60;state.totalTime=currentFocusDuration*60;state.phase='idle';state.timerId=null;endTime=null;lastTickSec=-1;showControls();updateDisplay()}

function toggleSound(){soundEnabled=!soundEnabled;document.getElementById('soundToggle').classList.toggle('active');document.getElementById('soundToggle').textContent=soundEnabled?'🔊 Sound':'🔇 Mute';if(soundEnabled)SND.click()}
function setSoundMode(mode){if(soothingNoise){soothingNoise.stop();soothingNoise=null}soundMode=mode;soundEnabled=mode!=='silent';document.querySelectorAll('.sound-mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));const st=document.getElementById('soundToggle');if(st){st.textContent=soundEnabled?'🔊 Sound':'🔇 Mute';st.classList.toggle('active',soundEnabled)}if(mode==='soothing'&&state.phase==='running')rain(9999);if(soundEnabled)SND.click()}
function toggleVisual(){visualEnabled=!visualEnabled;document.getElementById('visualToggle').classList.toggle('active');document.getElementById('visualToggle').textContent=visualEnabled?'✨ Effects':'🚫 No FX';if(soundEnabled)SND.click()}
function toggleNav(){document.getElementById('navLinks').classList.toggle('open')}

function openInstructions(){document.getElementById('instructionsModal').classList.add('open')}
function closeInstructions(){document.getElementById('instructionsModal').classList.remove('open')}

window.toggleSound=toggleSound;window.toggleVisual=toggleVisual;window.setSoundMode=setSoundMode;
window.startTimer=startTimer;window.pauseTimer=pauseTimer;window.endBreak=endBreak;window.interruptTimer=interruptTimer;
window.openInstructions=openInstructions;window.closeInstructions=closeInstructions;window.closeLvlModal=closeLvlModal;

function initAudio(){const c=getCtx();if(c&&c.state==='suspended')c.resume();return c}
document.addEventListener('click',initAudio,{once:true});
document.addEventListener('touchstart',initAudio,{once:true});
currentFocusDuration=WORK_DUR;state.timeLeft=WORK_DUR*60;state.totalTime=WORK_DUR*60;state.phase='idle';state.timerId=null;
showControls();updateDisplay();updateStatsUI();
document.querySelectorAll('.sound-mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===soundMode));