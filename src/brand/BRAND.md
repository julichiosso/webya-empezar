# WebYa — Manual de marca "Encastre"

Corto y para usar. Los valores **no** se copian acá: viven en el código (ver "Dónde vive cada cosa") y se
ven en vivo en `/sistema` (interna, noindex). Si este manual y el código no coinciden, manda el código.
Complementa las skills `webya-brand` (qué transmitimos) y `webya-design-system` (cómo se implementa).

## 1. Concepto

> Tu negocio se arma pieza por pieza, y cada pieza hace clic.

La persona activa módulos (carta, pedidos, turnos, pagos) y encajan en su negocio. **Lo que falta es un
hueco punteado; lo que encaja se tiñe de Brasa**, con check. Nunca al revés.

El riesgo visual se gasta en pocos momentos: el logo que se arma (una vez), la pieza que encaja al elegir
(`Encaje`), los estados vacíos como huecos, las comandas en papel crema con muesca y el riel punteado que
enhebra pasos. El resto queda sobrio.

## 2. Logo

Solo el wordmark de `public/webya-logo.svg` (5 trazos). No hay isotipo.

| Variante    | Qué es                                             | Dónde                                     |
| ----------- | -------------------------------------------------- | ----------------------------------------- |
| `completa`  | El wordmark, en el color del texto del tema        | Header, pie, documentos                   |
| `compacta`  | Solo la "w" del wordmark (no es un isotipo)        | Favicon, avatar, app icons, barra angosta |
| `monocromo` | El wordmark en una tinta que hereda del contenedor | Papel crema, impresión                    |

- **Área de respeto:** media altura de la "w" alrededor del logo (`zonaDeRespeto()`). Ahí no entra texto,
  borde ni otro logo.
- **Tamaño mínimo** (alto en pantalla, `TAMANIO_MINIMO`): completa 20 px; debajo de eso, la compacta, que
  nunca baja de 16 px.
- **Teja** (favicon, app icon, avatar): "w" blanca sobre negro, misma proporción en todos (`TEJA`).

| Bien                                           | Mal                                                  |
| ---------------------------------------------- | ---------------------------------------------------- |
| Blanco sobre negro, negro sobre crema o blanco | El logo en Brasa o en cualquier otro color de acento |
| `<Logo />` (SVG inline, cero JS)               | Un PNG del logo, o redibujarlo                       |
| La compacta cuando no entra la completa        | Estirar, recortar, rotar o comprimir el wordmark     |
| Respetar el área de respeto                    | Sombras, contornos, degradés o brillos sobre el logo |
| Animar con `armar` o `escribir`, una vez       | Animarlo en loop o en cada página                    |
| Logo solo, sin texto pegado                    | Inventar un isotipo o sumarle un ícono               |

## 3. Paleta

Un solo acento. Tres capas de tokens en `src/brand/tokens`: **primitivos** (`primitivos.ts`, nombre de
material: `--brasa-500`) → **semánticos** (`semanticos.ts`, nombre de uso: `--accent`) → **de componente**
(`componentes.ts`: `--boton-primario-fondo`). La UI usa semánticos o de componente, nunca primitivos.

| Rol               | Token semántico                          | Primitivo                                   | Uso                                                            |
| ----------------- | ---------------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| Fondo (negro)     | `--bg`                                   | `--negro-950`                               | Fondo de página. El oscuro es la cara de la marca              |
| Superficies       | `--surface`, `--surface-2`               | `--negro-900`, `--negro-850`                | Tarjetas, paneles, inputs                                      |
| Texto             | `--fg`, `--muted`, `--subtle`            | `--blanco-0`, `--gris-400`, `--gris-500`    | Todos AA sobre el fondo                                        |
| Acento (Brasa)    | `--accent`                               | `--brasa-500`                               | **Solo** CTA, foco, selección y la pieza que encaja            |
| Texto sobre Brasa | `--accent-fg`                            | `--negro-950`                               | Siempre negro: el blanco no llega a AA                         |
| Acento tinta      | `--accent-ink`                           | `--brasa-700`                               | Acento sobre crema (texto y foco dentro de `.papel`)           |
| Papel (crema)     | `--paper`, `--paper-fg`, `--paper-muted` | `--crema-100`, `--negro-950`, `--crema-700` | Comandas, tickets, tarjetas de pedido. No como fondo de página |
| Error             | `--danger`                               | `--rosa-400`                                | Rosa frío, distinto de Brasa. Siempre con texto                |

- **Tema claro** (`<html data-theme="light">`, solo elegible en `/empezar`): redefine los semánticos;
  el acento pasa a `--brasa-700` para llegar a AA sobre blanco.
- **Papel:** un contenedor con la clase `papel` pasa los tokens a su versión crema (también los de
  componente). El foco pasa a `--accent-ink`.
- **Prohibido:** hex o `rgb()` en componentes, acento en títulos, bordes decorativos o fondos grandes,
  más de un acento a la vez, degradés "de IA", glows.
- Todo color nuevo se agrega en `primitivos.ts`, se corre `pnpm tokens` (regenera `tokens.css`) y tiene
  que pasar AA en `marca.test.ts`.

## 4. Tipografía

**Outfit** (`next/font`, precargada a mano en `src/brand/tipografia/fuente.ts`). Escala fluida en
`TIPO` (`primitivos.ts`): `text-display`, `text-title`, `text-heading`, `text-lead`, `text-body`,
`text-small` (y `text-hero`/`text-hero-sub` del hero).

