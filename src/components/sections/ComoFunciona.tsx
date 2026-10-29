// Recorrido de marca: Creá → Digitalizá → Crecé. Una sola frase por paso.
// TODO: confirmar qué se ofrece en "Crecé" (clientes, métricas) antes de prometer más que esto.
const PASOS = [
  { nombre: 'Creá', texto: 'Elegí tu rubro y activá los módulos que necesitás.' },
  { nombre: 'Digitalizá', texto: 'Armamos lo que elegiste y lo ponemos online con vos.' },
  {
    nombre: 'Crecé',
    texto: 'Tus clientes te encuentran y te contactan, y vemos juntos qué sumar.',
  },
] as const;

export function ComoFunciona() {
  return (
    <section aria-labelledby="como-title" className="reveal pt-24 lg:pt-32">
      <h2 id="como-title" className="text-title font-semibold text-balance">
        Cómo funciona
      </h2>
      <ol className="mt-8 flex flex-col lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-6">
        {PASOS.map((p, i) => (
          <li
            key={p.nombre}
            className="flex gap-4 border-t border-line py-6 first:border-t-0 lg:flex-col lg:gap-6 lg:rounded-card lg:border lg:bg-surface lg:p-8 lg:shadow-raised lg:first:border-t"
          >
            <span
              aria-hidden="true"
              className="tabular flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong text-body font-semibold"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-heading font-semibold">{p.nombre}</h3>
              <p className="mt-2 text-muted">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
