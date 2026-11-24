import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const A = join(here, '../film/assets/audio');
const OUT = join(here, '../audio-work');
const FF = join(here, '../tools/ffmpeg.exe');
const DUR = 45;
const porcelanosa = process.argv.includes('--porcelanosa');
const e3 = process.argv.includes('--e3');
const mm = e3 || process.argv.includes('--mm');
const en = e3 ? 'e3-' : mm ? 'mm-' : process.argv.includes('--en') ? 'en-' : '';
const T = e3 ? [0.7, 5.5, 15.0, 23.0, 39.4] : mm ? [0.7, 5.5, 15.2, 23.0, 39.5] : [0.7, 5.6, 15.3, 23.2, 39.6];
const VGAIN = mm ? 1.8 : 3.2;

const voice = [
  [`${en}vo1.wav`, T[0]],
  [`${en}vo2.wav`, T[1]],
  [`${en}vo3.wav`, T[2]],
  [`${en}${porcelanosa ? 'vo4-porcelanosa' : 'vo4'}.wav`, T[3]],
  [`${en}vo5.wav`, T[4]],
];
// [archivo, segundo, ganancia]: giros del cubo, tarjetas, máscaras, expansión, fases de la habitación y cierre
const sfx = [
  ['whoosh.mp3', 3.98, 0.22], ['sparkle.mp3', 4.15, 0.16],
  ['whoosh-short.mp3', 0.95, 0.1],
  ...[4.65, 6.3, 8.0, 9.7, 11.4, 13.1].map((t) => ['click-soft.mp3', t, 0.45]),
  ['whoosh-cinematic.mp3', 15.2 - 3.55, 0.32],
  ['whoosh-short.mp3', 19.75, 0.14], ['whoosh.mp3', 20.25, 0.2], ['sparkle.mp3', 20.45, 0.14],
  ['whoosh-short.mp3', 22.35, 0.16], ['whoosh-short.mp3', 22.85, 0.08],
  ...[25.0, 28.0, 31.0, 34.0].map((t) => ['impact-bass-1.mp3', t - 0.02, 0.26]),
  ['chime.mp3', 28.05, 0.3], ['whoosh-short.mp3', 33.5, 0.16],
  ['whoosh-short.mp3', 38.85, 0.14], ['chime.mp3', 39.35, 0.22],
];

const build = (withVoice, file) => {
  const inputs = ['-i', join(A, 'music.mp3')];
  const chains = [`[0:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:45,afade=t=in:st=0:d=0.6,afade=t=out:st=41.5:d=3.5,volume=${withVoice ? 0.25 : 0.42}[mus]`];
  const sfxLabels = [];
  sfx.forEach(([f, t, g], i) => {
    inputs.push('-i', join(A, f));
    const ms = Math.round(t * 1000);
    chains.push(`[${i + 1}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=${g},adelay=${ms}|${ms}[s${i}]`);
    sfxLabels.push(`[s${i}]`);
  });
  chains.push(`${sfxLabels.join('')}amix=inputs=${sfxLabels.length}:dropout_transition=0,volume=${sfxLabels.length}[fx]`);
  let musicOut = '[mus]';
  let mix = ['[fx]'];
  if (withVoice) {
    const base = sfx.length + 1;
    const vl = [];
    voice.forEach(([f, t], i) => {
      inputs.push('-i', join(A, f));
      const ms = Math.round(t * 1000);
      chains.push(`[${base + i}:a]aformat=sample_rates=48000:channel_layouts=stereo,highpass=f=80,acompressor=threshold=0.15:ratio=2.5:attack=10:release=200,volume=${VGAIN},adelay=${ms}|${ms}[v${i}]`);
      vl.push(`[v${i}]`);
    });
    chains.push(`${vl.join('')}amix=inputs=${vl.length}:dropout_transition=0,volume=${vl.length},asplit=2[vo][key]`);
    chains.push('[mus][key]sidechaincompress=threshold=0.03:ratio=4:attack=40:release=600:makeup=1[duck]');
    musicOut = '[duck]';
    mix = ['[vo]', '[fx]'];
  }
  chains.push(`${musicOut}${mix.join('')}amix=inputs=${mix.length + 1}:dropout_transition=0,volume=${mix.length + 1},apad,atrim=0:${DUR},loudnorm=I=-14:TP=-1.5:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo,alimiter=limit=0.82:attack=2:release=60:level=false[out]`);
  execFileSync(FF, ['-v', 'error', '-y', ...inputs, '-filter_complex', chains.join(';'), '-map', '[out]', '-c:a', 'pcm_s16le', join(OUT, file)], { stdio: 'inherit' });
  console.log(file);
};

build(true, `mix-voz${e3 ? '-es2' : mm ? '-es' : en ? '-en' : ''}${porcelanosa ? '-porcelanosa' : ''}.wav`);
if (!porcelanosa && process.argv.includes('--sinvoz')) build(false, 'mix-sinvoz.wav');
