/* ============================================================
   certs.js — credential grid. All six render at once and every
   card is itself the link to its official verification page:
   nothing rotates, nothing has to be selected to be read.
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

  const ICONS = {
    badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M6 4h12v4a6 6 0 0 1-12 0V4Z"/><path d="M6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3M9 20h6M12 14v6"/></svg>',
    scrum: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3.5-7.1"/><path d="M21 4v5h-5"/></svg>',
    ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><circle cx="12" cy="12" r="2.5"/></svg>'
  };
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  function L(o) { const l = window.CURRENT_LANG || 'es'; return o[l] != null ? o[l] : o.es; }
  // read straight from the shared dictionary so these strings stay in one place
  function T(key, fallback) {
    const e = window.I18N && window.I18N[key];
    return e ? L(e) : fallback;
  }

  let grid = null;

  function render() {
    if (!grid) return;
    const verify = T('cert.verify', 'Verificar credencial');
    const issuer = T('cert.issuer', 'BEDU + Santander Universidades');
    grid.innerHTML = '';
    CERTS.forEach((c) => {
      const a = document.createElement('a');
      a.className = 'cert-card kind-' + c.kind;
      a.href = c.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML =
        '<span class="cert-ico">' + ICONS[c.kind] + '</span>' +
        '<span class="cert-code">' + c.code + ' · ' + c.year + '</span>' +
        '<h3 class="cert-name">' + L(c.name) + '</h3>' +
        '<span class="cert-issuer">' + issuer + '</span>' +
        '<span class="cert-verify">' + verify + ARROW + '</span>';
      grid.appendChild(a);
    });
  }

  // keep the cards in sync when the visitor switches language
  const origApply = window.applyLang;
  window.applyLang = function (lang) {
    if (origApply) origApply(lang);
    render();
  };

  document.addEventListener('DOMContentLoaded', () => {
    grid = document.getElementById('certGrid');
    render();
  });
})();
