import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('../../node_modules/sharp');
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '../assets-motion/x4');
const out = join(here, '../film/assets/img');
mkdirSync(out, { recursive: true });

// Esquinas de la pared del fondo (x, fracción del ancho) y línea suelo-pared (y, fracción del alto), medidas sobre cuadrícula.
const L = [
  { n: 'fase0_vacia', xl: 0.25, xr: 0.75, yf: 0.66 },
  { n: 'fase1_suelo', xl: 0.23, xr: 0.77, yf: 0.655 },
  { n: 'fase2_paredes_luz', xl: 0.248, xr: 0.755, yf: 0.645 },
  { n: 'fase3_muebles', xl: 0.248, xr: 0.752, yf: 0.645 },
  { n: 'fase4_final', xl: 0.247, xr: 0.753, yf: 0.648 },
];
const ref = L[4];
const align = L.map((p) => {
  const s = (ref.xr - ref.xl) / (p.xr - p.xl);
  const tx = (ref.xl + ref.xr) / 2 - (0.5 + ((p.xl + p.xr) / 2 - 0.5) * s);
  const ty = ref.yf - (0.5 + (p.yf - 0.5) * s);
  return { s: +s.toFixed(4), tx: +tx.toFixed(4), ty: +ty.toFixed(4) };
});

for (let k = 0; k < L.length; k++) {
  await sharp(join(src, `${L[k].n}.png`)).removeAlpha().resize(3840, 2160, { fit: 'fill' }).jpeg({ quality: 90, mozjpeg: true }).toFile(join(out, `room-${k}.jpg`));
}
writeFileSync(join(out, '../room-align.json'), JSON.stringify(align));
console.log(align);
