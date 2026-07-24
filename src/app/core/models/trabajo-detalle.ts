export interface TrabajoDetalle {
  id: number;

  idCliente: number;
  cliente: string;

  idTecnico: number;
  tecnico: string;

  idTarea: number;
  tarea: string;

  idEstado: number;
  estado: string;
  estadoColor: string;

  fechaSolicitud: string;
  fechaFinalizado: string | null;

  comentarios: string;
  trabajoRealizado: string;

  tieneFactura: boolean;
  factura?: string | null;

  cantidadImagenes: number;
}