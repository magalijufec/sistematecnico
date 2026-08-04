export interface Cliente {
  id: number;
  nroCliente: string;
  nombre: string;
  email: string | null;
  direccion: string | null;
  provinciaId: number;
  provincia: string;
  ciudadId: number;
  ciudad: string;
  activo: boolean;
}

export interface ClienteDetalle {
  id: number;
  nroCliente: string;
  nombre: string;
  email: string | null;
  direccion: string | null;
  provinciaId: number;
  ciudadId: number;
  activo: boolean;
}

export interface ClienteCreate {
  nroCliente: string;
  nombre: string;
  email: string | null;
  direccion: string | null;
  provinciaId: number;
  ciudadId: number;
  activo: boolean;
}

export interface ClienteUpdate {
  nroCliente: string;
  nombre: string;
  email: string | null;
  direccion: string | null;
  provinciaId: number;
  ciudadId: number;
  activo: boolean;
}
