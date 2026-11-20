# DECISIONS — Webya

Decisiones tomadas en modo autónomo. Cada una: qué y por qué. La V2 (segunda ronda, MEGA PROMPT V2) va primero.

## V2 · Ajustes después de la revisión de Julián

- **Título**: "Técnico Universitario en Programación (UTN)" (la carrera es la Tecnicatura Universitaria en
  Programación), en el sitio y en el JSON-LD.
- **Sin numeración "01 /" en las secciones**: era una etiqueta decorativa que no informa (la V2 pide sacarlas).
- **Rubros del hero sin cortar**: ejemplos más cortos, que entran completos en 360 px.
- **Logo: el SVG de Julián, tal cual y sin corchetes** ("sin piquitos"). `LogoWebya` dibuja solo la palabra, con
  el encuadre ajustado a las letras, en el header, el pie, la pantalla de carga (se escriben las cinco letras), el
  favicon y la imagen para compartir. El suavizado automático (`scripts/suavizar-logo.mjs`) queda como herramienta
  opcional; el sitio usa el archivo original.
- **Botones sin flechas**: el botón es texto (y el ícono de WhatsApp cuando corresponde). Las flechas quedan solo
  en links de texto y filas de listas, donde indican que se navega.
- **Fondos de marca en las secciones claras**: el wordmark de Webya en contorno de 1 px (se dibuja al entrar en
  pantalla) o una de las frases de Webya en letra hueca ("Creá. Digitalizá. Crecé.", "Tu negocio. Nuestra
  tecnología.", "Web · Sistemas · Automatización", las de la bio de Instagram). Son SVG: la frase se ajusta
  exacto al ancho (`textLength`), nunca se corta. Negro al 10–16 %, sin color. Reemplazan a los puntos, la
  grilla y las curvas de la ronda anterior, que no decían nada de Webya.
- **Franja "Creá. Digitalizá. Crecé."** en la home, debajo del hero: cada palabra arranca hueca y se llena al
  entrar en pantalla.
- **Botones con gesto vectorial**: al pasar el mouse, un trazo de 1 px dibuja el contorno del botón por fuera
  y el texto rueda hacia arriba. En todos los botones del sitio, las demos y el configurador.
- **Campo y agro** (`/campo`, en el menú, el hero, el pie y el configurador): turnos de descarga, pedidos de
  insumos, maquinaria y repuestos, contratistas, veterinaria rural y a medida. Cada caso lleva al producto que
  lo resuelve. No se inventan clientes del agro: la página dice que se arman sobre los sistemas que ya andan.
- **"Te escribimos nosotros"** en el cierre de todas las páginas: WhatsApp (obligatorio), negocio y qué
  necesita. Una sola request a `/api/leads` (lead parcial: validación, rate limit, trampa anti-spam y aviso al
  instante por Telegram o mail, ya existentes). Si falla, el mismo texto sale por WhatsApp. No manda `origen`:
  sumar uno nuevo pide una migración de Supabase (queda como pendiente).
- **Prueba al toque en la primera pantalla**: "Funcionando en Micio's Pizzería · Joyería Petrucci · Lorena
  Almagro", con link a cada proyecto.
- **Vidriera en el hero de cada producto**: los trabajos hechos en teléfonos que desfilan despacio, con el del
  producto primero; cada captura se recorre sola de arriba a abajo. Solo transform, pausa fuera de pantalla y al
  pasar el mouse; con movimiento reducido queda quieta y se desliza a mano.
- **Cada demo con "Escribinos"** (WhatsApp con un mensaje que dice qué demo probó) además de "Quiero esto para mi
  negocio", como pide la V2.
- **CSS en línea, medido y descartado otra vez**: bajó el FCP pero el LCP no mejoró y duplica el CSS en el payload
  de React. Sí se sacó la animación de entrada de la bajada del hero, que es el elemento LCP.

## V2 · Fase 7 — SEO y accesibilidad

- **Dominio canónico fijo en el código** (`https://webya.dev` en `site-config.ts`), no en una variable de entorno:
  si en Vercel quedaba `NEXT_PUBLIC_SITE_URL` con el dominio de preview, el canonical y el JSON-LD apuntaban a
  `*.vercel.app`. Los links internos ya eran relativos.
- **JSON-LD de la home**: `Organization` + `ProfessionalService` (dirección y zona) + `Person` (Julián, UTN) +
  `WebSite` + un `Service` por producto, enlazados por `@id`. `areaServed` lista cada localidad de `/zona`, con
  su provincia (una sola fuente: `content/paginas.ts`). Cada página de producto suma su `Service` y la miga de pan.
- **Metadata por página** con una sola función (`metadataPagina`): título con plantilla, descripción, canonical,
  Open Graph y Twitter. Sitemap con todas las páginas públicas y las demos (prioridad baja).
- **Accesibilidad**: axe (WCAG 2.2 AA) en las 15 rutas y en 7 tamaños de pantalla, más el menú del celular
  abierto y el configurador completo. Arreglado: nombre accesible de la barra de progreso y de las fotos de la
  tienda. Los links que abren otra pestaña lo dicen en su nombre accesible, no en texto visible (lo verifica un
  test).

## V2 · Fase 6 — Configurador

- **`/armar`, una sola vista**: tres pasos, resumen en vivo y una barra de progreso de tres segmentos (en el
  resumen y en la barra fija del celular, con `role="progressbar"`). Copy sin contradicciones: "Tres pasos, un
  toque cada uno".
- **Botón final "Enviarnos mi pedido por WhatsApp"**, con el mensaje prellenado sin nombres de personas.
- **No sumé un guardado del lead por API.** El configurador no pide teléfono ni mail: guardar "alguien eligió
  turnero" sin forma de contactarlo es ruido. El envío ya queda medido (`configurador_enviar` por
  `/api/eventos`, un `sendBeacon` con rate limit) y el pedido llega completo por WhatsApp. Si más adelante se
  pide el teléfono en el configurador, `/api/leads` ya existe (validación, rate limit, anti-spam).
