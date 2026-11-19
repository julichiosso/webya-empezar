import { MARQUESINA } from '@/content/home';

/**
 * Marquesina sobria de rubros. La lista va dos veces para el bucle; la copia es aria-hidden.
 * Corre solo en pantalla y nunca con reduced-motion (queda quieta, recortada).
 */
export function Marquesina() {
  const fila = (copia: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copia || undefined}>
      {MARQUESINA.rubros.map((r) => (
        <li key={r} className="flex items-center whitespace-nowrap">
          <span className="px-6 md:px-10">{r}</span>
          <span aria-hidden="true" className="text-ed-line-strong">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={MARQUESINA.etiqueta} className="tono-oscuro border-y border-ed-line">
      <div className="overflow-hidden py-5 md:py-7" data-loop="">
        <div className="e-marquesina-pista e-bucle e-h3 font-medium text-ed-muted">
          {fila(false)}
          {fila(true)}
        </div>
      </div>
    </section>
  );
}
