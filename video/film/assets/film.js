import { createGlass } from './glass.js';

const root = document.getElementById('root');
const W = +root.dataset.width, H = +root.dataset.height, V = H > W;
const u = Math.min(W, H) / 1080;
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const vars = { porcelanosa: 'Trabajamos con Porcelanosa', telefono: '+34 620 22 21 23', instagram: '@2con2estudio', web: '' };
try { Object.assign(vars, window.__hyperframes?.getVariables?.() || {}); } catch {}

const bez = (x1, y1, x2, y2) => (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  let lo = 0, hi = 1, m = 0.5;
  for (let i = 0; i < 40; i++) {
    m = (lo + hi) / 2;
    const x = 3 * x1 * m * (1 - m) ** 2 + 3 * x2 * m * m * (1 - m) + m ** 3;
    if (x < t) lo = m; else hi = m;
  }
  return 3 * y1 * m * (1 - m) ** 2 + 3 * y2 * m * m * (1 - m) + m ** 3;
};
const eMask = bez(0.2, 0.8, 0.2, 1);
const eExpand = bez(0.76, 0, 0.18, 1);
const eIO = bez(0.65, 0, 0.35, 1);
const eOut = bez(0.16, 1, 0.3, 1);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, d) => clamp((t - a) / d);
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (x) => x * x * (3 - 2 * x);
const hash = (n) => { let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };

const TS = { shelfIn: 4.6, detail: 14.7, detailOut: 19.75, mat: 19.8, roomIn: 22.35, r1: 25.0, r2: 28.0, r3: 31.0, r4: 34.0, push: 36.0, close: 38.85 };

const L = V
  ? { mx: 120, mr: 300, Hc: 0.3 * H, shelfY: 0.36 * H, titleB: H - 1150, titleW: 660, ptSize: 36, rulerB: H - 1212, matB: H - 1205,
      cube1: [0.5 * W, 0.33 * H, 0.42], cube3: [0.5 * W, 0.555 * H, 0.6], matX: 120, matW: 760, matY: 0.3 * H, matAlign: 'left', logoW: 360, ctaSize: 46, ledeSize: 40,
      titleCy: 0.3 * H, subY: 0.565 * H, photo: [0.06 * W, 0.14 * H, 0.88 * W, 0.35 * H], text: [120, 0.488 * H, 660],
      rheadT: 300, rheadSize: 46, bandT: 330, bandB: H - 570, bandSize: 72, safe: [120, 300, 780, 1190], view: [0, 330, W, 900] }
  : { mx: 96, mr: 96, Hc: 0.54 * H, shelfY: 0.43 * H, titleB: 0.165 * H, titleW: 0.6 * W, ptSize: 60, rulerB: 0.07 * H, matB: 0.07 * H, titleCy: 0.47 * H, subY: 0.83 * H,
      cube1: [0.6 * W, 0.47 * H, 0.92], cube3: [0.75 * W, 0.5 * H, 0.95], matX: 96, matW: 0.6 * W, matY: 0.5 * H, matAlign: 'left', logoW: 320, ctaSize: 66, ledeSize: 50,
      photo: [0.445 * W, 0.1 * H, 0.505 * W, 0.8 * H], text: [0.05 * W, 0, 0.34 * W],
      rheadT: 96, rheadSize: 64, bandT: 0.74 * H, bandB: 0, bandSize: 120, safe: [60, 60, W - 60, H - 60], view: [0, 0, W, H] };
const Wc = (L.Hc * 2) / 3, T = Wc * 0.17, GAP = 10 * u, P = 1400, U = 2.2;
const scl = (au) => 1 / (1 + (au / U) ** 1.6);
const ZK = P / (P - L.Hc * 0.1);
const screenX = (au) => (Wc * ZK / 2 + GAP + (T * scl(1)) / 2) * Math.min(au, 1) + Math.max(au - 1, 0) * (T + GAP) * scl((au + 1) / 2);

const css = { '--u': u, '--mx': `${L.mx}px`, '--Hc': `${L.Hc}px`, '--Wc': `${Wc}px`, '--T': `${T}px`, '--shelf-y': `${L.shelfY}px`,
  '--floor-y': `${L.shelfY + L.Hc / 2 + 18 * u}px`, '--title-b': `${L.titleB}px`, '--title-w': `${L.titleW}px`, '--pt-size': `${L.ptSize}px`,
  '--ruler-b': `${L.rulerB}px`, '--mr': `${L.mr}px`, '--mat-b': `${L.matB}px`, '--logo-w': `${L.logoW}px`, '--cta-size': `${L.ctaSize}px`, '--lede-size': `${L.ledeSize}px`,
  '--rhead-t': `${L.rheadT}px`, '--rhead-size': `${L.rheadSize}px`, '--band-t': `${L.bandT}px`, '--band-b': `${L.bandB}px`, '--band-size': `${L.bandSize}px` };
