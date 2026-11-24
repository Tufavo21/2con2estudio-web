import { createGlass } from './glass.js';

const root = document.getElementById('root');
const W = +root.dataset.width, H = +root.dataset.height, V = H > W;
const u = Math.min(W, H) / 1080;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const vars = { porcelanosa: '', telefono: '+34 620 22 21 23', instagram: '@2con2estudio', web: '' };
try { Object.assign(vars, window.__hyperframes?.getVariables?.() || {}); } catch {}

const bez = (x1, y1, x2, y2) => (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  let lo = 0, hi = 1, m = 0.5;
  for (let i = 0; i < 40; i++) {
    m = (lo + hi) / 2;
    if (3 * x1 * m * (1 - m) ** 2 + 3 * x2 * m * m * (1 - m) + m ** 3 < t) lo = m; else hi = m;
  }
  return 3 * y1 * m * (1 - m) ** 2 + 3 * y2 * m * m * (1 - m) + m ** 3;
};
const eMask = bez(0.2, 0.8, 0.2, 1);
const eIO = bez(0.65, 0, 0.35, 1);
const eOut = bez(0.16, 1, 0.3, 1);
const eEase = bez(0, 0, 0.58, 1);
const eIn = bez(0.5, 0, 0.75, 0);
const eCur = bez(0.45, 0.05, 0.22, 1);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, d) => clamp((t - a) / d);
const lerp = (a, b, k) => a + (b - a) * k;
const hash = (n) => { let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
const mixHex = (a, b, k) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`;
};

// Oscilador amortiguado: m·y'' + c·y' + k·y = 0, solución cerrada.
const springSolve = (k, c, m, y0, v0, t) => {
  const w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m));
  if (z < 0.9999) {
    const wd = w0 * Math.sqrt(1 - z * z), e = Math.exp(-z * w0 * t), B = (v0 + z * w0 * y0) / wd;
    const cs = Math.cos(wd * t), sn = Math.sin(wd * t);
    const y = e * (y0 * cs + B * sn);
    return [y, -z * w0 * y + e * (-y0 * wd * sn + B * wd * cs)];
  }
  if (z < 1.0001) {
    const e = Math.exp(-w0 * t), a = v0 + w0 * y0;
    return [(y0 + a * t) * e, a * e - w0 * (y0 + a * t) * e];
  }
  const s = Math.sqrt(z * z - 1), r1 = -w0 * (z - s), r2 = -w0 * (z + s);
  const A = (v0 - r2 * y0) / (r1 - r2), Bc = y0 - A;
  return [A * Math.exp(r1 * t) + Bc * Math.exp(r2 * t), A * r1 * Math.exp(r1 * t) + Bc * r2 * Math.exp(r2 * t)];
};
const track = ({ stiffness: k, damping: c, mass: m = 1 }, x0, keys) => {
  const st = [];
  let x = x0, v = 0, prevT = null, prevTarget = x0;
  for (const [t, target] of keys) {
    if (prevT !== null) { const [y, vv] = springSolve(k, c, m, x - prevTarget, v, t - prevT); x = prevTarget + y; v = vv; }
    st.push({ t, target, x, v });
    prevT = t;
    prevTarget = target;
  }
  return (t) => {
    let s = null;
    for (const e of st) if (e.t <= t) s = e;
    if (!s) return x0;
    return s.target + springSolve(k, c, m, s.x - s.target, s.v, t - s.t)[0];
  };
};
const simSpring = ({ stiffness: k, damping: c, mass: m = 1 }, x0, targetFn, t0, t1, dt = 1 / 240) => {
  const n = Math.ceil((t1 - t0) / dt) + 1, xs = new Float64Array(n);
  let x = x0, v = 0;
  for (let i = 0; i < n; i++) {
    xs[i] = x;
    const tg = targetFn(t0 + i * dt);
    const [y, vv] = springSolve(k, c, m, x - tg, v, dt);
    x = tg + y;
    v = vv;
  }
  return (t) => {
    const f = clamp((t - t0) / dt, 0, n - 1), i = Math.floor(f), r = f - i;
    return i + 1 < n ? lerp(xs[i], xs[i + 1], r) : xs[n - 1];
  };
};
const pieces = (keys, ease = eCur) => (t) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (keys[i][2] || ease)(prog(t, keys[i - 1][0], keys[i][0] - keys[i - 1][0])));
  return keys[keys.length - 1][1];
};

const TS = { cubeOut: 5.0, tiltIn: 5.35, tiltOut: 15.85, pinIn: 15.85, baIn: 23.75, swIn: 38.0, detIn: 43.85, matIn: 45.25, closeIn: 52.3 };

const L = V
  ? { mx: 120, headT: 300, headSize: 62, cube1: [0.5 * W, 0.33 * H, 0.42], titleCy: 0.3 * H, subY: 0.565 * H,
      view: [0, 330, W, 920], bandH: 230, bandTop: 330, bandSize: 54, logoW: 360, ctaSize: 46, safe: [120, 300, 780, 1190] }
  : { mx: Math.round(0.065 * W), headT: 0.115 * H, headSize: 88, cube1: [0.6 * W, 0.47 * H, 0.92], titleCy: 0.47 * H, subY: 0.83 * H,
      view: [0, 0, W, H], bandH: 0.22 * H, bandTop: 0.78 * H, bandSize: 84, logoW: 320, ctaSize: 66, safe: [60, 60, W - 60, H - 60] };
const [VX, VY, VW, VH] = L.view;
const css = { '--u': u, '--mx': `${L.mx}px`, '--head-t': `${L.headT}px`, '--head-size': `${L.headSize}px`, '--band-size': `${L.bandSize}px`,
  '--logo-w': `${L.logoW}px`, '--cta-size': `${L.ctaSize}px` };
for (const [k, v] of Object.entries(css)) root.style.setProperty(k, v);

const rise = (el, t, tin, tout = 1e9, din = 0.65, dout = 0.45) => {
  const y = t < tout ? 130 * (1 - eMask(prog(t, tin, din))) : -130 * eIO(prog(t, tout, dout));
  el.style.transform = `translateY(${y}%)`;
};
const inset = (el, top, right, bottom, left) => { el.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`; };
const hide = (el) => inset(el, H, 0, 0, 0);
const sheen = (el, t, t0) => { el.style.backgroundPosition = `${lerp(120, -20, eIO(prog(t, t0, 1.5)))}% 0`; };
const hoverK = (t, on, off, d) => (t < on ? 0 : t < off ? eEase(prog(t, on, d)) : eEase(prog(t, on, d)) * (1 - eEase(prog(t, off, d))));

