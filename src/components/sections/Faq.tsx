import { FAQ } from '@/config/faq';

/** Preguntas frecuentes con <details>: accesible y operable por teclado sin JavaScript. */
export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="reveal pt-24">
      <h2 id="faq-title" className="text-title font-semibold text-balance">
        Preguntas frecuentes
      </h2>
      <div className="mt-8 border-b border-line">
        {FAQ.map((item) => (
          <details key={item.pregunta} className="group border-t border-line">
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
        ))}
      </div>
    </section>
  );
}
