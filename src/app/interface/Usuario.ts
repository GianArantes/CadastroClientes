
export type RoleUsuario  = 'ADMIN' | 'REPRESENTANTE';
export type StatusUsuario  = 'ATIVO' | 'INATIVO' | 'BLOQUEADO';

export interface Usuario {
  id: string;
  nomeCompleto: string;
  apelido: string;
  email: string;
  senha: string;
  telefone: string;
  role: RoleUsuario; // Exemplo: 'ADMIN', 'REPRESENTANTE', etc.
  status: StatusUsuario; // Exemplo: 'ATIVO', 'INATIVO', 'BLOQUEADO', etc.
}
