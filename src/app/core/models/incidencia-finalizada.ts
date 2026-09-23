export interface IncidenciaFinalizada {
  id: number;
  fecha: string | Date;
  fechaFinalizado?: string | Date | null;
  usuario: string;
  usuarioFinalizado?: string;
  cliente: string;
  asistencia: string;
  destino: string;
  incidencia: string;
  otro?: string;
  trabajoRealizado?: string;
  guardia: boolean;
}
