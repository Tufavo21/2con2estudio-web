import { createRequire } from 'node:module';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('../../node_modules/sharp');
const here = dirname(fileURLToPath(import.meta.url));
const web = join(here, '../..');
const out = join(here, '../film/assets');
for (const d of ['img', 'fonts', 'lib']) mkdirSync(join(out, d), { recursive: true });

const client = (n) => join(web, 'assets-cliente', `${n}.jpg`);
const raw = (id) => join(here, '../raw', `u-${id}.jpg`);
const jpg = (s, f) => s.jpeg({ quality: 88, mozjpeg: true }).toFile(join(out, 'img', f));

const cards = ['cocina-blanca-compacta', 'bano-gres-piedra', 'cocina-roble-grafito', 'cocina-obra-molduras', 'cocina-marmol-negra'];
for (const n of cards) await jpg(sharp(client(n)).resize(1000, 1500, { fit: 'cover', position: 'attention' }), `card-${n}.jpg`);

await jpg(sharp(client('cocina-marmol-negra')).resize(2400, 1600, { fit: 'cover' }), 'detail-h.jpg');
await jpg(sharp(client('cocina-marmol-negra')).resize(1300, 1700, { fit: 'cover', position: 'attention' }), 'detail-v.jpg');

const mats = { marmol: 'ZVMlab81PFY', roble: 'JH_R66BihvA', piedra: 'BUDn0s7QteI' };
for (const [k, id] of Object.entries(mats)) {
  await jpg(sharp(raw(id)).resize(3840, 2160, { fit: 'cover' }), `mat-${k}-h.jpg`);
  await jpg(sharp(raw(id)).resize(2160, 3840, { fit: 'cover' }), `mat-${k}-v.jpg`);
}

await sharp(join(web, 'assets-cliente/logo/logo-2con2estudio-negro.png')).resize(900).png().toFile(join(out, 'img/logo-negro.png'));

let s = 0x2c02;
const rnd = () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const G = 512, px = Buffer.alloc(G * G);
for (let i = 0; i < px.length; i++) px[i] = 128 + (rnd() + rnd() + rnd() - 1.5) * 90;
await sharp(px, { raw: { width: G, height: G, channels: 1 } }).png().toFile(join(out, 'img/grain.png'));

const fs = join(web, 'node_modules/@fontsource');
copyFileSync(join(fs, 'bodoni-moda/files/bodoni-moda-latin-400-normal.woff2'), join(out, 'fonts/bodoni-400.woff2'));
copyFileSync(join(fs, 'bodoni-moda/files/bodoni-moda-latin-400-italic.woff2'), join(out, 'fonts/bodoni-400i.woff2'));
for (const w of [300, 400, 500]) copyFileSync(join(fs, `jost/files/jost-latin-${w}-normal.woff2`), join(out, `fonts/jost-${w}.woff2`));

const nm = join(here, '../node_modules');
copyFileSync(join(nm, 'three/build/three.module.min.js'), join(out, 'lib/three.module.js'));
writeFileSync(join(out, 'lib/RoundedBoxGeometry.js'), readFileSync(join(nm, 'three/examples/jsm/geometries/RoundedBoxGeometry.js'), 'utf8').replace("from 'three'", "from './three.module.js'"));
copyFileSync(join(nm, 'gsap/dist/gsap.min.js'), join(out, 'lib/gsap.min.js'));
console.log('ok');
