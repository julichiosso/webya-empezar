-- WebYa /empezar — que la API de Supabase (PostgREST) vea la columna `ciudad`.
--
-- Después de `20261031120000_leads_ciudad.sql`, PostgREST puede seguir con el esquema viejo en su
-- caché y responder "columna inexistente" (PGRST204). El servidor lo toma como "falta la
-- migración" y guarda el lead SIN la ciudad (con un aviso en el log): no se pierde el lead, pero
-- sí la ciudad, hasta que se recargue el esquema. Esto lo recarga.
--
-- Va aparte (no se edita la migración anterior) y se puede correr más de una vez sin efectos.
-- Seguridad: no cambia nada.

notify pgrst, 'reload schema';
