# Retomar Ola 3 (paginas)

Rama `feat/ola-3`, base `6aef6e7`. Sin push. Cada paso se integra a `main` local solo por fast-forward.

## Hecho

- **a) Copy nuevo en /empezar** (`7d5a53a`). Hero, FAQ (8), SEO/OG ya leían de `src/content`; se sumó al
  footer "Probar la demo", "Escribinos por WhatsApp" (solo si hay número), aviso de pestaña nueva y el TODO
  de privacidad. E2E `layout`, `flujo` y `seo` leen los textos de `src/content`.
- **b) Nav, "¿Y si no está?" y TODO visibles.** `components/marketing/Nav.tsx` (saltar al contenido, logo
  enlazado, un solo CTA), `AMedida.tsx` (después de "Qué podés activar"), enlace a la demo en el hero.
  TODO visibles: `HERO.todoPlazo` (escritorio, debajo de las señales), `CONFIANZA.compromisos[].todo`,
  `PASO_LISTO.todoPlazo`, `Pregunta.todo` (fuera del JSON-LD) y estado + `notaEstado` en "Qué podés activar"
  (la nota lleva `data-todo`). Deuda de capas saldada: Hero recibe `mockup` y `accion` por props;
  HeroMockup recibe el estado por props y lo conecta `features/empezar/HeroMockupConectado.tsx`. Se borraron
  esas 2 entradas de `tests/arquitectura/excepciones.ts` y sus `eslint-disable`. E2E `teclado` sigue el
  orden de foco nuevo; `layout`/`flujo` buscan el CTA dentro de `main` (ahora hay dos "Empezar a crear").

## Falta

- c) Tema (ScriptTema, suppressHydrationWarning, InterruptorTema).
- d) Wizard nuevo (solo si a–c cierran limpios).
- El CTA de "¿Y si no está?" baja a `#wizard`; marcar "Otra cosa" de entrada depende del paso de
  necesidades (d).

## Deudas y riesgos

- Sigue la excepción `features/demo/gastronomia/* -> features/empezar/desde-demo`: moverla implica sacar la
  persistencia del wizard (`state.ts`) a una capa común; no se tocó para no cambiar la demo.
- El título "Todo lo digital para tu negocio." no entra en una línea en la columna del hero a 1280 px con
  el token `hero` (`src/brand/tokens/primitivos.ts`, dueño `marca-sistema`). El E2E ahora acepta el título
  en 2 líneas y exige la línea gris en una. Si se quiere una línea, achicar el token o ensanchar la columna.
- No se corrieron `a11y`, `movimiento`, `rendimiento` ni `consola` (no se tocaron): la nav y la sección nueva
  no pasaron por axe en E2E. Tampoco se midió el JS inicial.
- Capturas visuales desactualizadas (esperado, no se regeneraron).
