# Sistema de ilustración de WebYa

Todo el arte de la marca es SVG propio, inline, en este directorio. Cero librerías de íconos, cero
stock. Un solo lenguaje, **Encastre**, y dos grillas. Las medidas viven en código, en
[`grilla.ts`](grilla.ts), y los tests las verifican: este archivo explica el porqué.

## Las dos grillas

|                    | Íconos (`iconos/`)                     | Dibujos (`dibujos/`)                                   |
| ------------------ | -------------------------------------- | ------------------------------------------------------ |
| Lienzo             | 24 × 24 (`GRILLA_ICONO`)               | 96 × 96 (`GRILLA_DIBUJO`)                              |
| Zona viva          | [2, 22]                                | [8, 88]                                                |
| Trazo              | 1,5                                    | 2                                                      |
| Extremos y uniones | redondos                               | redondos                                               |
| Relleno            | ninguno                                | como máximo un token de color además de `currentColor` |
| Radios             | 1 en piezas chicas, 2 en las grandes   | 2 chicos, 6 grandes                                    |
| Muesca             | radio 1,5                              | radio 6 (piezas ≥ 40), 3 (piezas chicas)               |
| Precisión          | un decimal (salvo el punto `v.01`)     | entero o un decimal                                    |
| Para qué           | rubros, módulos, necesidades, interfaz | platos de ejemplo, estados (vacío, 404, error, carga)  |

- Los íconos son solo `<path>`, para que el dibujado de `Icon draw` (`stroke-dashoffset`, ver abajo)
  se vea igual en todos. Las formas base están en `grilla.ts`: `circulo`, `rectangulo`, `conMuesca`
  y `circuloPunteado`.
- El arte de módulos (`modulos/ModuloArte.tsx`) es un tercer formato, de banda: 160 × 64, sin trazo,
  con rellenos planos (`fill-line`, `fill-line-strong`; encendido, `fill-accent` y
  `fill-accent-soft`). Se usa en la mini web del hero y del panel de vista previa.

## Encastre: el lenguaje

> Tu negocio se arma pieza por pieza, y cada pieza hace clic.

Tres formas, siempre las mismas:

1. **La muesca.** Un semicírculo hacia adentro en el centro del borde de arriba: el ticket colgado
   del riel. Es la misma forma que la clase `.encastre` de CSS. Aparece en la comanda (`pedidos`,
   `ticket`), en las piezas del tablero (404) y en los huecos de los estados.
2. **El hueco punteado.** Lo que falta se dibuja con la forma de lo que falta, punteado y en el gris
   de línea (`ENCASTRE.hueco` → `stroke-hueco-borde`, punteado `4 5` en la grilla 96). En íconos, el
   punteado son tramos reales (`circuloPunteado`) y no `stroke-dasharray`, para no romper el
   dibujado.
3. **La pieza que encaja se tiñe de acento.** `ENCASTRE.pieza` → `fill-pieza-encajada` (Brasa).
   Apagado = gris de línea; encajado = acento. Nunca al revés: una pieza suelta o rota no lleva
   acento. El error usa el rosa frío (`ENCASTRE.aviso` → `stroke-danger`), nunca Brasa.

## Color

- Nunca hex, `rgb()` ni `hsl()`: el trazo es `currentColor` (lo pinta el texto que lo rodea) y los
  tonos son clases de tokens (`src/brand/tokens`). El test de íconos lo verifica en toda la carpeta
  y que los tokens del Encastre existan en `tokens.css`.
- Dos tonos como máximo por dibujo (contando `currentColor`). Sin degradés, sombras, filtros ni texto
  adentro.

## Accesibilidad

- Decorativo (lo normal: el texto está al lado) → `aria-hidden="true"`.
- Con significado → se pasa `title` por props: el SVG queda con `role="img"` y un `<title>`. El texto
  vive en `src/content`, nunca acá.

## Movimiento

- Solo `transform` y `opacity` ([`movimiento.css`](movimiento.css); un test revisa los keyframes).
  El "snap": la pieza llega, se pasa apenas (≈ 2 %) y asienta.
- `stroke-dashoffset` (el trazo que se dibuja) solo en íconos de 24 o menos, una vez, al
  seleccionar (`<Icon draw active />`). Es la única excepción del presupuesto.
- Siempre con versión quieta para `prefers-reduced-motion`: el spinner queda con la pieza puesta y
  el dibujo `cargando` muestra la primera pieza encajada y los otros dos huecos.

## Qué hay y cómo se usa

| Export                                                                | Desde                     | Qué es                                                        |
| --------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------- |
| `Icon`                                                                | `iconos/Icon.tsx`         | `<Icon name="pedidos" draw active title?>`                    |
| `ICONS`, `RUBRO_ICONS`, `MODULO_ICONS`, `NECESIDAD_ICONS`, `UI_ICONS` | `iconos/paths.ts`         | Los trazos, por grupo                                         |
| `ICONO_DE_NECESIDAD`                                                  | `iconos/paths.ts`         | Sugerencia de ícono por necesidad (content puede elegir otro) |
| `Ilustracion`                                                         | `dibujos/Ilustracion.tsx` | `<Ilustracion id="vacio" size={96} title?>`                   |
| `ILUSTRACIONES`, `ESTADOS`, `DIBUJO_IDS`                              | `dibujos/ids.ts`          | Ids de platos, de estados y de todos                          |
| `ModuloArte`, `ARTES_MODULO`, `ArteModulo`                            | `modulos/`                | Arte de banda por módulo                                      |
| `Cargando`                                                            | `Cargando.tsx`            | Spinner Encastre (grilla 24, `currentColor`)                  |
| `ICONOS`, `DIBUJOS`                                                   | `index.ts`                | Listados con grupo, para recorrer todo (vitrina de /sistema)  |

**Brand define el vocabulario, `content` elige.** Los ids de íconos, dibujos y artes son de brand;
`content` dice cuál usa cada rubro, módulo o necesidad. Brand nunca importa de `content`.

## Agregar un ícono o un dibujo

1. Dibujalo en la grilla que corresponde, con las formas de `grilla.ts`.
2. Sumalo al grupo (`paths.ts`) o al registro (`dibujos/ids.ts` + `platos.tsx` o `estados.tsx`).
   TypeScript exige que cada id tenga su dibujo.
3. `pnpm vitest run src/brand/ilustracion`: zona viva, trazo, viewBox, tonos y colores.
