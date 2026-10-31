# Guía de copy de WebYa

Para quien escribe o revisa un texto que ve una persona: la web, el wizard, la demo, WhatsApp o Instagram.
Las reglas de fondo están en las skills `webya-copy-comercial` (manda) y `webya-brand`. Si una skill externa de
copywriting o CRO dice otra cosa, ganan estas.

El copy vive en `src/content/` (tipado, `as const`). El test `tests/copy/copy.test.ts` recorre **todos** los
`.ts` de esa carpeta por glob (también lo que devuelven las funciones de interpolación) y falla si encuentra
una palabra de la lista prohibida (`src/brand/voz/diccionario.ts`), un "tenemos todo" sin "a medida" o un
número sin `TODO:`.

## 1. Voz

Rioplatense, directa, cálida, con humor liviano. Le hablamos a la dueña de una peluquería o a un señor con una
parrilla, no a un programador. Alguien del barrio que sabe de tecnología, no un banco ni una startup.

- **Voseo siempre:** armá, activá, elegí, tocá, probá, contanos. Nunca "crea", "tú", "usted".
- **Beneficio antes que función:** lo que cambia en el día del dueño, no el nombre técnico.
- **Un verbo por botón**, con fricción baja: "Empezar a crear", "Probar la demo", "Quiero esto para mi local".
- **Humor** solo en vacíos, confirmaciones y detalles chicos. Nunca en errores, pagos ni datos personales.
- **Sin anglicismos** de cara al cliente: panel (no dashboard), lo que podés activar (no features), arrancar
  (no onboarding).
- **Sin tics de IA:** nada de "no es X, es Y", listas de negaciones, "¿El resultado? …", rayas en textos cortos
  ni signos de exclamación.

| Sí                                                                     | No                                           |
| ---------------------------------------------------------------------- | -------------------------------------------- |
| "Que tus clientes reserven solos."                                     | "Módulo de gestión de turnos."               |
| "Te lo armamos con vos."                                               | "Solución integral end-to-end."              |
| "Pedí como cliente y miralo llegar."                                   | "Experiencia omnicanal."                     |
| "Te escribimos por WhatsApp." + `PENDIENTES.plazoRespuesta`            | Cualquier plazo de respuesta (sin confirmar) |
| "Depende de lo que actives: te armamos un presupuesto sin compromiso." | "Desde $X por mes."                          |
| "Acá encaja tu primer pedido."                                         | "No hay datos para mostrar."                 |

## 2. Formato

- Titulares de **hasta 8 palabras**. Párrafos de **1 o 2 líneas**.
- **Un solo CTA principal por pantalla.** Lo demás va como enlace secundario ("O mirá una demo funcionando").
- El concepto Encastre ("Encajá lo que te falta", "Sumá una pieza") con medida: no en cada título.

## 3. Fórmulas de titular (una por pantalla)

| Fórmula                     | Ejemplo                                              |
| --------------------------- | ---------------------------------------------------- |
| Resultado + para quién      | "Tu peluquería con turnos que se reservan solos"     |
| Acción + objeto + facilidad | "Armá tu negocio online, pieza por pieza"            |
| Dolor resuelto              | "Basta de anotar pedidos en un papel"                |
| Pregunta de objeción        | "¿No sabés de tecnología? Mejor: lo armamos con vos" |

Para A/B: 3 variantes razonadas en `src/content/empezar/hero-variantes.ts`; se publica una (un test verifica
que `hero.ts` coincida con la marcada).

## 4. Objeciones y cómo se responden

De frente, en el FAQ (`src/content/faq.ts`) y donde aparezcan.

| Objeción                         | Respuesta                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| "No sé de tecnología"            | Lo armamos con vos; vos nos contás tu negocio.                                             |
| "¿Cuánto cuesta?"                | Presupuesto sin compromiso según lo que actives. `PENDIENTES.precios`                      |
| "¿Y si no me gusta?"             | Probás la demo antes; ajustamos con vos antes de publicar.                                 |
| "¿Puedo usar mi dominio?"        | `PENDIENTES.dominio` hasta que se confirme.                                                |
| "¿Cuánto tardan?"                | Depende de lo que actives; te lo decimos en el presupuesto. `PENDIENTES.plazoEntrega`      |
| "¿Qué pasa con mis datos?"       | Solo para contactarte, no se comparten. `PENDIENTES.privacidad`                            |
| "¿Y si lo que necesito no está?" | Contanos qué necesitás: lo armamos a medida. Sección propia (`empezar/a-medida.ts`) y FAQ. |

