---
name: webya-parallel-workflow
description: Cómo trabajan en paralelo los subagentes de WebYa — olas, worktrees, dueños de archivos, checks antes de entregar, orden de merge y formato del reporte. Usala al empezar cualquier tarea como subagente del sprint o al coordinarlos como integrador.
---

# Trabajo en paralelo (subagentes de WebYa)

## Reglas que no se negocian
- **Nunca push.** Un push a `main` despliega a producción; solo el usuario lo autoriza.
- **Nunca leer ni imprimir `.env*`** ni secretos. No tocar migraciones existentes (`supabase/migrations/*`): una migración nueva va en archivo nuevo y la escribe el integrador.
- **Solo tus archivos.** Cada agente tiene una lista de dueño (tabla de abajo). Si necesitás un cambio en un archivo ajeno, no lo edites: anotalo en tu reporte como "pedido al integrador" con el cambio exacto.
- Sin dependencias nuevas sin aprobación (reportá peso en KB y mantenimiento).
- Sin hex, `rgb()` ni copy dentro de componentes: colores por tokens (`src/brand/tokens`), textos desde `src/content`.

## Ramas y worktrees
- Base: la rama de integración `sprint/base-marca` (el integrador te dice el commit).
- Tu rama: `feat/<agente>`, en tu propio worktree. Commits chicos, mensaje en castellano, terminando con
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Si falta `node_modules`: `pnpm install --offline --frozen-lockfile`.
- E2E solo con puerto propio: `E2E_PORT=<3200|3300|3400> pnpm test:e2e …` (el 3100 es del integrador).

## Dueños de archivos
| Agente | Dueño de |
|---|---|
| `marca-sistema` | `src/brand/{tokens,logo,motion,voz}`, `src/brand/BRAND.md`, `src/app/sistema`, `src/app/icon*`, `src/app/apple-icon*`, `scripts/exportar-marca.*` |
| `ilustracion` | `src/brand/ilustracion/**` |
| `ui-componentes` | `src/components/ui/**`, `src/components/patterns/**` |
| `copy-conversion` | `src/content/**`, `docs/copy-guia.md` |
| `paginas` | `src/components/marketing/**`, `src/app/empezar/**`, `src/features/**` (cableado de UI) |
| `qa-rendimiento` | `tests/**` (salvo `tests/arquitectura/excepciones.ts`), `e2e/**`, `docs/reporte-sprint.md`, `docs/auditoria/**` |
| `seguridad-revisor` | solo lectura |
| integrador | `next.config.ts`, `package.json`, `src/server/**`, `src/domain/**`, `supabase/**`, `tests/arquitectura/excepciones.ts`, merges |

## Antes de entregar (todo en verde)
```
pnpm typecheck && pnpm lint && pnpm vitest run
```
- `tests/arquitectura` tiene que seguir en verde. Si sacaste deuda registrada, el test "cada excepción sigue
  haciendo falta" va a fallar listando tus archivos: es lo esperado; avisalo en el reporte (el integrador
  actualiza `excepciones.ts`).
- Cambios visuales: decilo en el reporte; las capturas las regenera `qa-rendimiento` y se revisan a ojo.

## Reporte final (corto, en castellano)
1. Rama y commits.
2. Qué hiciste (archivos creados y tocados).
3. Qué mediste, con números reales (tests, KB, tiempos).
4. Qué NO pudiste verificar.
5. Pedidos al integrador (archivos ajenos) y deuda que queda.

## Integración (solo integrador)
- Orden: marca → ilustración → ui → copy → páginas → qa.
- Después de **cada** merge: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e`.
- Si algo rompe, se revierte ese merge (`git revert -m 1`) y se corrige en su rama.
- Máximo 4 agentes a la vez.
