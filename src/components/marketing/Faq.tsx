import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { cn } from '@/components/ui/clases';
import { FAQ_SECCION } from '@/content/empezar/faq-seccion';
import { FAQ, type Pregunta } from '@/content/faq';

const C = CLASES_SECCION.crema;

/** Pendiente visible (fuera del JSON-LD, que solo lleva la respuesta). */
function Pendiente({ texto, className }: { texto: string; className?: string }) {
  return (
    <p data-todo className={cn('text-small', C.secundario, className)}>
      {texto}
    </p>
  );
}

/** Objeción a la vista: la pregunta grande a la izquierda y la respuesta de frente a la derecha. */
function Objecion({ item }: { item: Pregunta }) {
  return (
    <li
      data-objecion=""
      className={cn('border-t py-8 lg:grid lg:grid-cols-12 lg:gap-8 lg:py-12', C.linea)}
    >
      <h3 className="text-title font-semibold text-balance lg:col-span-5">{item.pregunta}</h3>
      <div className="mt-4 lg:col-span-6 lg:col-start-7 lg:mt-2">
        <p className="max-w-prose text-lead">{item.respuesta}</p>
        {item.todo && <Pendiente texto={item.todo} className="mt-2" />}
      </div>
    </li>
  );
}

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
      {item.todo && <Pendiente texto={item.todo} className="pb-6" />}
    </details>
  );
}

/**
 * Preguntas frecuentes (fondo crema). Composición editorial en dos ritmos: las cuatro objeciones
 * van a la vista y grandes (la pregunta a la izquierda, la respuesta de frente a la derecha), sin
 * nada que abrir; las dudas de detalle quedan en un acordeón angosto debajo, alineado con las
 * respuestas. El mismo texto alimenta el JSON-LD de page.tsx.
 */
export function Faq() {
  const objeciones = FAQ.filter((f) => f.objecion);
  const dudas = FAQ.filter((f) => !f.objecion);
  return (
    <Seccion fondo="crema" aria-labelledby="faq-title" className="diferido">
      <h2 id="faq-title" className="text-title font-semibold text-balance">
        {FAQ_SECCION.titulo}
      </h2>
      <ul className="mt-8 lg:mt-12">
        {objeciones.map((item) => (
          <Objecion key={item.pregunta} item={item} />
        ))}
      </ul>
      <div className={cn('border-t pt-8 lg:grid lg:grid-cols-12 lg:gap-8 lg:pt-12', C.linea)}>
        <h3 className="text-heading font-semibold lg:col-span-5">{FAQ_SECCION.otras}</h3>
        <div className={cn('mt-4 border-b lg:col-span-6 lg:col-start-7 lg:mt-0', C.linea)}>
          {dudas.map((item) => (
            <Duda key={item.pregunta} item={item} />
          ))}
        </div>
      </div>
    </Seccion>
  );
}
