import Image from 'next/image';
import { LOGO_TRAZOS } from '@/brand/logo/trazos';
import { cn } from '@/components/ui/clases';

/** La "w" del logo, recortada a su caja, para el centro del sello mientras no esté la foto. */
const W = LOGO_TRAZOS[0];

/**
 * Sello para escribirnos: un texto que gira alrededor de la cara de la empresa (la foto de Julián; hasta que
 * llegue, la "w" de la marca sobre negro). Es un link común a WhatsApp o mail. El giro es CSS y se queda
 * quieto con movimiento reducido.
 */
export function Sello({
  href,
  externo,
  aria,
  giro,
  foto,
  className,
}: {
  href: string;
  externo: boolean;
  aria: string;
  giro: string;
  foto: null | { src: string; ancho: number; alto: number };
  className?: string;
}) {
  return (
    <a
      href={href}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noopener' : undefined}
      aria-label={aria}
      className={cn('h3d-sello', className)}
    >
      <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" className="h3d-sello-giro">
        <defs>
          <path id="h3d-sello-arco" d="M60 60m-47 0a47 47 0 1 1 94 0a47 47 0 1 1-94 0" />
        </defs>
        <text>
          <textPath href="#h3d-sello-arco" textLength="290" lengthAdjust="spacing">
            {giro}
          </textPath>
        </text>
      </svg>
      <span className="h3d-sello-cara" aria-hidden="true">
        {foto ? (
          <Image src={foto.src} alt="" width={160} height={160} className="size-full object-cover" />
        ) : (
          <svg viewBox="136 50 300 170" focusable="false" className="h3d-sello-w">
            <path d={W.d} />
          </svg>
        )}
      </span>
    </a>
  );
}
