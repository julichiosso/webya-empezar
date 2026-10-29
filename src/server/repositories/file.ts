import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
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

// Una cola de escrituras por archivo: evita que dos requests simultáneos se pisen.
const colas = new Map<string, Promise<unknown>>();

/**
 * Repositorio en archivo JSON (`.data/leads.json`): para desarrollo y E2E sin Supabase.
 * NO sirve en producción serverless (disco efímero): env.ts lo rechaza en Vercel.
 */
export class FileLeadRepository implements LeadRepository {
  private readonly ruta: string;

  constructor(
    ruta: string,
    private readonly ahora: () => Date = () => new Date(),
  ) {
    // Solo desarrollo/E2E (env.ts lo rechaza en Vercel): que Turbopack no trace todo el proyecto.
    this.ruta = resolve(/* turbopackIgnore: true */ process.cwd(), ruta);
  }

  async leer(): Promise<LeadRow[]> {
    try {
      return JSON.parse(await readFile(this.ruta, 'utf8')) as LeadRow[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
      throw error;
    }
  }

  private encolar<T>(tarea: () => Promise<T>): Promise<T> {
    const previa = colas.get(this.ruta) ?? Promise.resolve();
    const siguiente = previa.then(tarea, tarea);
    colas.set(
      this.ruta,
      siguiente.catch(() => undefined),
    );
    return siguiente;
  }

  /** Escritura atómica: archivo temporal + rename, para no dejar un JSON a medias. */
  private async escribir(filas: LeadRow[]): Promise<void> {
    await mkdir(dirname(this.ruta), { recursive: true });
    const temporal = `${this.ruta}.${process.pid}.tmp`;
    await writeFile(temporal, JSON.stringify(filas, null, 2), 'utf8');
    await rename(temporal, this.ruta);
  }

  private agregar(fila: LeadRow): Promise<{ id: string }> {
    return this.encolar(async () => {
      const filas = await this.leer();
      filas.push(fila);
      await this.escribir(filas);
      return { id: fila.id };
    });
  }

  crear(lead: NuevoLead): Promise<{ id: string }> {
    return this.agregar(aFila(lead, randomUUID(), this.ahora()));
  }

  crearParcial(lead: NuevoLeadParcial): Promise<{ id: string }> {
    return this.agregar(aFilaParcial(lead, randomUUID(), this.ahora()));
  }

  completar(
    id: string,
    tokenHash: string,
    datos: DatosCompletar,
    ahora: Date,
  ): Promise<ResultadoCompletar> {
    return this.encolar(async () => {
      const filas = await this.leer();
      const i = filas.findIndex((l) => l.id === id);
      const completa = i === -1 ? null : completarFila(filas[i]!, tokenHash, datos, ahora);
      if (!completa) return 'no_encontrado';
      filas[i] = completa;
      await this.escribir(filas);
      return 'ok';
    });
  }

  async contarRecientesPorIp(ipHash: string, desde: Date): Promise<number> {
    const filas = await this.leer();
    return filas.filter(
      (l) => l.ip_hash === ipHash && new Date(l.created_at).getTime() >= desde.getTime(),
    ).length;
  }
}
