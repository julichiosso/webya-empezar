import { COMO_TRABAJAMOS } from '@/content/empezar/como-trabajamos';

/**
 * "Qué pasa después de dejar tus datos": la secuencia real (hoy la entrega es manual, la hacemos
 * nosotros), numerada y en una columna angosta. Lo que no está definido se ve como TODO.
 */
export function ComoTrabajamos() {
  return (
    <section aria-labelledby="como-trabajamos-title" className="reveal pt-24 lg:pt-32">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 id="como-trabajamos-title" className="text-title font-semibold text-balance">
            {COMO_TRABAJAMOS.titulo}
          </h2>
          <p className="mt-4 max-w-md text-lead text-muted">{COMO_TRABAJAMOS.bajada}</p>
        </div>
        <div className="mt-8 lg:mt-0">
          <ol className="flex flex-col gap-6">
            {COMO_TRABAJAMOS.pasos.map((p, i) => (
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
                  {'todo' in p && p.todo && (
                    <p data-todo className="mt-1 text-small text-subtle">
                      {p.todo}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 rounded-control border border-line bg-surface p-4 text-small text-muted">
            {COMO_TRABAJAMOS.aclaracion}
          </p>
        </div>
      </div>
    </section>
  );
}
