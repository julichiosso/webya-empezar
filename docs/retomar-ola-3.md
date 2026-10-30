# Retomar Ola 3

`main` local = `30e08b7`, 76 commits adelante de `origin/main` (`f02db48`). **Sin push a main.** La única rama
subida es `sprint/base-marca` (`0a3b4ff`, preview de Vercel detrás de su login).

## Hecho (todo en `main` local)

- **a, b, c** (copy, nav, "¿Y si no está?", TODO visibles, tema): `7d5a53a`, `075d889`, `c50d3f0`.
- **Calidad** (`636ea4c`): CLS 0 en el hero (la fila reserva el alto del mockup y el texto va arriba con margen
  fijo) y `content-visibility:auto` bajo el pliegue (`.reveal` y `.diferido` en el pie): primer layout de ~150 a
  ~80 ms con CPU x4.
- **Leads** (`ad15880`): fuera de Vercel nunca se elige Supabase por defecto (un `next start` local usaba la
  base real). Pedirlo exige `ALLOW_SUPABASE_IN_DEV=1`.
- **Tema** (`baad34e`): etiqueta fija "Modo claro" desde content; el claro solo aplica en `/empezar`.
- **Capturas** regeneradas y revisadas (`138d6e2`, `d067bf3`, `f18f790`).
- **d) Wizard nuevo** (merge `30e08b7`): necesidad (con "Otra cosa", 500) → rubro → módulos con estado y TODO →
  solo WhatsApp (POST parcial, guarda el lead) → completar (PATCH, solo el nombre del negocio) u "Ahora no" →
  confirmación completa o parcial. Desde la demo: entra en módulos (paso 3 de 4) y manda un formulario completo
  (los E2E de la demo no cambiaron de expectativas; solo el de "elegir Gastronomía" pasa antes el paso 1).
  El traspaso demo → wizard vive en `domain/traspaso/demo-wizard.ts`: **cero excepciones de capas**.

Verificado en `30e08b7`: lint 0, typecheck 0, Vitest 876 ✓, E2E 469 ✓ / 0 ✗ / 100 omitidas (las omitidas son
tests de un solo proyecto o solo celular/escritorio). JS inicial `/empezar` 146,8 KB, demo 183,4 KB.

## Falta

- **Fase 3**: `qa-rendimiento` y `seguridad-revisor` (máximo 2 a la vez) y `docs/estado-final.md`.
- El peor frame de la entrada sigue en ~200 ms con CPU x4: es la evaluación del runtime de Next con webpack
  (chunk `322`). Partir chunks lo subía a 155 KB y no mejoraba: descartado.

## Riesgos

- **Nunca** levantar `next start` a mano para E2E: Playwright levanta el suyo con `LEAD_REPOSITORY=file`.
- Posibles leads de prueba en la Supabase real del 2026-10-30 ("Peluquería desktop/tablet/pixel-7/hero-…",
  "Ana Pérez"): los tiene que revisar el usuario.
- Migración `20261030120000_leads_parcial_necesidades.sql` sin aplicar en Supabase: sin ella el wizard nuevo
  falla en producción al guardar el WhatsApp.
- `Wizard.test.tsx` puede pasar los 5 s con la máquina cargada (pasa sola).
