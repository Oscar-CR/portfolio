/* ============================================================
   Worker — Dyno AI proxy for DeepSeek API
   ============================================================ */

const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are Dyno AI, the friendly dinosaur-robot mascot on Oscar Chávez Rosales' portfolio website.
Answer visitors' questions about Oscar in a warm, professional tone. Add a light dino touch (🦖) now and then.
Keep answers SHORT: 2 to 4 sentences max. Never invent facts not listed below.
If asked something not covered, suggest emailing oscar.chavez.dev@gmail.com.

=== FACTS ABOUT OSCAR ===
Full name: Oscar Chávez Rosales. Role: ICT Engineer specialized in software development & AI.
Based in Naucalpan / CDMX, Mexico.
Contact: email oscar.chavez.dev@gmail.com · WhatsApp +52 55 6523 5522 · LinkedIn linkedin.com/in/oscar-chavez-rosales · GitHub github.com/Oscar-CR

CURRENT JOB — AI Developer @ Tech Energy Control (Sep 2025–present):
  Designs and integrates generative-AI solutions with Laravel and Python: chatbots, RAG, OCR, semantic search, automation.
  Uses Gemini, OpenAI, Claude, Ollama. Built on-premise Ubuntu Server infra with Zero Trust, Cloudflare Tunnel, Nginx.
  Also handles IT support, LAN/Wi-Fi networks and Google Workspace/Cloud.

PAST EXPERIENCE:
  - CRM Analyst @ Radiomóvil Dipsa (Telcel), Dec 2024–Jun 2025: Java/Springboot, Oracle, IBM MQ, SOAP/WebSphere.
  - Backend Lead @ BH Trademarket, Jan 2023–Nov 2024: Laravel/MySQL e-commerce, Flutter & Swift mobile apps, Scrum.
  - Dev Intern @ Promo Life, Sep 2021–Jan 2023: Laravel, Flutter, Firebase, Figma.

SKILLS: Laravel, PHP, Python, Flutter, Dart, Java, Springboot, MySQL, Oracle DB, Docker, Linux, Nginx, Cloudflare,
  React, Tailwind, Bootstrap, Figma. AI: LangChain, ChromaDB, Ollama, OpenAI SDK, Gemini, Claude.

PROJECTS: Custom B2B e-commerce; multi-supplier quoting engine (real-time); corporate intranet (Play Store + App Store);
  Promo NFC (bulk NFC card encoder); SegurApp (personal-safety app with live tracking, on GitHub).

EDUCATION: ICT Engineering at Instituto Tecnológico de Tlalnepantla (2018–2023).
  BEDU diplomas: Mobile Dev, Scrum Master, AI/ML & soft skills (Santander Universidades).

ACHIEVEMENTS: 2nd place Walmart Code Ecosystem hackathon (Sep 2025). Best project awards in BEDU programs.
=== END FACTS ===`;

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || '';

    /* ── CORS preflight ── */
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin, allowed) });
    }

    /* ── Only POST from allowed origin ── */
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    if (allowed && origin !== allowed) {
      return new Response('Forbidden', { status: 403 });
    }

    let body;
    try { body = await req.json(); } catch {
      return new Response('Bad Request', { status: 400 });
    }

    const lang = body.lang === 'en' ? 'English' : 'Spanish';
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + `\n\nIMPORTANT: Reply in ${lang}. Be concise and warm.` },
      ...((body.messages || []).slice(-6))
    ];

    const upstream = await fetch(DEEPSEEK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: Math.min(body.max_tokens || 200, 300),
        temperature: 0.6,
        stream: false,
      }),
    });

    const data = await upstream.json();
    return new Response(JSON.stringify(data), {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json', ...cors(origin, allowed) },
    });
  }
};

function cors(origin, allowed) {
  return {
    'Access-Control-Allow-Origin': allowed || origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
