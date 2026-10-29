---
name: webya-design-system
description: Fuente de verdad visual de WebYa (/empezar). Usala SIEMPRE antes de crear o tocar UI, estilos, íconos SVG o animaciones; define tokens, tipografía, espaciado, estados de componentes, presupuesto de animación y qué NO hacer.
---

# WebYa — Sistema de diseño

Dirección: **fintech-grade** con personalidad. Confianza, claridad, precisión, cero fricción. Negro base + papel crema + **un solo acento (Brasa)**. Cada espaciado y transición debe verse intencional, no de plantilla. El concepto ("Encastre"), la voz y el uso del color están en la skill **`webya-brand`**: leela antes de diseñar. Gastá el riesgo visual en pocos momentos memorables y mantené el resto sobrio.

## 1. Tokens (viven en `src/app/globals.css`; nunca valores sueltos)

| Grupo        | Token (utilidad Tailwind)                                            | Dark (default)                     | Uso                                                                  |
| ------------ | -------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| Fondo        | `bg-bg`                                                              | `#0b0b0c`                          | Fondo de página                                                      |
| Superficie   | `bg-surface`, `bg-surface-2`                                         | `#131316`, `#1a1a1e`               | Tarjetas, paneles, inputs                                            |
| Línea        | `border-line`, `border-line-strong`                                  | blanco 10% / 20%                   | Bordes de 1px                                                        |
| Texto        | `text-fg`, `text-muted`, `text-subtle`                               | `#fff`, `#a1a1a6`, `#8a8a90`       | Principal, secundario, terciario (todos AA)                          |
| Acento       | `bg-accent`, `text-accent`, `text-accent-fg`, `bg-accent-soft`       | `#ff5b24` (Brasa), texto `#0b0b0c` | **Solo** CTA, foco, selección, pieza encajada                        |
| Acento tinta | `text-accent-ink`                                                    | `#b83a0e`                          | Texto/foco de acento **sobre papel crema**                           |
| Papel        | `bg-paper`, `text-paper-fg`, `text-paper-muted`, `border-paper-line` | `#f4ede1`, `#0b0b0c`, `#5e574f`    | Comandas, tickets, tarjetas de pedido (contenedor con clase `papel`) |
| Error        | `text-danger`                                                        | `#ff6b8a`                          | Errores de validación (rosa frío ≠ Brasa)                            |

- Modo claro: `<html data-theme="light">`. Los tokens se redefinen solos; no escribas `dark:`.
- El acento NO se usa en títulos, bordes decorativos ni fondos grandes. Si dudás, no lo uses. Sobre Brasa el texto va **negro** (`text-accent-fg`): el blanco no llega a AA.
- Prohibido `#hex`, `rgb()` o `px` sueltos en componentes. Si falta un valor, agregá un token. Los valores viven en `globals.css` y se repiten en `src/config/marca/colores.ts` solo para lo que no lee CSS; `marca.test.ts` falla si aparecen hex sueltos, restos del acento anterior o una combinación debajo de AA.
- Una paleta distinta en un contenedor (demos personalizadas, `/marca`): redefinir las variables con `variablesDePaleta()`; nunca colores en línea en los componentes.

### Tipografía (Outfit, `next/font`)

- `text-display` (hero, 600, tracking -0.045em), `text-title` (secciones, 600), `text-heading` (500–600), `text-lead` (subtítulos), `text-body` (16px mínimo), `text-small`.
- Títulos: `font-semibold`, `text-balance`. Cuerpo: `font-normal`, líneas < 70 caracteres.
- Números (precios, plazos, progreso, teléfonos): clase `tabular` (`tabular-nums`).
- Inputs SIEMPRE ≥ 16px (si no, iOS hace zoom).
- Sin MAYÚSCULAS en etiquetas, sin “eyebrows” sobre cada título, sin numeración salvo secuencias reales (el “Cómo funciona” sí lo es).

### Espaciado y forma

- Grilla de **8px**: usá solo pasos pares de Tailwind (`p-2`=8, `p-4`=16, `p-6`=24, `p-8`=32…). Nunca `p-1`, `p-3`, `p-5` salvo ajuste óptico justificado en comentario.
- Radios por jerarquía: `rounded-control` (inputs/botones, 12px) < `rounded-card` (tarjetas, 16px) < `rounded-panel` (paneles, 24px). No uses un mismo radio para todo.
- Altura táctil mínima `min-h-tap` (48px) en todo lo clickeable. Una columna, pulgar-first.
- Superficies: borde 1px `border-line` + `shadow-raised`. Nada de sombras pesadas, glows ni degradés estridentes. Gradientes solo muy suaves (≤ 8% de opacidad).

## 2. Componentes: estados obligatorios

Cada componente interactivo implementa **default, hover, focus-visible, active, disabled, loading, error, success** (los que apliquen). Reglas:

