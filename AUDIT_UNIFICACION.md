# Auditoría de unificación — 2026-11-22

## Qué es cada versión

| Versión | Dónde | Commit | Estado |
|---|---|---|---|
| "Negra" (la del prompt como "deploy") | Producción hasta hoy a la mañana | `d8d862c` | Reemplazada por el rediseño blanco |
| "Blanca" (la del prompt como "local") | **Producción actual** (`webya-empezar.vercel.app`) | `d14b20a` (`main`) | Rediseño estilo Apple + Demo Studio |
| Unificada | Rama `unificacion` → preview de Vercel | esta rama | No se promueve a producción: lo decide Julián |

- Hay **un solo worktree** (`git worktree list`). `localhost:3200` era el `next dev` de este mismo repo; en
  `localhost:3001` no hay nada escuchando. No eran ramas distintas: eran dos momentos del mismo `main`.
- Dominio: `siteConfig.url = https://webya.dev` (canonical y OG). Los links internos ya son relativos; no hay
  `vercel.app` escrito en `src`. `webya.dev` todavía responde 404 (ver memoria del proyecto): lo resuelve
  Julián en el DNS/Vercel.

## Problemas conocidos (del prompt), verificados

| Problema | Estado |
|---|---|
| Celulares del hero con texto cortado | Real: los de los costados quedaban tapados por el del medio. Se separan y se encuadran completos. |
| Cartel "Primer mes con descuento" sin verificar | Real. Se saca hasta que Julián lo confirme (`TRUST_CLAIMS.md`). |
| Zona que dice solo San Francisco | Era el rodillo de localidades mostrando una por vez. Pasa a franja fija "San Francisco y San Jorge". |
| Imágenes rotas en "Conocé cómo ya lo usa…" | No es del código: era el optimizador de imágenes del `next dev` local (ver `AUDIT_DEMOS.md`). En producción cargan. |
| Dominios mezclados | Canonical único `webya.dev`; links internos relativos. Sin cambios. |
| Demos con textos de 11–12 px | Barra, guía y controles nuevos ya a 16–18 px (Demo Studio); queda letra chica adentro de las apps de ejemplo (simulan apps reales). |
