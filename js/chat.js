/* ============================================================
   chat.js — Dyno AI assistant.
   Flow:
     1. Keyword matching → local KB (always works, no API)
     2. Free text → WORKER_URL proxy (if configured)
     3. Fallback → "En construcción" message
   To connect the backend set window.DYNO_WORKER_URL before
   this script loads, e.g.:
     <script>window.DYNO_WORKER_URL='https://dyno.tu-usuario.workers.dev';</script>
   ============================================================ */
(function () {

  /* ── Worker URL (leave '' until you deploy the backend) ── */
  const WORKER_URL = window.DYNO_WORKER_URL || '';

  /* ── Local knowledge base ── */
  const KB = {
    es: {
      greet: '¡Rawr! 🦖 Soy Dyno, el asistente de Oscar. Puedes preguntarme sobre su experiencia, tecnologías, proyectos o cómo contactarlo.\n\nUsa los accesos rápidos de abajo o escribe tu pregunta.',
      ia: '🤖 Oscar trabaja con IA generativa y agentes:\n• Chatbots y asistentes conversacionales\n• RAG con LangChain y ChromaDB\n• OCR, búsqueda semántica y automatización en Python\n• Integra OpenAI, Gemini, Claude y Ollama (modelos locales)\n• Infraestructura on-premise Ubuntu + Cloudflare Zero Trust',
      stack: '⚡ Stack principal:\n• Backend: Laravel · PHP · Python · Java · Springboot\n• Mobile: Flutter · Dart · Swift · Kotlin\n• BD: MySQL · Oracle DB\n• Infra: Linux · Docker · Nginx · Cloudflare\n• Frontend: React · Tailwind · Bootstrap\n• IA: LangChain · ChromaDB · Ollama · OpenAI SDK · Gemini · Claude',
      contact: '📬 Contacta a Oscar:\n• Email: oscar.chavez.dev@gmail.com\n• WhatsApp: +52 55 6523 5522\n• LinkedIn: linkedin.com/in/oscar-chavez-rosales\n• GitHub: github.com/Oscar-CR',
      experience: '💼 Trayectoria profesional:\n• AI Developer @ Tech Energy Control (Sep 2025–hoy)\n• Analista CRM @ Telcel (Dic 2024–Jun 2025)\n• Backend Lead @ BH Trademarket (Ene 2023–Nov 2024)\n• Dev Intern @ Promo Life (Sep 2021–Ene 2023)',
      projects: '🛠️ Proyectos destacados:\n• E-commerce B2B personalizado (Laravel/MySQL)\n• Motor de cotización multi-proveedor en tiempo real\n• Intranet corporativa web + móvil (Play Store y App Store)\n• Promo NFC — codificación masiva de tarjetas NFC\n• SegurApp — app de seguridad personal con rastreo (GitHub)',
      about: '👤 Oscar Chávez Rosales\nIng. en TIC especializado en software e IA. Basado en Naucalpan / CDMX.\n🏆 2° lugar hackathon Walmart Code Ecosystem (Sep 2025)',
      wip: '🚧 Esa pregunta está fuera de mi menú local y el chat IA completo está en construcción.\n\nMientras tanto escríbele directo a:\noscar.chavez.dev@gmail.com',
    },
    en: {
      greet: "Rawr! 🦖 I'm Dyno, Oscar's assistant. Ask me about his experience, tech stack, projects or how to reach him.\n\nUse the quick buttons below or type your question.",
      ia: "🤖 Oscar works with generative AI & agents:\n• Chatbots and conversational assistants\n• RAG with LangChain and ChromaDB\n• OCR, semantic search and Python automation\n• Integrates OpenAI, Gemini, Claude and Ollama (local models)\n• On-premise Ubuntu infra + Cloudflare Zero Trust",
      stack: "⚡ Main stack:\n• Backend: Laravel · PHP · Python · Java · Springboot\n• Mobile: Flutter · Dart · Swift · Kotlin\n• DB: MySQL · Oracle DB\n• Infra: Linux · Docker · Nginx · Cloudflare\n• Frontend: React · Tailwind · Bootstrap\n• AI: LangChain · ChromaDB · Ollama · OpenAI SDK · Gemini · Claude",
      contact: "📬 Reach Oscar:\n• Email: oscar.chavez.dev@gmail.com\n• WhatsApp: +52 55 6523 5522\n• LinkedIn: linkedin.com/in/oscar-chavez-rosales\n• GitHub: github.com/Oscar-CR",
      experience: "💼 Career timeline:\n• AI Developer @ Tech Energy Control (Sep 2025–present)\n• CRM Analyst @ Telcel (Dec 2024–Jun 2025)\n• Backend Lead @ BH Trademarket (Jan 2023–Nov 2024)\n• Dev Intern @ Promo Life (Sep 2021–Jan 2023)",
      projects: "🛠️ Featured projects:\n• Custom B2B e-commerce (Laravel/MySQL)\n• Real-time multi-supplier quoting engine\n• Corporate intranet web + mobile (Play Store & App Store)\n• Promo NFC — bulk NFC card encoder\n• SegurApp — personal-safety app with live tracking (GitHub)",
      about: "👤 Oscar Chávez Rosales\nICT Engineer specialized in software & AI. Based in Naucalpan / CDMX.\n🏆 2nd place Walmart Code Ecosystem hackathon (Sep 2025)",
      wip: "🚧 That question is outside my local menu and the full AI chat is under construction.\n\nIn the meantime email Oscar directly at:\noscar.chavez.dev@gmail.com",
    }
  };

  /* ── Keyword → KB key rules ── */
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

  /* ── API proxy call (Cloudflare Worker) ── */
  async function callWorker(text, lang) {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: text }],
        lang,
        max_tokens: 200,
      })
    });
    if (!res.ok) throw new Error('api-error');
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
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
    addMsg(text, 'user');
    els.input.value = '';
    const lang = window.CURRENT_LANG || 'es';

    /* 1 — local KB match */
    const local = localReply(text, lang);
    if (local) { addMsg(local, 'bot'); busy = false; return; }

    /* 2 — API proxy (if configured) */
    if (WORKER_URL) {
      const typing = addTyping();
      try {
        const reply = await callWorker(text, lang);
        typing.remove();
        addMsg(reply || KB[lang].wip, 'bot');
      } catch {
        typing.remove();
        addMsg(KB[lang].wip, 'bot');
      }
    } else {
      /* 3 — no backend, show WIP */
      addMsg(KB[lang].wip, 'bot');
    }
    busy = false;
  }

  function open() {
    els.panel.classList.add('open');
    if (!els.log.dataset.greeted) {
      addMsg(KB[window.CURRENT_LANG || 'es'].greet, 'bot');
      els.log.dataset.greeted = '1';
    }
    setTimeout(() => els.input.focus(), 300);
  }
  function close() { els.panel.classList.remove('open'); }

  window.ARIA = { open, close, send };

  document.addEventListener('DOMContentLoaded', () => {
    els.panel = $('aria-panel');
    els.log   = $('aria-log');
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
