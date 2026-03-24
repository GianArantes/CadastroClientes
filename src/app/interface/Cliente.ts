

export type status = 'ATIVO' | 'INATIVO';
/**
 * ARQUIVO: Cliente.ts
 * DESCRIÇÃO: Interface que define a estrutura de um Cliente
 *
 * Interface = contrato que garante a tipagem de dados
 * Benefícios:
 * - TypeScript valida tipos em tempo de compilação
 * - Autocompletar em IDEs
 * - Previne erros de digitação
 * - Torna o código mais legível e manutenível
 */

export interface Cliente {
  /**
   * id: string
   *
   * Identificador único do cliente (UUID)
   * Exemplo: '550e8400-e29b-41d4-a716-446655440000'
   * Gerado: pelo backend (banco de dados)
   * Usado: para editar e deletar clientes
   */
  id: string;

  /**
   * razaoSocial: string
   *
   * Denominação legal da empresa
   * Exemplo: 'Empresa XYZ Ltda'
   * Obrigatório: SIM
   * Validação: texto, máximo 255 caracteres
   */
  razaoSocial: string;

  /**
   * nomeFantasia: string
   *
   * Nome comercial da empresa (como é conhecida)
   * Exemplo: 'XYZ'
   * Obrigatório: SIM
   * Validação: texto, máximo 255 caracteres
   */
  nomeFantasia: string;

  /**
   * cnpj: string
   *
   * Cadastro Nacional de Pessoa Jurídica (identificação fiscal)
   * Formato: 14 dígitos (sem formatação no banco de dados)
   * Exemplo: '12345678000195'
   * Obrigatório: SIM
   * Validação: apenas números
   */
  cnpj: string;

  /**
   * ie: string
   *
   * Inscrição Estadual (registro fiscal estadual)
   * Formato: 8-14 dígitos (varia por estado)
   * Exemplo: '123456789'
   * Obrigatório: SIM
   * Validação: apenas números, 8-14 dígitos
   */
  ie: string;

  /**
   * abertura: string
   *
   * Data de abertura/fundação da empresa
   * Formato: YYYY-MM-DD (formato ISO para input type="date")
   * Exemplo: '2000-01-15'
   * Obrigatório: SIM
   * Validação: data válida
   */
  abertura: string;

  /**
   * endereco: string
   *
   * Endereço completo do cliente (rua, número, complemento, etc)
   * Exemplo: 'Rua das Flores, 123, apto 456'
   * Obrigatório: SIM
   * Validação: texto, máximo 500 caracteres
   */
  endereco: string;

  /**
   * email: string
   *
   * Endereço de email de contato
   * Exemplo: 'contato@empresa.com'
   * Obrigatório: SIM
   * Validação: email válido (formato RFC 5322)
   */
  email: string;

  /**
   * telefone: string
   *
   * Número de telefone de contato
   * Formato: pode incluir formatação ou apenas dígitos
   * Exemplo: '1133334444' ou '(11) 3333-4444'
   * Obrigatório: SIM
   * Validação: texto, máximo 20 caracteres
   */
  telefone: string;
  status: status; // Exemplo: 'ATIVO', 'INATIVO'.
}
