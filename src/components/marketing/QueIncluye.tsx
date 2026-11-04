import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { QUE_INCLUYE } from '@/content/empezar/que-incluye';
import { ESTADO_MODULO_UI, ESTADOS_MODULO_TEXTO } from '@/content/estados-modulo';
import { MODULO_IDS, getModulo } from '@/content/modulos';

const C = CLASES_SECCION.crema;

/**
 * "Qué incluye": los módulos reales en una lista simple. Los que hoy se entregan van primero; los
 * que todavía no, abajo y apagados, con la etiqueta "Próximamente". Componente de servidor.
 */
export function QueIncluye() {
  const modulos = MODULO_IDS.map(getModulo);
  const disponibles = modulos.filter((m) => m.estado !== 'proximamente');
  const proximos = modulos.filter((m) => m.estado === 'proximamente');
  return (
    <Seccion fondo="crema" aria-labelledby="incluye-title">
      <div className="max-w-2xl">
        <h2 id="incluye-title" className="text-title font-semibold text-balance">
          {QUE_INCLUYE.titulo}
        </h2>
        <p className={`mt-4 text-lead ${C.secundario}`}>{QUE_INCLUYE.bajada}</p>
      </div>
      <ul className={`mt-8 max-w-2xl border-t ${C.linea} lg:mt-12`}>
        {disponibles.map((m) => (
          <li key={m.id} data-modulo={m.id} className={`border-b py-4 ${C.linea}`}>
            <p className="font-semibold">{m.nombre}</p>
            <p className={`mt-1 text-small ${C.secundario}`}>{m.descripcion}</p>
          </li>
        ))}
        {proximos.map((m) => (
          <li key={m.id} data-modulo={m.id} className={`border-b py-4 ${C.linea} ${C.secundario}`}>
            <p className="font-semibold">
              {m.nombre}
              <span className="ml-2 text-small font-normal">
                {ESTADOS_MODULO_TEXTO.proximamente.etiqueta}
                <span className="sr-only">{ESTADO_MODULO_UI.accesible('')}</span>
              </span>
            </p>
            <p className="mt-1 text-small">{m.descripcion}</p>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
