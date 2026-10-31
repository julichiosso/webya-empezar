import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { cn } from '@/components/ui/clases';
import { COMO_TRABAJAMOS_CON_VOS as TXT } from '@/content/empezar/como-trabajamos-con-vos';

const C = CLASES_SECCION.brasa;

/**
 * Marca de cada estación sobre la línea del plano: una marca de registro (círculo con cruz). La
 * última, lo que recibís, va llena: es donde termina el recorrido. Decorativa (24 × 24, trazo 1.5,
 * currentColor). Lleva el fondo de la sección para cortar la línea que pasa por detrás.
 */
function Marca({ final }: { final: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      className="relative rounded-full bg-seccion-brasa"
    >
      <circle cx="12" cy="12" r="7" fill={final ? 'currentColor' : 'none'} />
      {!final && <path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5" />}
    </svg>
  );
}

/**
 * "Así trabajamos con vos" (fondo Brasa oscura, la única de la página): el recorrido real, de tus
 * datos a tu negocio online, como una línea de plano con cuatro estaciones. En celular la línea baja
 * por la izquierda; en escritorio cruza la página como una cota (con sus topes en los extremos).
 * Cada estación dice quién la hace (vos o nosotros). Sin íconos de adorno, sellos ni cifras: solo
 * compromisos que hoy cumplimos y los pendientes como TODO visible. Componente de servidor, quieto.
 */
export function ComoTrabajamosConVos() {
  const ultimo = TXT.tramos.length - 1;
  return (
    <Seccion
      fondo="brasa"
      plano="grilla"
      aria-labelledby="como-trabajamos-title"
      className="diferido"
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2
          id="como-trabajamos-title"
          className="text-title font-semibold text-balance lg:col-span-6"
        >
          {TXT.titulo}
        </h2>
        <p
          className={cn(
            'mt-4 max-w-md text-lead lg:col-span-5 lg:col-start-8 lg:mt-0',
            C.secundario,
          )}
        >
          {TXT.bajada}
        </p>
      </div>

      <ol
        aria-label={TXT.aria}
        className="relative mt-12 flex flex-col gap-10 lg:mt-16 lg:grid lg:grid-cols-4 lg:gap-8"
      >
        {/* La línea del plano (escritorio): una cota que cruza las cuatro estaciones, con topes. */}
        <span
          aria-hidden="true"
          className="absolute top-3 right-0 left-0 hidden border-t border-seccion-brasa-muted lg:block"
        />
        <span
          aria-hidden="true"
          className="absolute top-1 left-0 hidden h-4 border-l border-seccion-brasa-muted lg:block"
        />
        <span
          aria-hidden="true"
          className="absolute top-1 right-0 hidden h-4 border-l border-seccion-brasa-muted lg:block"
        />
        {TXT.tramos.map((t, i) => (
          <li key={t.titulo} className="relative pl-12 lg:pt-12 lg:pl-0">
            {/* Celular: la línea baja desde la marca hasta la estación siguiente. */}
            {i < ultimo && (
              <span
                aria-hidden="true"
                className="absolute top-6 -bottom-10 left-3 border-l border-seccion-brasa-muted lg:hidden"
              />
            )}
            <span className="absolute top-0 left-0 lg:left-0">
              <Marca final={i === ultimo} />
            </span>
            <p className={cn('text-small font-medium', C.secundario)}>{t.rol}</p>
            <h3 className="mt-2 text-heading font-semibold text-balance">{t.titulo}</h3>
            <p className="mt-2 max-w-sm">{t.texto}</p>
            {'nota' in t && t.nota && (
              <p className={cn('mt-4 max-w-sm border-t pt-4 text-small', C.linea, C.secundario)}>
                {t.nota}
              </p>
            )}
            {t.todos.map((todo) => (
              <p key={todo} data-todo className={cn('mt-2 text-small', C.secundario)}>
                {todo}
              </p>
            ))}
          </li>
        ))}
      </ol>

      <div
        className={cn(
          'mt-12 flex flex-col gap-2 border-t pt-8 lg:mt-16 lg:flex-row lg:items-center lg:justify-between lg:gap-8',
          C.linea,
        )}
      >
        <p className={cn('max-w-xl', C.secundario)}>{TXT.aclaracion}</p>
        <p className="flex flex-wrap items-center gap-x-4">
          <span className={C.secundario}>{TXT.demo.texto}</span>
          <a
            href="/demo/gastronomia"
            className="-mx-2 inline-flex min-h-tap items-center px-2 font-semibold underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            {TXT.demo.enlace}
          </a>
        </p>
      </div>
    </Seccion>
  );
}
