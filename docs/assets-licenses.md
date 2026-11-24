# Imágenes del vídeo promocional (video/film)

Ninguna foto de banco muestra un proyecto del estudio, y todas salen rotuladas en el vídeo como «imagen ilustrativa». No se usa el logo de Porcelanosa ni fotos de sus productos.

## Fotos del estudio (aportadas por el cliente)

| Archivo en el vídeo | Original | Resolución original | Uso | Licencia |
|---|---|---|---|---|
| `card-cocina-marmol-negra.jpg`, `detail-h.jpg`, `detail-v.jpg` | `assets-cliente/cocina-marmol-negra.jpg` | 3444 × 2528 | Estantería (Entrega) y detalle a pantalla completa | Propia del estudio, pendiente de confirmar por escrito |
| `card-bano-gres-piedra.jpg` | `assets-cliente/bano-gres-piedra.jpg` | 1992 × 3244 | Estantería (Proyecto) | Propia del estudio, pendiente de confirmar |
| `card-cocina-roble-grafito.jpg` | `assets-cliente/cocina-roble-grafito.jpg` | 2048 × 1532 | Estantería (Diseño) | Propia del estudio, pendiente de confirmar |
| `card-cocina-obra-molduras.jpg` | `assets-cliente/cocina-obra-molduras.jpg` | 2192 × 3104 | Estantería (Obra) | Propia del estudio, pendiente de confirmar |
| `card-cocina-blanca-compacta.jpg` | `assets-cliente/cocina-blanca-compacta.jpg` | 1340 × 2388 | Estantería, solo en lateral (no se amplía) | Propia del estudio, pendiente de confirmar |
| `logo-negro.png` | `assets-cliente/logo/logo-2con2estudio-negro.png` | 1578 × 1452 | Cierre | Del estudio |

Según `CREDITS.md`, estas fotos son ampliaciones de capturas de baja resolución. Ninguna llega a 4K: si existen los originales en alta, conviene sustituirlas.

## Fotos de banco (materiales, «imagen ilustrativa»)

Descargadas de Unsplash el 20-11-2026 a resolución original (6000 px) y con el filtro «gratis», que excluye Unsplash+. Se guardan en `video/raw/`, que no se publica.

| Archivo en el vídeo | Muestra | Autor/a | Foto original | Resolución | Licencia |
|---|---|---|---|---|---|
| `mat-marmol-h.jpg`, `mat-marmol-v.jpg` | Mármol blanco veteado | Akbar Nemati (@akbarnemati) | https://unsplash.com/photos/ZVMlab81PFY | 6000 × 4000 | [Licencia Unsplash](https://unsplash.com/license) |
| `mat-roble-h.jpg`, `mat-roble-v.jpg` | Tablones de roble claro | Simon Berger (@simon_berger) | https://unsplash.com/photos/JH_R66BihvA | 6000 × 4421 | Licencia Unsplash |
| `mat-piedra-h.jpg`, `mat-piedra-v.jpg` | Piedra gris efecto porcelánico (reserva; ahora no sale) | @thecreativv | https://unsplash.com/photos/BUDn0s7QteI | 6000 × 4002 | Licencia Unsplash |

La licencia Unsplash permite el uso comercial gratis y sin pedir permiso, y no exige atribución. No permite vender la foto sin modificarla. Antes de publicar, revisa cada ficha: autoría, que no sea Unsplash+ y que no aparezcan marcas.

**Descartadas** (de `assets-demo/`): `proj-cocina-roble`, porque su autor es un estudio de interiorismo; `casa-bano`, porque su autor es una constructora; y `proj-obra-antes` / `proj-obra-despues`, porque están generadas con IA y por debajo de 4K.

## Tipografías y código
- Bodoni Moda y Jost: SIL Open Font License, copiadas de `@fontsource`.
- Three.js (MIT), con `RoundedBoxGeometry` de sus ejemplos (MIT).
- GSAP 3.13: licencia estándar de GSAP, gratuita incluso para uso comercial.

## Versión 2 (45 s) · imágenes de Canva, **ilustrativas del sector, no proyectos del estudio**

Creadas con Canva desde la cuenta de Gonzalo. Canva las marca como **generadas con IA** (`aiGenerated: true`). Se descargaron el 20-11-2026 en su archivo original (PNG sin pérdida) y los originales están en `video/assets-motion/imagenes/`. En el vídeo llevan el rótulo «Imagen ilustrativa».

| Archivo en el vídeo | Original | Resolución original | Tratamiento |
|---|---|---|---|
| `room-0.jpg` | habitacion/fase0_vacia | 1680 × 944 | Real-ESRGAN x4plus ×4 → 6720 × 3776, reducido a 3840 × 2160 |
| `room-1.jpg` | habitacion/fase1_suelo | 1680 × 944 | Ídem |
| `room-2.jpg` | habitacion/fase2_paredes_luz | 1680 × 944 | Ídem |
| `room-3.jpg` | habitacion/fase3_muebles | 1680 × 944 | Ídem |
| `room-4.jpg` | habitacion/fase4_final | 2720 × 1536 | Lanczos a 3840 × 2160 con enfoque suave. La salida de Real-ESRGAN salió con defectos y se descartó |
| `card-canva-cocina.jpg` | proyectos/cocina | 1664 × 2496 | Recorte a 1000 × 1500 |
| `card-canva-bano.jpg` | proyectos/bano | 1664 × 2496 | Recorte a 1000 × 1500 |

