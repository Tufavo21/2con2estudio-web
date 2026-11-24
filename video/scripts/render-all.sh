#!/usr/bin/env bash
# Renderiza los másteres y las versiones para redes (sin música).
set -e
cd "$(dirname "$0")/.." && source env.sh && node scripts/make-vertical.mjs >/dev/null
mkdir -p out/master
(cd film && npx hyperframes render --quality delivery -o ../out/master/2con2-16x9-master.mp4 --quiet)
(cd film-v && npx hyperframes render --quality delivery -o ../out/master/2con2-9x16-master.mp4 --quiet)
cd out
for n in 16x9 9x16; do
  ../tools/ffmpeg.exe -v error -y -i master/2con2-$n-master.mp4 -c:v libx264 -preset slow -b:v 7500k -maxrate 9500k -bufsize 15000k -pass 1 -passlogfile p$n -pix_fmt yuv420p -an -f mp4 NUL
  ../tools/ffmpeg.exe -v error -y -i master/2con2-$n-master.mp4 -c:v libx264 -preset slow -b:v 7500k -maxrate 9500k -bufsize 15000k -pass 2 -passlogfile p$n -pix_fmt yuv420p -profile:v high -movflags +faststart -an 2con2-$n-sinmusica.mp4
done
rm -f p*.log*
ls -la *.mp4 master/*.mp4
