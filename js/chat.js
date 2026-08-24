/* ============================================================
   chat.js — profile assistant front end.

   Every question goes to the Laravel endpoint, which holds the
   API key and talks to the configured AI provider. The local
   knowledge base below is NOT the primary path any more — it is
   the offline fallback, so the panel still answers the common
   questions if the service is down, unconfigured or rate-limited.
   ============================================================ */
(function () {

  const meta = (name) => {
    const el = document.querySelector('meta[name="' + name + '"]');
    return el ? el.getAttribute('content') : '';
  };

  const ENDPOINT = meta('assistant-endpoint');
  const CSRF = meta('csrf-token');
  const HISTORY_TURNS = 6;

  /* ── Offline fallback knowledge base ── */
  const KB = {
    es: {
      greet: 'Hola, soy el asistente de perfil de Oscar. Puedes preguntarme sobre su experiencia, tecnologías, proyectos o cómo contactarlo.\n\nUsa los accesos rápidos de abajo o escribe tu pregunta.',
      ia: 'Oscar trabaja con IA generativa y agentes:\n• Chatbots y asistentes conversacionales\n• RAG con LangChain y ChromaDB\n• OCR, búsqueda semántica y automatización en Python\n• Integra OpenAI, Gemini, Claude y Ollama (modelos locales)\n• Infraestructura on-premise Ubuntu + Cloudflare Zero Trust',
      stack: 'Stack principal:\n• Backend: Laravel · PHP · Python · Java · Springboot\n• Mobile: Flutter · Dart · Swift · Kotlin\n• BD: MySQL · Oracle DB\n• Infra: Linux · Docker · Nginx · Cloudflare\n• Frontend: React · Tailwind · Bootstrap\n• IA: LangChain · ChromaDB · Ollama · OpenAI SDK · Gemini · Claude',
      contact: 'Contacta a Oscar:\n• Email: oscar.chavez.dev@gmail.com\n• WhatsApp: +52 55 6523 5522\n• LinkedIn: linkedin.com/in/oscar-chavez-rosales\n• GitHub: github.com/Oscar-CR',
      experience: 'Trayectoria profesional:\n• Desarrollador IA @ Tech Energy Control (Sep 2025–hoy)\n• Analista CRM @ Telcel (Dic 2024–Jun 2025)\n• Líder Backend @ BH Trademarket (Ene 2023–Nov 2024)\n• Becario @ Promo Life (Sep 2021–Ene 2023)',
      projects: 'Proyectos destacados:\n• E-commerce B2B personalizado (Laravel/MySQL)\n• Motor de cotización multi-proveedor en tiempo real\n• Intranet corporativa web + móvil (Play Store y App Store)\n• Promo NFC — codificación masiva de tarjetas NFC\n• SegurApp — app de seguridad personal con rastreo (GitHub)',
      about: 'Oscar Chávez Rosales\nIng. en TIC especializado en software e IA. Basado en Naucalpan / CDMX.\n2° lugar hackathon Walmart Code Ecosystem (Sep 2025)',
      offline: 'No puedo consultar el asistente en este momento. Escríbele directo a oscar.chavez.dev@gmail.com.',
    },
    en: {
      greet: "Hi, I'm Oscar's profile assistant. Ask me about his experience, tech stack, projects or how to reach him.\n\nUse the quick buttons below or type your question.",
      ia: "Oscar works with generative AI & agents:\n• Chatbots and conversational assistants\n• RAG with LangChain and ChromaDB\n• OCR, semantic search and Python automation\n• Integrates OpenAI, Gemini, Claude and Ollama (local models)\n• On-premise Ubuntu infra + Cloudflare Zero Trust",
      stack: "Main stack:\n• Backend: Laravel · PHP · Python · Java · Springboot\n• Mobile: Flutter · Dart · Swift · Kotlin\n• DB: MySQL · Oracle DB\n• Infra: Linux · Docker · Nginx · Cloudflare\n• Frontend: React · Tailwind · Bootstrap\n• AI: LangChain · ChromaDB · Ollama · OpenAI SDK · Gemini · Claude",
      contact: "Reach Oscar:\n• Email: oscar.chavez.dev@gmail.com\n• WhatsApp: +52 55 6523 5522\n• LinkedIn: linkedin.com/in/oscar-chavez-rosales\n• GitHub: github.com/Oscar-CR",
      experience: "Career timeline:\n• AI Developer @ Tech Energy Control (Sep 2025–present)\n• CRM Analyst @ Telcel (Dec 2024–Jun 2025)\n• Backend Lead @ BH Trademarket (Jan 2023–Nov 2024)\n• Dev Intern @ Promo Life (Sep 2021–Jan 2023)",
      projects: "Featured projects:\n• Custom B2B e-commerce (Laravel/MySQL)\n• Real-time multi-supplier quoting engine\n• Corporate intranet web + mobile (Play Store & App Store)\n• Promo NFC — bulk NFC card encoder\n• SegurApp — personal-safety app with live tracking (GitHub)",
      about: "Oscar Chávez Rosales\nICT Engineer specialized in software & AI. Based in Naucalpan / CDMX.\n2nd place Walmart Code Ecosystem hackathon (Sep 2025)",
      offline: 'I cannot reach the assistant right now. Email Oscar directly at oscar.chavez.dev@gmail.com.',
    }
  };

  /* ── Keyword → KB key rules (fallback only) ── */
  const RULES = [
    { keys: ['ia','ai','inteligencia','gpt','llm','chatbot','gemini','claude','openai','ollama','rag','ml','machine','artificial'], kb: 'ia' },
    { keys: ['stack','tecnolog','lenguaj','framework','usa','usas','herramient','flutter','laravel','python','php','java','swift','kotlin','react','mysql'], kb: 'stack' },
    { keys: ['contact','email','correo','tel','whatsapp','wa','linkedin','github','llam','escrib','reach'], kb: 'contact' },
    { keys: ['experiencia','trabaj','empleo','empresa','historial','cargo','posic','carrera','curriculum','cv','tray'], kb: 'experience' },
    { keys: ['proyecto','project','hizo','construy','desarroll','app','ecommerce','nfc','segur','portafolio','portfolio'], kb: 'projects' },
    { keys: ['quién','quien','oscar','sobre','about','who','es él','perfil'], kb: 'about' },
  ];

  function normalize(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function localReply(text, lang) {
    const t = normalize(text);
    for (const rule of RULES) {
      if (rule.keys.some(k => t.includes(normalize(k)))) return KB[lang][rule.kb];
    }
    return null;
  }

  /* ── Server call: the key lives in Laravel, never here ── */
  const history = [];

  async function askServer(text, lang) {
    if (!ENDPOINT) throw new Error('endpoint-missing');

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': CSRF,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        message: text,
        lang: lang,
        history: history.slice(-HISTORY_TURNS),
      }),
    });

    if (!res.ok) throw new Error('http-' + res.status);

    const data = await res.json();
    if (!data || typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('empty');

    return data.reply.trim();
  }

  /* ── UI helpers ── */
  const els = {};
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
    els.input.disabled = true;

    const lang = window.CURRENT_LANG === 'en' ? 'en' : 'es';
    addMsg(text, 'user');
    els.input.value = '';

    const typing = addTyping();

    try {
      const reply = await askServer(text, lang);
      typing.remove();
      addMsg(reply, 'bot');
      // Only a real exchange goes into the history sent upstream.
      history.push({ role: 'user', content: text });
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      typing.remove();
      // Degrade to the local knowledge base instead of showing an error.
      addMsg(localReply(text, lang) || KB[lang].offline, 'bot');
    } finally {
      busy = false;
      els.input.disabled = false;
      els.input.focus();
    }
  }

  function open() {
    els.panel.classList.add('open');
    if (!els.log.dataset.greeted) {
      addMsg(KB[window.CURRENT_LANG === 'en' ? 'en' : 'es'].greet, 'bot');
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
    els.input.addEventListener('keydown', e => { if (e.key === 'Enter') send(els.input.value); });
    document.querySelectorAll('.aria-suggest button').forEach(b => {
      b.addEventListener('click', () => send(b.textContent));
    });
  });

})();
