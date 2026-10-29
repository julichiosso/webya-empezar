-- WebYa /empezar — los leads guardan lo que la persona armó en la demo y el origen queda cerrado.
--
-- `demo`: { "paleta": "...", "cocina": "..." } o null. El servidor valida los valores contra la
-- config (paletas y cocinas existentes); la base acota la forma y el tamaño.
-- `origen`: solo valores de la lista cerrada de src/config/origenes.ts. Al sumar un origen nuevo,
-- se agrega en una migración NUEVA (y en esa lista).

alter table public.leads
  add column demo jsonb;

alter table public.leads
  add constraint leads_demo_forma_check
  check (
    demo is null or (
      jsonb_typeof(demo) = 'object'
      and demo - 'paleta' - 'cocina' = '{}'::jsonb
      and jsonb_typeof(demo -> 'paleta') = 'string'
      and jsonb_typeof(demo -> 'cocina') = 'string'
      and char_length(demo ->> 'paleta') between 1 and 20
      and char_length(demo ->> 'cocina') between 1 and 20
    )
  );

-- NOT VALID: se exige en filas nuevas o modificadas sin tener que revisar las existentes (que
-- tienen el default 'instagram').
alter table public.leads
  add constraint leads_origen_check
  check (origen in ('instagram', 'demo_gastronomia')) not valid;

-- RLS y permisos no cambian: la tabla sigue sin políticas y sin acceso para anon/authenticated.
