/* ============================================================
   app.js — boot loader, language, nav, hero mode switch,
   scroll reveals (anime.js + IntersectionObserver).
   ============================================================ */
(function () {
  const anime = window.anime;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- language ---------- */
  let lang = 'es';
  try { lang = localStorage.getItem('ocr_lang') || 'es'; } catch (e) {}
  window.applyLang(lang);
  function setLangButtons() {
    document.querySelectorAll('.lang-toggle button').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === window.CURRENT_LANG);
    });
  }
  document.querySelectorAll('.lang-toggle button').forEach(b => {
    b.addEventListener('click', () => { window.applyLang(b.dataset.lang); setLangButtons(); });
  });
  setLangButtons();

  /* ---------- mobile nav ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('hudNav');
  if (menuToggle) menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
  document.querySelectorAll('.hud-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* ---------- active nav link on scroll ---------- */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.hud-nav a')];
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ---------- hero mode switch ---------- */
  const modeNames = ['PERFIL 01', 'PERFIL 02', 'PERFIL 03'];
  const modeNameEl = document.getElementById('modeName');
  document.querySelectorAll('.mode-switch button').forEach(b => {
    b.addEventListener('click', function () {
      const btns = document.querySelectorAll('.mode-switch button');
      const n = +this.dataset.mode;
      btns.forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      if (window.HeroScene) window.HeroScene.setMode(n);
      if (modeNameEl) modeNameEl.textContent = modeNames[n];
      if (anime && !reduced) {
        anime({ targets: '#hero-canvas', scale: [0.94, 1], opacity: [0.4, 1], duration: 600, easing: 'easeOutExpo' });
      }
    });
  });

  /* ---------- scroll reveals ---------- */
  function reveal(el) {
    if (reduced || !anime) { el.style.opacity = 1; return; }
    const kids = el.querySelectorAll('[data-stagger]');
    anime({ targets: el, opacity: [0, 1], translateY: [34, 0], duration: 760, easing: 'easeOutCubic' });
    if (kids.length) {
      anime({ targets: kids, opacity: [0, 1], translateY: [40, 0], duration: 720, delay: anime.stagger(80, { start: 120 }), easing: 'easeOutCubic' });
    }
  }
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { reveal(e.target); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- hero entrance ---------- */
  function heroIn() {
    if (reduced || !anime) {
      document.querySelectorAll('.hero-text > *').forEach(el => el.style.opacity = 1);
      return;
    }
    anime.timeline({ easing: 'easeOutExpo' })
      .add({ targets: '.hero-hello', opacity: [0, 1], translateY: [20, 0], duration: 600 })
      .add({ targets: '.hero-name', opacity: [0, 1], translateY: [30, 0], duration: 800 }, '-=350')
      .add({ targets: '.hero-role', opacity: [0, 1], translateY: [20, 0], duration: 700 }, '-=500')
      .add({ targets: '.hero-tag', opacity: [0, 1], translateY: [16, 0], scale: [0.9, 1], delay: anime.stagger(70), duration: 500 }, '-=400')
      .add({ targets: '.hero-cta .btn', opacity: [0, 1], translateY: [16, 0], delay: anime.stagger(90), duration: 500 }, '-=300')
      .add({ targets: '.mode-switch, .scroll-hint', opacity: [0, 1], duration: 500 }, '-=200');
  }

  /* ---------- ricing slideshow (info section) ---------- */
  const ricing = document.getElementById('ricingShow');
  if (ricing) {
    const N = 7;
    const idxEl = document.getElementById('ricingIdx');
    const imgs = [];
    for (let i = 1; i <= N; i++) {
      const im = document.createElement('img');
      im.src = 'img/linux' + i + '.jpg';
      im.alt = 'Personalización de escritorio GNU/Linux ' + i + ' de ' + N;
      im.loading = 'lazy';
      im.draggable = false;
      ricing.insertBefore(im, ricing.firstChild);
      imgs.push(im);
    }
    let cur = 0, hover = false;
    function showShot(n) {
      cur = (n + N) % N;
      imgs.forEach((im, k) => im.classList.toggle('on', k === cur));
      if (idxEl) idxEl.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
    }
    showShot(0);
    ricing.addEventListener('click', () => showShot(cur + 1));
    ricing.addEventListener('pointerenter', () => { hover = true; });
    ricing.addEventListener('pointerleave', () => { hover = false; });
    if (!reduced) setInterval(() => { if (!hover) showShot(cur + 1); }, 3800);
  }

  /* ---------- boot loader ---------- */
  const boot = document.getElementById('boot');
  const fill = document.querySelector('.boot-fill');
  function finishBoot() {
    if (anime && !reduced) {
      anime({ targets: fill, width: ['0%', '100%'], duration: 1100, easing: 'easeInOutQuad', complete: () => {
        boot.classList.add('gone');
        setTimeout(() => boot.remove(), 650);
        heroIn();
      }});
    } else {
      if (fill) fill.style.width = '100%';
      boot.classList.add('gone');
      setTimeout(() => boot && boot.remove(), 650);
      heroIn();
    }
  }
  window.addEventListener('load', () => setTimeout(finishBoot, 350));
})();
