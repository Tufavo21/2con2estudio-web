# Guion · 30 s · 30 fps · 16:9 (1920×1080) y 9:16 (1080×1920)

Regla: nada se revela con un fundido de opacidad; todo entra con máscara, clip-path o escala. Hay grano de papel suave en todo el vídeo. Tipografías: Bodoni Moda (titulares) y Jost (etiquetas). Base `#EDE6DA`.

| # | Tiempo | Imagen | Texto en pantalla | Técnica |
|---|---|---|---|---|
| 1 | 0,0–5,0 s | Titular gigante sobre papel. El cubo de cristal, centrado y un poco a la derecha, lo refracta con franjas azul y ámbar y deriva despacio. | **2CON2ESTUDIO** · debajo: «Interiorismo de lujo y reformas a medida en Valencia» | A (Three.js, Euler inicial -0.42 / 0.62 / 0.18). El titular entra con máscara de abajo arriba. La línea secundaria, con máscara escalonada de 75 ms. |
| 2 | 5,0–14,0 s | Estantería en arco con las 5 fotos **reales**. Pasan 4 en el centro (≈2,1 s cada una): la central gira 90° y muestra la foto sobre una sombra suave. Detrás, en halftone, «DISEÑO DE INTERIORES · EJECUCIÓN DE OBRA». | Rótulo de cada tarjeta: «Cocina · mármol y negro», «Baño · gres efecto piedra», «Cocina · roble y grafito», «Cocina · en obra». Regla inferior: **Proyecto — Diseño — Obra — Entrega**, con la marca avanzando una fase por tarjeta. | B, con las fórmulas que diste. Muelle k=5,2 evaluado como función del tiempo. Rótulos con máscara de 650 ms. |
| 3 | 14,0–21,0 s | Transición: el cubo gira +90° en Y con easing y aparece sobre una foto de piedra o porcelánico (de banco, «Imagen ilustrativa»). A los 17,5 s, otro giro de 90° pasa a madera. | «Trabajamos con Porcelanosa» *(pendiente de confirmar; si no lo confirmas: «Todo tipo de reformas»)*. Etiqueta pequeña: «Imagen ilustrativa». | A, con la foto como textura del quad de fondo. |
| 4 | 21,0–26,0 s | La tarjeta central de la estantería (cocina mármol negra, la mejor foto real) se expande a pantalla completa. La foto aparece como manchas de tinta. | «Del primer plano a la última llave: un solo equipo diseña y construye tu casa.» | C: clip-path inset 1050 ms, cubic-bezier(.76,0,.18,1), y feTurbulence con feDisplacementMap de semilla fija. |
| 5 | 26,0–30,0 s | Papel liso. Logo negro, que entra con escala y máscara. Movimiento mínimo. | «Cuéntanos tu proyecto» · +34 620 22 21 23 · @2con2estudio · [enlace web: pendiente] | Máscaras escalonadas y 1,5 s quieto al final, para leer. |

## 9:16
- Misma línea de tiempo. El cubo y el titular van centrados y el titular ocupa hasta el 90 % del ancho (en dos líneas: «2CON2 / ESTUDIO»).
- Estantería: 3 tarjetas visibles en vez de 5, más altas. Las fotos verticales reales (baño y cocina en obra) encajan mejor aquí.
- Escena 4: recorte vertical de la cocina mármol negra (3444 × 2528: alcanza para 1920 de alto).

## Sonido
- Versión A: música de ambiente con licencia libre, con fade-out en los últimos 1,5 s. **Tienes que darme la pista o autorizarme a descargar una** (no está `/media-use`).
- Versión B: sin música.

## Entregables
`video/out/2con2-16x9.mp4`, `2con2-16x9-sinmusica.mp4`, `2con2-9x16.mp4` y `2con2-9x16-sinmusica.mp4`, en H.264, con un objetivo de menos de 30 MB cada uno (Instagram admite mucho más).
