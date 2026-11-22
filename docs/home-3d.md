# Hero 3D: notas de uso

- Motor: `src/components/marketing/home3d/escena.ts` (three.js puro, sin React). `montarEscena(canvas, opciones)`
  devuelve `{ fijarProgreso, destruir }`.
- Estados: progreso `p` de 0 a 1. 0 = **Creá** (tres piezas separadas), 0,5 = **Digitalizá** (alineadas, con la
  malla de alambre), 1 = **Crecé** (armado y un poco más grande).
- El progreso lo escribe `ProgresoHero` en la variable CSS `--p` del hero (scroll dentro de la sección fija).
- Capacidad: `puedeWebGL()` en `capacidad.ts` (WebGL2, núcleos ≥ 4, memoria ≥ 4 GB si el dato existe, sin
  `saveData`, sin movimiento reducido). Si no puede, queda el poster.
- Posters: `pnpm build && pnpm start` con `LEAD_REPOSITORY=memory`, y `node scripts/render-poster.mjs`
  (Chromium con SwiftShader). Guarda `public/home3d/simbolo-{0,1,2}.{avif,webp}`.
- Capturas de WebGL en headless: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
