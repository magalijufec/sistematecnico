export interface Dashboard {
  pendientes: number;
  enProceso: number;
  trabajosFinalizados: number;
  aprobados: number;
  pendientePago: number;
  finalizados: number;

  totalTrabajos: number;
  totalClientes: number;
  totalTecnicos: number;
  trabajosHoy: number;
  trabajosMes: number;
}