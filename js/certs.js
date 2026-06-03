/* ============================================================
   certs.js — Holographic credential projector console.
   A single holo-card projects the selected certificate; a row
   of selector chips switches modules with a re-projection FX.
   ============================================================ */
(function () {
  const CERTS = [
    { key: 'c1', kind: 'badge', url: 'https://www.credly.com/badges/96c105fa-d9a1-4d70-a98c-5c7d2ec20c14',
      name: { es: 'Desarrollo Móvil', en: 'Mobile Development' }, code: 'MOB-01', year: '2021' },
    { key: 'c2', kind: 'trophy', url: 'https://www.credly.com/badges/c9211d10-e9b8-49e1-8069-24d362b0cb34/',
      name: { es: 'Proyecto Ganador · Móvil', en: 'Winning Project · Mobile' }, code: 'MOB-WIN', year: '2021' },
    { key: 'c3', kind: 'scrum', url: 'https://www.acreditta.com/credential/af60c343-56b1-4208-8d50-1a5f1797b5d6',
      name: { es: 'Scrum Master', en: 'Scrum Master' }, code: 'AGILE-01', year: '2023' },
    { key: 'c4', kind: 'trophy', url: 'https://www.acreditta.com/credential/463c42e3-b961-4c19-8819-8fec8c2e2f70',
      name: { es: 'Proyecto Ganador · Scrum', en: 'Winning Project · Scrum' }, code: 'AGILE-WIN', year: '2023' },
    { key: 'c5', kind: 'ai', url: 'https://view.pok.tech/c/a95c0e92-07c9-42a6-a014-f90546ba228e',
      name: { es: 'IA y Machine Learning', en: 'AI & Machine Learning' }, code: 'AI-01', year: '2025' },
    { key: 'c6', kind: 'ai', url: 'https://view.pok.tech/c/0f18fe43-acf3-4bf2-9b37-bc8711f6e5e1',
      name: { es: 'Prototype · IA y ML', en: 'Prototype · AI & ML' }, code: 'AI-PROTO', year: '2025' }
  ];
  const ISSUER = 'BEDU + Santander Universidades';
  const ICONS = {
    badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 4h12v4a6 6 0 0 1-12 0V4Z"/><path d="M6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3M9 20h6M12 14v6"/></svg>',
    scrum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M21 12a9 9 0 1 1-3.5-7.1"/><path d="M21 4v5h-5"/></svg>',
    ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><circle cx="12" cy="12" r="2.5"/></svg>'
  };

  let active = 0, els = {}, autoTimer = null;
  function L(o) { const l = window.CURRENT_LANG || 'es'; return o[l] != null ? o[l] : o.es; }

  function project(i, manual) {
    active = (i + CERTS.length) % CERTS.length;
    const c = CERTS[active];
    const card = els.card;
    // re-projection flicker
    card.classList.remove('on');
    card.classList.add('reproj');
    setTimeout(() => {
      els.ico.innerHTML = ICONS[c.kind];
      els.ico.className = 'holo-ico kind-' + c.kind;
      els.name.textContent = L(c.name);
      els.year.textContent = c.code + ' · ' + c.year;
      els.issuer.textContent = ISSUER;
      els.verify.href = c.url;
      card.classList.remove('reproj');
      card.classList.add('on');
    }, 160);
    // selector states
    els.selectors.querySelectorAll('.hc-chip').forEach((b, idx) => b.classList.toggle('active', idx === active));
    if (manual) restartAuto();
  }

  function buildSelectors() {
    els.selectors.innerHTML = '';
    CERTS.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'hc-chip kind-' + c.kind;
      b.innerHTML = `<span class="chip-ico">${ICONS[c.kind]}</span><span class="chip-txt">${L(c.name)}</span>`;
      b.addEventListener('click', () => project(i, true));
      els.selectors.appendChild(b);
    });
  }

  function restartAuto() {
    if (autoTimer) clearInterval(autoTimer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoTimer = setInterval(() => project(active + 1, false), 5200);
  }

  // pointer tilt on the stage for holographic parallax
  function tilt(stage, card) {
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateX(${ -my * 12 }deg) rotateY(${ mx * 16 }deg)`;
    });
    stage.addEventListener('pointerleave', () => { card.style.transform = ''; });
  }

  const origApply = window.applyLang;
  window.applyLang = function (lang) { origApply(lang); if (els.selectors) { buildSelectors(); const a = active; active = -1; project(a, false); } };

  document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('hcStage');
    if (!stage) return;
    els = {
      stage, card: document.getElementById('holoCard'), ico: document.getElementById('holoIco'),
      name: document.getElementById('holoName'), year: document.getElementById('holoYear'),
      issuer: document.getElementById('holoIssuer'), verify: document.getElementById('holoVerify'),
      selectors: document.getElementById('hcSelectors')
    };
    buildSelectors();
    project(0, false);
    tilt(stage, els.card);
    // start auto-rotate when scrolled into view
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) restartAuto(); else if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } });
    }, { threshold: 0.3 });
    io.observe(stage);
  });
})();
