-- WebYa /empezar — tabla de leads.
--
-- Seguridad: la tabla tiene Row Level Security ACTIVA y NINGUNA política. Eso significa que
-- `anon` y `authenticated` (las claves públicas) no pueden leer ni escribir nada. La API de
-- WebYa inserta y consulta con la service role key, que se salta RLS y vive solo en el servidor.
-- NO agregues políticas "using (true)" a esta tabla: expondrían los datos de contacto.

create table public.leads (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  -- TODO(multi-tenant): cuando WebYa sea plataforma, agregar acá
  --   tenant_id uuid not null references public.tenants (id)
  -- y reemplazar el índice de abajo por uno que arranque con tenant_id. Las políticas RLS por
  -- tenant se escriben entonces (hoy el acceso es solo service role).

  nombre         text        not null check (char_length(nombre) between 2 and 80),
  email          text        check (email is null or char_length(email) <= 254),
  -- E.164 de un celular argentino, normalizado por el servidor (+549 + 10 dígitos).
  whatsapp       text        not null check (whatsapp ~ '^\+549(11\d{8}|[23]\d{9})$'),
  nombre_negocio text        not null check (char_length(nombre_negocio) between 2 and 100),
  rubro          text        not null check (char_length(rubro) between 1 and 60),
  rubro_otro     text        check (rubro_otro is null or char_length(rubro_otro) between 2 and 80),
  objetivos      text[]      not null default '{}' check (cardinality(objetivos) between 1 and 8),
  mensaje        text        check (mensaje is null or char_length(mensaje) <= 1000),
  origen         text        not null default 'instagram',
  utm_source     text        check (utm_source is null or char_length(utm_source) <= 100),
  utm_medium     text        check (utm_medium is null or char_length(utm_medium) <= 100),
  utm_campaign   text        check (utm_campaign is null or char_length(utm_campaign) <= 100),
  estado         text        not null default 'nuevo' check (char_length(estado) between 1 and 40),
  -- HMAC de la IP con una sal secreta: la IP en claro nunca se guarda.
  ip_hash        text        not null,
  user_agent     text        check (user_agent is null or char_length(user_agent) <= 400)
);

comment on table public.leads is
  'Leads capturados en webya.ar/empezar. Acceso solo por service role (RLS sin políticas).';

-- Rate limit por IP: "¿cuántos leads guardó este ip_hash en la última ventana?"
create index leads_ip_hash_created_at_idx on public.leads (ip_hash, created_at);

-- Listados para atender leads, del más nuevo al más viejo.
create index leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;
-- FORCE aplica RLS también al dueño de la tabla; service_role igual lo salta (bypassrls).
alter table public.leads force row level security;

-- Defensa en profundidad: además de RLS, se le quitan los permisos a los roles públicos.
revoke all on table public.leads from anon, authenticated;
