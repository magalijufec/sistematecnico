import { ImagenSolicitud } from "./imagen";
import { TrabajoFactura } from "./trabajo-factura";

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
  facturas: TrabajoFactura[];
  tieneFactura: boolean;
  imagenesSolicitud: ImagenSolicitud[];  
  solicitante: string | null;
}