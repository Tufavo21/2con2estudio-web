# Brief · Vídeo motion 2con2estudio

Fuentes revisadas: `src/content/business.js` (datos reales), `src/i18n/es.js` (textos de la web), `src/styles/global.css`, `PRODUCT.md`, `CREDITS.md`, `public/img-demo/CREDITS.md`, `assets-cliente/`, `assets-demo/` y la web publicada (workers.dev). No hay `CLAUDE.md`, `AGENTS.md` ni `DESIGN.md` en el proyecto.

## Identidad visual

| Elemento | Valor (de `global.css`) |
|---|---|
| Papel (base) | `#EDE6DA` |
| Tinta | `#15120E` · secundaria `#4A433A` |
| Acento | bronce `#9A7B4C`, solo detalles y texto grande |
| Neutro | `#8A8071`, solo decoración |
| Titulares | **Bodoni Moda** 400, MAYÚSCULAS, interlineado 0.95 |
| Texto y etiquetas | **Jost** 300/500; etiquetas 500, MAYÚSCULAS, tracking 0.14em |
| Logo | PNG con transparencia, negro y blanco, 1578 × 1452 (no hay vectorial) |

Tono: confianza, criterio y calidad. Sobrio, editorial y con mucho aire. Nunca ofertas ni precios. Sin degradados, sin sombras duras y con radios 0. La excepción es el cubo de cristal que pides, que lleva bordes redondeados por diseño.

## Fotos

### Reales del estudio (`assets-cliente/`, aportadas por el cliente)
Según `CREDITS.md`, son **ampliaciones de capturas de baja resolución**. Ninguna llega a 4K.

| Archivo | Resolución | Qué muestra | Uso en 1080p |
|---|---|---|---|
| `cocina-marmol-negra.jpg` | 3444 × 2528 | Cocina negra, isla de piedra blanca veteada, 3 colgantes | Sirve a pantalla completa |
| `cocina-obra-molduras.jpg` | 2192 × 3104 | Cocina en obra, módulos grises, techo con molduras | Tarjeta vertical. A pantalla completa en 16:9, justa |
| `bano-gres-piedra.jpg` | 1992 × 3244 | Baño de gres gris efecto piedra, hornacina, bañera exenta | Tarjeta vertical y 9:16 |
| `cocina-roble-grafito.jpg` | 2048 × 1532 | Cocina de roble, isla grafito, hornos en columna | Tarjeta. A pantalla completa en 16:9, justa |
| `cocina-blanca-compacta.jpg` | 1340 × 2388 | Cocina blanca en L, estantes de roble | Solo tarjeta pequeña: se ve blanda |

### De banco ya descargadas (`assets-demo/`, Unsplash, 3200 px)
Licencia Unsplash, con autoría en `public/img-demo/CREDITS.md`. **No son obras del estudio.** Si salen en el vídeo, llevarán el rótulo «Imagen ilustrativa» y nunca irán en la estantería de proyectos.

- **Descartadas por tu regla** («no uses fotos de proyectos de otros estudios»):
  - `proj-cocina-roble`: autor «We Do Interior Design & Fit Out», es un estudio.
  - `casa-bano`: autor «goodlifeconstruction», es una constructora.
  - `proj-obra-antes` y `proj-obra-despues`: generadas con IA y por debajo de 4K.
- **Utilizables como ilustrativas**: `casa-salon`, `casa-cocina`, `casa-dormitorio`, `bano-plano`, `proj-bano`, `proj-cocina-compacta`, `proj-piso` y `proc-entrega`. Ahora están a 3200 px. Para cumplir los 3840 px hay que volver a bajarlas a resolución original desde Unsplash.

### Qué falta
- **Materiales**: no hay fotos genéricas de piedra, porcelánico ni madera. Hacen falta 2–3 de banco, de 4K o más.
- **4K**: ninguna foto real llega. Para un máster a 1080p bastan las 4 primeras. La cocina blanca solo sirve en tamaño de tarjeta.
- **Música**: no hay ninguna pista.