/* ---------- Apertura: titular en canvas + cubo de cristal ---------- */
const cv2 = document.createElement('canvas');
cv2.width = W;
cv2.height = H;
const g2 = cv2.getContext('2d');
const fontD = (s) => `400 ${s}px "Bodoni Moda"`;
const fitSize = (text, maxW) => { g2.font = fontD(100); g2.letterSpacing = '1px'; const w = g2.measureText(text).width; g2.letterSpacing = '0px'; return (100 * maxW) / w; };
const maskedText = (t, text, x, yBase, asc, desc, tin, dur, align = 'center') => {
  const k = eMask(prog(t, tin, dur));
  if (k <= 0) return;
  const h = asc + desc;
  g2.save();
  g2.beginPath();
  g2.rect(0, yBase - asc - 0.06 * h, W, h * 1.12);
  g2.clip();
  g2.textAlign = align;
  g2.fillText(text, x, yBase + (1 - k) * h * 1.12);
  g2.restore();
};
let title, sub, glass;
const prepTitle = () => {
  const lines = V ? ['2CON2', 'ESTUDIO'] : ['2CON2ESTUDIO'];
  const size = Math.min(...lines.map((l) => fitSize(l, (V ? 0.9 : 0.88) * W)));
  g2.font = fontD(size);
  const m = g2.measureText('2CON2ESTUDIO');
  const asc = m.actualBoundingBoxAscent, desc = Math.max(m.actualBoundingBoxDescent, size * 0.02), lh = asc * 1.18;
  title = { lines, size, asc, desc, lh, y0: L.titleCy - ((lines.length - 1) * lh) / 2 + asc / 2 };
  const ss = 28 * u, sf = `400 ${ss}px "Jost"`;
  g2.font = sf;
  g2.letterSpacing = `${0.2 * ss}px`;
  const subLines = V ? ['INTERIORISMO DE LUJO', 'Y REFORMAS A MEDIDA', 'EN VALENCIA'] : ['INTERIORISMO DE LUJO Y REFORMAS A MEDIDA EN VALENCIA'];
  sub = subLines.flatMap((line, li) => {
    let x = W / 2 - g2.measureText(line).width / 2;
    return line.split(' ').map((w) => { const it = { w, x, y: L.subY + li * ss * 1.9 }; x += g2.measureText(`${w} `).width; return it; });
  });
  g2.letterSpacing = '0px';
  Object.assign(sub, { font: sf, size: ss });
};
const drawTitle = (t) => {
  g2.fillStyle = '#EDE6DA';
  g2.fillRect(0, 0, W, H);
  g2.fillStyle = '#15120E';
  g2.font = fontD(title.size);
  g2.letterSpacing = `${0.01 * title.size}px`;
  title.lines.forEach((l, i) => maskedText(t, l, W / 2, title.y0 + i * title.lh, title.asc, title.desc, -1.1, 1.1));
  g2.letterSpacing = `${0.2 * sub.size}px`;
  g2.font = sub.font;
  g2.fillStyle = '#4A433A';
  sub.forEach((s, i) => maskedText(t, s.w, s.x, s.y, sub.size * 0.75, sub.size * 0.25, 1.0 + i * 0.075, 0.65, 'left'));
  g2.letterSpacing = '0px';
};
const renderGL = (t) => {
  if (t > TS.tiltIn + 1.0) return;
  drawTitle(t);
  glass.setBackground(cv2);
  const [cx, cy, s] = L.cube1;
  const w = glass.worldToPx(lerp(cx, W / 2, eIn(prog(t, TS.cubeOut, 0.9))), lerp(cy, H / 2, eIn(prog(t, TS.cubeOut, 0.9))));
  const grow = 1 + 3.2 * eIn(prog(t, TS.cubeOut, 0.95));
  glass.render({ rx: -0.42 + 0.05 * Math.sin(0.55 * t), ry: 0.62 + 0.12 * t + (Math.PI / 2) * eIO(prog(t, TS.cubeOut - 0.1, 0.95)), rz: 0.18 + 0.03 * Math.sin(0.4 * t + 1),
    x: w.x, y: w.y, s: s * eOut(prog(t, 0.35, 1.2)) * grow, disp: 1 - 0.85 * eIO(prog(t, 0.7, 0.6)) });
};

