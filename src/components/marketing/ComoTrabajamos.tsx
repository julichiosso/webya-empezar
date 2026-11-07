import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { cn } from '@/components/ui/clases';
import { COMO_TRABAJAMOS } from '@/content/empezar/empresa';
import estilos from './ComoTrabajamos.module.css';

const C = CLASES_SECCION.tinta;

/**
 * "Cómo trabajamos": la secuencia real, en una columna. Al scrollear, el riel se llena de Brasa y cada
 * paso se enciende cuando llega al centro. Sin soporte o con reduced-motion se lee todo igual.
 */
export function ComoTrabajamos() {
  return (
    <Seccion
      fondo="tinta"
      id="como-trabajamos"
      aria-labelledby="como-trabajamos-title"
      className="scroll-mt-16 overflow-clip!"
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 id="como-trabajamos-title" className={estilos.titulo}>
              {COMO_TRABAJAMOS.titulo}
            </h2>
            <p className={cn('mt-4 text-lead', C.secundario)}>{COMO_TRABAJAMOS.bajada}</p>
          </div>
        </div>
        <ol className={cn(estilos.riel, 'mt-12 lg:col-span-7 lg:mt-0')}>
          {COMO_TRABAJAMOS.pasos.map((p, i) => (
            <li key={p.nombre} className={estilos.paso}>
              <span aria-hidden="true" className={cn('tabular', estilos.numero)}>
                {i + 1}
              </span>
              <div className={estilos.detalle}>
                <h3 className={estilos.nombre}>{p.nombre}</h3>
                <p className={cn('mt-2 text-lead', C.secundario)}>{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Seccion>
  );
}
