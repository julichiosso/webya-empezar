# Plan — Sprint "Base de marca y frontend"

Estado: **propuesta, esperando OK**. Baseline medido en [auditoria-baseline.md](auditoria-baseline.md), skills en
[auditoria-skills.md](auditoria-skills.md).

## 0. Punto de partida (lo que cambia respecto del brief)

- `main` está en `f02db48`, no en `3769f98`: **la demo de Gastronomía, el dominio Pedidos y el video explicativo ya
  existen y están en producción.** Este sprint no les cambia comportamiento ni diseño; solo los muda a la estructura
  nueva (imports, tokens y copy, con el mismo texto).
- JS inicial real de `/empezar`: **144,0 KB** (no 140,6). Margen hasta 150: **6,0 KB**.
- Lighthouse a11y/SEO/buenas prácticas ya está en 100/100/100. La mejora medible está en **LCP 1763 ms** (CPU ×4 +
  Slow 4G; 574 ms son CSS bloqueante) e **INP 168 ms** al elegir rubro.
- Colores sueltos en UI: ya son 0. Deuda real: **≈285 textos hardcodeados**, 38 valores arbitrarios de Tailwind,
  12 grupos de componentes duplicados, 4 imports que violan capas + 1 ciclo `lib ↔ config`.
- Seguridad: **`pnpm dev` hoy escribe en Supabase real** (el `.env` local pide `supabase` y `env.ts` lo acepta en
  desarrollo). No hay CSP.

## 1. Estructura final

```
src/
  brand/                         identidad, sin React de páginas
    tokens/  primitivos.ts → semanticos.ts → componentes.ts (+ claro/oscuro)
             generar.ts escribe tokens.css (lo importa globals.css); un test falla si está desactualizado
             (absorbe config/marca/colores.ts: una sola fuente de verdad)
    logo/    trazos.ts (generado), Logo.tsx (completa | compacta | monocromo; armar | escribir), SplashLogo.tsx
    motion/  presets.ts (duraciones, easings, escala de toque, pieza(i)), motion.css (keyframes del sistema)
    ilustracion/ grilla.ts, iconos/ (grilla 24), dibujos/ (grilla 96), Icon.tsx, Ilustracion.tsx
    voz/     diccionario.ts (palabras sí/no; lo usa el test de copy)
    BRAND.md
  components/
    ui/        Button (+ icon/link/pill), Card, Choice (radio/checkbox), Toggle, Chip, Field/Input, Dialog
               (<dialog> nativo), Sheet (sobre Dialog), Tabs, Accordion (<details>), Encaje, Steps, Spinner
    patterns/  WizardShell, PreviewNegocio (fusiona NegocioPreview + PreviewPanel), MiniWeb, SectionHeader, EmptyState
    marketing/ Nav, Hero, Rail, Tablero, VitrinaDemo, Confianza, Faq, CtaFinal, StickyCta, Footer
  content/     TODO el copy (es-AR), tipado: types.ts, empezar.ts, faq.ts, modulos.ts, rubros/*.ts, microcopy.ts,
               seo.ts, instagram.ts, hero-variantes.ts, demos/gastronomia/*, explicativo.ts
  features/    empezar, explicativo, demo/gastronomia (cablean UI + content; sin copy propio)
  domain/      pedidos, leads (la validación del lead sale de lib/ y corta el ciclo)
  config/      ids y estructura sin copy: rubros (ids, módulos sugeridos, ícono), origenes, módulos
  server/ lib/
  app/         /empezar, /marca, /sistema (nueva, noindex), /demo/gastronomia
docs/          auditoria-*, plan-sprint, adr/, copy-guia.md, contribuir.md, reporte-sprint.md
.claude/       agents/*.md (7 subagentes), skills/ (propias + 4 de terceros fijadas por commit)
```

**Capas** (solo se importa hacia abajo):
`app > features > marketing > patterns > ui > content > brand > domain > config > lib`
(`server` es aparte: puede usar `content/domain/config/lib`, nunca UI).
La regla se impone dos veces: `no-restricted-imports` de ESLint por carpeta y un test de arquitectura (Vitest) que
recorre los imports con el compilador de TypeScript. El mismo test falla si hay texto JSX o atributos de texto
(`aria-label`, `placeholder`, `title`, `alt`) literales en `components/` o `features/`, o hex/`rgb()` fuera de
`brand/tokens`.

