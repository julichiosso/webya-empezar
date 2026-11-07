-- WebYa — medición propia del embudo (POST /api/eventos).
--
-- Sin datos personales: ni IP, ni teléfono, ni nombres. `sesion` es un azar por pestaña. Igual que
-- `leads`: RLS activa y ninguna política; solo escribe y lee la service role.

create table public.eventos (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  nombre     text  not null check (char_length(nombre) between 1 and 60),
  sesion     text  not null check (char_length(sesion) between 8 and 32),
  ruta       text  not null check (char_length(ruta) between 1 and 80),
  props      jsonb not null default '{}'::jsonb
);

comment on table public.eventos is
  'Embudo de WebYa, sin datos personales. Acceso solo por service role (RLS sin políticas).';

create index eventos_created_at_idx on public.eventos (created_at desc);
create index eventos_nombre_created_at_idx on public.eventos (nombre, created_at desc);

alter table public.eventos enable row level security;
alter table public.eventos force row level security;
revoke all on table public.eventos from anon, authenticated;

-- El embudo por día, en sesiones: se lee desde el panel de Supabase (select * from embudo_diario).
create view public.embudo_diario
with (security_invoker = true) as
select
  date_trunc('day', created_at at time zone 'America/Argentina/Buenos_Aires')::date as dia,
  count(distinct sesion) filter (where nombre = 'pagina_vista' and ruta = '/empezar') as visitas,
  count(distinct sesion) filter (where nombre = 'rubro_elegido') as eligieron_rubro,
  count(distinct sesion) filter (where nombre = 'preview_visto') as vieron_su_negocio,
  count(distinct sesion) filter (where nombre = 'cta_click') as tocaron_el_cta,
  count(distinct sesion) filter (where nombre = 'form_enviado') as dejaron_whatsapp,
  count(distinct sesion) filter (where nombre = 'lead_completado') as sumaron_datos
from public.eventos
group by 1
order by 1 desc;

revoke all on table public.embudo_diario from anon, authenticated;

notify pgrst, 'reload schema';
