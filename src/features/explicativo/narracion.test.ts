import { describe, expect, it } from 'vitest';
import { CASO_REAL, ESCENAS_EXPLICATIVO } from '@/content/explicativo';
import { duracionEstimadaMs, duracionTotalMs, elegirVoz, etiquetaDuracion } from './narracion';

const voz = (lang: string, name = lang, localService = false) => ({ lang, name, localService });

describe('narración del video', () => {
  it('estima la duración por palabras, con un mínimo por escena', () => {
    expect(duracionEstimadaMs('Hola')).toBe(4_000);
    const veinte = Array(26).fill('palabra').join(' ');
    expect(duracionEstimadaMs(veinte)).toBe(11_200);
  });

  it('elige el acento más cercano: rioplatense, después latinoamericano, después España', () => {
    expect(elegirVoz([voz('es-ES'), voz('es-MX'), voz('es-AR')])?.lang).toBe('es-AR');
    expect(elegirVoz([voz('es-ES'), voz('es-MX')])?.lang).toBe('es-MX');
    expect(elegirVoz([voz('en-US'), voz('es_ES')])?.lang).toBe('es_ES');
    // Entre dos iguales, la local (anda sin conexión).
    expect(elegirVoz([voz('es-MX', 'red'), voz('es-MX', 'local', true)])?.name).toBe('local');
    expect(elegirVoz([voz('es-PE')])?.lang).toBe('es-PE');
  });

  it('sin voces en español no elige ninguna (el video sigue con subtítulos)', () => {
    expect(elegirVoz([voz('en-US'), voz('pt-BR')])).toBeNull();
    expect(elegirVoz([])).toBeNull();
  });

  it('la etiqueta del botón redondea a minutos', () => {
    expect(etiquetaDuracion(20_000)).toBe('1 min');
    expect(etiquetaDuracion(100_000)).toBe('2 min');
  });
});

describe('guion del video', () => {
  const textos = ESCENAS_EXPLICATIVO.map((e) => e.narracion);

  it('9 escenas con ids únicos, del problema al llamado a la acción', () => {
    const ids = ESCENAS_EXPLICATIVO.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe('problema');
    expect(ids.at(-1)).toBe('cta');
  });

  it('cada narración es corta (menos de ~12 s): algunas voces cortan las frases largas', () => {
    for (const t of textos) expect(t.split(/\s+/).length, t).toBeLessThanOrEqual(26);
    expect(duracionTotalMs(textos)).toBeLessThan(2 * 60_000);
  });

  it('en voseo y sin promesas que el producto no cumple', () => {
    const todo = textos.join(' ');
    expect(todo).toMatch(/armás|activás|elegís|probá|dejanos/i);
    // Ni precios, ni plazos de entrega, ni "gratis", ni "en minutos", ni métricas inventadas.
    expect(todo).not.toMatch(/\$|gratis|en minutos|garantiz|\d+ ?%|clientes felices|miles de/i);
    // Ningún plazo, tampoco el del primer contacto (no está confirmado): "te escribimos por WhatsApp".
    expect(todo).toMatch(/te escribimos por WhatsApp/);
    expect(todo).not.toMatch(/veinticuatro|24 ?h|menos de \w+ horas/i);
  });

  it('el caso real queda apagado hasta tener permiso del negocio', () => {
    expect(CASO_REAL).toBeNull();
  });
});
