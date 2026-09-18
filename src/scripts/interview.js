const API_BASE=(window.SHOP_API||'/tusk').replace(/\/+$/,'');
let sessionId=null,currentIdx=0,totalQ=0,isProcessing=false,autoScrolling=false,timerInterval=null,timeLeft=0;
const TIME_PER_QUESTION=120;

function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.className='toast show error';setTimeout(()=>{t.className='toast'},4000)}
function getAreaClass(a){if(!a)return'python';const l=a.toLowerCase();if(l.includes('python')||l.includes('fastapi'))return'python';if(l.includes('concur')||l.includes('optim'))return'concurrency';if(l.includes('react'))return'react';if(l.includes('sql'))return'sql';return'python'}
function scrollChat(){const b=document.getElementById('chatBox');if(b&&!autoScrolling){autoScrolling=true;requestAnimationFrame(()=>{b.scrollTop=b.scrollHeight;autoScrolling=false})}}

function addMessage(role,text,extra){
  const box=document.getElementById('chatBox'),div=document.createElement('div');
  div.className='msg'+(role==='user'?' user-msg':'');
  const av=document.createElement('div');av.className='msg-avatar '+role;av.textContent=role==='ai'?'AI':'U';div.appendChild(av);
  const bub=document.createElement('div');bub.className='msg-bubble';
  if(extra&&extra.area){const t=document.createElement('span');t.className='area-tag '+getAreaClass(extra.area);t.textContent=extra.area;bub.appendChild(t)}
  const p=document.createElement('div');p.textContent=text;bub.appendChild(p);
  if(extra&&extra.evaluation){const ed=document.createElement('div');ed.className='eval-section';const s=extra.score||0;const b=document.createElement('span');b.className='eval-badge '+(s>=8?'good':s>=5?'ok':'needs-work');b.textContent='Score: '+s+'/10';ed.appendChild(b);const ep=document.createElement('p');ep.className='eval-text';ep.textContent=extra.evaluation;ed.appendChild(ep);if(extra.tip){const tp=document.createElement('p');tp.className='eval-tip';tp.textContent='💡 '+extra.tip;ed.appendChild(tp)}bub.appendChild(ed)}
  div.appendChild(bub);box.appendChild(div);scrollChat();
}

function showTyping(){const b=document.getElementById('chatBox'),d=document.createElement('div');d.className='typing';d.id='typingIndicator';for(let i=0;i<3;i++){const dot=document.createElement('div');dot.className='typing-dot';d.appendChild(dot)}const l=document.createElement('span');l.textContent='AI recruiter is thinking...';l.style.marginLeft='4px';d.appendChild(l);b.appendChild(d);scrollChat()}
function hideTyping(){const e=document.getElementById('typingIndicator');if(e)e.remove()}

async function startInterview(){const btn=document.getElementById('startBtn');btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Starting...';try{const r=await fetch(API_BASE+'/interview/start',{method:'POST'});if(!r.ok)throw new Error('Server error: '+r.status);const d=await r.json();sessionId=d.session_id;currentIdx=0;totalQ=d.total;document.getElementById('startScreen').style.display='none';document.getElementById('interviewView').style.display='block';document.getElementById('inputArea').style.display='flex';updateProgress(0,totalQ);addMessage('ai',d.question,{area:d.area});enableInput(true)}catch(e){btn.disabled=false;btn.textContent='Start Interview';showToast('Failed: '+e.message)}}

function updateProgress(i,t){document.getElementById('progressLabel').textContent='Question '+(i+1)+' of '+t;document.getElementById('progressFill').style.width=Math.min((i/t*100),100)+'%'}
function stopTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null}}
function startTimer(){stopTimer();timeLeft=TIME_PER_QUESTION;updateTimerDisplay();timerInterval=setInterval(()=>{timeLeft--;updateTimerDisplay();if(timeLeft<=0){stopTimer();autoSubmitOnTimeout()}},1000)}
function updateTimerDisplay(){const r=document.getElementById('timerRing'),t=document.getElementById('timerText');const m=Math.floor(timeLeft/60),s=timeLeft%60;r.textContent=timeLeft;t.textContent=m+':'+(s<10?'0':'')+s+' remaining';r.className='timer-ring';if(timeLeft<=15){r.classList.add('danger');t.style.color='#ef4444'}else if(timeLeft<=30){r.classList.add('warn');t.style.color='#d97706'}else t.style.color=''}
function autoSubmitOnTimeout(){if(isProcessing)return;const i=document.getElementById('answerInput');if(i.value.trim())submitAnswer();else{i.value='(no answer)';submitAnswer()}}
function enableInput(e){document.getElementById('answerInput').disabled=!e;document.getElementById('sendBtn').disabled=!e;if(e){document.getElementById('answerInput').focus();startTimer()}else stopTimer()}

async function submitAnswer(){if(isProcessing)return;const i=document.getElementById('answerInput'),a=i.value.trim();if(!a)return;isProcessing=true;stopTimer();document.getElementById('answerInput').disabled=true;document.getElementById('sendBtn').disabled=true;addMessage('user',a);i.value='';showTyping();try{const r=await fetch(API_BASE+'/interview/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:sessionId,answer:a})});if(!r.ok)throw new Error('Server error: '+r.status);const d=await r.json();hideTyping();if(d.status==='completed'){addMessage('ai','Thank you! That was the final question. Generating your summary...');showTyping();const sr=await fetch(API_BASE+'/interview/'+sessionId);const s=await sr.json();hideTyping();document.getElementById('interviewView').style.display='none';document.getElementById('inputArea').style.display='none';showResults(s);return}addMessage('ai',d.question,{area:d.area,evaluation:d.evaluation,score:d.score,tip:d.tip});currentIdx=d.index;updateProgress(currentIdx,d.total);isProcessing=false;enableInput(true)}catch(e){hideTyping();showToast('Failed: '+e.message);isProcessing=false}}

function showResults(s){const c=document.getElementById('resultCard');c.style.display='block';const ans=s.answers||[],as={};for(const a of ans){if(!as[a.area])as[a.area]=[];as[a.area].push(a.score||0)}const g=document.getElementById('scoreGrid');g.innerHTML='';for(const[area,scores]of Object.entries(as)){const avg=(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1);const d=document.createElement('div');d.className='score-item';d.innerHTML='<div class="label">'+area+'</div><div class="value" style="color:'+(parseFloat(avg)>=7?'#166534':parseFloat(avg)>=5?'#9a3412':'#991b1b')+'">'+avg+'/10</div>';g.appendChild(d)}const ov=ans.reduce((a,b)=>a+(b.score||0),0)/(ans.length||1);document.getElementById('resultSub').textContent='Overall: '+ov.toFixed(1)+'/10 — '+(ov>=8?'Strong performance':ov>=6?'Solid showing':ov>=4?'Room for growth':'Needs improvement');document.getElementById('summaryText').textContent=s.summary||'Your interview results have been recorded.';c.scrollIntoView({behavior:'smooth'})}

document.addEventListener('DOMContentLoaded',function(){document.getElementById('answerInput').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitAnswer()}});document.getElementById('sendBtn').addEventListener('click',submitAnswer)});
function toggleNav(){document.getElementById('navLinks').classList.toggle('open')}