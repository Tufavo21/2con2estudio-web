import { readFileSync, writeFileSync, cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../film');
const src = readFileSync(join(dir, 'index.html'), 'utf8');
const out = src
  .replace('--W: 1920px; --H: 1080px', '--W: 1080px; --H: 1920px')
  .replace('width=1920, height=1080', 'width=1080, height=1920')
  .replace('data-width="1920" data-height="1080"', 'data-width="1080" data-height="1920"')
  .replace('<canvas id="gl" width="1920" height="1080">', '<canvas id="gl" width="1080" height="1920">')
  .replace('vídeo 16:9', 'vídeo 9:16')
  .replace('assets/img/detail-h.jpg', 'assets/img/detail-v.jpg')
  .replace('<canvas id="r3" width="1920" height="1080">', '<canvas id="r3" width="1080" height="1920">');
if (out === src) throw new Error('sin cambios');
const vdir = join(dir, '../film-v');
rmSync(join(vdir, 'assets'), { recursive: true, force: true });
mkdirSync(vdir, { recursive: true });
cpSync(join(dir, 'assets'), join(vdir, 'assets'), { recursive: true });
writeFileSync(join(vdir, 'index.html'), out);
console.log('film-v/index.html');
