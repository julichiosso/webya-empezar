---
name: webya-plano
description: Dirección visual "Plano" de WebYa /empezar (sobre el concepto Encastre) — secciones a pantalla completa con fondos tinta, crema, Brasa oscura e imagen con velo; lenguaje blueprint (grilla, cotas, marcas de registro) y titulares que encastran palabra por palabra. Reglas de uso, contraste, movimiento y la lista de prohibidos (síntomas de IA). Usala antes de diseñar o tocar una sección, un fondo, un titular animado o una ilustración de plano.
---

# WebYa — Dirección "Plano"

WebYa es una herramienta para **crear** (como un Canva para negocios). Plano lo dice con el lenguaje
de quien diseña: un plano técnico donde las piezas del negocio encastran. Va **sobre** el concepto
Encastre (`webya-brand`) y respeta todo `webya-design-system`. Manual con valores: `src/brand/BRAND.md`.

## 1. Fondos de sección (a pantalla completa)

Cuatro materiales. No cambian con el tema (son material, no tema): una sección de tinta es oscura
con el sitio en claro también. Cada uno lleva **su scope** para que botones, campos y foco se vean bien.

| Fondo                | Clases (contrato `docs/plano-contrato.md`)                                                         | Scope              | Para qué                                                       |
| -------------------- | -------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------- |
| Tinta (negro cálido) | `bg-seccion-tinta text-seccion-tinta-fg`, `text-seccion-tinta-muted`, `border-seccion-tinta-linea` | `superficie-tinta` | La base: hero, cómo funciona                                   |
| Crema (papel)        | `bg-seccion-crema text-seccion-crema-fg`, `-muted`, `-linea`                                       | `papel`            | Pausa clara: el producto, ejemplos, comandas                   |
| Brasa oscura         | `bg-seccion-brasa text-seccion-brasa-fg`, `-muted`, `-linea`                                       | `superficie-brasa` | UNA por página: el cierre o la promesa central                 |
| Imagen con velo      | `bg-velo-imagen` sobre la foto, `text-velo-imagen-fg`, `-muted`                                    | `superficie-velo`  | Foto a pantalla completa (o `IlustracionPlano` si no hay foto) |

- Alternar materiales da el ritmo; dos secciones seguidas del mismo fondo se separan con `border-seccion-borde`.
- Brasa oscura **no** es el acento: es un fondo apagado. El acento (Brasa 500) sigue solo en CTA, foco,
  selección y la pieza que encaja.
- Sobre el velo: nunca texto de acento (da 3,26:1 con la foto blanca, solo vale para foco y relleno de
  botón). Formularios o errores sobre una foto van en una tarjeta (`bg-surface`, que en el velo es tinta).
- Sobre crema: el acento de texto es `text-accent-ink` (lo resuelve `.papel`).
- Contraste: todas las combinaciones están medidas en `colores.ts` (`SUPERFICIES_SECCION`,
  `combinacionesSeccion`) y las verifica `marca.test.ts`. Un color nuevo pasa AA o no entra.

## 2. Blueprint

- `FondoPlano` (`variante="grilla" | "cotas"`): cuadrícula de 16/64 px; `cotas` suma cotas con flechas,
  un módulo punteado, una anotación y marcas de registro en las cuatro esquinas. Va `absolute inset-0`
  detrás del contenido (padre `relative isolate`, fondo con `-z-10` o contenido con `relative`).
- `IlustracionPlano` (`escena="hero" | "como-funciona" | "cierre"`): el fallback de las fotos. Un plano
  de piezas con muesca y lengüeta que encastran; la única pieza en Brasa es la que encaja.
- Todo en `currentColor` con opacidades (`TINTA_PLANO`): sirve en los cuatro fondos sin variantes.
  Decorativo (`aria-hidden`), sin `<text>`, sin filtros, sin degradés. Las anotaciones son renglones mudos.
- Con medida: un `FondoPlano` `cotas` por pantalla como mucho; el resto, `grilla` o nada.

## 3. Kinetic type (titulares que encastran)

- Preset en `src/brand/motion/presets.ts`: `encastrePalabra(i, reducido)` (motion) o
  `ENCASTRE_PALABRA.clase` + `estiloPalabra(i)` (CSS, sin JS: la preferida para el hero).
- Cada palabra llega alternando abajo/arriba, apenas achicada, se pasa ~2 % y asienta. Una vez.
  Tope de 8 palabras escalonadas (`duracionTitulo(8)` = 940 ms); las demás entran con la última.
- Solo en titulares de sección (el h1 y como mucho uno por pantalla). Nunca en cuerpo, botones ni en loop.
- El texto sigue siendo texto: el `<h1>` conserva las palabras reales (spans + `{' '}` entre ellas).

## 4. Movimiento

Solo `transform` y `opacity` (excepción documentada: `stroke-dashoffset` en trazos chicos, una vez).
Una sola vez, al entrar. Con `prefers-reduced-motion` todo aparece en su estado final (lo resuelven
`motion.css`, `movimiento.css` y `encastrePalabra(i, true)`). Reservá el espacio: CLS < 0,05.

## 5. Prohibido (síntomas de IA)

- Glassmorphism, `backdrop-blur` decorativo, gradient mesh, degradés violeta/azul, glows, neón, sombras de color.
- Tarjetas iguales en grilla como composición principal de una sección.
- Ícono dentro de un cuadrado redondeado como adorno; insignias, emojis o "pills" decorativas sobre títulos.
- Avisos con borde izquierdo de color; botones con contorno naranja; acento en títulos o fondos grandes.
- Stock, robots, manos con celulares, mockups 3D flotando.
- Fade-up en cada sección, parallax, contadores animados, texto que se escribe solo.
- Eyebrows en mayúsculas sobre cada título; "→" en todos los botones.

## 6. Así sí / así no

| Así sí                                                                    | Así no                                                               |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Hero en tinta con `FondoPlano cotas`, titular que encastra y un CTA Brasa | Hero con degradé de fondo, blur y tres badges arriba del título      |
| "Cómo funciona" como plano: riel, tres estaciones (falta, llega, encaja)  | Tres tarjetas iguales con ícono en cuadradito y número grande        |
| Una sección Brasa oscura para el cierre, con el CTA                       | Bloques naranjas en cada sección, o el título en naranja             |
| Foto real con `bg-velo-imagen` plano encima; sin foto, `IlustracionPlano` | Foto de stock con degradé "de IA" y texto de acento encima           |
| Anotación del plano: punto, línea quebrada, dos rayas                     | Rótulos con texto inventado ("v2.0", "API ready") adentro del dibujo |
| Error en texto rosa dentro de una tarjeta                                 | Aviso con borde izquierdo rojo y fondo tintado                       |

## 7. Checklist

- [ ] ¿Cada sección usa uno de los cuatro materiales, con su scope?
- [ ] ¿Una sola sección Brasa oscura y el acento solo en CTA/foco/selección/pieza?
- [ ] ¿Blueprint con medida (un `cotas` por pantalla) y decorativo?
- [ ] ¿Titular que encastra solo en el h1 o un titular de sección, con versión quieta?
- [ ] ¿Nada de la lista de prohibidos?
- [ ] ¿Contraste medido (no a ojo) para cualquier combinación nueva?
