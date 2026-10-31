# Retomar: sprint "tu negocio, armado en un minuto"

## PAUSA (2026-10-31): límite de uso, antes de publicar

Se pausó **antes de la fase 1 de la publicación**: el agente del video cortó por el límite de 5 h
de la cuenta (vuelve a las 4 a. m.). Nada se pusheó; `main` (local y remoto) está intacto.

- **`feat/preview-por-rubro` @ `c72351d`**: estado consistente y en verde (lint, typecheck,
  Vitest 1069 ✓ incluidos `tests/arquitectura` y `tests/copy`). Tiene (a), (b), (c), las
  correcciones de seguridad (`da8388c`) y la sección de Micio's apagada + guion (`c72351d`).
  `FLAGS.casoMicios = false` confirmado. Lista para retomar la publicación desde el paso 1.
- **`feat/video-presentacion`** (worktree `.claude/worktrees/agent-a8752564f4a7d4b25`): A MEDIAS,
  **no mergear ni publicar**. 2 commits (`3c9c260` reproductor reutilizable + guion sin "24 hs";
  `329f90b` sección con poster + animación de las 4 pantallas) y cambios sin commitear. Ojo: nació
  de `f315756` (la versión del commit de seguridad que todavía traía las 42 capturas
  autogeneradas), así que hay que pasarla sobre `c72351d` (cherry-pick de sus 2 commits) antes de
  integrarla. Se puede retomar mandándole un mensaje al mismo agente.
- **Sin la sección de video**, /empezar no tiene rastro de ella (no está en la rama). Sigue el botón
  viejo "Mirá cómo funciona" (ya está hoy en producción), cuya narración dice "te escribimos en menos
  de veinticuatro horas", un plazo NO confirmado. El agente ya lo sacó en su rama; si se publica sin
  ella, conviene sacar esa frase antes (`src/content/explicativo/guion.ts`, escena `cta`).
- Migraciones: según el usuario, todas aplicadas en Supabase (ciudad y recargar_esquema incluidas).
- Para retomar: seguir la "FASE 1" del pedido de publicación (integrar o descartar el video →
  E2E completa con `--update-snapshots=none` → regenerar capturas una vez y revisarlas → medir →
  push solo de la rama → preview → FASE 2 fast-forward a main).

---

Rama **`feat/preview-por-rubro`**, solo local: **sin push** (ni la rama ni main). `main` local está
2 commits adelante de `origin/main` (los arreglos de dev `c2d9676` y `d7f34fc`), también sin subir.
Etapas (a), (b) y (c) cerradas con todo en verde. La (d) no se empezó, como se pidió.

## Qué quedó hecho

| Etapa   | Commit               | Qué                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| backend | `7158779`            | El lead parcial guarda el nombre del negocio y la ciudad; "Otro" alcanza con el pedido a medida. Migración nueva `20261031120000_leads_ciudad.sql` (sin aplicar: ver abajo). Sin la columna, Supabase guarda el lead completo sin la ciudad y deja un aviso en el log (testeado).                                                                                                                                                                                                                                  |
| (a)     | `ffffe61`            | Pantalla 1 "¿Qué negocio tenés?" en el HTML del servidor (se toca sin esperar JS; un toque previo no se pierde; el foco de teclado tampoco). Pantalla 2: nombre, WhatsApp y ciudad (opcional) → lead parcial. "Otro" → pedido a medida (500) → "Lo armamos a medida". Completar (PATCH) y gracias. Eventos `rubro_elegido`, `form_enviado`, `preview_visto`, `preview_toggle`, `demo_abierta`, `cta_click`, `abandono_paso`. Salieron el mockup del hero, "¿Qué necesitás?", Cómo funciona, la vitrina y A medida. |
| (b)     | `cb6cb37`, `3929050` | Escenas SVG propias de los 6 rubros (agente ilustracion) y vista previa por rubro (agente ui-componentes): plantilla del sitio de ejemplo en cada `src/content/rubros/<id>.ts` (textos marcados "de ejemplo"), las 6 paletas curadas compartidas con la demo (`src/content/paletas.ts`, mismos ids), `PreviewNegocio` en marco de celular o navegador, armado por piezas, cargado aparte (2,6 KB) y precargado al elegir rubro.                                                                                    |
| (c)     | `b005c2c`            | "Así te queda": celular/computadora, 6 colores, piezas del rubro para sacar o sumar; CTA único a WhatsApp (rubro, nombre, módulos) en una barra fija abajo en celular; demo de Gastronomía con nombre y paleta elegidos; orden B detrás de `?orden=b` (nombre → vista previa → WhatsApp al tocar el CTA).                                                                                                                                                                                                          |