/* ---------- Cursor virtual ---------- */
const CUR = [], CLICKS = [], GRABS = [], SHOW = [];
const curPos = (t) => {
  if (!CUR.length) return [W / 2, H / 2];
  if (t <= CUR[0].t) return [CUR[0].x, CUR[0].y];
  for (let i = 1; i < CUR.length; i++) {
    const a = CUR[i - 1], b = CUR[i];
    if (t <= b.t) {
      if (b.fn) return b.fn(t);
      const s = (b.ease || eCur)(prog(t, a.t, b.t - a.t));
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
      const bulge = (hash(i * 13) - 0.5) * 0.24 * d * Math.sin(Math.PI * s);
      return [lerp(a.x, b.x, s) - (dy / d) * bulge + 0.8 * u * Math.sin(t * 7.3 + i), lerp(a.y, b.y, s) + (dx / d) * bulge + 0.8 * u * Math.sin(t * 5.9 + i * 2)];
    }
  }
  const z = CUR[CUR.length - 1];
  return [z.x, z.y];
};
const renderCursor = (t) => {
  const el = $('#cursor');
  let vis = 0;
  for (const [a, b] of SHOW) if (t >= a - 0.3 && t <= b + 0.3) vis = Math.max(vis, eOut(prog(t, a - 0.3, 0.3)) * (1 - eIO(prog(t, b, 0.3))));
  const [x, y] = curPos(t);
  let press = 0, rip = -1;
  for (const c of CLICKS) if (t >= c && t - c < 0.7) { press = Math.exp(-9 * (t - c)) * Math.cos(18 * (t - c)); rip = prog(t, c, 0.5); }
  let grab = 0;
  for (const [a, b] of GRABS) grab = Math.max(grab, t < a ? 0 : t < b ? eEase(prog(t, a, 0.12)) : 1 - eEase(prog(t, b, 0.18)));
  el.style.transform = `translate(${x}px, ${y}px) scale(${vis})`;
  $('.cur__ring', el).style.transform = `scale(${(1 - 0.24 * press) * (1 - 0.16 * grab)})`;
  const r = $('.cur__ripple', el);
  r.style.transform = `scale(${rip < 0 || rip >= 1 ? 0 : 1 + 1.7 * eOut(rip)})`;
  r.style.borderWidth = `${(1 - rip) * 1.5 * u}px`;
};

/* ---------- Fondo fantasma y cabeceras ---------- */
const renderHead = (head, t, t0, tout = 1e9) => {
  $$('.mi', head).forEach((mi, i) => rise(mi, t, t0 + i * 0.075, tout));
  $$('.sheen-text', head).forEach((el, i) => sheen(el, t, t0 + 0.75 + i * 0.1));
};
const ghost = (sc, t, t0, dir = -1) => { $('.ghost', sc).style.transform = `translate(${dir * (t - t0) * 38 * u - (dir < 0 ? 0.1 * W : 1.4 * W)}px, -50%)`; };

