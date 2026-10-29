# WebYa · /empezar

Página de entrada de WebYa (`webya.ar/empezar`), a la que lleva el link de la bio de Instagram
(@webya.dev). Hoy **captura leads cualificados** (Fase 0: validar con 5-10 negocios reales); a futuro
es el inicio del onboarding de la plataforma.

Posicionamiento: **Creá. Digitalizá. Crecé.** La persona elige su rubro, activa los módulos que su
negocio necesita (turnos, tienda y catálogo, carta con QR, pagos…) y deja sus datos. **Hoy no existe
una plataforma de autoservicio**: el armado y la entrega los hacemos nosotros, y la pantalla final
lo dice así (ver [reglas de copy](#reglas-de-copy)).

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript estricto · Tailwind CSS 4 · React Hook Form + Zod ·
`motion` · Supabase (Postgres) · Vitest + Testing Library · Playwright · ESLint + Prettier.

> Esta versión de Next tiene cambios respecto de lo habitual. La documentación que corresponde está
> en `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Cómo correrlo

Requiere Node ≥ 22.12 y pnpm.

```bash
pnpm install
cp .env.example .env.local   # completar, ver "Variables de entorno"
pnpm dev                     # http://localhost:3000  (la raíz redirige a /empezar)
```

Sin credenciales de Supabase funciona igual: los leads se guardan en `.data/leads.json`
(`LEAD_REPOSITORY=file`, solo desarrollo).

| Script           | Qué hace                                                    |
| ---------------- | ----------------------------------------------------------- |
| `pnpm dev`       | Servidor de desarrollo                                      |
| `pnpm build`     | Build de producción (falla si la configuración es inválida) |
| `pnpm start`     | Sirve el build                                              |
| `pnpm lint`      | ESLint                                                      |
| `pnpm typecheck` | `tsc --noEmit`                                              |
| `pnpm test`      | Unit + componentes + API + seguridad estática (Vitest)      |
| `pnpm test:e2e`  | E2E, accesibilidad, visual y rendimiento (Playwright)       |
| `pnpm format`    | Prettier                                                    |

La primera vez de E2E: `npx playwright install chromium`.

## Variables de entorno

Documentadas una por una en [`.env.example`](.env.example). Resumen:

| Variable                                      | Dónde    | Para qué                                                                                         |
| --------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                        | público  | Dominio canónico (canonical, Open Graph, sitemap). Default `https://webya.ar`                    |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                 | público  | **TODO:** número del negocio (`5491123456789`). Sin él, el botón de WhatsApp queda deshabilitado |
| `NEXT_PUBLIC_CONTACT_EMAIL`                   | público  | **TODO:** mail del footer                                                                        |
| `NEXT_PUBLIC_INSTAGRAM_URL`                   | público  | Perfil de Instagram                                                                              |
| `LEAD_REPOSITORY`                             | servidor | `file` (dev) · `memory` (tests) · `supabase` (producción)                                        |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`   | servidor | Credenciales. La service role **nunca** con prefijo `NEXT_PUBLIC_`                               |
| `IP_HASH_SALT`                                | servidor | Sal para hashear la IP. **Obligatoria en producción**                                            |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_SECONDS` | servidor | Envíos por IP en la ventana (default 5 cada 600 s)                                               |
| `RATE_LIMIT_BURST_PER_MINUTE`                 | servidor | Intentos por minuto por IP, en memoria (default 20)                                              |

Las variables del servidor se validan **al arrancar** (`src/instrumentation.ts` + `src/server/env.ts`):
si falta algo crítico en producción, el proceso no levanta, en vez de perder leads en silencio.
Las `NEXT_PUBLIC_*` se incrustan en el build: cambiarlas exige volver a construir.

## Arquitectura

```
src/
  app/                 rutas: /empezar, /api/leads, robots, sitemap, opengraph-image
  components/          UI genérica (ui/, icons/, sections/, NegocioPreview)
  features/empezar/    lógica del wizard: estado, módulos, pasos, cliente de la API
  lib/                 utilidades puras: validación Zod, teléfono AR, WhatsApp, UTM, analítica
  server/              repositorios, handler de la API, rate limit, notificaciones, env
  config/              rubros, módulos y FAQ como datos (no como código)
supabase/migrations/   SQL del esquema (RLS activa, sin políticas)
e2e/                   Playwright
tests/security/        verificación de que `leads` no es legible con la clave pública
```

### Datos y multi-tenant

Tabla `leads` (ver migraciones): `id`, `created_at`, `nombre`, `email`, `whatsapp` (E.164),
`nombre_negocio`, `rubro`, `rubro_otro`, **`modulos`**, `objetivos`, `mensaje`, `origen`, `utm_*`,
`estado`, `ip_hash`, `user_agent`. RLS activa **sin políticas** y permisos revocados a
`anon`/`authenticated`: solo el servidor (service role) inserta y lee. La IP nunca se guarda en claro.

`tenant_id` **no está implementado**; los lugares donde entraría están marcados con
`TODO(multi-tenant)` en la migración y en `server/repositories/types.ts`.

Aplicar migraciones: `supabase db push` (o pegar los `.sql` de `supabase/migrations/` en orden en el
SQL Editor del proyecto).

### Módulos y selección

Los módulos viven en `src/config/modulos.ts` (nombre y explicación no técnica). El **estado de
módulos se comparte entre el hero y el wizard** (`features/empezar/modulos-store.ts`) y guarda **solo
lo que la persona decidió a mano**; lo demás se deriva de los módulos sugeridos del rubro
(`modulosSeleccionados`). Por eso al cambiar de rubro no quedan módulos "fantasma" y lo elegido a
mano nunca se pisa. El paso 2 exige al menos un módulo; los objetivos son opcionales.

## Cómo agregar un rubro

Un archivo, sin tocar componentes. Procedimiento completo en la skill
[`webya-add-rubro`](.claude/skills/webya-add-rubro/SKILL.md). En corto:

1. Crear `src/config/rubros/mi-rubro.ts` exportando un `Rubro` (`id`, `nombre`, `icono`,
   `descripcionCorta`, `objetivos`, `modulosSugeridos`, `ejemploResultado`).
2. Si usa un ícono nuevo, agregarlo a `src/components/icons/paths.ts`.
3. Sumarlo (un `import` y una entrada) en `src/config/rubros/index.ts`. "Otro" va siempre último.
4. `pnpm test`: los tests de config validan **todos** los rubros automáticamente.

## Cómo conectar notificaciones

`src/server/notifications.ts` define `NotificationService` y hoy usa un stub que loguea en la
consola del servidor (sin teléfono ni mail). Para un aviso real, implementar la interfaz y devolverla
en `getNotificationService()`. Los comentarios del archivo explican cada caso:

- **Email:** Resend/Postmark/SendGrid desde `nuevoLead` (agregar la API key a `env.ts` y `.env.example`).
- **WhatsApp:** WhatsApp Cloud API con una plantilla aprobada.
- **Slack:** Incoming Webhook con un `POST` JSON `{ text }`.
- **Varios a la vez:** un `CompositeNotificationService` con `Promise.allSettled`.

Un aviso que falla **no** hace fallar el envío del lead.

## Analítica

Capa abstracta en `src/lib/analytics.ts`: `track(evento, props)`. Eventos: `empezar_view`,
`rubro_seleccionado`, `modulo_alternado`, `paso_completado`, `lead_enviado`, `whatsapp_click`. No hay
proveedor conectado. Para enchufar uno, registrar un _sink_ una vez en el cliente (por ejemplo en un
componente `'use client'` montado en `layout.tsx`):

```tsx
'use client';
import { useEffect } from 'react';
import { registerSink } from '@/lib/analytics';

export function AnalyticsSink() {
  useEffect(() => {
    return registerSink((evento, props) => window.plausible?.(evento, { props }));
    // GA4:  window.gtag?.('event', evento, props)
    // Meta: window.fbq?.('trackCustom', evento, props)
  }, []);
  return null;
}
```

Cargar el script del proveedor de forma diferida (`next/script` con `strategy="lazyOnload"`) para no
gastar el presupuesto de JS.

## Desplegar en Vercel

1. Importar el repo en Vercel (framework: Next.js; Node ≥ 22).
2. Crear un proyecto de Supabase y aplicar `supabase/migrations/`.
3. Cargar las variables de entorno (Production): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`,
   `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_INSTAGRAM_URL`, `LEAD_REPOSITORY=supabase`, `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `IP_HASH_SALT` (y opcionalmente los `RATE_LIMIT_*`).
4. Desplegar. En Vercel el repositorio en archivo/memoria **se rechaza al arrancar** (el disco es
   efímero): solo se acepta `supabase`.
5. Dominio: apuntar `webya.ar` al proyecto y verificar `https://webya.ar/empezar`,
   `/robots.txt`, `/sitemap.xml` y la imagen de `/empezar/opengraph-image`.
6. El rate limit de ráfagas (`RATE_LIMIT_BURST_PER_MINUTE`) es **en memoria por instancia**: en
   serverless se reparte entre instancias. El límite fuerte es el de `RATE_LIMIT_MAX`, que cuenta
   en la base.

## Sistema de diseño y animación

Fuente de verdad: [`webya-design-system`](.claude/skills/webya-design-system/SKILL.md) (implementación)
y [`webya-brand`](.claude/skills/webya-brand/SKILL.md) (concepto "Encastre", paleta, voz, logo e
ilustración). Las tres paletas candidatas, con su contraste medido, se comparan en `/marca`
(no indexada). Resumen.

### Tokens

Definidos en `src/app/globals.css` (variables CSS expuestas a Tailwind con `@theme inline`); nunca
valores sueltos en componentes. Oscuro por defecto; el claro se activa con `<html data-theme="light">`.

| Grupo      | Utilidades                                                                           | Notas                                                                   |
| ---------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Fondo      | `bg-bg`, `bg-surface`, `bg-surface-2`                                                | Página, tarjetas, inputs                                                |
| Línea      | `border-line`, `border-line-strong`                                                  | Bordes de 1 px de baja opacidad                                         |
| Texto      | `text-fg`, `text-muted`, `text-subtle`                                               | Todos AA                                                                |
| Acento     | `bg-accent`, `text-accent`, `text-accent-fg`, `bg-accent-soft`                       | **Un solo acento: Brasa `#ff5b24`**. Solo CTA, foco, selección          |
| Papel      | `bg-paper`, `text-paper-fg`, `text-paper-muted`, `text-accent-ink`                   | Crema `#f4ede1` para comandas y tickets; acento tinta para texto encima |
| Error      | `text-danger`                                                                        | Rosa frío, distinto del acento                                          |
| Tipografía | `text-display`, `text-title`, `text-heading`, `text-lead`, `text-body`, `text-small` | Outfit vía `next/font`; números con `.tabular`                          |
| Forma      | `rounded-control` (12) < `rounded-card` (16) < `rounded-panel` (24)                  | Grilla de 8 px; táctil mínimo `min-h-tap` (48 px)                       |

### Presupuesto de animación (obligatorio)

1. Animar **solo `transform` y `opacity`** (única excepción documentada: el trazo `stroke-dashoffset`
   de íconos ≤ 24 px, una vez). Prohibido animar `width/height/top/left`, blur pesado y filtros SVG.
2. 60 fps en un Android de gama media (probar con CPU ×4).
3. Nada corre fuera de pantalla ni con la pestaña oculta. Un elemento interactivo **no desaparece ni se
   mueve en loop**: se anima una vez la entrada y el cambio de estado.
4. Lo que no está en el primer viewport se carga diferido (el wizard se descarga al primer gesto).
5. `prefers-reduced-motion`: versión estática equivalente, sin perder información (hay una regla global
   en CSS y `MotionConfig reducedMotion="user"` en el wizard).
6. `motion` con `LazyMotion` + `domAnimation` y componentes `m.*`; Lottie solo si SVG no alcanza.
7. JS inicial de la ruta **< 150 KB gzip** y CLS **< 0,05** (los verifica `e2e/rendimiento.spec.ts`).
8. Duraciones: 100 / 160 / 280 / 520 ms con `--ease-out`; resortes solo para selección de tarjetas.
9. Si el "wow" compromete performance o accesibilidad, **gana la performance**.

### Crear una animación nueva

1. ¿Responde a una acción o comunica un cambio? Si es decorativa, probablemente no va.
2. Definí solo `transform`/`opacity`; en CSS (`@keyframes` en `globals.css`) o con `m.*` dentro de `LazyMotion`.
3. Reservá el espacio final (sin layout shift).
4. Agregá la variante estática para reduced-motion (el bloque `@media (prefers-reduced-motion: reduce)`
   de `globals.css` lista las clases con animación).
5. Si corre en loop, pausala fuera de pantalla (`IntersectionObserver`) y con la pestaña oculta.
6. Medí: CPU ×4, CLS y peso de JS, y corré `pnpm test:e2e` (`movimiento` y `rendimiento`).

### Reglas de copy

Voseo rioplatense (creá, activá, armá, elegí, tocá), verbos de acción en botones, y **ninguna promesa
que el producto no cumple**: la entrega es manual; no se inventan precios, plazos, testimonios ni
métricas (`TODO:` en el código). Detalle en la skill de diseño, sección 5b.

## Calidad

- **Unit/componentes/API:** schemas Zod (teléfonos argentinos con y sin +54/9/0/15), link de WhatsApp,
  config de rubros, selección de módulos (sin fantasmas), wizard, mockup del hero y la API
  (válido, inválido, honeypot, rate limit, falla del repositorio).
- **E2E (Playwright, 5 viewports: iPhone SE, iPhone 15, Pixel 7, tablet, desktop):** recorrido completo y
  verificación del lead guardado, hero → wizard, teclado completo, `prefers-reduced-motion`, axe
  (WCAG 2.2 AA), objetivos táctiles ≥ 48 px, SEO, presupuestos de rendimiento y capturas por paso.
- **Seguridad:** `tests/security/leads-rls.test.ts` verifica estáticamente la migración (RLS sin
  políticas, permisos revocados). La verificación **real** con la clave `anon` corre solo si se definen
  `SUPABASE_TEST_*` (proyecto de prueba); sin ellas se omite.
- Las capturas visuales son por plataforma (`-win32.png`): en Linux/CI regenerarlas con
  `pnpm test:e2e visual --update-snapshots` y revisarlas a ojo.
- Los viewports se **emulan con Chromium** (tamaño, touch y user agent). El motor real de iOS y el
  navegador interno de Instagram se prueban a mano en dispositivos.

Checklist previo a cada entrega: [`webya-qa-checklist`](.claude/skills/webya-qa-checklist/SKILL.md).

## Pendientes (`TODO:`)

- Elegir paleta en `/marca` (si no, queda Brasa).
- Número de WhatsApp y mail de contacto (variables `NEXT_PUBLIC_*`).
- Política de privacidad (link bajo el formulario).
- Precios, plazos de entrega y soporte de dominio propio (FAQ y confirmación).
- Qué se ofrece exactamente en "Crecé" (clientes, métricas) antes de prometerlo.
- Conectar notificaciones de lead nuevo y un proveedor de analítica.
- Probar en dispositivos reales (iOS/Android) y en el navegador de Instagram.