for (const [k, v] of Object.entries(css)) root.style.setProperty(k, v);

const SEG = [[4.6, 1], [6.3, 2], [8.0, 3], [9.7, 4], [11.4, 5], [13.1, 6]];
const shelfP = (t) => {
  let p = -0.4;
  for (let i = 0; i < SEG.length && t >= SEG[i][0]; i++) {
    const [ts, tg] = SEG[i];
    const te = i + 1 < SEG.length ? Math.min(t, SEG[i + 1][0]) : t;
    p = tg + (p - tg) * Math.exp(-6 * (te - ts));
  }
  return p;
};

const rise = (el, t, tin, tout = 1e9, din = 0.65, dout = 0.45) => {
  const y = t < tout ? 130 * (1 - eMask(prog(t, tin, din))) : -130 * eIO(prog(t, tout, dout));
  el.style.transform = `translateY(${y}%)`;
};
const inset = (el, top, right, bottom, left) => {
  el.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
};
const wipe = (el, t, tin, tout = 1e9, din = 0.5, dout = 0.35) => {
  const k = t < tout ? eMask(prog(t, tin, din)) : 1 - eIO(prog(t, tout, dout));
  el.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`;
  return k;
};

const ctx2d = document.createElement('canvas');
ctx2d.width = W;
ctx2d.height = H;
const g2 = ctx2d.getContext('2d');
const fontD = (s) => `400 ${s}px "Bodoni Moda"`;
const fitSize = (text, maxW, font, spacing = 0) => {
  g2.font = font(100);
  g2.letterSpacing = `${spacing * 100}px`;
  const w = g2.measureText(text).width;
  g2.letterSpacing = '0px';
  return (100 * maxW) / w;
};
const wrap = (text, maxW, font) => {
  g2.font = font;
  const lines = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    const next = cur ? `${cur} ${w}` : w;
    if (cur && g2.measureText(next).width > maxW) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
};
const maskedText = (t, text, x, yBase, ascent, descent, tin, dur, align = 'center') => {
  const k = eMask(prog(t, tin, dur));
  if (k <= 0) return;
  const h = ascent + descent;
  g2.save();
  g2.beginPath();
  g2.rect(0, yBase - ascent - 0.06 * h, W, h * 1.12);
  g2.clip();
  g2.textAlign = align;
  g2.fillText(text, x, yBase + (1 - k) * h * 1.12);
  g2.restore();
};

let IMG = {};
let glass, title, sub, matLines, ready = false;

const drawCover = (img, scale, clipW = W) => {
  const r = Math.max(W / img.width, H / img.height) * scale;
  const w = img.width * r, h = img.height * r;
  g2.save();
  g2.beginPath();
  g2.rect(0, 0, clipW, H);
  g2.clip();
  g2.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  g2.restore();
};

const prepText = () => {
  const lines = V ? ['2CON2', 'ESTUDIO'] : ['2CON2ESTUDIO'];
  const size = Math.min(...lines.map((l) => fitSize(l, (V ? 0.9 : 0.88) * W, fontD, 0.01)));
  g2.font = fontD(size);
  const m = g2.measureText('2CON2ESTUDIO');
  const asc = m.actualBoundingBoxAscent, desc = Math.max(m.actualBoundingBoxDescent, size * 0.02);
  const lh = asc * 1.18;
  const y0 = L.titleCy - ((lines.length - 1) * lh) / 2 + asc / 2;
  title = { lines, size, asc, desc, lh, y0 };
  const subSize = 28 * u;
  const subFont = `400 ${subSize}px "Jost"`;
  g2.font = subFont;
  g2.letterSpacing = `${0.2 * subSize}px`;
  const subLines = V ? ['INTERIORISMO DE LUJO', 'Y REFORMAS A MEDIDA', 'EN VALENCIA'] : ['INTERIORISMO DE LUJO Y REFORMAS A MEDIDA EN VALENCIA'];
  sub = subLines.map((line, li) => {
    let x = W / 2 - g2.measureText(line).width / 2;
    return line.split(' ').map((w) => {
      const item = { w, x, y: L.subY + li * subSize * 1.9 };
      x += g2.measureText(w).width + g2.measureText(' ').width;
      return item;
    });
  }).flat();
  g2.letterSpacing = '0px';
  sub.font = subFont;
  sub.size = subSize;

  const mSize = (V ? 118 : 132) * u;
  const mLines = wrap(vars.porcelanosa.toUpperCase(), L.matW, fontD(mSize));
  const mFit = Math.min(mSize, ...mLines.map((l) => fitSize(l, L.matW, fontD, 0.01)));
  g2.font = fontD(mFit);
  const masc = g2.measureText('TRABAJAMOS').actualBoundingBoxAscent;
  const mlh = masc * 1.32;
  matLines = { lines: mLines, size: mFit, asc: masc, desc: mFit * 0.04, lh: mlh, y0: L.matY - ((mLines.length - 1) * mlh) / 2 + masc / 2 };
};

const drawTitleBg = (t) => {
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

const drawMatBg = (t) => {
  drawCover(IMG.matA, 1.08 - 0.06 * prog(t, TS.mat, 2.8));
  g2.fillStyle = '#15120E';
  g2.font = fontD(matLines.size);
  g2.letterSpacing = `${0.01 * matLines.size}px`;
  matLines.lines.forEach((l, i) => maskedText(t, l, L.matX, matLines.y0 + i * matLines.lh, matLines.asc, matLines.desc, TS.mat + 0.3 + i * 0.075, 0.9, L.matAlign));
  g2.letterSpacing = '0px';
};

const cubeAt = (t, [cx, cy, s], scale, disp) => {
  const w = glass.worldToPx(cx, cy);
  const turns = eIO(prog(t, 4.0, 1.0)) + eIO(prog(t, TS.mat + 0.45, 1.1));
  return { rx: -0.42 + 0.05 * Math.sin(0.55 * t), ry: 0.62 + 0.12 * t + (Math.PI / 2) * turns, rz: 0.18 + 0.03 * Math.sin(0.4 * t + 1), x: w.x, y: w.y, s: s * scale, disp };
};

const renderGL = (t) => {
  if (t < 5.4) {
    drawTitleBg(t);
    glass.setBackground(ctx2d);
    const sIn = eOut(prog(t, 0.35, 1.2)) * (1 - eIO(prog(t, 4.3, 0.6)));
    glass.render(cubeAt(t, L.cube1, sIn, 1 - 0.85 * eIO(prog(t, 0.7, 0.6))));
  } else if (t > TS.mat - 0.1 && t < TS.roomIn + 0.7) {
    drawMatBg(t);
    glass.setBackground(ctx2d);
    const sIn = eOut(prog(t, TS.mat + 0.1, 0.7)) * (1 - eIO(prog(t, TS.roomIn - 0.45, 0.5)));
    glass.render(cubeAt(t, L.cube3, sIn, 0.15));
  }
};

let cards, titlesEls, ticks;
const buildShelf = () => {
  cards = $$('.card').map((el, i) => {
    const img = el.dataset.img;
    const il = el.hasAttribute('data-ilustrativa');
    el.innerHTML = `<div class="face spine"><span class="spine__n">0${i + 1}</span><span class="spine__l">${el.dataset.title}</span><span class="spine__strip"><img src="${img}" alt=""></span><i class="sheen"></i><i class="shade"></i></div>
      <div class="face cover"><img src="${img}" alt="">${il ? '<span class="tagil">Imagen ilustrativa</span>' : ''}<i class="sheen"></i><i class="shade"></i></div>`;
    return { el, sShade: el.querySelector('.spine .shade'), cShade: el.querySelector('.cover .shade'), sSheen: el.querySelector('.spine .sheen'), cSheen: el.querySelector('.cover .sheen') };
  });
  const box = $('#titles');
  titlesEls = SEG.map(([ts, ci], k) => {
    const c = $(`#card-${ci}`);
    const il = c.hasAttribute('data-ilustrativa');
    const d = document.createElement('div');
    d.className = 'ptitle';
    d.setAttribute('data-layout-allow-overflow', '');
    d.innerHTML = `<div class="m"><span class="mi lbl">0${k + 1} / 0${SEG.length}${il ? ' · Imagen ilustrativa' : ''}</span></div><div class="m"><span class="mi">${c.dataset.title}</span></div>`;
    box.appendChild(d);
    return { mis: [...d.querySelectorAll('.mi')], tin: ts + 0.25, tout: k + 1 < SEG.length ? SEG[k + 1][0] + 0.05 : 1e9 };
  });
  const ruler = $('#ruler');
  ticks = SEG.map((_, i) => {
    const tick = document.createElement('i');
    tick.className = 'tick';
    tick.style.left = `${(i / (SEG.length - 1)) * 100}%`;
    ruler.append(tick);
    return tick;
  });
};

