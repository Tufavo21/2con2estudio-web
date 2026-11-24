# DESIGN · vídeo 2con2estudio

Sale de `src/styles/global.css` y `docs/design/atelier-mono.md`. Refero Styles no está disponible en este equipo, así que no se ha usado.

- **Color**: papel `#EDE6DA` (base), tinta `#15120E`, tinta secundaria `#4A433A`, puntos del halftone `#CDBFA9`. Sin acento en pantalla: el color lo ponen las fotos.
- **Tipografía**: dos familias. Bodoni Moda 400 en MAYÚSCULAS para los titulares (la cursiva solo en la entradilla) y Jost 400/500 para las etiquetas, en MAYÚSCULAS con tracking 0.14–0.2em.
- **Movimiento**: nada se revela con fundido. Los textos entran con máscara (650 ms, cubic-bezier(.2,.8,.2,1)) y escalonados 75 ms. Los cambios de escena son cortinas con clip-path (eIO .65,0,.35,1), y la expansión del detalle usa clip-path inset (1050 ms, cubic-bezier(.76,0,.18,1)). Cuando hay texto que leer, el movimiento se reduce a un empuje lento de la foto (4 %).
- **Objetos**: un cubo de cristal (Three.js, refracción en dos pasadas y 6 bandas de IOR 1.15–1.22) y una estantería en arco con perspectiva de 1400 px.
- **Textura**: grano de papel fijo con semilla, en soft-light al 55 %.
- **Zonas**: en 16:9 se usan márgenes de 96 px. En 9:16, todo el texto pequeño va dentro de la zona segura de Reels, TikTok y Shorts (288–1248 px de alto, 120–888 px de ancho); solo el titular gigante llega al 90 % del ancho.
