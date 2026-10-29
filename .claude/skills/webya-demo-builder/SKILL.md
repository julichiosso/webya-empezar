---
name: webya-demo-builder
description: Cómo armar una demo interactiva de rubro para WebYa (como /demo/gastronomia) — datos de ejemplo en config, las dos caras (cliente y dueño), sincronización entre pestañas, personalización, compartir (QR y WhatsApp) y el CTA al lead. Usala para crear una demo nueva (peluquería, comercio…) o tocar la de gastronomía.
---

# WebYa — Construir una demo de rubro

Referencia viva: `/demo/gastronomia`. Una demo tiene que lograr que el dueño vea **las dos caras** de su negocio y piense "esto es lo que me falta", sin promesas falsas.

## 1. Estructura (copiá la de gastronomía)

```
src/config/demos/<rubro>/        ← TODOS los datos de ejemplo (nunca en componentes)
  types.ts      ids livianos (COCINA_IDS / variantes, RUBRO_DEMO, nombres) — sin cartas
  paletas.ts    6 paletas curadas (ColoresPaleta) con AA verificado por test
  cocinas/*.ts  una variante por archivo: carta, precios (pesos()), modificadores, pedidos de ejemplo
  index.ts      re-exporta + COCINAS, getCocina, TENANT_DEMO, MODULOS_DEMO, AVISO_DEMO
src/features/demo/<rubro>/
  store.ts          estado (useSyncExternalStore) sobre el DOMINIO (domain/…): nada de reglas propias
  sincronizacion.ts localStorage + BroadcastChannel (+ evento storage), todo lo recibido se SANEA
  compartir.ts      URL compartible (?local&paleta&cocina), link de WhatsApp, datos para el wizard
  cliente/          la cara del cliente (en papel crema, dentro de un celular en escritorio)
  duenio/           la cara del dueño (cargada con next/dynamic, ssr:false)
  Personalizar.tsx  nombre + paleta + variante; CodigoQR.tsx (uqr, import diferido)
  DemoGastronomia.tsx  pantalla dividida (lg) / selector flotante (celular) + CTA + aviso
src/app/demo/<rubro>/page.tsx    servidor: metadata y encabezado
```

Los ids que necesita `/empezar` (paletas, variantes, rubro) se importan de `types.ts`/`paletas.ts`, **nunca** del `index.ts` (arrastraría las cartas al wizard y al presupuesto de 150 KB).

## 2. Reglas de contenido

- **Cartel permanente** (`AVISO_DEMO`): "Demo con datos de ejemplo. No se cobra ni se envía nada." Fijo arriba siempre.
- Precios y platos "de ejemplo", rotulados así en pantalla. Pagos **simulados** y dichos así ("Mercado Pago (simulado)").
- Nada de testimonios, logos de clientes, métricas ni sellos. El resumen del dueño se calcula **solo** con los pedidos de la demo.
- Copy en voseo, verbos de acción, humor liviano en estados vacíos ("Acá encaja tu primer pedido").

## 3. Las dos caras y la sincronización

- Escritorio: pantalla dividida (cliente en un marco de celular de 25rem + panel). Celular: una cara a la vez, selector flotante `aria-pressed` con View Transition (fundido) si existe; contador de novedades en la cara del dueño.
- Store único: la acción del cliente (p. ej. `confirmarPedido`) y la del dueño (`avanzarPedido`) usan el dominio; el otro lado se entera porque lee el mismo store.
- `iniciarSincronizacion()` una vez en el contenedor: restaura, escucha otras pestañas y difunde cambios **locales** (los remotos no se re-difunden). Tope de registros guardados.
- Anuncios `aria-live` y sonidos: solo para lo **reciente** (`esReciente`), nunca para lo restaurado al recargar.

## 4. Personalización ("el momento wow")

- Nombre (≤ 40), una de 6 paletas curadas, variante. La paleta se aplica con `variablesDePaleta()` en el contenedor: **cero** colores en línea en componentes (la excepción documentada es la muestra del color en el selector, que sale de la config).
- La URL (`?local=&paleta=&cocina=`) reproduce la personalización (QR y WhatsApp) y gana sobre lo guardado. Se valida contra la config al leer.
- QR: `uqr` con `import()` al abrir, dibujado con un `<path>` propio (sin innerHTML), módulos oscuros sobre papel claro.

## 5. CTA al lead

- "Quiero esto para mi local" es un `<a href="/empezar#wizard">` (funciona sin JS). Al tocar, `prepararWizardDesdeDemo()` deja el wizard en el paso 2 con rubro, módulos de la demo activados a mano (lo sugerido que no está, apagado), nombre del local, `origen` y `demo` — usando la persistencia del wizard, que vuelve a sanear todo.
- `origen` sale de la lista cerrada `config/origenes.ts`; `demo` se valida contra paletas/variantes conocidas (API y wizard).
- Desde `/empezar`, elegir el rubro muestra la entrada "Mirá cómo quedaría".

## 6. Rendimiento y accesibilidad

- JS inicial de la demo < 220 KB gzip; lo pesado (panel, QR) diferido. `/empezar` no puede pasar de 150 KB.
- Hojas (bottom sheets) con `components/ui/Hoja`: foco atrapado, Escape, arrastre, fondo `inert` al cuadro siguiente (evita reflow forzado: INP).
- Contadores de tiempo con `useAhora` (se pausa oculto o fuera de pantalla). Animaciones solo transform/opacity, una vez, con versión estática.
- Todo clickeable ≥ 48 px; nombre accesible que contiene el texto visible (WCAG 2.5.3).

## 7. Analítica

`demo_view`, `demo_personalizada`, `demo_pedido_creado`, `demo_estado_avanzado`, `demo_cta_click`, `demo_qr_celular`, `demo_whatsapp_click` (`src/lib/analytics.ts`). Nunca mandar el texto que escribe la persona (nombre del local): solo "escrito".

## 8. Checklist de una demo nueva

- [ ] Datos en `config/demos/<rubro>/` con tests (ids únicos, precios en centavos, ejemplos que pasan la validación real, paletas AA).
- [ ] Cliente → dueño → cliente probado en componentes y E2E (escritorio, celular y dos pestañas).
- [ ] Personalización por UI y por URL; CTA hasta el lead con `origen` correcto.
- [ ] axe sin violaciones, teclado, reduced motion, 48 px, sin scroll horizontal.
- [ ] Peso medido (inicial y con todo cargado) y `/empezar` sigue < 150 KB.