## 5. Reglas anti-promesa

- **Sin superlativos vacíos:** "el mejor", "revolucionario", "líder", "increíble", "único en", "número uno",
  "garantizado", "100 %". Están en la lista prohibida.
- **Sin números, clientes, testimonios, logos, sellos, plazos ni precios inventados.** Lo que falta va como
  `TODO:` visible, desde `src/content/pendientes.ts`.
- **Prometé solo lo que hoy se entrega.** El estado de cada módulo (`disponible`, `en_demo`, `proximamente`,
  `a_medida`) se dice tal cual; los "disponible" sin confirmar llevan `PENDIENTES.moduloSinConfirmar`.
- **La entrega es manual:** "lo armamos a mano y con vos", nunca "tu web lista en minutos".
- **La demo dice que es demo:** "Demo con datos de ejemplo. No se cobra ni se envía nada."
- **Números permitidos** (`tests/copy/excepciones.ts`): el teléfono de ejemplo, la ayuda "sin el 15 ni el +54",
  colores hex, el "#24" de una comanda y los datos de ejemplo de la demo. Esa lista **solo puede achicarse**:
  si un número nuevo no es de ejemplo, lleva `TODO:` o se escribe en palabras sin afirmar nada.

## 6. "Todo lo digital", siempre con su salvedad

La promesa es amplia y por eso va acompañada: **"Todo lo digital para tu negocio. Y si no está, lo armamos a
medida."** Nunca "tenemos todo" a secas (el test lo busca). Si hay que listar, la lista termina en la salida a
medida: "Tienda, turnos, carta con QR, pedidos y pagos… y si lo tuyo no está, lo armamos a medida".

## 7. Dónde vive cada texto (`src/content`)

| Archivo                                                                                                                                              | Qué tiene                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `empezar/hero.ts`, `hero-variantes.ts`                                                                                                               | Hero de /empezar y sus 3 variantes razonadas                        |
| `empezar/nav.ts`, `footer.ts`, `cta-final.ts`                                                                                                        | Navegación, pie y cierre de /empezar                                |
| `empezar/que-incluye.ts`, `como-funciona.ts`, `como-trabajamos.ts`, `confianza.ts`, `a-medida.ts`, `vitrina-demo.ts`, `preview.ts`, `faq-seccion.ts` | Secciones de /empezar                                               |
| `empezar/wizard.ts`, `wizard-flujo.ts`, `pasos.ts`                                                                                                   | Wizard (necesidad, rubro, módulos, WhatsApp, completar)             |
| `necesidades.ts`, `modulos.ts`, `estados-modulo.ts`                                                                                                  | Necesidades, catálogo de módulos y la etiqueta de cada estado       |
| `rubros/*`                                                                                                                                           | Un archivo por rubro: titular, dolor, resultado y módulos sugeridos |
| `faq.ts`                                                                                                                                             | Preguntas frecuentes (también alimenta el JSON-LD)                  |
| `leads.ts`, `leads-mensajes.ts`                                                                                                                      | Errores y confirmaciones del formulario y la API de leads           |
| `whatsapp.ts`                                                                                                                                        | Mensajes precargados de WhatsApp                                    |
| `seo.ts`                                                                                                                                             | Títulos, descripciones y la imagen para compartir                   |
| `estados-pagina.ts`, `microcopy.ts`                                                                                                                  | 404, error, carga y palabras genéricas de los componentes base      |
| `demos/gastronomia/**`                                                                                                                               | Datos de ejemplo y textos de la demo                                |
| `explicativo/**`                                                                                                                                     | Guion, escenas y reproductor del video "Mirá cómo funciona"         |
| `marca.ts`                                                                                                                                           | Página interna /marca                                               |
| `instagram.ts`                                                                                                                                       | Bio y captions de Instagram (no lo usa ningún componente)           |
| `pendientes.ts`                                                                                                                                      | Todo lo que falta definir, con su `TODO:`                           |

## 8. Instagram

Archivo: `src/content/instagram.ts` (lo cubre el test de copy y además `src/content/instagram.test.ts`: bio de
hasta 150 caracteres con el link y la salvedad, una caption por pilar, gancho de hasta 8 palabras, cuerpo de 1
o 2 líneas, CTA a la bio, entre 3 y 5 hashtags sin tildes, sin emojis, sin exclamaciones ni rayas). El texto
para pegar sale de `CAPTIONS_INSTAGRAM[i].texto`. El campo `antesDePublicar` dice qué confirmar antes y no se
publica.