const renderShelf = (t) => {
  const layer = $('#shelf');
  if (t < TS.shelfIn || t >= TS.detail + 1.2) { inset(layer, 0, 0, H, 0); return; }
  inset(layer, t < 5.4 ? H * (1 - eIO(prog(t, TS.shelfIn, 0.75))) : 0, 0, 0, 0);

  const p = shelfP(t);
  const vel = (p - shelfP(t - 0.1)) / 0.1;
  const settle = 1 - eIO(prog(t, 13.4, 1.0));
  const tilt = (7 * (1 - eOut(prog(t, TS.shelfIn, 1.6))) + 1.6 * Math.sin(0.9 * t)) * settle;
  const camZ = (-160 * (1 - eOut(prog(t, TS.shelfIn, 1.4))) + 40 * Math.sin(1.1 * t)) * settle;
  const yaw = clamp(-vel * 3.2, -9, 9);
  $('#rig').style.transform = `translateZ(${camZ}px) rotateX(${tilt}deg) rotateY(${yaw}deg)`;

  let oMax = 0;
  cards.forEach((c, i) => {
    const uu = i - p, au = Math.abs(uu), sg = Math.sign(uu);
    const sc = scl(au);
    const o = smooth(1 - clamp(au / 0.6));
    oMax = Math.max(oMax, o);
    const ry = -sg * Math.min(1, au / U) * 26 * (1 - o) - 90 * o;
    const a = (ry * Math.PI) / 180;
    const offX = lerp((Wc / 2) * Math.sin(a), (T / 2) * Math.cos(a), o);
    const offZ = lerp((Wc / 2) * Math.cos(a), -(T / 2) * Math.sin(a), o);
    const za = P * (1 - 1 / sc) + o * L.Hc * 0.1;
    const xa = (sg * screenX(au) * (P - za)) / P;
    const y = (1 - sc) * L.Hc * 0.16;
    c.el.style.transform = `translate3d(${xa - offX}px, ${y}px, ${za - offZ}px) rotateY(${ry}deg)`;
    c.sShade.style.opacity = Math.min(0.6, o * 0.55 + (1 - sc) * 0.32);
    c.cShade.style.opacity = Math.min(0.6, (1 - sc) * 0.32 + (1 - o) * 0.3);
    c.sSheen.style.backgroundPosition = `${lerp(115, -15, o)}% 0`;
    c.cSheen.style.backgroundPosition = `${lerp(115, -15, smooth(clamp((o - 0.55) / 0.45)))}% 0`;
  });
  $('#floor').style.transform = `scale(${lerp(0.35, 1, oMax)}, ${lerp(0.6, 1, oMax)})`;
  $('#halftone').style.transform = `translate(${-(t - TS.shelfIn) * 90 * u - 0.1 * W}px, -50%)`;
  $('#halftone2').style.transform = `translate(${(t - TS.shelfIn) * 60 * u - 1.4 * W}px, -50%)`;

  titlesEls.forEach((tt) => tt.mis.forEach((mi, j) => rise(mi, t, tt.tin + j * 0.075, tt.tout)));
  $('#ruler__line').style.transform = `scaleX(${eMask(prog(t, 5.0, 0.9))})`;
  const rw = $('#ruler').clientWidth;
  $('#ruler__mark').style.transform = `translateX(${(clamp(p - 1, 0, SEG.length - 1) / (SEG.length - 1)) * rw}px) rotate(45deg) scale(${eOut(prog(t, 5.4, 0.5))})`;
  ticks.forEach((tk, i) => { tk.style.transform = `scaleY(${eOut(prog(t, 5.1 + i * 0.06, 0.4))})`; });
};

