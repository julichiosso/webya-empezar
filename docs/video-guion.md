# Video de presentación de WebYa (30–40 s)

Para producirlo afuera (grabación de pantalla o herramienta de video con IA) y subirlo como MP4.
Mientras no exista el archivo, el sitio muestra la animación en código del flujo (ver
`VideoPresentacion`). Todo lo que dice el video es lo que el producto hace hoy: **sin precios, sin
plazos, sin cifras, sin testimonios, sin "el mejor"**. Si algo no está confirmado, no va.

## Reglas

- Vertical 9:16 (Reels/Stories) y una versión 16:9 para el sitio. Duración 30–40 s.
- **Sin voz en off inventada.** Texto en pantalla, corto y en voseo. Si se graba voz, que diga
  exactamente los textos de pantalla y nada más. Subtítulos en es-AR quemados (Reels) y en `.vtt`
  (sitio).
- Música suave sin letra, con licencia libre o propia. Sin sonido al empezar en el sitio (no hay
  autoplay con sonido).
- Colores de marca: negro de fondo, acento Brasa, crema para el "papel". Tipografía Outfit.
- Concepto **Encastre**: cada parte del negocio entra como una pieza que hace clic.

## Guion

| Tiempo  | Imagen                                                                                                                                                                                       | Texto en pantalla                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 0–4 s   | **Gancho.** Un celular con un chat de WhatsApp lleno de pedidos anotados a mano. Corte en seco a la pantalla de WebYa.                                                                       | ¿Querés ver tu negocio online antes de hablar con nadie? |
| 4–10 s  | **Toque 1.** La pantalla "¿Qué negocio tenés?" con las tarjetas de rubro. Un dedo toca "Gastronomía"; la tarjeta se marca.                                                                   | Elegí tu rubro.                                          |
| 10–16 s | **Toque 2.** El formulario: se escribe "Lo de Tito" y un WhatsApp de ejemplo (11 2345 6789, el mismo del sitio). El botón pasa a check.                                                      | Poné el nombre de tu negocio.                            |
| 16–28 s | **El resultado.** "Así te queda Lo de Tito": la web se arma pieza por pieza (portada, carta, horarios, contacto). Se tocan dos colores y cambia la paleta. Se pasa de celular a computadora. | Así te queda. Con tu nombre y tus colores.               |
| 28–34 s | **Toque 3.** "Quiero esto para mi negocio" y se abre WhatsApp con el mensaje armado.                                                                                                         | Si te gusta, lo armamos con vos.                         |
| 34–38 s | Cierre: logo de WebYa que encaja, y la dirección del sitio.                                                                                                                                  | webya.ar/empezar                                         |

Notas:

- Los textos de ejemplo de la vista previa se muestran tal cual (la web dice "Textos de ejemplo").
- No mostrar el plazo de respuesta (sigue sin confirmar) ni precios.
- Si se usa el caso real de Micio's, **solo con su permiso escrito** (el mismo que habilita la
  sección "Hecho para negocios reales" en el sitio).

## Prompt para una herramienta de video con IA

Pegar tal cual (en inglés suele dar mejores resultados; el texto en pantalla va en español):

```text
Create a 35-second vertical (9:16) product video for "WebYa", a service that builds the digital
presence of small local businesses in Argentina. Style: clean, modern UI motion graphics on a deep
black background, one warm orange-red accent color (#ff5b24), cream paper cards, rounded corners,
geometric sans-serif typography (Outfit). Visual concept: "puzzle pieces that snap into place" —
every UI section enters as a piece that drops in and clicks, with a tiny overshoot. No people's
faces, no stock photos, no 3D, no blur effects, no glitch effects.

Use as visual reference the real website of a pizzeria ([URL del sitio de Micio's]): a phone
showing a menu ("carta") with dish cards, a "Ver la carta" button and an "order by WhatsApp" flow.
Recreate that style generically: do NOT copy their logo or brand name.

Scenes:
1 (0-4s) A phone with a busy WhatsApp chat full of handwritten-looking orders, then a hard cut to
  a clean screen. On-screen text: "¿Querés ver tu negocio online antes de hablar con nadie?"
2 (4-10s) A screen titled "¿Qué negocio tenés?" with 7 business-type cards (hair salon,
  restaurant, shop, professionals, gym, technical services, other). A finger taps "Gastronomía".
  Text: "Elegí tu rubro."
3 (10-16s) A short form: business name "Lo de Tito" is typed, then a phone number. The button
  turns into a check mark. Text: "Poné el nombre de tu negocio."
4 (16-28s) Title "Así te queda Lo de Tito": a small restaurant website assembles piece by piece
  inside a phone frame (hero with the name, menu list, opening hours, contact). Two color swatches
  are tapped and the site recolors. Then it switches to a laptop browser frame.
  Text: "Así te queda. Con tu nombre y tus colores."
5 (28-34s) A big orange button "Quiero esto para mi negocio" is tapped and WhatsApp opens with a
  pre-written message. Text: "Si te gusta, lo armamos con vos."
6 (34-38s) The "webya" wordmark snaps together; below it "webya.ar/empezar".

No voice-over. Soft instrumental background music, no lyrics. Burn Spanish (Argentina) subtitles
identical to the on-screen texts. Do not add prices, numbers of clients, ratings, testimonials,
time promises or any claim not listed above.
```

## Cuando esté el MP4

Ver el reporte de `VideoPresentacion` (etapa d): dónde va el archivo en `public/` y qué valor de
configuración cambia. Los subtítulos `.vtt` salen del mismo guion que la animación en código.
