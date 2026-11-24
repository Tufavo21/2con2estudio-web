# Assets v2 del motion de 2con2estudio

Todas las imágenes están en imagenes/v2/ con su nombre final. Son fotos generadas con IA, ilustrativas del sector (no son proyectos reales del estudio).

| Archivo | Qué es | Uso en el vídeo |
|---|---|---|
| habitacion_fase0.jpg | Obra en bruto: ladrillo, cemento, cables | «Antes» del antes/después |
| habitacion_fase4.jpg | Salón terminado de día | «Después» y cierre |
| habitacion_noche.jpg | El mismo salón de noche | Interruptor día/noche |
| proyecto_cocina.jpg | Cocina vertical con isla de mármol | Tarjetas de proyecto (TiltCard) |
| material_porcelanico.jpg | Muestras de porcelánico apiladas | Ficha de material (vista previa) |
| detalle_1_olivo_cortina.png | Detalle de luz sobre mármol y cortina de lino | Plano de transición |

## Qué falta (se puede generar después con los prompts)
- habitacion_fase1, fase2 y fase3 (suelo; paredes y luz; muebles). Mientras no estén, el antes/después usa solo fase0 y fase4.
- Más fotos de proyecto verticales: baño, dormitorio, terraza, comedor, recibidor.
- Materiales: roble, travertino, latón. Detalle 2.

## Resolución
Las imágenes son de ~1400 px de ancho (la cocina, 848 × 1264). Hay que escalarlas con un escalador de calidad antes de usarlas en 4K y animarlas con cuidado (no estirar).

## Otras carpetas y archivos
- referencias/: código de las animaciones que hay que reproducir (TiltCard, PinnedList, NotionMentionLink, SideBySideSlide, AppleSwitch) y los dos prompts de referencia (arco de estantería 3D y cubo de cristal). Son referencias de movimiento en React: hay que reproducirlas a mano, de forma determinista, no importarlas.
- prompts_imagenes_gemini_chatgpt.md: prompts para generar las fotos que faltan, con el mismo nombre de archivo que tiene que llevar cada una.
- guion_voz_en_off.md y efectos_sonido.md: solo para la fase final de audio (el guion de voz hay que ajustarlo a la nueva duración).
- audio/: vacía.
