/* ═══════════════════ RPCA · shared behaviour (null-safe per page) ═══════════════════ */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  /* ——— year ——— */
  const yr = $('#yr'); if(yr) yr.textContent = new Date().getFullYear();

  /* ——— ticker ——— */
  const tickRow = $('#tickRow');
  if(tickRow){
    const phrases = ['Turf & Matting Nets','Coach-Led','Ranchi · Jharkhand','DIG Ground · Bariatu','JSCA Pathway','Technique First','Ages 7–19+','Book a Trial'];
    const seg = phrases.map(p=>`<span>${p}<span class="dot"></span></span>`).join('');
    tickRow.innerHTML = seg+seg;
  }

  /* ——— gallery reel ——— */
  const reel = $('#reel');
  if(reel){
    const shots = [
      ['uploads/team-champions-trophy.jpg','Champions'],
      ['uploads/nets-training.jpg','In the Nets'],
      ['uploads/youth-batting.jpg','Next Generation'],
      ['uploads/team-on-ground.jpg','Match Day'],
      ['uploads/nets-floodlights.jpg','Net Session'],
      ['uploads/trophy-win.jpg','Silverware'],
      ['uploads/yuvraj-highlighted.jpg','Jharkhand T20'],
    ];
    const build = ()=>shots.map(([s,c])=>`<figure><img src="${s}" alt="${c}" loading="lazy"><figcaption>${c}</figcaption></figure>`).join('');
    reel.innerHTML = reduce ? build() : build()+build();
  }

  /* ——— nav scroll state + mobile menu ——— */
  const hdr = $('#hdr');
  if(hdr){
    const onScroll = ()=>hdr.classList.toggle('stuck', window.scrollY>40);
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  }
  const burger = $('#burger');
  if(burger){
    burger.addEventListener('click', ()=>document.body.classList.toggle('menu-open'));
    $$('#nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));
  }

  /* ——— reveal + count-up ——— */
  const io = new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); if(e.target.dataset.count!==undefined) countUp(e.target); io.unobserve(e.target); } });
  },{threshold:.18, rootMargin:'0px 0px -8% 0px'});
  $$('.rise').forEach(el=>io.observe(el));
  $$('[data-count]').forEach(el=>io.observe(el));
  function countUp(el){
    const target = +el.dataset.count, suf = el.dataset.suffix||'', dur=1500;
    if(reduce){ el.innerHTML = target.toLocaleString()+(suf?`<span class="u">${suf}</span>`:''); return; }
    let start=null;
    const step=(t)=>{ if(!start)start=t; const p=Math.min((t-start)/dur,1);
      const val = Math.round(target*(1-Math.pow(1-p,3)));
      el.innerHTML = val.toLocaleString()+(suf?`<span class="u">${suf}</span>`:'');
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ——— custom cursor ——— */
  const cur = $('#cursor');
  if(cur && matchMedia('(hover:hover) and (pointer:fine)').matches){
    let cx=0,cy=0,tx=0,ty=0;
    window.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;cur.style.opacity='1';});
    const loop=()=>{ cx+=(tx-cx)*.2; cy+=(ty-cy)*.2; cur.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    $$('a,button,.tier,.reel figure,.gal-item,.btn,.coach,.ccard').forEach(el=>{
      el.addEventListener('mouseenter',()=>cur.classList.add('hot'));
      el.addEventListener('mouseleave',()=>cur.classList.remove('hot'));
    });
  }

  /* ——— contact form (static; composes a mailto, offers Instagram) ——— */
  const form = $('#trialForm');
  if(form){
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const ok = $('#formOk');
      if(ok){ ok.classList.add('show'); ok.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'}); }
      form.querySelectorAll('input,textarea,select,button').forEach(el=>{ if(el.type!=='reset') el.setAttribute('disabled',''); });
    });
  }

  /* ═══ delivery-arc spine — dotted flight-path, ball flies down on scroll ═══ */
  const arc = $('#arcPath'), arcGlow = $('#arcGlow'), spineBall = $('#spineBall');
  if(arc && spineBall){
    const pts = [[7,0],[13,10],[24,20],[15,29],[30,42],[19,51],[37,63],[24,72],[48,85],[33,100]];
    let d = `M ${pts[0][0]} ${pts[0][1]} `;
    for(let i=1;i<pts.length;i++){
      const prev=pts[i-1], p=pts[i];
      d += `Q ${prev[0]} ${prev[1]} ${(prev[0]+p[0])/2} ${(prev[1]+p[1])/2} `;
    }
    d += `L ${pts[pts.length-1][0]} ${pts[pts.length-1][1]}`;
    arc.setAttribute('d', d); if(arcGlow) arcGlow.setAttribute('d', d);
    const arcLen = arc.getTotalLength();
    const docH = ()=>document.documentElement.scrollHeight - window.innerHeight;
    function updateSpine(){
      const prog = Math.min(Math.max(window.scrollY/Math.max(docH(),1),0),1);
      const pt = arc.getPointAtLength(arcLen*prog);
      spineBall.style.left = pt.x + '%';
      spineBall.style.top = pt.y + '%';
      spineBall.classList.toggle('on', prog>0.004 && prog<0.996);
    }
    let ticking=false;
    const req=()=>{ if(!ticking){ ticking=true; requestAnimationFrame(()=>{updateSpine();ticking=false;}); } };
    window.addEventListener('scroll', req, {passive:true});
    window.addEventListener('resize', updateSpine);
    updateSpine();
  }

  /* ═══ HOME hero — floodlit field canvas (only if present) ═══ */
  const cv = $('#field');
  if(cv){
    const ctx = cv.getContext('2d');
    let W,H,DPR,motes=[],lights=[],t0=performance.now(),rafId=null;
    function resize(){
      DPR=Math.min(window.devicePixelRatio||1,2);
      W=cv.clientWidth; H=cv.clientHeight;
      if(!W||!H) return;
      cv.width=W*DPR; cv.height=H*DPR;
      ctx.setTransform(DPR,0,0,DPR,0,0);
      lights=[{x:W*0.16,y:-40},{x:W*0.42,y:-70},{x:W*0.7,y:-50},{x:W*0.9,y:-80}];
      const n = W<620?46:W<1000?80:120;
      motes=[]; for(let i=0;i<n;i++) motes.push(mote(true));
    }
    function mote(init){
      return {x:Math.random()*W, y:init?Math.random()*H:H+10,
        z:0.3+Math.random()*0.9, r:0.5+Math.random()*1.8,
        vy:-(0.12+Math.random()*0.5), drift:(Math.random()-.5)*0.35,
        ph:Math.random()*Math.PI*2, tw:0.6+Math.random()*1.4};
    }
    function drawField(){
      let g=ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#061a10'); g.addColorStop(0.5,'#0a2416'); g.addColorStop(1,'#03110a');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      let tg=ctx.createRadialGradient(W*0.5,H*1.05,H*0.1,W*0.5,H*1.05,H*0.9);
      tg.addColorStop(0,'rgba(28,74,48,.5)'); tg.addColorStop(1,'rgba(6,26,16,0)');
      ctx.fillStyle=tg; ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='screen';
      lights.forEach(L=>{
        const cone=ctx.createRadialGradient(L.x,L.y,0,L.x,L.y,H*1.15);
        cone.addColorStop(0,'rgba(242,167,27,.16)'); cone.addColorStop(0.35,'rgba(242,167,27,.05)'); cone.addColorStop(1,'rgba(242,167,27,0)');
        ctx.fillStyle=cone; ctx.fillRect(0,0,W,H);
        const src=ctx.createRadialGradient(L.x,L.y+30,0,L.x,L.y+30,60);
        src.addColorStop(0,'rgba(255,224,150,.5)'); src.addColorStop(1,'rgba(255,224,150,0)');
        ctx.fillStyle=src; ctx.fillRect(L.x-70,0,140,120);
      });
      ctx.globalCompositeOperation='source-over';
      ctx.strokeStyle='rgba(212,224,200,.06)'; ctx.lineWidth=1;
      const vx=W*0.5;
      for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.moveTo(vx+i*30, H*0.72); ctx.lineTo(vx+i*220, H*1.02); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(W*0.2,H*0.86); ctx.lineTo(W*0.8,H*0.86); ctx.strokeStyle='rgba(212,224,200,.05)'; ctx.stroke();
    }
    function frame(now){
      const dt=Math.min((now-t0)/16.67,3); t0=now;
      if(!W||!H){ rafId=requestAnimationFrame(frame); return; }
      drawField();
      ctx.globalCompositeOperation='screen';
      motes.forEach(m=>{
        m.y += m.vy*m.z*dt; m.x += m.drift*m.z*dt + Math.sin(now*0.0004+m.ph)*0.15;
        if(m.y<-10){ Object.assign(m, mote(false)); }
        let near=1e9; lights.forEach(L=>{const dd=Math.hypot(m.x-L.x,m.y-L.y);if(dd<near)near=dd;});
        const lit = Math.max(0, 1-near/(H*0.95));
        const tw = 0.5+0.5*Math.sin(now*0.001*m.tw+m.ph);
        const a = (0.05+lit*0.5)*tw*m.z;
        if(a<=0.01) return;
        ctx.beginPath(); ctx.fillStyle=`rgba(255,232,170,${a})`; ctx.arc(m.x,m.y,m.r*m.z,0,Math.PI*2); ctx.fill();
      });
      ctx.globalCompositeOperation='source-over';
      rafId=requestAnimationFrame(frame);
    }
    function start(){ resize(); if(reduce){ drawField(); return; } t0=performance.now(); cancelAnimationFrame(rafId); rafId=requestAnimationFrame(frame); }
    window.addEventListener('resize', ()=>{ clearTimeout(window.__rz); window.__rz=setTimeout(start,150); });
    start();
    const heroEl = $('.hero');
    if(heroEl){
      new IntersectionObserver(es=>{
        es.forEach(e=>{ if(reduce)return;
          if(e.isIntersecting){ if(!rafId){t0=performance.now();rafId=requestAnimationFrame(frame);} }
          else { cancelAnimationFrame(rafId); rafId=null; } });
      },{threshold:0}).observe(heroEl);
    }
  }
})();
