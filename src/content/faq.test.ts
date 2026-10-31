import { describe, expect, it } from 'vitest';
import { COMO_TRABAJAMOS_CON_VOS } from './empezar/como-trabajamos-con-vos';
import { FAQ } from './faq';
import { PENDIENTES } from './pendientes';

describe('FAQ de /empezar', () => {
  it('las cuatro objeciones van primero y a la vista, de frente', () => {
    const objeciones = FAQ.filter((f) => f.objecion).map((f) => f.pregunta);
    expect(objeciones).toEqual([
      '¿Cuánto cuesta?',
      '¿Y si no me gusta?',
      '¿Qué hacen con mis datos?',
      '¿Y si lo que necesito no está?',
    ]);
    expect(FAQ.slice(0, 4).every((f) => f.objecion)).toBe(true);
  });

  it('precio y datos dejan su pendiente visible (sin inventar)', () => {
    const de = (p: string) => FAQ.find((f) => f.pregunta === p)?.todo;
    expect(de('¿Cuánto cuesta?')).toBe(PENDIENTES.precios);
    expect(de('¿Qué hacen con mis datos?')).toBe(PENDIENTES.privacidad);
    for (const f of FAQ) if (f.todo) expect(f.todo).toMatch(/^TODO:/);
  });
});

describe('"Así trabajamos con vos"', () => {
  it('cuatro tramos: tus datos → nosotros → vos → lo que recibís', () => {
    expect(COMO_TRABAJAMOS_CON_VOS.tramos.map((t) => t.rol)).toEqual([
      'Vos',
      'Nosotros',
      'Vos',
      'Lo que recibís',
    ]);
  });

  it('el plazo y la privacidad quedan como TODO visible', () => {
    const todos = COMO_TRABAJAMOS_CON_VOS.tramos.flatMap((t) => t.todos);
    expect(todos).toContain(PENDIENTES.plazoRespuesta);
    expect(todos).toContain(PENDIENTES.plazoEntrega);
    expect(todos).toContain(PENDIENTES.privacidad);
    for (const t of todos) expect(t).toMatch(/^TODO:/);
  });
});
