import { Icon } from '../iconos/Icon';
import { isIconName } from '../iconos/paths';

interface IlustracionRubroProps {
  /** Id del rubro (content/rubros). Uno desconocido dibuja el genérico. */
  rubro: string;
  className?: string;
}

/**
 * Escena propia de cada rubro para la vista previa de /empezar (grilla de dibujo 96, Encastre).
 * PROVISORIO: dibuja el ícono del rubro en grande hasta que estén las escenas (agente ilustracion,
 * etapa b). La firma no cambia: quien la usa no se entera del reemplazo.
 */
export function IlustracionRubro({ rubro, className }: IlustracionRubroProps) {
  const ICONOS: Record<string, string> = {
    peluqueria_estetica: 'tijera',
    gastronomia: 'cubiertos',
    comercio: 'tienda',
    profesionales: 'portafolio',
    gimnasio_deportes: 'pesa',
    servicios_tecnicos: 'llave',
  };
  const nombre = ICONOS[rubro] ?? 'mas';
  return (
    <span aria-hidden="true" className={className}>
      <Icon name={isIconName(nombre) ? nombre : 'mas'} size={48} />
    </span>
  );
}
