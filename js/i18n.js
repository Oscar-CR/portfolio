/* ============================================================
   i18n — ES / EN content map.
   Each key maps to { es, en }. Values are plain text unless the
   element carries data-i18n-html (then innerHTML is used).
   ============================================================ */
window.I18N = {
  // nav
  "nav.home":   { es: "Inicio",        en: "Home" },
  "nav.skills": { es: "Habilidades",   en: "Skills" },
  "nav.proj":   { es: "Proyectos",     en: "Projects" },
  "nav.exp":    { es: "Experiencia",   en: "Experience" },
  "nav.cert":   { es: "Certificados",  en: "Certs" },
  "nav.info":   { es: "Más",           en: "More" },
  "nav.contact":{ es: "Contacto",      en: "Contact" },

  // hero
  "hero.hello": { es: "// Hola, soy", en: "// Hello, I am" },
  "hero.role":  { es: 'Ingeniero en TIC especializado en <span class="hl">desarrollo de software</span> e integración estratégica de <span class="hl">IA</span>.',
                  en: 'ICT Engineer specialized in <span class="hl">software development</span> and strategic <span class="hl">AI</span> integration.' },
  "hero.cta1":  { es: "Descargar CV",  en: "Download CV" },
  "hero.cta2":  { es: "Asistente de perfil", en: "Profile assistant" },
  "hero.scroll":{ es: "Desplaza",      en: "Scroll" },

  // skills
  "skills.eyebrow": { es: "Stack técnico", en: "Tech stack" },
  "skills.title":   { es: 'Habilidades <span class="accent">Técnicas</span>', en: 'Technical <span class="accent">Skills</span>' },
  "skills.desc":    { es: 'He desempeñado roles como <b>Desarrollador Web y Móvil, Diseñador UX/UI, Soporte de Aplicativos N1/N2 y Desarrollador IA</b>, adaptándome al stack que cada reto requiere.',
                      en: 'I have worked as a <b>Web & Mobile Developer, UX/UI Designer, App Support N1/N2 and AI Developer</b>, adapting to whatever stack each challenge demands.' },

  "cat.ai.title":   { es: "IA & Machine Learning", en: "AI & Machine Learning" },
  "cat.ai.items":   { es: "IA Generativa y Agentes (OpenAI, Gemini, Claude)|RAG: LangChain, ChromaDB, OCR, ETL|Búsqueda semántica & automatización|Ollama · modelos locales on-premise",
                      en: "Generative AI & Agents (OpenAI, Gemini, Claude)|RAG: LangChain, ChromaDB, OCR, ETL|Semantic search & automation|Ollama · local on-premise models" },
  "cat.web.title":  { es: "Web & Backend", en: "Web & Backend" },
  "cat.web.items":  { es: "Laravel (PHP) · Java Springboot|HTML, CSS, JS, Tailwind, Bootstrap|MySQL · Oracle DB|VPS GNU/Linux · Docker · Nginx",
                      en: "Laravel (PHP) · Java Springboot|HTML, CSS, JS, Tailwind, Bootstrap|MySQL · Oracle DB|GNU/Linux VPS · Docker · Nginx" },
  "cat.mobile.title": { es: "Móvil", en: "Mobile" },
  "cat.mobile.items": { es: "Flutter (Dart) · Swift · Kotlin|Servicios Firebase|Despliegue Google Play & App Store|Acceso a hardware (NFC, GPS, cámara)",
                        en: "Flutter (Dart) · Swift · Kotlin|Firebase services|Google Play & App Store deploys|Hardware access (NFC, GPS, camera)" },
  "cat.design.title": { es: "Diseño & Gestión", en: "Design & Management" },
  "cat.design.items": { es: "UX/UI · Figma · Miro|Design Thinking · Lean UX|Scrum Master · Jira · Trello|Wireframes · Prototipos · Design Systems",
                        en: "UX/UI · Figma · Miro|Design Thinking · Lean UX|Scrum Master · Jira · Trello|Wireframes · Prototypes · Design Systems" },

  // projects
  "proj.eyebrow": { es: "Trabajo seleccionado", en: "Selected work" },
  "proj.title":   { es: 'Proyectos <span class="accent">Destacados</span>', en: 'Featured <span class="accent">Projects</span>' },
  "proj.desc":    { es: 'Explora <b>11 proyectos</b> que he desarrollado: desde portales B2B y apps publicadas en tiendas, hasta soluciones de IA on-premise.', en: 'Explore <b>11 projects</b> I have delivered: from B2B portals and store-published apps to on-premise AI solutions.' },
  "cat.todos":    { es: "Todos", en: "All" },
  "cat.ia":       { es: "IA", en: "AI" },
  "cat.movil":    { es: "Móvil", en: "Mobile" },
  "cat.web":      { es: "Web", en: "Web" },

  "p1.title": { es: "E-commerce B2B", en: "B2B E-commerce" },
  "p1.desc":  { es: "Múltiples portales e-commerce B2B a la medida para compra y cotización de productos.",
                en: "Multiple custom B2B e-commerce portals for product purchase and quoting." },
  "p1.feats": { es: "Reglas de negocio a la medida con roles y permisos|Conexión a sistemas de compras internas del cliente|Stock en tiempo real con apartado de producto|Cotización automática y personalizador de productos",
                en: "Custom business rules with roles & permissions|Integration with client internal purchasing systems|Real-time stock with product reservation|Automatic quoting and product customizer" },

  "p2.title": { es: "Cotizador de Proveedores", en: "Supplier Quoting Engine" },
  "p2.desc":  { es: "Cotizador de productos promocionales conectado al inventario de múltiples proveedores con stock en tiempo real.",
                en: "Promotional-product quoting engine connected to multiple supplier inventories with real-time stock." },
  "p2.feats": { es: "Stock de productos en tiempo real|Carga masiva (API, CSV, XLSX, XML)|Utilidad y descuentos por proveedor/cliente/vendedor|Generación de PDF, email y presentaciones",
                en: "Real-time product stock|Bulk import (API, CSV, XLSX, XML)|Margin & discounts per supplier/client/seller|PDF, email and presentation generation" },

  "p3.title": { es: "Intranet Corporativa", en: "Corporate Intranet" },
  "p3.desc":  { es: "Sistema web y móvil para centralizar procesos, comunicación y gestión de actividades clave de la organización.",
                en: "Web & mobile system to centralize processes, communication and key organizational activities." },
  "p3.feats": { es: "Gestión de vacaciones y kits de contratación|Comunicados, publicaciones y aniversarios|Catálogo de proveedores y tickets de soporte|Repositorio de documentación interna",
                en: "Vacation management & onboarding kits|Announcements, posts and anniversaries|Supplier catalog and support tickets|Internal documentation repository" },

  "p4.title": { es: "Promo NFC", en: "Promo NFC" },
  "p4.desc":  { es: "App móvil interna para grabado masivo de tarjetas NFC, reduciendo tiempos del proceso significativamente.",
                en: "Internal mobile app for bulk NFC card encoding, drastically cutting process time." },
  "p4.feats": { es: "Lectura de archivos CSV y Excel|Carga y guardado de listas masivas|Compatibilidad con múltiples tarjetas RFID|Validador de URLs y datos grabados",
                en: "CSV & Excel file reading|Bulk list upload and storage|Compatible with multiple RFID cards|URL & encoded-data validator" },

  "p5.title": { es: "SegurApp", en: "SegurApp" },
  "p5.desc":  { es: "App de seguridad personal con rastreo en tiempo real hacia contactos de confianza.",
                en: "Personal-safety app with real-time tracking to trusted contacts." },
  "p5.feats": { es: "Notificaciones push (Firebase Cloud Messaging)|Mapbox para visualización y trackeo|Acceso a GPS y almacenamiento|Firestore + Room (SQLite) y APIs de seguridad pública",
                en: "Push notifications (Firebase Cloud Messaging)|Mapbox for visualization and tracking|GPS & local storage access|Firestore + Room (SQLite) and public-safety APIs" },

  "label.web":   { es: "Web", en: "Web" },
  "label.repo":  { es: "Repositorio", en: "Repository" },

  // experience
  "exp.eyebrow": { es: "Trayectoria", en: "Career" },
  "exp.title":   { es: 'Experiencia <span class="accent">Profesional</span>', en: 'Professional <span class="accent">Experience</span>' },
  "exp.desc":    { es: 'Selecciona una etapa para revisar mi experiencia, responsabilidades y logros en cada posición.', en: 'Select a stage to review my experience, responsibilities and outcomes in each role.' },

  "e1.role": { es: "Desarrollador IA", en: "AI Developer" },
  "e1.date": { es: "Sep 2025 — Actualidad", en: "Sep 2025 — Present" },
  "e1.desc": { es: "Levantamiento de requerimientos y colaboración con áreas de negocio para identificar oportunidades de automatización y transformación digital. Diseño e integración de soluciones con IA generativa (Laravel, Python): chatbots, agentes conversacionales, RAG, OCR, búsqueda semántica y asistentes internos para automatizar reportes, presentaciones, análisis documental y tareas programadas. Uso de Gemini, OpenAI, Claude, OpenCode y GitHub Copilot. Infraestructura on-premise sobre Ubuntu Server con Zero Trust, Cloudflare Tunnel, Nginx y modelos locales con Ollama, además de soporte TI, redes y Google Workspace/Cloud.",
               en: "Requirements gathering and collaboration with business areas to spot automation and digital-transformation opportunities. Design & integration of generative-AI solutions (Laravel, Python): chatbots, conversational agents, RAG, OCR, semantic search and internal assistants to automate reports, presentations, document analysis and scheduled tasks. Uses Gemini, OpenAI, Claude, OpenCode and GitHub Copilot. On-premise infrastructure on Ubuntu Server with Zero Trust, Cloudflare Tunnel, Nginx and local models via Ollama, plus IT support, networks and Google Workspace/Cloud." },

  "e2.role": { es: "Analista de Sistemas CRM", en: "CRM Systems Analyst" },
  "e2.date": { es: "Dic 2024 — Jun 2025", en: "Dec 2024 — Jun 2025" },
  "e2.desc": { es: "Soporte N1 y N2 al CRM en procesos críticos, apoyo en ventanas de mantenimiento, guardias post-despliegue y capacitación de cédula externa. Documentación de procesos técnicos que redujo la curva de aprendizaje del equipo y estableció una base de conocimiento. Análisis y mejora de procesos batch en Java/Springboot con Oracle, validación de colas IBM MQ en QA/desarrollo/productivo, apoyo a migraciones de BD y validación de servicios SOAP sobre WebSphere (WAS) con IBM RAD. Asistente de PM: seguimiento, minutas y reuniones técnicas.",
               en: "N1/N2 CRM support on critical processes, maintenance windows, post-deploy on-call and external-team training. Process documentation that reduced the team's learning curve and built a knowledge base. Analysis and improvement of batch processes in Java/Springboot with Oracle, IBM MQ queue validation across QA/dev/prod, DB-migration support and SOAP-service validation on WebSphere (WAS) with IBM RAD. PM assistant: tracking, minutes and technical meetings." },

  "e3.role": { es: "Desarrollador Web · Líder Backend", en: "Web Developer · Backend Lead" },
  "e3.date": { es: "Ene 2023 — Nov 2024", en: "Jan 2023 — Nov 2024" },
  "e3.desc": { es: "Gestión de proyectos y toma de requerimientos con clientes internos y externos: propuestas, avances y entregables. Líder de desarrollo backend: análisis con el equipo, asignación de tareas, seguimiento, mentorías y resolución de incidencias (Scrum, Planning Poker, MoSCoW, Trello, Monday). Coordinación con diseño y marketing. Desarrollador Fullstack de plataformas e-Commerce B2B a la medida (Laravel, MySQL, Tailwind) y apps Android/iOS con Flutter y Swift (JWT, push, servicios en segundo plano, SQLite, NFC) desplegadas en las tiendas.",
               en: "Project management and requirements gathering with internal/external clients: proposals, progress and deliverables. Backend dev lead: team analysis, task allocation, tracking, mentoring and issue resolution (Scrum, Planning Poker, MoSCoW, Trello, Monday). Coordination with design and marketing. Fullstack developer of custom B2B e-commerce platforms (Laravel, MySQL, Tailwind) and Android/iOS apps with Flutter & Swift (JWT, push, background services, SQLite, NFC) shipped to the stores." },

  "e4.role": { es: "Becario de Desarrollo", en: "Development Intern" },
  "e4.date": { es: "Sep 2021 — Ene 2023", en: "Sep 2021 — Jan 2023" },
  "e4.desc": { es: "Desarrollo de proyectos web para clientes internos (Laravel, MySQL, Bootstrap, Ajax, jQuery, WordPress, WooCommerce, JS) con despliegue en VPS. Apps móviles internas con Flutter y Firebase (Cloud Messaging, Analytics, Crashlytics) y creación de APIs backend, publicadas en Google Play y App Store. Diseño de propuestas visuales en Figma: wireframes, mockups, prototipos funcionales y design systems.",
               en: "Web projects for internal clients (Laravel, MySQL, Bootstrap, Ajax, jQuery, WordPress, WooCommerce, JS) deployed on VPS. Internal mobile apps with Flutter and Firebase (Cloud Messaging, Analytics, Crashlytics) plus backend APIs, published on Google Play and App Store. Visual design proposals in Figma: wireframes, mockups, functional prototypes and design systems." },

  // certs
  "cert.eyebrow": { es: "Acreditaciones", en: "Credentials" },
  "cert.title":   { es: 'Cursos y <span class="accent">Certificados</span>', en: 'Courses & <span class="accent">Certificates</span>' },
  "cert.desc":    { es: 'Seis credenciales verificables. Cada tarjeta abre su página de verificación oficial.', en: 'Six verifiable credentials. Each card opens its official verification page.' },
  "cert.verify":  { es: 'Verificar credencial', en: 'Verify credential' },
  "c1.name": { es: "Desarrollo Móvil", en: "Mobile Development" },
  "c2.name": { es: "Proyecto Ganador · Móvil", en: "Winning Project · Mobile" },
  "c3.name": { es: "Scrum Master", en: "Scrum Master" },
  "c4.name": { es: "Proyecto Ganador · Scrum", en: "Winning Project · Scrum" },
  "c5.name": { es: "IA y Machine Learning", en: "AI & Machine Learning" },
  "c6.name": { es: "Prototype · IA y ML", en: "Prototype · AI & ML" },
  "cert.issuer": { es: "BEDU + Santander Universidades", en: "BEDU + Santander Universidades" },

  // info
  "info.eyebrow": { es: "Fuera del código", en: "Beyond the code" },
  "info.title":   { es: 'Información <span class="accent">Adicional</span>', en: 'Additional <span class="accent">Info</span>' },
  "i1.title": { es: "Walmart Code Ecosystem", en: "Walmart Code Ecosystem" },
  "i1.tag":   { es: "RECONOCIMIENTO", en: "RECOGNITION" },
  "i1.rank":  { es: "TOP 2 · HACKATHON", en: "TOP 2 · HACKATHON" },
  "i1.date":  { es: "Sep 2025", en: "Sep 2025" },
  "i1.desc":  { es: "2.º lugar en el hackathon de Walmart, destacando por el enfoque centrado en el usuario y el diseño de la app presentada.",
                en: "2nd place at the Walmart hackathon, standing out for its user-centered approach and app design." },
  "i2.title": { es: "Personalización GNU/Linux", en: "GNU/Linux Ricing" },
  "i2.cmd1":  { es: "whoami --pasiones", en: "whoami --passions" },
  "i2.out1":  { es: "metal · videojuegos · conciertos · gym", en: "metal · gaming · concerts · gym" },
  "i2.cmd2":  { es: "cat ~/.config/sobre_mi", en: "cat ~/.config/about_me" },
  "i2.date":  { es: "2016 — Actualidad", en: "2016 — Present" },
  "i2.desc":  { es: "He profundizado en el mundo de GNU/Linux desde 2016: me gusta personalizar el Sistema Operativo completo, a la medida de mis necesidades, el solucionar errores y hacer de Linux un entorno comodo para trabajar.",
                en: "I've been immersed in the GNU/Linux world since 2016. I enjoy customizing the entire operating system to fit my needs, troubleshooting issues, and turning Linux into a comfortable and productive environment to work in." },

  // contact
  "cta.title": { es: "¿Tienes una idea? Construyámosla.", en: "Got an idea? Let's build it." },
  "cta.eyebrow": { es: "Disponible para proyectos", en: "Available for projects" },
  "cta.avail": { es: "DISPONIBLE PARA NUEVOS PROYECTOS", en: "AVAILABLE FOR NEW PROJECTS" },
  "tx.head": { es: "CONSULTA DE PROYECTO", en: "PROJECT INQUIRY" },
  "tx.status": { es: "● ACTIVO", en: "● ACTIVE" },
  "cta.desc":  { es: "Apps móviles, sistemas con IA, automatización de procesos, aplicaciones web — convierto ideas en productos reales. ¡Hablemos!",
                 en: "Mobile apps, AI-powered systems, process automation, web applications — I turn ideas into real products. Let's talk." },
  "footer.text": { es: "Diseñado y codificado por Oscar Chávez Rosales", en: "Designed & coded by Oscar Chávez Rosales" },

  // Profile assistant
  "aria.name":    { es: "Asistente de perfil", en: "Profile assistant" },
  "aria.sub":     { es: "En línea", en: "Online" },
  "aria.greet":   { es: "Hola, soy el asistente de perfil de Oscar. Pregúntame sobre su experiencia, stack, proyectos o cómo contactarlo.",
                    en: "Hi, I'm Oscar's profile assistant. Ask me about his experience, stack, projects, or how to reach him." },
  "aria.s1": { es: "¿Qué hace con IA?", en: "What does he do with AI?" },
  "aria.s2": { es: "Su stack principal", en: "His main stack" },
  "aria.s3": { es: "¿Cómo lo contacto?", en: "How do I contact him?" },
  "aria.placeholder": { es: "Pregunta sobre Oscar…", en: "Ask about Oscar…" },
  "aria.thinking": { es: "El asistente está pensando", en: "The assistant is thinking" },
  "aria.error": { es: "Ups, no pude procesar eso. Intenta de nuevo o escribe a oscar.chavez.dev@gmail.com.",
                  en: "Oops, I couldn't process that. Try again or email oscar.chavez.dev@gmail.com." },
  "game.hint":  { es: "DYNO RUNNER — pulsa ESPACIO o toca para saltar", en: "DYNO RUNNER — press SPACE or tap to jump" },
  "game.start": { es: "Pulsa ESPACIO para iniciar", en: "Press SPACE to start" },
  "game.over":  { es: "GAME OVER · pulsa ESPACIO para reintentar", en: "GAME OVER · press SPACE to retry" },
  "game.score": { es: "PUNTOS", en: "SCORE" },
  "game.best":  { es: "RÉCORD", en: "BEST" },
};

window.applyLang = function (lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const entry = window.I18N[el.getAttribute('data-i18n')];
    if (!entry) return;
    const val = entry[lang] != null ? entry[lang] : entry.es;
    if (el.hasAttribute('data-i18n-html')) el.innerHTML = val;
    else el.textContent = val;
  });
  // list-type keys: render <li> items split by |
  document.querySelectorAll('[data-i18n-list]').forEach(el => {
    const entry = window.I18N[el.getAttribute('data-i18n-list')];
    if (!entry) return;
    const val = entry[lang] != null ? entry[lang] : entry.es;
    el.innerHTML = val.split('|').map(t => `<li>${t}</li>`).join('');
  });
  // placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const entry = window.I18N[el.getAttribute('data-i18n-ph')];
    if (entry) el.placeholder = entry[lang] != null ? entry[lang] : entry.es;
  });
  window.CURRENT_LANG = lang;
  try { localStorage.setItem('ocr_lang', lang); } catch (e) {}
};
