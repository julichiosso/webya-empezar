-- WebYa /empezar — lead parcial ("solo WhatsApp primero") y necesidades "a medida".
--
-- Flujo nuevo (docs/plan-sprint.md §6): la persona marca qué necesita (y, si quiere, lo cuenta con
-- sus palabras), elige rubro y módulos y deja SOLO su WhatsApp. En ese momento se guarda el lead
-- con estado 'parcial', aunque después abandone. Si completa (nombre del negocio obligatorio; nombre,
-- mail y mensaje opcionales), el mismo lead pasa a 'nuevo'.
--
-- Para completar, la API devuelve un token una sola vez; acá se guarda solo su sha256 (token_hash),
-- que se borra al completar. La API solo completa leads parciales de menos de 6 horas.
--
-- Seguridad: no cambia nada. La tabla sigue con RLS activa, sin políticas y sin permisos para
-- anon/authenticated. La vista nueva tampoco es accesible para esos roles (ver abajo).
-- Las migraciones anteriores no se tocan.

-- 1. Columnas nuevas. Las filas viejas quedan con los valores por defecto (cumplen los checks).
alter table public.leads
  add column necesidades     text[]      not null default '{}',
  add column necesidad_libre text,
  add column token_hash      text,
  add column completado_at   timestamptz;

-- Ids del paso "¿Qué necesitás?" (los valida el servidor contra config/necesidades.ts): máximo 8.
alter table public.leads
  add constraint leads_necesidades_cantidad_check
  check (cardinality(necesidades) <= 8);

-- Pedido libre, ya saneado por el servidor: de 3 a 500 caracteres.
alter table public.leads
  add constraint leads_necesidad_libre_check
  check (necesidad_libre is null or char_length(necesidad_libre) between 3 and 500);

-- sha256 en hex (nunca el token en claro), y solo mientras el lead es parcial.
alter table public.leads
  add constraint leads_token_hash_check
  check (token_hash is null or (token_hash ~ '^[0-9a-f]{64}$' and estado = 'parcial'));

-- 2. Nombre, negocio y rubro pueden faltar SOLO en un lead parcial. Completo: el nombre del
-- negocio y el rubro son obligatorios; el nombre de la persona pasa a ser opcional.
alter table public.leads
  alter column nombre         drop not null,
  alter column nombre_negocio drop not null,
  alter column rubro          drop not null;

alter table public.leads
  add constraint leads_completo_check
  check (estado = 'parcial' or (nombre_negocio is not null and rubro is not null));

-- 3. Módulos: hasta 16 siempre. Al menos 1 en el flujo de un solo envío, salvo que el lead sea
-- parcial, traiga un pedido "a medida" o venga de completar un parcial (completado_at): ahí la
-- persona pudo no elegir ningún módulo y el lead sigue siendo valioso.
-- NOT VALID: se exige en filas nuevas o modificadas sin revisar las existentes.
alter table public.leads drop constraint if exists leads_modulos_cantidad_check;
alter table public.leads
  add constraint leads_modulos_cantidad_check
  check (
    cardinality(modulos) <= 16
    and (
      estado = 'parcial'
      or cardinality(modulos) >= 1
      or necesidad_libre is not null
      or completado_at is not null
    )
  ) not valid;

-- Para atender rápido a quien dejó solo su WhatsApp: los parciales, del más nuevo al más viejo.
create index leads_parciales_created_at_idx
  on public.leads (created_at desc)
  where estado = 'parcial';

-- 4. Vista para el panel de Supabase (SQL editor / Table editor), NUNCA para la web pública:
-- agrupa los pedidos "a medida" por tema y por rubro, con la cantidad, la fecha del último y hasta
-- 5 ejemplos recientes. Sirve para decidir qué módulo construir después.
--
-- El tema sale de palabras clave, en este orden (gana la primera que coincide):
--   stock/inventario, facturación, delivery/envíos, turnos/agenda, pagos/cobros,
--   clientes/fidelización, reportes/ventas, automatización/WhatsApp; si no, 'otros'.
--
-- security_invoker: la vista se consulta con los permisos de quien la lee (no los del dueño), así
-- que respeta el RLS de leads. Además se le quitan todos los permisos a los roles públicos.
create view public.leads_a_medida_resumen
  with (security_invoker = true)
as
with clasificados as (
  select
    l.created_at,
    coalesce(l.rubro, 'sin_rubro') as rubro,
    l.necesidad_libre,
    case
      when l.necesidad_libre ~* '(stock|inventario|mercader[ií]a|dep[oó]sito)'
        then 'stock_inventario'
      when l.necesidad_libre ~* '(factur|afip|arca|comprobante)'
        then 'facturacion'
      when l.necesidad_libre ~* '(delivery|env[ií]o|reparto|log[ií]stica)'
        then 'delivery_envios'
      when l.necesidad_libre ~* '(turno|agenda|reserva|cita)'
        then 'turnos_agenda'
      when l.necesidad_libre ~* '(pago|cobr|mercado ?pago|tarjeta|transferencia)'
        then 'pagos_cobros'
      when l.necesidad_libre ~* '(cliente|fideliz|puntos|crm)'
        then 'clientes_fidelizacion'
      when l.necesidad_libre ~* '(reporte|estad[ií]stica|venta|m[eé]trica)'
        then 'reportes_ventas'
      when l.necesidad_libre ~* '(automatiz|whatsapp|chatbot|bot\M|respuesta autom)'
        then 'automatizacion_whatsapp'
      else 'otros'
    end as tema
  from public.leads l
  where l.necesidad_libre is not null
)
select
  tema,
  rubro,
  count(*)::integer as cantidad,
  max(created_at) as ultimo_pedido,
  (array_agg(necesidad_libre order by created_at desc))[1:5] as ejemplos
from clasificados
group by tema, rubro
order by cantidad desc, ultimo_pedido desc;

comment on view public.leads_a_medida_resumen is
  'Pedidos "a medida" agrupados por tema y rubro. Solo para el panel de Supabase (service role).';

revoke all on table public.leads_a_medida_resumen from public, anon, authenticated;

-- RLS y permisos de leads no cambian: la tabla sigue sin políticas y sin acceso para anon/authenticated.
