import { CapturaCliente } from '@/components/marketing/CapturaCliente';
import { EnlaceCliente } from '@/components/marketing/EnlaceCliente';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { clientesPorRubro, dominioDe, resumenClientes, YA_CREARON } from '@/content/clientes';

const C = CLASES_SECCION.crema;

/**
 * "Ya crearon con WebYa": casos de negocios reales, ordenados por rubro. Arriba, dos cifras que salen
 * de la lista de clientes. Cada caso lleva su número, la ciudad, lo que tiene el sitio hoy punto por
 * punto (solo lo verificado), el dominio y la captura grande de la página completa. Sin tarjetas ni
 * sombras: líneas finas. Solo aparecen rubros con clientes.
 */
export function YaCrearon() {
  const grupos = clientesPorRubro();
  if (grupos.length === 0) return null;
  const { sitios, rubros } = resumenClientes();
  const orden = grupos.flatMap((g) => g.clientes);
  return (
    <Seccion fondo="crema" id="ya-lo-usan" aria-labelledby="crearon-title" className="scroll-mt-16">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h2 id="crearon-title" className="text-display font-semibold text-balance">
            {YA_CREARON.titulo}
          </h2>
          <p className={`mt-4 max-w-md text-lead ${C.secundario}`}>{YA_CREARON.bajada}</p>
        </div>
        <dl
          className={`mt-8 grid grid-cols-2 gap-6 border-t pt-6 lg:col-span-5 lg:mt-0 lg:border-t-0 lg:pt-0 ${C.linea}`}
        >
          <div>
            <dd className="tabular text-display leading-none font-semibold">{sitios}</dd>
            <dt className={`mt-2 text-small ${C.secundario}`}>{YA_CREARON.resumen.sitios}</dt>
          </div>
          <div>
            <dd className="tabular text-display leading-none font-semibold">{rubros}</dd>
            <dt className={`mt-2 text-small ${C.secundario}`}>{YA_CREARON.resumen.rubros}</dt>
          </div>
        </dl>
      </div>

      <div className="mt-12 lg:mt-20">
        {grupos.map((g) => (
          <section
            key={g.rubroId}
            aria-label={g.rubro}
            className="mt-12 first:mt-0 lg:grid lg:grid-cols-12 lg:gap-8"
          >
            <h3
              className={`text-small font-semibold lg:sticky lg:top-24 lg:col-span-3 lg:self-start lg:pt-14 ${C.secundario}`}
            >
              {g.rubro}
            </h3>
            <div className="mt-4 lg:col-span-9 lg:mt-0">
              {g.clientes.map((c) => {
                const numero = orden.indexOf(c) + 1;
                return (
                  <article
                    key={c.id}
                    data-caso={c.id}
                    className={`grid gap-8 border-t py-10 sm:grid-cols-2 sm:gap-10 lg:py-14 ${C.linea}`}
                  >
                    <div className="sm:self-start">
                      <p className={`tabular text-small ${C.secundario}`}>
                        {YA_CREARON.caso(numero)} · {c.ciudad}
                      </p>
                      <h4 className="mt-2 text-display font-semibold text-balance">{c.nombre}</h4>
                      <p className={`mt-3 ${C.secundario}`}>{c.hizo}</p>

                      <p className="mt-8 text-small font-semibold">{YA_CREARON.queArmamos}</p>
                      <ul className={`mt-2 border-t ${C.linea}`}>
                        {c.armamos.map((a) => (
                          <li key={a} className={`border-b py-2.5 text-small ${C.linea}`}>
                            {a}
                          </li>
                        ))}
                      </ul>

                      <p className={`mt-6 text-small ${C.secundario}`}>{dominioDe(c.url)}</p>
                      <EnlaceCliente
                        href={c.url}
                        cliente={c.id}
                        className="inline-flex min-h-tap items-center font-semibold underline underline-offset-4 hover:text-accent-ink focus-visible:text-accent-ink"
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
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </Seccion>
  );
}
