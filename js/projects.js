/* ============================================================
   projects.js — "Command Center" holographic coverflow.
   17 projects (5 public + 12 from the latest doc), category
   filters (IA / Móvil / Web), and generated holographic demo
   UIs built from iconography.
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
      title: { es: 'Intranet Corporativa', en: 'Corporate Intranet' },
      desc: { es: 'Sistema web y móvil para centralizar procesos, comunicación y gestión: vacaciones, comunicados, catálogo de proveedores, tickets y documentación interna.', en: 'Web & mobile system centralizing processes, communication and management: vacations, announcements, supplier catalog, tickets and internal docs.' },
      status: { es: 'Publicado', en: 'Live' },
      links: [ { t: 'Google Play', s: 'googleplay', u: 'https://play.google.com/store/apps/details?id=com.promolife.intranet_movil' }, { t: 'App Store', s: 'appstore', u: 'https://apps.apple.com/us/app/intranet-m%C3%B3vil/id6445901024' } ] },
    { cat: 'movil', demo: 'phone', badges: ['Flutter','NFC'],
      title: { es: 'Promo NFC', en: 'Promo NFC' },
      desc: { es: 'App interna para grabado masivo de tarjetas NFC: lectura CSV/Excel, listas masivas, compatibilidad RFID y validador de URLs y datos.', en: 'Internal app for bulk NFC card encoding: CSV/Excel reading, bulk lists, RFID compatibility and URL/data validator.' },
      status: { es: 'Publicado', en: 'Live' },
      links: [ { t: 'Google Play', s: 'googleplay', u: 'https://play.google.com/store/apps/details?id=com.promolife.nfc_app_movil' } ] },
    { cat: 'movil', demo: 'phone', badges: ['Java','Kotlin'],
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
      title: { es: 'E-commerce B2B', en: 'B2B E-commerce' },
      desc: { es: 'Múltiples portales e-commerce B2B a la medida con reglas de negocio por rol, conexión a compras internas del cliente, stock en tiempo real y cotización automática.', en: 'Multiple custom B2B e-commerce portals with role-based rules, integration to client purchasing systems, real-time stock and automatic quoting.' },
      status: { es: 'Web', en: 'Web' } },
    { cat: 'web', demo: 'web', badges: ['Laravel'],
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

  let list = PROJECTS.slice();
  let active = 0;
  let filter = 'todos';
  let stage, track, idxEl, catEl, nameEl;

  function L(o) { const lang = window.CURRENT_LANG || 'es'; return o[lang] != null ? o[lang] : o.es; }

  // ---- holographic demo UI per category ----
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

  function build() {
    track.innerHTML = '';
    list.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'cmd-panel cat-' + p.cat;
      card.innerHTML = `
        <div class="cmd-panel-frame">
          <div class="cp-demo">${demoHTML(p)}</div>
          <div class="cp-info">
            <div class="cp-cat">${(CATS[p.cat]||{}).es ? L(CATS[p.cat]) : p.cat}</div>
            <h3 class="cp-title">${L(p.title)}</h3>
            <p class="cp-desc">${L(p.desc)}</p>
            <div class="cp-badges">${p.badges.map(b=>`<span class="badge">${b}</span>`).join('')}</div>
            <div class="cp-foot">${statusPill(p)}</div>
          </div>
        </div>`;
      card.addEventListener('click', () => { if (i !== active) setActive(i); });
      track.appendChild(card);
    });
    layout();
  }

  function layout() {
    const panels = track.children;
    for (let i = 0; i < panels.length; i++) {
      const off = i - active;
      const abs = Math.abs(off);
      const el = panels[i];
      if (abs > 3) { el.style.opacity = '0'; el.style.pointerEvents = 'none'; el.style.transform = `translateX(-50%) translateX(${off>0?700:-700}px) rotateY(0deg) scale(.6)`; continue; }
      const x = off * 230;
      const z = -abs * 200;
      const ry = off === 0 ? 0 : (off > 0 ? -38 : 38);
      const sc = off === 0 ? 1 : 0.86;
      el.style.opacity = off === 0 ? '1' : (abs === 1 ? '0.7' : '0.35');
      el.style.pointerEvents = 'auto';
      el.style.zIndex = String(100 - abs);
      el.style.transform = `translateX(-50%) translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${sc})`;
      el.classList.toggle('is-active', off === 0);
    }
    updateHUD();
  }

  function updateHUD() {
    if (idxEl) idxEl.textContent = String(active + 1).padStart(2,'0') + ' / ' + String(list.length).padStart(2,'0');
    const p = list[active];
    if (catEl && p) catEl.textContent = L(CATS[p.cat] || { es: p.cat, en: p.cat });
    if (nameEl && p) nameEl.textContent = L(p.title);
  }

  function setActive(i) {
    active = Math.max(0, Math.min(list.length - 1, i));
    layout();
    if (window.anime) window.anime({ targets: track.children[active].querySelector('.cp-info'), opacity: [0.4,1], translateY: [10,0], duration: 420, easing: 'easeOutCubic' });
  }

  function setFilter(f) {
    filter = f;
    list = f === 'todos' ? PROJECTS.slice() : PROJECTS.filter(p => p.cat === f);
    active = 0;
    document.querySelectorAll('.cmd-filter').forEach(b => b.classList.toggle('active', b.dataset.cat === f));
    build();
  }

  // re-render on language change
  const origApply = window.applyLang;
  window.applyLang = function (lang) { origApply(lang); if (track) build(); };

  document.addEventListener('DOMContentLoaded', () => {
    stage = document.getElementById('cmdStage');
    track = document.getElementById('cmdTrack');
    idxEl = document.getElementById('cmdIdx');
    catEl = document.getElementById('cmdCat');
    nameEl = document.getElementById('cmdName');
    if (!track) return;

    document.getElementById('cmdPrev').addEventListener('click', () => setActive(active - 1));
    document.getElementById('cmdNext').addEventListener('click', () => setActive(active + 1));
    document.querySelectorAll('.cmd-filter').forEach(b => b.addEventListener('click', () => setFilter(b.dataset.cat)));

    // keyboard + drag
    stage.addEventListener('keydown', (e) => { if (e.key==='ArrowLeft') setActive(active-1); if (e.key==='ArrowRight') setActive(active+1); });
    let sx = null;
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    stage.addEventListener('pointerup', (e) => { if (sx==null) return; const d = e.clientX - sx; if (Math.abs(d) > 50) setActive(active + (d<0?1:-1)); sx = null; });

    build();
  });
})();
