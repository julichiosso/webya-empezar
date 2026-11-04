import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { FUNDADOR, POR_QUE_WEBYA } from '@/content/por-que-webya';

const C = CLASES_SECCION.crema;

/** "Por qué WebYa": cuatro puntos ciertos, las objeciones comunes y, si está cargado, quién está detrás. */
export function PorQueWebya() {
  return (
    <Seccion fondo="crema" aria-labelledby="porque-title" className="diferido">
      <h2 id="porque-title" className="text-title font-semibold text-balance">
        {POR_QUE_WEBYA.titulo}
      </h2>
      <ul className={`mt-8 max-w-2xl border-t ${C.linea} lg:mt-12`}>
        {POR_QUE_WEBYA.puntos.map((p) => (
          <li key={p.titulo} className={`border-b py-4 ${C.linea}`}>
            <p className="font-semibold">{p.titulo}</p>
            <p className={`mt-1 text-small ${C.secundario}`}>{p.texto}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-10 grid max-w-2xl gap-6">
        {POR_QUE_WEBYA.objeciones.map((o) => (
          <div key={o.pregunta}>
            <dt className="font-semibold">{o.pregunta}</dt>
            <dd className={`mt-1 ${C.secundario}`}>
              {o.respuesta}
              {'enlace' in o && (
                <>
                  {' '}
                  <a href={o.enlace.href} className="underline underline-offset-4">
                    {o.enlace.texto}
                  </a>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {FUNDADOR && (
        <div className="mt-10 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FUNDADOR.foto}
            alt={FUNDADOR.alt}
            width={64}
            height={64}
            className="size-16 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{FUNDADOR.nombre}</p>
            <p className={`text-small ${C.secundario}`}>{FUNDADOR.rol}</p>
          </div>
        </div>
      )}
    </Seccion>
  );
}
