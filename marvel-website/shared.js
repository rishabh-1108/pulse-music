// ===== MARVEL UNIVERSE - SHARED JAVASCRIPT =====
// Preloader, Navigation, Hamburger, Back-to-Top, Glow Orbs, GSAP, Cursor

// Preloader
(function(){
  let pp=0;
  const preloader=document.getElementById('preloader');
  const fill=document.getElementById('preloader-fill');
  if(!preloader||!fill)return;
  const iv=setInterval(()=>{
    pp+=Math.random()*18+5;
    if(pp>=100){pp=100;clearInterval(iv);setTimeout(()=>{preloader.classList.add('hidden')},300)}
    fill.style.width=pp+'%';
  },120);
})();

// Nav scroll effect
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('navbar');
  if(nav)nav.classList.toggle('scrolled',window.scrollY>50);
  const btt=document.getElementById('back-to-top');
  if(btt)btt.classList.toggle('visible',window.scrollY>400);
});

// Hamburger menu
(function(){
  const hamburger=document.getElementById('hamburger');
  const navLinks=document.querySelector('.nav-links');
  if(!hamburger||!navLinks)return;
  let open=false;
  hamburger.addEventListener('click',()=>{
    open=!open;
    if(open){
      navLinks.style.display='flex';
      navLinks.style.flexDirection='column';
      navLinks.style.position='absolute';
      navLinks.style.top='70px';
      navLinks.style.right='20px';
      navLinks.style.background='rgba(0,0,0,.97)';
      navLinks.style.padding='25px';
      navLinks.style.borderRadius='16px';
      navLinks.style.border='1px solid rgba(226,54,54,.3)';
      navLinks.style.boxShadow='0 10px 40px rgba(0,0,0,.8),0 0 30px rgba(226,54,54,.15)';
      navLinks.style.backdropFilter='blur(20px)';
      navLinks.style.zIndex='99999';
      hamburger.innerHTML='<i class="fas fa-times"></i>';
    }else{
      navLinks.removeAttribute('style');
      hamburger.innerHTML='<i class="fas fa-bars"></i>';
    }
  });
  document.addEventListener('click',(e)=>{
    if(open&&!navLinks.contains(e.target)&&!hamburger.contains(e.target)){
      open=false;
      navLinks.removeAttribute('style');
      hamburger.innerHTML='<i class="fas fa-bars"></i>';
    }
  });
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',(e)=>{
    const href=a.getAttribute('href');
    if(href==='#'||href==='#heroes')return;
    e.preventDefault();
    const t=document.querySelector(href);
    if(t)t.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

// Create glow orbs
(function(){
  const existing=document.querySelectorAll('.glow-orb');
  if(existing.length>=2)return;
  const c=document.createElement('div');c.className='glow-orb glow-orb-1';
  const c2=document.createElement('div');c2.className='glow-orb glow-orb-2';
  document.body.appendChild(c);document.body.appendChild(c2);
})();

// Back to top button
(function(){
  const btn=document.createElement('button');
  btn.id='back-to-top';
  btn.innerHTML='<i class="fas fa-chevron-up"></i>';
  btn.setAttribute('aria-label','Back to top');
  btn.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'})});
  document.body.appendChild(btn);
})();

// Cursor glow
(function(){
  if(window.innerWidth<768)return;
  const glow=document.createElement('div');
  glow.style.cssText='position:fixed;width:20px;height:20px;border-radius:50%;background:rgba(226,54,54,.25);pointer-events:none;z-index:99997;transition:transform .1s;filter:blur(8px)';
  document.body.appendChild(glow);
  document.addEventListener('mousemove',(e)=>{glow.style.left=e.clientX-10+'px';glow.style.top=e.clientY-10+'px'});
  document.addEventListener('mousedown',()=>{glow.style.transform='scale(2.5)';glow.style.background='rgba(226,54,54,.5)'});
  document.addEventListener('mouseup',()=>{glow.style.transform='scale(1)';glow.style.background='rgba(226,54,54,.25)'});
})();

// GSAP Scroll Animations (if GSAP is loaded)
(function(){
  if(typeof gsap==='undefined'||typeof ScrollTrigger==='undefined')return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.section-header').forEach(h=>{
    gsap.from(h,{scrollTrigger:{trigger:h,start:'top 85%'},y:50,opacity:0,duration:1,ease:'power3.out'});
  });
  gsap.utils.toArray('.stat-card,.hero-card,.movie-card,.video-card,.mission-card,.battle-card,.tech-card,.team-card,.profile-card,.variant-card').forEach((c,i)=>{
    gsap.from(c,{scrollTrigger:{trigger:c,start:'top 88%'},y:60,opacity:0,duration:.7,delay:i%4*.1,ease:'power3.out'});
  });
  gsap.utils.toArray('.timeline-item').forEach((item,i)=>{
    ScrollTrigger.create({trigger:item,start:'top 82%',onEnter:()=>{setTimeout(()=>{item.classList.add('visible')},i*80)}});
  });
})();

// Stat counter animation
(function(){
  function animateStats(){
    document.querySelectorAll('.stat-number[data-target]').forEach(el=>{
      if(el.dataset.animated)return;
      el.dataset.animated='true';
      const target=parseInt(el.dataset.target);
      const start=performance.now();
      function update(now){
        const p=Math.min((now-start)/2000,1);
        const eased=1-Math.pow(1-p,3);
        const val=Math.floor(eased*target);
        if(target>=20)el.textContent=val+'B+';
        else if(target>=5&&target<=15)el.textContent=val+'+';
        else el.textContent=val+'+';
        if(p<1)requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }
  if(typeof ScrollTrigger!=='undefined'){
    document.querySelectorAll('.stats-grid,.stats-section').forEach(s=>{
      ScrollTrigger.create({trigger:s,start:'top 75%',onEnter:animateStats,once:true});
    });
  }
})();
