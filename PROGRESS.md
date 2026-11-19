# PROGRESS — Rediseño Webya

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
