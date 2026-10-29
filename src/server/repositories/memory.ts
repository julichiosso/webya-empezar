import { randomUUID } from 'node:crypto';
import {
  aFila,
  aFilaParcial,
  completarFila,
  type DatosCompletar,
  type LeadRepository,
  type LeadRow,
  type NuevoLead,
  type NuevoLeadParcial,
  type ResultadoCompletar,
} from './types';

/** Repositorio en memoria: para tests y para probar sin credenciales. Se pierde al reiniciar. */
export class MemoryLeadRepository implements LeadRepository {
  readonly leads: LeadRow[] = [];

  constructor(private readonly ahora: () => Date = () => new Date()) {}

  async crear(lead: NuevoLead): Promise<{ id: string }> {
    const fila = aFila(lead, randomUUID(), this.ahora());
    this.leads.push(fila);
    return { id: fila.id };
  }

  async crearParcial(lead: NuevoLeadParcial): Promise<{ id: string }> {
    const fila = aFilaParcial(lead, randomUUID(), this.ahora());
    this.leads.push(fila);
    return { id: fila.id };
  }

  async completar(
    id: string,
    tokenHash: string,
    datos: DatosCompletar,
    ahora: Date,
  ): Promise<ResultadoCompletar> {
    const i = this.leads.findIndex((l) => l.id === id);
    const completa = i === -1 ? null : completarFila(this.leads[i]!, tokenHash, datos, ahora);
    if (!completa) return 'no_encontrado';
    this.leads[i] = completa;
    return 'ok';
  }

  async contarRecientesPorIp(ipHash: string, desde: Date): Promise<number> {
    return this.leads.filter(
      (l) => l.ip_hash === ipHash && new Date(l.created_at).getTime() >= desde.getTime(),
    ).length;
  }
}
