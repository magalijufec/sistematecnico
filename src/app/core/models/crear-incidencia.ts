export interface CrearIncidenciaDto {
  clienteId: number;
  destinoId: number;
  tareaId: number;
  asistenciaId: number;
  estadoIncidenciaId: number;
  otro?: string;
  comentario?: string;
  trabajoRealizado?: string;
  guardia: boolean;
}