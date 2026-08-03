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
}

export interface ClienteDetalle {
  id: number;
  nroCliente: string;
  nombre: string;
  email: string | null;
  direccion: string | null;
  provinciaId: number;
  ciudadId: number;
}

export interface ClienteCreate {
  nroCliente: string;
  nombre: string;
  email: string | null;
  direccion: string | null;
  provinciaId: number;
  ciudadId: number;
}

export interface ClienteUpdate {
  nroCliente: string;
  nombre: string;
  email: string | null;
  direccion: string | null;
  provinciaId: number;
  ciudadId: number;
}
