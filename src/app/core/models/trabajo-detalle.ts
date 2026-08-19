export interface TrabajoDetalle {
  id: number;

  fechaSolicitud: string;

  fechaInicio: string | null;

  fechaFinalizado: string | null;

  fechaPagado: string | null;

  cliente: string;

  tecnico: string;

  tarea: string;

  estado: string;

  estadoColor: string;

  comentarios: string | null;

  trabajoRealizado: string;

  factura: string | null;

  tieneFactura: boolean;

  //cantidadImagenes: number;
  
  solicitante: string | null;

}