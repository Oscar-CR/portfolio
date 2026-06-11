/* ============================================================
   projects.js — "Holo-Showcase" 70/30.
   17 projects (5 with real screenshots), category filters
   (IA / Móvil / Web). Mac-style screen (70%) + info panel
   (30%), thumbnail rail, autoplay and keyboard/swipe nav.
   Projects without screenshot keep the generated holographic
   demo UIs.
   ============================================================ */
(function () {
  const C = '18e8ff';
  const ico = (slug) => `https://cdn.simpleicons.org/${slug}/${C}`;

  // ---- data ----
  const PROJECTS = [
    // ===== IA =====
    { cat: 'ia', demo: 'ai', badges: ['Laravel','Python','RAG'],
      title: { es: 'Explorador IA', en: 'AI Explorer' },
      desc: { es: 'Plataforma que centraliza herramientas de IA: chat con agentes configurables, buscador semántico documental, soporte técnico automatizado y recomendaciones.', en: 'Platform centralizing AI tools: configurable-agent chat, semantic document search, automated tech support and recommendations.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'ia', demo: 'infra', badges: ['Linux','Nginx','Ollama','ChromaDB'],
      title: { es: 'Infraestructura IA Local', en: 'Local AI Infrastructure' },
      desc: { es: 'Servidor Linux on-premise con Nginx como proxy/balanceador hacia 11 servicios: Ollama, Open WebUI, AnythingLLM, Paperless-NGX (OCR), n8n y apps internas. Acceso seguro vía Cloudflare Zero Trust.', en: 'On-premise Linux server, Nginx reverse-proxy/balancer to 11 services: Ollama, Open WebUI, AnythingLLM, Paperless-NGX (OCR), n8n and internal apps. Secured with Cloudflare Zero Trust.' },
      status: { es: 'On-premise', en: 'On-premise' } },
    { cat: 'ia', demo: 'ai', badges: ['Python','ChromaDB','RAG'],
      title: { es: 'Sistema RAG de IA Local', en: 'Local RAG AI System' },
      desc: { es: 'Inteligencia documental con arquitectura RAG: "entrena" modelos con información de la empresa para responder sobre empleados, políticas o cualquier dato organizacional.', en: 'Document intelligence with RAG architecture: "trains" models on company data to answer about employees, policies or any organizational information.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'ia', demo: 'infra', badges: ['Laravel','n8n','APIs'],
      title: { es: 'Integración y Orquestación', en: 'Integration & Orchestration' },
      desc: { es: 'Plataforma corporativa para centralizar la integración entre sistemas internos y externos, con intercambio seguro de información y verificación de proyectos en producción.', en: 'Corporate platform centralizing integration between internal/external systems, with secure data exchange and production-project verification.' },
      status: { es: 'Interno', en: 'Internal' } },

    // ===== MÓVIL =====
    { cat: 'movil', demo: 'phone', badges: ['Laravel','Flutter'],
      img: 'img/intranet.png',
      alt: { es: 'Pantallas web y móviles de la Intranet Corporativa', en: 'Web and mobile screens of the Corporate Intranet' },
      title: { es: 'Intranet Corporativa', en: 'Corporate Intranet' },
      desc: { es: 'Sistema web y móvil para centralizar procesos, comunicación y gestión: vacaciones, comunicados, catálogo de proveedores, tickets y documentación interna.', en: 'Web & mobile system centralizing processes, communication and management: vacations, announcements, supplier catalog, tickets and internal docs.' },
      status: { es: 'Publicado', en: 'Live' },
      links: [ { t: 'Google Play', s: 'googleplay', u: 'https://play.google.com/store/apps/details?id=com.promolife.intranet_movil' }, { t: 'App Store', s: 'appstore', u: 'https://apps.apple.com/us/app/intranet-m%C3%B3vil/id6445901024' } ] },
    { cat: 'movil', demo: 'phone', badges: ['Flutter','NFC'],
      img: 'img/promonfc.png',
      alt: { es: 'Flujo de pantallas de la app Promo NFC: carga masiva y grabado de tarjetas', en: 'Promo NFC app screen flow: bulk upload and card encoding' },
      title: { es: 'Promo NFC', en: 'Promo NFC' },
      desc: { es: 'App interna para grabado masivo de tarjetas NFC: lectura CSV/Excel, listas masivas, compatibilidad RFID y validador de URLs y datos.', en: 'Internal app for bulk NFC card encoding: CSV/Excel reading, bulk lists, RFID compatibility and URL/data validator.' },
      status: { es: 'Publicado', en: 'Live' },
      links: [ { t: 'Google Play', s: 'googleplay', u: 'https://play.google.com/store/apps/details?id=com.promolife.nfc_app_movil' } ] },
    { cat: 'movil', demo: 'phone', badges: ['Java','Kotlin'],
      img: 'img/segurapp.png',
      alt: { es: 'Pantallas de SegurApp: mapa, contactos de confianza y registro', en: 'SegurApp screens: map, trusted contacts and sign-up' },
      title: { es: 'SegurApp', en: 'SegurApp' },
      desc: { es: 'App de seguridad personal con rastreo en tiempo real a contactos de confianza: push (FCM), Mapbox, GPS, Firestore + Room y APIs de seguridad pública.', en: 'Personal-safety app with real-time tracking to trusted contacts: push (FCM), Mapbox, GPS, Firestore + Room and public-safety APIs.' },
      status: { es: 'Open source', en: 'Open source' },
      links: [ { t: 'Repositorio', s: 'github', u: 'https://github.com/Oscar-CR/bedu-segurapp' } ] },
    { cat: 'movil', demo: 'phone', badges: ['Flutter'],
      title: { es: 'Tickets de Almacén (Móvil)', en: 'Warehouse Tickets (Mobile)' },
      desc: { es: 'App de gestión y seguimiento de tickets operativos del almacén con visibilidad en tiempo real, mejor coordinación entre áreas y tiempos de atención optimizados.', en: 'Mobile app to manage and track warehouse operational tickets with real-time visibility, better cross-area coordination and optimized response times.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'movil', demo: 'phone', badges: ['Flutter'],
      title: { es: 'Requisición de Vehículos (Móvil)', en: 'Vehicle Requisition (Mobile)' },
      desc: { es: 'App que complementa el sistema de gestión vehicular: permite crear y dar seguimiento a requisiciones desde el campo, con información en tiempo real.', en: 'Mobile companion to the vehicle-management system: create and track requisitions in the field with real-time information.' },
      status: { es: 'Interno', en: 'Internal' } },

    // ===== WEB =====
    { cat: 'web', demo: 'web', badges: ['Laravel','MySQL','Tailwind'],
      img: 'img/portales.png',
      alt: { es: 'Portales e-commerce B2B: catálogo, detalle de producto e inicio de sesión', en: 'B2B e-commerce portals: catalog, product detail and login' },
      title: { es: 'E-commerce B2B', en: 'B2B E-commerce' },
      desc: { es: 'Múltiples portales e-commerce B2B a la medida con reglas de negocio por rol, conexión a compras internas del cliente, stock en tiempo real y cotización automática.', en: 'Multiple custom B2B e-commerce portals with role-based rules, integration to client purchasing systems, real-time stock and automatic quoting.' },
      status: { es: 'Web', en: 'Web' } },
    { cat: 'web', demo: 'web', badges: ['Laravel'],
      img: 'img/cotizador.png',
      alt: { es: 'Pantallas del cotizador de proveedores: catálogo, configuración y resumen', en: 'Supplier quoting engine screens: catalog, configuration and summary' },
      title: { es: 'Cotizador de Proveedores', en: 'Supplier Quoting Engine' },
      desc: { es: 'Cotizador de productos promocionales conectado al inventario de múltiples proveedores, con carga masiva (API/CSV/XLSX/XML), márgenes por actor y generación de PDF/email.', en: 'Promotional-product quoting engine linked to multiple supplier inventories, bulk import (API/CSV/XLSX/XML), per-actor margins and PDF/email generation.' },
      status: { es: 'Web', en: 'Web' } },
    { cat: 'web', demo: 'web', badges: ['Laravel'],
      title: { es: 'Solicitudes de Vacaciones', en: 'Vacation Requests' },
      desc: { es: 'Plataforma para administrar y controlar vacaciones del personal: automatiza solicitud, validación y autorización, garantizando cumplimiento normativo y eficiencia de RRHH.', en: 'Platform to manage staff vacations: automates request, validation and approval, ensuring labor-law compliance and HR efficiency.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'web', demo: 'web', badges: ['Laravel','MySQL'],
      title: { es: 'Sistema Integral de Inventario', en: 'Integrated Inventory System' },
      desc: { es: 'Administración y control integral de inventarios para almacenes y centros de distribución, con trazabilidad completa de productos, movimientos y solicitudes internas.', en: 'End-to-end inventory administration for warehouses and distribution centers, with full traceability of products, movements and internal requests.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'web', demo: 'web', badges: ['Laravel'],
      title: { es: 'Requisición de Vehículos', en: 'Vehicle Requisition' },
      desc: { es: 'Administración y control de solicitudes vehiculares: optimiza asignación, seguimiento y operación de unidades con trazabilidad de la solicitud a la devolución.', en: 'Administration and control of vehicle requests: optimizes assignment, tracking and operation with traceability from request to return.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'web', demo: 'web', badges: ['Laravel'],
      title: { es: 'Registro y Gestión de Proveedores', en: 'Supplier Registration & Management' },
      desc: { es: 'Digitaliza el alta, validación y seguimiento de proveedores, facilitando la gestión documental y el flujo de aprobación entre proveedores y el área de compras.', en: 'Digitizes supplier onboarding, validation and tracking, easing document management and the approval flow between suppliers and procurement.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'web', demo: 'web', badges: ['Laravel'],
      title: { es: 'Cartera de Clientes', en: 'Client Portfolio' },
      desc: { es: 'Sistema que integra gestión comercial, proyectos, operaciones, finanzas y monitoreo ejecutivo: del prospecto a la propuesta, ejecución, control financiero y cierre.', en: 'System integrating sales, projects, operations, finance and executive monitoring: from lead to proposal, execution, financial control and closing.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'web', demo: 'web', badges: ['Laravel'],
      title: { es: 'Gestión Integral de TI', en: 'Integrated IT Management' },
      desc: { es: 'Plataforma para administrar la operación de Sistemas/TI: activos tecnológicos, soporte técnico, proyectos, seguridad interna, compras y procesos operativos de TI.', en: 'Platform to run IT operations: tech assets, support, projects, internal security, purchasing and IT operational processes.' },
      status: { es: 'Interno', en: 'Internal' } }
  ];

  const CATS = {
    todos: { es: 'Todos', en: 'All' },
    ia:    { es: 'IA', en: 'AI' },
    movil: { es: 'Móvil', en: 'Mobile' },
    web:   { es: 'Web', en: 'Web' }
  };

  const AUTOPLAY_MS = 7000;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let list = PROJECTS.slice();
  let active = 0;
  let filter = 'todos';
  let stage, track, thumbsEl, idxEl, catEl, nameEl;
  let timer = null, paused = false;

  function L(o) { const lang = window.CURRENT_LANG || 'es'; return o[lang] != null ? o[lang] : o.es; }

  function slug(p) {
    return (p.title.en || p.title.es).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // ---- holographic demo UI per category (fallback when no screenshot) ----
  function demoHTML(p) {
    const tech = p.badges.filter(b => ['Laravel','Flutter','Python','MySQL','Tailwind','Nginx','Ollama','ChromaDB','n8n','Java','Kotlin'].includes(b))
      .map(b => ({ Laravel:'laravel', Flutter:'flutter', Python:'python', MySQL:'mysql', Tailwind:'tailwindcss', Nginx:'nginx', Ollama:'ollama', ChromaDB:'', n8n:'n8n', Java:'openjdk', Kotlin:'kotlin' })[b])
      .filter(Boolean).slice(0,3).map(s => `<img src="${ico(s)}" alt="">`).join('');

    if (p.demo === 'phone') {
      return `<div class="demo demo-phone">
        <div class="dp-notch"></div>
        <div class="dp-screen">
          <div class="dp-bar"><span></span><span></span></div>
          <div class="dp-card"></div>
          <div class="dp-row"><i></i><i></i><i></i></div>
          <div class="dp-row"><i></i><i></i><i></i></div>
          <div class="dp-fab"></div>
        </div>
        <div class="demo-tech">${tech}</div>
      </div>`;
    }
    if (p.demo === 'ai') {
      return `<div class="demo demo-ai">
        <div class="da-net">
          <span class="da-core"></span>
          <span class="da-node n1"></span><span class="da-node n2"></span>
          <span class="da-node n3"></span><span class="da-node n4"></span>
        </div>
        <div class="da-chat">
          <div class="da-msg a"></div><div class="da-msg b"></div><div class="da-msg a sm"></div>
        </div>
        <div class="demo-tech">${tech}</div>
      </div>`;
    }
    if (p.demo === 'infra') {
      return `<div class="demo demo-infra">
        <div class="di-rack"><span></span><span></span><span></span><span></span><span></span><span></span></div>
        <div class="di-flow"><i></i><i></i><i></i></div>
        <div class="demo-tech">${tech}</div>
      </div>`;
    }
    // web dashboard
    return `<div class="demo demo-web">
      <div class="dw-top"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
      <div class="dw-body">
        <div class="dw-side"><i></i><i></i><i></i><i></i></div>
        <div class="dw-main">
          <div class="dw-cards"><b></b><b></b><b></b></div>
          <div class="dw-chart"><u style="height:40%"></u><u style="height:70%"></u><u style="height:55%"></u><u style="height:90%"></u><u style="height:65%"></u></div>
        </div>
      </div>
      <div class="demo-tech">${tech}</div>
    </div>`;
  }

  function statusPill(p) {
    if (p.links && p.links.length) {
      return p.links.map(l => `<a class="pill" href="${l.u}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${l.s?`<img src="${ico(l.s)}" alt="">`:''}${l.t}</a>`).join('');
    }
    return `<span class="pill locked"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>${L(p.status)}</span>`;
  }

  function screenHTML(p) {
    return p.img
      ? `<img class="hs-img" src="${p.img}" alt="${L(p.alt || p.title)}" loading="lazy" draggable="false">`
      : `<div class="hs-demo">${demoHTML(p)}</div>`;
  }

  function build() {
    track.innerHTML = '';
    list.forEach((p, i) => {
      const num = String(i + 1).padStart(2, '0');
      const slide = document.createElement('article');
      slide.className = 'holo-slide cat-' + p.cat;
      slide.innerHTML = `
        <div class="hs-screen">
          <div class="hs-bar">
            <span class="hs-dots"><i class="r"></i><i class="y"></i><i class="g"></i></span>
            <span class="hs-url mono">ocr://${slug(p)}</span>
            <span class="hs-sig mono"><i></i>SYS.${num}</span>
          </div>
          <div class="hs-view">
            ${screenHTML(p)}
            <span class="hs-scan" aria-hidden="true"></span>
          </div>
        </div>
        <aside class="hs-info">
          <div class="hs-cat mono">${L(CATS[p.cat] || { es: p.cat, en: p.cat })} // ${num}</div>
          <h3 class="hs-title">${L(p.title)}</h3>
          <p class="hs-desc">${L(p.desc)}</p>
          <div class="hs-badges">${p.badges.map(b=>`<span class="badge">${b}</span>`).join('')}</div>
          <div class="hs-foot">${statusPill(p)}</div>
        </aside>`;
      track.appendChild(slide);
    });

    thumbsEl.innerHTML = '';
    list.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = 'holo-thumb cat-' + p.cat;
      b.setAttribute('aria-label', L(p.title));
      b.innerHTML = p.img
        ? `<img src="${p.img}" alt="" loading="lazy" draggable="false">`
        : `<span class="ht-glyph mono">${String(i + 1).padStart(2, '0')}</span>`;
      b.addEventListener('click', () => { setActive(i); restartAutoplay(); });
      thumbsEl.appendChild(b);
    });

    setActive(Math.min(active, list.length - 1), 0, true);
  }

  function setActive(i, dir, instant) {
    const n = list.length;
    active = ((i % n) + n) % n; // wrap both ways
    const slides = track.children;
    for (let k = 0; k < slides.length; k++) slides[k].classList.toggle('is-active', k === active);
    const thumbs = thumbsEl.children;
    for (let k = 0; k < thumbs.length; k++) thumbs[k].classList.toggle('is-active', k === active);
    // center the active thumb scrolling ONLY the rail — never the page
    const t = thumbs[active];
    if (t) {
      const left = t.offsetLeft - (thumbsEl.clientWidth - t.offsetWidth) / 2;
      thumbsEl.scrollTo({ left: Math.max(0, left), behavior: instant ? 'instant' : 'smooth' });
    }
    updateHUD();
    if (!instant && !reduced && window.anime) {
      const s = slides[active];
      window.anime({ targets: s.querySelector('.hs-screen'), translateX: [(dir || 1) * 46, 0], opacity: [0, 1], duration: 620, easing: 'easeOutCubic' });
      window.anime({ targets: s.querySelectorAll('.hs-info > *'), translateY: [18, 0], opacity: [0, 1], delay: window.anime.stagger(60, { start: 120 }), duration: 460, easing: 'easeOutCubic' });
    }
  }

  function updateHUD() {
    if (idxEl) idxEl.textContent = String(active + 1).padStart(2,'0') + ' / ' + String(list.length).padStart(2,'0');
    const p = list[active];
    if (catEl && p) catEl.textContent = L(CATS[p.cat] || { es: p.cat, en: p.cat });
    if (nameEl && p) nameEl.textContent = L(p.title);
  }

  function step(d) { setActive(active + d, d); }

  // ---- autoplay ----
  let inView = false;
  function startAutoplay() {
    if (reduced || timer) return;
    timer = setInterval(() => { if (!paused && inView && list.length > 1) step(1); }, AUTOPLAY_MS);
  }
  function restartAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
    startAutoplay();
  }

  function setFilter(f) {
    filter = f;
    list = f === 'todos' ? PROJECTS.slice() : PROJECTS.filter(p => p.cat === f);
    active = 0;
    document.querySelectorAll('.cmd-filter').forEach(b => b.classList.toggle('active', b.dataset.cat === f));
    build();
    restartAutoplay();
  }

  // re-render on language change
  const origApply = window.applyLang;
  window.applyLang = function (lang) { origApply(lang); if (track) build(); };

  document.addEventListener('DOMContentLoaded', () => {
    stage = document.getElementById('cmdStage');
    track = document.getElementById('cmdTrack');
    thumbsEl = document.getElementById('cmdThumbs');
    idxEl = document.getElementById('cmdIdx');
    catEl = document.getElementById('cmdCat');
    nameEl = document.getElementById('cmdName');
    if (!track) return;

    document.getElementById('cmdPrev').addEventListener('click', () => { step(-1); restartAutoplay(); });
    document.getElementById('cmdNext').addEventListener('click', () => { step(1); restartAutoplay(); });
    document.querySelectorAll('.cmd-filter').forEach(b => b.addEventListener('click', () => setFilter(b.dataset.cat)));

    // keyboard + drag
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { step(-1); restartAutoplay(); }
      if (e.key === 'ArrowRight') { step(1); restartAutoplay(); }
    });
    let sx = null;
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const d = e.clientX - sx;
      if (Math.abs(d) > 50) { step(d < 0 ? 1 : -1); restartAutoplay(); }
      sx = null;
    });

    // pause autoplay while the visitor inspects a slide
    ['pointerenter','focusin'].forEach(ev => stage.addEventListener(ev, () => { paused = true; }));
    ['pointerleave','focusout'].forEach(ev => stage.addEventListener(ev, () => { paused = false; }));

    // autoplay only while the showcase is on screen
    new IntersectionObserver((entries) => {
      entries.forEach(e => { inView = e.isIntersecting; });
    }, { threshold: 0.25 }).observe(stage);

    build();
    startAutoplay();
  });
})();
