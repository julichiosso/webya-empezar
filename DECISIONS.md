# DECISIONS — Rediseño Webya

Decisiones tomadas en modo autónomo. Cada una: qué y por qué.

## Fase 1 — Auditoría y deploy

- **Next 16.4.3 → 16.4.6.** El build fallaba con `SecurityFatalError` y `pnpm audit` confirmó dos avisos moderados
  parcheados en 16.4.5. Es un parche dentro de la misma menor: riesgo bajo, y sin él no sale ningún deploy.
- **`vercel.json` con `framework: nextjs`.** Un preset "Other" sirve `public/` y la raíz da 404. Fijarlo en el repo
  saca esa variable de la configuración del panel.
- **No toqué el DNS de `webya.dev`.** El 404 de hoy lo devuelve un nginx detrás de Cloudflare, no Vercel. Cambiar el
  DNS es producción y es de Julián: los pasos exactos están en `AUDIT.md` §5.

## Fase 2 — Sistema visual

- **Geist como única familia** (variable, un solo woff2 para todo el sitio) en lugar de Outfit. Es la sans de
  Vercel, sólida en pesos altos para titulares y neutra en texto chico: el tono Linear/Vercel/Apple que se pidió.
  `@fontsource/outfit` salió de las dependencias; entró `@fontsource/geist` (solo dev, para la imagen OG).
- **Tonos por sección** (`.tono-oscuro` / `.tono-claro`) con variables `--e-*`. Los componentes no saben en qué
  fondo están. Las utilidades de Tailwind se llaman `ed-*` y no `e-*`: en Tailwind 4 `border-e-*` es el borde
  _inline-end_ y pisaba el borde derecho.
- **Lima `#c6f135` solo en tres lugares**: hover del botón primario, anillo de foco en fondos oscuros y el punto de
  disponibilidad. En fondo claro el foco y el punto son negros (la lima no contrasta sobre blanco).
- **Logo `<webya>`**: los trazos originales del wordmark + dos chevrones del mismo grosor, en SVG inline
  (`brand/logo/LogoCorchetes.tsx`). El SVG original es un calco con bordes serruchados: a tamaño grande se nota, por
  eso el logo del pie no pasa de 34rem. **Pedido a Julián: el logo en vector limpio.**
- **Motion sin librerías**: un único `<script>` en línea (~1 KB) con IntersectionObserver hace reveals, contadores,
  líneas que se dibujan, el paso activo del turnero, el imán de los CTA y pausa los bucles fuera de pantalla. Solo
  `transform`/`opacity` (y `stroke-dashoffset` en trazos SVG finos). Con `prefers-reduced-motion` no se oculta nada.
  `motion` (la librería) sigue instalada solo por la demo y `/sistema`: la home no la carga.
- **View Transitions** con `<ViewTransition>` de React 19.3 en el layout (Next 16 lo soporta sin flag).

## Fase 3 — Home

- **`/` es la home nueva** y **`/empezar` redirige a `/` con 307** (no permanente): el link de la bio de Instagram
  sigue andando y se puede volver atrás sin caché de redirección.
- **Capturas reales donde ya existían.** El prompt pedía placeholders vectoriales; Micio's, Petrucci, Fonosanjorge y
  Abelardo ya tenían capturas reales de sus sitios publicados (trabajo propio de Webya). Se usan como portada del
  caso; Peluquería Canina, que no tiene, usa el mockup vectorial. Todo vive en un solo manifiesto:
  `src/content/proyectos.ts`.
- **Dominios**: `joyeriapetrucci.com.ar` (el prompt) responde 200 y reemplaza al `.vercel.app` anterior. Peluquería
  Canina no tiene URL conocida: el caso ofrece "Pedí la demo" en lugar de un link.
- **Abelardo "En construcción"** con link "Ver el avance" (el sitio responde y es real).
- **Canina "Todavía sin uso"** (corregido por Julián el 2026-11-19: no está en producción). El caso se mantiene porque
  el turnero es el producto estrella y el sistema existe; ofrece "Pedí la demo" y no cuenta en "funcionando en
  producción". Las capturas reales se suman igual cuando lleguen.
