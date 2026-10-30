# Guía de copy de WebYa (corta)

Las reglas completas están en `.claude/skills/webya-copy-comercial` y `webya-brand`. Esto es el resumen para
quien escribe un texto nuevo. El copy vive en `src/content/` y el test `tests/copy` revisa la lista prohibida
(`src/brand/voz/diccionario.ts`) y que ningún número vaya sin `TODO:`.

## Sí / No

| Sí | No |
|---|---|
| "Todo lo digital para tu negocio. Y si no está, lo armamos a medida." | "Tenemos todo lo que tu negocio necesita." |
| "Te escribimos por WhatsApp." + `PENDIENTES.plazoRespuesta` | "Te respondemos en menos de 24 hs." (sin confirmar) |
| "Depende de lo que actives: te armamos un presupuesto sin compromiso." | "Desde $X por mes." |
| "Probalo antes en la demo, con datos de ejemplo." | Esconder que es una demo. |
| "Lo armamos nosotros, a mano y con vos." | "Tu web lista en minutos." |

## Antes / después (este sprint)

- Hero: "Creá tu negocio online. / Elegí tu rubro. Activá lo que necesitás." → "Todo lo digital para tu
  negocio. / Y si no está, lo armamos a medida." (variantes y razonamiento en `content/empezar/hero-variantes.ts`).
- Señal del hero: "Te respondemos en menos de 24 hs" → "Te escribimos por WhatsApp" (+ TODO del plazo).
- FAQ: "¿En cuánto tiempo está?" → "¿Cuánto tardan?", con "depende de lo que actives" + TODO de plazos.
- Footer: "Tu negocio. Nuestra tecnología." (lo podría decir cualquiera) → "Todo lo digital para tu negocio, o
  lo armamos a medida."

## Lo que falta definir

Todo lo pendiente está en `src/content/pendientes.ts` (plazo de respuesta, precios, plazos de entrega, dominio,
privacidad, módulos sin confirmar). Cuando el usuario confirme algo, se cambia el texto visible que lo
acompaña y se borra la clave.