**Bio** (136 caracteres; enlace del perfil: `https://webya.ar/empezar`)

> Todo lo digital para tu negocio. Y si no está, lo armamos a medida. Te escribe una persona, por WhatsApp.
> Armá el tuyo: webya.ar/empezar

**1. Todo lo digital**

> Todo lo digital para tu negocio.
>
> Tienda, turnos, carta con QR, pedidos y pagos. Activás solo lo que usás.
> Y si lo tuyo no está en la lista, lo armamos a medida con vos.
>
> Elegí tus piezas desde el link de la bio.
>
> #NegocioLocal #Emprendedores #Pymes #WebYa

**2. Demo de gastronomía**

> Pedí como cliente y miralo llegar.
>
> Abrí la demo en el celular, pedí algo de la carta y mirá cómo le entra al dueño en el panel.
> Es una demo con datos de ejemplo: no se cobra ni se envía nada.
>
> Probala desde el link de la bio, en "Probar la demo".
>
> #Gastronomia #CartaQR #Pizzeria #Resto #WebYa

**3. Turnos** (antes de publicar: `PENDIENTES.moduloSinConfirmar`, confirmar que turnos hoy se entrega)

> Que tus clientes reserven solos.
>
> Eligen día y horario desde el celular, y vos ves la agenda ordenada.
> Dejás de pasar turnos por WhatsApp a las once de la noche.
>
> Contanos cómo te organizás hoy: link en la bio.
>
> #Peluqueria #Estetica #Turnos #NegocioLocal

**4. Otra cosa / a medida**

> ¿Lo que necesitás no está en la lista?
>
> Contanos con tus palabras qué te falta y lo armamos a medida, con vos.
> Antes de arrancar te pasamos un presupuesto sin compromiso.
>
> Escribilo en "Otra cosa", desde el link de la bio.
>
> #Emprendedores #Pymes #NegocioLocal #WebYa

**5. Confianza** (antes de publicar: `PENDIENTES.plazoRespuesta`; no prometer un plazo)

> Del otro lado hay una persona.
>
> Dejás tu WhatsApp y te escribe alguien del equipo para entender tu negocio.
> Lo armamos a mano y con vos, y antes de publicar lo ajustamos juntos.
>
> Dejá tu WhatsApp en el link de la bio.
>
> #NegocioLocal #Emprendedores #HechoConVos #WebYa

Si cambiás una caption en el archivo, actualizá esta sección.

## 9. Checklist antes de publicar

- [ ] Cero texto en componentes: todo en `src/content`, tipado.
- [ ] Un solo CTA principal por pantalla (o por post), con verbo.
- [ ] Titulares de hasta 8 palabras; párrafos de 1 o 2 líneas.
- [ ] Voseo en todo; sin anglicismos de cara al cliente.
- [ ] Sin palabras prohibidas ni números sin `TODO:` (`pnpm exec vitest run tests/copy`).
- [ ] "Todo lo digital" con "o lo armamos a medida".
- [ ] Nada de plazos, precios, clientes, métricas ni sellos: si falta, `TODO:` desde `pendientes.ts`.
- [ ] Cada módulo con su estado real; la demo dice que es demo.
- [ ] Humor solo donde corresponde (nunca en errores, pagos ni datos personales).
- [ ] Instagram: revisar `antesDePublicar` de la caption y que el link de la bio abra /empezar.
- [ ] Esta guía actualizada si cambió una regla.

## 10. Lo que falta definir

Todo lo pendiente está en `src/content/pendientes.ts` (plazo de respuesta, precios, plazos de entrega, dominio,
privacidad, módulos sin confirmar). Cuando el usuario confirme algo, se cambia el texto visible que lo acompaña
y se borra la clave.

## 11. Antes / después (sprint base de marca)

- Hero: "Creá tu negocio online. / Elegí tu rubro. Activá lo que necesitás." → "Todo lo digital para tu
  negocio. / Y si no está, lo armamos a medida." (variantes y razonamiento en `content/empezar/hero-variantes.ts`).
- Señal del hero: la promesa de un plazo de respuesta → "Te escribimos por WhatsApp" (+ TODO del plazo).
- FAQ: "¿En cuánto tiempo está?" → "¿Cuánto tardan?", con "depende de lo que actives" + TODO de plazos.
- Footer: "Tu negocio. Nuestra tecnología." (lo podría decir cualquiera) → "Todo lo digital para tu negocio, o
  lo armamos a medida."