const renderMatLabels = (t) => rise($('#mat-a .mi'), t, TS.mat + 0.35, TS.roomIn - 0.15);

let blots, dimg, ledeEls;
const buildDetail = () => {
  const [px, py, pw, ph] = L.photo;
  const svg = $('#dphoto');
  Object.assign(svg.style, { left: `${px}px`, top: `${py}px`, width: `${pw}px`, height: `${ph}px` });
  svg.setAttribute('viewBox', `0 0 ${pw} ${ph}`);
  dimg = $('#dimg');
  dimg.setAttribute('href', `assets/img/detail-${V ? 'v' : 'h'}.jpg`);
  dimg.setAttribute('width', pw);
  dimg.setAttribute('height', ph);
  $('#ink feDisplacementMap').setAttribute('scale', 90 * u);
  const g = $('#blots');
  const R = Math.hypot(pw, ph);
  const specs = [];
  for (let i = 0; i < 8; i++) specs.push({ x: (0.12 + 0.76 * hash(i * 3 + 1)) * pw, y: (0.12 + 0.76 * hash(i * 3 + 2)) * ph, r: (0.22 + 0.2 * hash(i * 3 + 3)) * R, d: i * 0.13 });
  specs.push({ x: pw / 2, y: ph / 2, r: R * 0.75, d: 0.95 });
  blots = specs.map((s) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', s.x);
    c.setAttribute('cy', s.y);
    c.setAttribute('fill', '#fff');
    c.setAttribute('r', 0);
    g.appendChild(c);
    return { c, ...s };
  });
  const [tx, ty, tw] = L.text;
  const box = $('#dtext');
  const lines = wrap('Proyectos pensados al detalle, de principio a fin.', tw, `italic 400 ${L.ledeSize * u}px "Bodoni Moda"`);
  $('#lede').innerHTML = lines.map((l) => `<div class="m"><span class="mi">${l}</span></div>`).join('');
  Object.assign(box.style, { left: `${tx}px`, width: `${tw}px` });
  box.style.top = V ? `${ty}px` : `${(H - box.offsetHeight) / 2}px`;
  ledeEls = [...box.querySelectorAll('.mi')];
};

