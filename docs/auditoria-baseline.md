# Auditoría baseline — `/empezar` (antes del sprint "Base de marca y frontend")

Fecha: 2026-10-29 · Commit medido: `f02db48` (main) · Build de producción local (`next build && next start -p 3100`),
con el entorno de E2E (`LEAD_REPOSITORY=file`, sin Supabase). Este documento es el "antes" contra el que se compara
`docs/reporte-sprint.md`.

> Nota: el brief del sprint toma como referencia `406c55f`/`3769f98` (JS inicial 140,6 KB). Desde entonces se sumaron
> la demo de Gastronomía, el video explicativo, la entrada con el logo y las secciones de confianza: el baseline real
> es el de `f02db48`.

## 1. Lighthouse (sin performance; Chrome DevTools MCP)

| Categoría | Móvil | Escritorio |
|---|---|---|
| Accesibilidad | 100 | 100 |
| Buenas prácticas | 100 | 100 |
| SEO | 100 | 100 |
| Navegación agéntica | 100 | 100 |

51 auditorías pasadas, 0 fallidas en ambos.

## 2. Carga — CPU ×4 + Slow 4G, celular 390×844 @3x (traza de Chrome DevTools)

| Métrica | Valor |
|---|---|
| LCP (lab) | **1763 ms** — elemento: subtítulo del hero ("Elegí tu rubro. Activá lo que necesitás.") |
| · TTFB | 10 ms |
| · Render delay | 1753 ms |
| CLS | 0.00 |
| CSS bloqueante | 1 hoja (`*.css`), 855 ms en la red; ahorro estimado **574 ms** de FCP/LCP |
| Otros insights | DOMSize, ForcedReflow, LegacyJavaScript (14 kB de polyfills), cadena de requests críticos |

Sin throttling (Playwright, 6 viewports, carga + scroll completo): CLS 0.0000 en todos; LCP 96–168 ms.

| Viewport | CLS | LCP | Alto de página |
|---|---|---|---|
| iPhone SE | 0.0000 | 124 ms | 6969 px |
| iPhone 15 | 0.0000 | 96 ms | 6393 px |
| Pixel 7 | 0.0000 | 144 ms | 6324 px |
| Tablet (iPad Mini) | 0.0000 | 152 ms | 6011 px |
| 1440 | 0.0000 | 168 ms | 4650 px |
| 1920 | 0.0000 | 152 ms | 4650 px |

## 3. Interacción y movimiento — CPU ×4, Pixel 7 emulado (Playwright + CDP)

Frames medidos con `requestAnimationFrame`; "lento" = frame de más de 25 ms.

| Escena | Frames | Lentos | Peor | p95 |
|---|---|---|---|---|
| Entrada (logo que se escribe + hero), 3 s | 178 | 0 (0,0 %) | 17 ms | 16,7 ms |
| Scroll por toda la página (reveals) | 172 | 2 (1,2 %) | 50 ms | 16,8 ms |
| Wizard: elegir rubro + tildar 4 módulos | 256 | 4 (1,6 %) | **150 ms** | 16,8 ms |

**INP** (peor interacción del wizard): **168 ms** al elegir el rubro (la primera; luego 72, 32–40 y 24 ms).
Está dentro de "bueno" (< 200 ms) pero lejos de la meta de micro-feedback < 100 ms.

## 4. JavaScript por ruta (gzip nivel 9, celular)

| Ruta | Inicial | Tras interacción | Archivos |
|---|---|---|---|
| `/empezar` | **144,0 KB** | 224,7 KB (con el wizard cargado) | 10 |
| `/demo/gastronomia` | 192,2 KB | 207,3 KB (panel del dueño) | 13 |
| `/marca` | 132,5 KB | 132,5 KB | 6 |

Presupuesto: `/empezar` ≤ 150 KB inicial → quedan **6,0 KB** de margen.

## 5. Capturas "antes" (6 viewports)

En [`docs/auditoria/antes/`](auditoria/antes/): `empezar-<viewport>-pliegue.png` (primer viewport) y
`empezar-<viewport>-completa.png` (página entera) para iPhone SE, iPhone 15, Pixel 7, tablet, 1440 y 1920.

## 6. Seguridad y configuración