- **Escalador**: Real-ESRGAN ncnn-vulkan v0.2.5.0 (licencia BSD-3), modelo `realesrgan-x4plus`, descargado de GitHub (xinntao/Real-ESRGAN) a `video/tools/realesrgan/`.
- **Alineación**: la cámara de cada fase es parecida pero no idéntica. Se toman como referencia las esquinas de la pared del fondo y la línea del suelo, medidas sobre cuadrícula (`video/scripts/align-room.mjs`), y la escala y el desplazamiento se aplican fotograma a fotograma en la composición. La fase 1 necesita escala 0,937.
- **Cotas** del plano técnico (5,40 m y 2,70 m): son ilustrativas, no corresponden a ningún proyecto real.
- Antes de publicar, conviene revisar las condiciones de uso comercial de las imágenes generadas con IA en Canva para tu plan.

## Audio (versión 2)

| Elemento | Fuente | Licencia |
|---|---|---|
| Música: «Atmospheric Piano», de JonasBlakewood | https://pixabay.com/music/modern-classical-atmospheric-piano-626966/ | [Licencia de contenido de Pixabay](https://pixabay.com/service/license-summary/): uso comercial sin atribución. **No está registrada en Content ID**, y se eligió por eso, para evitar reclamaciones en Instagram o YouTube. Descargada el 20-11-2026 |
| Efectos: whoosh, whoosh-short, whoosh-cinematic, sparkle, impact-bass-1, chime, click-soft | Banco incluido en la skill `/media-use` de HyperFrames, procedente de Pixabay | Licencia de contenido de Pixabay |
| Voz en off | Generada en local con Kokoro-82M (`kokoro-onnx`) en **inglés**, voz `af_heart`, velocidad 0,92, mediante `npx hyperframes tts`. La versión en español (`ef_dora`) se descartó por sonar robótica; está en `video/out/descartados/` | Kokoro-82M: Apache 2.0, uso comercial permitido |

- Python portátil 3.12.8 (python.org) en `video/tools/python/`, solo para Kokoro. No se instaló nada en el sistema.
- Mezcla (`video/scripts/mix-audio.mjs`): música a −22 LUFS que baja automáticamente cuando suena la voz (*ducking*), voz unos 8 dB por encima y efectos en torno a −18 dB. Final normalizado a unos −13 LUFS, con picos a −1,5 dBTP.
- La frase «with Porcelanosa» solo está en los archivos `*-voz-en-porcelanosa.mp4`, pendientes de confirmar.
- Voz realista en español: HeyGen («Rocío – Calm & Trustworthy») requiere HyperFrames Pro (de pago) y no se usó. Las voces neuronales de Microsoft Edge no se usaron porque sus condiciones no permiten el uso comercial.
- Traducción de la voz al inglés (sin aprobar por el cliente): «Every great space begins with an idea» · «Luxury interior design and bespoke renovations, in Valencia» · «Projects designed down to the last detail, from start to finish» · «From an empty room to the home you imagined. Design, build and first-class materials» · «Tell us about your project».

### Voz definitiva (21-11-2026): MiniMax, aportada por el cliente
- Generada por el cliente en MiniMax a través de ai33 pro: voz `Spanish_CaptivatingStoryteller`, emotion neutral, speed 0,95 («toma A, serena»). Se usa `master (1).mp3`, la misma toma que `TOMA_A_serena.zip/master.mp3`. La otra toma (`master.mp3`) se descartó porque su última frase dura 5,2 s y no cabe en el cierre. La versión con Porcelanosa sale de `porcelanosa_vo_serene_44k.mp3`.
- Originales en `video/assets-motion/voz-minimax/`; cortes por frase en `video/film/assets/audio/mm-vo*.wav`.
- **Licencia: pendiente de confirmar.** Comprueba que tu plan de ai33 pro / MiniMax permite el uso comercial del audio generado.
- Las versiones con voz en inglés (Kokoro) y con voz robótica en español quedan en `video/out/descartados/`.

## Versión 3 (58 s) · imágenes v2 del cliente (generadas con IA, ilustrativas, no son proyectos del estudio)
| Archivo en el vídeo | Original (motion-2con2estudio-v2.zip) | Resolución original | Tratamiento |
|---|---|---|---|
| `v3/antes.jpg` | habitacion_fase0.jpg | 1376 × 768 | Real-ESRGAN x4plus ×4 → 3840 × 2160 |
| `v3/despues.jpg` | habitacion_fase4.jpg | 1376 × 768 | Ídem |
| `v3/noche.jpg` | habitacion_noche.jpg | 1376 × 768 | Ídem (mismo encuadre que el día, no hizo falta alinear) |
| `v3/detalle.jpg` | detalle_1_olivo_cortina.png | 1672 × 941 | Ídem |
| `v3/card-cocina-ia.jpg` | proyecto_cocina.jpg | 848 × 1264 | ×4, recorte a 900 × 700 |
| `v3/mat-porcelanico.jpg` | material_porcelanico.jpg | 1264 × 848 | ×4, recorte a 960 × 440 |
| `v3/mat-travertino.jpg` | **Provisional:** recorte de la mesa de habitacion_fase4 | — | Hasta que llegue material_travertino |
| `v3/mat-laton.jpg` | **Provisional:** recorte de la lámpara de proyecto_cocina | — | Hasta que llegue material_laton |
| `v3/mat-roble.jpg` | **Provisional:** Unsplash JH_R66BihvA (Simon Berger) | 6000 × 4421 | Hasta que llegue material_roble |
| `v3/card-marmol.jpg`, `card-bano.jpg`, `card-roble.jpg` | Fotos reales del estudio (`assets-cliente/`) | Ver arriba | Tarjetas con la etiqueta verde «Real» |