- Títulos semibold con `text-balance`; cuerpo regular, líneas de menos de 70 caracteres.
- El cuerpo y los inputs nunca bajan de 16 px (iOS hace zoom).
- Números (precios, pasos, teléfonos) con `tabular`.
- Sin MAYÚSCULAS en etiquetas, sin "eyebrows" sobre cada título.

## 5. Voz

Rioplatense, directa, cálida, con humor liviano. Alguien del barrio que sabe de tecnología.

- **Voseo siempre** (creá, activá, armá, elegí, tocá, sumá). Un verbo por botón.
- **Humor** solo en estados vacíos, confirmaciones y detalles ("Acá encaja tu primer pedido"); **nunca**
  en errores, pagos o datos personales.
- **Cero promesas** que el producto no cumple: la entrega la hace una persona; las demos usan datos de
  ejemplo y lo dicen. Sin precios, plazos, testimonios ni métricas inventadas: `TODO:` visible.
- **Diccionario** (`src/brand/voz/diccionario.ts`): `PROHIBIDAS` (superlativos vacíos, "garantizado",
  "solución integral"…), "tenemos todo" solo con su salvedad "a medida" y `PREFERIDAS` (decí "panel",
  no "dashboard"). Lo aplica `tests/copy` sobre todo `src/content`.
- Todo texto visible vive en `src/content`; `tests/arquitectura` falla si hay copy en componentes o páginas.

| Sí                             | No                                              |
| ------------------------------ | ----------------------------------------------- |
| "Activá lo que necesitás."     | "Potenciá tu negocio con soluciones digitales." |
| "Acá encaja tu primer pedido." | "No hay datos para mostrar."                    |
| "Te escribimos por WhatsApp."  | "Tu web lista en minutos."                      |

## 6. Ilustración

SVG propio e inline, en `src/brand/ilustracion` (detalle en su `LEEME.md`). Sin librerías ni stock.

- **Íconos:** grilla 24, trazo 1,5, sin relleno, extremos redondos, `currentColor`.
- **Dibujos** (platos, estados): grilla 96, trazo 2, como mucho dos tonos planos (`currentColor` + acento).
- **Arte de módulos:** banda 160 × 64, rellenos planos; apagado en gris de línea, encendido en acento.
- Lenguaje Encastre: la muesca (ticket colgado), el hueco punteado y la pieza en Brasa.
- Decorativo → `aria-hidden`; si comunica → `role="img"` + `<title>` con texto de `src/content`.

## 7. Movimiento

Presets en `src/brand/motion/presets.ts` (TS y `motion`) y `motion.css` (CSS). Valores desde los tokens.

- **Snap** (`SNAP`, clase `.snap`): la pieza llega, se pasa ≈ 2 % (`--escala-sobrepaso`) y asienta, en la
  duración base, con `--ease-out`. Una vez.
- **Duraciones** (`DURACIONES_MS`): instantáneo (toque), rápido (cambios chicos), base (snap, elegir),
  lento (entradas compuestas).
- **Toque** (`TOQUE`): una sola escala para todo lo que se aprieta (`--escala-toque`).
- **Entradas escalonadas:** `pieza(i)` + `.pieza-escalonada`; como máximo `PRESUPUESTO.maxPiezas` piezas
  y `PRESUPUESTO.entradaMaximaMs` en total (`entraEnPresupuesto()`).
- **Resortes** (`RESORTE`) solo para seleccionar y para el progreso.
- **Presupuesto** (`PRESUPUESTO`): solo `transform` y `opacity`. Única excepción: `stroke-dashoffset`
  (y `fill-opacity` del logo que se escribe) en íconos ≤ 24 px o en el logo, una sola vez. Nada en loop
  sobre algo interactivo; lo que corre en loop se pausa fuera de pantalla. JS inicial de la ruta y CLS con
  tope.
- **Reduced motion:** siempre hay versión estática equivalente (`motion.css` en CSS,
  `segunMovimiento()` en JS). El estado final aparece igual, sin perder información.

## 8. Dónde vive cada cosa

| Qué                                                       | Dónde                                                                |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| Colores, espacio, radios, tipos                           | `src/brand/tokens/{primitivos,semanticos,componentes}.ts`            |
| CSS de tokens (generado)                                  | `src/brand/tokens/tokens.css` ← `css.ts`, con `pnpm tokens`          |
| Vista plana de colores y paletas                          | `src/brand/tokens/colores.ts` (OG, `themeColor`, `/marca`)           |
| Logo                                                      | `src/brand/logo/` (`Logo.tsx`, `trazos.ts`, `variantes.ts`)          |
| Movimiento                                                | `src/brand/motion/` (`presets.ts`, `motion.css`, `toque.ts`)         |
| Tema claro/oscuro                                         | `src/brand/tema/`                                                    |
| Fuente                                                    | `src/brand/tipografia/fuente.ts`                                     |
| Voz                                                       | `src/brand/voz/diccionario.ts`                                       |
| Íconos e ilustraciones                                    | `src/brand/ilustracion/`                                             |
| Favicon y app icon                                        | `src/app/icon.svg`, `src/app/apple-icon.tsx`                         |
| Logo suelto e Instagram (avatar, 5 destacadas, SVG + PNG) | `docs/marca/` ← `pnpm marca:exportar` (`scripts/exportar-marca.mjs`) |
| Vitrina del sistema                                       | `/sistema` (`src/app/sistema`, textos en `src/content/sistema.ts`)   |
| Comparador de paletas                                     | `/marca`                                                             |

`src/brand` no importa de `features`, `components` ni `content` (lo verifica `tests/arquitectura`).
