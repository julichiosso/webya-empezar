import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { CLIENTES, YA_LO_USAN } from '@/content/clientes';

const C = CLASES_SECCION.crema;

/** "Ya lo usan": clientes reales con link. Si no hay ninguno cargado, no se muestra. */
export function YaLoUsan() {
  if (CLIENTES.length === 0) return null;
  return (
    <Seccion fondo="crema" aria-labelledby="usan-title" className="diferido">
      <h2 id="usan-title" className="text-title font-semibold text-balance">
        {YA_LO_USAN.titulo}
      </h2>
      <p className={`mt-4 max-w-md text-lead ${C.secundario}`}>{YA_LO_USAN.bajada}</p>
      <ul className={`mt-8 max-w-2xl border-t ${C.linea} lg:mt-12`}>
        {CLIENTES.map((c) => (
          <li
            key={c.url}
            className={`flex flex-wrap items-baseline justify-between gap-x-6 border-b py-4 ${C.linea}`}
          >
            <div>
              <p className="font-semibold">{c.nombre}</p>
              <p className={`text-small ${C.secundario}`}>{c.rubro}</p>
            </div>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-tap items-center font-semibold underline underline-offset-4"
            >
              {YA_LO_USAN.ver}
              <span className="sr-only">{YA_LO_USAN.externo}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className={`mt-4 max-w-md text-small ${C.secundario}`}>{YA_LO_USAN.pie}</p>
    </Seccion>
  );
}
