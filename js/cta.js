/* ============================================================
   cta.js — Warp tunnel (2D canvas) + typing transmission
   console + magnetic contact buttons.
   ============================================================ */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINES = {
    es: [
      '> Estableciendo enlace seguro…',
      '> Escaneando oportunidades…',
      '> Perfil: Desarrollador de Software + IA',
      '> Estado: DISPONIBLE para nuevos proyectos',
      '> ¿Construimos algo extraordinario?'
    ],
    en: [
      '> Establishing secure link…',
      '> Scanning opportunities…',
      '> Profile: Software + AI Developer',
      '> Status: AVAILABLE for new projects',
      '> Shall we build something extraordinary?'
    ]
  };

  /* ---------- warp tunnel ---------- */
  function warp() {
    const canvas = document.getElementById('warpCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, cx, cy, stars = [];
    const N = window.innerWidth < 700 ? 90 : 170;
    function resize() {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.width = r.width * dpr; h = canvas.height = r.height * dpr;
      canvas.style.width = r.width + 'px'; canvas.style.height = r.height + 'px';
      cx = w / 2; cy = h / 2;
    }
    function mk() { return { a: Math.random() * Math.PI * 2, r: Math.random() * 40, sp: 1.6 + Math.random() * 3.2, mag: Math.random() < 0.4, pr: 0 }; }
    resize();
    for (let i = 0; i < N; i++) { const s = mk(); s.r = Math.random() * Math.max(w, h) * 0.6; stars.push(s); }
    const dpr = Math.min(window.devicePixelRatio, 2);
    let warpRunning = false;
    function frame() {
      ctx.fillStyle = 'rgba(5,3,10,0.32)';
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        s.pr = s.r; s.r += s.sp * dpr * (1 + s.r / Math.max(w, h));
        const x1 = cx + Math.cos(s.a) * s.pr, y1 = cy + Math.sin(s.a) * s.pr;
        const x2 = cx + Math.cos(s.a) * s.r, y2 = cy + Math.sin(s.a) * s.r;
        const t = Math.min(1, s.r / (Math.max(w, h) * 0.55));
        ctx.strokeStyle = s.mag ? `rgba(255,43,214,${t})` : `rgba(24,232,255,${t})`;
        ctx.lineWidth = (0.6 + t * 1.8) * dpr;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        if (s.r > Math.max(w, h) * 0.62) { Object.assign(s, mk()); }
      }
      if (warpRunning) requestAnimationFrame(frame);
    }
    if (reduced) { ctx.fillStyle = '#05030a'; ctx.fillRect(0,0,w,h); }
    else {
      // only run the warp while the CTA is on-screen (perf)
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !warpRunning) { warpRunning = true; frame(); }
        else if (!e.isIntersecting) { warpRunning = false; }
      }, { threshold: 0.05 });
      io.observe(canvas);
    }
    window.addEventListener('resize', resize);
    setTimeout(resize, 500);
  }

  /* ---------- typing console ---------- */
  let typed = false;
  let runId = 0;
  function typeLines() {
    const body = document.getElementById('txBody');
    if (!body) return;
    const myRun = ++runId;
    const lang = window.CURRENT_LANG || 'es';
    const lines = LINES[lang] || LINES.es;
    body.innerHTML = '';
    if (reduced) { body.innerHTML = lines.map(l => `<div class="tx-line">${l}</div>`).join(''); return; }
    let li = 0;
    function nextLine() {
      if (myRun !== runId) return;
      if (li >= lines.length) { body.insertAdjacentHTML('beforeend', '<span class="tx-cursor">▋</span>'); return; }
      const div = document.createElement('div'); div.className = 'tx-line'; body.appendChild(div);
      const txt = lines[li]; let ci = 0;
      (function typeChar() {
        if (myRun !== runId) return;
        div.textContent = txt.slice(0, ci);
        ci++;
        if (ci <= txt.length) setTimeout(typeChar, 22 + Math.random() * 30);
        else { li++; setTimeout(nextLine, 280); }
      })();
    }
    nextLine();
  }

  /* ---------- magnetic buttons ---------- */
  function magnetic() {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- 3D tilt cards ---------- */
  function tiltCards() {
    if (reduced) return;
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - 0.5;
        const my = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateX(${ -my * 9 }deg) rotateY(${ mx * 11 }deg) translateZ(6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // retype on language change
  const origApply = window.applyLang;
  window.applyLang = function (lang) { origApply(lang); if (typed) typeLines(); };
  window.__ctaType = function () { typed = true; typeLines(); };

  document.addEventListener('DOMContentLoaded', () => {
    warp();
    magnetic();
    tiltCards();
    const tx = document.getElementById('transmission');
    if (tx) {
      const trigger = () => { if (!typed) { typed = true; typeLines(); io.disconnect(); } };
      const io = new IntersectionObserver((ents) => {
        ents.forEach(en => { if (en.isIntersecting) trigger(); });
      }, { threshold: 0.25 });
      io.observe(tx);
      setTimeout(() => {
        const r = tx.getBoundingClientRect();
        if (!typed && r.top < window.innerHeight && r.bottom > 0) trigger();
      }, 1200);
    }
  });
})();
