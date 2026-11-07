-- WebYa — orígenes nuevos de un lead (src/config/origenes.ts) y búsqueda de reenvíos por WhatsApp.
--
-- Se puede aplicar antes o después del código: si el origen todavía no está admitido, el repositorio
-- guarda el lead con el origen por defecto y deja el aviso en el log.

alter table public.leads drop constraint if exists leads_origen_check;
alter table public.leads
  add constraint leads_origen_check
  check (origen in ('instagram', 'demo_gastronomia', 'demo_peluqueria', 'crear')) not valid;

-- Un reenvío del mismo WhatsApp actualiza su lead parcial en vez de duplicarlo.
create index if not exists leads_whatsapp_created_at_idx on public.leads (whatsapp, created_at desc);

notify pgrst, 'reload schema';
