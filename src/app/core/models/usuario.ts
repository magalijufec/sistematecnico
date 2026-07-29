export interface Usuario {
  id: number;
  userName: string;
  nombreApellido: string;
  email: string;
  numeroCelular: string;
  ciudad: string;
  provincia: string;
  cliente: string;
  perfil: string;
  activo: boolean;
}

export interface UsuarioDetalle {
  id: number;
  userName: string;
  nombreApellido: string;
  email: string;
  numeroCelular: string;
  perfilId: number;
  provinciaId: number | null;
  ciudadId: number | null;
  clienteId: number | null;
  activo: boolean;
}