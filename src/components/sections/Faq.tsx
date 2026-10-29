import { FAQ, type Pregunta } from '@/config/faq';

function Item({ item }: { item: Pregunta }) {
  return (
    <details className="group border-t border-line">
      <summary className="flex min-h-tap cursor-pointer list-none items-center justify-between gap-4 py-4 text-heading font-medium marker:hidden [&::-webkit-details-marker]:hidden">
        {item.pregunta}
        <span
          aria-hidden="true"
          className="relative size-6 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
        >
          <span className="absolute top-1/2 left-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
          <span className="absolute top-1/2 left-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
        </span>
      </summary>
      <p className="pb-6 text-muted">{item.respuesta}</p>
    </details>
  );
}

/**
 * Preguntas frecuentes con <details>: accesible y operable por teclado sin JavaScript.
 * En escritorio van en 2 columnas independientes (al abrir una, la otra no se mueve).
 */
export function Faq() {
  const mitad = Math.ceil(FAQ.length / 2);
  const columnas = [FAQ.slice(0, mitad), FAQ.slice(mitad)];
  return (
    <section aria-labelledby="faq-title" className="reveal pt-24 lg:pt-32">
      <h2 id="faq-title" className="text-title font-semibold text-balance">
        Preguntas frecuentes
      </h2>
      <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16">
        {columnas.map((items, i) => (
          <div
            key={i}
            className={
              i === columnas.length - 1 ? 'border-b border-line' : 'lg:border-b lg:border-line'
            }
          >
            {items.map((item) => (
              <Item key={item.pregunta} item={item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