/* ---------- 1. TiltCard ---------- */
const TILT = { cards: [] };
const buildTilt = () => {
  const n = 4, gap = 28 * u;
  const cw = V ? (768 - 24) / 2 : (W - 2 * L.mx - 3 * gap) / 4, ch = V ? 320 : 350 * u;
  const pos = (i) => (V ? [120 + (i % 2) * (cw + 24), 450 + Math.floor(i / 2) * (ch + 24)] : [L.mx + i * (cw + gap), 0.43 * H]);
  const row = $('#tilt-row');
  $$('.tcard').forEach((card, i) => {
    const [x, y] = pos(i);
    const slot = document.createElement('div');
    slot.className = 'tslot';
    Object.assign(slot.style, { left: `${x}px`, top: `${y}px`, width: `${cw}px`, height: `${ch}px` });
    row.appendChild(slot);
    slot.appendChild(card);
    const real = card.dataset.tag === 'Real';
    card.innerHTML = `<div class="tcard__circle"></div><div class="tcard__hd"><div><div class="tcard__t">${card.dataset.title}</div><div class="tcard__d">${card.dataset.desc}</div></div>
      <div class="chip2" style="align-self:flex-start"><span>${card.dataset.kind}</span><span class="${real ? 'ok' : 'il'}">${card.dataset.tag}</span></div></div><img class="tcard__img" src="${card.dataset.img}" alt="">`;
    const en = 7.05 + 2.15 * i, ex = en + 1.85;
    const P = (fx, fy) => [x + fx * cw, y + fy * ch];
    const path = [[en, ...P(0.06, 0.6)], [en + 0.75, ...P(0.48, 0.32)], [en + 1.2, ...P(0.56, 0.4)], [ex, ...P(0.95, 0.74)]];
    TILT.cards.push({ slot, card, x, y, cw, ch, en, ex, path, entry: P(0.06, 0.6), circle: $('.tcard__circle', card), img: $('.tcard__img', card),
      enter: track({ stiffness: 400, damping: 22 }, 0, [[5.9 + 0.09 * i, 1]]) });
  });
  CUR.push({ t: 6.75, x: TILT.cards[0].x - 140 * u, y: TILT.cards[0].y + TILT.cards[0].ch + 120 * u });
  TILT.cards.forEach((c) => c.path.forEach(([t, x, y], j) => CUR.push({ t, x, y, ease: j === 0 ? eCur : bez(0.4, 0, 0.3, 1) })));
  CUR.push({ t: 15.7, x: W * 0.82, y: H * 0.95 });
  SHOW.push([6.85, 15.5]);
  const rel = (c, t) => { const [px, py] = curPos(t); return [clamp((px - c.x) / c.cw), clamp((py - c.y) / c.ch)]; };
  TILT.cards.forEach((c) => {
    const inside = (t) => t >= c.en && t <= c.ex;
    c.ry = simSpring({ stiffness: 300, damping: 26 }, 0, (t) => (inside(t) ? (rel(c, t)[0] - 0.5) * 2 * 11 : 0), 6.0, 16.2);
    c.rx = simSpring({ stiffness: 300, damping: 26 }, 0, (t) => (inside(t) ? -(rel(c, t)[1] - 0.5) * 2 * 11 : 0), 6.0, 16.2);
  });
};
const renderTilt = (t) => {
  const sc = $('#s-tilt');
  if (t < TS.tiltIn || t > TS.pinIn + 0.75) { hide(sc); return; }
  const [cx, cy] = L.cube1;
  const r = Math.hypot(W, H) * eIO(prog(t, TS.tiltIn, 0.95));
  sc.style.clipPath = t < TS.tiltIn + 0.95 ? `circle(${r}px at ${cx}px ${cy}px)` : 'none';
  ghost(sc, t, TS.tiltIn);
  renderHead($('#tilt-head'), t, 5.75, TS.tiltOut - 0.2);
  const lift = eIO(prog(t, TS.tiltOut, 0.7));
  TILT.cards.forEach((c, i) => {
    const k = c.enter(t);
    const h = hoverK(t, c.en, c.ex, 0.4), hp = hoverK(t, c.en, c.ex, 0.3);
    c.slot.style.clipPath = `inset(-60px -80px ${(1 - eOut(prog(t, 5.9 + 0.09 * i, 0.6))) * 100}% -80px)`;
    c.card.style.transform = `translateY(${(1 - k) * 70 * u - lift * (60 + 20 * i) * u}px) scale(${(0.97 + 0.03 * k) * (1 + 0.05 * h)}) rotateX(${c.rx(t)}deg) rotateY(${c.ry(t)}deg)`;
    c.card.style.boxShadow = `0 ${(8 + 22 * h) * u}px ${(24 + 46 * h) * u}px rgba(21, 18, 14, ${0.06 + 0.12 * h})`;
    c.img.style.transform = `translate(${-2.6 * hp * u}px, ${-5.2 * hp * u}px) rotate(${-5 + 2 * hp}deg)`;
    const ex = c.entry[0] - c.x, ey = c.entry[1] - c.y;
    const rr = 560 * u * eOut(prog(t, c.en, 0.6)) * (1 - eIO(prog(t, c.ex, 0.4)));
    c.circle.style.clipPath = `circle(${rr}px at ${ex}px ${ey}px)`;
  });
};

