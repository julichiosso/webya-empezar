# Estado final: sprint "tu negocio, armado en un minuto"

Fecha: 2026-10-31. **Publicado en producción**: `main` = `origin/main` = `937814e`, deploy de Vercel en
`success`, https://webya-empezar.vercel.app/empezar.

**Punto de retorno: `0c52f2d`** (producción anterior). Para volver atrás: Vercel → Deployments → el
deploy de producción de `0c52f2d` → ⋯ → **Instant Rollback**. Con git, solo un `git revert` sobre main;
nunca force push.

## Qué se publicó (`0c52f2d..937814e`, avance directo de main, sin commits de merge)

| Commit                          | Qué                                                                                                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `c2d9676`, `d7f34fc`            | Arreglos de desarrollo: preload de la fuente solo en producción; la página de error registra el error entero solo en desarrollo.                                                                                                                 |
| `7158779`                       | Lead parcial con nombre del negocio y ciudad; "Otro" alcanza con el pedido a medida. Migraciones `leads_ciudad` y (después) `leads_recargar_esquema`.                                                                                            |
| `ffffe61`                       | Etapa (a): pantalla 1 "¿Qué negocio tenés?" en el HTML del servidor (se toca sin esperar JS), formulario mínimo (nombre, WhatsApp, ciudad) → lead parcial, "Otro" → pedido a medida, completar y gracias, eventos de medición, flag del orden B. |
| `cb6cb37`, `3929050`            | Etapa (b): escenas SVG propias de los 6 rubros; vista previa por rubro (plantillas en `src/content/rubros`, 6 paletas compartidas con la demo, `PreviewNegocio` cargado aparte).                                                                 |
| `b005c2c`                       | Etapa (c): "Así te queda" con celular/computadora, colores y piezas; CTA a WhatsApp en barra fija en celular; demo de Gastronomía con nombre y paleta; orden B (`?orden=b`).                                                                     |
| `da8388c`                       | Seguridad: mínimo del nombre como la base (emojis incluidos); el guardado del lead nunca falla en silencio (aviso + reintento a mano y solo).                                                                                                    |
| `c72351d`                       | Caso real de Micio's **detrás de un flag apagado** (`FLAGS.casoMicios = false`) y guion del video (`docs/video-guion.md`, no se usa en el sitio).                                                                                                |
| `e495452`, `cdfd686`            | Sin la promesa de "24 hs" en ningún lado (guion del video, TODO del plazo, skills y docs).                                                                                                                                                       |
| `95ceb38`                       | Capturas de referencia del flujo nuevo, regeneradas una vez y revisadas.                                                                                                                                                                         |
| `e5d0192`, `7baaac3`            | Sin el número de WhatsApp: en producción no se ve un TODO interno; al recargar a mitad del flujo, la pantalla guardada aparece sin animación rara.                                                                                               |
| `24f3fa4`, `5c91c05`, `c89f4d5` | Commits vacíos para redeployar el preview con las variables de Vercel.                                                                                                                                                                           |
| `937814e`                       | Punto de retorno anotado en `docs/retomar-ola-3.md`.                                                                                                                                                                                             |

## Verificado

- lint 0, typecheck 0, Vitest 1070 ✓ (incluye `tests/arquitectura` y `tests/copy`, sin excepciones
  nuevas). E2E completa 430 ✓ / 0 ✗ con `--update-snapshots=none` (iPhone SE, iPhone 15, Pixel 7,
  tablet, desktop, 1440, 1920).
- Revisión de capturas en iPhone SE, iPhone 15, Pixel 7, 1440 y 1920: pantalla 1 sin scroll, la barra
  fija no tapa contenido, las 6 vistas previas son distintas, sin rastro de Micio's, del video nuevo ni
  de "24 hs".
- Producción (`937814e`): `/empezar`, `/demo/gastronomia`, `/sistema`, `/marca` 200; `GET /api/leads`
  405; CSP y headers de seguridad presentes; pantalla 1 nueva en el HTML; WhatsApp y mail en el pie.
  Prueba de humo con Playwright (iPhone 13 y 1440): rubro → nombre + WhatsApp → "Así te queda" → botón
  "Quiero esto para mi negocio" con link `wa.me/549…` y mensaje con negocio y rubro, barra fija en
  celular, sin errores de consola. **El POST del lead se interceptó en el navegador: no se escribió
  nada en la base real.**
- Preview, además: POST inválido a `/api/leads` → 400 (validación) sin escribir.

## Mediciones (build de producción, celular 390 px, CPU ×4 y 4G lento)

|                                               | Antes del sprint | Publicado                                                           |
| --------------------------------------------- | ---------------- | ------------------------------------------------------------------- |
| JS inicial `/empezar`                         | 148,6 KB gzip    | **140,5 KB** (presupuesto 150)                                      |
| CLS al cargar                                 | 0                | **0**                                                               |
| CLS recorriendo el flujo hasta "Así te queda" | —                | **0,026** (meta < 0,05; antes del último arreglo daba 0, a revisar) |
| LCP                                           | ~1000–1200 ms    | **492 ms en frío, 252–256 ms en caliente**                          |

## Lo que NO se pudo verificar

- **Dispositivos reales** (todo es emulación de Playwright/Chromium): Safari de iOS real, Android real,
  Firefox (la vista previa usa `zoom`, que pide Firefox ≥ 126).
- **El navegador interno de Instagram** (de donde llega el tráfico).
- **El guardado de un lead en producción**: por la regla de no escribir en la base real, la prueba de
  humo interceptó el envío. Que la API arranca bien se verificó (405 al GET; 400 a un POST inválido en el
  preview), pero un lead real de punta a punta no.
- El aviso por WhatsApp/mail de un lead nuevo (no hay proveedor de notificaciones configurado).
- Lighthouse en producción y la medición de campo (Web Vitals reales).

## Qué te toca

1. **Hacer un lead real de prueba** desde tu celular en https://webya-empezar.vercel.app/empezar y
   confirmar que aparece en Supabase (con nombre del negocio y ciudad); después borrarlo. Aprovechá para
   probar el botón de WhatsApp y el navegador de Instagram (abrí el link desde una historia o la bio).
2. Revisar o borrar en Supabase los leads de prueba viejos (del 2026-10-30) si quedó alguno.
3. **Dominio** `webya.ar` en Vercel (hoy da 404) y, cuando esté, `NEXT_PUBLIC_SITE_URL`.
4. Confirmar el **plazo de respuesta** (sigue el `TODO:` visible), los **precios**, la **política de
   privacidad** y los textos de ejemplo de los módulos sin web pública (`clientes`, `notificaciones`,
   `pagos`).
5. **Micio's**: el permiso escrito, la dirección del sitio, si se nombra San Jorge y las capturas.
   Con eso se prende `FLAGS.casoMicios` (y se cambia su test a propósito).
6. **Video**: subir el MP4 cuando lo tengas; `feat/video-presentacion` quedó para una tanda aparte (hay
   que pasar sus 2 commits sobre `main`, no mergearla tal cual). Guion y prompt en `docs/video-guion.md`.
7. Probar el **orden B** cuando haya tráfico (`?orden=b`) y mirar `form_enviado`/`cta_click` por orden
   cuando enchufes un proveedor de analítica (la capa ya está, sin proveedor).

## Ramas y worktrees

- Ramas: `main` y `feat/video-presentacion` (la dejaste a propósito; su worktree en
  `.claude/worktrees/agent-a8752564f4a7d4b25` tiene trabajo sin commitear). `feat/preview-por-rubro`
  borrada (local y remota). Ningún worktree bloqueado: las carpetas viejas se borraron.
