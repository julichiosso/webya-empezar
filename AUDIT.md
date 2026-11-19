# AUDIT — Webya (webya.dev) · 2026-11-19

Auditoría hecha antes de tocar código, sobre `main` en `74ff2f1`. Repo: `julichiosso/webya-empezar`.

## 1. Inventario

**Stack.** Next 16.4.3 (App Router, `next build --webpack` por SRI), React 19.3, TypeScript estricto, Tailwind 4
(tokens propios generados desde `src/brand/tokens`), Zod 4, Supabase JS (solo servidor), `motion` 14 (solo en la
demo, el wizard y `/sistema`), Vitest + Testing Library, Playwright + axe. Fuente: Outfit por `next/font/google`
con precarga manual (`src/brand/tipografia/fuente.ts`).

**Rutas.**

| Ruta | Qué es | Estado |
| --- | --- | --- |
| `/` | No existe: `next.config.ts` redirige (307) a `/empezar` | sin contenido propio |
| `/empezar` | Landing del link de Instagram: hero + wizard de lead, telón, rubros flotantes, ticker, casos, FAQ | funciona |
| `/demo/gastronomia` | Demo interactiva de carta + pedidos + panel del dueño (estado en localStorage) | funciona |
| `/marca`, `/sistema` | Páginas internas del sistema de marca anterior (naranja/crema) | internas |
| `/privacidad`, `/terminos` | Legales | funcionan |
| `/api/leads` POST, `/api/leads/[id]` PATCH | Alta y completado de leads: Zod, rate limit, IP hasheada, honeypot, repos memory/file/supabase | funciona |
| `robots.txt`, `sitemap.xml`, `icon.svg`, `apple-icon`, OG de `/empezar` | SEO | funcionan |

**Componentes.** `src/components/marketing/*` (Nav, Hero, Telon, RubrosFlotantes, TickerRubros, YaCrearon,
CapturaCliente, PorQueWebya, Objeciones, QueIncluye, Faq, Cierre, Footer, StickyCta), `src/components/ui/*`
(Button, Campo, Eleccion, Interruptor, Dialogo, Hoja, Acordeon…), `src/features/empezar/*` (Wizard de 4 pantallas),
`src/features/demo/gastronomia/*`, `src/features/explicativo/*` (video narrado de la demo).