/* ---------- 2. PinnedList ---------- */
const ICONS = {
  plan: '<rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><path d="M3.5 10h9v10.5M12.5 14h8"/>',
  pencil: '<path d="M4 20l1.2-4.4L16 4.8l3.2 3.2L8.4 18.8z"/><path d="M14 6.8l3.2 3.2"/>',
  brick: '<path d="M3 6h18v12H3z"/><path d="M3 12h18M9 6v6M15 12v6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.4 2.4M13.6 9.4l2 2"/>',
};
const PIN = '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>';
const PL = { items: [], te: [17.45, 18.95, 20.45, 21.95] };
const buildPin = () => {
  const list = $('#plist');
  const lx = V ? 120 : 0.5 * W, lw = V ? 660 : 0.43 * W, ly = V ? 540 : 0.17 * H;
  Object.assign(list.style, { left: `${lx}px`, top: `${ly}px`, width: `${lw}px` });
  Object.assign(PL, { lx, lw, ly, IH: 104 * u, GAP: 8 * u, SEC: 36 * u, SG: 20 * u });
  if (V) { $('#pin-head').style.top = '300px'; }
  else Object.assign($('#pin-head').style, { top: `${0.3 * H}px` });
  $$('.pitem', list).forEach((el, i) => {
    el.innerHTML = `<div class="picon"><svg viewBox="0 0 24 24">${ICONS[el.dataset.icon]}</svg></div><div class="ptxt"><div class="pname">${el.dataset.name}</div><div class="psub">${el.dataset.sub}</div></div>
      <div class="pbtn"><svg viewBox="0 0 24 24">${PIN}</svg></div>`;
    PL.items.push({ el, btn: $('.pbtn', el), svg: $('.pbtn svg', el), enter: track({ stiffness: 400, damping: 22 }, 0, [[16.35 + 0.08 * i, 1]]) });
  });
  PL.move = PL.te.map((te) => track({ stiffness: 380, damping: 20, mass: 0.8 }, 0, [[te, 1]]));
  PL.secIn = track({ stiffness: 400, damping: 22 }, 0, [[PL.te[0], 1]]);
  CUR.push({ t: 16.95, x: lx + lw + 120 * u, y: ly + 560 * u });
  PL.te.forEach((te, j) => {
    const y = PL.layout(j).items[j];
    const bx = lx + lw - 20 * u - 26 * u, by = ly + y + PL.IH / 2;
    CUR.push({ t: te - 0.32, x: bx + 4 * u, y: by + 3 * u });
    CUR.push({ t: te - 0.08, x: bx, y: by, ease: eEase });
    CLICKS.push(te - 0.06);
  });
  CUR.push({ t: 23.4, x: lx + lw * 0.4, y: H * 0.92 });
  SHOW.push([17.0, 23.1]);
};
PL.layout = (k) => {
  let cur = 0;
  const o = { items: [], secPin: 0, secAll: 0 };
  if (k > 0) { o.secPin = cur; cur += PL.SEC; }
  for (let i = 0; i < k; i++) { o.items[i] = cur; cur += PL.IH + PL.GAP; }
  if (k > 0) cur += PL.SG;
  o.secAll = cur;
  cur += PL.SEC;
  for (let i = k; i < 4; i++) { o.items[i] = cur; cur += PL.IH + PL.GAP; }
  return o;
};
const renderPin = (t) => {
  const sc = $('#s-pin');
  if (t < TS.pinIn || t > TS.baIn + 0.75) { hide(sc); return; }
  inset(sc, H * (1 - eIO(prog(t, TS.pinIn, 0.65))), 0, 0, 0);
  ghost(sc, t, TS.pinIn, 1);
  renderHead($('#pin-head'), t, 16.25, TS.baIn - 0.3);
  let k = 0;
  PL.te.forEach((te) => { if (t >= te) k++; });
  const A = PL.layout(Math.max(0, k - 1)), B = PL.layout(k), p = k ? PL.move[k - 1](t) : 1;
  const yAt = (key, i) => (i === undefined ? lerp(A[key], B[key], p) : lerp(A.items[i], B.items[i], p));
  PL.items.forEach((it, i) => {
    const e = it.enter(t);
    const moved = k && i === k - 1 ? p : 1;
    const y = yAt('items', i) - 6 * u * (1 - moved) + (1 - e) * 46 * u;
    it.el.style.transform = `translateY(${y}px) scale(${(0.97 + 0.03 * e) * lerp(0.96, 1, clamp(moved))})`;
    it.el.style.clipPath = `inset(0 0 ${(1 - eOut(prog(t, 16.35 + 0.08 * i, 0.55))) * 100}% 0 round ${24 * u}px)`;
    const c = eEase(prog(t, PL.te[i], 0.2));
    it.el.style.background = mixHex('#E6DED0', '#EFE2C8', c);
    it.btn.style.background = c > 0 ? mixHex('#DDD5C8', '#9A7B4C', c) : 'rgba(21,18,14,0.08)';
    it.svg.style.stroke = mixHex('#4A433A', '#FFFFFF', c);
    it.svg.style.transform = `rotate(${-45 * c}deg)`;
  });
  const sp = $('#psec-pin'), sa = $('#psec-all');
  const ks = PL.secIn(t);
  sp.style.transform = `translateY(${yAt('secPin') - 6 * u * (1 - ks)}px)`;
  sp.style.clipPath = `inset(0 0 ${t < PL.te[0] ? 100 : (1 - clamp(ks)) * 100}% 0)`;
  const allOut = eIO(prog(t, PL.te[3], 0.15));
  sa.style.transform = `translateY(${yAt('secAll') - 4 * u * allOut}px)`;
  sa.style.clipPath = `inset(0 0 ${Math.max(allOut, 1 - eOut(prog(t, 16.3, 0.5))) * 100}% 0)`;
};

