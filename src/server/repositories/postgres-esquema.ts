/**
 * Esquema de la base Postgres (Neon, creada desde Vercel). Es la suma de las migraciones de
 * supabase/migrations en un solo paso, sin lo propio de Supabase (roles anon/authenticated, RLS,
 * PostgREST): acá solo el servidor tiene la URL de la base, nadie más llega a las tablas.
 *
 * Todo es idempotente ("if not exists" / "or replace"): el repositorio lo corre una vez por instancia
 * antes de la primera consulta. Julián no tiene que correr migraciones a mano.
 */
export const ESQUEMA_POSTGRES: readonly string[] = [
  `create table if not exists leads (
    id              uuid primary key default gen_random_uuid(),
    created_at      timestamptz not null default now(),
    nombre          text check (nombre is null or char_length(nombre) between 2 and 80),
    email           text check (email is null or char_length(email) <= 254),
    whatsapp        text not null check (whatsapp ~ '^\\+549(11\\d{8}|[23]\\d{9})$'),
    nombre_negocio  text check (nombre_negocio is null or char_length(nombre_negocio) between 2 and 100),
    rubro           text check (rubro is null or char_length(rubro) between 1 and 60),
    rubro_otro      text check (rubro_otro is null or char_length(rubro_otro) between 2 and 80),
    ciudad          text check (ciudad is null or char_length(ciudad) between 1 and 60),
    modulos         text[] not null default '{}' check (cardinality(modulos) <= 16),
    objetivos       text[] not null default '{}' check (cardinality(objetivos) <= 8),
    necesidades     text[] not null default '{}' check (cardinality(necesidades) <= 8),
    necesidad_libre text check (necesidad_libre is null or char_length(necesidad_libre) between 3 and 500),
    mensaje         text check (mensaje is null or char_length(mensaje) <= 1000),
    origen          text not null default 'instagram' check (char_length(origen) between 1 and 40),
    demo            jsonb,
    utm_source      text check (utm_source is null or char_length(utm_source) <= 100),
    utm_medium      text check (utm_medium is null or char_length(utm_medium) <= 100),
    utm_campaign    text check (utm_campaign is null or char_length(utm_campaign) <= 100),
    estado          text not null default 'nuevo' check (char_length(estado) between 1 and 40),
    ip_hash         text not null,
    user_agent      text check (user_agent is null or char_length(user_agent) <= 400),
    token_hash      text check (token_hash is null or token_hash ~ '^[0-9a-f]{64}$'),
    completado_at   timestamptz,
    constraint leads_completo_check
      check (estado = 'parcial' or (nombre_negocio is not null and rubro is not null))
  )`,
  'create index if not exists leads_ip_hash_created_at_idx on leads (ip_hash, created_at)',
  'create index if not exists leads_created_at_idx on leads (created_at desc)',
  `create table if not exists eventos (
    id         bigint generated always as identity primary key,
    created_at timestamptz not null default now(),
    nombre     text  not null check (char_length(nombre) between 1 and 60),
    sesion     text  not null check (char_length(sesion) between 8 and 32),
    ruta       text  not null check (char_length(ruta) between 1 and 80),
    props      jsonb not null default '{}'::jsonb
  )`,
  'create index if not exists eventos_nombre_created_at_idx on eventos (nombre, created_at desc)',
  // Lo que Julián abre en la consola de Neon: los contactos, del más nuevo al más viejo, en hora de acá.
  `create or replace view contactos as
    select
      to_char(created_at at time zone 'America/Argentina/Buenos_Aires', 'DD/MM/YYYY HH24:MI') as fecha,
      estado, whatsapp, nombre, nombre_negocio, rubro, rubro_otro, ciudad, modulos, necesidades,
      necesidad_libre, mensaje, email, origen, id
    from leads
    order by created_at desc`,
  `create or replace view embudo_diario as
    select
      date_trunc('day', created_at at time zone 'America/Argentina/Buenos_Aires')::date as dia,
      count(distinct sesion) filter (where nombre = 'pagina_vista') as visitas,
      count(distinct sesion) filter (where nombre = 'buscador_elegido') as usaron_el_buscador,
      count(distinct sesion) filter (where nombre = 'configurador_tipo') as eligieron_tipo,
      count(distinct sesion) filter (where nombre = 'configurador_enviar') as mandaron_el_pedido,
      count(distinct sesion) filter (where nombre = 'demo_view') as abrieron_una_demo,
      count(distinct sesion) filter (where nombre = 'demo_cta_click') as demo_al_configurador,
      count(distinct sesion) filter (where nombre = 'whatsapp_click') as tocaron_whatsapp
    from eventos
    group by 1
    order by 1 desc`,
];
