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

## Merge con `origin/main` (2026-11-19)

El rediseño salió de `74ff2f1`; en GitHub había 5 commits posteriores (6 y 7 de noviembre) sobre el `/empezar`
viejo. Julián pidió hacer pull y dejar todo limpio. Criterio: **la cara del sitio es el rediseño**; de GitHub se
queda lo que funciona por debajo o suma prueba real.

- **Se queda**: avisos de leads (Telegram y mail), `/api/eventos` + `lib/medicion.ts` (montada en el layout),
  migraciones de Supabase (no se borra una migración que puede estar aplicada), `/demo/peluqueria` con su dominio
  de turnos (ahora vuelve a `/` y su CTA lleva a `/turnero#armar`), skills nuevas de `.claude/`.
- **Se va**: el hero, las secciones y el telón del `/empezar` viejo, `/crear` y `/ver` (hechos sobre el wizard;
  quedan en el historial, ver `ROADMAP.md`), los videos de uso de los sitios (eran del hero viejo) y las capturas
  de `visual.spec`.
- **Limpieza del legado**: fuera `/marca`, `/sistema`, el script de tema claro/oscuro (solo aplicaba a
  `/empezar`), los componentes que solo usaban esas páginas, las dependencias `motion` y `react-hook-form`, los
  eventos del wizard y los docs de traspaso viejos (`docs/PROMPT_TRASPASO.md`, `docs/auditoria-2026-11.md`; sus
  pasos pendientes pasaron a `AUDIT.md` §5). README reescrito para el sitio actual.
- **Embudo**: migración nueva `embudo_configurador` que recrea la vista `embudo_diario` con los pasos del
  configurador (la vieja contaba pasos del wizard).

## Teléfonos con isla flotante (2026-11-19)

- Pedido de Julián: teléfonos "bien reales", como el último iPhone Pro Max. El marco es CSS puro
  (`.e-tel*` en `editorial.css`), en `cqw` del propio teléfono: proporción 77,6 × 163 mm, titanio, bisel fino,
  isla con lente, barra de estado (9:41, señal, wifi, batería), barra de inicio y botones de acción, volumen,
  encendido y control de cámara. Sin imágenes ni JS.
- La barra de estado mide lo mismo que la de una captura real de iPhone: la captura del aviso push calza debajo.
- En las tarjetas de proyectos la barra toma el color de arriba de cada sitio (`BARRA_CAPTURA` en
  `brand/tokens/colores.ts`), como hace Safari.
- El teléfono de las demos (`components/patterns/Telefono`) ya tenía isla; el del video explicativo es SVG y no
  se tocó.

## Demo del sistema de pedidos (2026-11-19)

- Pedido de Julián: demos cómodas en celular y escritorio, con sus productos reales. Base: el `DEMO_SPEC.md` que
  se extrajo del repo de Micio's (flujos, modelo, reglas, diseño). Julián eligió **rehacerla acá** (todo en el
  navegador, sin backend), **reemplazar** la demo genérica de gastronomía y **sin fotos reales**.
- `/demo/pedidos`: en escritorio, el celular del cliente y el panel del dueño lado a lado, del mismo alto y dentro
  de la pantalla, con una guía de tres pasos; en celular, pantalla completa y un selector "Cliente / Dueño" con su
  propio lugar abajo (no tapa nada). "Reiniciar" vuelve al principio.
- Lógica real del spec, pura y con tests (`src/domain/retiro`): franjas de 15 minutos, tope por franja, salto de
  las llenas, cálculo del retiro (20 min de cocina + 4 por pedido en cola), pausar y cambiar cupos. La noche de la
  demo es un viernes a las 20:40 con franjas ya ocupadas, para que se vea el salto.
- Carta: las pizzas son las reales de Micio's; bebidas, postres y precios son de ejemplo y la pantalla lo dice.
  Dibujos en lugar de fotos. Colores, Anton, radios y animaciones del sistema real (`src/brand/demos/pedidos.css`);
  el panel usa sus colores iOS, oscurecidos lo justo para pasar AA.
- El WhatsApp se simula: se muestra el mensaje que arma el sistema y "Enviar (simulado)" lo confirma. La comanda se
  ve como ticket de 80 mm y se puede imprimir.
- Se borraron la demo de gastronomía, su contenido, el video explicativo (solo se abría desde ahí), el QR y dos
  componentes sin uso. `/demo/gastronomia` redirige a `/demo/pedidos`.

## Demos más a mano y claras (2026-11-19)

- Pedido de Julián: que quede claro que es una demo y que el sistema real hace más, sin texto que suene a IA;
  que en el celular se llegue rápido a la demo y que la demo se abra aparte, como otro sistema.
- "Ver demo" en el encabezado (visible en el celular) y como segundo botón del hero. Abre `/demo` en otra pestaña:
  una página corta para elegir (pedidos o turnos) que en el celular se ve sin scrollear.
- Cada demo lleva una barra fina propia (`BarraDemo`): "Demo", el sistema, "Qué más hace", reiniciar y volver a
  las demos. Sin el encabezado del sitio. La primera vez que se entra se abre sola con "Esto es una demo" y la
  lista concreta de lo que el sistema real hace además (sale de lo entregado, `content/demos/hub.ts`).
- Los "Probá la demo" de las secciones y del configurador también abren en otra pestaña.

## La demo muestra el producto, no al cliente (2026-11-19)

- Pedido de Julián: la demo de pedidos no puede ser "la de Micio's". Ahora es el producto: la app dice "Tu
  pizzería", el panel "Panel del local", el mensaje y la comanda no nombran a nadie. La barra dice solo "Pedidos".
- El cliente real va aparte y bien mostrado: "Conocé cómo ya lo usa Micio's Pizzería", con su captura y el link a
  su sitio (`EnUso`, sale del manifiesto de proyectos). En escritorio debajo de la guía; en celular, en el aviso
  de entrada. La demo de turnos no lo lleva: no hay un turnero en producción todavía.
- Etiqueta "Demo" como cápsula rellena, sin borde y sin el punto separador.
- La app de la demo usa un azul neutro como acento (`--m-acento`), no el lima de Micio's: en el sistema real es el
  color de cada negocio. Sobre el acento, texto blanco.
- "Quiero esto para mi negocio": se probó un destello animado y no convenció; queda como los demás botones del
  sitio, con la flecha.
- Rótulos de escritorio: "Así lo ve tu cliente" sobre el teléfono y "Así lo manejás vos" sobre el panel. Cortos.
- La tarjeta del caso real no es un link entero: el borde aparece al pasar el mouse y el link es solo el dominio,
  que se subraya al pararse encima.
