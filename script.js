<script>
/* ══ CUSTOM CURSOR ══ */
const cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function animCur(){cx+=(mx-cx)*0.14;cy+=(my-cy)*0.14;cur2.style.left=cx+'px';cur2.style.top=cy+'px';requestAnimationFrame(animCur);})();

/* ══ BG PARTICLE CANVAS ══ */
(function(){
  const c=document.getElementById('bgCanvas'),ctx=c.getContext('2d');
  let W,H,pts=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  for(let i=0;i<80;i++) pts.push({x:Math.random()*1920,y:Math.random()*1080,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*2+.5,a:Math.random()*.5+.15});
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(123,79,30,${p.a})`;ctx.fill();
    });
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      let dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);
      if(d<100){ctx.beginPath();ctx.strokeStyle=`rgba(123,79,30,${.05*(1-d/100)})`;ctx.lineWidth=.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══ HERO ABSTRACT ANIMATION ══ */
(function(){
  const cv=document.getElementById('heroCanvas');
  if(!cv) return;
  const ctx=cv.getContext('2d');
  let W,H,t=0,mouse={x:0,y:0};

  function resize(){
    const rect=cv.parentElement.getBoundingClientRect();
    W=cv.width=rect.width||480;H=cv.height=rect.height||460;
    mouse.x=W/2;mouse.y=H/2;
  }
  resize();
  window.addEventListener('resize',resize);
  cv.parentElement.addEventListener('mousemove',e=>{
    const r=cv.getBoundingClientRect();
    mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;
  });

  /* ── morphing blob rings ── */
  function blob(cx,cy,baseR,points,phase,t,color,alpha){
    ctx.beginPath();
    for(let i=0;i<=points;i++){
      const angle=(i/points)*Math.PI*2;
      const wobble=Math.sin(angle*3+t*0.9+phase)*18+Math.sin(angle*5+t*0.6+phase)*10;
      const r=baseR+wobble;
      const x=cx+Math.cos(angle)*r;
      const y=cy+Math.sin(angle)*r;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.lineWidth=1.5;ctx.stroke();
    ctx.globalAlpha=1;
  }

  /* ── orbiting nodes ── */
  const nodes=Array.from({length:8},(_,i)=>({
    angle:(i/8)*Math.PI*2,
    speed:0.004+Math.random()*0.006,
    orbitR:90+Math.random()*60,
    r:4+Math.random()*5,
    phase:Math.random()*Math.PI*2
  }));

  /* ── flowing lines ── */
  const lines=Array.from({length:12},(_,i)=>({
    angle:(i/12)*Math.PI*2,
    speed:0.003+Math.random()*0.004,
    len:60+Math.random()*80,
    offset:Math.random()*Math.PI*2
  }));

  function draw(){
    ctx.clearRect(0,0,W,H);
    t+=0.016;
    const cx=W/2+(mouse.x-W/2)*0.06;
    const cy=H/2+(mouse.y-H/2)*0.06;

    /* outer glow ring */
    const grad=ctx.createRadialGradient(cx,cy,60,cx,cy,200);
    grad.addColorStop(0,'rgba(154,100,40,0.12)');
    grad.addColorStop(0.5,'rgba(123,79,30,0.06)');
    grad.addColorStop(1,'rgba(123,79,30,0)');
    ctx.beginPath();ctx.arc(cx,cy,200,0,Math.PI*2);
    ctx.fillStyle=grad;ctx.fill();

    /* morphing blob rings */
    blob(cx,cy,130,80,0,t,'rgba(123,79,30,0.55)',0.7);
    blob(cx,cy,100,80,1.2,t*1.3,'rgba(154,100,40,0.45)',0.6);
    blob(cx,cy,68,80,2.4,t*0.8,'rgba(184,125,53,0.35)',0.55);

    /* inner pulsing core */
    const coreR=22+Math.sin(t*2)*5;
    const coreGrad=ctx.createRadialGradient(cx,cy,0,cx,cy,coreR*2);
    coreGrad.addColorStop(0,'rgba(184,125,53,0.9)');
    coreGrad.addColorStop(0.5,'rgba(154,100,40,0.4)');
    coreGrad.addColorStop(1,'rgba(123,79,30,0)');
    ctx.beginPath();ctx.arc(cx,cy,coreR*2,0,Math.PI*2);
    ctx.fillStyle=coreGrad;ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,coreR,0,Math.PI*2);
    ctx.fillStyle='rgba(184,125,53,0.85)';ctx.fill();
    ctx.beginPath();ctx.arc(cx-coreR*.3,cy-coreR*.3,coreR*.3,0,Math.PI*2);
    ctx.fillStyle='rgba(255,240,210,0.5)';ctx.fill();

    /* flowing spoke lines */
    lines.forEach(l=>{
      l.angle+=l.speed;
      const x1=cx+Math.cos(l.angle)*40;
      const y1=cy+Math.sin(l.angle)*40;
      const x2=cx+Math.cos(l.angle+Math.sin(t*.5+l.offset)*.4)*(40+l.len);
      const y2=cy+Math.sin(l.angle+Math.sin(t*.5+l.offset)*.4)*(40+l.len);
      const g=ctx.createLinearGradient(x1,y1,x2,y2);
      g.addColorStop(0,'rgba(154,100,40,0.6)');
      g.addColorStop(1,'rgba(154,100,40,0)');
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
      ctx.strokeStyle=g;ctx.globalAlpha=0.7;ctx.lineWidth=1;ctx.stroke();
      ctx.globalAlpha=1;
    });

    /* orbiting nodes */
    nodes.forEach(n=>{
      n.angle+=n.speed;
      const nx=cx+Math.cos(n.angle)*n.orbitR;
      const ny=cy+Math.sin(n.angle)*n.orbitR;
      const pulse=n.r+Math.sin(t*2+n.phase)*2;
      /* node glow */
      const ng=ctx.createRadialGradient(nx,ny,0,nx,ny,pulse*3);
      ng.addColorStop(0,'rgba(184,125,53,0.6)');ng.addColorStop(1,'rgba(184,125,53,0)');
      ctx.beginPath();ctx.arc(nx,ny,pulse*3,0,Math.PI*2);ctx.fillStyle=ng;ctx.fill();
      /* node dot */
      ctx.beginPath();ctx.arc(nx,ny,pulse,0,Math.PI*2);
      ctx.fillStyle='rgba(154,100,40,0.9)';ctx.fill();
      /* connector to center */
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(nx,ny);
      ctx.strokeStyle='rgba(123,79,30,0.12)';ctx.lineWidth=.8;ctx.stroke();
      /* node-to-node connections */
      nodes.forEach(n2=>{
        const nx2=cx+Math.cos(n2.angle)*n2.orbitR;
        const ny2=cy+Math.sin(n2.angle)*n2.orbitR;
        const d=Math.hypot(nx-nx2,ny-ny2);
        if(d<130&&d>10){
          ctx.beginPath();ctx.moveTo(nx,ny);ctx.lineTo(nx2,ny2);
          ctx.strokeStyle=`rgba(154,100,40,${.18*(1-d/130)})`;ctx.lineWidth=.7;ctx.stroke();
        }
      });
    });

    /* floating text ring */
    const labels=['Scaler','NST','Vedam','NIAT'];
    labels.forEach((l,i)=>{
      const a=(i/4)*Math.PI*2+t*0.08;
      const lx=cx+Math.cos(a)*168;
      const ly=cy+Math.sin(a)*155;
      ctx.font='bold 11px DM Sans,sans-serif';
      ctx.fillStyle=`rgba(123,79,30,${0.55+Math.sin(t+i)*0.2})`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(l,lx,ly);
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══ DATA ══ */
const DATA={
  "Scaler School of Technology":{short:"Scaler",location:"Bengaluru, Karnataka",program:"B.Tech CS & AI + dual degree with BITS Pilani / IIT Madras",fee:"₹28 lakh (full programme)",scholarships:"Merit-based up to 100% waiver based on NSET score",selection:"NSET exam or SAT accepted — JEE not required",highlights:"Learn by building · MAANG mentors · real project-based curriculum from Day 1",placements:"Top recruiters: Google, Amazon, Razorpay · strong MAANG alumni network · dedicated placement cell"},
  "Newton School of Technology":{short:"NST",location:"Sonipat · Pune · Bengaluru · Hyderabad",program:"B.Tech CS & AI — UGC recognised degree",fee:"₹23 lakh total (residential, all-inclusive)",scholarships:"Merit-based scholarships awarded on NSAT performance",selection:"NSAT — Newton School Aptitude Test (own exam, no JEE)",highlights:"Hands-on coding from Week 1 · mentors from Google, Meta, Microsoft · startup culture",placements:"Placement assistance programme · strong focus on product roles · growing recruiter network"},
  "Vedam School of Technology":{short:"Vedam",location:"Pune & Gurugram",program:"B.Tech CS & AI — Residential programme",fee:"₹18 lakh total (one of the most affordable residential options)",scholarships:"Up to 100% merit scholarships + special women-in-tech waiver",selection:"VSAT exam or direct admission for JEE 90%+ scorers",highlights:"AI-first curriculum · MacBook provided on Day 1 · industry practitioners as faculty",placements:"1,028+ students placed · Amazon, Adobe, Microsoft recruiters · internship stipends up to ₹2.8 LPA"},
  "NIAT (NxtWave)":{short:"NIAT",location:"20+ campuses across India",program:"B.Tech CSE / AI & ML streams available",fee:"₹2–4.5 lakh per year (most affordable on the list)",scholarships:"NAT merit waivers up to 100% — no JEE cutoff required",selection:"NAT — NxtWave Aptitude Test (online, accessible)",highlights:"NSDC backed · real-world project tracks · internship stipends from Year 1 · pan-India reach",placements:"Microsoft, Google, Amazon as hiring partners · strong placement support across campuses"}
};
const COLLEGES=Object.keys(DATA);
const QUICK=["Cheapest college","100% scholarships","SAT accepted","Best placements","Compare Scaler vs NIAT","Vedam vs NST","Fees overview"];

function norm(s){return s.toLowerCase().replace(/[^\w\s]/g,' ');}
function findCollege(q){
  let best=null,bs=0;
  for(let n of COLLEGES){
    if(norm(q).includes(DATA[n].short.toLowerCase())) return n;
    let words=norm(n).split(/\s+/).filter(w=>w.length>3);
    let sc=words.filter(w=>norm(q).includes(w)).length/(words.length||1);
    if(sc>bs){bs=sc;best=n;}
  }
  return bs>0.3?best:null;
}

function compareTwo(text){
  let found=COLLEGES.filter(c=>{
    let t=norm(text);
    return t.includes(DATA[c].short.toLowerCase())||t.includes(c.toLowerCase().split('(')[0].trim());
  });
  if(found.length>=2){
    let[a,b]=found,dA=DATA[a],dB=DATA[b];
    let rows=['location','fee','scholarships','selection','placements'].map(f=>
      `<tr><td style="color:var(--br2);font-weight:600;padding:4px 6px 4px 0;">${f.charAt(0).toUpperCase()+f.slice(1)}</td><td style="padding:4px 6px;">${dA[f]}</td><td style="padding:4px 6px;">${dB[f]}</td></tr>`
    ).join('');
    return `<strong>⚖️ ${dA.short} vs ${dB.short}</strong><br><table style="width:100%;margin-top:8px;font-size:0.75rem;border-collapse:collapse;"><tr style="border-bottom:1px solid var(--border);"><th style="padding:4px 6px 4px 0;color:var(--br);">Attribute</th><th style="padding:4px 6px;color:var(--br);">${dA.short}</th><th style="padding:4px 6px;color:var(--br);">${dB.short}</th></tr>${rows}</table><br><span class="tag">🔍 Verify exact figures on official sites</span>`;
  }
  return null;
}

function collegeCard(name){
  const d=DATA[name];
  return `<div style="background:var(--cream2);border:1px solid var(--border);border-radius:18px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,rgba(123,79,30,0.13),rgba(154,100,40,0.06));padding:14px 18px;border-bottom:1px solid var(--border2);display:flex;align-items:center;gap:12px;">
    <div style="width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,var(--br),var(--br2));display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">🎓</div>
    <div><div style="font-weight:700;font-size:0.95rem;color:var(--ink);">${name}</div><div style="font-size:0.72rem;color:var(--muted);margin-top:2px;">📍 ${d.location}</div></div>
  </div>
  <div style="padding:14px 18px;display:flex;flex-direction:column;gap:11px;">
    ${[['📚','Programme',d.program],['💰','Total Fee',d.fee],['🏅','Scholarships',d.scholarships],['✅','Selection / Entrance',d.selection],['⚡','Key Highlights',d.highlights],['💼','Placements',d.placements]].map(([icon,label,val])=>`
    <div style="display:flex;gap:10px;align-items:flex-start;">
      <span style="font-size:1rem;flex-shrink:0;margin-top:1px;">${icon}</span>
      <div><div style="font-size:0.68rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.07em;">${label}</div><div style="font-size:0.82rem;color:var(--ink);margin-top:3px;line-height:1.5;">${val}</div></div>
    </div>`).join('')}
  </div>
  <div style="padding:6px 18px 12px;"><span class="tag">🔍 Verify fees & cutoffs on official site</span></div>
</div>`;
}

function answerQuery(raw){
  const t=raw.trim();
  if(!t) return null;

  /* ── TIME-AWARE GREETING ── */
  const hr=new Date().getHours();
  const tg=hr<12?'Good morning ☀️':hr<17?'Good afternoon 🌤️':hr<21?'Good evening 🌇':'Good night 🌙';

  const greets=[
    [/^(hi+|hii+|helo+|hello+|hey+|hiya|howdy)\b/i,
      ()=>`👋 <strong>${tg}! Welcome to EduAssist Neo.</strong><br><br>I'm your personal AI guide to India's top 4 new-gen tech colleges — <strong>Scaler, NST, Vedam & NIAT</strong>.<br><br>Here's what I can help with:<br>• 💰 Full fees & scholarship details<br>• ⚖️ Side-by-side college comparison<br>• ✅ Entrance tests & SAT eligibility<br>• 💼 Placement stats & top recruiters<br>• 🎤 Live mock interview (switch tab above)<br><br>What would you like to explore first?`],
    [/^good\s*(morning|afternoon|evening|night|day)/i,
      ()=>`${tg} <strong>Great time to plan your future!</strong><br><br>I'm Neo — your AI college advisor for <strong>Scaler · NST · Vedam · NIAT</strong>. Ask me anything about fees, scholarships, placements or entrance tests.`],
    [/^(sup|what'?s\s*up|wassup|yo\b)/i,
      ()=>`😄 <strong>Hey! What's up?</strong><br><br>I'm Neo — drop your question about any of the 4 colleges and I'll give you the full picture instantly!`],
    [/^(namaste|namaskar|jai\s*hind)/i,
      ()=>`🙏 <strong>Namaste! EduAssist Neo mein aapka swagat hai.</strong><br><br>Main aapko <strong>Scaler, NST, Vedam & NIAT</strong> ke baare mein poori jankari de sakta hoon — fees, scholarships, entrance tests & placements. Kya jaanna chahte ho?`],
    [/^(how are you|how r u|how do you do|how'?s it|hows it)/i,
      ()=>`😊 <strong>I'm doing great — always ready to help!</strong><br><br>I'm Neo, your AI advisor for <strong>Scaler, NST, Vedam & NIAT</strong>. What would you like to know today?`],
    [/^(welcome|greetings)/i,
      ()=>`🎉 <strong>Welcome to EduAssist!</strong><br><br>You're in the right place. I'll help you compare India's top 4 new-gen tech colleges — fees, scholarships, entrance tests & placement data, all in one place.`],
    [/^(who are you|what are you|what is neo|tell me about yourself)/i,
      ()=>`🤖 <strong>I'm Neo — EduAssist's AI brain.</strong><br><br>I'm built to guide students through India's top 4 new-gen colleges: <strong>Scaler, Newton School of Technology, Vedam & NIAT</strong>.<br><br>I can compare fees, explain scholarships, show placement data, and even run a full mock interview. Just ask!`],
    [/^(start|begin|let'?s go|get started)/i,
      ()=>`🚀 <strong>Let's go!</strong><br><br>Ask me anything — or try one of these:<br>• <em>"Tell me about Scaler"</em><br>• <em>"Compare Vedam vs NST"</em><br>• <em>"Which college has 100% scholarship?"</em><br>• <em>"SAT accepted where?"</em>`],
    [/^(thanks?|thank you|thx|ty\b|great|awesome|perfect|nice|cool|wow|helpful)/i,
      ()=>`😊 <strong>Happy to help!</strong> Feel free to ask anything else about <strong>Scaler, NST, Vedam or NIAT</strong> — or switch to Mock Interview mode anytime!`],
    [/^(bye|goodbye|see you|cya|tata|take care|ok bye)/i,
      ()=>`👋 <strong>Goodbye!</strong> Best of luck with your college journey. Come back anytime — Neo's always here for you! 🎓`],
  ];
  for(const[re,fn] of greets) if(re.test(t)) return fn();

  /* ── COMPARE ── */
  if(/(compare|versus|vs\.?|difference)/i.test(t)){const c=compareTwo(t);if(c) return c;}

  /* ── FEE RANKING ── */
  if(/cheapest|lowest fee|budget|fees overview|all fees/i.test(t)){
    const sorted=[...COLLEGES].sort((a,b)=>parseInt(DATA[a].fee.match(/\d+/)?.[0]||99)-parseInt(DATA[b].fee.match(/\d+/)?.[0]||99));
    return `💰 <strong>Fee ranking — low to high</strong><br><br>${sorted.map((c,i)=>`<strong>${i+1}. ${DATA[c].short}</strong> — ${DATA[c].fee}`).join('<br><br>')}<br><br><span class="tag">🏅 Scholarships can reduce any of these to ₹0</span>`;
  }

  /* ── SCHOLARSHIPS ── */
  if(/100.?%|full scholarship/i.test(t)){
    const el=COLLEGES.filter(c=>DATA[c].scholarships.toLowerCase().includes('100%'));
    return `🏅 <strong>Colleges offering 100% scholarships</strong><br><br>`+el.map(c=>`<strong>${DATA[c].short}:</strong> ${DATA[c].scholarships}`).join('<br><br>');
  }
  if(/scholarship/i.test(t)){
    return COLLEGES.map(c=>`🏅 <strong>${DATA[c].short}:</strong> ${DATA[c].scholarships}`).join('<br><br>');
  }

  /* ── SAT ── */
  if(/\bsat\b/i.test(t)){
    const sl=COLLEGES.filter(c=>DATA[c].selection.toLowerCase().includes('sat'));
    return `✅ <strong>SAT accepted at:</strong> ${sl.map(c=>DATA[c].short).join(', ')}<br><br>These colleges accept SAT as a valid alternative to JEE — you don't need to appear for JEE at all.`;
  }

  /* ── PLACEMENTS ── */
  if(/placement|recruiter|package|salary|hiring/i.test(t)){
    return `💼 <strong>Placement highlights across all 4</strong><br><br>`+COLLEGES.map(c=>`<strong>${DATA[c].short}:</strong> ${DATA[c].placements}`).join('<br><br>');
  }

  /* ── SINGLE COLLEGE FULL CARD ── */
  const college=findCollege(t);
  if(college) return collegeCard(college);

  return `I specialise in <strong>Scaler, NST, Vedam & NIAT</strong>.<br><br>Try: <em>"Tell me about Vedam"</em> · <em>"Compare NIAT vs NST"</em> · <em>"SAT accepted?"</em>`;
}

/* ══ INTERVIEW ══ */
let mode='a',iStep=0,iScores=[],iQs=[],awaiting=false;
const qBank={
  hr:["Tell us about yourself and why you chose tech?","Describe a real challenge you overcame and what you learned.","Where do you see yourself in 5 years?"],
  tech:["What is the difference between an array and a linked list?","Explain Big O notation with a real example.","What is recursion? Give an example."],
  aptitude:["If 5 workers finish a job in 10 days, how many days for 10 workers?","What's the probability of rolling a 6 twice consecutively on a fair die?","A train travels 300 km at 60 km/h. What's the total time?"]
};
function updateBar(){
  const bar=document.getElementById('ibar');
  if(mode!=='i'){bar.classList.remove('on');return;}
  bar.classList.add('on');
  let pct=iStep===0?0:(iStep-1)/3*100;
  if(iStep>=3)pct=100;
  document.getElementById('fill').style.width=pct+'%';
  document.getElementById('qlabel').innerText=iStep>=3?'Complete ✓':`Question ${iStep} / 3`;
}
async function startInterview(){
  iStep=0;iScores=[];iQs=[];awaiting=false;updateBar();
  addBot(`🎤 <strong>Mock Interview — Premium Simulation</strong><br><br>3 questions: HR, Technical & Problem Solving. Answer naturally, as you would in a real interview.<br><br>Good luck! 🚀`);
  await pause(700);askNext();
}
function askNext(){
  if(iStep>=3){finishInterview();return;}
  iStep++;updateBar();
  const type=iStep===1?'HR':iStep===2?'Technical':'Problem Solving';
  const bank=iStep===1?qBank.hr:iStep===2?qBank.tech:qBank.aptitude;
  const q=bank[Math.floor(Math.random()*bank.length)];
  iQs.push({type,q});
  addBot(`<span style="color:var(--br2);font-weight:700;font-size:0.8rem;letter-spacing:0.05em;text-transform:uppercase;">Q${iStep} / 3 · ${type}</span><br><br>${q}`);
  awaiting=true;
}
function evaluate(ans,type){
  let score=5+(ans.length>120?2:ans.length<30?-1:0);
  const kw=type==='HR'?['team','learn','project','challenge','growth','experience']:type==='Technical'?['data','complexity','function','memory','time','algorithm','structure']:['calculate','steps','probability','result','formula','rate'];
  score+=kw.filter(k=>ans.toLowerCase().includes(k)).length;
  score=Math.min(10,Math.max(1,score));
  const fb=score>=8?'Outstanding — interview-ready! Very clear and structured.':score>=6?'Good answer. Add specific examples or numbers to make it stronger.':'Solid attempt. Focus on structure: situation → action → result.';
  return{score,fb};
}
async function handleAnswer(txt){
  if(!awaiting){addBot('Please wait for the next question.');return;}
  awaiting=false;
  const curr=iQs[iStep-1];
  const{score,fb}=evaluate(txt,curr.type);
  iScores.push(score);
  addBot(`📋 <strong>Feedback — Q${iStep}</strong><br><br>Score: <strong style="color:var(--br);font-size:1.1rem;">${score}/10</strong><br><br>${fb}`);
  if(iStep<3){await pause(1000);askNext();}
  else{await pause(1000);finishInterview();}
}
async function finishInterview(){
  const avg=(iScores.reduce((a,b)=>a+b,0)/3).toFixed(1);
  const grade=avg>=8?'🌟 Elite — Top candidate!':avg>=6?'👍 Solid — Keep refining answers!':'📈 Keep practising — structure is key!';
  addBot(`<div class="score-card"><h3 style="font-family:var(--font-display);color:var(--ink);margin-bottom:8px;">Interview Complete</h3><div class="score-num">${avg}<span style="font-size:1.1rem;color:var(--muted);font-family:var(--font-body)">/10</span></div><p style="color:var(--muted);margin:8px 0 4px;">${grade}</p><button class="retry-btn" onclick="setMode('i')">Try Again</button></div>`);
  iStep=4;updateBar();
}

/* ══ UI HELPERS ══ */
let typDiv=null;
function showTyping(){
  if(typDiv)hideTyping();
  const el=document.createElement('div');el.className='msg bot';el.id='typing';
  el.innerHTML='<div class="av bot">N</div><div class="bubble"><div class="dots"><span></span><span></span><span></span></div></div>';
  document.getElementById('msgs').appendChild(el);typDiv=el;scroll();
}
function hideTyping(){if(typDiv){typDiv.remove();typDiv=null;}}
function addBot(html){addMsg('bot',html);}
function addMsg(role,content){
  const c=document.getElementById('msgs');
  const w=document.getElementById('welcome');if(w)w.remove();
  const d=document.createElement('div');d.className=`msg ${role}`;
  d.innerHTML=`<div class="av ${role==='bot'?'bot':'user'}">${role==='bot'?'N':'U'}</div><div class="bubble">${content}</div>`;
  c.appendChild(d);scroll();
}
function scroll(){const c=document.getElementById('msgs');c.scrollTop=c.scrollHeight;}
function pause(ms){return new Promise(r=>setTimeout(r,ms));}
function esc(s){return s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));}

function firesugg(card){hideSugg();document.getElementById('inp').value=card.getAttribute('data-q');send();}
function hideSugg(){const w=document.getElementById('suggWrap');if(w)w.classList.add('gone');}

async function send(){
  const inp=document.getElementById('inp');
  const txt=inp.value.trim();if(!txt)return;
  inp.value='';inp.style.height='auto';
  hideSugg();
  addMsg('user',esc(txt));
  showTyping();await pause(480);hideTyping();
  if(mode==='a')addBot(answerQuery(txt)||'Ask about Scaler, NST, Vedam, or NIAT.');
  else await handleAnswer(txt);
}

function setMode(m){
  mode=m;
  document.getElementById('tabA').classList.toggle('on',m==='a');
  document.getElementById('tabI').classList.toggle('on',m==='i');
  document.getElementById('chipBar').style.display=m==='a'?'flex':'none';
  const msgs=document.getElementById('msgs');msgs.innerHTML='';
  const sw=document.getElementById('suggWrap');
  if(m==='a'){
    if(sw)sw.classList.remove('gone');
    msgs.innerHTML='<div class="welcome" id="welcome"><div class="welcome-icon">✨</div><h2>College Guide Mode</h2><p>Compare Scaler, NST, Vedam, NIAT on fees, scholarships & placements.</p></div>';
  } else {
    if(sw)sw.classList.add('gone');
    startInterview();
  }
}

function buildChips(){
  const bar=document.getElementById('chipBar');
  COLLEGES.forEach(n=>{
    const b=document.createElement('button');b.className='chip';b.innerText=DATA[n].short;
    b.onclick=()=>{document.getElementById('inp').value=`Tell me about ${n}`;send();};bar.appendChild(b);
  });
  const sep=document.createElement('span');sep.style.cssText='width:1px;background:var(--border2);flex-shrink:0;margin:0 4px;';bar.appendChild(sep);
  QUICK.forEach(q=>{
    const b=document.createElement('button');b.className='qchip';b.innerText=q;
    b.onclick=()=>{document.getElementById('inp').value=q;send();};bar.appendChild(b);
  });
}

function goChat(){document.getElementById('intro').classList.add('hidden');document.getElementById('chat').classList.remove('hidden');}
function goIntro(){document.getElementById('chat').classList.add('hidden');document.getElementById('intro').classList.remove('hidden');}
function hk(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}
function autoH(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,100)+'px';}

buildChips();
</script>
