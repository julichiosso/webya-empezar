---
name: webya-qa-checklist
description: Checklist obligatorio antes de dar por terminada una etapa o la entrega de WebYa /empezar (lint, typecheck, tests, a11y, Lighthouse, mobile, performance de animación y seguridad de la tabla leads). Usala al cerrar cada etapa.
---

# QA antes de dar algo por terminado

No declares nada “verificado” sin evidencia. Reportá resultados reales (comando + salida resumida) y lo que **no** pudiste verificar.

## A. Automático (cada etapa)

```bash
pnpm lint
pnpm typecheck
pnpm test
```

Los tres deben terminar sin errores. Antes de la entrega final, además: `pnpm build` (sin warnings críticos) y `pnpm test:e2e`.

## B. Funcional

- [ ] Flujo completo en viewport móvil (375×667): rubro → objetivos → datos → confirmación, en < 90 s.
- [ ] Recarga a mitad del flujo: el estado se conserva (sessionStorage).
- [ ] Atrás funciona y no pierde datos. `Enter` avanza. “Otro” muestra su campo.
- [ ] WhatsApp inválido muestra error amable al salir del campo; válido se formatea solo.
- [ ] El lead queda guardado con **todos** los campos y los UTM (`?utm_source=ig&utm_medium=bio&utm_campaign=test`).
- [ ] Honeypot lleno → no se guarda (y no avisa al bot). Rate limit → 429 claro. Falla del repositorio → 500 genérico, sin detalles internos.

## C. Accesibilidad

- [ ] Todo operable solo con teclado, foco visible y en orden lógico.
- [ ] Labels asociados; errores con `aria-live`; tarjetas con roles `radio`/`checkbox` y `aria-checked`.
- [ ] Contraste AA en dark y light (texto ≥ 4.5:1, UI ≥ 3:1).
- [ ] Zoom 200% sin pérdida; `prefers-reduced-motion` con versión estática equivalente.

## D. Performance (build de producción, no `dev`)

- [ ] Lighthouse móvil: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 (reportar números reales).
- [ ] CLS < 0.05; reportar LCP e INP medidos.
- [ ] JS de la ruta < 150 KB gzip (reportar el número real).
- [ ] Animaciones a 60 fps con CPU throttling ×4; solo `transform`/`opacity`; hero pausado fuera de pantalla y con pestaña oculta.
- [ ] Si el “wow” compromete algo de esto: simplificar y avisar.

## E. Seguridad de `leads`

- [ ] La migración activa RLS y **no** define políticas para `anon`/`authenticated`.
- [ ] Con la clave `anon` NO se puede `select` ni `insert` en `leads` (test automatizado cuando haya credenciales; si no, dejar el test marcado como `skip` con motivo y decirlo en el reporte).
- [ ] No se guarda IP en claro (solo `ip_hash` con sal). Sin secretos en el repo (`git grep -i "service_role"` solo en código/doc, sin valores).
- [ ] Ninguna variable secreta con prefijo `NEXT_PUBLIC_`.
- [ ] Errores internos nunca llegan al cliente.

## F. Visual

- [ ] Capturas por paso en: iPhone SE, iPhone 15, Pixel 7, tablet y desktop (Playwright).
- [ ] Sin valores sueltos de diseño; checklist de `webya-design-system` cumplido.
- [ ] Probado en navegador in-app de Instagram **en dispositivo real** (iOS y Android). Si no se pudo, declararlo como pendiente: emular el user agent no equivale a probarlo.

## G. Reporte final (formato)

1. Qué se hizo. 2. Resultado de lint / typecheck / tests / build (con números). 3. Lighthouse móvil, peso JS, CLS/LCP/INP. 4. Capturas. 5. **No verificado / pendiente** (honesto). 6. `TODO:` que debe completar el dueño.

## H. Lecciones de E2E (no repetir)

- **Foco al cambiar de paso:** con `AnimatePresence mode="wait"` el paso nuevo se monta recién al terminar la salida: el foco al título se mueve en `onExitComplete`, no en un `useEffect` (el ref aún no existe). Lo cubre `e2e/teclado.spec.ts`.
- **Foco al primer error:** React Hook Form sigue el orden de _registro_, no el visual. Se enfoca a mano (`ORDEN_CAMPOS` en `StepDatos`).
- **axe y animaciones:** `motion` anima `opacity` aun con reduced-motion; auditar contraste a mitad de un fade da falsos positivos. `auditar()` espera a que no haya animaciones corriendo.
- **Tests de selección:** hacer click en la `<label>` (como un usuario). `check({ force: true })` sobre un input `sr-only` de 1px es flaky si el chip aún se mueve.
- **E2E de producción** necesita `IP_HASH_SALT` (env.ts falla al arrancar sin ella; es a propósito). El servidor de E2E usa `.data/e2e-leads.json` y `RATE_LIMIT_MAX=100`.
- **Capturas:** son por plataforma (`-win32.png`). En Linux/CI hay que regenerarlas con `pnpm test:e2e visual --update-snapshots` y revisarlas a ojo.

## I. Rendimiento medido (cómo se midió y qué recordar)

- **Presupuesto de JS:** mide lo que baja un navegador moderno: el script `polyfill-nomodule` (`noModule`) **no cuenta**. `e2e/rendimiento.spec.ts` lo verifica (< 150 KB gzip iniciales, CLS < 0,05). Hoy: ~144 KB iniciales; el framework (React + runtime de Next) ya pesa ~135 KB, así que el margen es chico.
- **Wizard diferido:** `WizardLazy` lo descarga al primer gesto o al entrar en pantalla (~81 KB gzip: motion + RHF + zod). No uses un margen de IntersectionObserver grande: en celular el wizard queda pegado al primer viewport y se descargaría igual. Los tests lo abren con `abrirWizard(page)`; no uses `scrollIntoViewIfNeeded` sobre `#wizard` (el esqueleto se reemplaza mientras se baja).
- **Lighthouse real:** con `next build && next start` (nunca en dev), móvil, CPU ×4 y Fast 4G, con las herramientas de Chrome DevTools. La herramienta de Lighthouse excluye la categoría Performance: para Performance se usa una traza (LCP, CLS) y un toque real (INP).
- **Dependencias grandes:** antes de agregar una librería al cliente, medila (rolldown/esbuild + gzip). Referencias: react-dom 66 KB, motion 33 KB, zod 22 KB (zod/mini ~5 KB), react-hook-form 12 KB.
- **Build sin advertencias:** `next build` no debe mostrar warnings de Turbopack (p. ej. acceso dinámico al filesystem que traza todo el proyecto: se resuelve con `/* turbopackIgnore: true */`).
