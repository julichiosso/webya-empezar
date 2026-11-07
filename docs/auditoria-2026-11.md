# Auditoría de WebYa — noviembre 2026

Para el dueño y para quien siga el proyecto. Qué se encontró, qué se arregló y qué falta. Severidad: **P0** pierde clientes hoy, **P1** frena la venta o arriesga datos, **P2** mejora.

## Resumen

WebYa tenía buena ingeniería y poca venta. Los tests, la seguridad y el rendimiento estaban bien; lo que fallaba era el negocio:

1. Ningún lead avisaba a nadie.
2. Nada se medía.
3. La primera pantalla no decía qué es WebYa.
4. El turnero no aparecía en ningún lado.
5. Un negocio no podía crear nada por su cuenta.

Los cinco quedaron resueltos, con las condiciones de la sección "Lo que tenés que hacer vos".

## Qué existe de verdad

No es un SaaS con cuentas: no hay usuarios, tenants, panel persistente ni sitios publicados. Son estas pantallas, y esto es lo que se auditó:

| Pantalla | Qué es |
|---|---|
| `/empezar` | Landing y wizard: rubro → nombre → vista previa → WhatsApp → datos opcionales |
| `/demo/gastronomia` | Carta y panel de pedidos, con datos de ejemplo |
| `/demo/peluqueria` (nueva) | Bot de turnos, agenda y estadísticas, con datos de ejemplo |
| `/crear` (nueva) | Editor del sitio, sin cuenta |
| `/ver` (nueva) | Borrador que se comparte por link |
| `/privacidad`, `/terminos` | Legales |
| `/marca`, `/sistema` | Internas, sin indexar |
| `/api/leads`, `/api/leads/[id]`, `/api/eventos` (nueva) | Backend |

## Hallazgos y estado

### Negocio y embudo

| Sev. | Hallazgo | Estado |
|---|---|---|
| P0 | Los leads solo dejaban una línea en el log: nadie se enteraba | **Arreglado en código.** Avisos por Telegram y mail, con link para escribirle con el saludo armado. Falta cargar las credenciales |
| P0 | La analítica no tenía proveedor: ningún evento salía del navegador | **Arreglado en código.** `POST /api/eventos`, sin cookies ni terceros, y la vista `embudo_diario`. Falta aplicar la migración |
| P0 | La primera pantalla era el telón: negro, logo apenas legible, sin mensaje | **Arreglado.** El hero va primero; el telón pasó a ser la prueba antes de los casos de clientes |
| P0 | El turnero no se vendía y "Turnos" figuraba como próximamente | **Arreglado.** Demo propia, sección en la landing, módulo disponible, FAQ y mensaje por rubro |
| P0 | Un negocio no podía crear nada solo | **Arreglado en parte.** `/crear` arma el sitio y da un link. La publicación sigue siendo con una persona (ver "Qué falta") |
| P1 | 6 de 8 módulos decían "Próximamente": la página parecía a medio hacer, y además era falso para Catálogo (Petrucci lo tiene) | **Arreglado.** Solo lo que se entrega en la lista; el resto en una línea |
| P1 | "Así te queda" era un panel de texto en 5 de los 6 rubros con plantilla | **Arreglado.** Todos muestran su sitio con el nombre de la persona |
| P1 | `empezar_view` salía recién al primer gesto: quien se iba sin tocar nada no contaba | **Arreglado.** `pagina_vista` sale al cargar |

### Backend y lógica

| Sev. | Hallazgo | Estado |
|---|---|---|
| P1 | Un doble envío o una respuesta perdida duplicaba el lead y el aviso | **Arreglado.** El reenvío del mismo WhatsApp, IP y negocio en 30 minutos actualiza su lead |
| P1 | Pisar el lead de otra persona conociendo su número (riesgo que introducía el arreglo anterior) | **Evitado.** La IP es parte de la condición, con test |
| P2 | Completar datos no avisaba | **Arreglado** |
| P2 | Los avisos demoraban la respuesta a la persona | **Arreglado** con `after()` |
| P2 | Origen nuevo sin la migración aplicada hacía fallar el guardado | **Evitado.** Guarda con el origen por defecto y deja el aviso en el log |
| P2 | El rate limit cuenta y después inserta: dos pedidos simultáneos pueden pasar el tope | **Abierto.** Riesgo bajo: hay límite de ráfagas. Se resuelve con una función en la base |
| P2 | `request.text()` lee el cuerpo antes de medirlo si no viene `content-length` | **Abierto.** Riesgo bajo: Vercel corta antes |
| P2 | `x-forwarded-for` es falsificable fuera de Vercel | **Abierto.** Solo importa si se muda de hosting |
| P2 | La migración `pedidos` existe pero nada la usa | **Abierto.** Se aprovecha cuando exista la publicación real |

Sin problemas: validación con Zod en servidor, honeypot, hash de IP, token de un solo uso, RLS sin políticas, CSP y headers, secretos fuera del repo (`.env` no está versionado), errores sin detalle interno.

### UX, UI y copy

