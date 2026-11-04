import { CapturaCliente } from '@/components/marketing/CapturaCliente';
import { EnlaceCliente } from '@/components/marketing/EnlaceCliente';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { YA_CREARON, clientesPorRubro } from '@/content/clientes';

const C = CLASES_SECCION.crema;

/**
 * "Ya crearon con WebYa": índice editorial de clientes reales por rubro. Sin tarjetas: el rubro es
 * una etiqueta a la izquierda (fija dentro de su grupo) y a la derecha van filas separadas por una
 * línea fina, con el texto a un lado y la captura grande de la página completa al otro. Solo aparecen
 * rubros con clientes.
 */
export function YaCrearon() {
  const grupos = clientesPorRubro();
  if (grupos.length === 0) return null;
  return (
    <Seccion fondo="crema" id="ya-lo-usan" aria-labelledby="crearon-title" className="scroll-mt-16">
      <h2 id="crearon-title" className="text-title font-semibold text-balance">
        {YA_CREARON.titulo}
      </h2>
      <p className={`mt-4 max-w-md text-lead ${C.secundario}`}>{YA_CREARON.bajada}</p>

      <div className="mt-10 lg:mt-16">
        {grupos.map((g) => (
          <section
            key={g.rubroId}
            aria-label={g.rubro}
            className="mt-12 first:mt-0 lg:grid lg:grid-cols-12 lg:gap-8"
          >
            <h3
              className={`text-small font-semibold tracking-wide uppercase lg:sticky lg:top-24 lg:col-span-3 lg:self-start lg:pt-14 ${C.secundario}`}
            >
              {g.rubro}
            </h3>
            <ul className="mt-4 lg:col-span-9 lg:mt-0">
              {g.clientes.map((c) => (
                <li
                  key={c.id}
                  className={`grid gap-6 border-t py-10 sm:grid-cols-2 sm:gap-10 lg:py-14 ${C.linea}`}
                >
                  <div className="sm:self-start">
                    <p className="text-heading font-semibold text-balance">{c.nombre}</p>
                    <p className={`mt-2 ${C.secundario}`}>{c.hizo}</p>
                    <EnlaceCliente
                      href={c.url}
                      cliente={c.id}
                      className="mt-4 inline-flex min-h-tap items-center font-semibold underline underline-offset-4 hover:text-accent-ink focus-visible:text-accent-ink"
                    >
                      {YA_CREARON.ver}
                      <span aria-hidden="true">{YA_CREARON.flecha}</span>
                      <span className="sr-only">
                        , {c.nombre}
                        {YA_CREARON.externo}
                      </span>
                    </EnlaceCliente>
                  </div>
                  <CapturaCliente
                    href={c.url}
                    cliente={c.id}
                    src={c.captura}
                    alt={c.alt}
                    width={c.capturaAncho}
                    height={c.capturaAlto}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Seccion>
  );
}
