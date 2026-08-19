export interface Trabajo {

  id: number;

  fechaSolicitud: string;

  fechaInicio: string | null;

  fechaFinalizado: string | null;

  fechaPagado: string | null;

  idEstado: number;

  estado: string;

  estadoColor: string;

  idCliente: number;

  cliente: string;

  idTecnico: number;

  tecnico: string;

  idTarea: number;

  tarea: string;

  comentarios: string | null;

  trabajoRealizado: string | null;

  tieneFactura: boolean;

  factura: string | null;

  //cantidadImagenes: number;
}