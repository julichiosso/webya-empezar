# Estado final del sprint "Base de marca + Todo lo digital"

Fecha: 2026-10-30. Todo está en `main` **local** (`2975064` y el commit de este documento). `origin/main` sigue
en `f02db48` (producción sin tocar). La única rama subida es `sprint/base-marca` (`0a3b4ff`), para el preview.

## Qué está hecho

**Sistema de diseño y marca**
- Tokens en 3 capas (`src/brand/tokens`: primitivos → semánticos → componentes) que generan `tokens.css`, con
  test de snapshot (`pnpm tokens` regenera).
- Capas de código `app > features > marketing > patterns > ui > content > brand > domain > config > lib`,
  verificadas por `tests/arquitectura`. **Cero excepciones de capas y de copy registradas.**
- Logo, ilustración propia, movimiento con presupuesto (solo transform/opacity) y reduced-motion.
- Tema claro/oscuro: el oscuro por defecto; "Modo claro" en el pie, que aplica solo en `/empezar`. La demo y
  `/marca` quedan siempre en oscuro.

**Copy comercial**
- Todo el texto visible sale de `src/content` (test de copy: sin palabras prohibidas, cada cifra con `TODO:`).
- Los pendientes se muestran como `TODO:` visibles: plazos, estado de cada módulo, privacidad.

**/empezar**
- Hero "Todo lo digital para tu negocio", nav mínima, "¿Y si no está?", FAQ con objeciones, confianza.
- Wizard nuevo:
  1. Qué necesitás (con "Otra cosa", hasta 500 caracteres).
  2. Rubro.
  3. Módulos, cada uno con su estado y su `TODO:`.
  4. Solo WhatsApp: guarda el **lead parcial**.
  5. Completar (solo el nombre del negocio es obligatorio) o "Ahora no".
  6. Confirmación completa o parcial.
- Desde la demo se entra en módulos y se manda un solo formulario completo. El traspaso demo → wizard pasa
  por `src/domain/traspaso`.
- El wizard se descarga recién al primer gesto o cuando se acerca a la pantalla.

**Calidad y seguridad (Fase 3)**
- CLS 0:
  - La fila del hero reserva el alto del mockup.
  - `content-visibility:auto` en las secciones de abajo del pliegue.
  - La fuente se precarga a mano: con webpack, Next 16 no inyecta el preload.
- zod sin `eval` (`src/lib/zod-sin-eval.ts`): la CSP ya no reporta violaciones.
- API de leads:
  - Content-Type exacto.
  - 403 a pedidos `Sec-Fetch-Site: cross-site`.
  - Sin texto libre en los logs.
- Fuera de Vercel nunca se elige Supabase por defecto. Hace falta `ALLOW_SUPABASE_IN_DEV=1` para pedirla.
- a11y: el contador de "Otra cosa" avisa a lectores de pantalla al quedar 50, 20 y 10 caracteres. Los campos
  de la demo tienen `name`.

## Números (antes → después)

CPU ×4. La red se indica en cada fila. "Antes" es el baseline de la auditoría de la Fase 0 (`docs/auditoria`).

| Métrica | Antes | Después | Meta |
|---|---|---|---|
| JS inicial `/empezar` (gzip) | 144,0 KB | **146,8 KB** | ≤ 150 |
| JS inicial demo (gzip) | 192,2 KB | **184,0 KB** | — |
| Wizard (diferido, gzip) | — | 82,8 KB | fuera del inicial |
| LCP `/empezar`, 4G lento | 1763 ms | **~1000 ms** con Slow 4G de DevTools, ~1160 con 400 kbps | < 1763 |
| CLS `/empezar`, 4G lento | 0,00 | **0,0000** con los dos perfiles (antes de los arreglos llegó a 0,03) | 0 |
| INP del wizard | 168 ms | **48–72 ms** (necesidad 72, rubro 64, módulos 48) | < 100 |
| Peor frame del wizard | 150 ms | **50–67 ms** | — |
| Peor frame de la entrada | 17 ms* | **~185–250 ms** | ver "Qué falla" |
| Lighthouse móvil `/empezar` | — | a11y 100 · buenas prácticas 100 · SEO 100 | 100 |
| Lighthouse móvil demo | — | a11y 100 · SEO 100 · buenas prácticas 96 → sin la causa (falta volver a medir) | 100 |
| axe WCAG 2.2 AA | — | 0 violaciones en todos los pasos y en la demo | 0 |
| Tests | — | lint 0 · typecheck 0 · Vitest 877 ✓ · E2E **470 ✓ / 0 ✗** | verde |

