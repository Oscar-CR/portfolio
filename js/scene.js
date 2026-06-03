/* ============================================================
   scene.js — Three.js. Two scenes:
   1) Full-page neural particle network (#bg-canvas)
   2) Hero stage: animated robot droid + AI core (#hero-canvas)
      with 3 swappable modes: NEURAL / CHROME / HUD
   ============================================================ */
(function () {
  if (!window.THREE) { console.warn('THREE not loaded'); return; }
  const THREE = window.THREE;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CYAN = 0x18e8ff, MAG = 0xff2bd6, VIO = 0x8b5cff;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  });

  /* ---------------- BACKGROUND NEURAL NETWORK ---------------- */
  (function bg() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x05030a, 60, 230);
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 40, 66);

    // lights for the metallic spine
    scene.add(new THREE.AmbientLight(0x33294d, 1.2));
    const lc = new THREE.PointLight(CYAN, 2.6, 220); lc.position.set(-26, 30, 44); scene.add(lc);
    const lm = new THREE.PointLight(MAG, 2.6, 220); lm.position.set(26, -20, 44); scene.add(lm);

    const mobile = window.innerWidth < 760;

    // ================= BIO-MECH SPINE =================
    const spine = new THREE.Group();
    scene.add(spine);

    const TOP = 95, BOT = -95;             // spine vertical extent
    const COUNT = mobile ? 20 : 30;        // vertebrae
    const cyanC = new THREE.Color(CYAN), vioC = new THREE.Color(VIO), magC = new THREE.Color(MAG);
    function gradAt(t) { // 0=top .. 1=bottom : cyan -> violet -> magenta
      const c = new THREE.Color();
      if (t < 0.5) c.copy(cyanC).lerp(vioC, t / 0.5);
      else c.copy(vioC).lerp(magC, (t - 0.5) / 0.5);
      return c;
    }
    // central path with gentle organic sway
    function pathX(y) { return Math.sin(y * 0.05) * 7 + Math.sin(y * 0.013) * 4; }
    function pathZ(y) { return Math.cos(y * 0.045) * 6 - 4; }

    const curvePts = [];
    for (let y = TOP; y >= BOT; y -= 4) curvePts.push(new THREE.Vector3(pathX(y), y, pathZ(y)));
    const curve = new THREE.CatmullRomCurve3(curvePts);

    // glowing energy cord (bright inner core + outer glow)
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xbff4ff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
    spine.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.42, 8, false), coreMat));
    const cordMat = new THREE.MeshBasicMaterial({ color: 0x3ad0ff, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false });
    spine.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 150, 1.1, 10, false), cordMat));
    // darker armored sheath around the cord
    const sheathMat = new THREE.MeshStandardMaterial({ color: 0x1a1430, metalness: 0.9, roughness: 0.35, emissive: 0x140a28, emissiveIntensity: 0.5 });
    spine.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 1.5, 10, false), sheathMat));

    const ringMatBase = { metalness: 0.95, roughness: 0.28 };
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < COUNT; i++) {
      const ft = i / (COUNT - 1);
      const y = TOP + (BOT - TOP) * ft;
      const cx = pathX(y), cz = pathZ(y);
      const col = gradAt(ft);
      const vert = new THREE.Group();
      vert.position.set(cx, y, cz);
      // orient along the curve tangent
      const tan = curve.getTangent(Math.min(0.999, ft)).normalize();
      vert.quaternion.setFromUnitVectors(up, tan);

      // vertebra ring (metallic disc)
      const ringR = 5.0 + Math.sin(i * 0.6) * 0.6;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(ringR, 0.5, 8, 40),
        new THREE.MeshStandardMaterial(Object.assign({ color: 0x2a2150, emissive: col, emissiveIntensity: 1.0 }, ringMatBase))
      );
      ring.rotation.x = Math.PI / 2;
      vert.add(ring);

      // inner glow ring (bright)
      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(ringR * 0.64, 0.2, 6, 30),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      halo.rotation.x = Math.PI / 2;
      vert.add(halo);

      // lateral processes (robotic struts) + tip nodes
      [-1, 1].forEach(dir => {
        const strut = new THREE.Mesh(
          new THREE.BoxGeometry(3.0, 0.6, 0.6),
          new THREE.MeshStandardMaterial(Object.assign({ color: 0x322556, emissive: col, emissiveIntensity: 0.5 }, ringMatBase))
        );
        strut.position.set(dir * (ringR + 1.2), 0, 0);
        vert.add(strut);
        const tip = new THREE.Mesh(
          new THREE.SphereGeometry(0.62, 12, 12),
          new THREE.MeshBasicMaterial({ color: col, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        tip.position.set(dir * (ringR + 2.6), 0, 0);
        vert.add(tip);
      });
      vert.userData = { baseRot: vert.rotation.z, phase: i * 0.4 };
      spine.add(vert);
    }

    // DNA-ish helix of particles wrapping the cord
    const hN = mobile ? 100 : 150, hPos = [], hCol = [];
    for (let i = 0; i < hN; i++) {
      const ft = i / hN;
      const y = TOP + (BOT - TOP) * ft;
      const ang = ft * Math.PI * 26 + (i % 2) * Math.PI;
      const rr = 6.6;
      hPos.push(pathX(y) + Math.cos(ang) * rr, y, pathZ(y) + Math.sin(ang) * rr);
      const c = gradAt(ft); hCol.push(c.r, c.g, c.b);
    }
    const hGeo = new THREE.BufferGeometry();
    hGeo.setAttribute('position', new THREE.Float32BufferAttribute(hPos, 3));
    hGeo.setAttribute('color', new THREE.Float32BufferAttribute(hCol, 3));
    const helix = new THREE.Points(hGeo, new THREE.PointsMaterial({ size: 0.7, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    spine.add(helix);

    // travelling energy pulses along the cord
    const pulses = [];
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
      m.userData = { t: i / 4, sp: 0.05 + Math.random() * 0.02 };
      spine.add(m); pulses.push(m);
    }

    // ================= ambient particle dust =================
    const dN = mobile ? 90 : 170, dPos = [], dCol = [];
    for (let i = 0; i < dN; i++) {
      dPos.push((Math.random() - 0.5) * 220, (Math.random() - 0.5) * 240, -40 - Math.random() * 160);
      const c = Math.random() < 0.5 ? cyanC : magC; dCol.push(c.r, c.g, c.b);
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.Float32BufferAttribute(dPos, 3));
    dGeo.setAttribute('color', new THREE.Float32BufferAttribute(dCol, 3));
    const dust = new THREE.Points(dGeo, new THREE.PointsMaterial({ size: 0.8, vertexColors: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(dust);

    const clock = new THREE.Clock();
    let camY = 40;
    function frame() {
      try { frameBody(); } catch (err) { window.__bgErr = (err && err.message) + ' | ' + ((err && err.stack || '').split('\n')[1] || ''); return; }
      requestAnimationFrame(frame);
    }
    function frameBody() {
      const t = clock.getElapsedTime();
      // scroll travel
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const frac = docH > 0 ? (window.scrollY || 0) / docH : 0;
      const targetY = 46 - frac * 92;
      camY += (targetY - camY) * 0.06;
      camera.position.y = camY;

      // mouse parallax
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x * 10;
      spine.rotation.y = 0.12 + mouse.x * 0.22 + Math.sin(t * 0.15) * 0.05;
      camera.lookAt(mouse.x * 4, camY - 6, -6);

      // pulse the halos / lights
      lc.position.y = camY + 26; lm.position.y = camY - 26;
      // vertebra breathing
      spine.children.forEach((ch) => {
        if (ch.userData && ch.userData.phase != null) {
          const b = 1 + Math.sin(t * 1.4 + ch.userData.phase) * 0.04;
          ch.scale.setScalar(b);
        }
      });
      // energy pulses travel
      pulses.forEach(p => {
        p.userData.t += p.userData.sp * 0.02;
        if (p.userData.t > 1) p.userData.t -= 1;
        const pt = curve.getPoint(p.userData.t);
        p.position.copy(pt);
        p.scale.setScalar(0.8 + Math.sin(t * 6 + p.userData.t * 10) * 0.3);
      });
      helix.rotation.y = t * 0.05;
      dust.rotation.y += 0.0003;

      renderer.render(scene, camera);
    }
    if (reduced) { camera.position.y = 0; camera.lookAt(0, -6, -6); renderer.render(scene, camera); } else frame();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })();

  /* ---------------- HERO ROBOT DROID ---------------- */
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
    function fitCamera() {
      const halfFov = (camera.fov / 2) * Math.PI / 180;
      const fitH = 3.2 / Math.tan(halfFov);
      const fitW = 3.0 / (Math.tan(halfFov) * camera.aspect);
      camera.position.z = Math.max(fitH, fitW) + 0.6;
    }

    // lights
    scene.add(new THREE.AmbientLight(0x404060, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(3, 4, 5); scene.add(key);
    const lc = new THREE.PointLight(CYAN, 2.4, 30); lc.position.set(-4, 1, 4); scene.add(lc);
    const lm = new THREE.PointLight(MAG, 2.4, 30); lm.position.set(4, -1, 3); scene.add(lm);

    // ============ FRIENDLY DINO-BOT (Dyno) ============
    const robot = new THREE.Group();
    scene.add(robot);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x17122b, metalness: 0.7, roughness: 0.38 });
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x2a1f48, metalness: 0.85, roughness: 0.3 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0x352a55, metalness: 0.5, roughness: 0.45 });
    const glowCyan = new THREE.MeshBasicMaterial({ color: CYAN });
    const glowMag  = new THREE.MeshBasicMaterial({ color: MAG });
    const darkMat  = new THREE.MeshStandardMaterial({ color: 0x05060c, metalness: 0.3, roughness: 0.4 });

    // legs + feet
    [-0.55, 0.55].forEach(x => {
      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.0, 0.7), bodyMat);
      thigh.position.set(x, -1.35, 0.05); robot.add(thigh);
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 14), panelMat);
      knee.position.set(x, -1.78, 0.1); robot.add(knee);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.3, 1.05), panelMat);
      foot.position.set(x, -2.0, 0.32); robot.add(foot);
      // toe claws
      [-0.22, 0, 0.22].forEach(tx => {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 8), glowCyan);
        claw.rotation.x = Math.PI / 2; claw.position.set(x + tx, -2.02, 0.86); robot.add(claw);
      });
    });

    // body / torso (chunky, slight forward lean)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.85, 1.4), bodyMat);
    torso.position.set(0, -0.35, 0); torso.rotation.x = 0.06; robot.add(torso);
    // belly plate
    const belly = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.35, 0.14), bellyMat);
    belly.position.set(0, -0.45, 0.69); robot.add(belly);
    // belly ridges
    [-0.25, 0.05, 0.35].forEach(yy => {
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.04), darkMat);
      ridge.position.set(0, -0.45 + yy, 0.77); robot.add(ridge);
    });
    // chest reactor (kept)
    const reactor = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 24), glowCyan);
    reactor.position.set(0, 0.12, 0.74); robot.add(reactor);
    const reactorRing = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 10, 30), glowMag);
    reactorRing.position.set(0, 0.12, 0.74); robot.add(reactorRing);
    const reactorLight = new THREE.PointLight(CYAN, 1.6, 5); reactorLight.position.set(0, 0.12, 1.1); robot.add(reactorLight);

    // tiny T-rex arms
    [-1, 1].forEach(dir => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.62, 0.26), panelMat);
      arm.position.set(dir * 0.98, -0.2, 0.45); arm.rotation.z = dir * 0.5; robot.add(arm);
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 8), glowCyan);
      claw.position.set(dir * 1.2, -0.55, 0.55); claw.rotation.x = Math.PI / 2; robot.add(claw);
    });

    // neck
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.85, 0.85), bodyMat);
    neck.position.set(0, 0.7, 0.2); robot.add(neck);

    // ---- HEAD group (friendly) ----
    const head = new THREE.Group();
    head.position.set(0, 1.5, 0.25); robot.add(head);
    const skull = new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.2, 1.35), bodyMat);
    head.add(skull);
    // snout / muzzle
    const snout = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.72, 0.8), panelMat);
    snout.position.set(0, -0.2, 0.92); head.add(snout);
    // smile line
    const smile = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.06), glowCyan);
    smile.position.set(0, -0.42, 1.33); head.add(smile);
    // nostrils
    [-0.22, 0.22].forEach(x => {
      const n = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), darkMat);
      n.position.set(x, -0.05, 1.33); head.add(n);
    });
    // visor band
    const visor = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.55, 0.1), darkMat);
    visor.position.set(0, 0.15, 0.72); head.add(visor);
    // big friendly eyes
    const eyeGeo = new THREE.SphereGeometry(0.23, 18, 18);
    const eyeL = new THREE.Mesh(eyeGeo, glowCyan); eyeL.position.set(-0.4, 0.16, 0.82); head.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, glowCyan); eyeR.position.set(0.4, 0.16, 0.82); head.add(eyeR);
    // brow plates (cute)
    [-0.4, 0.4].forEach(x => {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.12), panelMat);
      brow.position.set(x, 0.42, 0.8); brow.rotation.z = x < 0 ? 0.12 : -0.12; head.add(brow);
    });
    // sensor crest (keeps antTip name for animation)
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.5, 8), panelMat);
    ant.position.set(0, 0.85, 0); head.add(ant);
    const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), glowMag);
    antTip.position.set(0, 1.15, 0); head.add(antTip);
    const antGlow = new THREE.PointLight(MAG, 1.4, 5); antGlow.position.set(0, 1.15, 0); head.add(antGlow);

    // back fins / dino spikes (along back, into the tail)
    const fins = [];
    const finData = [[0.62,0.95,-0.5],[0.28,1.15,-0.95],[-0.12,1.05,-1.5],[-0.5,0.8,-2.0]];
    finData.forEach(([yy, s, zz]) => {
      const fin = new THREE.Mesh(new THREE.ConeGeometry(0.32 * s, 0.95 * s, 4), glowCyan);
      fin.position.set(0, yy, zz); fins.push(fin); robot.add(fin);
    });

    // ---- TAIL group (sways) ----
    const tail = new THREE.Group(); tail.position.set(0, -0.5, -0.7); robot.add(tail);
    let tx = 0, ty = 0, tz = 0, ts = 1.05;
    for (let i = 0; i < 6; i++) {
      const seg = new THREE.Mesh(new THREE.BoxGeometry(0.72 * ts, 0.72 * ts, 0.78 * ts), i % 2 ? panelMat : bodyMat);
      tz -= 0.52 * ts; ty += 0.16 * i;
      seg.position.set(0, ty, tz); tail.add(seg);
      ts *= 0.8;
    }
    const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 4), glowMag);
    tailTip.position.set(0, ty + 0.15, tz - 0.3); tailTip.rotation.x = -0.6; tail.add(tailTip);

    robot.scale.set(0.82, 0.82, 0.82);
    robot.position.y = -0.2;

    // ---- orbit rings (always) ----
    const ringGroup = new THREE.Group(); scene.add(ringGroup);
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.012, 8, 80), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.6 }));
    ring1.rotation.x = Math.PI/2.2; ringGroup.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.012, 8, 80), new THREE.MeshBasicMaterial({ color: MAG, transparent: true, opacity: 0.6 }));
    ring2.rotation.x = Math.PI/3; ring2.rotation.y = Math.PI/5; ringGroup.add(ring2);
    // orbiting dots on ring1
    const orbGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const orb1 = new THREE.Mesh(orbGeo, glowCyan); ring1.add(orb1);
    const orb2 = new THREE.Mesh(orbGeo, glowMag); ring2.add(orb2);

    // ---- MODE-SPECIFIC GROUPS ----
    // NEURAL: wireframe icosahedron core behind robot
    const neural = new THREE.Group(); scene.add(neural);
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 1), new THREE.MeshBasicMaterial({ color: VIO, wireframe: true, transparent: true, opacity: 0.2 }));
    core.position.z = -1.5; neural.add(core);
    // floating neural dots
    const nDots = new THREE.Group(); neural.add(nDots);
    for (let i = 0; i < 26; i++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), Math.random()<0.5?glowCyan:glowMag);
      const a = Math.random()*Math.PI*2, r = 2.8 + Math.random()*1.4, y = (Math.random()-0.5)*4;
      d.position.set(Math.cos(a)*r, y, Math.sin(a)*r - 1.5);
      d.userData = { a, r, y, s: 0.2 + Math.random()*0.5 };
      nDots.add(d);
    }

    // CHROME: metallic torus knot + chrome robot tint
    const chrome = new THREE.Group(); scene.add(chrome); chrome.visible = false;
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(2.3, 0.18, 140, 18, 2, 3),
      new THREE.MeshStandardMaterial({ color: 0xaad4ff, metalness: 1.0, roughness: 0.12, emissive: 0x220033, emissiveIntensity: 0.4 }));
    knot.position.z = -1; chrome.add(knot);

    // HUD: grid plane + reticle rings + scan
    const hud = new THREE.Group(); scene.add(hud); hud.visible = false;
    const grid = new THREE.GridHelper(16, 32, CYAN, 0x33224d);
    grid.position.y = -2.6; grid.material.transparent = true; grid.material.opacity = 0.4; hud.add(grid);
    const reticle = new THREE.Mesh(new THREE.RingGeometry(3.1, 3.2, 64), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    hud.add(reticle);
    const reticle2 = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.64, 6), new THREE.MeshBasicMaterial({ color: MAG, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
    hud.add(reticle2);
    // crosshair ticks
    for (let i = 0; i < 4; i++) {
      const tick = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.04), new THREE.MeshBasicMaterial({ color: CYAN, transparent:true, opacity:0.7 }));
      const ang = i * Math.PI/2;
      tick.position.set(Math.cos(ang)*3.5, Math.sin(ang)*3.5, 0); tick.rotation.z = ang;
      hud.add(tick);
    }

    let mode = 0;
    const modes = [neural, chrome, hud];
    window.HeroScene = {
      setMode(n) {
        mode = n;
        modes.forEach((g, i) => g.visible = (i === n));
        // robot material shift
        if (n === 1) { // chrome
          bodyMat.color.setHex(0x9fb8d8); bodyMat.metalness = 1.0; bodyMat.roughness = 0.1;
          panelMat.color.setHex(0xc0d4f0);
        } else {
          bodyMat.color.setHex(0x14101f); bodyMat.metalness = 0.75; bodyMat.roughness = 0.35;
          panelMat.color.setHex(0x241a3a); panelMat.metalness = 0.9; panelMat.roughness = 0.25;
        }
        ring1.material.color.setHex(n === 2 ? MAG : CYAN);
      }
    };

    // ---- click interaction: quick "happy" reaction + greeting bubble ----
    let cheerUntil = 0;
    let cheerLevel = 0;
    let popTimer = null;
    const stage = canvas.parentElement;
    const heroMouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(10, 10);
    let pointerInside = false;
    let dinoHover = false;

    function getHoverHintText() {
      return (window.CURRENT_LANG || 'es') === 'en' ? 'Click Dyno' : 'Haz clic en Dyno';
    }

    function setHoverState(on) {
      if (dinoHover === on) return;
      dinoHover = on;
      canvas.style.cursor = on ? 'pointer' : 'default';
      if (stage) {
        stage.dataset.dynoHint = getHoverHintText();
        stage.classList.toggle('is-dyno-hover', on);
      }
    }

    function updateRayPointer(e) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function updateHeroPointerTargets(e) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Track globally: map pointer position relative to hero canvas, even when cursor is outside it.
      heroMouse.tx = THREE.MathUtils.clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1.2, 1.2);
      heroMouse.ty = THREE.MathUtils.clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1.2, 1.2);
    }

    function updateHoverHit() {
      if (!pointerInside) { setHoverState(false); return false; }
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(robot.children, true);
      const hit = hits.length > 0;
      setHoverState(hit);
      return hit;
    }

    function sayHi() {
      if (!stage) return;
      let bubble = stage.querySelector('.hero-dyno-pop');
      if (!bubble) {
        bubble = document.createElement('div');
        bubble.className = 'hero-dyno-pop';
        stage.appendChild(bubble);
      }
      bubble.textContent = (window.CURRENT_LANG || 'es') === 'en' ? 'Rawr! Hi!' : 'Rawr! Hola!';
      bubble.classList.remove('show');
      void bubble.offsetWidth; // retrigger css animation
      bubble.classList.add('show');
      if (popTimer) clearTimeout(popTimer);
      popTimer = setTimeout(() => bubble.classList.remove('show'), 1200);
    }
    canvas.addEventListener('pointermove', (e) => {
      pointerInside = true;
      updateRayPointer(e);
      updateHeroPointerTargets(e);
      updateHoverHit();
    });
    canvas.addEventListener('pointerenter', (e) => {
      pointerInside = true;
      updateRayPointer(e);
      updateHeroPointerTargets(e);
      updateHoverHit();
    });
    canvas.addEventListener('pointerleave', () => {
      pointerInside = false;
      setHoverState(false);
    });
    canvas.addEventListener('pointerdown', (e) => {
      updateRayPointer(e);
      updateHeroPointerTargets(e);
      if (!updateHoverHit()) return;
      cheerUntil = performance.now() + 1300;
      sayHi();
    });
    // Keep look tracking active even when pointer moves outside hero canvas.
    window.addEventListener('pointermove', updateHeroPointerTargets);

    const clock = new THREE.Clock();
    function frame() {
      const t = clock.getElapsedTime();
      const now = performance.now();
      const cheerTarget = now < cheerUntil ? 1 : 0;
      cheerLevel += (cheerTarget - cheerLevel) * 0.14;
      if (pointerInside) updateHoverHit();
      // robot idle hover + look
      heroMouse.x += (heroMouse.tx - heroMouse.x) * 0.08;
      heroMouse.y += (heroMouse.ty - heroMouse.y) * 0.08;
      const lookX = THREE.MathUtils.clamp(heroMouse.x, -0.95, 0.95);
      const lookY = THREE.MathUtils.clamp(-heroMouse.y, -0.95, 0.95);
      robot.position.y = -0.2 + Math.sin(t * 1.3) * 0.16 + Math.sin(t * 8.2) * 0.03 * cheerLevel;
      // Keep a slight hero angle, but allow subtle tracking so it does not stare to one side.
      robot.rotation.y = -0.08 + lookX * 0.32 + Math.sin(t * 0.4) * 0.06;
      robot.rotation.x = lookY * 0.08;
      robot.rotation.z = Math.sin(t * 7.4) * 0.03 * cheerLevel;
      neck.rotation.y = lookX * 0.18;
      neck.rotation.x = -lookY * 0.12;
      head.rotation.y = lookX * 0.45;
      head.rotation.x = -lookY * 0.24 + Math.sin(t * 0.6) * 0.03;
      head.rotation.z = Math.sin(t * 0.8) * 0.04 + Math.sin(t * 9.5) * 0.07 * cheerLevel;
      // tail sway + fin shimmer
      tail.rotation.y = Math.sin(t * 1.6) * 0.18 + Math.sin(t * 10.5) * 0.12 * cheerLevel;
      tail.rotation.x = Math.sin(t * 1.2) * 0.06;
      fins.forEach((f, i) => f.scale.setScalar(1 + Math.sin(t * 2 + i * 0.6) * 0.08));
      // blink-ish eye pulse
      const ep = 0.7 + Math.sin(t*3)*0.3;
      eyeL.scale.y = ep * (1 - cheerLevel * 0.22);
      eyeR.scale.y = ep * (1 - cheerLevel * 0.22);
      eyeL.scale.x = 1 + cheerLevel * 0.12;
      eyeR.scale.x = 1 + cheerLevel * 0.12;
      reactorRing.rotation.z += 0.02;
      antTip.scale.setScalar(1 + Math.sin(t*4)*0.15 + cheerLevel * 0.2);
      reactorLight.intensity = 1.6 + cheerLevel * 0.9;

      // rings
      ring1.rotation.z += 0.004; ring2.rotation.z -= 0.005;
      orb1.position.set(Math.cos(t*1.2)*3.4, Math.sin(t*1.2)*3.4, 0);
      orb2.position.set(Math.cos(-t*1.5)*3.0, Math.sin(-t*1.5)*3.0, 0);

      // mode anims
      if (mode === 0) {
        core.rotation.y += 0.003; core.rotation.x += 0.0015;
        nDots.children.forEach(d => {
          d.userData.a += 0.003 * d.userData.s;
          d.position.x = Math.cos(d.userData.a) * d.userData.r;
          d.position.z = Math.sin(d.userData.a) * d.userData.r - 1.5;
          d.position.y = d.userData.y + Math.sin(t + d.userData.r) * 0.2;
        });
      } else if (mode === 1) {
        knot.rotation.y += 0.006; knot.rotation.x += 0.003;
      } else {
        reticle.rotation.z += 0.004; reticle2.rotation.z -= 0.01; hud.rotation.y = Math.sin(t*0.3)*0.1;
      }

      renderer.render(scene, camera);
      if (heroRunning) requestAnimationFrame(frame);
    }
    window.HeroScene.setMode(0);
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
