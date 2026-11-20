import Image from 'next/image';
import { cn } from '@/components/ui/clases';
import { BARRA_DEMOS } from '@/content/demos/hub';
import { CTA } from '@/content/home';
import { dominioDe, getProyecto } from '@/content/proyectos';

/**
 * "Conocé cómo ya lo usa…": la demo muestra el producto; el cliente real va aparte, con su captura. El
 * borde aparece al pasar el mouse y el link es solo el dominio. Sale del manifiesto de proyectos.
 */
export function EnUso({ proyecto, className }: { proyecto: string; className?: string }) {
  const p = getProyecto(proyecto);
  const img = p?.imagenes.mobile;
  if (!p?.url || !img) return null;
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-transparent p-2.5 pr-3 transition-colors hover:border-ed-line',
        className,
      )}
    >
      <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-ed-line">
        <Image src={img.src} alt="" fill sizes="3rem" className="object-cover object-top" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.8125rem] leading-snug font-semibold">
          {BARRA_DEMOS.enUso.titulo(p.cliente)}
        </span>
        <span className="mt-0.5 block text-[0.75rem] leading-snug text-ed-muted">
          {BARRA_DEMOS.enUso.detalle(p.rubro, p.ciudad)}
        </span>
        <a
          href={p.url}
          target="_blank"
          rel="noopener"
          aria-label={`${dominioDe(p.url)}${CTA.pestana}`}
          className="e-link e-link-nav mt-1 inline-flex items-center gap-1 text-[0.75rem] font-medium"
        >
          {dominioDe(p.url)}
        </a>
      </span>
    </div>
  );
}
