# ROADMAP — De "Armá tu sistema" a crear el sistema desde la plataforma

## Dónde estamos (fase 1, hecha)

Auditado el repo: **no existe** alta self-service de negocios. No hay tenants, usuarios, auth, panel persistente ni
sitios publicados desde la plataforma (ver `docs/HANDOFF.md`, Fase 0). Lo que sí hay:

- El **configurador "Armá tu sistema"** (home y landings): captura la intención (tipo, rubro, módulos, nombre) y la
  manda a Julián por WhatsApp como un brief ordenado. Cero requests, estado en el cliente.
- Una **API de leads** con validación, rate limit, IP hasheada y repos memory/file/Supabase (`/api/leads`), hoy sin
  uso desde la UI nueva.
- Un **dominio de pedidos** (`src/domain/pedidos`: estados, totales, dinero en centavos) y la migración SQL `pedidos`.
- La **demo de gastronomía** (`/demo/gastronomia`): carta, carrito, panel y seguimiento en el cliente.

Por eso el sitio dice "lo armamos con vos" y no promete nada automático.

## Fase 1.5 — Medir y no perder pedidos (chico, alto impacto)

1. **Guardar el brief del configurador** al tocar "Mandar": `navigator.sendBeacon('/api/briefs', …)` con el mismo
   payload que el mensaje. Endpoint nuevo reusando `server/rate-limit.ts`, el hash de IP y un esquema Zod chico
   (tipo, rubro, módulos ⊂ catálogo, nombre ≤ 60). Una sola request, sin bloquear la apertura de WhatsApp.
2. **Analítica**: conectar un sink en `lib/analytics.ts` (Plausible o Vercel Analytics) para los eventos
   `configurador_tipo`, `configurador_enviar` y `configurador_demo`, y medir el embudo real.
3. **Terminar la limpieza del legado**: el wizard, el telón y los componentes del `/empezar` viejo ya se borraron.
   Quedan `/marca` y `/sistema` (páginas internas del sistema naranja/crema), `src/brand/tokens` con la paleta vieja y
   la API de leads sin UI. Decidir si se migran al sistema editorial o se borran.

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
