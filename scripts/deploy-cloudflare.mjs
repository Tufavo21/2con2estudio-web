// Despliega la demo de 2con2estudio en Cloudflare: web + API (Worker) en UNA sola dirección *.workers.dev.
// Uso:  node scripts/deploy-cloudflare.mjs        (o doble clic en INICIAR-CLOUDFLARE.bat)
//       node scripts/deploy-cloudflare.mjs --dry   (solo genera worker/wrangler.cloudflare.toml, no toca Cloudflare)
// Los secretos (RESEND_API_KEY, APP_SECRET) se envían a Cloudflare con `wrangler secret put` y NUNCA se escriben
// en ningún archivo ni se muestran en pantalla.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const WORKER_NAME = '2con2estudio-demo';
const DB_NAME = '2con2estudio-leads';
const CFG = 'worker/wrangler.cloudflare.toml';
const isWin = process.platform === 'win32';

// Registro sin secretos en deploy-cloudflare.log (para poder revisar cómo fue el despliegue).
const LOG = resolve(root, 'deploy-cloudflare.log');
if (!DRY) writeFileSync(LOG, `Inicio ${new Date().toISOString()}\n`);
const note = (m) => { if (!DRY) appendFileSync(LOG, `${m}\n`); };
const say = (m) => { console.log(`\n▶ ${m}`); note(`▶ ${m}`); };
const fail = (m) => { console.error(`\n✖ ${m}`); note(`✖ ${m}`); process.exit(1); };

if (Number(process.versions.node.split('.')[0]) < 22) fail('Hace falta Node.js 22 o superior.');

function run(cmd, args, { input, capture = false, env = {} } = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root, shell: isWin, input, encoding: 'utf8',
    stdio: capture ? ['pipe', 'pipe', 'pipe'] : [input !== undefined ? 'pipe' : 'inherit', 'inherit', 'inherit'],
    env: { ...process.env, ...env },
  });
  return { code: r.status ?? 1, out: `${r.stdout || ''}${r.stderr || ''}` };
}
const npx = (args, opts) => run('npx', ['--yes', 'wrangler@latest', ...args], opts);

// ── Variables locales (worker/.dev.vars) ───────────────────────────────────────────────────────────────────
function loadVars(file) {
  const out = {};
  if (!existsSync(file)) return out;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith('#')) out[m[1]] = m[2].replace(/^"(.*)"$/, '$1');
  }
  return out;
}
const dev = loadVars(resolve(root, 'worker/.dev.vars'));
if (!dev.RESEND_API_KEY) fail('Falta RESEND_API_KEY en worker/.dev.vars.');

const q = (s) => JSON.stringify(String(s ?? ''));
function writeConfig({ dbId, baseUrl }) {
  const vars = {
    DEMO_MODE: 'true', // la demo SIEMPRE se publica en modo demo
    DEMO_ALLOWLIST: dev.DEMO_ALLOWLIST || '',
    DEMO_REDIRECT_TO: dev.DEMO_REDIRECT_TO || '',
    AI_DRAFT: 'false',
    OWNER_EMAIL: dev.OWNER_EMAIL || '',
    MAIL_FROM: dev.MAIL_FROM || '',
    BOOKING_URL: dev.BOOKING_URL || '',
    POSTAL_ADDRESS: dev.POSTAL_ADDRESS || '',
    PUBLIC_BASE_URL: baseUrl || '',
    ALLOWED_ORIGINS: '',
    RATE_LIMIT_MAX: '8',
    RATE_LIMIT_WINDOW_MIN: '60',
  };
  const toml = [
    '# GENERADO por scripts/deploy-cloudflare.mjs (no editar a mano; está en .gitignore). Sin secretos.',
    `name = ${q(WORKER_NAME)}`,
    'main = "src/index.js"',
    'compatibility_date = "2025-09-01"',
    '',
    '[triggers]',
    'crons = ["17 9 * * *"]',
    '',
    '[[d1_databases]]',
    'binding = "DB"',
    `database_name = ${q(DB_NAME)}`,
    `database_id = ${q(dbId || 'PENDIENTE')}`,
    '',
    '# La web compilada se sirve desde el mismo Worker; solo /api/* ejecuta código.',
    '[assets]',
    'directory = "../dist"',
    'run_worker_first = ["/api/*"]',
    '',
    '[vars]',
    ...Object.entries(vars).map(([k, v]) => `${k} = ${q(v)}`),
    '',
  ].join('\n');
  writeFileSync(resolve(root, CFG), toml);
}

if (DRY) {
  writeConfig({ dbId: 'DRY-RUN', baseUrl: 'https://ejemplo.workers.dev' });
  console.log(`Generado ${CFG} (modo prueba). Variables sin secretos:`);
  console.log(readFileSync(resolve(root, CFG), 'utf8'));
  process.exit(0);
}

