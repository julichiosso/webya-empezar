# Webya · webya.dev

Sitio de Webya (Julián Chiosso, San Jorge, Santa Fe): sistemas para negocios de la zona (turnero con seña,
pedidos online, tiendas, catálogos y sitios). La home vende con trabajos reales y termina en el configurador
"Armá tu sistema", que manda el pedido ya escrito por WhatsApp.

| Ruta                                 | Qué es                                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| `/`                                  | Home editorial: qué armo, turnero, pedidos, proyectos reales, configurador y cierre |
| `/turnero`, `/pizzerias`, `/tiendas` | Landings por servicio (SEO local), con el configurador ya en ese servicio           |
| `/demo/peluqueria`                   | Demo del turnero: bot de turnos, agenda y estadísticas, con datos de ejemplo        |
| `/demo/gastronomia`                  | Demo de pedidos: carta del cliente y panel del dueño, sincronizados                 |
| `/privacidad`, `/terminos`           | Legales                                                                             |
| `/empezar`                           | Redirige a `/` (es el link de la bio de Instagram)                                  |
| `/api/eventos`, `/api/leads`         | Medición propia del embudo (sendBeacon, sin cookies) y API de leads                 |

Estado y decisiones: [`AUDIT.md`](AUDIT.md) (auditoría y pasos del deploy), [`DECISIONS.md`](DECISIONS.md),
[`PROGRESS.md`](PROGRESS.md), [`ROADMAP.md`](ROADMAP.md) (fase 2 self-service) e [`IMAGENES.md`](IMAGENES.md)
(capturas que faltan). `docs/` guarda la historia de etapas anteriores.

## Stack

Next.js 16 (App Router, build con webpack por la CSP con SRI) · React 19 · TypeScript estricto · Tailwind CSS 4 ·
Zod · Supabase (Postgres) · Vitest + Testing Library · Playwright + axe · ESLint + Prettier. Sin librerías de
animación: el movimiento es CSS (transform y opacity) más un script inline con IntersectionObserver
(`src/lib/motion/script.ts`), y respeta `prefers-reduced-motion`.

> Esta versión de Next tiene cambios respecto de lo habitual: la documentación que corresponde está en
> `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Cómo correrlo

Requiere Node ≥ 22.12 y pnpm.

```bash
pnpm install
cp .env.example .env.local   # completar
pnpm dev                     # http://localhost:3000
```

| Script           | Qué hace                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| `pnpm dev`       | Servidor de desarrollo                                                          |
| `pnpm build`     | Build de producción (webpack)                                                   |
| `pnpm lint`      | ESLint                                                                          |
| `pnpm typecheck` | `tsc --noEmit`                                                                  |
| `pnpm test`      | Unit, componentes, API, guardas de capas/copy/colores                           |
| `pnpm test:e2e`  | E2E en 7 viewports: layout, configurador, axe, SEO, consola, rendimiento, demos |

La primera vez de E2E: `npx playwright install chromium`.

## Dónde se cambia cada cosa

- **Todo el texto visible** vive en `src/content/` (un test falla si hay texto suelto en JSX).
- **Proyectos** (casos, estado, capturas): `src/content/proyectos.ts`, el único manifiesto.
- **Configurador** (tipos, rubros, módulos, mensaje de WhatsApp): `src/content/configurador.ts`.
- **SEO** (títulos, JSON-LD, zona de atención): `src/content/seo.ts` y `src/content/landings.ts`.
- **Colores y tipografía**: `src/styles/editorial.css` (tonos `.tono-oscuro` / `.tono-claro`, utilidades `ed-*`).
  Nada de colores sueltos en componentes: lo verifica un test.
- **WhatsApp**: `src/lib/site-config.ts` (número por defecto; `NEXT_PUBLIC_WHATSAPP_NUMBER` lo pisa).

Capas (las controla un test): app > features > components/marketing > patterns > ui > content > brand > domain >
config > lib. Una feature no importa otra.

## Variables de entorno

Documentadas una por una en [`.env.example`](.env.example). En producción:

| Variable                                    | Para qué                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                      | Dominio canónico (default `https://webya.dev`)                           |
| `IP_HASH_SALT`                              | Sal para hashear la IP. **Obligatoria**: sin ella el servidor no arranca |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Eventos y leads. La service role nunca con `NEXT_PUBLIC_`                |
| `TELEGRAM_*`, `RESEND_API_KEY`, `NOTIFY_*`  | Avisos de leads de `/api/leads` (opcionales)                             |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`               | Opcional: pisa el número por defecto                                     |

Las variables del servidor se validan al arrancar (`src/instrumentation.ts` + `src/server/env.ts`). Las
`NEXT_PUBLIC_*` se incrustan en el build: cambiarlas exige volver a construir.

## Medición

`src/lib/analytics.ts` define los eventos (lista cerrada). `src/lib/medicion.ts` los manda con `sendBeacon` a
`/api/eventos`, que los guarda en la tabla `eventos` de Supabase sin datos personales. El embudo por día:
`select * from embudo_diario;` (visitas, eligieron tipo, mandaron el pedido, abrieron una demo).

## Desplegar en Vercel

1. Aplicar `supabase/migrations/` en el proyecto de Supabase (las últimas: `eventos` y `embudo_configurador`).
2. Cargar las variables de producción (tabla de arriba).
3. Dominio `webya.dev`: los pasos exactos están en `AUDIT.md` §5 (hoy Cloudflare apunta a otro servidor).
4. Verificar `/`, `/turnero`, `/demo/peluqueria`, `/robots.txt`, `/sitemap.xml`, y que la consola no muestre
   errores de CSP (`docs/adr/0001-csp-fija-con-sri.md`).
