import { ButtonLink } from '@/components/ui/Button';
import { A_MEDIDA } from '@/content/empezar/a-medida';

/**
 * "¿Y si lo que necesito no está?": la salvedad de "todo lo digital", respondida de frente. Los
 * ejemplos van en huecos punteados (lo que falta) y los pasos son una secuencia real (numerados).
 */
export function AMedida() {
  return (
    <section aria-labelledby="a-medida-title" className="reveal pt-24 lg:pt-32">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <div>
          <h2 id="a-medida-title" className="text-title font-semibold text-balance">
            {A_MEDIDA.titulo}
          </h2>
          <p className="mt-4 max-w-md text-lead text-muted">{A_MEDIDA.bajada}</p>
          <p className="mt-8 text-small text-subtle">{A_MEDIDA.ejemplos.leyenda}</p>
          <ul className="mt-2 flex flex-col gap-2">
            {A_MEDIDA.ejemplos.lista.map((e) => (
              <li
                key={e}
                className="rounded-card border border-dashed border-line-strong px-4 py-2 text-muted"
              >
                {e}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 lg:mt-0">
          <ol className="flex flex-col gap-6">
            {A_MEDIDA.pasos.map((p, i) => (
              <li key={p.titulo} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="tabular flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong text-small font-semibold"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{p.titulo}</h3>
                  <p className="mt-1 text-muted">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <ButtonLink href="#wizard" variante="secundario" className="mt-8">
            {A_MEDIDA.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
