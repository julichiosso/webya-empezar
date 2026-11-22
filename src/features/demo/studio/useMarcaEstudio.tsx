'use client';

import { useCallback, useEffect, useState } from 'react';
import { ESTUDIO, RESUMEN_MARCA, colorMarca, fuenteMarca } from '@/content/demos/studio';
import { track } from '@/lib/analytics';
import type { PasoAsistente } from './Asistente';
import { CampoTexto, SelectorColor, SelectorFuente, SubirFoto } from './Campos';
import { esquemaMarca, marcaPortable, reducirMarca, type AccionMarca, type Marca } from './marca';
import { useEstudio } from './useEstudio';

/**
 * El estudio de marca de una demo, listo para usar: estado con historial, guardado y link; los pasos del
 * asistente (nombre, color, logo y letra) y cuándo mostrarlo. El asistente se abre solo la primera vez en
 * el celular (o con `?guia=1`, el link de los rubros del hub); en la compu, a pedido con "Personalizar".
 */
export function useMarcaEstudio({
  demo,
  inicial,
  extraResumen = [],
}: {
  demo: string;
  inicial: Marca;
  extraResumen?: readonly string[];
}) {
  const clave = `webya:demo:${demo}`;
  const { estado, aplicar, controles } = useEstudio<Marca, AccionMarca>({
    clave,
    reducir: reducirMarca,
    inicial: () => inicial,
    validar: (v) => {
      const r = esquemaMarca.safeParse(v);
      return r.success ? r.data : null;
    },
    portable: marcaPortable,
    resumen: (m) => [
      RESUMEN_MARCA.negocio(m.nombre),
      RESUMEN_MARCA.color(colorMarca(m.colorId).nombre),
      RESUMEN_MARCA.letra(fuenteMarca(m.fuenteId).nombre),
      ...(m.logo ? [RESUMEN_MARCA.logo] : []),
      ...extraResumen,
    ],
  });
  const [guia, setGuia] = useState(false);

  useEffect(() => {
    const visto = `webya:guia:${demo}`;
    let abrir = new URLSearchParams(window.location.search).get('guia') === '1';
    try {
      if (!abrir && window.matchMedia('(max-width: 63.99rem)').matches)
        abrir = !window.localStorage.getItem(visto) && !window.localStorage.getItem(clave);
      window.localStorage.setItem(visto, '1');
    } catch {
      // Sin almacenamiento: solo se abre con ?guia=1.
    }
    // Fuera del cuerpo del efecto: el primer pintado es la demo, el asistente entra enseguida.
    const t = setTimeout(() => setGuia(abrir), 0);
    return () => clearTimeout(t);
  }, [clave, demo]);

  const abrirGuia = useCallback(() => {
    track('demo_asistente', { demo, paso: 0, accion: 'siguiente' });
    setGuia(true);
  }, [demo]);

  const P = ESTUDIO.asistente.pasos;
  const pasos: PasoAsistente[] = [
    {
      id: 'nombre',
      titulo: P.nombre,
      contenido: (
        <CampoTexto
          etiqueta={ESTUDIO.campos.nombre}
          ayuda={ESTUDIO.campos.nombreAyuda}
          valor={estado.nombre}
          onCambio={(valor) => aplicar({ tipo: 'nombre', valor })}
        />
      ),
    },
    {
      id: 'color',
      titulo: P.color,
      ayuda: P.colorAyuda,
      contenido: (
        <SelectorColor valor={estado.colorId} onCambio={(id) => aplicar({ tipo: 'color', id })} />
      ),
    },
    {
      id: 'logo',
      titulo: P.logo,
      ayuda: P.logoAyuda,
      contenido: <SubirFoto url={estado.logo} onCambio={(url) => aplicar({ tipo: 'logo', url })} />,
    },
    {
      id: 'fuente',
      titulo: P.fuente,
      contenido: (
        <SelectorFuente
          valor={estado.fuenteId}
          onCambio={(id) => aplicar({ tipo: 'fuente', id })}
        />
      ),
    },
  ];

  return {
    marca: estado,
    aplicar,
    controles,
    pasos,
    guia,
    abrirGuia,
    cerrarGuia: () => setGuia(false),
  };
}
