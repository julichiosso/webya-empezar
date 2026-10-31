-- WebYa /empezar — ciudad del negocio (opcional).
--
-- Flujo "tu negocio, armado en 60 segundos": en la pantalla 2 la persona deja el nombre del
-- negocio, su WhatsApp y, si quiere, la ciudad. El nombre del negocio ya tenía columna
-- (nombre_negocio, nula mientras el lead es parcial); la ciudad es nueva.
--
-- Hasta aplicar esta migración el servidor guarda el lead sin la ciudad (no se pierde) y deja un
-- aviso en el log. Seguridad: no cambia nada (RLS activa, sin políticas, sin permisos para
-- anon/authenticated). Las migraciones anteriores no se tocan.

alter table public.leads
  add column ciudad text;

-- Ya saneada por el servidor (una línea, sin HTML): de 1 a 60 caracteres.
alter table public.leads
  add constraint leads_ciudad_check
  check (ciudad is null or char_length(ciudad) between 1 and 60);