const renderDetail = (t) => {
  const layer = $('#detail');
  if (t < TS.detail || t > TS.detailOut + 0.7) { inset(layer, H / 2, W / 2, H / 2, W / 2); return; }
  const k = eExpand(prog(t, TS.detail, 1.05));
  const cw = Wc * ZK, ch = L.Hc * ZK, cx = W / 2, cy = L.shelfY;
  const top = lerp(cy - ch / 2, 0, k), bottom = lerp(H - (cy + ch / 2), 0, k), left = lerp(cx - cw / 2, 0, k), right = lerp(W - (cx + cw / 2), 0, k);
  inset(layer, top, right, Math.max(bottom, H * eIO(prog(t, TS.detailOut, 0.6))), left);
  blots.forEach((b) => b.c.setAttribute('r', b.r * eOut(prog(t, TS.detail + 0.5 + b.d, 1.5))));
  const [, , pw, ph] = L.photo;
  const s = 1.04 - 0.04 * prog(t, TS.detail + 0.45, 4.6);
  dimg.setAttribute('transform', `translate(${(pw * (1 - s)) / 2} ${(ph * (1 - s)) / 2}) scale(${s})`);
  ledeEls.forEach((mi, i) => rise(mi, t, TS.detail + 0.8 + i * 0.075));
};

const ALIGN = [{"s":1.012,"tx":0,"ty":-0.0139},{"s":0.937,"tx":0,"ty":0.0028},{"s":0.998,"tx":-0.0015,"ty":0.0033},{"s":1.004,"tx":0,"ty":0.0024},{"s":1,"tx":0,"ty":0}];
let rImgs, disp, mosaic, pathsEls, tagsEls;
const ANN = V
  ? {
      paths: [
        { pts: [[0.247, 0.19], [0.753, 0.19], [0.753, 0.648], [0.247, 0.648]], close: true, t0: 23.1, d: 0.9, out: 24.7 },
        { pts: [[0.247, 0.648], [-0.05, 0.86]], t0: 23.4, d: 0.6, out: 24.7 },
        { pts: [[0.753, 0.648], [1.05, 0.84]], t0: 23.4, d: 0.6, out: 24.7 },
        { pts: [[0.385, 0.19], [0.385, 0.648]], t0: 23.6, d: 0.6, out: 24.7, ticks: true },
        { pts: [[0.36, 0.8], [0.64, 0.8]], t0: 25.5, d: 0.6, out: 27.6 },
        { pts: [[0.5, 0.648], [0.5, 1.02]], t0: 25.6, d: 0.6, out: 27.6 },
        { pts: [[0.3, 0.175], [0.7, 0.175]], t0: 29.1, d: 0.6, out: 30.6 },
        { pts: [[0.36, 0.55], [0.64, 0.55], [0.64, 0.71], [0.36, 0.71]], close: true, t0: 31.7, d: 0.8, out: 33.4 },
      ],
      tags: [
        { html: '2,70 m', a: [0.385, 0.42], dx: 18, dy: -20, t0: 24.0, out: 24.7, c: true },
        { html: '<b>01</b> Suelo', a: [0.42, 0.8], dx: 0, dy: -70, t0: 25.7, out: 27.6 },
        { html: 'Roble en espiga', a: [0.42, 0.8], dx: 0, dy: -10, t0: 25.85, out: 27.6, c: true },
        { html: '<b>02</b> Paredes', a: [0.4, 0.3], dx: 0, dy: 0, t0: 28.6, out: 30.6 },
        { html: '<b>03</b> Iluminación', a: [0.42, 0.175], dx: 0, dy: 30, t0: 29.3, out: 30.6 },
        { html: '<b>04</b> Mobiliario', a: [0.4, 0.55], dx: 0, dy: -70, t0: 31.9, out: 33.4 },
      ],
    }
  : {
      paths: [
        { pts: [[0.247, 0.19], [0.753, 0.19], [0.753, 0.648], [0.247, 0.648]], close: true, t0: 23.1, d: 0.9, out: 24.7 },
        { pts: [[0.247, 0.648], [-0.05, 0.86]], t0: 23.4, d: 0.6, out: 24.7 },
        { pts: [[0.753, 0.648], [1.05, 0.84]], t0: 23.4, d: 0.6, out: 24.7 },
        { pts: [[0.247, 0.19], [-0.05, -0.05]], t0: 23.45, d: 0.6, out: 24.7 },
        { pts: [[0.753, 0.19], [1.05, -0.05]], t0: 23.45, d: 0.6, out: 24.7 },
        { pts: [[0.247, 0.71], [0.753, 0.71]], t0: 23.6, d: 0.7, out: 24.7, ticks: true },
        { pts: [[0.2, 0.19], [0.2, 0.648]], t0: 23.7, d: 0.6, out: 24.7, ticks: true },
        { pts: [[0.1, 0.8], [0.9, 0.8]], t0: 25.5, d: 0.7, out: 27.6 },
        { pts: [[0.5, 0.648], [0.5, 1.02]], t0: 25.6, d: 0.6, out: 27.6 },
        { pts: [[0.247, 0.648], [0.08, 1.02]], t0: 25.65, d: 0.6, out: 27.6 },
        { pts: [[0.753, 0.648], [0.92, 1.02]], t0: 25.65, d: 0.6, out: 27.6 },
        { pts: [[0.035, 0.27], [0.19, 0.3], [0.19, 0.56], [0.035, 0.6]], close: true, t0: 28.6, d: 0.8, out: 30.6 },
        { pts: [[0.21, 0.175], [0.79, 0.175]], t0: 29.1, d: 0.6, out: 30.6, ticks: true },
        { pts: [[0.315, 0.55], [0.685, 0.55], [0.685, 0.71], [0.315, 0.71]], close: true, t0: 31.7, d: 0.8, out: 33.4 },
      ],
      tags: [
        { html: '5,40 m', a: [0.5, 0.71], dx: 0, dy: 14, t0: 24.0, out: 24.7, c: true, center: true },
        { html: '2,70 m', a: [0.2, 0.42], dx: 16, dy: -18, t0: 24.1, out: 24.7, c: true },
        { html: '<b>01</b> Suelo', a: [0.3, 0.84], dx: 0, dy: 0, t0: 25.7, out: 27.6 },
        { html: 'Roble en espiga', a: [0.3, 0.84], dx: 0, dy: 58, t0: 25.85, out: 27.6, c: true },
        { html: '<b>02</b> Paredes', a: [0.11, 0.42], dx: 0, dy: 0, t0: 28.8, out: 30.6 },
        { html: 'Molduras y porcelánico', a: [0.11, 0.42], dx: 0, dy: 58, t0: 28.95, out: 30.6, c: true },
        { html: '<b>03</b> Iluminación', a: [0.5, 0.175], dx: 0, dy: 26, t0: 29.3, out: 30.6, center: true },
        { html: '<b>04</b> Mobiliario', a: [0.315, 0.55], dx: 0, dy: -64, t0: 31.9, out: 33.4 },
      ],
    };

