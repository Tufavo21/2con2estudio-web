# Voz en off · 2con2estudio (45 s) · ai33 pro (ElevenLabs o MiniMax)

Voz: español de España, cálida, serena y cercana, tono de anuncio de lujo sin exagerar.
Un solo audio con pausas largas entre frases (yo lo corto), o un archivo por frase. MP3 o WAV, sin música.

## Duración máxima de cada frase en el vídeo
1. Cada gran espacio empieza con una idea. → **4,0 s**
2. Dos con dos estudio. Interiorismo de lujo y reformas a medida, en Valencia. → **8,0 s**
3. Proyectos pensados al detalle, de principio a fin. → **4,3 s**
4. Del espacio vacío al hogar que habías imaginado. Diseño, obra y materiales de primera. → **10,0 s**
5. Cuéntanos tu proyecto. Dos con dos estudio. → **4,3 s**

## ElevenLabs
- **Modelo:** Eleven Multilingual v2. Si está Eleven v3, pruébalo también.
- **Voz:** filtra por Spanish, acento de España (Castilian/Spain) y estilo *narration* o *advertisement*. Mujer u hombre de 30–45 años, voz cálida.
- **Stability:** 45–55 % · **Similarity:** 75–80 % · **Style exaggeration:** 10–20 % · **Speaker boost:** activado · **Speed:** 0,92–0,95.

```
Cada gran espacio empieza con una idea. <break time="1.5s" />
Dos con dos estudio. <break time="0.4s" /> Interiorismo de lujo y reformas a medida, en Valencia. <break time="1.5s" />
Proyectos pensados al detalle, de principio a fin. <break time="1.5s" />
Del espacio vacío al hogar que habías imaginado. <break time="0.4s" /> Diseño, obra y materiales de primera. <break time="1.5s" />
Cuéntanos tu proyecto. <break time="0.5s" /> Dos con dos estudio.
```

Versión con Porcelanosa (sustituye la frase 4):
```
Del espacio vacío al hogar que habías imaginado. <break time="0.4s" /> Diseño, obra y materiales de primera, con Porcelanosa.
```

## MiniMax
- **Modelo:** speech-02-hd (o el HD más reciente) · **language_boost:** Spanish
- **Voz:** Spanish_CaptivatingStoryteller (la de la toma anterior) u otra española cálida.
- **Speed:** 0,95 · **vol:** 1 · **pitch:** 0 · **emotion:** neutral o calm · 44100 Hz

```
Cada gran espacio empieza con una idea.<#1.5#>
Dos con dos estudio.<#0.4#> Interiorismo de lujo y reformas a medida, en Valencia.<#1.5#>
Proyectos pensados al detalle, de principio a fin.<#1.5#>
Del espacio vacío al hogar que habías imaginado.<#0.4#> Diseño, obra y materiales de primera.<#1.5#>
Cuéntanos tu proyecto.<#0.5#> Dos con dos estudio.
```

Versión con Porcelanosa:
```
Del espacio vacío al hogar que habías imaginado.<#0.4#> Diseño, obra y materiales de primera, con Porcelanosa.
```

## Consejos
- Escribe «Dos con dos estudio» en letra; si pones «2con2estudio», puede leer el número en inglés o deletrearlo.
- Antes de exportar, comprueba que diga «Interior**ismo**» y no «Interiorio».
- Si una frase pasa de su máximo, sube la velocidad a 0,97–1,0 solo en esa frase.
- Genera 2 o 3 tomas de la voz que más te guste. Yo elijo la que mejor encaje en los tiempos.
