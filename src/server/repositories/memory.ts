import { randomUUID } from 'node:crypto';
import { aFila, type LeadRepository, type LeadRow, type NuevoLead } from './types';

/** Repositorio en memoria: para tests y para probar sin credenciales. Se pierde al reiniciar. */
export class MemoryLeadRepository implements LeadRepository {
  readonly leads: LeadRow[] = [];

  constructor(private readonly ahora: () => Date = () => new Date()) {}

  async crear(lead: NuevoLead): Promise<{ id: string }> {
    const fila = aFila(lead, randomUUID(), this.ahora());
    this.leads.push(fila);
    return { id: fila.id };
  }

  async contarRecientesPorIp(ipHash: string, desde: Date): Promise<number> {
    return this.leads.filter(
      (l) => l.ip_hash === ipHash && new Date(l.created_at).getTime() >= desde.getTime(),
    ).length;
  }
}
