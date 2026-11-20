# AUDIT V3 — estado del repo al 2026-11-20

Auditoría del **código del repo** (rama `main`, `5044ab3`), no del deploy de `webya-empezar.vercel.app`,
que puede ir atrasado. Base: V2, Proyectos y Zona ya aplicados y en `main`.

## 1. Inventario

**Rutas (todas SSG salvo la API):** `/`, `/turnero`, `/pedidos`, `/tienda`, `/web`, `/campo`, `/proyectos`,
`/proyectos/[slug]`, `/demos`, `/demos/{pedidos,turnos,web,tienda}`, `/armar`, `/zona`, `/nosotros`,
`/privacidad`, `/terminos`, `not-found` (404 diseñada), `error`, `loading`, `sitemap.xml`, `robots.txt`,
`opengraph-image` (global y de /zona), `icon.svg`, `apple-icon`.
API: `POST /api/leads`, `PATCH /api/leads/[id]` (completar lead parcial), `POST /api/eventos` (embudo).

**Piezas:** `src/components/marketing/editorial/*` (hero, buscador, avisos, casos, mapa, barra del celular,
contacto rápido con el avión), `src/features/configurador`, `src/features/demo/{pedidos,turnos,web,tienda}`,
`src/server` (leads, eventos, rate limit, avisos por Telegram/Resend), contenido en `src/content`.

**Calidad:** 751 tests unitarios, 17 specs E2E × 7 viewports, guardas de capas, hex, textos en JSX y
dígitos en el copy. Presupuesto de JS inicial 160 KB gzip.

## 2. Lo que ya funciona (verificado en el código)

- Problemas de la lista V3 ya resueltos: no queda "Armá esto", "Todavía sin uso", "Ver demo de mi rubro",
  `#zona` ni `webya-empezar.vercel.app` en el código; "pedidos,tus" está resuelto en `TituloPalabras`;
  canonical fijo en `webya.dev` (`lib/site-config.ts`); WhatsApp en la barra del celular y en el cierre.
- Buscador con combobox accesible, palabras de relleno, plurales y salida a WhatsApp.
- Demos con barra "esto es una demo", **Reiniciar**, y datos de ejemplo marcados.
- Configurador en 3 pasos con resumen en vivo, botón "Enviarnos mi pedido por WhatsApp" y salida por mail.
- 404 y error diseñadas; JSON-LD de negocio, de /zona y de casos; sitemap y robots.
- Embudo propio sin cookies (`sendBeacon` a `/api/eventos`).

## 3. Bugs y riesgos

| # | Problema | Gravedad |
|---|---|---|
| B1 | **Los contactos dependen de Supabase.** Si la base falla o no está configurada, el aviso no sale y el contacto se pierde. Julián no quiere un proyecto nuevo en Supabase. | Alta |
| B2 | En Vercel faltaba `IP_HASH_SALT` (19/11): en producción `/api/leads` no levanta → el formulario responde error. | Alta |
| B3 | El configurador solo abre WhatsApp: si no abre (navegador interno de Instagram, escritorio sin WhatsApp) no hay plan B para dejar el número; el mensaje para copiar no existe. | Media |
| B4 | Sin `manifest.webmanifest` (la PWA mínima y el `theme-color` por esquema). | Baja |
| B5 | Los avisos de la home salen por reloj (1,8 s), no por lo que la persona está mirando. | Media |
| B6 | `PIE.lema` "…trabajar en serio." suena genérico y no es la línea de marca. | Baja |
| B7 | El configurador no toma el teclado en cuenta: la barra fija puede quedar tapada en iOS. | Media |

## 4. Textos

- La línea de marca **"Creá. Digitalizá. Crecé."** está en una franja *debajo* del hero, no es lo primero
  que se lee. El H1 actual ("Turnos, pedidos y ventas online, armados para tu negocio.") pasa a ser la
  frase de venta debajo del lema.
- La zona se dice una vez en el hero (`MARCA.zona`) y en /zona: bien. Revisar que el pie no la repita.
- Bajadas del configurador correctas ("Tres pasos, un toque cada uno") — no dice "sin formularios".

## 5. Móvil

- Hero móvil: lema + bajada + CTA + buscador + lista de rubros: la lista de rubros empuja la pieza de
  producto fuera de la pantalla. Se reemplaza por los atajos del buscador y un celular que asoma abajo.
- Barra inferior fija existe (Escribinos + Armá tu sistema). Falta ocultarla cuando hay un campo con foco.
- Sin barra de progreso de lectura ni avisos según la sección.

## 6. Plan priorizado (una fase = un commit o un grupo chico de commits)

1. **Contactos a prueba de fallas** — base Neon (Postgres creado desde Vercel), tablas que se crean solas,
   aviso por Telegram/mail aunque la base falle, sal derivada si falta `IP_HASH_SALT`. (B1, B2)
2. **Hero de marca** — "Creá. Digitalizá. Crecé." como H1 con entrada escalonada, frase de venta, buscador,
   dos acciones, franja de prueba real y celular con la notificación "Nueva reserva". La franja Manifiesto
   pasa a contar escenas reales (dolor → alivio), sin repetir el lema.
3. **Buscador** — placeholder que rota ejemplos, tolerancia a errores de tipeo, atajos (chips) y
   preselección de rubro/tipo en `/armar`.
4. **Móvil** — sugerencias según la sección (máx. 1 visible, 3 por visita, no vuelve si se cierra),
   barra de progreso discreta, barra fija que se oculta con un campo en foco, push simulado en el turnero.
5. **Configurador** — plan B (mensaje para copiar + dejar el número), teclado y safe-area. (B3, B7)
6. **Cierre** — manifest, lema en pie y metadata, documentos (`DECISIONS`, `PROGRESS`, `COPY_ALTERNATIVAS`,
   `ROADMAP`, `RELEASE_CHECKLIST`), suite completa y capturas en 7 anchos.

## 7. Herramientas

Ya instaladas en el repo: Playwright, `@axe-core/playwright`, `@next/bundle-analyzer`; SVGO se usa por
`scripts/optimizar-logo.mjs` (npx). Lighthouse se corre por `npx lighthouse` (la máquina local es lenta:
se mide contra referencia, ver DECISIONS). No hace falta instalar un MCP: Playwright saca las capturas.

## 8. Referencias de marca

No existe `/design-refs`. Se usan las capturas de Instagram que Julián pasó en el chat (lema
"Creá. Digitalizá. Crecé." con tildes y puntos, "Tu negocio. Nuestra tecnología.").
