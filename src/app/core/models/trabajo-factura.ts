export interface TrabajoFactura {
    id: number;
    trabajoId: number;
    rutaArchivo: string;
    fechaCarga: Date;
    fechaPagado: Date | null;
}