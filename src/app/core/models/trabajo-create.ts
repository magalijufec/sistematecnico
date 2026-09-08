export interface TrabajoCreate {
  idCliente: number;
  idSector: number;
  idTarea: number;
  idsTecnicos: number[];
  comentarios: string | null;
  archivos: File[];
  idUsuarioCreacion: number;
}