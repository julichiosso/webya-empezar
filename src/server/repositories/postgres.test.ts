// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { ESQUEMA_POSTGRES } from './postgres-esquema';
import { PostgresLeadRepository, type Consulta } from './postgres';
import type { NuevoLeadParcial } from './types';

function base(respuestas: Record<string, unknown>[][] = []) {
  const llamadas: { texto: string; params?: readonly unknown[] }[] = [];
  const consulta = vi.fn<Consulta>(async (texto, params) => {
    llamadas.push({ texto, params });
    if (ESQUEMA_POSTGRES.includes(texto)) return [];
    return respuestas.shift() ?? [];
  });
  return { consulta, llamadas, repo: new PostgresLeadRepository(consulta) };
}

const parcial: NuevoLeadParcial = {
  whatsapp: '+5493406123456',
  nombre_negocio: 'Pizzería Sol',
  necesidades: ['pedidos'],
  necesidad_libre: null,
  rubro: null,
  rubro_otro: null,
  modulos: [],
  objetivos: [],
  demo: { paleta: 'rojo', cocina: 'pizza' },
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  ip_hash: 'h',
  user_agent: null,
  token_hash: 'a'.repeat(64),
};

describe('PostgresLeadRepository', () => {
  it('crea las tablas una sola vez por instancia, antes de la primera consulta', async () => {
    const { repo, llamadas } = base([[{ n: 0 }], [{ n: 2 }]]);
    await repo.contarRecientesPorIp('h', new Date());
    expect(await repo.contarRecientesPorIp('h', new Date())).toBe(2);
    const esquema = llamadas.filter((l) => ESQUEMA_POSTGRES.includes(l.texto));
    expect(esquema).toHaveLength(ESQUEMA_POSTGRES.length);
    expect(llamadas.findIndex((l) => l.texto.includes('count(*)'))).toBe(ESQUEMA_POSTGRES.length);
  });

  it('inserta con parámetros, estado parcial y la demo como JSON', async () => {
    const { repo, llamadas } = base([[{ id: '1b4e28ba-2fa1-11d2-883f-0016d3cca427' }]]);
    const { id } = await repo.crearParcial(parcial);
    expect(id).toBe('1b4e28ba-2fa1-11d2-883f-0016d3cca427');
    const insert = llamadas.at(-1)!;
    expect(insert.texto).toMatch(/^insert into leads \(/);
    expect(insert.texto).not.toContain('Pizzería');
    expect(insert.params).toContain('Pizzería Sol');
    expect(insert.params).toContain('parcial');
    expect(insert.params).toContain(JSON.stringify(parcial.demo));
  });

  it('solo escribe columnas conocidas: una clave extra no llega al SQL', async () => {
    const { repo, llamadas } = base([[{ id: 'x' }]]);
    await repo.crearParcial({
      ...parcial,
      ['id; drop table leads' as 'rubro']: 'x',
    } as NuevoLeadParcial);
    expect(llamadas.at(-1)!.texto).not.toMatch(/drop/);
  });

  it('completar con un id que no es uuid ni consulta la base', async () => {
    const { repo, consulta } = base();
    const r = await repo.completar(
      "1' or '1'='1",
      'a'.repeat(64),
      { nombre_negocio: 'X', nombre: null, email: null, mensaje: null },
      new Date(),
    );
    expect(r).toBe('no_encontrado');
    expect(consulta).not.toHaveBeenCalled();
  });

  it('completar: ok solo si el UPDATE condicionado tocó una fila', async () => {
    const id = '1b4e28ba-2fa1-11d2-883f-0016d3cca427';
    const datos = { nombre_negocio: 'X', nombre: null, email: null, mensaje: null };
    const { repo } = base([[{ id }], []]);
    expect(await repo.completar(id, 'a'.repeat(64), datos, new Date())).toBe('ok');
    expect(await repo.completar(id, 'a'.repeat(64), datos, new Date())).toBe('no_encontrado');
  });

  it('si preparar las tablas falla, lo reintenta en la próxima consulta', async () => {
    let primera = true;
    const consulta = vi.fn<Consulta>(async (texto) => {
      if (primera && ESQUEMA_POSTGRES.includes(texto)) {
        primera = false;
        throw new Error('sin red');
      }
      return texto.includes('count(*)') ? [{ n: 1 }] : [];
    });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const repo = new PostgresLeadRepository(consulta);
    expect(await repo.contarRecientesPorIp('h', new Date())).toBe(1);
    await repo.contarRecientesPorIp('h', new Date());
    const vecesEsquema = consulta.mock.calls.filter(([t]) => t === ESQUEMA_POSTGRES[0]).length;
    expect(vecesEsquema).toBe(2);
  });
});
