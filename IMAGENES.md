# Imágenes que faltan (para reemplazar placeholders)

Se cargan en `src/content/proyectos.ts` (campo `imagenes`) y van en `public/proyectos/`. Mandalas en PNG o JPG
originales: las convierto a WebP/AVIF, las recorto y les pongo el alto reservado (sin saltos de layout).

**Formato**: capturas de celular a tamaño nativo del teléfono (ej. 1170×2532 de un iPhone o 1080×2400 de un
Android); de escritorio, 2880×1800 (1440×900 al doble). Sin datos personales de clientes finales a la vista
(nombres, teléfonos, direcciones): si aparecen, se tapan antes de publicar.

| Proyecto              | Captura                                                    | Dispositivo                  | Archivo esperado            |
| --------------------- | ---------------------------------------------------------- | ---------------------------- | --------------------------- |
| Micio's Pizzería      | Carrito con 2–3 productos                                  | celular                      | `micios-carrito.png`        |
| Micio's Pizzería      | Elegir horario de retiro (franjas de 15 min)               | celular                      | `micios-franjas.png`        |
| Micio's Pizzería      | Panel de administración (pedidos del día)                  | escritorio                   | `micios-panel.png`          |
| Micio's Pizzería      | Foto de una comanda impresa real                           | foto vertical                | `micios-comanda.jpg`        |
| Micio's Pizzería      | La app instalada en la pantalla de inicio                  | celular                      | `micios-pwa.png`            |
| Peluquería Canina     | Elegir día, hora y profesional                             | celular                      | `canina-reserva.png`        |
| Peluquería Canina     | Pantalla de pago de la seña (Mercado Pago)                 | celular                      | `canina-sena.png`           |
| Peluquería Canina     | Notificación push de nueva reserva en el celular del dueño | celular (pantalla bloqueada) | `canina-push.png`           |
| Peluquería Canina     | Agenda del día por profesional (panel)                     | celular o escritorio         | `canina-agenda.png`         |
| Joyería Petrucci      | Una categoría del catálogo                                 | celular                      | `petrucci-catalogo.png`     |
| Joyería Petrucci      | Panel: subir la foto de un producto desde el celular       | celular                      | `petrucci-panel.png`        |
| Abelardo Pizzería     | Producto personalizable (opciones)                         | celular                      | `abelardo-personalizar.png` |
| Abelardo Pizzería     | Carrito con envío a domicilio                              | celular                      | `abelardo-envio.png`        |
| Lorena (Fonosanjorge) | Sección de especialidades                                  | celular                      | `lorena-especialidades.png` |

## Además

- **Logo `<webya>` en vector limpio** (SVG o AI/PDF). El actual es un calco con bordes serruchados.
- **URL del turnero de Peluquería Canina**, si está publicado (hoy el caso ofrece "Pedí la demo").
- **Opcional**: una foto tuya, para un bloque "quién está detrás" (no se muestra hasta tenerla).
- **Testimonios reales** (texto + nombre + negocio + permiso para publicarlo): el manifiesto ya tiene el campo.
