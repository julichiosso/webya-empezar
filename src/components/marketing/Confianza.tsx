import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { CONFIANZA } from '@/content/empezar/confianza';
import { VITRINA_DEMO } from '@/content/empezar/vitrina-demo';

/**
 * Marketing honesto: lo que genera confianza son compromisos que SÍ cumplimos (skill webya-brand:
 * nada de testimonios, logos de clientes, métricas ni sellos inventados).
 */
const COMPROMISOS = CONFIANZA.compromisos;

/** Vitrina de la demo: el momento "esto es lo que me falta", a un toque. */
export function VitrinaDemo() {
  const { comanda } = VITRINA_DEMO;
  return (
    <section aria-labelledby="vitrina-title" className="reveal pt-24 lg:pt-32">
      <div className="papel overflow-hidden rounded-panel bg-paper p-6 text-paper-fg lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:p-12">
        <div>
          <p className="text-small font-semibold text-accent-ink">{VITRINA_DEMO.eyebrow}</p>
          <h2 id="vitrina-title" className="mt-2 text-title font-semibold text-balance">
            {VITRINA_DEMO.titulo}
          </h2>
          <p className="mt-4 text-lead text-paper-muted">{VITRINA_DEMO.bajada}</p>
          <ButtonLink href="/demo/gastronomia" className="mt-6">
            {VITRINA_DEMO.cta}
            <Icon name="arrowRight" size={20} />
          </ButtonLink>
        </div>
        {/* Mini comanda: lo que ve el dueño cuando entra un pedido (decorativo). */}
        <div aria-hidden="true" className="encastre mt-8 rounded-card bg-paper-2 p-6 pt-8 lg:mt-0">
          <div className="flex items-center justify-between">
            <span className="tabular text-title font-semibold">{comanda.numero}</span>
            <span className="rounded-full bg-accent px-2 text-small leading-6 font-semibold text-accent-fg">
              {comanda.estado}
            </span>
          </div>
          <p className="mt-1 text-small text-paper-muted">{comanda.detalle}</p>
          <ul className="mt-4 flex flex-col gap-2 border-t border-paper-line pt-4">
            {comanda.items.map((item) => (
              <li key={item.nombre}>
                <span className="tabular font-semibold">{item.cantidad}</span> {item.nombre}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Confianza() {
  return (
    <section aria-labelledby="confianza-title" className="reveal pt-24 lg:pt-32">
      <h2 id="confianza-title" className="text-title font-semibold text-balance">
        {CONFIANZA.titulo}
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-12">
        {COMPROMISOS.map((c) => (
          <li key={c.titulo} className="flex gap-4 rounded-card border border-line bg-surface p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
              <Icon name={c.icono} size={24} />
            </span>
            <div>
              <h3 className="font-semibold">{c.titulo}</h3>
              <p className="mt-1 text-muted">{c.texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
