export interface IncidenciaPendiente {
  id: number;
  fecha: Date;
  usuario: string;
  cliente: string;
  asistencia: string;
  incidencia: string;
  otro?: string;
  comentario?: string;
  guardia: boolean;
}