- Headers actuales (`next.config.ts`): `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
  `Permissions-Policy`. **Falta CSP** (y `Strict-Transport-Security` lo pone Vercel).
- **`pnpm dev` escribe en Supabase real**: `env.ts` elige `supabase` cuando `LEAD_REPOSITORY` lo pide o hay
  credenciales, también en desarrollo, y el `.env` local tiene `LEAD_REPOSITORY=supabase` (verificado sin leer
  valores). Hay que forzar repositorio en memoria en desarrollo salvo opt-in explícito.
- `.env` está en `.gitignore` (no versionado).

## 7. Inventario de código (subagente de solo lectura)

Repo: `webya-empezar` @ `f02db48` (main, árbol limpio). 152 archivos en `src/` (~15.0 k líneas), 114 sin contar tests.
Método: ripgrep/grep + dos scripts de AST (TypeScript compiler API) para el copy y el grafo de imports. No se tocó el repo.

---

### 7.1. Valores sueltos

**Alcance:** `src/` sin contar `src/config/marca/`, `src/config/demos/`, `src/lib/color.ts` ni las definiciones de tokens de `globals.css`.

### 7.1a. Colores literales (hex / rgb() / hsl() / oklch() / color-mix())

| Dónde | Cant. | ¿Legítimo? |
|---|---|---|
| Código de producción `.ts/.tsx` | **0** | — |
| `src/app/icon.svg` | 2 hex | Sí (favicon estático) |
| `src/lib/color.test.ts` | 16 hex + 1 `rgb()` | Sí (fixtures del test) |
| `src/config/tokens.test.ts:31` | 1 hex | Sí (verifica `--accent`) |
| Paleta de Tailwind (`bg-red-500`, `text-white`…) | 1 (`bg-transparent`, `Carta.tsx`) | Sí |

La UI no tiene ni un color suelto. Los colores viven en estos lugares:
- `src/app/globals.css`: 24 hex + ~10 `rgb()`, todos en `:root` (l.10-52) y `:root[data-theme='light']` (l.54-73). Fuera de los bloques de tokens hay solo dos: `--shadow-raised` (l.132, dentro de `@theme`) y `.papel { --line-strong: rgb(11 11 12 / 0.32) }` (l.199), que es un token sobreescrito sin nombre propio.
- `src/config/marca/colores.ts`: 31 hex. **Es una segunda fuente de verdad**: repite `BASE` y `TEMA_CLARO` de `globals.css` para el OG y `themeColor`. Hoy `marca.test.ts` mantiene las dos sincronizadas.
- `src/config/demos/gastronomia/paletas.ts`: 16 hex (paletas de la demo, que son datos).

### 7.1b. Valores arbitrarios de Tailwind (`x-[…]`)

Hay **38 en 20 archivos**. No aparece ningún `text-[13px]`, `p-[7px]` ni `bg-[#…]`.

| Tipo | Cant. | Ejemplos (archivo:línea) | Veredicto |
|---|---|---|---|
| `scale-[0.9x]` (feedback de toque) | 9 | `Button.tsx:9`, `Chip.tsx:21`, `ModuloOption.tsx:35`, `SelectCard.tsx:29`, `HeroMockup.tsx:132`, `DemoCliente.tsx:66`, `Carta.tsx:153`, `Cantidad.tsx:15`, `Reproductor.tsx:313` | **Deuda**: hay 4 valores distintos (0.96 ×2, 0.97 ×1, 0.98 ×5, 0.99 ×1). Conviene un token de motion (`brand/motion`). |
| `transition-[transform…]` | 6 | `Button.tsx:9,94`, `Chip.tsx:21`, `ModuloOption.tsx:35`, `SelectCard.tsx:29`, `HeroMockup.tsx:132` | Deuda menor: es el presupuesto de animación repetido a mano. Va a una utilidad o un token. |
| `grid-cols-[minmax…]` | 7 | `Hero.tsx:24`, `Confianza.tsx:36`, `marca/page.tsx:98`, `Wizard.tsx:186` (×2), `DemoGastronomia.tsx:112`, `Personalizar.tsx:67` | Layout. Aceptable; se puede agrupar en un patrón "split" de `components/patterns`. |
| Medidas mágicas (alto, ancho, radio) | 10 | `DemoCliente.tsx:44` (`h-[46rem]`, `rounded-[2.5rem]`), `:47` (`rounded-[2rem]`), `DemoGastronomia.tsx:25` (`min-h-[28rem]`), `:107` (`max-w-[90rem]`), `WizardLazy.tsx:23` (`min-h-[48rem]`, `lg:min-h-[44rem]`), `Reproductor.tsx:161` (`h-[50vh]`, `max-h-[34rem]`), `Hoja.tsx:124` (`max-h-[88%]`) | **Deuda real.** `max-w-[90rem]` choca con `--container-page: 75rem`. Los radios del marco de celular no están en la escala de radios. |
| Variantes de selector (`aria-[…]`, `data-[…]`) | 4 | `Field.tsx:17`, `Carta.tsx:116` (×2), `HeroMockup.tsx:101` | Legítimo (no son valores). |
| `-left-[9999px]` (honeypot) | 1 | `StepDatos.tsx:181` | Legítimo. |
| `shadow-[inset_0_0_0_1px_var(--accent-ink)]` | 1 | `CarritoHoja.tsx:303` | Deuda menor: usa un token, pero la sombra es ad hoc. |

**Más repetidos:** `DemoCliente.tsx` 4 · `Reproductor.tsx`, `Carta.tsx`, `DemoGastronomia.tsx`, `Button.tsx` y `HeroMockup.tsx` 3 cada uno.

**Escala:** no hay tokens de espaciado propios; se usa la escala por defecto de Tailwind, y el único token de espaciado es `--spacing-tap`. Sí existen tokens de tipografía, radios, sombra y contenedor.

### 7.1c. Props `style=` en línea

Hay **34 `style={…}` en 10 archivos**. Literales px/rem crudos: **13, todos en `opengraph-image.tsx`**. En el resto no hay ninguno.

| Archivo | `style=` | Qué hace | Veredicto |
|---|---|---|---|
| `features/explicativo/escenas.tsx` | 12 | 9 variables CSS de retardo (`--d`, `--i`) y 3 `fill: p.accent` (l.539, 547, 561) | Retardos: legítimo. Fill: color de paleta en runtime; mejor como variable CSS. |
| `app/empezar/opengraph-image.tsx` | 8 | 13 literales px (`padding: 72`, `fontSize: 96/56/28`, `gap: 16`, `marginLeft: -26`…) | **Legítimo**: Satori no tiene CSS. Los colores ya salen de `config/marca`. |
| `components/sections/HeroMockup.tsx` | 4 | `pieza(i)` → `--i` (×3) y `opacity: brillo` (l.83) | Legítimo. |
| `features/demo/gastronomia/cliente/Carta.tsx` | 3 | `pieza(i)` → `--i` | Legítimo, pero el helper está duplicado (ver §3). |
| `app/marca/page.tsx` | 2 | `variablesDePaleta` (l.75); `color`/`background` de muestras (l.264) | Legítimo (página de marca). |
| `DemoGastronomia.tsx:95`, `Personalizar.tsx:105`, `Reproductor.tsx:237`, `Logo.tsx:32`, `SplashLogo.tsx:28` | 1 c/u | Variables de paleta, swatch, `--dur`, `--i` | Legítimo. |

La geometría de los SVG (`escenas.tsx`, `ModuloArte.tsx`, `Ilustracion.tsx`, `paths.ts`, `CodigoQR.tsx`) es legítima y no entra en ninguno de los conteos.

---

### 7.2. Copy hardcodeado

### 7.2a. En componentes `.tsx`

El conteo sale de un script AST: cuenta texto JSX, atributos de texto (`aria-label`, `placeholder`, `title`, `alt`, `label`…) y literales en prosa, ya sea dentro de expresiones JSX o en constantes del módulo.

**289 detecciones en 39 de 49 archivos `.tsx`.** Unas 4 son falsos positivos (`opengraph-image.tsx:26`, `Hoja.tsx:18`, `CodigoQR.tsx:37`, `Carta.tsx:41`), así que quedan **unas 285 netas**:
- 151 nodos de texto JSX
- 55 atributos de texto
- 18 literales dentro de expresiones JSX (ternarios, plurales)
- 65 literales en constantes del módulo (arrays como `COMPROMISOS`, `PASOS`, `ERRORES`, `metadata`)

Por capa: `src/components` **52** · `src/features` **192** · `src/app` **45**.

Archivos con más copy (columnas: total · texto JSX · atributos · expresiones · constantes):

| Archivo | Total | JSX | Atrib. | Expr. | Const. |
|---|---|---|---|---|---|
| `app/marca/page.tsx` | 28 | 21 | 2 | 1 | 4 |
| `features/demo/gastronomia/cliente/CarritoHoja.tsx` | 20 | 13 | 1 | 1 | 5 |
| `components/sections/Confianza.tsx` | 17 | 9 | 0 | 0 | 8 |
| `features/demo/gastronomia/duenio/PanelDuenio.tsx` | 17 | 10 | 5 | 0 | 2 |
| `features/demo/gastronomia/cliente/Seguimiento.tsx` | 16 | 6 | 0 | 0 | 10 |
| `features/empezar/steps/StepDatos.tsx` | 15 | 4 | 7 | 0 | 4 |
| `features/explicativo/escenas.tsx` | 15 | 7 | 1 | 1 | 6 |
| `features/explicativo/Reproductor.tsx` | 14 | 6 | 8 | 0 | 0 |
| `features/demo/gastronomia/DemoGastronomia.tsx` | 11 | 5 | 2 | 4 | 0 |
| `features/empezar/steps/StepListo.tsx` | 11 | 10 | 1 | 0 | 0 |
| `features/demo/gastronomia/Personalizar.tsx` | 10 | 9 | 1 | 0 | 0 |
| `features/demo/gastronomia/duenio/TarjetaPedido.tsx` | 10 | 5 | 3 | 2 | 0 |
| `features/demo/gastronomia/cliente/PlatoDetalle.tsx` | 9 | 5 | 1 | 2 | 1 |
| `features/demo/gastronomia/cliente/Carta.tsx` | 8 | 5 | 2 | 0 | 1 |
| `app/empezar/opengraph-image.tsx` | 7 | 2 | 0 | 0 | 5 |
| `components/sections/Hero.tsx` | 7 | 4 | 0 | 0 | 3 |
| `features/empezar/Wizard.tsx` | 7 | 3 | 2 | 0 | 2 |
| `features/empezar/steps/StepModulos.tsx` | 7 | 4 | 1 | 2 | 0 |
| `features/empezar/steps/StepRubro.tsx` | 7 | 4 | 3 | 0 | 0 |
| `app/demo/gastronomia/page.tsx` | 6 | 2 | 1 | 0 | 3 |

Con menos de 6: `Footer` 5, `HeroMockup` 5, `app/empezar/page` 4, `ComoFunciona` 4, `Cantidad` 4, `DemoCliente` 4, `PreviewPanel` 3, `QueIncluye` 2, `Field` 2, `Hoja` 2, `CodigoQR` 2, `Comanda` 2, `WizardLazy` 2, y 1 en `Logo`, `NegocioPreview`, `Faq`, `ModuloOption`, `ProgressBar` y `BotonExplicativo`.

Sin copy: `Button`, `Chip`, `Encaje`, `SelectCard`, `Icon`, `Ilustracion`, `ModuloArte`, `SplashLogo`, `StepHeader` y `layout`.

**Copy duplicado o que se desfasó:**
- "Activá al menos un módulo para seguir." está tres veces: `features/empezar/state.ts:123`, `Wizard.tsx:142` y `StepModulos.tsx:109`. `lib/validation/lead.ts:78` tiene una cuarta versión, distinta.
- `'Tu negocio'` está dos veces: `NegocioPreview.tsx:37` y `PreviewPanel.tsx:39`.
- Plurales armados a mano (`=== 1 ? 'módulo' : 'módulos'`) en `PreviewPanel.tsx:44`, `HeroMockup.tsx:73`, `StepModulos.tsx:110` y `DemoGastronomia.tsx:145`.
- `opengraph-image.tsx:16` repite los nombres de módulos a mano y ya se desfasó: dice "Turnos", mientras que `config/modulos.ts` dice "Turnos y reservas".
- `metadata` (title y description) está escrito a mano en `app/empezar/page.tsx:13-30` y en `app/demo/gastronomia/page.tsx:7-20`.

### 7.2b. Copy que ya vive fuera de los componentes (candidatos a `src/content`)

| Archivo | Qué contiene |
|---|---|
| `src/config/modulos.ts` | 8 módulos: `nombre` y `descripcion` |
| `src/config/rubros/*.ts` (7) | `nombre`, `descripcionCorta`, `ejemploResultado` y 38 `objetivos[].etiqueta` |
| `src/config/faq.ts` | 6 preguntas con su respuesta (4 TODO de contenido) |
| `src/config/explicativo.ts` | Guion del video: `capitulo` + `narracion` por escena; `CASO_REAL` |
| `src/config/demos/gastronomia/cocinas/{parrilla,pizzeria,cafe}.ts` | Cartas de ejemplo (~92 literales; es contenido de la demo) |
| `src/config/demos/gastronomia/index.ts` y `types.ts` | `AVISO_DEMO`, `NOMBRES_COCINA` |
| `src/config/demos/gastronomia/paletas.ts`, `src/config/marca/colores.ts` | Nombres e `idea` de cada paleta; etiquetas de contraste para `/marca` (~24) |

`src/features/empezar/modulos.ts` **no tiene copy**: es solo lógica de selección. El catálogo de módulos está en `src/config/modulos.ts`.

Hay copy visible en archivos `.ts` que no son de config. También hay que llevarlo a `content`:

| Archivo | Literales | Qué es |
|---|---|---|
| `src/lib/validation/lead.ts` | 18 | Errores de zod |
| `src/domain/pedidos/schemas.ts` | 10 | Errores de validación |
| `src/server/leads/handler.ts` | 7 | Respuestas de la API |
| `src/domain/pedidos/estados.ts:70-80` | ~5 | `ETIQUETA_ESTADO` y acciones ("Marcar como listo") |
| `src/features/empezar/state.ts:117-123` | 3 | Errores de paso |
| `src/lib/whatsapp.ts:17` | 1 | Plantilla del mensaje |
| `src/features/demo/gastronomia/duenio/calculos.ts:62` | 1 | "Mesa …" |

---

### 7.3. Componentes duplicados o casi duplicados

| # | Grupo | Archivos | Comentario |
|---|---|---|---|
| 1 | **Botones fuera de `Button`/`buttonClasses`** | 30 `<button>` crudos en 16 archivos (contando el de `Button.tsx`); al menos 16 tienen estilos propios, sin `buttonClasses`. `buttonClasses` se usa en 11 archivos y `<Button>`/`<ButtonLink>` en 6. Variantes hechas a mano: botón de ícono redondo `size-12 rounded-full` (`Hoja.tsx:143`, `Reproductor.tsx:154`, `:313`); botón de texto o link (`PanelDuenio.tsx:200`, `TarjetaPedido.tsx:101`, `:111`, `CarritoHoja.tsx:268`); barra de acento tipo CTA (`DemoCliente.tsx:66`); pastillas (`Carta.tsx:116`, `DemoGastronomia.tsx:206`); stepper (`Cantidad.tsx:14`) | Faltan variantes `icon`, `link` y `pill` en `ui/Button`. |
| 2 | **Tarjeta y panel** (`rounded-card\|panel border border-line bg-surface p-*`) | 15 apariciones en 13 archivos: `SelectCard`, `ModuloOption`, `NegocioPreview`, `PreviewPanel`, `QueIncluye`, `Confianza`, `HeroMockup` (×2), `Wizard`, `WizardLazy`, `StepListo`, `PanelDuenio` (×2), `Personalizar`, `DemoGastronomia` | No existe un componente `Card`/`Panel`. |
| 3 | **Encabezado de sección** (`<section aria-labelledby className="reveal pt-24 lg:pt-32"><h2 className="text-title font-semibold text-balance">`) | `ComoFunciona.tsx:18`, `Confianza.tsx:35`, `:75`, `Faq.tsx:29`, `QueIncluye.tsx:11`. `StepHeader.tsx` hace lo mismo con otro wrapper | Patrón `SectionHeader` (eyebrow, título, bajada). El eyebrow `text-small font-semibold text-accent-ink` también se repite (`Confianza.tsx:38`, `marca/page.tsx:221`). |
| 4 | **Título de hoja o panel** (`h2 text-heading font-semibold`) | `Hoja.tsx:136`, `Reproductor.tsx:147`, `PanelDuenio.tsx:90`, `Personalizar.tsx:45`, `marca/page.tsx:61`, `:79` | — |
| 5 | **Dos implementaciones de diálogo** | `components/ui/Hoja.tsx`: `role="dialog"` hecho a mano, trampa de foco, `inert` y Escape, 156 líneas. `features/explicativo/Reproductor.tsx:135`: `<dialog>` nativo con `showModal()` | Elegir una sola base, idealmente el `<dialog>` nativo con un estilo de hoja. |
| 6 | **Tres sistemas de ícono o dibujo** | `components/icons/` (grilla 24, trazo 1.5, 34 íconos); `components/ilustraciones/Ilustracion.tsx` (grilla 96, trazo 2, 21 dibujos); `components/mini-web/ModuloArte.tsx` (otro arte por módulo, además de `MODULO_ICONS`). Hay además un spinner SVG suelto en `Button.tsx:64` | Unificar en `brand/ilustracion` y `brand/icon`. Los ids de las ilustraciones viven en `config/demos/ilustraciones.ts`, no en `brand`. |
| 7 | **El logo se dibuja en 4 lugares** | `Logo.tsx` (relleno, piezas que encajan), `SplashLogo.tsx` (trazo que se escribe), `features/explicativo/escenas.tsx:4` (usa `LOGO_TRAZOS`), `opengraph-image.tsx:23` (lee `public/webya-logo.svg` y le reemplaza el color). Más `app/icon.svg` | Todos comparten `logo-trazos.ts` (generado), salvo el OG y el favicon. Juntarlos en `brand/logo`, con variantes `armar` y `escribir`. |
| 8 | **Vista previa del negocio, casi idéntica** | `NegocioPreview.tsx` (64 l., celular, la usa `StepRubro`) y `PreviewPanel.tsx` (73 l., escritorio, la usa `Wizard`) tienen la misma interfaz de props y el mismo fallback `'Tu negocio'`. `HeroMockup.tsx` es una tercera "mini web" (162 l.) | Fusionar en uno solo con una variante de layout. |
| 9 | **Control seleccionable** | `SelectCard` (radio), `ModuloOption` (checkbox), `Chip` (checkbox), los tres sobre `Encaje`. Radios hechos a mano en `CarritoHoja.tsx:126`, `:296`, `PanelDuenio.tsx:135`, `Personalizar.tsx:91`, `:120`. Toggles con `aria-pressed` en `HeroMockup.tsx:130`, `DemoGastronomia.tsx:203`, `PanelDuenio.tsx:106`, `Reproductor.tsx:275` | Dos familias, `ui/Choice` y `ui/Toggle`, cubrirían todos. |
| 10 | **Indicadores de progreso** | `ui/ProgressBar.tsx`, `Seguimiento.tsx:77` (pasos con `aria-current="step"`), capítulos de `Reproductor.tsx:225` | Patrón `Steps`. |
| 11 | **Helper `pieza(i)` duplicado** | `HeroMockup.tsx:24` y `Carta.tsx:19` son idénticos; `StepListo.tsx:25` tiene otra versión | Va a `brand/motion`. |
| 12 | **Dos fuentes de color** | `globals.css :root` y `config/marca/colores.ts` (`BASE`, `TEMA_CLARO`) | Las sincroniza un test. En `brand/tokens` conviene que una se genere a partir de la otra. |

---

### 7.4. Dependencias entre capas

Grafo de imports (producción, sin tests). La cifra es la cantidad de imports.

```
app        -> components 12 · lib 5 · server 5 · config 4 · features 3 · domain 1
components -> components 29 · config 8 · features 2 (!) · lib 2
features   -> features 59 · components 46 · config 37 · domain 34 · lib 14
config     -> config 31 · domain 9 (!) · lib 1 (!)
domain     -> domain 15            (externos: solo zod; sin React)
lib        -> config 5 (!) · lib 1 (externos: zod)
server     -> server 16 · lib 3 · config 1
src/instrumentation.ts -> server 1
```

**Lo que viola las reglas objetivo:**

1. **`components` importa de `features` (2):**
   - `src/components/sections/Hero.tsx:1` importa `@/features/explicativo/BotonExplicativo`.
   - `src/components/sections/HeroMockup.tsx:5` importa `@/features/empezar/modulos-store`.
   - Arreglo: las secciones pasan a ser composición de `features`, o reciben el botón y el store por props.
2. **Import lateral entre features (2):**
   - `src/features/demo/gastronomia/DemoGastronomia.tsx:9` y `compartir.ts:9` importan `@/features/empezar/desde-demo`.
   - Arreglo: el contrato "demo → lead" se mueve a `domain` o a `lib`.
3. **Ciclo entre `lib` y `config`:**
   - `src/lib/validation/lead.ts:2-6` importa `config/demos/gastronomia/paletas`, `config/demos/gastronomia/types`, `config/modulos`, `config/origenes` y `config/rubros`.
   - A la vez, `src/config/marca/colores.ts:1` importa `@/lib/color`.
   - Arreglo: llevar la validación de leads a `domain` o a `server`.
4. **`config` depende de `domain` (9):**
   - `config/demos/gastronomia/{types,cocinas/*}.ts` importan `domain/pedidos/{dinero,types,schemas}`.
   - Es aceptable si los datos de la demo pasan a `content` o `features` (están por encima de `domain`). Como `config` puro, invierte el orden.
5. **`components` lee copy de `config` (8):**
   - `Faq.tsx` (`config/faq`), `QueIncluye`, `HeroMockup`, `PreviewPanel`, `NegocioPreview`, `ModuloArte` y `ModuloOption` (`config/modulos`), e `Ilustracion` (`config/demos/ilustraciones`).
   - No es un import hacia arriba, pero con la regla nueva el copy tiene que leerse de `src/content`.

**Lo que ya está bien:**
- `domain` no importa React ni nada de la UI.
- `server` no importa de `components` ni de `features`.
- Ningún archivo de cliente importa `server`.
- Los candidatos a `brand` (`Logo`, `SplashLogo`, `logo-trazos`, `icons`, `ilustraciones`) no importan `features`.

---

### 7.5. Deuda técnica

**TODO/FIXME:** 10 en 7 archivos. No hay FIXME ni HACK.

| Archivo:línea | Qué dice |
|---|---|
| `src/features/empezar/steps/StepDatos.tsx:214` | TODO visible a propósito (regla: lo faltante se muestra como `TODO:`): `<span>TODO: enlazar la política de privacidad.</span>` se renderiza al usuario. |
| `src/components/sections/Footer.tsx:24`, `:27` | Texto TODO solo en dev (`NODE_ENV !== 'production'`). |
| `src/config/faq.ts:14`, `:20`, `:30`, `:35` | Contenido: planes, precios, dominio, plazos. |
| `src/components/sections/ComoFunciona.tsx:2` | Contenido. |
| `src/features/empezar/steps/StepListo.tsx:105` | Contenido. |
| `src/config/explicativo.ts:69` | Contenido. |

**Archivos de más de 300 líneas (sin tests):**

| Archivo | Líneas | Nota |
|---|---|---|
| `src/app/globals.css` | 690 | ~400 son keyframes de features: hero, pedido, escenas `mg-*` |
| `src/features/explicativo/escenas.tsx` | 665 | 8 escenas SVG con copy adentro |
| `src/features/demo/gastronomia/cliente/CarritoHoja.tsx` | 337 | — |
| `src/features/explicativo/Reproductor.tsx` | 320 | — |
| `src/features/empezar/Wizard.tsx` | 301 | — |

Cerca del límite: `parrilla.ts` 283 y `app/marca/page.tsx` 282. Tests grandes: `Wizard.test.tsx` 346 y `handler.test.ts` 314.

**`eslint-disable`:** 2, los dos justificados.
- `opengraph-image.tsx:43`: `no-img-element`, por Satori.
- `StepDatos.tsx:75`: `react-hooks/incompatible-library`, por react-hook-form `watch`.

**`any` / `@ts-ignore` / `@ts-expect-error`:** 0.

**`console.*`:** 5, todos del lado del servidor (logs intencionales): `route.ts:18`, `handler.ts:162`, `:171`, `notifications.ts:26`, `supabase.ts:31`.

**Exports muertos o que solo usan los tests:**
- `src/domain/pedidos/index.ts`: barrel que **no importa nadie**; todos importan subrutas.
- `crearPedidoRepositoryMemoria`, `PedidoRepository` y `PedidoNoEncontradoError` (`domain/pedidos/repository.ts`): solo los usan tests. En producción solo se usa `pedidoDesdeBorrador`.
- `siguienteEstado` y `TRANSICIONES` (`estados.ts`), `getModulosDeRubro` y `RUBRO_IDS` (`config/rubros/index.ts`), `CASO_REAL` (`explicativo.ts`, vale `null`): solo los usan tests.
- Exportados sin necesidad (solo se usan dentro de su archivo): `mensajeCliente` (`Seguimiento.tsx:11`), `crearRepositorio`, `ConsoleNotificationService`, `UTM_KEYS`, `datosFormShape`, `ESTADO_INICIAL_LEAD`, `ORIGEN_POR_DEFECTO`.
- Comentario viejo: `config/rubros/types.ts` menciona `src/components/icons/rubros`, que no existe.

**Tests:**

Vitest: **38 archivos**.

| Área | Archivos | Detalle |
|---|---|---|
| `features` | 14 | — |
| `domain` | 5 | — |
| `components` | 5 | `Logo`, `PreviewPanel`, `HeroMockup`, `Hoja`, `icons` |
| `config` | 4 | — |
| `lib` | 4 | — |
| `server` | 4 | — |
| `tests/security` | 2 | RLS de leads y pedidos |

De esos 38, 9 son de componentes (`.tsx`).

Playwright: **13 specs** con 86 `test(…)` (a11y, consola, demo ×3, explicativo, flujo, layout, movimiento, rendimiento, seo, teclado, visual) y 98 snapshots visuales.

Sin test unitario directo:
- **Primitivas de UI**: `Button` (estados loading/success), `Field` (error, ayuda), `Chip`, `SelectCard`, `ModuloOption`, `ProgressBar`, `Encaje` e `Icon` (dibujado y `title`). Solo se cubren de forma indirecta, vía `Wizard.test` y la regresión visual.
- **Secciones**: `Hero`, `Confianza`, `Faq`, `Footer`, `ComoFunciona` y `QueIncluye`.
- **Componentes de la demo**: `CarritoHoja`, `Carta`, `PlatoDetalle`, `Seguimiento`, `TarjetaPedido`, `Comanda`, `Cantidad` y `CodigoQR` (parte la cubre `DemoCliente.test` y e2e).
- **Otros**: `escenas.tsx`, `SplashLogo`, `Ilustracion`, `ModuloArte`.
- **Lógica**: `features/empezar/state.ts` (reducer), `api.ts`, `server/ip.ts`, `duenio/sonido.ts`, `useAhora.ts`, `lib/analytics.ts` y `lib/utm.ts` (estas dos se usan a través de otros tests).

No hay tests de estados por componente (vacío, error, cargando, deshabilitado) ni Storybook o catálogo equivalente. Lo más parecido es `/marca`.

---

### 7.6. Rubros, módulos, íconos e ilustraciones

**Rubros** (`src/config/rubros/`). El orden es el de `RUBROS` y suman 38 objetivos.

| id | Nombre | Ícono | Módulos sugeridos | Objetivos |
|---|---|---|---|---|
| `peluqueria_estetica` | Peluquería y estética | `tijera` | turnos, catalogo, pagos, clientes, notificaciones | 6 |
| `gastronomia` | Gastronomía | `cubiertos` | carta_qr, pedidos, pagos, notificaciones | 5 |
| `comercio` | Comercio y tienda | `tienda` | catalogo, pagos, clientes, notificaciones | 6 |
| `profesionales` | Abogados, contadores y profesionales | `portafolio` | formularios, turnos, pagos, clientes | 5 |
| `gimnasio_deportes` | Gimnasio y deportes | `pesa` | turnos, formularios, pagos, clientes, notificaciones | 5 |
| `servicios_tecnicos` | Servicios técnicos | `llave` | formularios, turnos, clientes, notificaciones | 5 |
| `otro` | Otro | `mas` | formularios, clientes, notificaciones | 6 |

**Módulos.** El catálogo está en `src/config/modulos.ts`. `src/features/empezar/modulos.ts` solo trae la lógica: `modulosSeleccionados`, `alternarModulo`, `esSugerido` y `sanearManual`.

| id | Nombre |
|---|---|
| `turnos` | Turnos y reservas |
| `catalogo` | Tienda y catálogo |
| `carta_qr` | Carta con QR |
| `formularios` | Formularios |
| `pedidos` | Pedidos online |
| `pagos` | Pagos online |
| `clientes` | Base de clientes |
| `notificaciones` | Avisos automáticos |

**Íconos** (`src/components/icons/paths.ts`): 34 en total.
- `RUBRO_ICONS` (7): tijera, cubiertos, tienda, portafolio, pesa, llave, mas.
- `MODULO_ICONS` (8): turnos, catalogo, carta_qr, formularios, pedidos, pagos, clientes, notificaciones.
- `UI_ICONS` (19): check, arrowLeft, arrowRight, arrowDown, chat, mail, buscar, menos, cerrar, bolsa, moto, mesa, billete, reloj, impresora, play, pausa, volumen, silencio.
- Los nombres mezclan inglés camelCase (`arrowLeft`, `check`) con español (`cerrar`, `buscar`).

**Ilustraciones** (`src/components/ilustraciones/Ilustracion.tsx`): 21. Los ids están en `config/demos/ilustraciones.ts`: carne, pollo, chorizo, empanada, queso, papas, ensalada, agua, gaseosa, vino, cerveza, flan, helado, pizza, faina, cafe, medialuna, alfajor, torta, tostado, jugo.

---

### Resumen en números

| Métrica | Valor |
|---|---|
| Colores literales en código de UI (fuera de config/marca, demos, color.ts y tokens) | **0** (solo 2 hex en `icon.svg` y 17 en tests) |
| Fuentes de verdad de color | 2 (`globals.css` y `config/marca/colores.ts`, sincronizadas por test) |
| Valores arbitrarios de Tailwind | **38** en 20 archivos (20 deuda real: 10 medidas mágicas, 9 `scale-[…]` con 4 valores, 1 sombra; 6 `transition-[…]` menores; 12 legítimos o de layout) |
| `style=` en línea / literales px crudos | 34 en 10 archivos / 13 px, todos legítimos en `opengraph-image.tsx` |
| Copy hardcodeado en `.tsx` | **≈285** en 39 archivos (components 52 · features 192 · app 45) |
| Copy en `.ts` fuera de config | ≈45 (validación, domain, server, state) |
| Archivos de config con copy | 17 (`modulos`, 7 rubros, `faq`, `explicativo`, 3 cocinas, demos `index` y `types`, `paletas`, `colores`) |
| Grupos de duplicados | 12 (botones: ≥16 `<button>` con estilo propio; tarjetas: 15 en 13 archivos; 2 diálogos; 3 sistemas de dibujo; logo en 4 lugares) |
| Imports que violan las capas | 4 hacia arriba o laterales (2 components→features, 2 feature→feature) + ciclo lib↔config (6 imports) + config→domain (9) |
| TODO / eslint-disable / any / ts-ignore | 10 (1 visible en producción) / 2 / 0 / 0 |
| Archivos de más de 300 líneas (sin tests) | 5 |
| Tests | 38 de Vitest (9 de componentes) · 13 specs de Playwright (86 tests, 98 snapshots) |
| Primitivas de UI sin test unitario | 8 de 9 (solo `Hoja` tiene) |
| Rubros / módulos / íconos / ilustraciones | 7 / 8 / 34 / 21 |


## 8. Skills, plugins y MCP

Ver [auditoria-skills.md](auditoria-skills.md).