const camAt = (t) => {
  const Z = 1.1 + 0.04 * prog(t, TS.roomIn, TS.push - TS.roomIn) + 0.09 * eIO(prog(t, TS.push, 3.0));
  return { Z, px: VW * 0.01 * Math.sin(0.33 * (t - TS.roomIn)), py: -VH * 0.006 * Math.sin(0.27 * (t - TS.roomIn) + 0.6) };
};
const [VX, VY, VW, VH] = L.view;
const toS = (cam, a, b) => [VX + VW / 2 + cam.px + cam.Z * (a - 0.5) * disp.w, VY + VH / 2 + cam.py + cam.Z * (b - 0.5) * disp.h];

const buildRoom = () => {
  Object.assign($('#rview').style, { left: `${VX}px`, top: `${VY}px`, width: `${VW}px`, height: `${VH}px` });
  const rs = Math.max(VW / 3840, VH / 2160);
  disp = { w: 3840 * rs, h: 2160 * rs };
  rImgs = [0, 1, 2, 4].map((k) => {
    const img = $(`#r${k} img`);
    Object.assign(img.style, { width: `${disp.w}px`, height: `${disp.h}px`, left: `${(VW - disp.w) / 2}px`, top: `${(VH - disp.h) / 2}px` });
    return { k, img, wrap: $(`#r${k}`) };
  });
  const cv = $('#r3');
  cv.width = VW;
  cv.height = VH;
  const full = document.createElement('canvas'), pix = document.createElement('canvas'), small = document.createElement('canvas');
  full.width = pix.width = VW;
  full.height = pix.height = VH;
  small.width = 64;
  small.height = 36;
  small.getContext('2d').drawImage(IMG.room3, 0, 0, 64, 36);
  const cols = V ? 12 : 16, rows = V ? 10 : 9;
  const order = [...Array(cols * rows).keys()].map((i) => ({ i, r: hash(i * 7 + 3) })).sort((a, b) => a.r - b.r).map((o, rank) => ({ i: o.i, rank }));
  mosaic = { cv, ctx: cv.getContext('2d'), full, pix, small, cols, rows, order };

  const svg = $('#plan');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.style.clipPath = `inset(${VY}px ${W - VX - VW}px ${H - VY - VH}px ${VX}px)`;
  pathsEls = ANN.paths.map((p) => {
    const under = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    under.setAttribute('class', 'ln-u');
    line.setAttribute('class', 'ln');
    svg.append(under, line);
    return { ...p, under, line };
  });
  const box = $('#tags');
  tagsEls = ANN.tags.map((tg) => {
    const d = document.createElement('div');
    d.className = 'tag';
    if (tg.c) d.style.cssText = `font-size:${18 * u}px;padding:${8 * u}px ${12 * u}px;background:rgba(21,18,14,0.78)`;
    d.innerHTML = tg.html;
    box.appendChild(d);
    return { ...tg, el: d };
  });
};