## Textos que se pueden usar tal cual
- «2con2estudio»
- «Interiorismo de lujo y reformas a medida en Valencia» (título y entradilla de la web)
- «DISEÑO DE INTERIORES · EJECUCIÓN DE OBRA» (lema real)
- «Del primer plano a la última llave: un solo equipo diseña y construye tu casa.»
- «Quien diseña, construye» · «Lo que se dibuja en el estudio es lo que se levanta en la obra.»
- «Todo tipo de reformas» · «Cuéntanos tu proyecto»
- Teléfono **+34 620 22 21 23** (confirmado por ti el 20-11-2026; la web aún muestra el 685 35 41 53) · Instagram **@2con2estudio** · Valencia
- «Trabajamos con Porcelanosa»: texto tuyo, **pendiente de tu confirmación**.
- Rótulos de proyecto: **solo descripciones** de lo que se ve en las fotos reales (por ejemplo, «Cocina · mármol y negro»). Los nombres «Baño Campanar», «Piso Eixample», etc., son inventados (`demo-content.js`) y no se usan.

**No se usan** las cifras (12 años, 140 viviendas, 9800 m²), los testimonios ni los años y m² de los proyectos: todo eso es contenido de demostración.

## Pendiente / bloqueos
1. **Enlace de la web**: el dominio definitivo es `[FALTA]`. La única URL pública es `2con2estudio-demo.pableteizquierdoperez.workers.dev`, que es larga, provisional y lleva un nombre personal. Propongo cerrar sin URL o con la que me des.
2. **Porcelanosa**: falta tu permiso para nombrarla. No se usa su logo ni sus fotos.
3. **Herramientas**: en este equipo no están las skills `/hyperframes`, `/hyperframes-cli`, `/hyperframes-registry` ni `/media-use`, ni Refero Styles, ni la CLI de Codex. Tampoco hay ffmpeg en el PATH. HyperFrames sí existe en npm (`hyperframes@0.9.72`, de HeyGen), pero sin instalar.

---

# Brief v2 · 20-11-2026 (45 s)

## Nuevo material (`assets-motion/`, de Canva, **ilustrativo del sector, no son proyectos del estudio**)
El zip solo trae los tres textos (LEEME, guion de voz y efectos). Las imágenes son enlaces de Canva; las he localizado en tu cuenta y estas son sus resoluciones reales:

| Archivo | Qué se ve | Resolución real | Para 1080p |
|---|---|---|---|
| habitacion/fase0_vacia | Solera de cemento, paredes en bruto, ventanal | 1680 × 944 | Por debajo de 1920: hay que escalar |
| habitacion/fase1_suelo | Roble en espiga y rodapié | 1680 × 944 | Hay que escalar |
| habitacion/fase2_paredes_luz | Molduras, pared de porcelánico veteado, línea LED | 1680 × 944 | Hay que escalar |
| habitacion/fase3_muebles | Sofá curvo, mesa, alfombra, lámpara de globo, cortinas | 1680 × 944 | Hay que escalar |
| habitacion/fase4_final | Terminada y decorada (butaca, aparador, planta) | 2720 × 1536 | Sirve |
| proyectos/cocina | Cocina negra con isla de piedra y latón | 1664 × 2496 | Sirve para tarjeta |
| proyectos/bano | Baño de porcelánico veteado con bañera exenta | 1664 × 2496 | Sirve para tarjeta |

- **Fases 0–3**: para 16:9 a pantalla completa hace falta escalarlas 1,15× (y algo más con el empuje de cámara). Para 9:16, al recortar en vertical de una foto horizontal, el escalado llega a 2×. Propongo escalarlas a 4× con Real-ESRGAN y anotarlo en `docs/assets-licenses.md`.
- **Faltan** 4 proyectos (dormitorio, ático, comedor, recibidor). La estantería se completa con las 5 fotos reales del estudio, que tienen prioridad.
- En la estantería, las tarjetas de Canva llevan el rótulo «Imagen ilustrativa»; las reales, solo su descripción.

## Textos nuevos (web y guion de voz, sin datos del estudio)
«Cada gran espacio empieza con una idea» · «Proyectos pensados al detalle, de principio a fin» · «Del espacio vacío al hogar» · etiquetas «Suelo», «Paredes», «Iluminación», «Mobiliario». Las cotas de la habitación son de plano ilustrativo, no de un proyecto real.
