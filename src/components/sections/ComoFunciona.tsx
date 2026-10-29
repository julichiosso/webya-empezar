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

/**
 * Los pasos van enhebrados en un riel punteado (concepto Encastre: piezas que se conectan), no en
 * tarjetas sueltas. Mobile: riel vertical a la izquierda. Escritorio: riel horizontal arriba.
 */
export function ComoFunciona() {
  return (
    <section aria-labelledby="como-title" className="reveal pt-24 lg:pt-32">
      <h2 id="como-title" className="text-title font-semibold text-balance">
        Cómo funciona
      </h2>
      <ol className="mt-8 grid lg:mt-12 lg:grid-cols-3 lg:gap-8">
        {PASOS.map((p, i) => (
          <li key={p.nombre} className="relative flex gap-6 pb-8 last:pb-0 lg:flex-col lg:pb-0">
            {/* Tramo del riel hasta el paso siguiente (decorativo). */}
            {i < PASOS.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-12 bottom-0 left-6 border-l border-dashed border-line-strong lg:top-6 lg:-right-8 lg:bottom-auto lg:left-12 lg:border-t lg:border-l-0"
              />
            )}
            <span
              aria-hidden="true"
              className="tabular relative flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg text-heading font-semibold"
            >
              {i + 1}
            </span>
            <div className="pt-2 lg:pt-0">
              <h3 className="text-heading font-semibold">{p.nombre}</h3>
              <p className="mt-2 max-w-xs text-muted">{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
