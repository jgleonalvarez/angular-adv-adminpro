import { Usuario } from "../models/usuario.model";

export interface UsuarioPage {
  total: number;
  usuarios: Usuario[]
}
