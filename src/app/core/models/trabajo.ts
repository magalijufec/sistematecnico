import { TrabajoFactura } from "./trabajo-factura";

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
  idsTecnicos: number[];
  tecnico: string;
  idSector: number;
  idTarea: number;
  tarea: string;
  comentarios: string | null;
  trabajoRealizado: string | null;
  tieneFactura: boolean;
  facturas: TrabajoFactura[]
}