## 2. Olas y dueños de archivos

Todo sale de una rama de integración `sprint/base-marca`. Cada agente trabaja en
`../webya-<agente>` (`git worktree add … -b feat/<agente>`) y toca **solo** sus archivos; si necesita algo de otro
dueño, me lo pide. Ningún push.

### Ola 1: contrato (yo, secuencial, ~1 commit por punto)
1. Mover carpetas a la estructura final con `git mv` y re-exportar donde haga falta. **Sin cambios visuales:** la
   regresión visual tiene que pasar igual.
2. Tokens en 3 capas + `generar.ts` + test de frescura. Escala de espaciado de 8 px, radios, elevaciones,
   duraciones y easings como tokens.
3. `src/content/types.ts`: contratos de todas las claves, con el copy actual movido tal cual. Test de completitud:
   falla si falta una clave o un rubro de `config` no tiene su contenido.
4. Contratos de componentes (`ui/contratos.ts`: props y estados de cada primitiva).
5. Test de arquitectura + reglas de ESLint, con una lista de excepciones **que solo puede achicarse**. Cada ola le
   saca entradas y al final queda vacía.
6. Infra:
   - `pnpm dev` usa memoria por defecto; Supabase en dev solo con `ALLOW_SUPABASE_DEV=1`, con test.
   - `E2E_PORT` parametrizable, para que dos worktrees no choquen en el 3100.
7. `.claude/agents/*.md` y las skills (instalar las 4 aprobadas, crear `webya-copy-comercial` y
   `webya-parallel-workflow`, actualizar `webya-brand` y `webya-design-system`).

### Ola 2: paralelo (4 agentes)
| Agente | Dueño de | Entrega |
|---|---|---|
| `marca-sistema` | `src/brand/{tokens,logo,motion,voz}`, `BRAND.md`, `app/sistema`, `app/icon*`, `app/apple-icon*`, `scripts/exportar-marca.*` | Logo en 3 variantes; favicon y app icons; export de avatar e íconos de destacadas de Instagram (SVG + PNG con Playwright, sin dependencias nuevas); presets de motion; manual Encastre con usos correctos e incorrectos; `/sistema` (tokens, componentes, estados, ilustraciones) |
| `ilustracion` | `src/brand/ilustracion` | Una sola grilla y un solo trazo; íconos de los 7 rubros y de los 8 módulos; estados vacíos, 404, error y carga; absorbe `ModuloArte` y el spinner suelto |
| `ui-componentes` | `src/components/ui`, `src/components/patterns` | Primitivas con los 8 estados y un test por estado; Dialog y Sheet unificados sobre `<dialog>`; `PreviewNegocio` fusionado |
| `copy-conversion` | `src/content`, `docs/copy-guia.md` | Copy nuevo completo: hero con 3 variantes razonadas, secciones, microcopy, errores, vacíos, confirmación, FAQ con objeciones, footer, SEO/OG, mensaje de WhatsApp, 5 captions/bio de Instagram. Test de lista prohibida (superlativos, "menta", cifras sin `TODO:`) |

### Ola 3: paralelo (3 agentes)
| Agente | Dueño de | Entrega |
|---|---|---|
| `paginas` | `src/components/marketing`, `src/app/empezar`, `src/features/**` (solo cableado) | Recomposición de `/empezar`: hero asimétrico con el negocio armándose por piezas (CSS), nav mínima con CTA, ritmo de secciones variado, CTA persistente en celular, wizard pulido, sección "cómo trabajamos / qué pasa después", JSON-LD y OG nuevos. Lleva el copy de demo y video a `content` sin cambiar el texto |
| `qa-rendimiento` | `tests/`, `e2e/`, `docs/reporte-sprint.md` | Tests de tokens, componentes por estado, a11y (axe), reduced-motion, teclado, regresión visual regenerada y revisada a ojo; trazas CPU ×4; comparativa antes/después en 6 viewports |
| `seguridad-revisor` | solo lectura | Revisión del diff de las olas 1 y 2 mientras se trabaja la 3, y pasada final: inputs, headers/CSP, dependencias, secretos |

