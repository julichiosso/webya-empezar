-- WebYa — módulo Pedidos: modelo multi-tenant (solo datos y contratos; sin UI real ni cobros).
--
-- Espeja src/domain/pedidos (ver skill webya-pedidos-module):
--   * Dinero SIEMPRE en centavos enteros (bigint), nunca numeric/float.
--   * Número de pedido incremental POR TENANT (siguiente_numero_pedido, atómico).
--   * Máquina de estados explícita, también en la base (trigger): recibido → en_preparacion →
--     listo → entregado; recibido/en_preparacion → cancelado.
--
-- Seguridad: TODAS las tablas tienen RLS activa y forzada, una política RESTRICTIVA que niega todo a
-- anon/authenticated (documenta la intención: no hay acceso público) y permisos revocados. Hoy solo
-- el servidor escribe, con la service role y después de validar con armarPedido. Cuando haya panel
-- con login, se agregan políticas por tenant en una migración NUEVA.

-- --- Tenants y locales --------------------------------------------------------------------------

create table public.tenants (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  nombre               text not null check (char_length(nombre) between 2 and 100),
  slug                 text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  -- Contador de pedidos del tenant: lo avanza siguiente_numero_pedido() (con bloqueo de fila).
  ultimo_numero_pedido integer not null default 0 check (ultimo_numero_pedido >= 0)
);

create table public.locales (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants (id) on delete cascade,
  created_at  timestamptz not null default now(),
  nombre      text not null check (char_length(nombre) between 2 and 100),
  -- Envío por defecto del local, en centavos.
  costo_envio bigint not null default 0 check (costo_envio >= 0)
);
create index locales_tenant_idx on public.locales (tenant_id);

-- --- Carta ------------------------------------------------------------------------------------

create table public.menu_categorias (
  id        uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  local_id  uuid not null references public.locales (id) on delete cascade,
  nombre    text not null check (char_length(nombre) between 1 and 60),
  orden     integer not null default 0
);
create index menu_categorias_tenant_local_idx on public.menu_categorias (tenant_id, local_id, orden);

create table public.menu_productos (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references public.tenants (id) on delete cascade,
  categoria_id uuid not null references public.menu_categorias (id) on delete cascade,
  nombre       text not null check (char_length(nombre) between 1 and 80),
  descripcion  text not null default '' check (char_length(descripcion) <= 200),
  precio       bigint not null check (precio > 0),
  ilustracion  text check (ilustracion is null or char_length(ilustracion) <= 40),
  disponible   boolean not null default true,
  orden        integer not null default 0
);
create index menu_productos_tenant_categoria_idx on public.menu_productos (tenant_id, categoria_id, orden);

-- Un grupo de modificadores por fila ("Punto de cocción", "Agregados"); sus opciones van en un
-- array JSON con precio en centavos: [{ "id", "nombre", "precio" }].
create table public.menu_modificadores (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants (id) on delete cascade,
  producto_id uuid not null references public.menu_productos (id) on delete cascade,
  nombre      text not null check (char_length(nombre) between 1 and 60),
  tipo        text not null check (tipo in ('unico', 'multiple')),
  obligatorio boolean not null default false,
  opciones    jsonb not null check (
    jsonb_typeof(opciones) = 'array' and jsonb_array_length(opciones) between 2 and 20
  ),
  orden       integer not null default 0,
  -- "Obligatorio" solo tiene sentido en grupos de una sola opción.
  check (not obligatorio or tipo = 'unico')
);
create index menu_modificadores_tenant_producto_idx on public.menu_modificadores (tenant_id, producto_id);

-- --- Pedidos ----------------------------------------------------------------------------------

