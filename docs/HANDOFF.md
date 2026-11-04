# HANDOFF — WebYa /empezar (plataforma de autoservicio, prioridad Gastronomía)

Última actualización: 2026-11-04. Actualizar en cada checkpoint.

## ESTADO ACTUAL / PRÓXIMO PASO EXACTO
- Bloque 4 (correcciones urgentes): HECHO. RubrosFlotantes solo palabras (sin íconos), capa a 20% (≈2,2% efectivo) fuera de hero y cierre (IntersectionObserver sobre #hero-title y #cta-final), rubro activo naranja a 15% y neutro fuera del hero; tarjeta del wizard opaca; "Ya crearon" con captura grande de página completa (CapturaCliente: recorte 30-32rem, desliza 14 s con translateY, pausa fuera de pantalla/hover/foco, quieta con reduced-motion); capturas recapturadas a 375px (micios 43 KB, abelardo 42 KB, fonosanjorge 111 KB recortada a 4200 px de alto). Se quitó el SplashLogo de /empezar (tapaba el CTA en el primer frame; lo reemplaza el telón del bloque 5). Autopuntaje: diseño 8, claridad 8, rendimiento 8. Typecheck, lint, 1137 tests y build verdes.
- Siguiente: bloque 5 (intro "El telón") detrás de NEXT_PUBLIC_INTRO_LOGO=1; luego 6, 7, 3.
- Decisión: "Creado con WebYa" NO va en Ya crearon (hoy es falso).

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
- `content/clientes.ts` + `YaLoUsan.tsx` (miciospizzas.com.ar y abelardo.vercel.app, sin capturas todavía), `content/precios.ts` (monto null: la FAQ dice "Te pasamos un presupuesto por WhatsApp, sin compromiso"), CTA único "Crear mi sistema", hero "Tu carta y tus pedidos, sin líos." con SEO alineado.

## Hecho en la sesión 4
- 2C-b: hero genérico "Tu negocio online, armado con vos."; `content/rubros/mensajes.ts` (titular, descripción y 3 beneficios por cada uno de los 7 rubros; solo gastronomía `listo: true`, los demás dicen "Lo armamos con vos") y `MensajeRubro.tsx` (aparece bajo el hero al elegir rubro, escucha EVENTO_RUBRO).
- 2C-a (auditoría PARCIAL, sin recorrer 375px completo; puntajes de lo visto en desktop y en el fold móvil): hero 7, wizard 7, vista previa 5 (mockup, no la plantilla real), módulos 6, prueba social 4 (sin capturas), FAQ 6, cierre 6. Peores razones de no convencer: 1) la vista previa no es el sitio real con el nombre del negocio; 2) prueba social sin capturas; 3) no hay "Por qué WebYa" ni persona detrás; 4) el mensaje por rubro está recién cableado y sin medir; 5) sin eventos de embudo ni medición de LCP.
- Datos del dueño: el bloque llegó sin completar (placeholder): todo lo que depende de ellos queda PENDIENTE (precios, fundador, capturas, WhatsApp).

## Hecho en la sesión 5
- Capturas: `public/clientes/abelardo.webp` (375px, real). miciospizzas.com.ar NO resolvió DNS desde esta máquina: falta su captura (Micio's se muestra sin imagen; cargarla en `content/clientes.ts` campo captura/alt).
- `PorQueWebya.tsx` + `content/por-que-webya.ts` (4 puntos ciertos + 3 objeciones con enlace a /privacidad; FUNDADOR = null, el bloque no se muestra hasta cargar nombre y foto).
- Header nuevo (`Nav.tsx`): barra fija con línea, logo, "Ver ejemplos" y CTA naranja; sin interruptor de tema. Hero con titular + bajada.
- Fondo: RubrosFlotantes ahora dibuja íconos SVG del set propio (cubiertos, tijera, tienda, portafolio, pesa, llave y otros) con el nombre del rubro; el rubro elegido se enciende en naranja.
- 2C-e: el UTM ya se guarda en el lead (lib/utm.ts) y la og:image ya sale de SEO_EMPEZAR. Falta un evento "cliente_abierto" al abrir un sitio de Ya lo usan.
- Medición mobile 375px, CPU x4, red 4G lenta: LCP 0,7-0,9 s (el H1), CLS 0.
- Detalle visual: en desktop los íconos se transparentan detrás de la tarjeta del wizard; conviene volverla opaca.

## Hecho en la sesión 6
- Paso 1 completo: `content/clientes.ts` (3 clientes verificados mirando los sitios: Micio's miciospizzas.com.ar, Abelardo, Fonosanjorge; capturas webp < 30 KB en public/clientes/; `clientesPorRubro()` agrupa y omite rubros sin clientes; test en clientes.test.ts) y `YaCrearon.tsx` (índice editorial, sin cards; enlace `EnlaceCliente` que mide el evento `cliente_abierto`). Reemplaza a YaLoUsan.
- Se quitó la línea "Cada sitio lleva Creado con WebYa": hoy es FALSO (los sitios de clientes dicen "Creado con Micio's/Abelardo"). Volver a ponerla cuando la Fase 3 publique sitios con ese pie.
- Verificado en 1366px y 375px (sin scroll horizontal). Build, lint, typecheck y 1137 tests verdes.
- NO hecho de la sesión: Paso 2 (resto: Por qué WebYa ya existe como lista editorial; faltan objeciones junto a cada sección), Paso 3 (vista previa real), Paso 4 (limpieza, ticker, e2e), Paso 5 (Fase 3).

## Pendiente priorizado (Fase 2C sin hacer)
0. 2C: copy por resultados en los módulos; nombre del negocio + vista previa real de la plantilla antes del WhatsApp; capturas reales de clientes; sección "Por qué WebYa" y "Quién está detrás" (foto del fundador); objeciones junto a cada sección; eventos de embudo y UTM al lead; og:image real; medir LCP; botón flotante de WhatsApp (si hay número).

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