**Datos / contenido.** Todo el texto vive en `src/content/*`. Clientes verificados en `content/clientes.ts`
(Micio's, Abelardo, Fonosanjorge, Joyería Petrucci) con capturas `public/clientes/*.webp` (375 px, 46–122 KB).

**Variables de entorno.** `NEXT_PUBLIC_SITE_URL` (default `https://webya.dev`), `NEXT_PUBLIC_WHATSAPP_NUMBER`
(**vacía: no hay número cargado en ningún lado del repo**), `NEXT_PUBLIC_INTRO_LOGO`, `IP_HASH_SALT`
(obligatoria en producción), `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `LEAD_REPOSITORY`, `RATE_LIMIT_*`.

**Integraciones.** WhatsApp por `wa.me` (solo si hay número). Analítica abstracta sin proveedor (`lib/analytics.ts`,
sinks). Supabase para leads. Sin pagos, sin auth, sin multi-tenant.

**Seguridad.** CSP fija + SRI (ADR 0001), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`,
`Permissions-Policy`, `poweredByHeader: false`. Sin secretos con prefijo `NEXT_PUBLIC_`.

## 2. Qué funciona y se conserva

- Capa de seguridad completa (CSP/SRI/headers) y la API de leads (validación, rate limit, hash de IP).
- `/demo/gastronomia`: es la mejor prueba interactiva que hay; pasa a ser "Ver demo" de pizzerías.
- Disciplina de rendimiento: Lighthouse móvil medido en la sesión anterior 96/97/100/100, LCP 1,7 s, CLS 0.
- Contenido real y verificado de clientes, legales, tests unitarios (1100+), e2e con axe.
- Regla de la casa: nada de datos inventados (precios, cifras, testimonios). Se mantiene.

## 3. Problemas técnicos

1. **Build roto (bloqueante).** `next build` con Next 16.4.3 corta con `SecurityFatalError`:
   `pnpm audit` confirma GHSA-mfr8-8qww-v76h y GHSA-vc7v-qv4w-wrv8 (moderadas, parcheadas en ≥16.4.5).
   Ningún deploy nuevo podía salir. **Resuelto en la Fase 1: Next y eslint-config-next a 16.4.6.**
2. `/` no tiene página: depende de un redirect. Si el proyecto de Vercel tiene mal el preset, la raíz da 404.
3. Doble lenguaje visual: naranja/crema (`/empezar`) vs. lo que pide la marca nueva (negro y blanco).
4. Grano de ruido fijo en `body::before`, palabras flotantes casi transparentes (única falla de contraste de
   Lighthouse), telón de intro que empuja el hero 200vh: decoración que cuesta FPS y atención.
5. Outfit con precarga por nombre de archivo hasheado a mano: frágil al cambiar de fuente.
6. Código de experimento (orden A/B del wizard), copy con jerga residual ("Digitalizá", "a medida") en
   `content/instagram.ts`, `content/explicativo/*` y `content/empezar/{como-funciona,a-medida,hero-variantes}.ts`.
7. SEO: sin JSON-LD de negocio (`Organization`/`ProfessionalService`/`Service`), sin `areaServed`, sin páginas por
   servicio, una sola página indexable con contenido comercial.

## 4. Problemas de conversión y marketing

- El hero habla de "tu negocio online" en general: no nombra lo que se vende (tienda, pedidos, turnero).
- El **turnero con seña** (producto estrella) no aparece en ningún lado.
- No figura la **zona de atención** (San Jorge, San Francisco) ni que detrás hay una persona: Julián.
- El wizard pide nombre y WhatsApp del cliente antes de darle valor: fricción. Sin número de WhatsApp de WebYa
  configurado, el CTA final ni siquiera abre WhatsApp.
- Micio's se presenta como "carta con buscador", pero el sistema real tiene carrito, PWA, panel, franjas de
  15 minutos e impresión de comandas: se está vendiendo por debajo de lo que existe.
- Faltan Peluquería Canina (turnero + Mercado Pago) y el estado real de Abelardo (en construcción).

## 5. Estado del deploy (el 404)

Medido hoy:

| URL | Respuesta | Quién responde |
| --- | --- | --- |
| `https://webya-empezar.vercel.app/` | 307 → `/empezar` → 200 | Vercel (funciona) |
| `https://webya.dev/` y `https://www.webya.dev/` | **404** | **Cloudflare → nginx/1.24.0 (Ubuntu)** |

**Causa:** el dominio `webya.dev` no apunta a Vercel. El DNS está en Cloudflare con proxy y el origen es un
servidor nginx que no tiene el sitio. No es un problema del código ni de `next.config`.
**Causa secundaria:** con Next 16.4.3 cualquier build nuevo fallaba (punto 3.1), así que aunque el dominio
apuntara bien, los cambios no iban a publicarse.

**Arreglo en el repo (hecho):** Next parcheado; `/` con página propia (ya no depende de un redirect);
`vercel.json` con `framework: nextjs` explícito para que un preset mal puesto no sirva `public/` y dé 404.

**Arreglo fuera del repo (lo tiene que hacer Julián, toca producción):**
1. Vercel → proyecto `webya-empezar` → Settings → Domains → agregar `webya.dev` y `www.webya.dev`.
2. Cloudflare → DNS de `webya.dev`: reemplazar el registro que apunta al servidor nginx por
   `A @ 76.76.21.21` y `CNAME www cname.vercel-dns.com`, con la nube en **gris (DNS only)**.
   Si se deja el proxy naranja, SSL/TLS tiene que estar en **Full (strict)** o hay bucles de redirección.
3. En Vercel → Environment Variables (Production): `NEXT_PUBLIC_SITE_URL=https://webya.dev`,
   `NEXT_PUBLIC_WHATSAPP_NUMBER`, `IP_HASH_SALT` (16+ caracteres). Redeploy.

## 6. Plan priorizado (impacto / esfuerzo)

| # | Mejora | Impacto | Esfuerzo |
| --- | --- | --- | --- |
| 1 | Next parcheado + `/` real + `vercel.json` (deploy) | crítico | bajo |
| 2 | Sistema visual negro/blanco, Geist, tonos por sección, motion CSS + un solo observer | alto | medio |
| 3 | Configurador "Armá tu sistema" (3 toques → WhatsApp prellenado, cero requests) | crítico | medio |
| 4 | Home editorial: hero, marquee, bento, turnero sticky, pedidos, proyectos, rubros, proceso, FAQ, cierre | alto | alto |
| 5 | Manifiesto de proyectos con placeholders vectoriales | alto | medio |
| 6 | SEO local: JSON-LD, metadata, OG, sitemap, landings `/turnero`, `/pizzerias`, `/tiendas` | alto | medio |
| 7 | `/empezar` → `/` (el link de Instagram sigue andando), demo apuntando al configurador | medio | bajo |
| 8 | e2e nuevos de la home (sin desborde en 6 anchos, flujo del configurador, axe) | medio | medio |
| 9 | QA: Lighthouse móvil ≥ 95 en las 4, consola limpia | alto | medio |
| 10 | Borrar el legado de `/empezar` (wizard, telón, rubros flotantes) | medio | alto → `ROADMAP.md` |
