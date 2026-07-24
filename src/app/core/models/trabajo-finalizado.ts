export interface TrabajoFinalizado {
  id: number;
  fechaSolicitud: string;
  fechaFinalizado : string | null;
  fechaInicio: string;
  fechaPagado: string | null;
  idTecnico: number;
  tecnico: string;
  idCliente: number;
  cliente: string;
  idTarea: number;
  tarea: string;
  provincia: string;
  ciudad: string;
  trabajoRealizado: string | null;
}