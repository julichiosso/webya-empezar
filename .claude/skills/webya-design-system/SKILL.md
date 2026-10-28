---
name: webya-design-system
description: Fuente de verdad visual de WebYa (/empezar). Usala SIEMPRE antes de crear o tocar UI, estilos, íconos SVG o animaciones; define tokens, tipografía, espaciado, estados de componentes, presupuesto de animación y qué NO hacer.
---

# WebYa — Sistema de diseño

Dirección: **fintech-grade**. Confianza, claridad, precisión, cero fricción. Blanco y negro de marca + **un solo acento (verde menta)**. Cada espaciado y transición debe verse intencional, no de plantilla. Complementa a la skill `frontend-design` (plugin): gastá el riesgo visual en **un solo lugar** (el hero que se arma por bloques) y mantené el resto sobrio.

## 1. Tokens (viven en `src/app/globals.css`; nunca valores sueltos)

| Grupo      | Token (utilidad Tailwind)                                      | Dark (default)               | Uso                                         |
| ---------- | -------------------------------------------------------------- | ---------------------------- | ------------------------------------------- |
| Fondo      | `bg-bg`                                                        | `#0b0b0c`                    | Fondo de página                             |
| Superficie | `bg-surface`, `bg-surface-2`                                   | `#131316`, `#1a1a1e`         | Tarjetas, paneles, inputs                   |
| Línea      | `border-line`, `border-line-strong`                            | blanco 10% / 20%             | Bordes de 1px                               |
| Texto      | `text-fg`, `text-muted`, `text-subtle`                         | `#fff`, `#a1a1a6`, `#8a8a90` | Principal, secundario, terciario (todos AA) |
| Acento     | `bg-accent`, `text-accent`, `text-accent-fg`, `bg-accent-soft` | `#34e5a1` (TODO confirmar)   | **Solo** CTA, foco, éxito                   |
| Error      | `text-danger`                                                  | `#ff7a7a`                    | Errores de validación                       |

- Modo claro: `<html data-theme="light">`. Los tokens se redefinen solos; no escribas `dark:`.
- El acento NO se usa en títulos, bordes decorativos ni fondos grandes. Si dudás, no lo uses.
- Prohibido `#hex`, `rgb()` o `px` sueltos en componentes. Si falta un valor, agregá un token.

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

Momentos diseñados (el resto del sitio queda quieto): hero que ensambla módulos; transición entre pasos (desplazamiento + fade); selección de tarjeta con spring y check dibujado; chips del paso 2 en cascada; botón de envío → check; confirmación que ensambla los módulos; revelado de secciones al scroll (un único `Reveal` sobrio, sin parallax, no en cada elemento).

### Cómo crear una animación nueva

1. ¿Responde a una acción del usuario o comunica un cambio? Si es decorativa, probablemente no va.
2. Definí solo `transform`/`opacity`. Usá `m.div` dentro de `LazyMotion`.
3. Reservá el espacio final (sin layout shift).
4. Agregá la variante estática para `prefers-reduced-motion`.
5. Si corre en loop: pausala fuera de pantalla y con pestaña oculta.
6. Medí: CPU ×4, CLS y peso JS (ver `webya-qa-checklist`).

## 5. Qué NO hacer

- Sellos de seguridad, logos de clientes, testimonios, métricas o precios inventados. Usá `TODO:` visible.
- Plantilla SaaS: tarjetas idénticas en serie con sombra gris, gradientes decorativos, emoji como íconos, “→” en todos los botones.
- Fade-up en cada sección, hovers animados en cada tarjeta, parallax.
- Más de un color de acento. Texto sobre acento sin `text-accent-fg`.
- Quitar el foco, bloquear el zoom, ocultar errores solo con color.
- Copy en español neutro: usamos voseo rioplatense (“contanos”, “armá”, “creá”). Botones con verbo concreto (“Empezar”, “Hablar por WhatsApp”).

## 6. Checklist rápido al terminar una pieza de UI

- [ ] Sin valores sueltos (todo token). [ ] Pasos pares de 8px. [ ] Touch ≥ 48px. [ ] Estados completos.
- [ ] Contraste AA en dark y light. [ ] Foco visible. [ ] Reduced motion resuelto. [ ] Sin layout shift.
