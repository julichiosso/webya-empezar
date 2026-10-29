---
name: webya-brand
description: Marca de WebYa — concepto "Encastre", paleta Brasa/crema/negro, voz rioplatense y reglas de uso del logo, la ilustración y el movimiento. Usala antes de escribir copy, diseñar una pantalla nueva, dibujar una ilustración o un estado vacío, o decidir dónde va el color de acento.
---

# WebYa — Marca

Complementa a `webya-design-system` (tokens, componentes, presupuesto de animación). Esta skill dice **qué queremos transmitir**; la otra, **cómo se implementa**.

## 1. Concepto: Encastre

> Tu negocio se arma pieza por pieza, y cada pieza hace clic.

Es lo que hace el producto: la persona activa módulos (carta, pedidos, turnos, pagos) y encajan en su negocio. Sirve igual para una pizzería que para una peluquería.

**Guiño "Prendido":** la pieza que encaja **se tiñe de Brasa**. Apagado = gris de línea; encajado = borde y fondo de acento + check. Nunca al revés.

Dónde se ve (y solo ahí: el riesgo visual se gasta en pocos momentos):

| Lugar          | Cómo                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Logo           | El wordmark **actual** (5 trazos) entra en piezas y "asienta" en su lugar, **una vez** (`<Logo armar />`). Sin isotipo nuevo. |
| Movimiento     | "Snap": la pieza llega, se pasa apenas (≈ 2 %) y asienta. Solo `transform`/`opacity`, 280 ms, `--ease-out`.                   |
| Estados vacíos | Un hueco con contorno punteado con la forma de lo que falta + una frase: "Acá encaja tu primer pedido".                       |
| Papel (crema)  | Comandas, tickets y tarjetas de pedido van en `bg-paper` con la muesca `.encastre` (ticket colgado del riel).                 |
| Selección      | Hueco punteado → la pieza Brasa con check cae y asienta (componente `Encaje`). Es el "clic", una vez.                         |
| Composición    | Riel punteado que enhebra pasos y tablero de piezas en un panel, en vez de tarjetas iguales sueltas.                          |
| Copy           | "Encajá lo que te falta", "Le faltaba esto", "Sumá una pieza". Con medida: no en cada título.                                 |

## 2. Paleta

| Rol            | Token                       | Valor     | Uso                                                                           |
| -------------- | --------------------------- | --------- | ----------------------------------------------------------------------------- |
| Acento (Brasa) | `bg-accent` / `text-accent` | `#ff5b24` | CTA, foco, selección, pieza encajada. **Nada más.**                           |
| Texto en botón | `text-accent-fg`            | `#0b0b0c` | Siempre negro sobre Brasa (blanco da 3,1:1: no pasa).                         |
| Acento tinta   | `text-accent-ink`           | `#b83a0e` | Texto o foco de acento **sobre papel crema** (Brasa ahí da 2,66:1).           |
| Crema (papel)  | `bg-paper`, `text-paper-fg` | `#f4ede1` | Comandas, tickets, tarjetas de pedido. No como fondo de página.               |
| Negro base     | `bg-bg`                     | `#0b0b0c` | Fondo de página (tema oscuro por defecto).                                    |
| Error          | `text-danger`               | `#ff6b8a` | Rosa frío para no confundirse con Brasa. Siempre con texto, nunca solo color. |

- Valores en `src/brand/tokens/primitivos.ts` → `semanticos.ts` → `componentes.ts`; el CSS se genera (`pnpm tokens`) y `colores.ts` da la vista plana para OG, `themeColor` y `/marca`. `src/brand/tokens/marca.test.ts` verifica que el CSS resuelva a esos colores, que **cada combinación pase AA** y que no haya hex sueltos ni restos del acento anterior.
- `/marca` (noindex) compara Brasa con Mostaza y Frambuesa sobre el hero y una tarjeta de pedido, con el contraste medido.
- Un contenedor puede cambiar de paleta redefiniendo las variables (`variablesDePaleta()`); así funciona la personalización de las demos.
- Contenido sobre papel: el contenedor lleva la clase `papel` (el foco pasa a `--accent-ink`).

## 3. Voz

Rioplatense, directa, cálida, con humor liviano. Hablamos como alguien del barrio que sabe de tecnología, no como un banco ni como una startup.

- **Voseo siempre:** creá, activá, armá, elegí, tocá, sumá, probá. Nunca "crea", "tú", "usted".
- **Verbos de acción** en botones: "Quiero esto para mi local", "Probalo en tu celular", "Pedí". Un verbo por botón.
- **Humor liviano** en estados vacíos, confirmaciones y detalles chicos ("Todavía no entró nada. Ya va a picar."). **Nunca** en errores, pagos, datos personales ni a costa de quien usa.
- **Cero promesas que el producto no cumple:** la entrega es manual; las demos usan datos de ejemplo y lo dicen. Sin precios, plazos, testimonios, clientes, métricas ni sellos inventados (`TODO:` visible).

| Sí                                                         | No                                              |
| ---------------------------------------------------------- | ----------------------------------------------- |
| "Activá lo que necesitás."                                 | "Potenciá tu negocio con soluciones digitales." |
| "Acá encaja tu primer pedido."                             | "No hay datos para mostrar."                    |
| "Te escribimos en menos de 24 hs."                         | "Tu web lista en minutos."                      |
| "Demo con datos de ejemplo. No se cobra ni se envía nada." | (esconder que es una demo)                      |

## 4. Logo

- Solo el wordmark de `public/webya-logo.svg`. No hay isotipo. No se deforma, no se recorta, no se le agregan efectos.
- Color: negro sobre claro, blanco (invertido por CSS, `.logo`) sobre oscuro. Nunca en Brasa.
- Animación: la de "encastre" (sección 1), una sola vez, con versión estática en reduced-motion.

## 5. Ilustración propia (SVG inline)

- Íconos: grilla 24×24, trazo 1,5, sin relleno, extremos redondos (ver `src/brand/ilustracion/iconos/paths.ts`).
- Ilustraciones (platos, rubros, estados vacíos): grilla 96×96, **trazo 2**, extremos redondos, como máximo dos tonos planos (`currentColor` + acento). Sin degradés, sin sombras, sin texto adentro.
- Decorativas → `aria-hidden="true"`. Si comunican → `role="img"` + `<title>`.

## 6. Prohibido (lo genérico)

- Degradés violeta/azul "de IA", glassmorphism, glows grandes.
- Tres tarjetas iguales en fila como única composición de una sección.
- Íconos de librería sin adaptar, stock photos, emojis como decoración principal.
- Acento en títulos, bordes decorativos o fondos grandes. Más de un acento a la vez.

## 7. Checklist de marca

- [ ] ¿El concepto aparece donde suma (no en todos lados)?
- [ ] ¿El acento está solo en CTA, foco, selección o pieza encajada?
- [ ] ¿Texto de acento sobre crema usa `text-accent-ink`?
- [ ] ¿Copy en voseo, con verbo, sin promesas falsas y con el humor en el lugar correcto?
- [ ] ¿Ilustraciones propias, con la grilla y el trazo de la sección 5?
