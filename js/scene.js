/* ============================================================
   scene.js
   1) Page backdrop: a drifting neural network on a 2D canvas (#bg-canvas).
      Deliberately 2D, not WebGL: every link needs its own distance-based
      alpha, which three r128 cannot express through per-vertex alpha, and a
      2D context composites reliably where a full-viewport WebGL layer does
      not. It also means the backdrop survives if the three CDN fails.
   2) Hero stage: neural wireframe core + orbit rings, three.js (#hero-canvas)
   ============================================================ */

/* ---------------- PAGE BACKDROP: NEURAL NETWORK ---------------- */
(function neuralBackdrop() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // One dial for the whole figure. It sits under every section, so it has to
  // stay quiet enough that small text on top keeps its contrast.
  const ALPHA = 0.75;
  const INK = [[37, 99, 235], [124, 58, 237], [236, 72, 153]];  // blue / violet / fuchsia

  let w = 0, h = 0, dpr = 1, link = 150, running = false;
  const pts = [];

  function spawn() {
    const a = Math.random() * Math.PI * 2;
    const sp = 0.10 + Math.random() * 0.26;              // px per frame: a slow drift
    return {
      x: Math.random() * (window.innerWidth || 1),
      y: Math.random() * (window.innerHeight || 1),
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      r: 1.3 + Math.random() * 1.2,
      c: INK[(Math.random() * INK.length) | 0],
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Population and link radius both track the viewport so the mesh keeps the
    // same visual density on a laptop and on an ultrawide.
    link = Math.max(120, Math.min(190, Math.hypot(w, h) * 0.1));
    const target = Math.max(34, Math.min(100, Math.round((w * h) / 21000)));
    while (pts.length < target) pts.push(spawn());
    pts.length = target;
  }

  // Signals fire along a link that actually exists right now, then re-target.
  const pulses = [];
  for (let i = 0; i < 5; i++) pulses.push({ a: 0, b: 0, t: 1, sp: 0.006 });

  function retarget(s) {
    for (let tries = 0; tries < 24; tries++) {
      const i = (Math.random() * pts.length) | 0;
      const j = (Math.random() * pts.length) | 0;
      if (i === j) continue;
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      if (dx * dx + dy * dy < link * link) {
        s.a = i; s.b = j; s.t = 0; s.sp = 0.004 + Math.random() * 0.008;
        return;
      }
    }
    s.t = 0.999;   // nothing in range this tick; it will try again next frame
  }

  function step() {
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      // wrap, so the mesh keeps travelling across the whole canvas
      if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
    }
    for (let i = 0; i < pulses.length; i++) {
      const s = pulses[i];
      s.t += s.sp;
      if (s.t >= 1) retarget(s);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = ALPHA;

    // Links, with alpha falling off over distance so the mesh reads as depth
    // instead of a flat web.
    ctx.lineWidth = 1;
    const lim = link * link;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > lim) continue;
        const f = 1 - Math.sqrt(d2) / link;
        ctx.strokeStyle = 'rgba(' + a.c[0] + ',' + a.c[1] + ',' + a.c[2] + ',' + (f * 0.30).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }

    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      ctx.fillStyle = 'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',0.55)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }

    for (let i = 0; i < pulses.length; i++) {
      const s = pulses[i];
      const a = pts[s.a], b = pts[s.b];
      if (!a || !b) continue;
      ctx.fillStyle = 'rgba(' + a.c[0] + ',' + a.c[1] + ',' + a.c[2] + ',0.85)';
      ctx.beginPath();
      ctx.arc(a.x + (b.x - a.x) * s.t, a.y + (b.y - a.y) * s.t, 2.1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function frame() {
    step();
    draw();
    if (running) requestAnimationFrame(frame);
  }

  resize();
  for (let i = 0; i < pulses.length; i++) retarget(pulses[i]);
  if (reduced) draw(); else { running = true; frame(); }

  window.addEventListener('resize', () => { resize(); if (reduced) draw(); });
  // Don't burn frames on a hidden tab.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running = false;
    else if (!reduced && !running) { running = true; frame(); }
  });
})();

