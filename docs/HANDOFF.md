# HANDOFF — WebYa /empezar (plataforma de autoservicio, prioridad Gastronomía)

Última actualización: 2026-11-04 (sesión 2). Actualizar en cada checkpoint.

## ESTADO ACTUAL / PRÓXIMO PASO EXACTO
- SESIÓN 2026-11-06 ("maxear todo y vender"). Auditoría completa, hallazgos y pendientes en **docs/auditoria-2026-11.md**: leela primero.
  - Hero nuevo en tinta: titular "Tu negocio atiende mientras vos trabajás.", celular con el sitio de cada rubro y ticket de lo que entra (`marketing/VitrinaRubros`, `ControlVitrina`). El h1 vive dentro de `Marco` (prop `encabezado`), visible solo en la pantalla 1.
  - El telón sigue encendido por defecto, pero DESPUÉS del hero, antes de los casos de clientes: usa `view-timeline` propio. El dueño lo había pedido al inicio; se movió porque tapaba el mensaje. Si lo quiere de nuevo primero, se conversa.
  - `patterns/SitioNegocio` dibuja la plantilla del rubro. Es uno solo para vitrina, wizard, `/crear` y `/ver`. Usa `data-sitio`, no `data-rubro`: `data-rubro` es de las tarjetas y lo escuchan WizardLazy y ControlVitrina.
  - `/demo/peluqueria`: bot por reglas con texto libre, agenda y estadísticas. Reglas en `domain/turnos/` (agenda, bot, estadísticas, con tests); datos con semilla fija en `content/demos/peluqueria/datos.ts`.
  - `/crear` + `/ver`: editor sin cuenta; el borrador viaja en el hash del link (`features/empezar/crear/borrador.ts`). NO es publicación real. `/ver` no se indexa y lleva cartel de "no publicado".
  - Backend: avisos reales por Telegram/Resend (`server/notifications.ts`), reenvíos sin duplicar (`renovarParcial`, mismo WhatsApp + IP + negocio en 30 min), medición propia (`POST /api/eventos`, `lib/medicion.ts`, vista `embudo_diario`).
  - Módulos: `turnos` y `catalogo` pasaron a `disponible`. `turnos` hoy significa el bot de peluquerías.
  - Skills nuevas: seo-audit, schema, signup, analytics, pricing, onboarding, web-design-guidelines (ver .claude/skills/TERCEROS.md).
  - PENDIENTE DEL DUEÑO: credenciales de avisos en Vercel, aplicar las dos migraciones del 2026-11-06, revisar lo que se dice del bot, dominio webya.ar vs webya.dev, precios, fundador. Detalle en la auditoría.
  - SIGUIENTE técnico: publicación real (tenants, auth, `/n/[slug]`, moderación) solo si el dueño lo decide; copy de `instagram.ts` y del video.
  - E2E: la suite normal compila con `NEXT_PUBLIC_INTRO_LOGO=0`; el telón (encendido en producción) solo lo cubre `intro.spec.ts` con `NEXT_PUBLIC_INTRO_LOGO=1 E2E_INTRO=1`.
