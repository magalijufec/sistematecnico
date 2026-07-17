import { EstadoTrabajo } from "./estado-trabajo";

export interface Trabajo {

  id: number;

  fechaSolicitud: Date;

  fechaTrabajo: Date;

  cliente: string;

  tecnico: string;

  tarea: string;

  estado: string;
  estadoColor: string;

}