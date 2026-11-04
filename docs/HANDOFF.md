# HANDOFF — WebYa /empezar (plataforma de autoservicio, prioridad Gastronomía)

Última actualización: 2026-11-04. Actualizar en cada checkpoint.

## Fases
- [x] Fase 0 — Diagnóstico (abajo)
- [x] Fase 1 — Limpieza inmediata (hecha; falta confirmar qué módulos se entregan y el número de WhatsApp)
- [~] Fase 2 — Rediseño de /empezar: estructura y fondos hechos; FALTA revisión visual a 375/1366 y limpiar decoración interna (ver Pendiente)
- [~] Fase 2B — Rubros flotantes: hecha la capa (91 rubros, deriva CSS, rotación, rubro elegido se enciende, parallax con mouse, reduced-motion). FALTA: ticker único, bloque "Ya lo usan" (requiere confirmar autorización de micios/abelardo), medición con CPU x4, revisar que en celular las palabras de arriba no compitan con el logo.
- [ ] Fase 3 — Flujo de creación Gastronomía (tenant, publicar, panel, footer "Creado con WebYa")
- [ ] Fase 4 — Auditoría por sección
- [ ] Fase 5 — Backend y lógica de negocio

## Fase 0 — Diagnóstico

**Real hoy**
- /empezar: landing + wizard que captura un *lead* (POST /api/leads, PATCH /api/leads/[id]) con rate limit, hash de IP, repos memory/file/supabase. Rubros (7) en `src/content/rubros`, módulos en `src/content/modulos.ts`.
- /demo/gastronomia: demo interactiva real en el cliente (carta, carrito, panel dueño, seguimiento), datos de ejemplo, estado en localStorage con sync entre pestañas. Dominio de pedidos con estados/totales/dinero en `src/domain/pedidos` (+ migración SQL `pedidos`).

**Maqueta / no existe**
- NO hay tenants, usuarios, auth, sesiones, panel de administración persistente, sitios publicados, slugs, subida de archivos, turnos con capacidad (la lógica de 15 min vive en el repo de la pizzería), pagos, footer "Creado con WebYa" en sitios de cliente.
- El wizard NO crea un sistema: sólo manda un lead para que WebYa contacte a la persona. La vista previa es un mockup (`PreviewNegocio`) más la demo aparte.
- `src/server/repositories/types.ts` tiene un TODO de multi-tenant: la tabla `leads` no tiene `tenant_id`.

**Persistencia backend**: sólo `leads` (y migración `pedidos`, sin uso desde un backend real; la demo usa localStorage).

## Decisiones
- El prompt pide eliminar el lenguaje visual "Plano" (grilla, cotas) que las etapas anteriores construyeron; la instrucción actual prima. El skill `webya-plano` quedó desactualizado.
- Solo `carta_qr` y `pedidos` quedan "disponible" (los que tienen demo funcionando); turnos, catálogo, formularios, pagos, clientes y avisos van "proximamente" y no se pueden activar. A confirmar con el dueño: si turnos/catálogo ya se entregan en micios, pasarlos a "disponible" en `content/modulos.ts`.
- Sin precios ni plazos inventados: la FAQ dice "te pasamos el precio antes de publicar". No se promete "gratis".
- Fases 3 y 5 requieren construir una plataforma (auth, DB multi-tenant, sitio público parametrizado). No existe base: son varias sesiones.

## Hecho (por archivo)
- Contacto: `lib/site-config.ts` (mail fijo studio.webya@gmail.com, IG @webya.dev, dominio webya.dev; WhatsApp por NEXT_PUBLIC_WHATSAPP_NUMBER; si falta, no se muestran botones de WhatsApp y el wizard dice "Ya tenemos tus datos").
- TODOs fuera: borrados `content/pendientes.ts`, `NotasPendientes`, `CasoReal`, `ComoTrabajamosConVos`, `AsiSeArma`, `config/flags.ts` y sus contenidos; limpiados `faq.ts` (5 preguntas reales), `footer.ts`, `hero.ts`, `pasos.ts`, `wizard-flujo.ts`, `marca.ts`, `instagram.ts`, pasos del wizard y `Wizard.tsx`.
- Legales: `/privacidad` y `/terminos` (`content/legal.ts`, `patterns/PaginaLegal.tsx`), enlazadas en el pie y en el paso de datos; en el sitemap.
- /empezar nueva (`app/empezar/page.tsx`): Hero crema "¿Qué negocio tenés?" con wizard arriba del fold → MiraLoQueCreas (preview por rubro) → QueIncluye (lista simple) → Faq → Cierre tinta → Footer tinta. `Seccion` ya no dibuja grilla (se ignora `plano`).
- Tests actualizados (faq, modulos, necesidades, hero, wizard, Seccion). Typecheck, eslint y `next build` OK; los tests unitarios pasan (los de Wizard necesitan `--testTimeout=20000` si la máquina está cargada).

