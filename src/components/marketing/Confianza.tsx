import { Icon } from '@/brand/ilustracion/iconos/Icon';
import type { IconName } from '@/brand/ilustracion/iconos/paths';
import { ButtonLink } from '@/components/ui/Button';

/**
 * Marketing honesto: lo que genera confianza son compromisos que SÍ cumplimos (skill webya-brand:
 * nada de testimonios, logos de clientes, métricas ni sellos inventados).
 */
const COMPROMISOS: { icono: IconName; titulo: string; texto: string }[] = [
  {
    icono: 'chat',
    titulo: 'Hablás con una persona',
    texto: 'Te escribimos en menos de 24 hs, por WhatsApp, y armamos todo con vos.',
  },
  {
    icono: 'carta_qr',
    titulo: 'Probás antes de decidir',
    texto: 'La demo es real y la usás sin registrarte: pedí como cliente y miralo como dueño.',
  },
  {
    icono: 'catalogo',
    titulo: 'Solo lo que necesitás',
    texto: 'Activás solo las piezas que tu negocio necesita, y sumás más cuando quieras.',
  },
  {
    icono: 'clientes',
    titulo: 'Tus datos, cuidados',
    texto: 'Los usamos solo para contactarte y no los compartimos con nadie.',
  },
];

/** Vitrina de la demo: el momento "esto es lo que me falta", a un toque. */
export function VitrinaDemo() {
  return (
    <section aria-labelledby="vitrina-title" className="reveal pt-24 lg:pt-32">
      <div className="papel overflow-hidden rounded-panel bg-paper p-6 text-paper-fg lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:p-12">
        <div>
          <p className="text-small font-semibold text-accent-ink">Demo en vivo · sin registrarte</p>
          <h2 id="vitrina-title" className="mt-2 text-title font-semibold text-balance">
            Mirá tu local funcionando
          </h2>
          <p className="mt-4 text-lead text-paper-muted">
            Pedí como cliente desde el celular y miralo llegar al panel del dueño, en tiempo real.
          </p>
          <ButtonLink href="/demo/gastronomia" className="mt-6">
            Probar la demo
            <Icon name="arrowRight" size={20} />
          </ButtonLink>
        </div>
        {/* Mini comanda: lo que ve el dueño cuando entra un pedido (decorativo). */}
        <div aria-hidden="true" className="encastre mt-8 rounded-card bg-paper-2 p-6 pt-8 lg:mt-0">
          <div className="flex items-center justify-between">
            <span className="tabular text-title font-semibold">#24</span>
            <span className="rounded-full bg-accent px-2 text-small leading-6 font-semibold text-accent-fg">
              Nuevo
            </span>
          </div>
          <p className="mt-1 text-small text-paper-muted">Mesa 4 · hace 1 min</p>
          <ul className="mt-4 flex flex-col gap-2 border-t border-paper-line pt-4">
            <li>
              <span className="tabular font-semibold">2×</span> Muzzarella grande
            </li>
            <li>
              <span className="tabular font-semibold">1×</span> Fainá
            </li>
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
        Por qué confiar en WebYa
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
