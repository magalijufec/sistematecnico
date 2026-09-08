export interface PresupuestoCreate {
  trabajoId: number;
  usuarioDecisionId: number | null;
  tecnicoId: number;
  descripcion: string | null;
  archivo: File;
}