### Integración (yo)
- Orden de merge: marca → ilustración → ui → copy → páginas → qa.
- Después de **cada** merge: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`, con
  números reales. Si algo rompe, se revierte ese merge y se corrige en su rama.
- Cambios míos en `next.config.ts`:
  - CSP estática.
  - `experimental.inlineCss`, para sacar los 574 ms de CSS bloqueante. Se mide antes y después; si no mejora, se
    saca.
- Al final: `sprint/base-marca` → `main` **local**. Sin push.

## 3. Decisiones técnicas propuestas

- **Modo claro:** oscuro por defecto y un interruptor discreto en nav y footer que recuerda la elección. Un script
  inline evita el destello; cuesta ~0,3 KB. No sigue al sistema, porque cambiaría la cara de la marca a la mayoría de
  los celulares.
- **CSP sin nonce:**
  - `default-src 'self'`, `script-src 'self' 'unsafe-inline'`, `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`,
    `frame-ancestors 'none'`.
  - El nonce obliga a renderizar dinámico: pierde el HTML estático y empeora el TTFB.
  - Se suma SRI experimental de Next para los chunks. Queda documentado en un ADR.
- **Movimiento:**
  - Presets en `brand/motion`; scroll-driven animations con `@supports (animation-timeline: view())` y fallback
    estático; View Transitions solo donde ya hay soporte.
  - Nada de parallax. Excepción documentada: `stroke-dashoffset` en trazos del logo, una sola vez.
- **INP al elegir rubro (168 ms):** se ataca en `paginas`/`ui` con `startTransition` para la vista previa y
  difiriendo trabajo no urgente. La meta es < 100 ms con CPU ×4.
- **Dependencias nuevas:** ninguna en runtime. Las de desarrollo solo si se justifican con KB y mantenimiento.

## 4. Skills (propuesta de instalación, alcance proyecto, por commit fijado)

| Skill | Fuente | Decisión |
|---|---|---|
| frontend-design | anthropics/skills @ `41bbe19` | Instalar |
| vercel-react-best-practices | vercel-labs/agent-skills @ `dc8367e` | Instalar (sin sumar las dependencias que sugiere) |
| copywriting | coreyhaines31/marketingskills @ `15b38b5` | Instalar (la voz la manda `webya-brand`) |
| cro | coreyhaines31/marketingskills @ `e88ace7` | Instalar (sin testimonios ni sellos: manda `webya-brand`) |
| webapp-testing, web-design-guidelines, seo-audit, seo, core-web-vitals, accessibility, security-guidance, claude-security | — | Descartadas (duplican lo que hay, ejecutan comandos o bajan reglas de la red sin versión) |

Ninguna trae scripts ejecutables; son 222 KB de Markdown. Asignación mínima por agente:
[auditoria-skills.md](auditoria-skills.md#asignación-mínima-de-skills-por-subagente).

## 5. Riesgos

1. **Cupo de uso:** 4 agentes en paralelo gastan rápido el cupo de Pro.
   - Cada agente hace commits chicos, así lo hecho sobrevive a un corte.
   - Si el cupo aprieta, bajo a 2 en paralelo.
2. **Presupuesto de JS (6 KB):** las primitivas nuevas (Tabs, Dialog) solo cargan donde se usan; Accordion usa
   `<details>`, sin JS; el hero nuevo es CSS. Si se pasa, sale primero lo decorativo.
3. **Regresión visual:** cambia casi todo. Las capturas se regeneran por merge y se revisan a ojo, no se aceptan a
   ciegas.
4. **Worktrees en Windows + pnpm:** cada worktree necesita su `pnpm install` (rápido, por el store) y su puerto de
   E2E.
5. **Copy:** sin precios, plazos ni clientes reales; muchos `TODO:` visibles a propósito (por ejemplo, la política
   de privacidad).
