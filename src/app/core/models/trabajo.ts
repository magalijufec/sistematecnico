export interface Trabajo {
  id: number;
  idCliente: number;
  idTecnico: number;
  idEstado: number;
  idTarea: number;
  fechaSolicitud: string;
  fechaFinalizado: string;
  cliente: string;
  tecnico: string;
  tarea: string;
  estado: string;
  comentarios: string;
  provincia: string;
  ciudad: string;
}