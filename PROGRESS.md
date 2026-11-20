# PROGRESS — Webya V2 (de "bueno" a "abismal")

- [x] Fase 1 — Auditoría V2 (`AUDIT_V2.md`)
- [x] Fase 2 — Sistema visual: sin sombras, brillos ni degradados; tipografía y subrayados estilo Apple
- [x] Fase 3 — Home corta (hub) + páginas propias + menú completo + barra inferior en celular + copy en "nosotros"
- [x] Fase 4 — Velocidad y pantalla de carga con el logo vectorial
- [x] Fase 5 — Demos: hub `/demos`, página web y tienda en vivo
- [x] Fase 6 — Configurador `/armar` mejorado
- [x] Fase 7 — SEO (JSON-LD completo, sitemap) y accesibilidad
- [x] Fase 8 — Verificación visual (360, 390, 768, 1024, 1440, 1920), reporte final y lista de imágenes

## Reporte final V2 (2026-11-19)

**Qué cambió**

- **Home hub** de cinco bloques (antes ~14 pantallas en el celular, ahora 5,4 con el pie): en la primera pantalla,
  titular, "Armá tu sistema", "Ver demo" y los cinco rubros con su demo (verificado en 360 × 844).
- **Páginas propias**: `/turnero`, `/pedidos`, `/tienda` (+ catálogo), `/web`, `/proyectos`, `/nosotros`, `/zona`
  (mapa SVG propio con las localidades), `/armar` y `/demos`. Redirecciones desde las rutas viejas.
- **Menú completo**, menú de celular a pantalla completa y barra fija abajo con "Escribinos" / "Armá tu sistema".
- **Visual**: sin destellos, latidos, degradados ni sombras; teléfono plano; subrayados y tipografía estilo Apple;
  dos jerarquías de botón; el lima solo como anillo de foco.
- **Copy** en plural, tres CTAs fijos, sin duplicados, mensajes de WhatsApp sin nombres; discurso para
  gastronomía, peluquería y estética, salud, comercios y servicios.
- **Quiénes somos** con Julián (UTN) y el proceso en cuatro pasos (foto pendiente: hoy van sus iniciales).
- **Demos**: pedidos, turnos, **página web por rubro** y **tienda en vivo** (nueva).
- **Pantalla de carga** con el logo que se escribe en SVG, solo si la carga tarda más de 450 ms.
- **SEO**: canonical fijo a webya.dev, metadata por página, JSON-LD con Organization, ProfessionalService,
  Person, WebSite y Service, `areaServed` con cada localidad.

**Verificación**

- Unit: 743 tests en verde (44 archivos), con las guardas de capas, copy, colores y texto en JSX.
- E2E (Playwright, 7 tamaños: iPhone SE, iPhone 15, Pixel 7, iPad Mini, 1280, 1440, 1920): 453 pasan, 90 se
  saltean a propósito (pruebas de un solo tamaño). axe WCAG 2.2 AA sin violaciones en las 15 rutas, consola limpia
  en todas, configurador, demos, menú, redirecciones y SEO.
- Capturas en 360, 390, 768, 1024, 1440 y 1920 px de las 12 páginas: **0 px de desborde** en las 72.
- Lighthouse móvil local (i3, `benchmarkIndex` ~1600): **97 / 100 / 100 / 100** con CPU 2× (antes 89–93) y
  86 / 100 / 100 / 100 con CPU 4× (antes 74). CLS 0. El número definitivo es PageSpeed Insights sobre el deploy.

**Pendiente (de Julián, no es código)**

- DNS de `webya.dev` → Vercel (`AUDIT.md` §5).
- Imágenes: foto de Julián y captura de Peluquería Canina (lista exacta en `IMAGENES.md`).
- Logo en vector limpio, testimonios reales con permiso, migraciones de Supabase.

---

# PROGRESS — Rediseño Webya (V1)

| Fase | Qué                                                                                                                                                                | Estado             |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| 1    | Auditoría (`AUDIT.md`), Next parcheado (el build fallaba), `vercel.json`, diagnóstico del 404                                                                      | hecho              |
| 2    | Sistema visual negro/blanco, Geist, tonos por sección, logo `<webya>`, motion sin librerías                                                                        | hecho              |
| 3    | Home editorial: hero, marquesina, bento, turnero sticky, pedidos split, cita y cifras, carril de proyectos, índice de rubros, cómo trabajo, preguntas, cierre, pie | hecho              |
| 4    | Configurador "Armá tu sistema" → WhatsApp prellenado (cero requests)                                                                                               | hecho              |
| 5    | SEO local: JSON-LD, metadata, OG con Geist, sitemap, landings `/turnero`, `/pizzerias`, `/tiendas`                                                                 | hecho              |
| 6    | `/empezar` → `/`, demo y video apuntando al configurador, legales en el sistema nuevo, e2e nuevos                                                                  | hecho              |
| 7    | QA: e2e en 7 viewports, axe, consola, Lighthouse móvil                                                                                                             | hecho              |
| —    | Imágenes reales (lista en el reporte final)                                                                                                                        | esperando a Julián |
| —    | DNS de `webya.dev` → Vercel (`AUDIT.md` §5)                                                                                                                        | esperando a Julián |
| —    | Número de WhatsApp (`5493406419495`, por defecto en `site-config.ts`)                                                                                              | hecho              |
| —    | Secciones de relleno fuera (marquesina, cifras, rubros, cómo trabajo, preguntas) y captura real del aviso push                                                     | hecho              |
| —    | Merge con `origin/main`: medición, avisos y demo de peluquería adentro; legado fuera                                                                               | hecho              |
| —    | Demo `/demo/pedidos` con el sistema real de Micio's (reemplaza la de gastronomía)                                                                                  | hecho              |
| —    | Demo `/demo/turnos` con el sistema real (secciones 1 a 5 del spec)                                                                                                 | hecho              |
| —    | Spec de turnos, secciones 6 a 10                                                                                                                                   | esperando a Julián |
| —    | Migraciones de Supabase (`AUDIT.md` §5)                                                                                                                            | esperando a Julián |
| —    | Fase 1.5 (guardar el brief) y fase 2 self-service                                                                                                                  | `ROADMAP.md`       |

## Resultado del QA (2026-11-19)

- **Unit**: 939 tests en verde (62 archivos), incluidas las guardas de capas, copy y colores.
- **E2E** (Playwright, 7 viewports: iPhone SE, iPhone 15, Pixel 7, iPad Mini, 1280, 1440, 1920): layout sin
  scroll horizontal, un h1, configurador (3 toques, WhatsApp prellenado, cero requests de datos), axe WCAG 2.2 AA
  sin violaciones, consola limpia, SEO, CSP/SRI y presupuestos de JS y CLS.
- **Lighthouse móvil** (local, i3 de 2 núcleos con `benchmarkIndex` ~850–1150): accesibilidad 100, buenas
  prácticas 100, SEO 100. Performance: **74** con 4× CPU (la versión vieja publicada da 58 en las mismas
  condiciones) y **89–93** con 2×, la calibración que recomienda Lighthouse para este hardware. CLS 0, TBT 180 ms
  (2×). El número definitivo se toma con PageSpeed Insights sobre el deploy.
