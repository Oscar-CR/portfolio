/* ============================================================
   projects.js — "Holo-Showcase" 70/30.
   11 projects (10 with real screenshots), category filters
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
      imgs: ['img/explorador1.png', 'img/explorador2.png'], fit: 'contain',
      alt: [
        { es: 'Portada del Explorador IA con la asistente EVIA e inicio de sesión corporativo', en: 'AI Explorer landing page with the EVIA assistant and corporate sign-in' },
        { es: 'Panel de aplicaciones del Explorador IA con los módulos habilitados por rol', en: 'AI Explorer app dashboard with the modules enabled per role' }
      ],
      title: { es: 'Explorador IA', en: 'AI Explorer' },
      desc: { es: 'Punto único de acceso a la IA de la empresa. Cada colaborador entra con su cuenta corporativa y encuentra habilitados los módulos que le corresponden según su rol: asistente conversacional, búsqueda documental, noticias del sector, recomendaciones y soporte técnico.', en: "Single entry point to the company's AI. Each employee signs in with their corporate account and finds the modules enabled for their role: conversational assistant, document search, industry news, recommendations and tech support." },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'ia', demo: 'infra', badges: ['Linux','Nginx','Ollama','ChromaDB'],
      img: 'img/infra.png', fit: 'diagram',
      alt: { es: 'Diagrama de arquitectura: Cloudflare Zero Trust, Nginx como proxy, backend Laravel y capa de datos e IA local', en: 'Architecture diagram: Cloudflare Zero Trust, Nginx proxy, Laravel backend and the local data/AI layer' },
      title: { es: 'Infraestructura IA Local', en: 'Local AI Infrastructure' },
      desc: { es: 'Servidor Linux propio que corre la IA de la empresa sin mandar información a terceros. Nginx reparte el tráfico entre 11 servicios —Ollama, Open WebUI, AnythingLLM, Paperless-NGX para OCR, n8n y las apps internas— y el acceso desde fuera pasa por Cloudflare Zero Trust.', en: "Company-owned Linux server that runs the AI stack without sending data to third parties. Nginx distributes traffic across 11 services —Ollama, Open WebUI, AnythingLLM, Paperless-NGX for OCR, n8n and the internal apps— and outside access goes through Cloudflare Zero Trust." },
      status: { es: 'On-premise', en: 'On-premise' } },
    { cat: 'ia', demo: 'ai', badges: ['Python','ChromaDB','RAG'],
      img: 'img/rag.png', fit: 'contain',
      alt: { es: 'Buscador de documentos con arquitectura RAG: repositorio corporativo, razonamiento profundo y consulta en lenguaje natural', en: 'Document search with RAG architecture: corporate repository, deep reasoning and natural-language querying' },
      title: { es: 'Sistema RAG de IA Local', en: 'Local RAG AI System' },
      desc: { es: 'Buscador que responde preguntas sobre la documentación interna en lenguaje natural. Los documentos se indexan por significado y no por palabra clave, y el modelo redacta la respuesta apoyándose solo en los fragmentos recuperados, de un documento o de todo el repositorio.', en: 'Search tool that answers questions about internal documentation in plain language. Documents are indexed by meaning rather than keywords, and the model writes each answer from the retrieved passages alone — either from one selected document or across the whole repository.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'ia', demo: 'agents', badges: ['Gemini','Claude','Prompt Engineering'],
      // edit these to match the real departments — the demo UI reads this list
      depts: [
        { es: 'Compras',  en: 'Procurement', m: 'g' },
        { es: 'Ventas',   en: 'Sales',       m: 'c' },
        { es: 'RRHH',     en: 'HR',          m: 'g' },
        { es: 'Almacén',  en: 'Warehouse',   m: 'g' },
        { es: 'Finanzas', en: 'Finance',     m: 'c' },
        { es: 'TI',       en: 'IT',          m: 'c' }
      ],
      title: { es: 'Agentes por Departamento', en: 'Department AI Agents' },
      desc: { es: 'Un agente por área, armado como Gem de Gemini o proyecto de Claude. Cada uno carga el contexto, el tono y los formatos de su departamento, así las tareas repetitivas —redactar documentos, resumir información, responder consultas frecuentes— dejan de empezar desde cero.', en: "One agent per area, built as a Gemini Gem or a Claude project. Each carries its department's context, tone and document formats, so repetitive work —drafting documents, summarizing information, answering recurring questions— no longer starts from scratch." },
      status: { es: 'Interno', en: 'Internal' } },

    // ===== MÓVIL =====
    { cat: 'movil', demo: 'phone', badges: ['Laravel','Flutter'],
      img: 'img/intranet.png',
      alt: { es: 'Pantallas web y móviles de la Intranet Corporativa', en: 'Web and mobile screens of the Corporate Intranet' },
      title: { es: 'Intranet Corporativa', en: 'Corporate Intranet' },
      desc: { es: 'Intranet web y app móvil publicadas en ambas tiendas. Reúne en un solo lugar los trámites del día a día: solicitudes de vacaciones, comunicados internos, catálogo de proveedores, tickets de soporte y documentación de la empresa.', en: 'Web intranet plus a mobile app published on both stores. It brings day-to-day paperwork into one place: vacation requests, internal announcements, the supplier catalog, support tickets and company documentation.' },
      status: { es: 'Publicado', en: 'Live' },
      links: [ { t: 'Google Play', s: 'googleplay', u: 'https://play.google.com/store/apps/details?id=com.promolife.intranet_movil' }, { t: 'App Store', s: 'appstore', u: 'https://apps.apple.com/us/app/intranet-m%C3%B3vil/id6445901024' } ] },
    { cat: 'movil', demo: 'phone', badges: ['Flutter','NFC'],
      img: 'img/promonfc.png',
      alt: { es: 'Flujo de pantallas de la app Promo NFC: carga masiva y grabado de tarjetas', en: 'Promo NFC app screen flow: bulk upload and card encoding' },
      title: { es: 'Promo NFC', en: 'Promo NFC' },
      desc: { es: 'App interna para grabar tarjetas NFC por lotes en vez de una por una: se carga un CSV o Excel con los destinos, se validan las URLs y los datos antes de escribir, y se graba la lista completa. Compatible con tarjetas RFID.', en: 'Internal app for encoding NFC cards in batches instead of one at a time: load a CSV or Excel file with the targets, validate every URL and field before writing, then encode the whole list. Works with RFID cards too.' },
      status: { es: 'Publicado', en: 'Live' },
      links: [ { t: 'Google Play', s: 'googleplay', u: 'https://play.google.com/store/apps/details?id=com.promolife.nfc_app_movil' } ] },
    { cat: 'movil', demo: 'phone', badges: ['Java','Kotlin'],
      img: 'img/segurapp.png',
      alt: { es: 'Pantallas de SegurApp: mapa, contactos de confianza y registro', en: 'SegurApp screens: map, trusted contacts and sign-up' },
      title: { es: 'SegurApp', en: 'SegurApp' },
      desc: { es: 'App de seguridad personal que comparte la ubicación en vivo con una lista de contactos de confianza. Mapas con Mapbox sobre GPS, alertas push por FCM, sincronización en Firestore con caché local en Room y consulta a APIs de seguridad pública.', en: 'Personal-safety app that shares live location with a list of trusted contacts. Mapbox mapping over GPS, push alerts through FCM, Firestore sync backed by a local Room cache, and public-safety API lookups.' },
      status: { es: 'Open source', en: 'Open source' },
      links: [ { t: 'Repositorio', s: 'github', u: 'https://github.com/Oscar-CR/bedu-segurapp' } ] },

    // ===== WEB =====
    { cat: 'web', demo: 'web', badges: ['Laravel','MySQL','Tailwind'],
      img: 'img/portales.png',
      alt: { es: 'Portales e-commerce B2B: catálogo, detalle de producto e inicio de sesión', en: 'B2B e-commerce portals: catalog, product detail and login' },
      title: { es: 'E-commerce B2B', en: 'B2B E-commerce' },
      desc: { es: 'Portales de venta B2B hechos a la medida de cada cliente. Cada uno aplica sus propios precios y permisos según el rol de quien compra, se conecta al sistema de compras del cliente, consulta existencias en tiempo real y arma la cotización sin pasos manuales.', en: "B2B sales portals built to each client's own rules. Every one applies its own pricing and permissions based on the buyer's role, hooks into the client's purchasing system, checks stock in real time and assembles quotes with no manual step." },
      status: { es: 'Web', en: 'Web' } },
    { cat: 'web', demo: 'web', badges: ['Laravel'],
      img: 'img/cotizador.png',
      alt: { es: 'Pantallas del cotizador de proveedores: catálogo, configuración y resumen', en: 'Supplier quoting engine screens: catalog, configuration and summary' },
      title: { es: 'Cotizador de Proveedores', en: 'Supplier Quoting Engine' },
      desc: { es: 'Cotizador de productos promocionales que consulta el inventario de varios proveedores a la vez. Los catálogos entran por API, CSV, XLSX o XML; el sistema aplica el margen que toca a cada eslabón de la cadena y entrega la cotización lista en PDF o por correo.', en: 'Quoting engine for promotional products that queries several supplier inventories at once. Catalogs arrive via API, CSV, XLSX or XML; the system applies the right margin for each link in the chain and delivers the finished quote as a PDF or by email.' },
      status: { es: 'Web', en: 'Web' } },
    { cat: 'web', demo: 'web', badges: ['Laravel','MySQL'],
      img: 'img/inventario.png', fit: 'contain',
      alt: { es: 'Inventario de almacén: catálogo de 1,604 registros con filtros, existencias y movimientos por pieza', en: 'Warehouse inventory: 1,604-record catalog with filters, stock levels and per-item movements' },
      title: { es: 'Sistema Integral de Inventario', en: 'Integrated Inventory System' },
      desc: { es: 'Control de almacén sobre un catálogo de más de 1,600 piezas. Cada artículo registra su ubicación, la existencia disponible y apartada, y su historial de entradas y salidas. Desde ahí se solicitan y trasladan piezas, se marcan las no conformes y se carga el catálogo por Excel.', en: 'Warehouse control over a catalog of more than 1,600 items. Each one records its physical location, available and reserved stock, and its full movement history. Staff request and transfer items, flag non-conforming pieces and bulk-load the catalog from Excel in the same place.' },
      status: { es: 'Interno', en: 'Internal' } },
    { cat: 'web', demo: 'web', badges: ['Laravel'],
      img: 'img/cartera.png', fit: 'contain',
      alt: { es: 'Vista ejecutiva de la cartera de clientes: KPIs, pipeline y detalle de ofertas', en: 'Client portfolio executive view: KPIs, pipeline and offer detail' },
      title: { es: 'Cartera de Clientes', en: 'Client Portfolio' },
      desc: { es: 'Seguimiento de la cartera comercial, de la oportunidad al cierre: ofertas y su probabilidad de ganar, clientes por sector, asignación de recursos, listas de material y control financiero. La vista ejecutiva resume los indicadores y acepta preguntas en lenguaje natural.', en: 'Tracks the commercial portfolio from opportunity to project close: bids and their win probability, clients by sector, resource assignment, material lists and financial control. The executive view rolls up the indicators and takes questions in plain language.' },
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
    const tech = p.badges.filter(b => ['Laravel','Flutter','Python','MySQL','Tailwind','Nginx','Ollama','ChromaDB','n8n','Java','Kotlin','Gemini','Claude'].includes(b))
      .map(b => ({ Laravel:'laravel', Flutter:'flutter', Python:'python', MySQL:'mysql', Tailwind:'tailwindcss', Nginx:'nginx', Ollama:'ollama', ChromaDB:'', n8n:'n8n', Java:'openjdk', Kotlin:'kotlin', Gemini:'googlegemini', Claude:'claude' })[b])
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
    if (p.demo === 'agents') {
      const depts = p.depts || [];
      return `<div class="demo demo-agents">
        <div class="dag-head">
          <span class="dag-hub"></span>
          <span class="dag-label mono">${L({ es: 'AGENTES', en: 'AGENTS' })}</span>
          <span class="dag-count mono">${String(depts.length).padStart(2, '0')}</span>
        </div>
        <div class="dag-grid">
          ${depts.map((d, k) => `<span class="dag-agent ${d.m === 'c' ? 'is-claude' : 'is-gemini'}" style="animation-delay:${(k * 0.26).toFixed(2)}s"><i></i>${L(d)}</span>`).join('')}
        </div>
        <div class="dag-flow"><i></i><i></i><i></i></div>
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

  // a project may carry one screenshot (img) or several (imgs, crossfaded)
  function shotsOf(p) { return p.imgs || (p.img ? [p.img] : null); }

  function altOf(p, k) {
    if (!p.alt) return L(p.title);
    return L(Array.isArray(p.alt) ? (p.alt[k] || p.alt[0]) : p.alt);
  }

  function screenHTML(p) {
    const shots = shotsOf(p);
    if (!shots) return `<div class="hs-demo">${demoHTML(p)}</div>`;
    const multi = shots.length > 1;
    // 'contain' = show the whole capture; 'diagram' = same, with extra padding
    const fit = p.fit === 'diagram' ? ' fit-contain is-diagram'
              : p.fit === 'contain' ? ' fit-contain' : '';
    return shots.map((src, k) =>
      `<img class="hs-img${fit}${multi ? ' is-multi' : ''}${multi && k === 0 ? ' on' : ''}" src="${src}" alt="${altOf(p, k)}" loading="lazy" draggable="false">`
    ).join('');
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
      const shots = shotsOf(p);
      b.innerHTML = shots
        ? `<img src="${shots[0]}" alt="" loading="lazy" draggable="false">`
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
    resetShots(slides[active]);
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

  /* ---- crossfade between the shots of the active slide ---- */
  const SHOT_MS = 3400;
  let shotTimer = null;

  function resetShots(slide) {
    if (!slide) return;
    slide.querySelectorAll('.hs-img.is-multi').forEach((im, k) => im.classList.toggle('on', k === 0));
  }

  function startShots() {
    if (reduced || shotTimer) return;
    shotTimer = setInterval(() => {
      const slide = track.children[active];
      if (!slide) return;
      const shots = slide.querySelectorAll('.hs-img.is-multi');
      if (shots.length < 2) return;
      let cur = 0;
      shots.forEach((im, k) => { if (im.classList.contains('on')) cur = k; });
      shots[cur].classList.remove('on');
      shots[(cur + 1) % shots.length].classList.add('on');
    }, SHOT_MS);
  }

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
    startShots();
  });
})();
