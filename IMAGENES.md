# Imágenes que faltan (para reemplazar placeholders)

Todo lo que se muestra de cada proyecto sale de **un solo manifiesto**: `src/content/proyectos.ts` (campo
`imagenes`: `desktop`, `mobile` y `admin`). La foto de Julián se carga en `src/content/paginas.ts`
(`NOSOTROS.foto`). Mientras una imagen falte, el sitio muestra un placeholder vectorial prolijo (el esquema del
sistema en el teléfono, o las iniciales "JC").

**Cómo mandarlas**: PNG tal cual salen (no fotos de la pantalla), como archivo o por Drive, no por WhatsApp (las
comprime). Yo las convierto a WebP/AVIF y fijo su tamaño (sin saltos de layout). Sin datos personales de clientes
finales a la vista (nombres, teléfonos, direcciones): si aparecen, se tapan antes de publicar.

## Por proyecto (casos)

Las capturas de escritorio de Micio's, Petrucci y Lorena están cargadas hoy desde los sitios publicados (las tomé
de la portada pública, 1600 × 1000). Si preferís otras, se reemplazan con estos nombres.

| Proyecto          | Archivo                                       | Qué                                              | Tamaño      | Estado hoy                 |
| ----------------- | --------------------------------------------- | ------------------------------------------------ | ----------- | -------------------------- |
| Micio's Pizzería  | `micios-desktop.png`                          | Portada en la computadora                        | 1600 × 1000 | cargada (de la portada)    |
| Micio's Pizzería  | `micios-mobile.png`                           | Portada en el celular                            | 780 × 1688  | cargada (captura larga)    |
| Micio's Pizzería  | `micios-admin.png`                            | Panel del dueño: pedidos del día                 | 1600 × 1000 | **falta**                  |
| Joyería Petrucci  | `petrucci-desktop.png`                        | Portada en la computadora                        | 1600 × 1000 | cargada (de la portada)    |
| Joyería Petrucci  | `petrucci-mobile.png`                         | Portada en el celular                            | 780 × 1688  | cargada (captura larga)    |
| Joyería Petrucci  | `petrucci-admin.png`                          | Panel: subir la foto de un producto              | 1600 × 1000 | **falta**                  |
| Lorena Almagro    | `lorena-desktop.png`                          | Portada en la computadora                        | 1600 × 1000 | cargada (de la portada)    |
| Lorena Almagro    | `lorena-mobile.png`                           | Portada en el celular                            | 780 × 1688  | cargada (captura larga)    |
| Turnero (Canina)  | `canina-desktop.png`                          | Reserva en la computadora (servicio, día y hora) | 1600 × 1000 | **falta** (hay esquema)    |
| Turnero (Canina)  | `canina-mobile.png`                           | Reserva en el celular                            | 780 × 1688  | cargada (aviso de reserva) |
| Turnero (Canina)  | `canina-admin.png`                            | Agenda del día por profesional                   | 1600 × 1000 | **falta**                  |
| Abelardo Pizzería | `abelardo-desktop.png`, `abelardo-mobile.png` | Cuando esté publicado                            | igual       | no se muestra todavía      |

**Logos de los clientes** (opcional, solo con su permiso): SVG o PNG con fondo transparente, `[slug]-logo.svg`.

## De Webya

| Para                        | Qué                                                           | Formato y tamaño                           | Archivo      |
| --------------------------- | ------------------------------------------------------------- | ------------------------------------------ | ------------ |
| Quiénes somos (`/nosotros`) | Foto tuya: retrato de medio cuerpo, fondo simple, luz natural | JPG vertical 4:5, **1200 × 1500 px** o más | `julian.jpg` |

## Además

- **Testimonios reales** (texto + nombre + negocio + permiso para publicarlo): el manifiesto ya tiene el campo y la
  página de cada caso los muestra solo si existen.
- **Resultados verificables** por caso (si los hay): campo `resultado`; sin dato, el bloque no aparece.
- **Logo**: el sitio usa tu SVG tal cual. Si existe el archivo original de diseño (AI, Figma, PDF), conviene tenerlo.
