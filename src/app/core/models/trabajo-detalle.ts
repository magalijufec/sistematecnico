export interface TrabajoDetalle {
  id: number;
  cliente: string;
  tecnico: string;
  tarea: string;
  estado: string;
  estadoColor: string;
  fechaSolicitud: string;
  fechaTrabajo: string;
  comentarios: string;
  trabajoRealizado: string;
  tieneFactura: boolean;
  factura?: string | null;
  cantidadImagenes: number;
}