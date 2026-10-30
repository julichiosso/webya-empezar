# Retomar Ola 3 (paginas)

Rama `feat/ola-3`, base `6aef6e7`. Sin push. Cada paso se integra a `main` local solo por fast-forward.

## Hecho

- **a) Copy nuevo en /empezar.** Hero, FAQ (8), SEO/OG ya leían de `src/content`; se sumó al footer
  "Probar la demo", "Escribinos por WhatsApp" (solo si hay número), aviso de pestaña nueva y el TODO de
  privacidad. E2E `layout`, `flujo` y `seo` leen los textos de `src/content`.

## Falta

- b) Nav mínima, sección "¿Y si lo que necesito no está?" y TODO visibles.
- c) Tema (ScriptTema, suppressHydrationWarning, InterruptorTema).
- d) Wizard nuevo (solo si a–c cierran limpios).

## Deudas y riesgos

- El título "Todo lo digital para tu negocio." no entra en una línea en la columna del hero a 1280 px con
  el token `hero` (`src/brand/tokens/primitivos.ts`, dueño `marca-sistema`). El E2E ahora acepta el título
  en 2 líneas y exige la línea gris en una. Si se quiere una línea, achicar el token o ensanchar la columna.
- Capturas visuales desactualizadas (esperado, no se regeneraron).