/* ---------- 3 y 4. Antes/después + interruptor ---------- */
const BA = {};
const camBA = (t) => 1.02 + 0.06 * eIO(prog(t, TS.baIn, 14.25)) + 0.035 * prog(t, TS.swIn, 6);
const placeImg = (img, vw, vh, Z, fx = 0.5) => {
  const rs = Math.max(vw / 3840, vh / 2160), dw = 3840 * rs, dh = 2160 * rs;
  Object.assign(img.style, { width: `${dw}px`, height: `${dh}px`, left: `${(vw - dw) * fx}px`, top: `${(vh - dh) / 2}px`, transform: `scale(${Z})` });
};
const buildBA = () => {
  const view = $('#ba-view');
  Object.assign(view.style, { left: `${VX}px`, top: `${VY}px`, width: `${VW}px`, height: `${VH}px` });
  const band = $('#ba-band');
  Object.assign(band.style, { top: `${L.bandTop}px`, height: `${L.bandH}px` });
  const rawFn = pieces([[25.3, 92], [26.6, 45], [26.85, 44.2, eEase], [27.9, 14], [29.55, 72, bez(0.45, 0, 0.3, 1)], [29.56, 50, (x) => x], [34.3, 50], [35.5, 0, eIO]]);
  BA.raw = rawFn;
  BA.pos = simSpring({ stiffness: 300, damping: 30 }, 92, rawFn, TS.baIn, 44.5);
  BA.grab = [25.3, 29.55];
  const toX = (pct) => VX + (pct / 100) * VW, my = VY + VH * 0.5;
  CUR.push({ t: 24.7, x: VX + VW * 0.99, y: VY + VH * 0.78 });
  CUR.push({ t: 25.15, x: toX(92) + 3 * u, y: my + 4 * u });
  CUR.push({ t: 25.3, x: toX(92), y: my, ease: eEase });
  CUR.push({ t: 29.55, x: toX(72), y: my, fn: (t) => [toX(rawFn(t)), my + 9 * u * Math.sin((t - 25.3) * 2.1)] });
  CUR.push({ t: 30.3, x: VX + VW * 0.86, y: VY + VH * 0.9 });
  SHOW.push([24.75, 30.0]);
  GRABS.push(BA.grab);

  const sw = $('#swpanel');
  const pw = sw.offsetWidth, ph = sw.offsetHeight;
  const px = V ? (VW - pw) / 2 : VW - L.mx - pw, py = VH - (V ? 46 : 0.09 * H) - ph;
  Object.assign(sw.style, { left: `${px}px`, top: `${py}px` });
  const swEl = $('#sw'), sr = { x: px + swEl.offsetLeft, y: py + swEl.offsetTop };
  const M = { trackX: 163 * u, trackY: 79 * u, thumbX: 75 * u, thumbY: 62 * u, pad: 11 * u };
  M.travel = M.trackX - M.thumbX - M.pad * 2;
  BA.M = M;
  BA.swC = [sr.x + M.trackX / 2, sr.y + M.trackY / 2];
  BA.panelIn = track({ stiffness: 400, damping: 22 }, 0, [[38.45, 1]]);
  BA.grabS = track({ stiffness: 500, damping: 25 }, 0, [[39.7, 1], [40.55, 0]]);
  const tgt = pieces([[39.85, 0], [40.4, M.travel, bez(0.4, 0, 0.35, 1)]]);
  BA.thumb = simSpring({ stiffness: 700, damping: 48, mass: 0.55 }, 0, tgt, TS.swIn, 44.5);
  const thumbScreen = (x) => [VX + sr.x + M.pad + x + M.thumbX / 2, VY + sr.y + M.trackY / 2];
  CUR.push({ t: 39.05, x: VX + VW * 0.55, y: VY + VH * 0.62 });
  CUR.push({ t: 39.6, x: thumbScreen(0)[0] + 2 * u, y: thumbScreen(0)[1] + 3 * u });
  CUR.push({ t: 39.7, x: thumbScreen(0)[0], y: thumbScreen(0)[1], ease: eEase });
  CUR.push({ t: 40.55, x: thumbScreen(M.travel)[0], y: thumbScreen(0)[1], fn: (t) => [thumbScreen(tgt(t))[0] + 4 * u * prog(t, 39.85, 0.3), thumbScreen(0)[1]] });
  CUR.push({ t: 41.2, x: thumbScreen(M.travel)[0] - 160 * u, y: thumbScreen(0)[1] - 120 * u });
  SHOW.push([39.1, 41.0]);
  GRABS.push([39.7, 40.55]);

  const G = [[0.5, 0.315, 0.16, 0.12], [0.655, 0.45, 0.07, 0.09], [0.5, 0.12, 0.62, 0.05], [0.2, 0.13, 0.18, 0.05], [0.8, 0.13, 0.18, 0.05]];
  BA.glows = G.map(([a, b, w, h]) => { const i = document.createElement('i'); $('#glows').appendChild(i); return { i, a, b, w, h }; });
};
const renderBA = (t) => {
  const sc = $('#s-ba');
  if (t < TS.baIn || t > TS.detIn + 0.7) { hide(sc); return; }
  const k = eIO(prog(t, TS.baIn, 0.75));
  inset(sc, 0, (1 - k) * W / 2, 0, (1 - k) * W / 2);
  const Z = camBA(t);
  ['#ba-after img', '#ba-before img', '#sw-night img'].forEach((s) => placeImg($(s), VW, VH, Z));
  const pos = clamp(BA.pos(t), 0, 100);
  $('#ba-before').style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
  const g = t < BA.grab[0] ? 0 : t < BA.grab[1] ? eEase(prog(t, BA.grab[0], 0.15)) : 1 - eEase(prog(t, BA.grab[1], 0.2));
  const dvis = t > 35.6 ? 0 : 1;
  $('#divider').style.transform = `translateX(${(pos / 100) * VW}px) scaleY(${dvis * eOut(prog(t, 24.3, 0.5))})`;
  $('#handle').style.transform = `translate(-50%, -50%) scale(${1 + 0.12 * g})`;
  rise($('#tag-antes .mi'), t, 24.4, 35.15);
  rise($('#tag-despues .mi'), t, 24.5, 37.75);
  rise($('#ba-note .mi'), t, 24.6, 43.6);
  const kb = eMask(prog(t, 35.7, 0.7)) * (1 - eIO(prog(t, 37.85, 0.35)));
  $('#ba-band').style.clipPath = `inset(${(1 - kb) * 100}% 0 0 0)`;
  $$('#ba-band .mi').forEach((mi, i) => rise(mi, t, 36.0 + i * 0.075, 37.75));
  sheen($('#ba-band .sheen-text'), t, 36.7);

  const panel = $('#swpanel');
  const kp = BA.panelIn(t);
  panel.style.transform = `translateY(${(1 - kp) * 30 * u}px) scale(${0.94 + 0.06 * clamp(kp)})`;
  panel.style.clipPath = `inset(${(1 - eOut(prog(t, 38.45, 0.5))) * 100}% 0 0 0 round ${28 * u}px)`;
  const M = BA.M, gr = BA.grabS(t), tx = BA.thumb(t);
  const tw = M.thumbX + gr * M.pad * 4.5, th = M.thumbY + gr * M.pad * 2.3, ox = tx - (tw - M.thumbX) / 2;
  const act = clamp(tx / M.travel);
  const thumbCss = `translate(${M.pad + ox}px, -50%)`;
  Object.assign($('.sw__thumb').style, { width: `${tw}px`, height: `${th}px`, transform: thumbCss, opacity: 1 - 0.8 * clamp(gr) });
  Object.assign($('.sw__liquid').style, { width: `${tw}px`, height: `${th}px`, transform: `${thumbCss} scale(${0.82 + 0.26 * clamp(gr)})`, opacity: 0.76 * clamp(gr) });
  $('.sw__on').style.opacity = act;
  $('.sw__glow').style.opacity = act < 0.7 ? (act / 0.7) * 0.18 : 0.18 + ((act - 0.7) / 0.3) * 0.02;
  $('.sw__glow').style.transform = `scale(${0.82 + 0.18 * act})`;
  rise($('#st-dia'), t, 38.75, 40.65);
  rise($('#st-noche'), t, 40.8);
  const rN = Math.hypot(VW, VH) * eIO(prog(t, 40.6, 1.3));
  $('#sw-night').style.clipPath = `circle(${rN}px at ${BA.swC[0]}px ${BA.swC[1]}px)`;
  const I = t < 41.0 ? 0 : eOut(prog(t, 41.0, 0.35)) * (1 - 0.55 * eIO(prog(t, 41.35, 1.1)));
  const rs = Math.max(VW / 3840, VH / 2160), dw = 3840 * rs * Z, dh = 2160 * rs * Z;
  BA.glows.forEach((gl) => {
    const cx = VW / 2 + (gl.a - 0.5) * dw, cy = VH / 2 + (gl.b - 0.5) * dh, w = gl.w * dw, h = gl.h * dh;
    Object.assign(gl.i.style, { left: `${cx - w / 2}px`, top: `${cy - h / 2}px`, width: `${w}px`, height: `${h}px`, opacity: I });
  });
};