\* El 17 ms del baseline no es comparable. Con Turbopack, la evaluación de React caía antes del primer pintado
y el bucle de medición no la veía. Hoy la página pinta antes (por eso el LCP bajó) y esa evaluación aparece
como un frame.

Las E2E omitidas (104) son a propósito: hay tests que corren en un solo proyecto (SEO, teclado,
rendimiento, lead parcial) o solo en celular o solo en escritorio.

## Qué falla o queda flojo

- **Peor frame de la entrada, ~200 ms con CPU ×4.** Es la evaluación del runtime de Next con webpack (chunk
  `322`), que se adoptó por SRI (ADR 0001). Partirlo en chunks subía el JS a 155 KB sin mejorar el frame: se
  descartó. La alternativa es volver a Turbopack, que en el baseline tardaba 91 ms en esa tarea, y renunciar
  al SRI.
- **La CSP sigue con `'unsafe-inline'`** (riesgo aceptado en la ADR 0001). Hoy no es explotable: los scripts
  en línea son constantes. Queda como deuda pasarlos a hashes.
- **El preload de la fuente está fijo por nombre de archivo.** Si Google cambia Outfit, cambia el nombre. El
  E2E `rendimiento` lo detecta y hay que actualizar `src/brand/tipografia/fuente.ts`.
- **Con reduced-motion quedan fundidos de opacidad cortos** (cambio de paso, 260 ms). Son aceptables para
  WCAG, pero no es "estático total".
- **Bajos de seguridad sin arreglar:**
  - El body se lee entero antes de cortar en 16 KB (acotado por Vercel).
  - `src/server` no tiene `import 'server-only'`.
- **`Wizard.test.tsx` a veces es flaky bajo carga:** pasa al correrlo solo.

## Qué no se pudo verificar

- Lector de pantalla real (NVDA o VoiceOver): los anuncios se dedujeron del DOM.
- Safari/WebKit y el navegador in-app de Instagram en un teléfono real.
- RLS y estado real de la base Supabase (no hay credenciales en la sesión).
- Headers y SRI del deploy real en el dominio propio.
- El preview de Vercel desde el celular: está detrás del login de Vercel.
- Lighthouse de la demo después de sacar el `eval` de zod (se verificó con un script que no hay violaciones
  de CSP, pero no se volvió a correr Lighthouse).

## Qué te toca

1. **Supabase:**
   - Revisar y borrar los leads de prueba que pudieron entrar a la base real el 2026-10-30
     (`nombre_negocio` "Peluquería desktop/tablet/pixel-7/hero-…", persona "Ana Pérez").
   - Aplicar `supabase/migrations/20261030120000_leads_parcial_necesidades.sql`. **Sin esa migración el
     wizard nuevo falla en producción al guardar el WhatsApp.**
2. **Vercel:**
   - Revisar que las variables de Supabase no tengan alcance "Preview": hoy un deploy de preview escribiría
     en la base real.
   - El primer deploy con webpack conviene hacerlo sin caché y probarlo antes en un preview (README).
3. **Contenido:**
   - Confirmar el estado real de cada módulo y el plazo de la primera respuesta (hoy son `TODO:` visibles).
   - Agregar la política de privacidad y `NEXT_PUBLIC_CONTACT_EMAIL`.
4. **Publicar:** cuando lo revises, decidir el push de `main` (despliega a producción). Sin tu OK no se sube.
5. **Limpieza (opcional):** borrar las ramas ya mergeadas (`feat/*`, `sprint/fase-0-auditoria`,
   `worktree-agent-*`) y los 5 worktrees de `.claude/worktrees/`.