Verificado en `b005c2c`: lint 0, typecheck 0, Vitest 1063 ✓ (2 omitidos), E2E de lo tocado
224 ✓ / 0 ✗ (flujo, layout, a11y, teclado, consola, demo-personalizar, rendimiento, movimiento, en
todos los proyectos). Después del merge de (b): 207 ✓.

## Mediciones (build de producción, 390 px, CPU ×4 y 4G lento)

|                                               | Antes del sprint | Ahora                                                                  |
| --------------------------------------------- | ---------------- | ---------------------------------------------------------------------- |
| JS inicial `/empezar`                         | 148,6 KB gzip    | **140,5 KB**                                                           |
| CLS al cargar (frío y caliente)               | 0                | **0**                                                                  |
| CLS recorriendo el flujo hasta "Así te queda" | —                | **0**                                                                  |
| LCP                                           | ~1000–1200 ms    | **592 ms en frío, 264–328 ms en caliente** (el texto de la pantalla 1) |

Pantalla 1 entera sin scroll en 320×568, 375×667, 1280×720, 1366×768 y 1440×900.

## Qué falta o quedó pendiente

- **Capturas de referencia (e2e/visual) sin regenerar**, a propósito: se regeneran una sola vez al
  cerrar (c), con el OK del usuario. Hasta entonces `e2e/visual.spec.ts` falla (faltan las del flujo
  nuevo; ya se borraron las viejas). Capturas para revisar (no son las de referencia), en el
  scratchpad de la sesión: `capturas-c/` (iPhone SE, 1440 y 1920; pantallas 1, 2 y 3).
- **View Transitions** entre pantallas: no se hicieron; el cambio de pantalla sigue con motion
  (transform/opacity). Queda para cuando se decida.
- Etapas **(d)** Micio's + video, **(e)** copy y SEO (3 variantes del hero, FAQ con las 4
  objeciones), **(f)** QA final (Lighthouse, capturas en 6 dispositivos, revisión de seguridad).
- Para revisar del agente de vista previa: usa la propiedad CSS `zoom` (Firefox ≥ 126); sigue el
  tema de la página (alternativa: forzar oscuro como la demo); los "detalles" de módulos sin web
  pública (`clientes`, `notificaciones`, `pagos`: "Te recordamos el turno"…) son textos de ejemplo
  que conviene confirmar.
- Limpieza: quedaron carpetas de worktrees viejos en `.claude/worktrees/` (git ya no las registra;
  Windows tiene bloqueados unos `.node`). Se pueden borrar a mano.

## Qué tiene que hacer el usuario

1. **Aplicar la migración** `supabase/migrations/20261031120000_leads_ciudad.sql` en Supabase
   antes de cualquier push a main.
2. Revisar las capturas y dar el OK para regenerar las de referencia.
3. Decidir el push: primero solo `feat/preview-por-rubro` (preview de Vercel, para probar en el
   celular); a main, con OK explícito y la migración aplicada.
4. Confirmar los textos de ejemplo de los módulos sin web pública y el plazo de respuesta (sigue
   el `TODO:` visible).
5. Sigue pendiente de antes: revisar o borrar los leads de prueba en la Supabase real, dominio
   webya.ar en Vercel, política de privacidad, permiso escrito de Micio's (para la etapa d).

## Riesgos

- **Nunca** levantar `next start` a mano para E2E: Playwright levanta el suyo con `LEAD_REPOSITORY=file`.
- Si `pnpm build` (webpack) falla con `Cannot read properties of undefined (reading 'length')` en
  `WasmHash`, borrar `.next/cache/webpack` y reintentar (caché corrupta tras borrar archivos).
