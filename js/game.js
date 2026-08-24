/* ============================================================
   game.js — "Dyno Runner": endless runner with the Dyno mascot.
   Jump (Space / ArrowUp / tap) over tech-stack icon obstacles.
   Score + best (localStorage). i18n labels.
   ============================================================ */
(function () {
  // light theme palette: blue / pink / violet accents, slate ink, neutral surfaces
  const CYAN = '#2563eb', MAG = '#ec4899', VIO = '#7c3aed', WHITE = '#ffffff';
  const INK = '#0f172a';

  let cv, ctx, stage, overlay, msgEl, scoreEl, bestEl;
  let W = 0, H = 0, dpr = 1;
  let state = 'idle';            // idle | run | over
  let raf = null, last = 0;
  let score = 0, best = 0;
  let speed = 0, baseSpeed = 420;
  let spawnT = 0, nextGap = 1.1;
  let groundY = 0;
  let stars = [];

  const dino = { x: 70, y: 0, vy: 0, w: 46, h: 50, onGround: true, run: 0 };
  let obstacles = [];

  function L(k) { const e = window.I18N && window.I18N[k]; const l = window.CURRENT_LANG || 'es'; return e ? (e[l] != null ? e[l] : e.es) : k; }

  function resize() {
    const r = stage.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    groundY = H - 38;
    dino.h = 50; dino.w = 46;
    if (dino.onGround) dino.y = groundY - dino.h;
    if (!stars.length) {
      for (let i = 0; i < 34; i++) stars.push({ x: Math.random() * W, y: Math.random() * (H - 60), z: 0.3 + Math.random() * 1.2, s: Math.random() < 0.5 });
    }
  }

  function reset() {
    score = 0; speed = baseSpeed; obstacles = []; spawnT = 0; nextGap = 0.9;
    dino.y = groundY - dino.h; dino.vy = 0; dino.onGround = true;
  }

  function start() {
    reset(); state = 'run'; overlay.classList.add('hidden');
    startLoop();
  }

  function gameOver() {
    state = 'over';
    best = Math.max(best, Math.floor(score));
    try { localStorage.setItem('dyno_best', String(best)); } catch (e) {}
    if (bestEl) bestEl.textContent = pad(best);
    msgEl.textContent = L('game.over');
    overlay.classList.remove('hidden');
  }

  function jump() {
    if (state === 'idle' || state === 'over') { start(); return; }
    if (dino.onGround) { dino.vy = -680; dino.onGround = false; }
  }

  function pad(n) { return String(Math.floor(n)).padStart(4, '0'); }

  // ---- obstacle types: tech skill icons ----
  const TECH_ICONS = [
    'html5','css3','javascript','react','laravel','flutter',
    'python','java','php','mysql','nodejs','figma',
    'git','linux','swift','kotlin','dart','bootstrap',
    'tailwind','claude','openai','ollama','gemini','github'
  ];
  // each icon always maps to the same glow color (consistent, like the skills chips)
  const ICON_COLOR = {};
  (function() {
    const palette = [CYAN, VIO, MAG];
    TECH_ICONS.forEach((s, i) => { ICON_COLOR[s] = palette[i % palette.length]; });
  })();
  const imgCache = {};
  function getImg(slug) {
    if (!imgCache[slug]) {
      const img = new Image();
      img.src = 'assets/icons/' + slug + '.svg';
      imgCache[slug] = img;
    }
    return imgCache[slug];
  }
  // preload all
  TECH_ICONS.forEach(getImg);

  function spawn() {
    const slug = TECH_ICONS[(Math.random() * TECH_ICONS.length) | 0];
    const big = Math.random() < 0.3;
    const sz = big ? 44 : 34;
    obstacles.push({ x: W + 20, y: groundY - sz, w: sz, h: sz, slug, glowColor: ICON_COLOR[slug] });
  }

  function update(dt) {
    speed += dt * 10;
    score += dt * speed * 0.04;
    // dino physics
    dino.vy += 1900 * dt;
    dino.y += dino.vy * dt;
    if (dino.y >= groundY - dino.h) { dino.y = groundY - dino.h; dino.vy = 0; dino.onGround = true; }
    dino.run += dt * 12;
    // obstacles
    spawnT += dt;
    if (spawnT > nextGap) {
      spawnT = 0;
      nextGap = Math.max(0.62, (Math.random() * 0.7 + 0.9) - speed * 0.0004);
      spawn();
    }
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x -= speed * dt;
      if (o.x + o.w < -10) { obstacles.splice(i, 1); continue; }
      // collision (shrunk hitbox)
      const pad = 8;
      if (dino.x + pad < o.x + o.w && dino.x + dino.w - pad > o.x &&
          dino.y + pad < o.y + o.h && dino.y + dino.h - pad > o.y) {
        gameOver();
      }
    }
    for (const s of stars) { s.x -= speed * dt * 0.12 * s.z; if (s.x < -2) { s.x = W + 2; s.y = Math.random() * (H - 60); } }
  }

  // ---- drawing ----
  function draw() {
    ctx.clearRect(0, 0, W, H);
    // stars (blue / pink specks; the far ones fade toward the light background)
    for (const s of stars) { ctx.globalAlpha = 0.25 + s.z * 0.3; ctx.fillStyle = s.s ? CYAN : MAG; ctx.fillRect(s.x, s.y, 2, 2); }
    ctx.globalAlpha = 1;
    // ground line
    ctx.strokeStyle = 'rgba(37, 99, 235,0.55)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, groundY + 1); ctx.lineTo(W, groundY + 1); ctx.stroke();
    // soft blue haze under the line (reads as a shadow on light, not a neon glow)
    ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(37, 99, 235,0.35)'; ctx.stroke(); ctx.shadowBlur = 0;
    // ground ticks
    ctx.strokeStyle = 'rgba(124, 58, 237,0.35)'; ctx.lineWidth = 1;
    const tick = (performance.now() * 0.001 * speed) % 40;
    for (let x = -tick; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, groundY + 6); ctx.lineTo(x + 10, groundY + 6); ctx.stroke(); }

    obstacles.forEach(o => drawObstacle(o));
    drawDino();
  }

  function drawDino() {
    const x = dino.x, y = dino.y, w = dino.w, h = dino.h;
    ctx.save();
    ctx.translate(x, y);
    // soft slate drop shadow instead of the old neon halo
    ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(15, 23, 42,0.18)';
    ctx.fillStyle = WHITE;                       // light body surface
    ctx.strokeStyle = INK; ctx.lineWidth = 2;    // dark slate outline
    // body
    rr(8, 14, 26, 24, 6, true, true);
    // tail
    ctx.beginPath(); ctx.moveTo(8, 22); ctx.lineTo(-6, 16); ctx.lineTo(8, 30); ctx.closePath(); ctx.fill(); ctx.stroke();
    // head
    rr(24, 2, 20, 18, 6, true, true);
    // snout (light blue accent)
    ctx.fillStyle = '#3b82f6';
    rr(40, 9, 8, 9, 3, true, true);
    // eye (dark slate dot on the light head)
    ctx.shadowBlur = 0; ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(38, 9, 2.6, 0, 7); ctx.fill();
    // back fin (pink accent)
    ctx.fillStyle = MAG;
    ctx.beginPath(); ctx.moveTo(16, 14); ctx.lineTo(20, 6); ctx.lineTo(24, 14); ctx.closePath(); ctx.fill();
    // legs (animate when grounded)
    ctx.strokeStyle = INK; ctx.shadowBlur = 0; ctx.lineWidth = 3;
    const swing = dino.onGround ? Math.sin(dino.run) * 5 : 3;
    leg(16, 38, swing); leg(26, 38, -swing);
    ctx.restore();
    ctx.shadowBlur = 0;
  }
  function leg(lx, ly, sw) { ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + sw, ly + 12); ctx.stroke(); }

  function drawObstacle(o) {
    ctx.save();
    const c = o.glowColor;
    const w = o.w, h = o.h;
    // light neutral panel background + soft slate shadow
    ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(15, 23, 42,0.14)';
    ctx.fillStyle = 'rgba(226, 232, 240,0.92)';
    rr(o.x, o.y, w, h, 7, true, false);
    // colored border (blue / violet / pink)
    ctx.strokeStyle = c; ctx.lineWidth = 1.75; ctx.globalAlpha = 0.9;
    rr(o.x, o.y, w, h, 7, false, true);
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    // icon image
    const img = imgCache[o.slug];
    if (img && img.complete && img.naturalWidth > 0) {
      const pad = 5;
      ctx.drawImage(img, o.x + pad, o.y + pad, w - pad * 2, h - pad * 2);
    } else {
      // fallback while loading
      ctx.fillStyle = c; ctx.globalAlpha = 0.5;
      rr(o.x + 6, o.y + 6, w - 12, h - 12, 4, true, false);
      ctx.globalAlpha = 1;
    }
    ctx.restore(); ctx.shadowBlur = 0;
  }

  function rr(x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) ctx.fill(); if (stroke) ctx.stroke();
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (state === 'run') { update(dt); if (scoreEl) scoreEl.textContent = pad(score); }
    draw();
    if (running) raf = requestAnimationFrame(loop);
  }
  let running = false;
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  document.addEventListener('DOMContentLoaded', () => {
    cv = document.getElementById('dgCanvas'); stage = document.getElementById('dgStage');
    overlay = document.getElementById('dgOverlay'); msgEl = document.getElementById('dgMsg');
    scoreEl = document.getElementById('dgScore'); bestEl = document.getElementById('dgBest');
    if (!cv || !stage) return;
    ctx = cv.getContext('2d');
    try { best = parseInt(localStorage.getItem('dyno_best') || '0', 10) || 0; } catch (e) {}
    if (bestEl) bestEl.textContent = pad(best);
    resize();
    window.addEventListener('resize', resize);
    setTimeout(resize, 400);
    // draw a static idle frame
    draw();

    // controls
    window.addEventListener('keydown', (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp')) {
        // only when game focused/visible to avoid hijacking page scroll
        const r = stage.getBoundingClientRect();
        const visible = r.top < window.innerHeight * 0.85 && r.bottom > window.innerHeight * 0.15;
        if (visible) { e.preventDefault(); jump(); }
      }
    });
    stage.addEventListener('pointerdown', (e) => { e.preventDefault(); stage.focus({ preventScroll: true }); jump(); });

    // only animate while the game is on-screen (perf)
    const gIO = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) startLoop();
      else { stopLoop(); if (state === 'run') { state = 'idle'; overlay.classList.remove('hidden'); msgEl.textContent = L('game.start'); } }
    }, { threshold: 0.15 });
    gIO.observe(stage);
  });
})();
