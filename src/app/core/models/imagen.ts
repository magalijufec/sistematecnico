export interface Imagen {
  id: number;
  tipo: string;
  nombreArchivo: string;
  rutaArchivo: string;
  extension: string;
  tamanio: number;
  fechaCarga: string;
}

export interface TrabajoImagenComparacion {
  id: number;
  trabajoId: number;
  imagenAntes: Imagen | null;
  imagenDespues: Imagen | null;
}