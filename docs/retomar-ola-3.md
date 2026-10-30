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

- **c) Tema.** `<ScriptTema />` en el `<head>` de `src/app/layout.tsx`, `suppressHydrationWarning` en
  `<html>` e `InterruptorTema` en el footer (la nav queda con un solo CTA). El oscuro sigue de default. E2E
  nuevo en `layout.spec`: oscuro por defecto → claro → se recuerda al recargar.
  (b fue `075d889`.)

  (c fue `c50d3f0`.)

## Falta

- **d) entero, sin empezar** (lo frenó el coordinador). Contrato del servidor ya visto: `POST /api/leads`
  con `parcial: true` responde 201 `{ ok, id, token }`; `PATCH /api/leads/[id]` con
  `{ token, nombreNegocio, nombre?, email?, mensaje? }` responde 200, y 404 genérico si venció o no coincide.
  Riesgo principal: `desde-demo.ts` hoy deja el wizard en el paso 2 (módulos). Con el orden nuevo
  (necesidad → rubro → módulos) pasa a ser el paso 3, y eso choca con los E2E de la demo, que no pueden
  cambiar de expectativas. También hay que reescribir `Wizard.test.tsx`, `e2e/helpers.ts`, `flujo`,
  `teclado`, `layout` y `lead-parcial`.
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
- El interruptor usa `FOOTER.tema.aClaro` ("Pasar a modo claro") como nombre fijo con `aria-pressed`;
  el contrato de `InterruptorTema` pide un nombre fijo del estado activo ("Tema claro"). Pedido a
  `copy-conversion`: una etiqueta fija tipo "Modo claro".
- El script de tema está en el layout raíz: si alguien eligió claro en /empezar, `/demo/gastronomia` y
  `/marca` también se ven en claro fuera de los contenedores con paleta propia. No se revisó a ojo.
- No se corrió `consola.spec` (errores de hidratación) en este paso.
- Capturas visuales desactualizadas (esperado, no se regeneraron).
