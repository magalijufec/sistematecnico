export interface UsuarioCreate {
  userName: string;
  nombreApellido: string;
  email: string;
  password: string;
  idPerfil: number;
  clienteId: number | null;
  activo: boolean;
}
