import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { MarcoDispositivo } from '@/components/patterns/MarcoDispositivo';
import { ButtonLink } from '@/components/ui/Button';
import { CASO_REAL } from '@/content/empezar/caso-real';

/**
 * "Hecho para negocios reales": el sitio que armamos para Micio's Pizzería. Prueba social honesta:
 * qué incluye y un botón a su sitio, sin cifras, testimonios ni resultados. Mientras falte algo
 * (permiso, dirección, capturas, si se nombra la ciudad) se ve su TODO en lugar del dato.
 *
 * La página la monta SOLO con `FLAGS.casoMicios` prendido (config/flags.ts): sin el permiso
 * escrito de Micio's, la sección no se publica.
 */
export function CasoReal() {
  const C = CASO_REAL;
  return (
    <section aria-labelledby="caso-real-title" className="reveal pt-24 lg:pt-32">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <div>
          <h2 id="caso-real-title" className="text-title font-semibold text-balance">
            {C.titulo}
          </h2>
          <p className="mt-4 max-w-md text-lead text-muted">{C.bajada}</p>

          <div className="mt-8 rounded-card border border-line bg-surface p-6">
            <p className="text-heading font-semibold">{C.negocio}</p>
            <p className="mt-1 text-small text-muted">
              {C.rubro}
              {C.ubicacion && ` · ${C.ubicacion}`}
            </p>
            {!C.ubicacion && (
              <p data-todo className="mt-1 text-small text-subtle">
                {C.pendientes.ubicacion}
              </p>
            )}
            <h3 className="mt-6 text-small font-semibold">{C.incluyeTitulo}</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {C.incluye.map((i) => (
                <li key={i} className="flex items-start gap-2 text-body">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-accent" />
                  {i}
                </li>
              ))}
            </ul>
            {C.url ? (
              <ButtonLink
                href={C.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                className="mt-6"
              >
                {C.cta}
                <Icon name="arrowRight" size={20} />
              </ButtonLink>
            ) : (
              <p data-todo className="mt-6 text-small text-subtle">
                {C.pendientes.url}
              </p>
            )}
          </div>
          <p data-todo className="mt-4 text-small text-subtle">
            {C.pendientes.permiso}
          </p>
        </div>

        {/* Capturas del sitio real: hasta tenerlas (con permiso), un celular vacío con su TODO. */}
        <div className="mt-8 lg:mt-0">
          <MarcoDispositivo dispositivo="celular" leyenda={C.capturaPendiente}>
            <div
              data-todo
              className="flex h-full items-center justify-center p-6 text-center text-small text-subtle"
            >
              {C.pendientes.capturas}
            </div>
          </MarcoDispositivo>
        </div>
      </div>
    </section>
  );
}
