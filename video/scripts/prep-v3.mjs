import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('../../node_modules/sharp');
const here = dirname(fileURLToPath(import.meta.url));
const x4 = (n) => join(here, '../assets-v3/x4', `${n}.png`);
const out = (n) => join(here, '../film/assets/img/v3', n);
const jpg = (s, f) => s.jpeg({ quality: 90, mozjpeg: true }).toFile(out(f));
import { mkdirSync } from 'node:fs';
mkdirSync(join(here, '../film/assets/img/v3'), { recursive: true });

for (const [n, f] of [['habitacion_fase0', 'antes'], ['habitacion_fase4', 'despues'], ['habitacion_noche', 'noche'], ['detalle_1_olivo_cortina', 'detalle']])
  await jpg(sharp(x4(n)).removeAlpha().resize(3840, 2160, { fit: 'cover' }), `${f}.jpg`);

const card = (src, f, pos = 'attention') => jpg(sharp(src).removeAlpha().resize(900, 700, { fit: 'cover', position: pos }), `card-${f}.jpg`);
await card(x4('proyecto_cocina'), 'cocina-ia', 'centre');
const cli = (n) => join(here, '../../assets-cliente', `${n}.jpg`);
await card(cli('cocina-marmol-negra'), 'marmol');
await card(cli('bano-gres-piedra'), 'bano');
await card(cli('cocina-roble-grafito'), 'roble');

const mat = (s, f) => jpg(s.removeAlpha().resize(960, 440, { fit: 'cover' }), `mat-${f}.jpg`);
await mat(sharp(x4('material_porcelanico')), 'porcelanico');
await mat(sharp(join(here, '../raw/u-JH_R66BihvA.jpg')), 'roble');
await mat(sharp(x4('habitacion_fase4')).extract({ left: 2330, top: 2190, width: 880, height: 400 }), 'travertino');
await mat(sharp(x4('proyecto_cocina')).extract({ left: 1300, top: 900, width: 900, height: 413 }), 'laton');
console.log('ok');
