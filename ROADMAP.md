# ROADMAP — De "Armá tu sistema" a crear el sistema desde la plataforma

## Después de la V3 (alcance congelado el 2026-11-20)

Ideas que quedaron afuera a propósito, para no abrir frentes antes de publicar:

1. **Panel privado `/panel`** para ver y marcar contactos desde el celular (nuevo, contactado, cliente). Hoy alcanza
   con Telegram + la vista `contactos` de Neon. Necesita login (link por mail solo para el mail de Julián) y suma
   superficie de ataque: hacerlo bien, con tests de acceso.
2. **Guardar el pedido del configurador aunque no se mande** (`sendBeacon` con lo elegido, sin datos personales),
   para medir abandono por paso. El embudo ya cuenta tipo y envío.
3. **Demo de campo** interactiva (hoy `/campo` muestra soluciones y lleva a escribir): esperar al primer cliente
   del agro para modelarla con datos reales.
4. **Celular que acompaña el scroll en `/turnero`** (sticky en móvil, cambia de estado por paso). Hoy los pasos
   avanzan solos a la vista; el sticky en pantallas chicas tapa el texto.
5. **Lighthouse en CI** contra el deploy de Vercel (la máquina local no es confiable para medir).

## Dónde estamos (fase 1, hecha)

Auditado el repo: **no existe** alta self-service de negocios. No hay tenants, usuarios, auth, panel persistente ni
sitios publicados desde la plataforma (ver `docs/HANDOFF.md`, Fase 0). Lo que sí hay:

- El **configurador "Armá tu sistema"** (home y landings): captura la intención (tipo, rubro, módulos, nombre) y la
  manda a Julián por WhatsApp como un brief ordenado. Cero requests, estado en el cliente.
- Una **API de leads** con validación, rate limit, IP hasheada, repos memory/file/Supabase y avisos por Telegram y
  mail (`/api/leads`), hoy sin uso desde la UI nueva.
- **Medición propia**: cada página vista y cada paso del configurador van por `sendBeacon` a `/api/eventos`
  (tabla `eventos`, vista `embudo_diario`).
- Un **dominio de pedidos** (`src/domain/pedidos`: estados, totales, dinero en centavos) y la migración SQL `pedidos`.
- La **demo de gastronomía** (`/demo/gastronomia`): carta, carrito, panel y seguimiento en el cliente.
- La **demo de peluquería** (`/demo/peluqueria`): bot de turnos, agenda y estadísticas en el cliente
  (`src/domain/turnos`).

Por eso el sitio dice "lo armamos con vos" y no promete nada automático.

## Fase 1.5 — Medir y no perder pedidos (chico, alto impacto)

1. **Guardar el brief del configurador** al tocar "Mandar": `navigator.sendBeacon('/api/briefs', …)` con el mismo
   payload que el mensaje. Endpoint nuevo reusando `server/rate-limit.ts`, el hash de IP y un esquema Zod chico
   (tipo, rubro, módulos ⊂ catálogo, nombre ≤ 60). Una sola request, sin bloquear la apertura de WhatsApp.
2. ~~Analítica~~: hecho (medición propia, ver arriba). Falta mirar `embudo_diario` después del deploy.
3. ~~Limpieza del legado~~: hecho el 2026-11-19 (`/marca`, `/sistema`, tema claro/oscuro, telón, wizard).
4. **Creador sin cuenta** (`/crear` y `/ver`, commit `06bd6c9`): se sacó del sitio porque estaba hecho sobre el
   wizard viejo. Es la semilla natural de la fase 2: rehacerlo con el sistema editorial cuando arranque.

## Fase 2 — Alta self-service (multi-tenant)

### Modelo de datos (Supabase, RLS por `negocio_id`)

| Tabla                                 | Campos clave                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `negocios`                            | id, slug (único), nombre, rubro, plan, estado (`borrador`/`publicado`/`pausado`), dominio_propio |
| `miembros`                            | negocio_id, user_id (auth.users), rol (`duenio`/`staff`)                                         |
| `modulos_activos`                     | negocio_id, modulo_id, config jsonb (p. ej. `{ sena_pct: 50 }`, `{ franja_min: 15, tope: 6 }`)   |
| `productos`, `categorias`             | negocio_id, precio_centavos, stock, fotos[] (Storage)                                            |
| `profesionales`, `horarios`, `turnos` | negocio_id, profesional_id, inicio, fin, estado, pago_id                                         |
| `pedidos`                             | ya existe la migración: sumar negocio_id y franja                                                |
| `pagos`                               | negocio_id, proveedor (`mercadopago`), preference_id, estado, monto_centavos                     |
| `suscripciones_push`                  | negocio_id, user_id, endpoint, claves (Web Push)                                                 |

Toda tabla con `negocio_id` y política RLS `negocio_id in (select negocio_id from miembros where user_id = auth.uid())`.
Lecturas públicas (carta, catálogo, horarios) por vistas con columnas acotadas.

### Flujo

1. El configurador deja de terminar solo en WhatsApp: "Crear mi cuenta" → magic link (Supabase Auth, sin contraseña).
2. Se crea el `negocio` en **borrador** con lo elegido en el configurador (tipo, rubro, módulos → `modulos_activos`).
3. Panel `/panel` (app router, rutas protegidas): cargar productos/servicios, horarios, profesionales, fotos desde
   el celular (Storage con URL firmada y compresión en el cliente).
4. Vista previa en vivo con la plantilla del rubro (reusar `features/demo/gastronomia` parametrizada por config).
5. **Publicar** → `/{slug}` (o dominio propio por Vercel Domains API). Requiere plan activo.
6. Turnero: Mercado Pago Checkout Pro con `preference` por seña; webhook firmado confirma el turno; Web Push al
   dueño (service worker + VAPID); bot de WhatsApp por la API oficial (Cloud API) con plantillas aprobadas.

### Orden sugerido

1. Auth + `negocios`/`miembros` + RLS + tests de RLS (ya hay patrón en `tests/security`).
2. Panel mínimo de catálogo y publicación de `/{slug}` para el rubro con plantilla real (gastronomía).
3. Pagos (Mercado Pago) y webhooks idempotentes.
4. Turnero self-service (profesionales, horarios, seña, push).
5. Bot de WhatsApp (depende de la aprobación de Meta: empezar el trámite temprano).

### Riesgos

- Mercado Pago y WhatsApp Cloud API requieren cuentas del negocio y aprobaciones: no se automatiza en un día.
- Multi-tenant mal hecho filtra datos entre negocios: RLS primero, tests de RLS obligatorios en CI.
- Soporte: cada alta self-service es un cliente que puede escribir. Definir qué incluye cada plan antes de abrir.