## Hecho en la sesión 2
- `content/rubros-flotantes.ts` (91 rubros con `rubroWizard`; no se llamó rubros.ts porque ya existe la carpeta content/rubros), `components/marketing/RubrosFlotantes.tsx` + `.module.css` + test, `lib/eventos.ts` (EVENTO_RUBRO; el Wizard lo emite al elegir rubro), `page.tsx` envuelto en `.fondo-rubros` (globals.css vuelve transparentes las secciones crema).
- Hero: h1 "Creá el sistema de tu negocio." (antes duplicaba el título del paso 1); Nav con texto oscuro sobre crema (el logo se veía blanco).
- Verificado visualmente en desktop (Playwright instalado; para `next start` usar IP_HASH_SALT de 16+ caracteres). Las secciones `diferido` salen vacías en capturas fullPage (content-visibility): hay que scrollear antes de capturar.

## Hecho en la sesión 3 (Fase 2C parcial)
- `content/clientes.ts` + `YaLoUsan.tsx` (micios.com.ar y abelardo.vercel.app, sin capturas todavía), `content/precios.ts` (monto null: la FAQ dice "Te pasamos un presupuesto por WhatsApp, sin compromiso"), CTA único "Crear mi sistema", hero "Tu carta y tus pedidos, sin líos." con SEO alineado.

## Pendiente priorizado (Fase 2C sin hacer)
0. 2C: auditoría con puntajes; copy por resultados en los módulos; mensaje por rubro (3 dolores/3 beneficios por rubro en content/rubros); nombre del negocio + vista previa real de la plantilla antes del WhatsApp; capturas reales de clientes; sección "Por qué WebYa" y "Quién está detrás" (foto del fundador); objeciones junto a cada sección; eventos de embudo y UTM al lead; og:image real; medir LCP; botón flotante de WhatsApp (si hay número).

## Pendientes del dueño
Precios (content/precios.ts), foto y nombre del fundador, más clientes, número de WhatsApp, qué módulos se entregan.

## Pendiente (resto)
1. **Fase 2 (resto)**: revisar a fondo 375px (el fold se vio bien; falta recorrer el resto scrolleando); quitar decoración interna que sigue en `MarcoDispositivo`, `PreviewNegocio`, `MiraLoQueCreas.module.css`, `StepResultado`, `SlotImagen`, `globals.css` (cotas/registro) y `brand/ilustracion/plano/*`; sacar el efecto "encastre" restante; un solo acento (naranja) solo en CTAs y estados activos; reemplazar el mockup por el sitio real de la plantilla (iframe o render de `DemoCliente`) que cambie con rubro/paleta.
2. Actualizar e2e (`e2e/layout.spec.ts`, capturas visuales) a la página nueva.
3. **Fase 3**: orden sugerido: modelo de datos (negocio, usuario, producto, categoría, promo, horario, pedido, turno, módulos activos) en Supabase con `tenant_id` + RLS → auth → API de borrador/publicación con zod → ruta pública `/n/[slug]` que renderiza la plantilla de `features/demo/gastronomia` parametrizada por config → panel del dueño → footer "Creado con WebYa" (`webya.dev/empezar?ref={slug}`, apagable por plan) → link + QR (ya existe `CodigoQR`).
4. Fases 4 y 5 después de la 3. Ya existe: rate limit + hash de IP en leads, dominio de pedidos con estados y dinero en centavos. Pagos: el cobro de la demo es simulado y NO se ofrece.
5. Copy final (skill webya-copy-comercial), OG image, README (menciona variables viejas) y `.env.example`.

## Variables de entorno
NEXT_PUBLIC_WHATSAPP_NUMBER (opcional), NEXT_PUBLIC_SITE_URL (default https://webya.dev), IP_HASH_SALT (obligatoria en producción), SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (producción), LEAD_REPOSITORY, RATE_LIMIT_*. NEXT_PUBLIC_CONTACT_EMAIL ya no se usa.

## Cómo correr
`pnpm install`, `pnpm dev`; `pnpm lint && pnpm typecheck && pnpm test && pnpm build` al cerrar fase.

## Bugs conocidos
- Tests de Wizard con timeout de 5 s bajo carga (no es de lógica).
- Sin verificación visual de la nueva /empezar.
