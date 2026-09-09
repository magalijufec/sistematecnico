import { ImagenSolicitud } from "./imagen";
import { PresupuestoDetalle } from "./presupuesto-detalle";
import { TrabajoFactura } from "./trabajo-factura";

export interface TrabajoDetalle {
  id: number;
  fechaSolicitud: string;
  fechaInicio: string | null;
  fechaFinalizado: string | null;
  fechaPagado: string | null;
  cliente: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  idCliente: number;
  tecnico: string;
  sector: string;
  tarea: string;
  idEstado: number;
  estado: string;
  estadoColor: string;
  comentarios: string | null;
  trabajoRealizado: string;
  facturas: TrabajoFactura[];
  tieneFactura: boolean;
  imagenesSolicitud: ImagenSolicitud[] | null;
  solicitante: string | null;
  motivoRechazoSolicitud: string | null;
  idsTecnicos: number[];
  tecnicosAsignados: string[];
  materiales: string | null;
  motivoMejora: string | null;
}