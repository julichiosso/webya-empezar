# AUDIT_PROTECTORAS — qué se reutiliza para protectoras y entidades (2026-11-20)

## Lo que ya existe y sirve

| Pieza | Dónde | Uso en protectoras |
|---|---|---|
| Turnero con cupos, seña y aviso al dueño | `features/demo/turnos`, sistema real de Canina | Voluntariado, castraciones y entrevistas de adopción con cupo |
| Tienda con carrito y consulta por WhatsApp | `features/demo/tienda`, Petrucci | Venta solidaria, rifas, ferias |
| Carga de fotos desde el celular | panel real de Petrucci | Cargar un animal nuevo desde el celular |
| Aviso push simulado | `AvisoPush` (Pantallas.tsx) | Solicitud de adopción nueva en la vista de administración |
| Barra de demo (aviso, Reiniciar, Escribinos) | `BarraDemo.tsx` + `content/demos/hub.ts` | La demo nueva entra al hub con su ficha |
| Pasos con teléfono que cambia de pantalla | `PasosTurnero.tsx` | Ficha → solicitud → entrevista → adoptado |
| Configurador con preselección por URL | `features/configurador` | `?tipo=medida&rubro=entidades&modulos=…` |
| Buscador por intención | `content/buscador-destinos.ts` | Palabras del rubro → landing, demo y configurador |
| Sugerencias del celular | `content/sugerencias.ts` | "¿Tenés una protectora o un club?" |
| Contactos con aviso por Telegram | `/api/leads` | "Te escribimos nosotros" en la landing |

## Lo que NO existe (y el prompt menciona)

- **No hay `/cafeterias` ni demo de cafeterías con interruptor de vistas** en este repo. Se sigue el patrón de
  las landings de producto (`HeroPagina` + bloques + `Cierre`) y el de la demo de turnos (vista cliente / vista
  del dueño), con un interruptor propio **Vista pública / Vista administración**.
- **No hay stepper de pantallas** en el configurador (es de una pantalla con tres pasos de un toque).
- **No hay sistema real de socios y cuotas, donaciones con campañas, hogares de tránsito ni rendición de
  cuentas**: en la landing van marcados **a medida**. Lo que se arma sobre piezas que ya funcionan en clientes
  (vitrina con fotos desde el celular, turnos con cupo, tienda, cobro con Mercado Pago, aviso al celular,
  respuestas por WhatsApp, panel) va como **base lista**.

## Manifiestos

- Rubros del configurador: `content/configurador.ts` (`RUBROS_CONFIG`, `MODULOS_CONFIG` por tipo).
- Demos: `content/demos/hub.ts` (`DEMOS`).
- Landings de producto: `content/landings.ts` (tipadas por `TipoId`); protectoras no es un tipo de sistema
  nuevo sino un **rubro** sobre el tipo `medida`, con su propio contenido en `content/protectoras.ts`.

## Plan

1. Contenido: `content/protectoras.ts` (landing y módulos con estado honesto) y `content/demos/protectora.ts`
   (organización ficticia "Refugio Ventarrón", animales, cuotas, campaña, turnos; sin cifras en el texto).
2. Demo `/demos/protectora`: vista pública (adoptar, hacerse socio, donar, anotarse) y de administración
   (solicitudes con aviso, cargar animal, socios al día y que deben con recordatorio, cuentas), compartir ficha.
3. Landing `/protectoras` con celular, escenas, módulos, para quién, cómo trabajamos y condiciones.
4. Integración: buscador, configurador, hub de demos, home (rubros), menú, sugerencias, sitemap, privacidad.
5. E2E en celular y escritorio, capturas, documentos.
