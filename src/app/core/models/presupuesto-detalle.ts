export interface PresupuestoDetalle {
  id: number;
  fechaCarga: string | null;
  tecnicoId: number;
  tecnico: string;
  usuarioDecisionId: number | null;
  usuarioDecision: string | null;
  fechaDecision: string | null;
  estadoId: number;
  estado: string;
  motivoRechazo: string | null;
  descripcion: string | null;
  rutaArchivo: string | null;
  trabajoId: number;
}