create table public.pedidos (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null references public.tenants (id) on delete restrict,
  local_id           uuid not null references public.locales (id) on delete restrict,
  numero             integer not null check (numero > 0),
  created_at         timestamptz not null default now(),
  estado             text not null default 'recibido'
                     check (estado in ('recibido', 'en_preparacion', 'listo', 'entregado', 'cancelado')),
  modalidad          text not null check (modalidad in ('retiro', 'delivery', 'mesa')),
  cliente_nombre     text not null check (char_length(cliente_nombre) between 2 and 60),
  mesa               text check (mesa is null or char_length(mesa) between 1 and 10),
  direccion          text check (direccion is null or char_length(direccion) between 5 and 160),
  medio_pago         text not null check (medio_pago in ('efectivo', 'mercado_pago')),
  propina_porcentaje integer not null default 0 check (propina_porcentaje in (0, 10, 15)),
  -- Totales en centavos. El total es SIEMPRE la suma (lo garantiza la base, no solo el código).
  subtotal           bigint not null check (subtotal >= 0),
  propina            bigint not null default 0 check (propina >= 0),
  envio              bigint not null default 0 check (envio >= 0),
  total              bigint not null,
  check (total = subtotal + propina + envio),
  -- Coherencia con la modalidad (igual que armarPedido).
  check (modalidad <> 'mesa' or mesa is not null),
  check (modalidad <> 'delivery' or direccion is not null),
  check (modalidad = 'delivery' or envio = 0),
  unique (tenant_id, numero)
);
create index pedidos_tenant_estado_idx on public.pedidos (tenant_id, estado, created_at desc);

-- Ítems con nombre y precio CONGELADOS al momento del pedido (la carta puede cambiar después).
create table public.pedido_items (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants (id) on delete restrict,
  pedido_id       uuid not null references public.pedidos (id) on delete cascade,
  producto_id     uuid references public.menu_productos (id) on delete set null,
  nombre          text not null check (char_length(nombre) between 1 and 80),
  cantidad        integer not null check (cantidad between 1 and 20),
  precio_unitario bigint not null check (precio_unitario >= 0),
  -- [{ "grupoId", "opcionId", "nombre", "precio" }], precio en centavos.
  modificadores   jsonb not null default '[]' check (jsonb_typeof(modificadores) = 'array'),
  nota            text check (nota is null or char_length(nota) <= 140)
);
create index pedido_items_tenant_pedido_idx on public.pedido_items (tenant_id, pedido_id);

create table public.pedido_eventos (
  id        bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants (id) on delete restrict,
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  estado    text not null
            check (estado in ('recibido', 'en_preparacion', 'listo', 'entregado', 'cancelado')),
  en        timestamptz not null default now()
);
create index pedido_eventos_tenant_pedido_idx on public.pedido_eventos (tenant_id, pedido_id, en);

-- --- Número de pedido por tenant (atómico) -----------------------------------------------------

create function public.siguiente_numero_pedido(p_tenant uuid)
returns integer
language sql
security invoker
set search_path = ''
as $$
  -- El UPDATE toma el bloqueo de la fila del tenant: dos pedidos simultáneos no repiten número.
  update public.tenants
     set ultimo_numero_pedido = ultimo_numero_pedido + 1
   where id = p_tenant
  returning ultimo_numero_pedido;
$$;

revoke all on function public.siguiente_numero_pedido(uuid) from public, anon, authenticated;
grant execute on function public.siguiente_numero_pedido(uuid) to service_role;

-- --- Máquina de estados en la base -------------------------------------------------------------

create function public.pedido_transicion_valida(desde text, hacia text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select (desde, hacia) in (
    ('recibido', 'en_preparacion'),
    ('recibido', 'cancelado'),
    ('en_preparacion', 'listo'),
    ('en_preparacion', 'cancelado'),
    ('listo', 'entregado')
  );
$$;

create function public.pedidos_validar_estado()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.estado is distinct from old.estado
     and not public.pedido_transicion_valida(old.estado, new.estado) then
    raise exception 'Transición inválida: % → %', old.estado, new.estado
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger pedidos_estado_valido
  before update of estado on public.pedidos
  for each row execute function public.pedidos_validar_estado();

revoke all on function public.pedido_transicion_valida(text, text) from public, anon, authenticated;
revoke all on function public.pedidos_validar_estado() from public, anon, authenticated;

-- --- Seguridad: RLS forzada, política restrictiva que niega, permisos revocados ---------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'tenants', 'locales', 'menu_categorias', 'menu_productos', 'menu_modificadores',
    'pedidos', 'pedido_items', 'pedido_eventos'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format(
      'create policy %I on public.%I as restrictive for all to anon, authenticated using (false) with check (false)',
      t || '_sin_acceso_publico', t
    );
    execute format('revoke all on table public.%I from anon, authenticated', t);
  end loop;
end;
$$;
