import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { cn } from '@/components/ui/clases';
import { FAQ_SECCION } from '@/content/empezar/faq-seccion';
import { FAQ, type Pregunta } from '@/content/faq';

const C = CLASES_SECCION.crema;

/** Duda de detalle, en <details>: accesible y operable por teclado sin JavaScript. */
function Duda({ item }: { item: Pregunta }) {
  return (
    <details className={cn('group border-t', C.linea)}>
      <summary className="flex min-h-tap cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium marker:hidden [&::-webkit-details-marker]:hidden">
        {item.pregunta}
        <span
          aria-hidden="true"
          className={cn(
            'relative size-6 shrink-0 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none',
            C.secundario,
          )}
        >
          <span className="absolute top-1/2 left-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
          <span className="absolute top-1/2 left-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
        </span>
      </summary>
      <p className={cn('max-w-prose pb-4', C.secundario)}>{item.respuesta}</p>
    </details>
  );
}

/** Preguntas frecuentes (fondo crema). El mismo texto alimenta el JSON-LD de page.tsx. */
export function Faq() {
  return (
    <Seccion fondo="crema" aria-labelledby="faq-title" className="diferido">
      <h2 id="faq-title" className="text-title font-semibold text-balance">
        {FAQ_SECCION.titulo}
      </h2>
      <div className={cn('mt-8 max-w-2xl border-b lg:mt-12', C.linea)}>
        {FAQ.map((item) => (
          <Duda key={item.pregunta} item={item} />
        ))}
      </div>
    </Seccion>
  );
}