- **Cifras**: salen del manifiesto (`resumenProyectos`), nunca a mano: 5 sistemas, 3 en producción, 4 rubros.
- **Sin testimonios** en pantalla: el manifiesto tiene el campo `testimonio` vacío y la UI no muestra nada hasta que
  haya uno real y autorizado.
- **Sin cupos ni urgencia inventada.** "Tomando proyectos nuevos" es la única señal de disponibilidad.
- **Marca escrita "Webya"** (como en el prompt), no "WebYa".
- **San Francisco = San Francisco, Córdoba** en el JSON-LD. Confirmado por Julián el 2026-11-19.

## Fase 4 — Configurador

- **Cero requests**: el botón final es un `<a href="https://wa.me/…">`. No se guarda el lead: el WhatsApp que recibe
  Julián _es_ el lead. Guardarlo con una sola request (sendBeacon) queda en `ROADMAP.md`, fase 1.5.
- **WhatsApp por defecto `5493406419495`** (el +54 3406 419495 de Julián con el 9 de celular que exige wa.me para
  Argentina). Es público, así que vive en `src/lib/site-config.ts` y funciona sin tocar Vercel;
  `NEXT_PUBLIC_WHATSAPP_NUMBER` lo pisa. Si la variable se define con otro número, ese manda. El camino a mail
  (`mailto:` con el mismo texto) queda solo como red de seguridad si el número quedara vacío.
- **Módulos marcados por defecto** según el tipo (lo más pedido), para que el camino sea tipo → rubro → enviar.
- **Nombre del negocio opcional**: mejora el mensaje sin agregar un paso obligatorio.
- **Atajos**: cualquier enlace con `data-armar`/`data-modulo` (bento, hero, header, cierre) preselecciona.

## Fase 5 — SEO

- **Landings `/turnero`, `/pizzerias`, `/tiendas`**: suman porque cada una responde a una búsqueda local distinta y
  reutilizan los mismos componentes (plantilla en `src/app/_landing`).
- **JSON-LD**: `ProfessionalService` (LocalBusiness) + `WebSite` + un `Service` por servicio, `areaServed` con San
  Jorge y San Francisco, `FAQPage` con el mismo texto visible; en las landings `Service` + `BreadcrumbList`.

## Reglas de la casa que se tocaron (con motivo)

- **`tests/copy/excepciones.ts` creció** (la regla decía "solo puede achicarse"): "seña del 50%" y "franjas de 15
  minutos" son datos reales que dio Julián, y los horarios de las mini pantallas son ejemplos. Cada excepción dice
  por qué. Ninguna cifra comercial (precios, plazos, porcentajes de resultados) entró.
- **El skill `.claude/skills/webya-brand` y el design system naranja/crema quedaron desactualizados** para las
  páginas públicas: la marca ahora es negro y blanco. `/marca` y `/sistema` (internas, no indexadas) siguen
  mostrando el sistema anterior.

## Ajustes de Julián (2026-11-19)

- **Fuera las secciones de relleno.** Pedido explícito: sacar lo genérico. Se borraron de la home la marquesina de
  rubros (listaba rubros sin trabajos hechos), la cita y las cifras ("Hablás directo…", 5 / 3 / 4), el índice de
  rubros, "Cómo trabajo" y las preguntas frecuentes; de las landings, "Cómo trabajo" y las preguntas. Con las
  preguntas se fue el JSON-LD `FAQPage` (Google pide que coincida con texto visible). La zona de atención sigue
  visible en el hero y el pie. Queda: hero, qué armo, turnero, pedidos, proyectos, configurador y cierre.
- **Primera captura real del turnero**: la notificación push "Nueva reserva" sobre la reserva confirmada, en un
  iPhone. Reemplaza el mockup del paso 3 ("El aviso"). No va en la tarjeta de Peluquería Canina porque la captura
  es de otro panel (corte de cabello masculino): mostrarla ahí sería atribuirle algo que no es suyo.
