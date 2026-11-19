-- El embudo nuevo: la home y las landings con el configurador "Armá tu sistema" reemplazan a /empezar.
-- La vista vieja contaba pasos del wizard que ya no existen. Se recrea (cambian las columnas).
drop view if exists public.embudo_diario;

create view public.embudo_diario
with (security_invoker = true) as
select
  date_trunc('day', created_at at time zone 'America/Argentina/Buenos_Aires')::date as dia,
  count(distinct sesion) filter (where nombre = 'pagina_vista') as visitas,
  count(distinct sesion) filter (where nombre = 'configurador_tipo') as eligieron_tipo,
  count(distinct sesion) filter (where nombre = 'configurador_enviar') as mandaron_el_pedido,
  count(distinct sesion) filter (where nombre = 'demo_view') as abrieron_una_demo,
  count(distinct sesion) filter (where nombre = 'demo_cta_click') as demo_al_configurador
from public.eventos
group by 1
order by 1 desc;

revoke all on table public.embudo_diario from anon, authenticated;

notify pgrst, 'reload schema';