| Sev. | Hallazgo | Estado |
|---|---|---|
| P1 | Hero sin visual, con un panel vacío a la derecha | **Arreglado.** Celular con el sitio de cada rubro y el ticket de lo que entra |
| P1 | Secciones de solo texto, sin mostrar el producto | **Arreglado.** "Tocalo antes de decidir", con el producto a la vista |
| P2 | Sin enlaces a las demos en la barra ni junto al CTA | **Arreglado** |
| P2 | La vista previa con scroll no se alcanzaba con teclado | **Arreglado** |
| P2 | Jerga en textos no visibles en /empezar: `instagram.ts` y el video ("Todo lo digital", "Digitalizá") | **Abierto.** Conviene decidir el lema y actualizar los dos |
| P2 | La demo de gastronomía pide personalizar antes de mostrar el producto | **Abierto.** En escritorio la carta queda abajo del pliegue |

## Comparación con el mercado

Los datos de competidores vienen de búsquedas de hoy, varios de fuentes del propio proveedor, y **no se verificaron precios en pesos**. Las observaciones sobre flujos son criterio de producto: no se probaron esos productos ni se midió nada.

| Referente | Qué hace bien | Qué hizo WebYa |
|---|---|---|
| Booksy y Fresha | Reservas maduras. Cobran comisión por cliente nuevo del marketplace: Booksy declara 30 % de la primera cita con tope de USD 100, y una comparativa le atribuye a Fresha 20 % | Se puede vender "tus clientes son tuyos" **solo si tu precio no lleva comisión**. Hoy no está en el copy porque el precio no está definido |
| AgendaPro | Está en Argentina y en español | Es el competidor directo del turnero: vale mirarlo a fondo antes de fijar el precio |
| Tiendanube | Plan gratis en Argentina y catálogo fuerte | No conviene competir en tienda online pura. WebYa gana en carta, pedidos y turnos armados con una persona |
| Wix | Control total, pero el trabajo es tuyo | Lo armamos con vos, y antes te mostramos cómo queda |
| Stripe, Linear, Vercel | El producto se ve y se toca enseguida | Demos sin dato, hero con el producto |
| Calendly | Una sola cosa, sin fricción | El bot resuelve el pedido en una frase |

**La ventaja que nadie más ofrece junta:** ver tu negocio con tu nombre antes de dejar un dato, y probar el bot y el panel del dueño sin cuenta.

## Lo que tenés que hacer vos

1. **Cargar los avisos en Vercel.** Sin esto seguís sin enterarte de los leads: `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` y/o `RESEND_API_KEY` + `NOTIFY_TO_EMAIL`. Los pasos están en `.env.example`.
2. **Aplicar dos migraciones en Supabase:** `20261106120000_leads_origenes_crear.sql` y `20261106130000_eventos.sql`. Hasta entonces el sitio funciona, pero no se guardan los eventos y los orígenes nuevos se guardan como `instagram`.
3. **Revisar lo que se dice de tu bot.** Solo sé lo que me dijiste: bot, turnero, agenda, estadísticas, ciencia de datos e IA. No sé el canal (no dice "WhatsApp" a propósito), ni si manda recordatorios o cobra señas. Textos en `content/empezar/productos.ts`, `content/faq.ts` y `content/rubros/mensajes.ts`.
4. **Confirmar el dominio.** `.env` y `.env.example` dicen `webya.ar`; el código, la marca y el handoff dicen `webya.dev`. Afecta canonical, sitemap y Open Graph.
5. **Definir el precio** (`content/precios.ts`). Es la objeción más grande que sigue sin respuesta.
6. **Sumar nombre y foto de quien está detrás** (`FUNDADOR`) y, cuando los tengas, testimonios reales.
7. **Probar el telón en el navegador de Instagram.** Sigue sin probarse en el dispositivo real; `NEXT_PUBLIC_INTRO_LOGO=0` lo apaga.

## Qué falta para ser una plataforma

- **Publicación real.** `/crear` da un borrador en un link: no es un sitio publicado. Falta modelo de datos con tenants, auth, ruta pública `/n/[slug]`, moderación y panel del dueño. Son varias sesiones, y publicar contenido ajeno en tu dominio pide resolver abuso y phishing antes.
- **Conectar la demo con el bot real.** Las cuentas de la demo son estadística simple sobre datos de ejemplo (promedio ponderado, mediana de ritmo por cliente) y el "bot" es una conversación por reglas. Ninguna de las dos usa IA, y la demo no lo afirma. La frase "con ciencia de datos e IA" describe tu producto, según me dijiste.
- **Plantillas con más carácter por rubro.** Hoy comparten una sola estructura.

## Fuentes

- [Booksy: el mejor software para salones](https://biz.booksy.com/es-us/blog/el-mejor-software-para-salones)
- [Pabau: Booksy vs Fresha](https://pabau.com/es/blog/booksy-vs-fresha/)
- [AgendaPro vs Booksy](https://agendapro.com/blog/agendapro-vs-booksy/)
- [Capterra: Fresha vs AgendaPro](https://www.capterra.com/compare/142138-218709/Shedul-com-vs-AgendaPro)
- [Tiendanube: planes en Argentina](https://ayuda.tiendanube.com/es_AR/123482-planes/cuales-son-los-planes-de-tiendanube-y-que-inlcuyen)
- [Tiendanube: alternativas a Wix](https://www.tiendanube.com/blog/alternativas-a-wix/)
- [SaaSHero: tendencias de landing pages](https://www.saashero.net/design/top-landing-page-design-trends/)