- Feedback < 100 ms al toque: `active:scale-[0.98]` (transform) o cambio de opacidad inmediato.
- Foco: el global (`outline` acento 2px, offset 3px). No lo quites; no uses `outline-none` sin reemplazo.
- Hover solo bajo `@media (hover: hover)` para no dejar estados pegados en táctil.
- Errores: texto específico y amable + `aria-live="polite"`, nunca solo color.
- Tarjetas seleccionables: `role="radio"`/`checkbox` dentro de `radiogroup`/`group`, `aria-checked`, navegables con flechas/Espacio.

## 3. SVG propio

- Todo arte es SVG inline propio (sin PNG/JPG para ilustración). Íconos: grilla 24×24, `stroke="currentColor"`, `stroke-width` 1.5, `linecap`/`linejoin` redondos, `fill="none"`. Un set consistente: mismo trazo, mismas esquinas.
- `aria-hidden="true"` si es decorativo; si comunica algo, `role="img"` + `<title>`.
- Dibujo de trazo (`stroke-dashoffset`) **solo** en íconos ≤ 24px, una vez, al seleccionar. Es una propiedad de pintado, no de composición: es la única excepción del presupuesto y se documenta aquí.

## 4. Presupuesto de animación (obligatorio)

1. Animar **solo `transform` y `opacity`** (excepción: el dashoffset de arriba). Prohibido animar `width/height/top/left/margin`, `blur` pesado y filtros SVG (`feTurbulence`, `feGaussianBlur`…). El grano de fondo es estático.
2. Objetivo 60 fps en Android de gama media (probar con CPU throttling ×4).
3. Elementos fuera de pantalla se pausan (`IntersectionObserver`); nada corre con la pestaña oculta (`document.visibilityState`).
4. Lo que no está en el primer viewport se carga diferido (`next/dynamic`, `IntersectionObserver`).
5. `prefers-reduced-motion`: versión **estática equivalente** (sin perder información). `useReducedMotion()` de `motion` o la regla global de CSS.
6. Librería: `motion` con `LazyMotion` + `domAnimation` y componentes `m.*` (no `motion.*`) para minimizar JS. Lottie solo si SVG no alcanza, y diferido.
7. Presupuesto de JS de la ruta: **< 150 KB gzip**. CLS < 0.05: reservar espacio (`aspect-ratio`, alturas fijas) para todo lo animado.
8. Duraciones: instantáneo 100ms, rápido 160ms, base 280ms, lento 520ms. Curva `--ease-out`. Resortes (`spring`) solo para selección de tarjetas.
9. Si el “wow” compromete performance o accesibilidad, **gana la performance**: simplificar y avisar.

Momentos diseñados (el resto del sitio queda quieto), todos en el lenguaje "Encastre" (la pieza llega, se pasa apenas y asienta; ver `webya-brand`):

- **Logo que se arma** (`<Logo armar />`, solo en el header de `/empezar`): las 5 letras del wordmark entran alternando arriba/abajo y asientan, **una vez**. Es SVG inline de servidor (`components/logo-trazos.ts`, generado desde `public/webya-logo.svg`): cero JS.
- **Hero que se arma una sola vez** (`.hero-piece`, con un leve rebote al asentar). Sus tarjetas se activan al tocarlas con un "clic" (`@keyframes clic`: baja apenas a su lugar) y nunca en loop: tienen botones.
- **La pieza que encaja** (`components/ui/Encaje.tsx`): hueco punteado → pieza Brasa con check que cae y asienta (`@keyframes encajar`). Es el único indicador de selección: tarjetas del hero, rubros (radio), módulos (checkbox) y chips. No dupliques checks a mano.
- **Estados vacíos = huecos punteados** (`border-dashed border-line-strong`) con la forma de lo que falta, más una frase ("Acá encajan tus módulos"). Lo encendido deja de ser hueco: borde y fondo de acento.
- **Riel punteado** que enhebra pasos ("Cómo funciona") y **tablero de piezas** (un panel con divisiones de 1 px, gap sobre `bg-line`) en vez de tarjetas iguales sueltas.
- **Video explicativo** (`features/explicativo`): motion graphics en SVG, clases `.mg-entra/encaja/pop/desliza/sale/recorre/pulso` con `--d` (demora). Posición en un `<g transform>` exterior y animación en uno interior (si no, el transform CSS pisa la posición). Una vez por escena (se remonta con `key`), quieto con reduced-motion, y se descarga recién al tocar "Mirá cómo funciona".
- Transición entre pasos (desplazamiento + fade); chips del paso 2 en cascada; botón de envío → check; confirmación que ensambla los módulos; revelado de secciones al scroll (un único `.reveal` sobrio, sin parallax).

### Cómo crear una animación nueva

