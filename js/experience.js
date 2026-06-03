/* ============================================================
   experience.js — "Mission Log" interactive career timeline.
   A station rail with a travelling energy core, a CSS 3D planet
   that re-themes per job, and a detail readout. i18n-aware.
   ============================================================ */
(function () {
  const JOBS = [
    { company: 'TECH ENERGY CONTROL', code: 'ETAPA 04 · ACTUAL', role: 'e1.role', date: 'e1.date', desc: 'e1.desc',
      tags: ['IA Generativa', 'RAG', 'Python', 'On-premise'], ai: true },
    { company: 'RADIOMÓVIL DIPSA · Telcel', code: 'ETAPA 03', role: 'e2.role', date: 'e2.date', desc: 'e2.desc',
      tags: ['Java', 'Oracle', 'IBM MQ', 'WebSphere'] },
    { company: 'BH TRADEMARKET', code: 'ETAPA 02', role: 'e3.role', date: 'e3.date', desc: 'e3.desc',
      tags: ['Laravel', 'Flutter', 'Swift', 'Scrum'] },
    { company: 'PROMO LIFE', code: 'ETAPA 01', role: 'e4.role', date: 'e4.date', desc: 'e4.desc',
      tags: ['Laravel', 'Firebase', 'Figma', 'WordPress'] }
  ];

  let active = 0, els = {};
  function T(key) { const e = window.I18N[key]; const l = window.CURRENT_LANG || 'es'; return e ? (e[l] != null ? e[l] : e.es) : key; }

  function buildStations() {
    els.stations.innerHTML = '';
    JOBS.forEach((j, i) => {
      const b = document.createElement('button');
      b.className = 'station' + (j.ai ? ' ai' : '');
      b.innerHTML = `<span class="st-node"></span>
        <span class="st-info">
          <span class="st-company">${j.company}</span>
          <span class="st-date mono">${T(j.date)}</span>
        </span>`;
      b.addEventListener('click', () => select(i, true));
      els.stations.appendChild(b);
    });
  }

  function select(i, user) {
    active = i;
    const j = JOBS[i];
    // rail fill + station states
    const stations = els.stations.querySelectorAll('.station');
    stations.forEach((s, idx) => s.classList.toggle('active', idx === i));
    const pct = JOBS.length > 1 ? (i / (JOBS.length - 1)) * 100 : 0;
    els.fill.style.height = pct + '%';
    // detail
    els.code.textContent = j.code;
    els.date.textContent = T(j.date);
    els.company.textContent = j.company;
    els.role.textContent = T(j.role);
    els.desc.textContent = T(j.desc);
    els.tags.innerHTML = j.tags.map(t => `<span class="badge">${t}</span>`).join('');
    // re-projection animation
    const vp = els.detail;
    if (window.anime && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.anime.remove(vp);
      window.anime({ targets: vp, opacity: [0.3, 1], translateX: [user ? 22 : 10, 0], duration: 460, easing: 'easeOutCubic' });
    }
  }

  const origApply = window.applyLang;
  window.applyLang = function (lang) { origApply(lang); if (els.stations) { buildStations(); select(active, false); } };

  document.addEventListener('DOMContentLoaded', () => {
    els = {
      stations: document.getElementById('railStations'), fill: document.getElementById('railFill'),
      detail: document.getElementById('mlogDetail'),
      code: document.getElementById('mlCode'), date: document.getElementById('mlDate'),
      company: document.getElementById('mlCompany'), role: document.getElementById('mlRole'),
      desc: document.getElementById('mlDesc'), tags: document.getElementById('mlTags')
    };
    if (!els.stations) return;
    buildStations();
    select(0, false);
  });
})();
