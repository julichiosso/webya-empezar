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

### 3b. Fondos de sección (dirección Plano)

Secciones a pantalla completa (contrato: `docs/plano-contrato.md`; reglas de uso: skill `webya-plano`).
Son **material, no tema**: el tema claro no los redefine. Cada uno lleva su scope, que fija los
semánticos base adentro (`--fg`, `--accent`, `--surface`, foco…) para que los componentes comunes se
vean bien con el sitio en oscuro o en claro.

| Fondo        | Fondo / texto / secundario / línea (semánticos)                       | Primitivos                                             | Scope               |
| ------------ | --------------------------------------------------------------------- | ------------------------------------------------------ | ------------------- |
| Tinta        | `--seccion-tinta`, `-fg`, `-muted`, `-linea` (+ `-acento`)            | `--tinta-950`, `--crema-50`, `--tinta-400`, crema 16%  | `.superficie-tinta` |
| Crema        | `--seccion-crema`, `-fg`, `-muted`, `-linea` (+ `-acento`)            | `--crema-100`, `--negro-950`, `--crema-700`, negro 14% | `.papel`            |
| Brasa oscura | `--seccion-brasa`, `-fg`, `-muted`, `-linea` (+ `-acento`)            | `--brasa-950`, `--crema-50`, `--brasa-200`, crema 16%  | `.superficie-brasa` |
| Velo         | `--velo-imagen` (tinta al 80 %, plano), `-fg`, `-muted` (+ `-acento`) | `--tinta-950`, `--crema-50`, `--crema-300`             | `.superficie-velo`  |

De componente: `--plano-pieza` (la pieza Brasa del plano → `accent`), `--plano-cota` (→ `muted`),
`--seccion-borde` (hilo entre dos secciones iguales → `line`). Se resuelven dentro de cada scope.

**Contraste medido** (`colores.ts` → `SUPERFICIES_SECCION` y `combinacionesSeccion`; lo exige
`marca.test.ts`). Los valores son los mismos en oscuro y en claro, porque el scope fija acento y texto;
la única diferencia por tema es el botón sobre crema (`.papel` no toca el acento). El velo se mide
contra el peor caso: una foto blanca pura (fondo efectivo `#45413f`).

| Fondo | Texto | Secundario | Texto / sec. en tarjeta | Acento sobre el fondo          | Texto del botón (oscuro / claro) | Error en tarjeta |
| ----- | ----- | ---------- | ----------------------- | ------------------------------ | -------------------------------- | ---------------- |
| Tinta | 17,57 | 6,96       | 16,06 / 6,36            | 6,01 (Brasa 500)               | 6,35 / 6,35                      | 6,26             |
| Crema | 16,91 | 6,11       | 18,56 / 6,71            | 4,95 (`accent-ink`, 700)       | 6,35 / 5,75                      | 6,09             |
| Brasa | 14,06 | 8,95       | 14,06 / 8,95            | 4,81 (Brasa 500)               | 6,35 / 6,35                      | 5,48             |
| Velo  | 9,52  | 6,48       | 17,57 / 11,95           | 3,26: solo foco y relleno (≥3) | 6,35 / 6,35                      | 6,85             |

- Mínimos: 4,5 en texto; 3 en foco y relleno. Sobre el velo **no va texto de acento**.
- Brasa 500 sobre crema da 2,66: ahí el acento de texto y el foco son `accent-ink`; el botón se lee por su texto.

## 4. Tipografía

**Outfit** (`next/font`, precargada a mano en `src/brand/tipografia/fuente.ts`). Escala fluida en
`TIPO` (`primitivos.ts`): `text-display`, `text-title`, `text-heading`, `text-lead`, `text-body`,
`text-small` (y `text-hero`/`text-hero-sub` del hero).

- Títulos semibold con `text-balance`; cuerpo regular, líneas de menos de 70 caracteres.
- El cuerpo y los inputs nunca bajan de 16 px (iOS hace zoom).
- Números (precios, pasos, teléfonos) con `tabular`.
- Sin MAYÚSCULAS en etiquetas, sin "eyebrows" sobre cada título.

**Evaluación de familia (sprint Plano, 2026-10-31): queda Outfit.** Se compararon tres OFL contra
Outfit, con el subset latin en woff2 que sirve Google Fonts (lo mismo que descarga `next/font`) y una
muestra a 320 px (titular de 40 px semibold, cuerpo de 16 px, números tabulares):

