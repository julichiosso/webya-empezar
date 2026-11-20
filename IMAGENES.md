# Imágenes que faltan (para reemplazar placeholders)

Todo lo que se muestra de cada proyecto sale de **un solo manifiesto**: `src/content/proyectos.ts` (campo
`imagenes`). La foto de Julián se carga en `src/content/paginas.ts` (`NOSOTROS.foto`). Mientras una imagen falte,
el sitio muestra un placeholder vectorial prolijo (el teléfono con el esquema del sistema, o las iniciales "JC").

**Cómo mandarlas**: capturas sacadas directo en el celular, tal cual salen (PNG), como archivo o por Drive, no como
foto de WhatsApp (las comprime). Yo las convierto a WebP/AVIF, las recorto y fijo su tamaño (sin saltos de
layout). Sin datos personales de clientes finales a la vista (nombres, teléfonos, direcciones): si aparecen, se
tapan antes de publicar.

## Imprescindibles (hoy hay placeholder)

| Para                         | Qué                                                              | Formato y tamaño                                        | Nombre de archivo  |
| ---------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- | ------------------ |
| Quiénes somos (`/nosotros`)  | Foto tuya: retrato de medio cuerpo, fondo simple, luz natural    | JPG vertical 4:5, **1200 × 1500 px** o más              | `julian.jpg`       |
| Peluquería Canina (proyecto) | La página de reservas en el celular, desde arriba (scroll largo) | Captura de celular completa, **1170 px de ancho** o más | `canina-sitio.png` |

## Para enriquecer cada proyecto (opcionales)

| Proyecto              | Captura                                              | Dispositivo          | Archivo esperado        |
| --------------------- | ---------------------------------------------------- | -------------------- | ----------------------- |
| Micio's Pizzería      | Carrito con 2–3 productos                            | celular              | `micios-carrito.png`    |
| Micio's Pizzería      | Elegir horario de retiro (franjas de 15 min)         | celular              | `micios-franjas.png`    |
| Micio's Pizzería      | Panel de administración (pedidos del día)            | escritorio o celular | `micios-panel.png`      |
| Micio's Pizzería      | Foto de una comanda impresa real                     | foto vertical        | `micios-comanda.jpg`    |
| Peluquería Canina     | Pantalla de pago de la seña (Mercado Pago)           | celular              | `canina-sena.png`       |
| Peluquería Canina     | Agenda del día por profesional (panel)               | celular o escritorio | `canina-agenda.png`     |
| Joyería Petrucci      | Panel: subir la foto de un producto desde el celular | celular              | `petrucci-panel.png`    |
| Lorena (Fonosanjorge) | Sitio en la computadora (para la demo de página web) | escritorio, 1440 px  | `lorena-escritorio.png` |
| Abelardo Pizzería     | Cuando esté publicado: la home en el celular         | celular              | `abelardo-sitio.png`    |

Ya cargadas (no hace falta mandarlas de nuevo): Micio's, Joyería Petrucci, Lorena Almagro y Abelardo (capturas de
celular en `public/clientes/`) y la notificación push del turnero (`public/proyectos/turnero-aviso.webp`).

## Además

- **Logo `<webya>` en vector limpio** (SVG o AI/PDF). El actual es un calco: en tamaños grandes se notan bordes
  serruchados. Con el vector limpio se regeneran los trazos (`scripts/optimizar-logo.mjs`).
- **Testimonios reales** (texto + nombre + negocio + permiso para publicarlo): el manifiesto ya tiene el campo.
- **Demo de pedidos (opcional)**: fotos reales de las pizzas, cuadradas, 800 × 800 o más, con el nombre del
  producto (`muzzarella.jpg`, `napolitana.jpg`…).
