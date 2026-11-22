# Licencias de assets

Regla: solo assets propios de Webya o con licencia CC0/OFL. Nada descargado del sitio de referencia.

| Asset | Dónde | Origen | Licencia |
|---|---|---|---|
| Símbolo 3D `<w>` (tres piezas) | `src/components/marketing/home3d/geometria.ts` | Modelado procedural propio (`THREE.Shape` + `ExtrudeGeometry`) a partir del logo de Julián | Propio de Webya |
| Textura de la superficie (relieve y rugosidad) | `src/components/marketing/home3d/textura.ts` | Ruido generado en el navegador (`DataTexture`), sin archivos | Propio de Webya |
| Iluminación de estudio | `three/examples/jsm/environments/RoomEnvironment.js` | Entorno procedural incluido en three.js, sin HDRI | MIT (three.js) |
| Posters del símbolo (AVIF/WebP, tres estados) | `public/home3d/` | Render de la misma escena con `scripts/render-poster.mjs` | Propio de Webya |
| Surcos de campo | `src/components/marketing/home3d/Surcos.tsx` | SVG dibujado en código | Propio de Webya |
| Mapa de puntos del globo | `cobe` (MIT, github.com/shuding/cobe) | Textura incluida en la librería | MIT |
| Geist (sans) | `next/font/google` | Vercel | OFL 1.1 |
| Instrument Serif itálica (cursiva de contraste) | `next/font/google` | Instrument (Google Fonts) | OFL 1.1 |

No se usaron HDRI ni texturas de Poly Haven o ambientCG: la CSP del sitio no permite cargarlas de otro origen
y el entorno procedural alcanza para un material oscuro. Si en el futuro se suma alguno, va en esta tabla con
su URL y licencia CC0.
