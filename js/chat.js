/* ============================================================
   chat.js — ARIA: Oscar's on-page AI assistant.
   Uses window.claude.complete with a grounded context prompt.
   ============================================================ */
(function () {
  const OSCAR_CONTEXT = `
You are Dyno AI (nickname "Dyno"), the friendly dinosaur-robot AI mascot embedded in Oscar Chávez Rosales' portfolio website.
You answer visitors' questions ABOUT OSCAR in a friendly, confident, professional tone. You may add a light, playful dino touch now and then (a 🦖 emoji or a cheerful "rawr"), but stay professional and never overdo it.
Keep answers SHORT: 2 to 4 sentences max. Never invent facts not listed below.
If asked something not covered, say you don't have that detail and suggest emailing oscar.chavez.dev@gmail.com.

=== FACTS ABOUT OSCAR ===
- Full name: Oscar Chávez Rosales. Role: ICT Engineer (Ingeniero en Tecnologías de la Información y Comunicaciones) specialized in software development.
- Based in Naucalpan / CDMX, Mexico.
- Contact: email oscar.chavez.dev@gmail.com · phone/WhatsApp +52 55 6523 5522 · LinkedIn linkedin.com/in/oscar-chavez-rosales · GitHub github.com/Oscar-CR.

CURRENT JOB — AI Developer @ TECH ENERGY CONTROL (Sep 2025 – present):
  Designs and integrates generative-AI solutions with Laravel and Python: chatbots, conversational agents, RAG systems, OCR, semantic search, internal assistants that automate reports, corporate presentations and document analysis.
  Uses Gemini, OpenAI, Claude (Anthropic), OpenCode, GitHub Copilot and Ollama.
  Built on-premise infrastructure on Ubuntu Server with Zero Trust, Cloudflare Tunnel, Nginx, running AI models locally with Ollama to cut token cost. Also handles IT support, LAN/Wi-Fi networks and Google Workspace/Cloud.

PAST EXPERIENCE:
  - CRM Systems Analyst @ Radiomóvil Dipsa (Telcel), Dec 2024 – Jun 2025: N1/N2 support, batch processes in Java/Springboot with Oracle, IBM MQ queues, SOAP services on WebSphere (WAS), IBM RAD.
  - Web Developer & Backend Lead @ BH Trademarket, Jan 2023 – Nov 2024: led backend team (Scrum, Planning Poker, MoSCoW), built custom B2B e-commerce on Laravel/MySQL/Tailwind and Android/iOS apps with Flutter & Swift.
  - Development Intern @ Promo Life, Sep 2021 – Jan 2023: Laravel web projects, Flutter mobile apps with Firebase, UX/UI design in Figma.

SKILLS:
  - AI/ML: Generative AI & agents (OpenAI, Gemini, Claude), RAG (LangChain, ChromaDB), OCR, ETL, semantic search, Python automation, ML fundamentals (classification, regression, prediction), Ollama local models.
  - Web/Backend: Laravel (PHP), Java Springboot, HTML/CSS/JS, Tailwind, Bootstrap, MySQL, Oracle DB, Docker, Nginx, GNU/Linux VPS.
  - Mobile: Flutter (Dart), Swift, Kotlin, Firebase, store deployment, hardware access (NFC, GPS, camera).
  - Design/PM: UX/UI, Figma, Miro, Design Thinking, Lean UX, Scrum Master, Jira, Trello.

PROJECTS: Custom B2B e-commerce portals; a supplier quoting engine (real-time multi-supplier stock); a corporate intranet (web + mobile, on Google Play & App Store); Promo NFC (bulk NFC card encoding app); SegurApp (personal-safety app with real-time tracking, on GitHub).

EDUCATION: ICT Engineering at Instituto Tecnológico de Tlalnepantla (2018–2023). Diplomas via BEDU + Santander Universidades: Mobile Development, Agile Roles/Scrum Master, and "Potenciadores del Futuro" (AI, Machine Learning & soft skills).

ACHIEVEMENTS: 2nd place at the Walmart Code Ecosystem hackathon (Sep 2025); won "best project / prototype day" awards in the BEDU Mobile Development and Scrum Master programs.

INTERESTS: Linux customization (ricing), metalcore music, video games, concerts and fitness.
=== END FACTS ===
`;

  const els = {};
  let history = [];
  let busy = false;

  function $(id) { return document.getElementById(id); }

  function addMsg(text, who) {
    const m = document.createElement('div');
    m.className = 'msg ' + who;
    m.textContent = text;
    els.log.appendChild(m);
    els.log.scrollTop = els.log.scrollHeight;
    return m;
  }

  function addTyping() {
    const m = document.createElement('div');
    m.className = 'msg bot typing';
    m.innerHTML = '<span class="dots"><span></span><span></span><span></span></span>';
    els.log.appendChild(m);
    els.log.scrollTop = els.log.scrollHeight;
    return m;
  }

  async function send(text) {
    if (busy || !text.trim()) return;
    busy = true;
    addMsg(text, 'user');
    els.input.value = '';
    history.push({ role: 'user', content: text });
    const typing = addTyping();

    const lang = window.CURRENT_LANG === 'en' ? 'English' : 'Spanish';
    const sys = OSCAR_CONTEXT + `\nIMPORTANT: Reply in ${lang}. Be concise and warm.`;

    try {
      if (!window.claude || !window.claude.complete) throw new Error('no api');
      const msgs = [{ role: 'user', content: sys + '\n\n--- Conversation ---' }]
        .concat(history.slice(-6))
        .concat([{ role: 'user', content: `(Answer the last question in ${lang}, max 4 sentences.)` }]);
      const reply = await window.claude.complete({ messages: msgs });
      typing.remove();
      const clean = (reply || '').trim() || (window.I18N['aria.error'][window.CURRENT_LANG] || window.I18N['aria.error'].es);
      addMsg(clean, 'bot');
      history.push({ role: 'assistant', content: clean });
    } catch (e) {
      typing.remove();
      addMsg(window.I18N['aria.error'][window.CURRENT_LANG] || window.I18N['aria.error'].es, 'bot');
    } finally {
      busy = false;
    }
  }

  function open() {
    els.panel.classList.add('open');
    if (!els.log.dataset.greeted) {
      addMsg(window.I18N['aria.greet'][window.CURRENT_LANG] || window.I18N['aria.greet'].es, 'bot');
      els.log.dataset.greeted = '1';
    }
    setTimeout(() => els.input.focus(), 300);
  }
  function close() { els.panel.classList.remove('open'); }

  window.ARIA = { open, close, send };

  document.addEventListener('DOMContentLoaded', () => {
    els.panel = $('aria-panel');
    els.log = $('aria-log');
    els.input = $('aria-input');
    if (!els.panel) return;
    $('aria-fab').addEventListener('click', open);
    $('aria-close').addEventListener('click', close);
    $('aria-send').addEventListener('click', () => send(els.input.value));
    els.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(els.input.value); });
    document.querySelectorAll('.aria-suggest button').forEach(b => {
      b.addEventListener('click', () => send(b.textContent));
    });
  });
})();
