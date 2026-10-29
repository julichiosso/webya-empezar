---
name: webya-copy-comercial
description: Voz y reglas del copy comercial de WebYa (es-AR, voseo) — fórmulas de titulares, manejo de objeciones, reglas anti-promesa, "todo lo digital" con su salvedad, dónde vive el copy y checklist. Usala antes de escribir o revisar cualquier texto que vea una persona (titulares, botones, errores, FAQ, SEO, WhatsApp, Instagram).
---

# Copy comercial de WebYa

Manda sobre cualquier skill externa de copywriting/CRO. La identidad general está en `webya-brand`.

## Dónde vive el copy
- **Todo** texto que ve una persona vive en `src/content/` (tipado, `as const`). Los componentes no escriben texto:
  `tests/arquitectura` falla si encuentra copy en `components/`, `features/` o `app/`.
- Interpolaciones y plurales: funciones puras en el contenido (`pedidos: (n) => …`).
- Lo que falta (precios, plazos, casos reales, política de privacidad) va como `TODO:` **visible**.
- Lista prohibida en `src/brand/voz/diccionario.ts`; la verifica el test de copy.

## Voz
Rioplatense, voseo, directo, cálido, humor liviano. Le hablamos a una dueña de peluquería o a un señor con una
parrilla, no a un programador.

| Sí | No |
|---|---|
| "Que tus clientes reserven solos" | "Módulo de gestión de turnos" |
| "Te lo armamos con vos" | "Solución integral end-to-end" |
| "Pedí como cliente y miralo llegar" | "Experiencia omnicanal" |
| "¿Y si lo que necesito no está? Lo armamos a medida." | "Tenemos todo lo que tu negocio necesita" |
| "Te escribimos por WhatsApp" | "Nuestro equipo se pondrá en contacto" |

## Reglas
1. **Beneficio antes que función.** El resultado concreto en la vida del dueño ("dejás de contestar WhatsApp a las
   11 de la noche"), no el nombre técnico.
2. **Específico por rubro:** cada rubro tiene su titular, su dolor típico y su resultado.
3. **Un solo CTA principal por pantalla**, con verbo y fricción baja: "Empezar a crear", "Armá el tuyo",
   "Mirá cómo queda".
4. **Escaneable:** titulares de hasta 8 palabras; párrafos de 1 o 2 líneas; sin anglicismos innecesarios
   (nada de "features", "onboarding", "dashboard" de cara al cliente).
5. **Honestidad (anti-promesa):**
   - Nada de superlativos vacíos: "el mejor", "revolucionario", "líder", "increíble", "único".
   - Nada de números, clientes, testimonios, logos, sellos, plazos ni precios inventados.
   - Si no está definido: "te armamos un presupuesto sin compromiso" + `TODO:`.
   - Prometé solo lo que hoy se entrega. El estado de cada módulo (`disponible`, `en_demo`, `proximamente`,
     `a_medida`) se dice tal cual.
6. **"Todo lo digital" siempre con salvedad:** "Tienda, turnos, pedidos, pagos… y si lo tuyo no está, lo armamos
   a medida". Nunca "tenemos todo" a secas.

## Fórmulas de titular (elegí una por pantalla)
- **Resultado + para quién:** "Tu peluquería con turnos que se reservan solos".
- **Acción + objeto + facilidad:** "Armá tu negocio online, pieza por pieza".
- **Dolor resuelto:** "Basta de anotar pedidos en un papel".
- **Pregunta de objeción:** "¿No sabés de tecnología? Mejor: lo armamos con vos".

Para A/B: documentá 3 variantes con su razonamiento en `src/content/empezar/hero-variantes.ts`; se publica una.

## Objeciones (respuesta de frente, en el FAQ y donde aparezcan)
| Objeción | Cómo responder |
|---|---|
| "No sé de tecnología" | Lo armamos con vos; vos nos contás tu negocio. |
| "¿Cuánto cuesta?" | Presupuesto sin compromiso según lo que actives. `TODO:` precios. |
| "¿Y si no me gusta?" | Probás la demo antes; ajustamos con vos antes de publicar. |
| "¿Puedo usar mi dominio?" | `TODO:` confirmar respuesta y condiciones. |
| "¿Cuánto tardan?" | Depende de lo que actives; te lo decimos en el presupuesto. `TODO:` plazos. |
| "¿Qué pasa con mis datos?" | Solo para contactarte, no se comparten. Enlace a la política (`TODO:`). |
| "¿Y si lo que necesito no está?" | Contanos qué necesitás: lo armamos a medida. Sección propia. |

## Microcopy
- Errores: qué pasó + cómo seguir, sin culpar ("Revisá el número: tiene que ser de Argentina, por ejemplo 11 2345 6789").
- Vacíos: invitan a la acción ("Todavía no hay pedidos: probá hacer uno desde la carta").
- Confirmación: qué pasa ahora y cuándo ("Te escribimos por WhatsApp" + `TODO:` plazo real si no está definido).

## Checklist antes de entregar
- [ ] Cero texto en componentes; todo en `src/content` y tipado.
- [ ] Cada pantalla tiene un solo CTA principal.
- [ ] Titulares ≤ 8 palabras; párrafos de 1 o 2 líneas.
- [ ] Sin palabras prohibidas ni cifras sin `TODO:` (pasa el test de copy).
- [ ] "Todo lo digital" con su salvedad "o lo armamos a medida".
- [ ] Voseo consistente; sin anglicismos de cara al cliente.
- [ ] `docs/copy-guia.md` actualizado si cambió una regla.