1. ¿Responde a una acción del usuario o comunica un cambio? Si es decorativa, probablemente no va.
2. Definí solo `transform`/`opacity`. Usá `m.div` dentro de `LazyMotion`.
3. Reservá el espacio final (sin layout shift).
4. Agregá la variante estática para `prefers-reduced-motion`.
5. Si corre en loop: pausala fuera de pantalla y con pestaña oculta.
6. Medí: CPU ×4, CLS y peso JS (ver `webya-qa-checklist`).

### Elementos interactivos que se animan (hero y selecciones)

- Si se puede tocar, es un `<button aria-pressed>` (activar/desactivar) o un `<input>` nativo (checkbox/radio dentro de `<label>`). Nunca un `<div onClick>` ni un SVG con `role="button"`.
- Un elemento interactivo **nunca desaparece ni se mueve en loop**. Animá la entrada una vez y el cambio de estado ("clic" de `transform` y la pieza de `Encaje` con `opacity`/`transform`).
- Nunca pongas `mask` sobre algo enfocable: la máscara también recorta el anillo de foco. La muesca `.encastre` va solo en superficies no interactivas (papel, comandas).
- El estado activo se distingue por borde + fondo + check (forma), no solo por color ni atenuando el texto (el contraste AA se mide con la opacidad real).
- Una pista efímera ("Tocá para activar") es texto, vive en una región `aria-live="polite"` con altura reservada y se desmonta con un timer. Con reduced-motion se muestra igual, sin movimiento.
- El estado compartido entre árboles (hero ↔ wizard) vive en `features/empezar/modulos-store.ts`: se guarda **solo lo decidido a mano**; lo demás se deriva del rubro. Así no hay módulos "fantasma" al cambiar de rubro.

## 5. Qué NO hacer

- Sellos de seguridad, logos de clientes, testimonios, métricas o precios inventados. Usá `TODO:` visible.
- Plantilla SaaS: tarjetas idénticas en serie con sombra gris, gradientes decorativos, emoji como íconos, “→” en todos los botones.
- Fade-up en cada sección, hovers animados en cada tarjeta, parallax.
- Más de un color de acento. Texto sobre acento sin `text-accent-fg`.
- Quitar el foco, bloquear el zoom, ocultar errores solo con color.
- Copy en español neutro: usamos voseo rioplatense (“contanos”, “armá”, “creá”). Botones con verbo concreto (“Empezar”, “Hablar por WhatsApp”).

## 5b. Copy y posicionamiento ("Creá vos")

Recorrido de marca: **Creá** (armás lo que necesitás) → **Digitalizá** (queda online) → **Crecé** (clientes y métricas). Slogan: "Creá. Digitalizá. Crecé." Tagline: "Tu negocio. Nuestra tecnología."

- **Voseo rioplatense** siempre: creá, activá, armá, elegí, contanos, tocá. Nunca "crea", "elige", "tú".
- **Verbos de acción** en botones y títulos: "Empezar a crear", "Activá solo lo que necesitás", "Hablar por WhatsApp". Un solo verbo por botón; sin "Click aquí" ni flechas decorativas.
- **No decir "contanos y te armamos" como promesa central**: el usuario es quien crea; nosotros ejecutamos. Sí se puede pedir datos ("Contanos de tu negocio").
- **Cero promesas que el producto no cumple.** Hoy NO existe una plataforma de autoservicio: el armado y la entrega los hacemos nosotros, con una persona. Se dice así ("Lo armamos nosotros", "Te escribimos en menos de 24 hs para ponerlo online"). Prohibido: "tu negocio ya está online", "listo en minutos", "publicá ahora", métricas o paneles que no existen.
- **Sin inventar** precios, plazos de entrega, testimonios, métricas, clientes ni sellos. Lo único comprometido es el primer contacto (< 24 hs). Todo lo demás: `TODO:` en el código y, en pantalla, "te armamos un presupuesto sin compromiso".
- Nombre de módulos: lenguaje no técnico y siempre el del catálogo (`config/modulos.ts`): "Tienda y catálogo", no "Catálogo" ni "E-commerce".
- Errores amables y específicos ("Revisá el número: tiene que ser de Argentina, por ejemplo 11 2345 6789"); nunca culpar al usuario ni mostrar mensajes técnicos.
- Al cambiar el copy: actualizá `config/faq.ts`, metadata/OG, tests (unit, componente y E2E) y las capturas visuales.

## 6. Checklist rápido al terminar una pieza de UI

- [ ] Sin valores sueltos (todo token). [ ] Pasos pares de 8px. [ ] Touch ≥ 48px. [ ] Estados completos.
- [ ] Contraste AA en dark y light. [ ] Foco visible. [ ] Reduced motion resuelto. [ ] Sin layout shift.
- [ ] Copy en voseo, con verbo de acción y sin promesas que el producto no cumple (sección 5b).
