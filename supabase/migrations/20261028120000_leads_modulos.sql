-- WebYa /empezar — los leads ahora guardan los módulos que activó la persona.
--
-- Cambio de posicionamiento ("Creá vos"): la selección principal pasa a ser los módulos
-- (turnos, tienda y catálogo, carta con QR...) y los objetivos quedan como dato opcional.

alter table public.leads
  add column modulos text[] not null default '{}';

-- NOT VALID: exige 1..16 módulos en las filas nuevas o modificadas sin invalidar leads viejos
-- (cargados antes de esta migración, sin módulos). Los ids concretos los valida el servidor.
alter table public.leads
  add constraint leads_modulos_cantidad_check
  check (cardinality(modulos) between 1 and 16) not valid;

-- Los objetivos pasan a ser opcionales: de "1 a 8" a "0 a 8".
alter table public.leads drop constraint if exists leads_objetivos_check;
alter table public.leads
  add constraint leads_objetivos_check
  check (cardinality(objetivos) between 0 and 8);

-- RLS y permisos no cambian: la tabla sigue sin políticas y sin acceso para anon/authenticated.
