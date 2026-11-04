import { CLASES_SECCION } from '@/components/patterns/Seccion';
import { PRECIO_SIN_DEFINIR } from '@/content/precios';
import { OBJECIONES, type DondeObjecion } from '@/content/por-que-webya';

const C = CLASES_SECCION.crema;

interface Props {
  /** Sección junto a la que va; define qué objeciones responde. */
  donde: DondeObjecion;
}

/** Objeciones respondidas junto a la sección que las genera: pregunta en negrita y respuesta corta. */
export function Objeciones({ donde }: Props) {
  const lista = OBJECIONES.filter((o) => o.donde === donde);
  if (lista.length === 0) return null;
  return (
    <div>
      <dl className={`grid gap-4 border-t py-8 ${C.texto} sm:grid-cols-2 sm:gap-10 ${C.linea}`}>
        {lista.map((o) => (
          <div key={o.pregunta}>
            <dt className="font-semibold">{o.pregunta}</dt>
            <dd className={`mt-1 text-small ${C.secundario}`}>
              {o.precio ? PRECIO_SIN_DEFINIR : o.respuesta}
            </dd>
            {o.enlace && (
              <dd>
                <a
                  href={o.enlace.href}
                  className="inline-flex min-h-tap items-center text-small underline underline-offset-4"
                >
                  {o.enlace.texto}
                </a>
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