- SESIÓN 3 (pedido del dueño: "agregá Petrucci y que el telón se vea épico"): 
  - Cliente nuevo Joyería Petrucci (https://joyeria-petrucci-web.vercel.app, rubro comercio, datos verificados mirando el sitio: catálogo por categorías joyería/relojes/marroquinería/mates, novedades, consulta por WhatsApp por producto, marcas, trabajos a medida, dirección con mapa). Capturas public/clientes/petrucci.webp (59 KB) y telon-petrucci.webp.
  - La intro del telón pasa a estar ENCENDIDA por defecto (el dueño lo pidió: "no hiciste lo del telón"). Se apaga con NEXT_PUBLIC_INTRO_LOGO=0. Telon.tsx: INTRO_ACTIVA = flag !== '0'. Rótulos del telón con rangos calculados por cliente (--ini/--fin), ya no fijos para 3. Entrada animada: la pared aparece con fundido (un zoom continuo "respira" bajó los fps de 57 a 41 y se quitó). playwright.config fija NEXT_PUBLIC_INTRO_LOGO='0' para el suite normal (la intro empuja el hero 200vh); intro.spec.ts corre con NEXT_PUBLIC_INTRO_LOGO=1 E2E_INTRO=1 (build propio).
  - Riesgo abierto: no se probó en el navegador de Instagram real; si falla, apagar con =0 en Vercel.
  - Si quedó a medias: verificar con pnpm typecheck && pnpm lint && pnpm exec vitest run && build; correr e2e (suite normal y luego intro.spec); capturas 375/1366; commit.
- SESIÓN 2 (A-E hechos; commits 842f2fd, b481ca9 y siguientes). Resumen:
  - A) Vista previa REAL: features/demo/gastronomia/VistaPreviaCarta.tsx (+ VistaPreviaCartaLazy con next/dynamic, ssr false, alto reservado) monta la misma Carta de /demo con el nombre escrito y la paleta curada, aviso "platos y precios de ejemplo" (PREVIEW.deEjemplo). Capas: la página (app) pasa la carta a WizardLazy → Wizard por la prop VistaPrevia, así features/empezar no importa features/demo. ORDEN_POR_DEFECTO pasó a 'b' (rubro → nombre con carta armándose → WhatsApp recién al tocar el CTA; ?orden=a conserva el viejo). Una sola carta montada (useEsLg: aside en lg, inline en celular). Rubros sin plantilla: PreviewPanel plano (nombre + piezas en líneas). Pendiente: otros rubros no tienen plantilla real (solo Gastronomía); los 3 cocinas de ejemplo usan la por defecto.
  - B) Limpieza: borrados MarcoDispositivo, PreviewNegocio(+Diferido, test), SlotImagen, brand/ilustracion/plano/*, MiraLoQueCreas(+css, content), VitrinaPlano y las secciones Plano de /sistema, variante 'imagen' de Seccion, keyframes de plano. StepResultado → StepVistaPrevia (sin selector celular/computadora). Quedan solo referencias históricas en docs/*.md antiguos y la clase .encastre de globals.css (sin uso en src; borrar si se confirma).
  - C) RubrosFlotantes: con la intro encendida están ocultas mientras [data-telon] está en pantalla (data-intro). Con la intro apagada, sin cambios. En secciones con texto la capa ahora está OCULTA (opacity 0), solo visible en hero y cierre.
  - D) e2e actualizado: layout.spec.ts reescrito, intro.spec.ts nuevo (solo corre con NEXT_PUBLIC_INTRO_LOGO=1 E2E_INTRO=1; build propio), helpers en orden A (irAlPaso agrega ?orden=a), explicativo/visual del video desde /demo/gastronomia (el botón ya no está en /empezar), capturas regeneradas en los 7 viewports.
  - E) Lighthouse móvil (lighthouse 12, Moto G lento 4G simulado, intro apagada): performance 96, accesibilidad 97, buenas prácticas 100, SEO 100; LCP 1,7 s, CLS 0, TBT 200 ms. Única falla de contraste: las palabras decorativas aria-hidden de RubrosFlotantes (a propósito casi transparentes). Axe (e2e) sin violaciones en todos los pasos. Intro encendida (Chromium headless, CPU x4): 375px 57 fps, 1366px ~30 fps por render por software.
  - Bugs corregidos en el camino: .papel no redefinía --danger (errores en rosa claro sobre crema, falla AA) → tokens/css.ts lo fija a rosa-700 y se regeneró tokens.css; el pie decía "Digitalizá/Todo lo digital/a medida" (jerga prohibida) → ahora "Tu negocio online, armado con vos."; "Lo armamos a medida" → "Lo armamos con vos". Pendiente de copy: content/instagram.ts, content/explicativo/escenas.ts y content/empezar/{como-funciona,a-medida,hero-variantes}.ts todavía usan "Digitalizá/todo lo digital/a medida" (no visibles en /empezar salvo el video de la demo).
  - Autopuntaje sesión 2: A 8 (carta real, falta más de un rubro), B 9, C 9, D 8, E 8.
- PENDIENTE PRIORITARIO: (1) probar la intro en un preview de Vercel desde el navegador de Instagram y recién ahí encender NEXT_PUBLIC_INTRO_LOGO=1; (2) copy residual con jerga (ver arriba) y "módulos" en la UI; (3) plantillas reales para otros rubros; (4) Fase 3a (modelo de datos + auth): NO empezada; (5) og:image revisada; (6) medir la intro en GPU real.
- Siguiente: Fase 3a solo si se puede cerrar con build verde; si no, copy residual.
- Sesión 1 (bloques 4, 5, 6 y 7 parcial): ver el historial de git (aa3e0ca, 4370d45, b6619d9, 5b91732). Resumen: palabras flotantes sin íconos, Ya crearon con CapturaCliente (captura de página completa que desliza), intro El telón detrás del flag, objeciones junto a cada sección, ticker de rubros, evento paso_completado.
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