/* ---------- Transición: detalle ---------- */
const renderDet = (t) => {
  const sc = $('#s-det');
  if (t < TS.detIn || t > TS.matIn + 0.7) { hide(sc); return; }
  inset(sc, 0, W * (1 - eIO(prog(t, TS.detIn, 0.6))), 0, 0);
  placeImg($('#det-img img'), W, H, 1.0 + 0.05 * prog(t, TS.detIn, 2.0), V ? 0.22 : 0.5);
  $('#det-sweep').style.transform = `translateX(${lerp(-55, 55, eIO(prog(t, TS.detIn + 0.2, 1.2)))}%)`;
};

/* ---------- 5. NotionMentionLink ---------- */
const MAT = { chips: [] };
const buildMat = () => {
  const box = $('#pcards');
  $$('.chip').forEach((ch, i) => {
    ch.innerHTML = `<span class="chip__fav">${ch.dataset.l}</span><span class="chip__site">Material</span><span class="chip__t">${ch.dataset.title}</span>`;
    const x = V ? 120 : i % 2 ? 0.5 * W : L.mx, y = V ? 430 + i * 78 : (i < 2 ? 0.33 : 0.43) * H;
    Object.assign(ch.style, { left: `${x}px`, top: `${y}px` });
    const card = document.createElement('div');
    card.className = 'pcard';
    const sk = (h, w) => `<div class="sk" style="height:${h * 1.15 * u}px;width:${w}%"></div>`;
    card.innerHTML = `<div class="pcard__box"><div class="pcard__sk"><div class="sk pcard__img"></div><div class="pcard__lines">${sk(36, 80)}${sk(29, 100)}${sk(29, 66)}</div></div>
      <div class="pcard__ct"><img src="${ch.dataset.img}" alt=""><span class="pcard__il">Imagen ilustrativa</span><div class="pcard__body"><div class="pcard__t">${ch.dataset.title}</div>
      <div class="pcard__d">${ch.dataset.desc}</div><div class="pcard__dom"><i></i>Ficha de material · 2con2estudio</div></div></div></div>`;
    Object.assign(card.style, { left: `${x}px`, top: `${V ? 430 + 3 * 78 + ch.offsetHeight + 24 : y + ch.offsetHeight + 14 * u}px` });
    box.appendChild(card);
    const ti = 46.15 + 1.5 * i;
    MAT.chips.push({ ch, card, ti, sks: $$('.sk', card), ct: $('.pcard__ct', card), x, y, w: ch.offsetWidth, h: ch.offsetHeight });
  });
  CUR.push({ t: 45.75, x: MAT.chips[0].x + 120 * u, y: MAT.chips[0].y + 180 * u });
  MAT.chips.forEach((c) => {
    const tx = c.x + c.w * 0.62, ty = c.y + c.h * 0.55;
    CUR.push({ t: c.ti, x: tx, y: ty });
    CUR.push({ t: c.ti + 1.1, x: tx + 26 * u, y: ty + 4 * u, ease: eEase });
  });
  CUR.push({ t: 52.2, x: W * 0.8, y: H * 0.93 });
  SHOW.push([45.9, 51.95]);
};
const renderMat = (t) => {
  const sc = $('#s-mat');
  if (t < TS.matIn || t > TS.closeIn + 0.7) { hide(sc); return; }
  inset(sc, 0, 0, H * (1 - eIO(prog(t, TS.matIn, 0.6))), 0);
  renderHead($('#mat-head'), t, 45.75, TS.closeIn - 0.1);
  MAT.chips.forEach((c, i) => {
    const appear = eOut(prog(t, 45.95 + 0.08 * i, 0.5));
    c.ch.style.clipPath = `inset(0 ${(1 - appear) * 100}% 0 0)`;
    const hv = t >= c.ti && t < c.ti + 1.25 ? 1 : 0;
    c.ch.style.background = hv ? '#E6DED0' : 'transparent';
    const open = c.ti + 0.18, close = c.ti + 1.37;
    const ko = eOut(prog(t, open, 0.15)), kc = eIO(prog(t, close, 0.15));
    if (t < open || kc >= 1) { c.card.style.clipPath = 'inset(0 0 100% 0)'; return; }
    c.card.style.transform = `translateY(${(-8 * (1 - ko) - 6 * kc) * u}px) scale(${1 - 0.05 * kc})`;
    c.card.style.clipPath = `inset(0 0 ${(1 - ko) * 100}% 0)`;
    const sh = prog(t, open, 0.6);
    c.sks.forEach((s) => s.style.setProperty('--sh', `${lerp(-100, 100, sh)}%`));
    c.ct.style.clipPath = `inset(0 0 ${(1 - eMask(prog(t, open + 0.6, 0.22))) * 100}% 0)`;
  });
};

