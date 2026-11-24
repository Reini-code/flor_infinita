/*
 * FLOR INFINITA — Arte generativo para GitHub Pages
 * Sin frameworks, librerías ni imágenes externas.
 * Toda la flor se dibuja matemáticamente en Canvas 2D.
 */
(() => {
  'use strict';

  const canvas = document.getElementById('flowerCanvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  const timeline = document.getElementById('timeline');
  const playPause = document.getElementById('playPause');
  const playText = document.getElementById('playText');
  const playIcon = document.getElementById('playIcon');
  const replay = document.getElementById('replay');
  const paletteButton = document.getElementById('palette');
  const paletteLabel = document.getElementById('paletteLabel');
  const paletteDot = document.getElementById('paletteDot');
  const speedButton = document.getElementById('speed');
  const speedLabel = document.getElementById('speedLabel');
  const stageText = document.getElementById('stageText');
  const stepTitle = document.getElementById('stepTitle');
  const timer = document.getElementById('timer');

  const TAU = Math.PI * 2;
  const DURATION = 12; // segundos hasta que florece por completo
  const speedOptions = [0.75, 1, 1.5, 2];
  const colorSchemes = [
    { name: 'Rosa', colors: ['#f64c7e', '#fa8cab', '#ffc3cc', '#fff0d8', '#f3a3c4', '#e54275'], dot: 'linear-gradient(135deg,#ffbad2,#d6427e)', glow: [250, 89, 137] },
    { name: 'Lavanda', colors: ['#a779ed', '#d0b0ff', '#f2cdff', '#fff3ed', '#bdb9fb', '#805de0'], dot: 'linear-gradient(135deg,#e8cbff,#9568e8)', glow: [172, 123, 242] },
    { name: 'Aurora', colors: ['#ffb970', '#f5cf94', '#fff0c5', '#fff5df', '#fa98aa', '#ee8368'], dot: 'linear-gradient(135deg,#fff0bc,#f49c75)', glow: [245, 172, 123] },
    { name: 'Océano', colors: ['#43c7dc', '#85e2e1', '#c4f5ec', '#fff9e5', '#9ac4f8', '#478ce6'], dot: 'linear-gradient(135deg,#a8ffee,#488fe8)', glow: [68, 204, 220] }
  ];

  let seed = 324010;
  function random() { seed = (Math.imul(1664525, seed) + 1013904223) | 0; return (seed >>> 0) / 4294967296; }
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  let points = [];
  function dot(x, y, z, color, size, alpha, born, sparkle = false) {
    points.push({ x, y, z, color, size, alpha, born: clamp(born), flicker: random() * TAU, sparkle });
  }

  function buildGeometry() {
    seed = 324010;
    points = [];

    // ETAPA 1: espirales diminutas que nacen en el centro.
    for (let arm = 0; arm < 5; arm++) {
      for (let i = 0; i < 490; i++) {
        const t = i / 489;
        const a = arm * TAU / 5 + t * 13.1 + Math.sin(t * 8) * .16;
        const r = .008 + .255 * Math.pow(t, 1.24);
        const sideways = (random() - .5) * (.0005 + t * .014);
        const theta = a + sideways;
        const z = .09 * Math.cos(6 * t + arm) * Math.sin(Math.PI * t);
        dot(r * Math.cos(theta), r * Math.sin(theta), z, arm % 3 === 0 ? 3 : (arm % 2 ? 1 : 0), .55 + random() * 1.15,
          .48 + random() * .52, .008 + t * .14 + random() * .012, i % 22 === 0);
      }
    }

    // ETAPAS 2, 3 y 4: pétalos de puntos. Cada uno tiene profundidad (z),
    // curvatura radial, una torsión individual y bordes algo más luminosos.
    function petals({ petals, start, end, spread, twist, rows, columns, density, birth, duration, shade, depth }) {
      for (let p = 0; p < petals; p++) {
        const baseAngle = p * TAU / petals + (p % 2 ? .012 : -.012);
        for (let i = 0; i < rows; i++) {
          const u = (i + .25) / rows;
          const easedU = Math.pow(u, .92);
          for (let j = 0; j < columns; j++) {
            const v = (j / (columns - 1)) * 2 - 1;
            const edge = Math.abs(v) > .86;
            const texture = .65 + .35 * Math.abs(Math.sin(u * 27 + v * 9 + p));
            if (!edge && random() > density * texture) continue;
            const open = Math.pow(Math.sin(Math.PI * u), .72);
            const a = baseAngle + twist * (1 - u) ** 1.8 + spread * v * open;
            const petalRound = 1 - .17 * v * v * smooth(.55, 1, u);
            const flutter = 1 + .021 * Math.sin(11 * u + 4 * v + p * 1.4);
            const r = (start + (end - start) * easedU) * petalRound * flutter;
            const z = depth + .10 * Math.sin(Math.PI * u) * Math.cos(v * Math.PI / 2)
              + .034 * Math.sin(3 * u * Math.PI + v * 4 + p * .15);
            const color = edge ? (random() < .58 ? 2 : 3) : (random() < .17 ? 4 : shade);
            const born = birth + duration * u + (random() - .5) * .033;
            const size = (edge ? .85 : .53) + random() * (edge ? 1.15 : 1.25);
            dot(r * Math.cos(a), r * Math.sin(a) * .975, z, color, size,
              (edge ? .72 : .42) + random() * .27, born, edge && random() < .04);
          }
        }
      }
    }

    // Pétalos rojos interiores: surgen de la espiral.
    petals({ petals: 8, start: .065, end: .59, spread: .42, twist: .30, rows: 130, columns: 28,
      density: .81, birth: .11, duration: .42, shade: 0, depth: .105 });

    // Segunda corona: rosa intenso que gira en dirección opuesta.
    petals({ petals: 12, start: .16, end: .83, spread: .305, twist: -.24, rows: 145, columns: 25,
      density: .62, birth: .31, duration: .43, shade: 1, depth: .01 });

    // Corona exterior: encaje claro como en la referencia.
    petals({ petals: 18, start: .42, end: .98, spread: .25, twist: .18, rows: 92, columns: 18,
      density: .56, birth: .59, duration: .40, shade: 4, depth: -.08 });

    // Bordes ornamentales, como un mandala de filamentos de luz.
    for (let ring = 0; ring < 3; ring++) {
      const count = 4200;
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const a = TAU * t;
        const lobes = 18;
        const edgeR = .907 + .079 * Math.cos(lobes * a + ring * .39)
          + .02 * Math.sin(lobes * 2 * a + ring * .6);
        const r = edgeR - ring * .034 + (random() - .5) * .008;
        const z = -.07 + .03 * Math.sin(lobes * a);
        dot(r * Math.cos(a), r * Math.sin(a) * .98, z, (ring === 0 ? 3 : (ring === 1 ? 2 : 4)),
          .51 + random() * 1.12, .5 + random() * .43, .73 + .25 * t + (random() - .5) * .07,
          i % 101 === 0);
      }
    }

    // Curvas de cuentas que rodean las puntas de los pétalos.
    for (let p = 0; p < 18; p++) {
      const a0 = TAU * p / 18;
      for (let i = 0; i < 230; i++) {
        const t = i / 229;
        const q = t * 2 - 1;
        const r = .86 + .115 * Math.cos(q * Math.PI / 2) + .016 * Math.sin(q * 4 * Math.PI);
        const a = a0 + q * .17;
        dot(r * Math.cos(a), r * Math.sin(a), -.07, i % 4 === 0 ? 3 : 2,
          .55 + random() * 1.05, .55 + random() * .4, .77 + t * .20, i % 51 === 0);
      }
    }
    // Pinta puntos del mismo tono consecutivamente para reducir cambios de estilo.
    points.sort((a, b) => a.color - b.color);
  }
  buildGeometry();

  let width = 0; let height = 0; let dpr = 1; let radius = 1;
  let elapsed = 0; let playing = true; let last = performance.now();
  let speedIndex = 1; let paletteIndex = 0;
  let lastStage = -1;
  let bursts = [];

  const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaReduce.matches) { elapsed = DURATION; playing = false; }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    radius = Math.min((width - 22) * .49, (height - 32) * .475, 350);
    // Mantiene la flor visible al 100% en móviles pequeños.
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function stageInfo(progress) {
    if (progress < .18) return [0, 'Despertando las espirales', 'El comienzo'];
    if (progress < .50) return [1, 'Nacen los primeros pétalos', 'Primeros pétalos'];
    if (progress < .79) return [2, 'La flor se abre', 'Todo florece'];
    if (progress < .995) return [3, 'Un universo en expansión', 'Últimos destellos'];
    return [4, 'Una flor hecha de infinitos puntos', 'Flor infinita'];
  }

  function updateUI() {
    const p = clamp(elapsed / DURATION);
    timeline.value = Math.round(p * 1000);
    timeline.style.setProperty('--progress', `${p * 100}%`);
    const stamp = Math.floor(elapsed);
    timer.textContent = `00:${String(stamp).padStart(2, '0')} / 00:${DURATION}`;
    const [index, description, title] = stageInfo(p);
    if (lastStage !== index) {
      stageText.textContent = description;
      stepTitle.textContent = title;
      lastStage = index;
    }
    const completed = elapsed >= DURATION;
    playText.textContent = playing ? 'Pausar' : (completed ? 'Repetir' : 'Continuar');
    playIcon.textContent = playing ? 'Ⅱ' : (completed ? '↻' : '▶');
    playPause.setAttribute('aria-label', playing ? 'Pausar animación' : (completed ? 'Repetir animación' : 'Continuar animación'));
  }

  // Lienzo con perspectiva ligeramente inclinada y rotación muy lenta.
  function render(now) {
    // En celulares limitamos a ~30 FPS para ahorrar batería y mantener fluidez.
    if (width < 600 && now - last < 1000 / 30) {
      requestAnimationFrame(render);
      return;
    }
    const delta = Math.min((now - last) / 1000, .08);
    last = now;
    if (playing) {
      elapsed = Math.min(DURATION, elapsed + delta * speedOptions[speedIndex]);
      if (elapsed >= DURATION) playing = false;
    }
    const progress = clamp(elapsed / DURATION);
    const t = now / 1000;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height * .515;
    const scheme = colorSchemes[paletteIndex];

    // Halo sutil, no oculta los detalles de la geometría de puntos.
    const haloSize = radius * (0.22 + progress * .73);
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, haloSize);
    const [r, g, b] = scheme.glow;
    glow.addColorStop(0, `rgba(${r},${g},${b},${.16 + progress * .065})`);
    glow.addColorStop(.4, `rgba(${r},${g},${b},.055)`);
    glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, haloSize, 0, TAU); ctx.fill();

    const angle = .16 + t * .013;
    const c = Math.cos(angle); const s = Math.sin(angle);
    const tilt = .12 + Math.sin(t * .19) * .055;
    const ct = Math.cos(tilt); const st = Math.sin(tilt);
    const breath = 1 + .017 * Math.sin(t * 1.25);
    const scale = radius * breath;

    // Para cada punto esperamos a su 'nacimiento'; entonces aparece de
    // dentro hacia fuera. Separa espirales, pétalos y corona de encaje.
    let lastColor = -1;
    let lastAlpha = -1;
    const stride = width < 600 ? 2 : 1;
    for (let i = 0; i < points.length; i += stride) {
      const point = points[i];
      if (point.born > progress) continue;
      if (point.color !== lastColor) {
        ctx.fillStyle = scheme.colors[point.color];
        lastColor = point.color;
      }
      const age = smooth(point.born, point.born + .055, progress);
      const shimmer = .84 + .16 * Math.sin(t * 1.9 + point.flicker);
      const alpha = Math.min(1, point.alpha * age * shimmer);
      // Redondeo para evitar reasignaciones muy costosas al dibujar 50k puntos.
      const alphaLevel = Math.max(1, Math.round(alpha * 9));
      if (alphaLevel !== lastAlpha) { ctx.globalAlpha = alphaLevel / 9; lastAlpha = alphaLevel; }
      const wave = 1 + point.z * .1 * Math.sin(t * .6 + point.flicker);
      const x = point.x * c - point.y * s;
      const y = point.x * s + point.y * c;
      const yy = y * ct - point.z * st;
      const zz = y * st + point.z * ct;
      const perspective = 1.0 + zz * .13;
      const px = cx + x * scale * perspective * wave;
      const py = cy + yy * scale * perspective * wave;
      const dim = Math.max(.65, point.size * Math.min(1.18, scale / 270 + .25));
      ctx.fillRect(px, py, dim, dim);
      if (point.sparkle && age > .99 && (i % 3 === 0)) {
        if (Math.sin(t * 2.1 + point.flicker) > .965) {
          ctx.fillRect(px - 2.1, py + dim * .5, dim + 4, .6);
          ctx.fillRect(px + dim * .5, py - 2.1, .6, dim + 4);
        }
      }
    }
    ctx.globalAlpha = 1;

    // Estrellitas que aparecen al tocar o hacer clic.
    for (let i = bursts.length - 1; i >= 0; i--) {
      const burst = bursts[i];
      burst.age += delta;
      if (burst.age > 1.8) { bursts.splice(i, 1); continue; }
      const life = 1 - burst.age / 1.8;
      for (const spark of burst.sparks) {
        const distance = 13 + burst.age * spark.speed;
        const x = burst.x + Math.cos(spark.angle) * distance;
        const y = burst.y + Math.sin(spark.angle) * distance + burst.age * burst.age * 16;
        ctx.globalAlpha = life * spark.alpha;
        ctx.fillStyle = scheme.colors[spark.color];
        ctx.beginPath(); ctx.arc(x, y, spark.size * (0.5 + life), 0, TAU); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    updateUI();
    requestAnimationFrame(render);
  }

  function clickBurst(x, y) {
    const sparks = Array.from({ length: 28 }, (_, i) => ({
      angle: TAU * i / 28 + random() * .19,
      speed: 28 + random() * 60,
      size: 1 + random() * 2.1,
      color: Math.floor(random() * 4), alpha: .5 + random() * .5
    }));
    bursts.push({ x, y, age: 0, sparks });
    if (bursts.length > 8) bursts.shift();
  }
  canvas.addEventListener('pointerdown', ev => {
    const rect = canvas.getBoundingClientRect();
    clickBurst(ev.clientX - rect.left, ev.clientY - rect.top);
  });

  playPause.addEventListener('click', () => {
    if (elapsed >= DURATION) elapsed = 0;
    playing = !playing;
    updateUI();
  });
  replay.addEventListener('click', () => {
    elapsed = 0;
    playing = true;
    lastStage = -1;
    bursts = [];
    updateUI();
  });
  timeline.addEventListener('input', () => {
    elapsed = Number(timeline.value) / 1000 * DURATION;
    lastStage = -1;
    updateUI();
  });
  paletteButton.addEventListener('click', () => {
    paletteIndex = (paletteIndex + 1) % colorSchemes.length;
    const scheme = colorSchemes[paletteIndex];
    paletteLabel.textContent = scheme.name;
    paletteDot.style.background = scheme.dot;
  });
  speedButton.addEventListener('click', () => {
    speedIndex = (speedIndex + 1) % speedOptions.length;
    speedLabel.textContent = `${speedOptions[speedIndex]}×`;
  });

  updateUI();
  requestAnimationFrame(render);
})();