(function () {
  if (!window.THREE) { console.warn('THREE not loaded'); return; }
  const THREE = window.THREE;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // light-theme accents: primary blue / fuchsia / violet (var names kept for compatibility)
  const CYAN = 0x2563eb, MAG = 0xec4899, VIO = 0x7c3aed;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  });

  /* ---------------- HERO BACKDROP (neural core) ---------------- */
  (function hero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    function size() { return { w: canvas.clientWidth || 500, h: canvas.clientHeight || 500 }; }
    let { w, h } = size();
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0.3, 12);
    // Widest thing in the scene is the outer floating dots (max radius 3.8).
    // Framing to that on BOTH axes is what keeps the orbit rings and the outer
    // dots from being cut off on desktop, where the stage is nearly square.
    const CONTENT_RADIUS = 3.9;
    function fitCamera() {
      const halfFov = (camera.fov / 2) * Math.PI / 180;
      const fitH = CONTENT_RADIUS / Math.tan(halfFov);
      const fitW = CONTENT_RADIUS / (Math.tan(halfFov) * camera.aspect);
      camera.position.z = Math.max(fitH, fitW) + 0.6;
    }

    // Every mesh here is unlit (MeshBasicMaterial), so the scene needs no lights.
    const accentCyan = new THREE.MeshBasicMaterial({ color: CYAN });
    const accentMag  = new THREE.MeshBasicMaterial({ color: MAG });

    // ---- orbit rings ----
    const ringGroup = new THREE.Group(); scene.add(ringGroup);
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.012, 8, 80), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.6 }));
    ring1.rotation.x = Math.PI/2.2; ringGroup.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.012, 8, 80), new THREE.MeshBasicMaterial({ color: MAG, transparent: true, opacity: 0.6 }));
    ring2.rotation.x = Math.PI/3; ring2.rotation.y = Math.PI/5; ringGroup.add(ring2);
    // orbiting dots riding each ring
    const orbGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const orb1 = new THREE.Mesh(orbGeo, accentCyan); ring1.add(orb1);
    const orb2 = new THREE.Mesh(orbGeo, accentMag); ring2.add(orb2);

    // ---- neural core: wireframe icosahedron + floating dots ----
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 1), new THREE.MeshBasicMaterial({ color: VIO, wireframe: true, transparent: true, opacity: 0.35 }));
    core.position.z = -1.5; scene.add(core);
    const nDots = new THREE.Group(); scene.add(nDots);
    for (let i = 0; i < 26; i++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), Math.random()<0.5?accentCyan:accentMag);
      const a = Math.random()*Math.PI*2, r = 2.9 + Math.random()*0.9, y = (Math.random()-0.5)*4;
      d.position.set(Math.cos(a)*r, y, Math.sin(a)*r - 1.5);
      d.userData = { a, r, y, s: 0.2 + Math.random()*0.5 };
      nDots.add(d);
    }

    const clock = new THREE.Clock();
    function frame() {
      const t = clock.getElapsedTime();

      // rings + orbiting dots
      ring1.rotation.z += 0.004; ring2.rotation.z -= 0.005;
      orb1.position.set(Math.cos(t*1.2)*3.4, Math.sin(t*1.2)*3.4, 0);
      orb2.position.set(Math.cos(-t*1.5)*3.0, Math.sin(-t*1.5)*3.0, 0);

      // neural core drift
      core.rotation.y += 0.003; core.rotation.x += 0.0015;
      nDots.children.forEach(d => {
        d.userData.a += 0.003 * d.userData.s;
        d.position.x = Math.cos(d.userData.a) * d.userData.r;
        d.position.z = Math.sin(d.userData.a) * d.userData.r - 1.5;
        d.position.y = d.userData.y + Math.sin(t + d.userData.r) * 0.2;
      });

      renderer.render(scene, camera);
      if (heroRunning) requestAnimationFrame(frame);
    }
    let heroRunning = !reduced;
    if (reduced) renderer.render(scene, camera); else frame();
    // pause the hero loop when it scrolls out of view (perf)
    const heroIO = new IntersectionObserver(([e]) => {
      const vis = e.isIntersecting;
      if (vis && !heroRunning && !reduced) { heroRunning = true; frame(); }
      else if (!vis) { heroRunning = false; }
    }, { threshold: 0.02 });
    heroIO.observe(canvas);

    function onResize() {
      const s = size(); w = s.w; h = s.h;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      fitCamera();
      renderer.setSize(w, h, false);
    }
    fitCamera();
    window.addEventListener('resize', onResize);
    // re-fit shortly after load (clientWidth may settle late)
    setTimeout(onResize, 300);
  })();
})();