// ── 1. Sesión en Cloudflare ────────────────────────────────────────────────────────────────────────────────
say('1/7 Comprobando tu sesión de Cloudflare…');
let who = npx(['whoami'], { capture: true });
if (!/You are logged in|associated with the email/i.test(who.out)) {
  console.log('Se abrirá el navegador para que inicies sesión en Cloudflare y pulses «Allow».');
  const login = npx(['login']);
  if (login.code !== 0) fail('No se completó el inicio de sesión en Cloudflare.');
  who = npx(['whoami'], { capture: true });
}
const whoLines = who.out.split('\n').filter((l) => /email|Account Name/i.test(l)).join('\n') || 'Sesión iniciada.';
console.log(whoLines); note(whoLines);

// ── 2. Compilar la web (misma dirección para web y API: /api/lead) ───────────────────────────────────────────
say('2/7 Compilando la web…');
if (!existsSync(resolve(root, 'node_modules'))) { if (run('npm', ['install']).code !== 0) fail('Falló npm install.'); }
const build = run('npm', ['run', 'build'], { env: { VITE_LEAD_ENDPOINT: '/api/lead' } });
if (build.code !== 0) fail('Falló la compilación de la web.');

// ── 3. Base de datos D1 ──────────────────────────────────────────────────────────────────────────────────────
say('3/7 Preparando la base de datos (D1)…');
const findDb = () => {
  const l = npx(['d1', 'list', '--json'], { capture: true });
  try { return JSON.parse(l.out.slice(l.out.indexOf('['))).find((d) => d.name === DB_NAME)?.uuid; } catch { return undefined; }
};
let dbId = findDb();
if (!dbId) {
  if (npx(['d1', 'create', DB_NAME]).code !== 0) fail('No se pudo crear la base de datos D1.');
  dbId = findDb();
}
if (!dbId) fail('No encuentro el identificador de la base de datos D1.');
writeConfig({ dbId, baseUrl: '' });
if (npx(['d1', 'execute', DB_NAME, '--file=worker/schema.sql', '--remote', '-y', '--config', CFG]).code !== 0) fail('Falló la creación de tablas en D1.');
// Bases creadas antes de vivienda/zona: añade las columnas (si ya existen, el error se ignora).
for (const col of ['property', 'zone']) npx(['d1', 'execute', DB_NAME, `--command=ALTER TABLE leads ADD COLUMN ${col} TEXT`, '--remote', '-y', '--config', CFG]);

// ── 4. Primer despliegue (para conocer la dirección pública) ─────────────────────────────────────────────────────
say('4/7 Desplegando…');
const d1 = npx(['deploy', '--config', CFG], { capture: true });
console.log(d1.out);
if (d1.code !== 0) fail('Falló el despliegue.');
const url = (d1.out.match(/https:\/\/[^\s]+\.workers\.dev/) || [])[0];
if (!url) fail('No pude leer la dirección pública del despliegue.');

// ── 5. Segundo despliegue con la dirección pública (enlace de baja de los correos) ───────────────────────────────
say('5/7 Ajustando la dirección pública…');
writeConfig({ dbId, baseUrl: url });
if (npx(['deploy', '--config', CFG], { capture: true }).code !== 0) fail('Falló el segundo despliegue.');

// ── 6. Secretos (sin mostrarlos) ──────────────────────────────────────────────────────────────────────────────
say('6/7 Guardando los secretos en Cloudflare…');
const have = npx(['secret', 'list', '--config', CFG], { capture: true }).out;
if (!/APP_SECRET/.test(have)) {
  const s = npx(['secret', 'put', 'APP_SECRET', '--config', CFG], { input: randomBytes(36).toString('base64url') + '\n', capture: true });
  if (s.code !== 0) fail('No se pudo guardar APP_SECRET.');
}
const k = npx(['secret', 'put', 'RESEND_API_KEY', '--config', CFG], { input: dev.RESEND_API_KEY + '\n', capture: true });
if (k.code !== 0) fail('No se pudo guardar RESEND_API_KEY.');

// ── 7. Comprobación ─────────────────────────────────────────────────────────────────────────────────────────
say('7/7 Comprobando…');
let ok = false;
for (let i = 0; i < 6 && !ok; i++) {
  try { const r = await fetch(`${url}/api/health`); ok = r.ok; } catch { /* aún no responde */ }
  if (!ok) await new Promise((r) => setTimeout(r, 4000));
}
note(ok ? `LISTO ${url}` : `DESPLEGADO_SIN_RESPUESTA ${url}`);
console.log(ok ? `\n✔ LISTO. Tu demo está en:\n\n   ${url}\n` : `\n⚠ Desplegado, pero /api/health aún no responde. Prueba en un minuto: ${url}\n`);
