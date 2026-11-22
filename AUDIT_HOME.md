# Auditoría de la home antes del hero 3D (2026-11-22, rama `home-3d` desde `002358c`)

## Qué hay hoy

| Pieza | Archivo | Estado |
|---|---|---|
| Header fijo con links (escritorio) y menú a pantalla completa (celular) | `editorial/Encabezado.tsx`, `MenuMovil.tsx` | Funciona. En escritorio no hay menú: los links viven en la barra |
| Hero: ceja, lema "Creá. Digitalizá. Crecé." (h1), bajada, buscador que escucha, dos acciones, "Ya lo usan" y tres iPhones | `editorial/Hero.tsx`, `Escaparate.tsx` | Funciona, pero es una columna centrada: no tiene un objeto protagonista ni aire |
| Rubros en filas grandes que abren la demo con el asistente | `Rubros.tsx` | Se mantiene |
| Bento de productos, proyectos, franja de zona, por qué Webya, cierre con contacto | `Bento.tsx`, `Proyectos.tsx`, `FranjaZona.tsx`, `Porque.tsx`, `Cierre.tsx` | Se mantienen y se reordenan |
| Quiénes somos | `Nosotros.tsx` (solo en `/nosotros`) | No está en la home |
| Fondo | `tono-claro` = `#ffffff`, `tono-gris` = `#f5f5f7` | Se pasa a blanco hueso |
| Tipografía | Geist variable (OFL), una sola familia | Falta la cursiva de contraste |

## Restricciones del repo que el hero 3D tiene que respetar

- **CSP fija** (`next.config.ts`): todo de `self`, `img-src data: blob:`. Nada de HDRI, decodificadores Draco ni
  texturas desde un CDN. → La escena es 100 % procedural (geometría, entorno y texturas generadas en el código).
- **Anti-hex** (`tests/guardas/anti-hex.test.ts`): ningún color literal en `components/features/app`. → La escena
  toma los colores de `src/brand/tokens` y el CSS nuevo va en `src/styles/editorial.css`.
- **Anti-texto** (`tests/guardas/anti-texto.test.ts` y `tests/arquitectura`): todo el copy sale de `src/content`.
- **Capas**: `app > features > marketing > … > brand > lib`. → El motor 3D vive en `components/marketing/home3d`.
- **Presupuesto de JS inicial** 160 KB gzip (`e2e/rendimiento.spec.ts`). El 3D tiene que ir en un chunk aparte.
- **Script de movimiento** (`lib/motion/script.ts`): pone `.mo` en `<html>` si se permite movimiento; las
  animaciones de entrada cuelgan de eso.

## Herramientas disponibles en este entorno

- Node 22.20, pnpm, ffmpeg (winget), `sharp` (dependencia de Next), Playwright 1.64 con Chromium.
- MCP de Playwright, Chrome DevTools y Context7 conectados.
- **Blender no está instalado** y no hay forma de instalarlo sin intervención en esta máquina: la vía B (render
  previo) se resuelve renderizando la misma escena de three.js en Chromium headless con SwiftShader y
  exportando el canvas a AVIF/WebP con `sharp` (`scripts/render-poster.mjs`). Ver `DECISIONS.md`.

## Riesgos detectados

1. Un segundo contexto WebGL (globo) en celulares de gama baja: el globo carga solo si la escena principal
   también puede, y se pausa fuera de pantalla.
2. Un hero con scroll fijado (sticky) alarga la página: solo se fija con movimiento permitido; con movimiento
   reducido el hero mide una pantalla y muestra el símbolo armado.
3. `/cafeterias` no existe todavía: el menú no la lista hasta que exista (un link roto es peor que ninguno).
4. No hay foto de Julián ni logos autorizados de los clientes: el sello usa la marca y la franja usa los
   nombres en tipografía (ya verificados en `TRUST_CLAIMS.md`).
