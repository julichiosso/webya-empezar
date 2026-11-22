import Link from 'next/link';
import { RUTAS, SECCIONES } from '@/content/home';
import { Chevron } from './Iconos';

/** Dónde atendemos, en una franja: las dos ciudades y la zona, con el mapa real en /zona. */
export function FranjaZona() {
  const Z = SECCIONES.zona;
  return (
    <section className="tono-gris" aria-label={Z.texto}>
      <Link
        href={RUTAS.zona}
        prefetch={false}
        className="e-wrap group flex flex-col items-center gap-2 py-12 text-center md:py-16"
      >
        <span className="a-titulo">{Z.texto}</span>
        <span className="a-sub text-ed-muted">{Z.detalle}</span>
        <span className="a-link mt-1">
          {Z.ver}
          <Chevron />
        </span>
      </Link>
    </section>
  );
}
