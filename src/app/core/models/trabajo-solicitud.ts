export interface TrabajoSolicitud {
  id: number;

  idCliente: number;
  cliente: string;

  provincia: string | null;
  ciudad: string | null;

  idSector: number;
  sector: string;

  idTarea: number;
  tarea: string;

  idEstado: number;
  estado: string;
  estadoColor: string;
}