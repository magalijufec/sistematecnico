export interface RegistrarPagoFacturaResponse {
  trabajoId: number;
  facturaId: number;
  fechaPagadoFactura: string;
  trabajoFinalizado: boolean;
  cantidadFacturas: number;
  cantidadFacturasPagadas: number;
  cantidadFacturasPendientes: number;
  mensaje: string;
}