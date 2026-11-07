import type { ReactNode } from 'react';
import { Icon } from '@/brand/ilustracion/iconos/Icon';
import { CLASES_SECCION, Seccion } from '@/components/patterns/Seccion';
import { SitioNegocio } from '@/components/patterns/SitioNegocio';
import { Telefono } from '@/components/patterns/Telefono';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/components/ui/clases';
import { CLIENTES } from '@/content/clientes';
import { PRODUCTOS } from '@/content/empezar/productos';
import estilos from './Productos.module.css';

const C = CLASES_SECCION.crema;

function Fila({
  rubro,
  titulo,
  puntos,
  cta,
  href,
  invertida = false,
  children,
}: {
  rubro: string;
  titulo: string;
  puntos: readonly string[];
  cta: string;
  href: string;
  invertida?: boolean;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        'grid items-center gap-10 border-t py-12 lg:grid-cols-2 lg:gap-16 lg:py-20',
        C.linea,
      )}
    >
      <div className={invertida ? 'lg:order-2' : undefined}>
        <p className={cn('text-small font-medium', C.secundario)}>{rubro}</p>
        <h3 className="mt-2 text-title font-semibold text-balance">{titulo}</h3>
        <ul className={cn('mt-6 border-t', C.linea)}>
          {puntos.map((p) => (
            <li key={p} className={cn('border-b py-4', C.linea)}>
              {p}
            </li>
          ))}
        </ul>
        <ButtonLink href={href} className="mt-8">
          {cta}
          <Icon name="arrowRight" size={20} />
        </ButtonLink>
      </div>
      <div className={invertida ? 'lg:order-1' : undefined}>{children}</div>
    </article>
  );
}

/**
 * "Tocalo antes de decidir": el bot de turnos, la carta con pedidos y el creador, cada uno con lo que
 * se ve de verdad y un link a probarlo. Componente de servidor: sin JS. Los dibujos son decorativos:
 * lo que dicen ya está en el texto de al lado.
 */
export function Productos() {
  const { turnos, pedidos, crear } = PRODUCTOS;
  const cliente = CLIENTES.find((c) => c.id === pedidos.cliente);
  return (
    <Seccion
      fondo="crema"
      id="productos"
      aria-labelledby="productos-title"
      className="scroll-mt-16"
    >
      <div className="max-w-2xl pb-12 lg:pb-16">
        <h2 id="productos-title" className="text-display font-semibold text-balance">
          {PRODUCTOS.titulo}
        </h2>
        <p className={cn('mt-4 text-lead', C.secundario)}>{PRODUCTOS.bajada}</p>
      </div>

      <Fila {...turnos}>
        <figure className="m-0">
          <Telefono pantallaClassName="h-[28rem]">
            <div
              aria-hidden="true"
              className="flex h-full flex-col justify-end gap-2 p-4 text-paper-fg"
            >
              {turnos.chat.map((m) => (
                <p
                  key={m.texto}
                  className={cn(
                    estilos.burbuja,
                    'max-w-[85%] rounded-card px-4 py-2 text-small',
                    m.de === 'bot'
                      ? 'self-start border border-paper-line bg-paper-2'
                      : 'self-end bg-accent text-accent-fg',
                  )}
                >
                  {m.texto}
                </p>
              ))}
            </div>
          </Telefono>
          <figcaption className={cn('mt-2 text-center text-small', C.secundario)}>
            {turnos.ejemplo}
          </figcaption>
        </figure>
      </Fila>

      <Fila {...pedidos} invertida>
        {cliente && (
          <figure className="relative m-0">
            <Telefono pantallaClassName="h-[28rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cliente.captura}
                alt={cliente.alt}
                width={cliente.capturaAncho}
                height={cliente.capturaAlto}
                loading="lazy"
                decoding="async"
                className="w-full"
              />
            </Telefono>
            <figcaption className={cn('mt-2 text-center text-small', C.secundario)}>
              {pedidos.real(cliente.nombre)}
            </figcaption>
          </figure>
        )}
      </Fila>

      <Fila {...crear}>
        <div aria-hidden="true">
          <Telefono pantallaClassName="h-[28rem]">
            <SitioNegocio
              rubro={crear.ejemplo.rubro}
              nombre={crear.ejemplo.negocio}
              paleta={crear.ejemplo.paleta}
              secciones={2}
            />
          </Telefono>
        </div>
      </Fila>
    </Seccion>
  );
}
