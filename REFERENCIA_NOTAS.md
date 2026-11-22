# Notas de la referencia (estudio, con palabras propias)

Mirada el 2026-11-22 en un navegador controlado, escritorio 1440 × 900 y celular 390 × 844. Las capturas de
estudio quedan en `design-refs/study/` (en `.gitignore`, nunca al repo). No se descargó ni se leyó código,
modelos, texturas ni fuentes del sitio.

## Qué hace y cómo se siente

- **Primera pantalla**: casi todo blanco. Un objeto oscuro enorme al centro (la marca, partida en piezas,
  con algo que "crece" encima). Una frase corta a la izquierda con una palabra en cursiva que **cambia**
  cada tanto; una línea chica a la derecha. Globo oscuro arriba a la derecha. Logos de clientes al pie.
  Hay más de un canvas: el objeto y el globo son WebGL.
- **Carga**: la página aparece blanca y el objeto entra después; no hay pantalla de carga larga.
- **Movimiento**: lento y con inercia; el objeto responde al puntero con poco recorrido. Nada rebota.
- **Header**: dos píldoras ("hablar" negra con punto, "menú" gris con dos puntos). El menú **no es a
  pantalla completa**: es una tarjeta blanca flotante bajo las píldoras, con los links en mayúsculas, un
  punto en la página actual y, debajo, otra tarjeta para dejar el correo. La página sigue a la vista.
- **Sello con la cara del fundador**: queda **fijo abajo a la derecha en toda la página**, no solo en el
  hero. Al bajar aparece además un índice de secciones flotante a la derecha.
- **Secciones**: trabajos en tarjetas grandes con foto y rubro; servicios como **tarjetas oscuras grandes
  que se apilan** al scrollear (numeradas "01 · …"); plataforma; reseñas; una cita del fundador en letra
  enorme; cierre con "hablemos".
- **Celular**: la misma estructura en una columna; el header queda en un botón redondo de menú; el texto es
  **muy chico** (12–14 px), algo que Webya no puede repetir (personas mayores).

## Qué logra → cómo lo logra Webya con recursos propios

| La referencia logra… | Webya lo logra con… |
|---|---|
| Impacto inmediato con un objeto de marca | El símbolo `<w>` en metal oscuro, en tres piezas que siguen el lema (Creá → Digitalizá → Crecé) |
| "Crecimiento" literal sobre el objeto | Surcos de campo que salen del símbolo y brotan en "Crecé" (la pampa, no pasto) |
| Una palabra viva en el titular | Cada palabra del lema se enciende con su estado al scrollear |
| Ubicación global | Globo de puntos que frena en la zona con San Francisco y San Jorge, y lleva a `/zona` |
| Confianza con logos | "Funcionando en" con los tres clientes reales verificados (nombres, sin logos sin permiso) |
| Cara humana siempre a mano | Sello "escribinos" fijo abajo a la derecha en la compu (en el celular, en el hero; después, la barra) |
| Menú liviano que no te saca de la página | Tarjetas flotantes bajo las píldoras: links con punto en la página actual, "Armá tu sistema" y "Te escribimos nosotros" (deja tu WhatsApp) |
| Servicios que se apilan al bajar | Productos como tarjetas que se apilan (CSS `sticky`, sin JS) |
| Texto mínimo | Una línea por idea, pero nunca menos de 17 px en el celular |