/* ---------- Cierre ---------- */
const renderClose = (t) => {
  const layer = $('#close'), t0 = TS.closeIn;
  if (t < t0) { hide(layer); return; }
  inset(layer, H * (1 - eIO(prog(t, t0, 0.65))), 0, 0, 0);
  const k = eMask(prog(t, t0 + 0.5, 0.95));
  $('#logo').style.transform = `translateY(${(1 - k) * 100}%) scale(${lerp(1.08, 1, k)})`;
  rise($('#cta .mi'), t, t0 + 0.9);
  $('#rule').style.transform = `scaleX(${eMask(prog(t, t0 + 1.05, 0.7))})`;
  rise($('#contact-line'), t, t0 + 1.15);
  if (V) rise($('#ig-text'), t, t0 + 1.225);
  if (vars.web) rise($('#web-text'), t, t0 + 1.3);
  if (vars.porcelanosa) rise($('#porc-text'), t, t0 + 1.4);
};

const renderGrain = (t) => {
  const f = Math.round(t * 30);
  $('#grain').style.transform = `translate(${-Math.floor(hash(f) * 64)}px, ${-Math.floor(hash(f + 999) * 64)}px)`;
};

let ready = false;
const render = (t) => {
  if (!ready) return;
  renderGL(t);
  renderTilt(t);
  renderPin(t);
  renderBA(t);
  renderDet(t);
  renderMat(t);
  renderClose(t);
  renderCursor(t);
  renderGrain(t);
};

window.__hf = window.__hf || {};
window.__hf.buildReady = window.__hf.buildReady || {};
window.__hf.buildReady.film = (async () => {
  await Promise.all(['400 50px "Bodoni Moda"', 'italic 400 50px "Bodoni Moda"', '300 50px "Jost"', '400 50px "Jost"', '500 50px "Jost"'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  root.dataset.fmt = V ? 'v' : 'h';
  $('#contact-line').textContent = V ? vars.telefono : `${vars.telefono}  ·  ${vars.instagram}`;
  if (V) $('#ig-text').textContent = vars.instagram; else $('#ig-line').style.display = 'none';
  if (vars.web) $('#web-text').textContent = vars.web; else $('#web-line').style.display = 'none';
  if (vars.porcelanosa) $('#porc-text').textContent = vars.porcelanosa; else $('#porc-line').style.display = 'none';
  prepTitle();
  buildTilt();
  buildPin();
  buildBA();
  buildMat();
  CUR.sort((a, b) => a.t - b.t);
  await Promise.all($$('#root img').map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = r; i.onerror = r; }))));
  glass = createGlass($('#gl'), W, H);
  await glass.compile();
  ready = true;
  render(0);
  glass.renderer.getContext().readPixels(0, 0, 1, 1, 0x1908, 0x1401, new Uint8Array(4));
})();
window.addEventListener('hf-seek', (e) => render(e.detail.time));
window.__film = { render };
