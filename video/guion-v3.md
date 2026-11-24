# Guion v3 · 58 s · 30 fps · 16:9 y 9:16

Se elimina la estantería en arco. El cubo de cristal solo aparece en la apertura y en la transición de salida (7 s en total).
Reglas: sin `requestAnimationFrame`, todo calculado en función del tiempo. Muelles con la solución analítica del oscilador amortiguado (stiffness, damping, mass). El cursor virtual (círculo beige fino con punto) sigue curvas Bézier con pequeñas dudas y un rebote al pulsar. Paleta: papel #EDE6DA, crema, carbón y latón #9A7B4C. Tipografía: Bodoni Moda y Jost.
Acabado de lujo en todo el vídeo: grano fino, viñeteado suave, barrido de luz sobre los titulares, empuje lento de cámara en cada foto y fondos desenfocados por capas.

## Imágenes (v2, generadas con IA e ilustrativas) y lo que falta

| Escena | Imagen | Resolución | Uso |
|---|---|---|---|
| Antes / después | habitacion_fase0 · habitacion_fase4 | 1376 × 768 | Escaladas ×4 con Real-ESRGAN |
| Día / noche | habitacion_fase4 · habitacion_noche | 1376 × 768 | Escaladas ×4 y alineadas (la cámara de la noche está algo más abierta) |
| Tarjetas | proyecto_cocina | 848 × 1264 | Escalada ×2 |
| Materiales | material_porcelanico | 1264 × 848 | Escalada ×2 |
| Transición | detalle_1_olivo_cortina | 1672 × 941 | Escalada ×2 |

**Provisionales hasta que lleguen las nuevas** (mismo nombre de escena, se cambian sin tocar el código):
- **Fases 1, 2 y 3:** el antes/después usa solo la 0 y la 4, como indica el LEEME. Los barridos intermedios del divisor se quedan preparados para cuando lleguen.
- **Tarjetas:** proyecto_cocina (ilustrativa) más 3 fotos reales del estudio: cocina mármol y negro, baño de gres efecto piedra y cocina de roble y grafito. El chip dice el tipo y lleva una etiqueta verde «Real» o ámbar «Ilustrativa», para no presentar como propio lo que no lo es.
- **Materiales:** roble (Unsplash, el que ya usamos), travertino y latón no existen todavía. Los sustituyo por recortes del propio porcelánico y de la cocina hasta que los generes.

## Storyboard

| # | Tiempo | Plano | Qué pasa | Movimiento |
|---|---|---|---|---|
| 1 | 0,0–5,0 | Apertura | Titular gigante «2CON2ESTUDIO» con el cubo de cristal refractándolo y la línea «Interiorismo de lujo y reformas a medida en Valencia». | Cubo con deriva lenta. La línea entra con máscara y la dispersión baja a 0 junto a ella. |
| 1b | 5,0–6,4 | Transición con el cubo | El cubo gira 90°, se acerca a cámara y su cara refractada da paso a la primera tarjeta (corte por coincidencia). | Giro con curva suave y un empuje de escala que actúa de cortina. |
| 2 | 6,4–16,0 | TiltCard | Encabezado «Proyectos». Cuatro tarjetas en fila (en 9:16, rejilla de 2 × 2): entran escalonadas y el cursor las recorre una a una (unos 2,2 s cada una). | Inclinación según el cursor (factor 11), escala 1,05 y sombra que crece. La foto se endereza de −5° a −3°. Al entrar el cursor, un círculo blanco de 800 px se expande desde el punto de entrada. |
| 3 | 16,0–24,0 | PinnedList | Encabezado «Cómo trabajamos». Cuatro tarjetas: «Proyecto · Estudio previo», «Diseño · Planos y 3D», «Obra · Ejecución» y «Entrega · Llaves en mano». El cursor fija una tras otra (cada 1,6 s) en la sección «Fijado». | FLIP con muelle (380 / 20 / 0,8; de escala 0,96 e y −6 a 1 y 0). El botón se vuelve latón (no azul, por la paleta; si prefieres azul, cambio un valor) y la chincheta gira −45°. |
| 4 | 24,0–38,0 | Antes / después | Fase 0 contra fase 4 a pantalla completa. El cursor agarra el asa y arrastra hasta el 15 %, vuelve al 70 %, suelta y el divisor regresa al 50 % con inercia. Al final barre entero hacia «Después». Remate con «Del espacio vacío al hogar». | Divisor con muelle (300 / 30), línea de 2 px con sombra suave y asa de 40 px. Etiquetas «Antes» y «Después» con máscara. Empuje de cámara del 6 % en las dos fotos. |
| 5 | 38,0–44,0 | Interruptor día / noche | La habitación terminada de día. Panel de vidrio con «Iluminación · Día». El cursor agarra el interruptor y lo arrastra. | Agarre con muelle 500 / 25 (crece y aparece el halo). Pulgar con muelle 700 / 48 / 0,55. La pista pasa a verde, la noche entra con un barrido circular desde el interruptor y las luces se encienden con un pulso cálido. El estado cambia a «Noche». |
| 5b | 44,0–45,4 | Transición | Detalle de luz sobre mármol y cortina, con barrido especular. | Empuje lento con desenfoque de fondo. |
| 6 | 45,4–52,4 | Materiales | La frase «Materiales de primera:» con cuatro menciones en línea. El cursor pasa por cada una y abre su ficha: «Porcelánico veteado · gran formato», «Roble en espiga», «Travertino» y «Latón envejecido». | Ficha de 310 px que entra deslizándose desde arriba en 150 ms, esqueleto con brillo de 600 ms que se convierte en imagen de 140 px, título y 2 líneas, y salida con zoom-out. Sin marcas ni logos. |
| 7 | 52,4–58,0 | Cierre | Logo, «Cuéntanos tu proyecto», +34 620 22 21 23 y @2con2estudio. «Trabajamos con Porcelanosa» solo si lo confirmas (ahora desactivado). Enlace web: pendiente. | Máscaras escalonadas y 2 s de plano quieto final. |

Ritmo: planos de 1,4 a 14 s, nunca iguales. Las escenas de texto importante reducen el movimiento.

## 9:16 (reorganizado, sin recortar)
- **Tarjetas:** rejilla de 2 × 2 dentro de la zona segura.
- **Lista:** se mantiene vertical.
- **Antes/después e interruptor:** encuadre de 1080 × 1080 con texto arriba y abajo.
- **Materiales:** las menciones en columna, con la ficha debajo.