const placeImg = (cam, k, el) => {
  const a = ALIGN[k];
  el.style.transform = `translate(${cam.px}px, ${cam.py}px) scale(${cam.Z}) translate(${a.tx * disp.w}px, ${a.ty * disp.h}px) scale(${a.s})`;
};

const drawMosaic = (t, cam) => {
  const { cv, ctx, full, pix, small, cols, rows, order } = mosaic;
  ctx.clearRect(0, 0, VW, VH);
  const t0 = TS.r3, span = 0.6, hold = 0.12;
  if (t < t0) return;
  const a = ALIGN[3];
  const paint = (c, src, smoothOn) => {
    const g = c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, VW, VH);
    g.imageSmoothingEnabled = smoothOn;
    g.translate(VW / 2 + cam.px, VH / 2 + cam.py);
    g.scale(cam.Z, cam.Z);
    g.translate(a.tx * disp.w, a.ty * disp.h);
    g.scale(a.s, a.s);
    g.drawImage(src, -disp.w / 2, -disp.h / 2, disp.w, disp.h);
  };
  paint(full, IMG.room3, true);
  if (t >= t0 + span + hold) { ctx.drawImage(full, 0, 0); return; }
  paint(pix, small, false);
  const tw = VW / cols, th = VH / rows, n = order.length;
  for (const o of order) {
    const st = t0 + (span * o.rank) / n;
    if (t < st) continue;
    const x = (o.i % cols) * tw, y = Math.floor(o.i / cols) * th;
    ctx.drawImage(t < st + hold ? pix : full, x, y, tw, th, x, y, tw, th);
  }
};

const placeTags = (cam) => {
  const [sx0, sy0, sx1, sy1] = L.safe;
  tagsEls.forEach((tg) => {
    const [x, y] = toS(cam, ...tg.a);
    const w = tg.el.offsetWidth, h = tg.el.offsetHeight;
    const left = clamp(x + tg.dx * u - (tg.center ? w / 2 : 0), sx0, sx1 - w);
    const top = clamp(y + tg.dy * u, sy0, sy1 - h);
    tg.el.style.left = `${left}px`;
    tg.el.style.top = `${top}px`;
  });
};