| Familia             | Variable (KB)          | Estático 400 / 500 / 600 (KB) | Alto de x | Ancho del cuerpo vs. Arial | Lo que aporta                                                  |
| ------------------- | ---------------------- | ----------------------------- | --------- | -------------------------- | -------------------------------------------------------------- |
| **Outfit** (actual) | **31,5**               | 13,7 / 13,2 / 13,8            | 0,50      | −1 %                       | Geométrica, compacta en titulares grandes, ya afinada (CLS 0)  |
| Bricolage Grotesque | 75,1 (40,4 sin `opsz`) | 21,8 / 21,9 / 21,9            | 0,56      | +4 %                       | La de más personalidad en display, pero solo con el eje `opsz` |
| Instrument Sans     | 29,4                   | 16,5 / 16,8 / 17,0            | 0,56      | +2 %                       | Cuerpo un poco más legible; titulares más anchos y neutros     |
| Hanken Grotesk      | 33,9                   | 13,1 / 13,5 / 13,5            | 0,50      | +1 %                       | Prácticamente igual a Outfit en peso; menos carácter           |

- Ninguna gana **claramente**. Bricolage es la única con más personalidad, pero la que la tiene (con
  `opsz`) pesa 2,4 veces más (+43,6 KB en el camino crítico del LCP); sin `opsz` queda una grotesca más.
  Instrument Sans mejora apenas el cuerpo (alto de x 0,56) a cambio de titulares más anchos (+3 % a
  40 px, peor en 320 px) y de perder la geometría que acompaña al wordmark.
- Cambiar implica tocar `layout.tsx`, la imagen OG (`@fontsource/outfit`), el preload manual
  (`fuente.ts` + `e2e/rendimiento.spec.ts`) y volver a medir el CLS, que hoy es 0. No se justifica.
- Debilidad conocida de Outfit: `I`, `l` y `1` se parecen. Mitigación: números siempre `tabular` y
  nada de códigos o claves mezclando esas letras en pantalla.

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
- **Plano** (`ilustracion/plano/`, dirección Plano): `FondoPlano({ variante?: 'grilla' | 'cotas', className? })`
  e `IlustracionPlano({ escena: 'hero' | 'como-funciona' | 'cierre', className? })`. Grilla de 16/64 px,
  cotas con flechas y rótulo mudo, ejes raya-punto, rayado de corte, anotaciones sin texto y marcas de
  registro pegadas a las esquinas. Trazo fino que no engorda al escalar (`non-scaling-stroke`), todo en
  `currentColor` con opacidades (`TINTA_PLANO`) y una sola pieza en Brasa (`text-plano-pieza`). Las
  escenas usan un lienzo 1000 × 1000 con `slice`: lo importante está en la zona segura
  (`LIENZO_PLANO.zonaSegura`), que se ve entera de 9:19,5 a 16:9. Solo `hero` se mueve (la pieza viaja
  desde su fantasma y encastra, `ilus-plano-encaja`, una vez); quieta con movimiento reducido.

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
- **Kinetic type** (dirección Plano; lo usa `TituloEncastre` de `src/components`): cada palabra del
  titular llega alternando desde abajo y desde arriba, desplazada `--desplazamiento-palabra` (0,42 em)
  y a `--escala-palabra` (0,94); se pasa `--asiento-palabra` (0,04 em) y el sobrepaso del snap; asienta
  en `--duration-slow` con `--ease-out`, separadas por `--paso-palabra` (60 ms). Tope de 8 palabras
  escalonadas: `duracionTitulo(8)` = 940 ms. Exports de `presets.ts`:
  - `encastrePalabra(i, reducido?)` → `{ initial, animate, transition }` para `<m.span>` (con
    `reducido` aparece en su lugar, duración 0).
  - `ENCASTRE_PALABRA` (`clase: 'palabra-encastre'`, duraciones, escalas, tope) y `estiloPalabra(i)`
    (`--i`, `--lado`) para la versión CSS sin JS (`motion.css`), la recomendada para el h1.
  - `ladoPalabra(i)`, `ordenPalabra(i)`, `duracionTitulo(n)`, `PASO_PALABRA_MS`.
  - Uso: `<span className={ENCASTRE_PALABRA.clase} style={estiloPalabra(i)}>{palabra}</span>{' '}`;
    el h1 conserva el texto real.
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
| Plano (blueprint)                                         | `src/brand/ilustracion/plano/` (`FondoPlano`, `IlustracionPlano`)    |
| Fondos de sección y su contraste                          | `semanticos.ts` (`SECCIONES`, `SUPERFICIES`), `colores.ts`           |
| Dirección Plano (reglas y prohibidos)                     | `.claude/skills/webya-plano/SKILL.md`                                |
| Favicon y app icon                                        | `src/app/icon.svg`, `src/app/apple-icon.tsx`                         |
| Logo suelto e Instagram (avatar, 5 destacadas, SVG + PNG) | `docs/marca/` ← `pnpm marca:exportar` (`scripts/exportar-marca.mjs`) |
| Vitrina del sistema                                       | `/sistema` (`src/app/sistema`, textos en `src/content/sistema.ts`)   |
| Comparador de paletas                                     | `/marca`                                                             |

`src/brand` no importa de `features`, `components` ni `content` (lo verifica `tests/arquitectura`).