- **Rubros para cualquier negocio**: "Gastronomía" y "Comercio o tienda" en lugar de "Pizzería o comida" y
  "Joyería o comercio"; el "Ver demo" del resumen lleva a la demo de cada rubro.

## V2 · Fase 5 — Demos

- **Cuatro demos en `/demos`**, cada una con la misma barra (es una demo, qué más hace el sistema real,
  reiniciar, volver) y el proyecto real que ya lo usa: pedidos (Micio's), turnos, página web (Lorena Almagro) y
  tienda (Joyería Petrucci). El hub también deja elegir por rubro.
- **Página web**: una sola plantilla con el contenido de cinco rubros, para mostrar que la estructura es la misma
  y lo que cambia es el negocio. La estructura sale de los sitios entregados; los textos son propios y los
  negocios, genéricos ("Tu consultorio", "Tu peluquería"…), igual que en la demo de turnos. Se mira en celular
  o computadora (container queries: la misma página se acomoda sola).
- **Tienda en vivo**: rubro → nombre, color y logo → hasta tres productos (nombre, precio y foto de prueba o
  una propia) → la tienda armada al instante, con inicio, ficha y carrito. "Quiero esta tienda" abre WhatsApp con
  el resumen. Se dice en pantalla que es una vista previa y que la tienda real se arma con el cliente: no se
  promete creación automática.
- **Las fotos que se suben no salen del navegador** (`URL.createObjectURL`, se liberan al salir). La CSP ya
  permite `blob:` en imágenes. Las fotos de prueba son dibujos SVG propios (sin stock).
- **Los botones de WhatsApp de la página y la tienda de ejemplo no abren WhatsApp**: muestran qué harían en el
  sitio real. Solo "Quiero esta tienda" (la acción de verdad) abre el chat.

## V2 · Fase 4 — Velocidad y pantalla de carga

- **Herramientas instaladas** (solo desarrollo, de npm oficial):
  - `svgo` 4.1: optimiza los trazos del logo que van en línea en cada página (`scripts/optimizar-logo.mjs`,
    3.696 → 1.996 caracteres por logo; el header y el pie lo llevan, así que son ~3,4 KB menos de HTML).
  - `@next/bundle-analyzer` 16.4.6: `ANALYZE=true pnpm build` muestra qué pesa en cada bundle.
  - **No instalé un MCP de navegador**: Playwright ya está en el repo y alcanza para ver el sitio. Sumé
    `scripts/capturas.mjs` (capturas en cualquier ancho, mide alto y desborde) y `scripts/probar-carga.mjs`.
    Un MCP nuevo pide reiniciar la sesión y no agrega nada a esto.
  - Lighthouse se corre con `npx lighthouse` cuando hace falta (no se agrega al repo: pesa mucho). El número que
    vale es el de PageSpeed Insights sobre el deploy: esta máquina (i3) da números bajos y variables.
- **Pantalla de carga solo si tarda**: arranca invisible y aparece a los 450 ms por CSS. La inicial se va cuando
  el documento terminó de llegar (`.listo`, que pone el script de movimiento en `DOMContentLoaded`); si la página
  llega antes, nunca se ve. Sin JS no aparece (regla en `<noscript>`). Las navegaciones que no estaban precargadas
  (las demos) usan la misma pieza en `app/loading.tsx`.
- **El logo se escribe con SVG puro**: cada letra y cada corchete con `pathLength=1` y `stroke-dashoffset`, y
  después el relleno. Con movimiento reducido aparece quieto.
- **Respuesta inmediata al tocar**: botones que se hunden (80 ms), links y tarjetas que bajan la opacidad en
  `:active`. Prefetch por defecto de Next en todos los links internos salvo las demos (pesadas, CSS propio).

## V2 · Fase 2 — Sistema visual

- **Fuera el destello y el hover lima del botón principal.** La V2 prohíbe brillos y degradados sin excepciones; el
  botón ahora cambia de tono al pasar el mouse y se hunde al tocarlo. El lima queda solo como anillo de foco sobre
  fondo oscuro (funcional, para teclado).
- **Teléfono plano.** El marco "realista" llevaba degradados de titanio, brillo de vidrio y sombras internas. Se
  conservó la forma (isla, botones, barra de estado) con colores lisos y un borde de 1 px.
- **Las demos conservan la interfaz del producto** (el punto verde de "Abierto", las pastillas de estado): muestran
  el sistema que se entrega, no la estética del sitio. Sin sombras ni degradados igual.
- **Subrayados con `text-decoration`** (no con `::after`): grosor 1 px, separación 0,32 em, color a media tinta
  que se completa al pasar el mouse. Es lo que hace Apple y funciona en textos de varias líneas.

## V2 · Fase 3 — Estructura y copy

- **Home hub de cinco bloques**: hero (con "Elegí tu rubro" adentro), bento con links, proyectos, quiénes somos y
  cierre. El selector de rubro se fusionó con el hero para cumplir dos pedidos a la vez: "en la primera pantalla
  las demos" (ronda anterior) y "Elegí tu rubro" (V2), sin sumar una sección.
- **Páginas propias**: `/turnero`, `/pedidos`, `/tienda` (con el catálogo en `#catalogo`), `/web`, `/proyectos`,
  `/demos`, `/armar`, `/nosotros`, `/zona`. Redirecciones permanentes desde `/pizzerias`, `/tiendas` y `/demo/*`:
  el dominio todavía no está indexado, así que no se pierde nada.
- **Una plantilla para los productos** (`LandingServicio`): hero con las dos acciones → producto (dolor →
  solución → prueba) → para quién (rubros con su lenguaje) → proyectos de ese tipo → cierre.
- **El configurador vive en `/armar`** y toma la preselección de `?tipo=` en el cliente: la página sigue estática.
- **Tres verbos para tres acciones**: "Armá tu sistema", "Ver demo", "Escribinos". La CTA de la barra de las
  demos ("Quiero esto para mi negocio") se mantiene: Julián la eligió en la ronda anterior.
- **Voz en plural en todo el sitio, con una excepción**: la presentación de `/nosotros` es una cita firmada por
  Julián en primera persona. Mostrar a la persona es justamente lo que pide esa sección.
- **Los mensajes de WhatsApp ya no nombran a nadie** ("Hola, vengo de webya.dev…").
- **"Próximamente"** para Peluquería Canina (hecho, no en uso) y Abelardo (en construcción, sin link público). Cada
  proyecto cuenta problema → qué armamos → qué ve el cliente; `resultado` pasó a `ve`.
- **Menú del celular** como panel a pantalla completa (Escape, cierre al navegar, sin scroll de fondo) y **barra
  inferior** con "Escribinos" y "Armá tu sistema" en todas las páginas menos `/armar`, que ya tiene la suya.
- **Sin `Suspense` por sección**: partía el HTML y el pie quedaba antes del contenido para quien lee sin JS.
- **Las demos siguen abriendo en otra pestaña** (lo pidió Julián en la ronda anterior); se avisa en el nombre
  accesible del link y con la flecha diagonal, no con texto visible.
- **Retrato de Julián**: iniciales en un cuadro hasta que pase la foto (`NOSOTROS.foto` en `content/paginas.ts`).

---

# V1

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

## Demo de turnos con el sistema real (2026-11-19)

- Base: `DEMO_SPEC_TURNOS.md` (secciones 1 a 5) extraído del sistema real. Reemplaza la demo vieja del bot de
  peluquería (`/demo/peluqueria` redirige a `/demo/turnos`); se borraron su feature, su contenido y su dominio.
- Cliente: portada del negocio, servicio con su próximo libre, profesional ("Cualquiera" primero), día y hora
  (lo más cercano, días con lugar, mañana/tarde/noche, "Quedan N"), datos, checkout simulado de Mercado Pago
  (aprobado, rechazado o volver), apartado de 10 minutos con contador, confirmación con aviso, calendario (.ics
  real) y la regla de cancelación de 24 horas. "¿Lo de siempre?" después de la primera reserva.
- Dueño: "Tu Panel" con Inicio (en la silla con la barra que avanza, la fila, atendidos, a resolver) y Agenda
  (siete días, por profesional, huecos libres y bloqueos), hoja del turno, cobro al terminar con medio y
  carteles con "Deshacer". La reserva nueva entra sola, confirmada, con la etiqueta "Nueva": no hay que aprobarla.
- Lógica pura y con tests en `src/domain/reservas` (el mismo algoritmo de horarios libres del sistema real). Los
  profesionales son una extensión de la demo, como pide el spec: cada uno con su agenda.
- Escenario común de las demos (`EscenarioDemo`): las dos demos comparten barra, guía, teléfono escalado, panel
  y selector del celular.
- Pendiente: secciones 6 a 10 del spec (diseño, assets, datos de ejemplo, simulación del backend y "el sistema
  real, además") para ajustar colores, datos y la lista de lo que la demo no muestra.

## Turnos: secciones 6 a 10 del spec y hero que lleva a las demos (2026-11-19)

- Demo de turnos con el diseño real (§6): tokens de color exactos, fuente del sistema, curva
  `cubic-bezier(0.2, 0.8, 0.2, 1)`, presión al tocar (`scale(0.97)`), "pop" al elegir día u horario. Logo genérico:
  la inicial sobre cuadrado negro (§7). Texto "Mercado Pago" en su azul y WhatsApp en su verde.
- Datos del spec (§8): Lucía, Tomás y Martina, seis servicios, agenda de ayer a dentro de tres días con todos los
  casos (atendido con cobro, no vino, sin seña, esperando seña con su apartado, cancelado con seña y pago sin
  horario) y un feriado. El "hoy" de la demo es un miércoles a las 16:40, para que cada turno caiga en un día en
  que su profesional atiende.
- Simulación (§9): reloj de la demo que se puede adelantar ("+10 min" en el panel) para ver vencer un apartado o
  cerrarse un turno; aviso de reserva nueva con las dos notas y la vibración del real. Quedan afuera la bandeja de
  correos, el bot y las métricas: están en "El sistema real, además" (§10).
- Panel: "A resolver" suma la seña de un turno cancelado; la hoja muestra la nota, "Sobre el cliente", el origen y
  "Faltó N veces antes".
- Hero de la home: en el celular había que scrollear mucho para llegar a algo para hacer. Ahora el CTA principal
  es "Ver demos" (probar antes de pedir), "Armá tu sistema" queda al lado, y abajo van las dos demos directas
  ("Probalo vos, ahora"). En el celular, título más chico y bajada corta: todo entra en la primera pantalla. Las
  landings mantienen "Armá tu sistema" como principal.

## Home más corta y directa, mapa de la zona (2026-11-19)

- Pedido de Julián: en la primera pantalla tienen que verse los botones y las demos; había que scrollear demasiado.
- Hero de la home en dos columnas en escritorio: mensaje y CTA ("Ver demos" y "Armá tu sistema") a la izquierda,
  las dos demos a la derecha con su descripción y "Abrir demo". Titular más contenido (`.e-hero-compacto`). Entra
  todo en 1366×690 y en un iPhone 15. Abajo, la zona con "Ver en el mapa".
- Menos scroll en toda la página: aire entre capítulos de hasta 6rem (era 10rem), títulos de sección más chicos.
  El turnero pasó de cinco pantallas de scroll a una: lista de pasos y teléfono que muestra el activo, avanza solo
  mientras está a la vista con una barrita que se llena, y se queda quieto si la persona toca un paso. Las
  tarjetas de proyectos: teléfono más chico, el problema en una línea y "Qué hace" plegado.
- Botones: fuera el imán (el botón que seguía al mouse). El principal se pone lima y un destello lo cruza una vez
  al pasar el mouse: llama la atención sin moverse ni repetirse.
- Mapa "Dónde atiendo" (SVG propio, sin mapas de terceros: liviano, sin requests ni datos a Google): San Jorge y
  San Francisco en sus coordenadas reales, el área de cada una, el límite entre Córdoba y Santa Fe (aproximado) y
  pueblos de referencia. Los puntos laten tres veces y paran.
- Proyecto sin sitio publicado con una demo de su sistema (Peluquería Canina): "Probá la demo" la abre directo.