const renderRoom = (t) => {
  const layer = $('#room');
  if (t < TS.roomIn) { inset(layer, H, 0, 0, 0); placeTags(camAt(TS.roomIn)); return; }
  if (t > TS.close + 0.8) { inset(layer, H, 0, 0, 0); return; }
  inset(layer, H * (1 - eIO(prog(t, TS.roomIn, 0.65))), 0, 0, 0);
  const cam = camAt(t);
  rImgs.forEach(({ k, img }) => placeImg(cam, k, img));

  const k1 = eIO(prog(t, TS.r1, 0.9));
  inset($('#r1'), VH * (1 - k1), 0, 0, 0);
  $('#edge').style.transform = `translateY(${VH * (1 - k1) - 1}px) scaleX(${k1 > 0 && k1 < 1 ? 1 : 0})`;

  const k2 = eIO(prog(t, TS.r2, 1.0));
  inset($('#r2'), 0, VW * (1 - k2), 0, 0);
  $('#lightline').style.transform = `translateX(${VW * k2}px) scaleY(${k2 > 0 && k2 < 1 ? 1 : 0})`;

  drawMosaic(t, cam);

  const shut = eIO(prog(t, TS.r4 - 0.5, 0.45)) * (1 - eIO(prog(t, TS.r4 + 0.05, 0.7)));
  $('#curL').style.transform = `translateX(${-(1 - shut) * 101}%)`;
  $('#curR').style.transform = `translateX(${(1 - shut) * 101}%)`;
  if (t < TS.r4) inset($('#r4'), 0, VW, 0, 0); else inset($('#r4'), 0, 0, 0, 0);

  pathsEls.forEach((p) => {
    const f = Math.min(eIO(prog(t, p.t0, p.d)), 1 - eIO(prog(t, p.out, 0.4)));
    let pts = p.pts.map(([a, b]) => toS(cam, a, b));
    if (p.close) pts = [...pts, pts[0]];
    let d = `M${pts.map((q) => q.join(' ')).join(' L')}`;
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (p.ticks) {
      const [x0, y0] = pts[0], [x1, y1] = pts[pts.length - 1];
      const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny) || 1, s = (12 * u) / nl;
      d += ` M${x0 + nx * s} ${y0 + ny * s} L${x0 - nx * s} ${y0 - ny * s} M${x1 + nx * s} ${y1 + ny * s} L${x1 - nx * s} ${y1 - ny * s}`;
      len += 48 * u;
    }
    for (const el of [p.under, p.line]) {
      el.setAttribute('d', d);
      el.style.strokeDasharray = `${len} ${len}`;
      el.style.strokeDashoffset = `${len * (1 - Math.max(0, f))}`;
    }
  });
  placeTags(cam);
  tagsEls.forEach((tg) => wipe(tg.el, t, tg.t0, tg.out));

  const head = $('#rhead');
  wipe(head, t, TS.roomIn + 0.45, TS.r1 - 0.3, 0.6, 0.4);
  $$('#rhead .mi').forEach((mi, i) => rise(mi, t, TS.roomIn + 0.7 + i * 0.075, TS.r1 - 0.35));
  const kb = eMask(prog(t, TS.push + 0.4, 0.8));
  $('#band').style.clipPath = `inset(${(1 - kb) * 100}% 0 0 0)`;
  $$('#band .mi').forEach((mi, i) => rise(mi, t, TS.push + 0.75 + i * 0.075));
  rise($('#rnote .mi'), t, TS.roomIn + 0.9, TS.close - 0.2);
};

const renderClose = (t) => {
  const layer = $('#close');
  const t0 = TS.close;
  if (t < t0) { inset(layer, H, 0, 0, 0); return; }
  inset(layer, H * (1 - eIO(prog(t, t0, 0.65))), 0, 0, 0);
  const k = eMask(prog(t, t0 + 0.5, 0.95));
  $('#logo').style.transform = `translateY(${(1 - k) * 100}%) scale(${lerp(1.08, 1, k)})`;
  rise($('#cta .mi'), t, t0 + 0.9);
  $('#rule').style.transform = `scaleX(${eMask(prog(t, t0 + 1.05, 0.7))})`;
  rise($('#contact-line'), t, t0 + 1.15);
  if (V) rise($('#ig-text'), t, t0 + 1.225);
  if (vars.web) rise($('#web-text'), t, t0 + 1.3);
};

const renderGrain = (t) => {
  const f = Math.round(t * 30);
  $('#grain').style.transform = `translate(${-Math.floor(hash(f) * 64)}px, ${-Math.floor(hash(f + 999) * 64)}px)`;
};

const render = (t) => {
  if (!ready) return;
  renderGL(t);
  renderMatLabels(t);
  renderShelf(t);
  renderDetail(t);
  renderRoom(t);
  renderClose(t);
  renderGrain(t);
};

const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => i.decode().then(() => res(i), () => res(i)); i.onerror = rej; i.src = src; });

window.__hf = window.__hf || {};
window.__hf.buildReady = window.__hf.buildReady || {};
window.__hf.buildReady.film = (async () => {
  await Promise.all(['400 50px "Bodoni Moda"', 'italic 400 50px "Bodoni Moda"', '300 50px "Jost"', '400 50px "Jost"', '500 50px "Jost"'].map((f) => document.fonts.load(f)));
  await document.fonts.ready;
  const fmt = V ? 'v' : 'h';
  [IMG.matA, IMG.room3] = await Promise.all([loadImg(`assets/img/mat-marmol-${fmt}.jpg`), loadImg('assets/img/room-3.jpg'), loadImg(`assets/img/detail-${fmt}.jpg`)]);
  $('#contact-line').textContent = V ? vars.telefono : `${vars.telefono}  ·  ${vars.instagram}`;
  if (V) $('#ig-text').textContent = vars.instagram; else $('#ig-line').style.display = 'none';
  root.dataset.fmt = fmt;
  if (vars.web) $('#web-text').textContent = vars.web; else $('#web-line').style.display = 'none';
  prepText();
  buildShelf();
  buildDetail();
  buildRoom();
  await Promise.all($$('#root img').map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = r; i.onerror = r; }))));
  glass = createGlass($('#gl'), W, H);
  await glass.compile();
  ready = true;
  render(0);
  glass.renderer.getContext().readPixels(0, 0, 1, 1, 0x1908, 0x1401, new Uint8Array(4));
})();
window.addEventListener('hf-seek', (e) => render(e.detail.time));
window.__film = { render };
