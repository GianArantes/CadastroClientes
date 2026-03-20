import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../interface/Cliente';
import { environment } from '../../environments/environment';

/**
 * ARQUIVO: cliente-service.ts
 * NOME: ClienteService
 * TIPO: Service (Injectable)
 * DESCRIÇÃO: Serviço responsável por toda comunicação com a API de clientes
 *
 * Role: Centraliza todas as requisições HTTP relacionadas a clientes
 * Benefícios:
 * - Evita duplicação de código nas chamadas HTTP
 * - Centraliza a URL da API em um único lugar
 * - Facilita testes e manutenção
 * - Segue o padrão de Separation of Concerns (SoC)
 *
 * @Injectable providedIn: 'root' = disponível em toda a aplicação (singleton)
 */

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  /**
   * baseApiUrl: string
   *
   * Propósito: URL base da API (backend)
   * Origem: environment.baseApiUrl (configuração externa)
   * Exemplo: 'http://localhost:8080'
   *
   * Por que usar environment?
   * - Permite URLs diferentes por ambiente (dev, produção)
   * - Não hardcoda URLs no código
   * - Facilita deploy em diferentes servidores
   */
  private baseApiUrl = environment.baseApiUrl;
  private cnpjApiUrl = '/api/cnpj';

  /**
   * apiUrl: string
   *
   * Propósito: URL completa do endpoint de clientes
   * Construção: ${baseApiUrl}/clientes
   * Exemplo: 'http://localhost:8080/clientes'
   *
   * Todos os métodos usam esta URL como base
   */
  private apiUrl = `${this.baseApiUrl}/clientes`;

  /**
   * CONSTRUTOR
   *
   * Injeta o HttpClient que será usado para fazer requisições
   * HttpClient = serviço Angular para requisições HTTP
   */
  constructor(private http: HttpClient) {}

  /**
   * getClientes()
   *
   * DESCRIÇÃO: Buscar lista de TODOS os clientes
   * MÉTODO HTTP: GET
   * URL: ${apiUrl}/listar
   * EXEMPLO: GET http://localhost:8080/clientes/listar
   *
   * RETORNO: Observable<Cliente[]>
   * - Observable = fluxo de dados assíncrono (padrão RxJS)
   * - Cliente[] = array de objetos Cliente
   *
   * EXEMPLO DE USO:
   * this.clienteService.getClientes().subscribe({
   *   next: (dados) => console.log('Clientes:', dados),
   *   error: (err) => console.error('Erro:', err)
   * });
   */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/listar`);
  }

  /**
   * getCliente(id: string)
   *
   * DESCRIÇÃO: Buscar um cliente específico pelo ID
   * MÉTODO HTTP: GET
   * URL: ${apiUrl}/${id}
   * EXEMPLO: GET http://localhost:8080/clientes/123e4567-e89b-12d3-a456-426614174000
   *
   * PARÂMETRO:
   * - id: string = ID único do cliente (UUID)
   *
   * RETORNO: Observable<Cliente>
   * - Observable<Cliente> = um único objeto Cliente
   *
   * EXEMPLO DE USO:
   * this.clienteService.getCliente('123e4567-e89b-12d3-a456-426614174000').subscribe({
   *   next: (cliente) => console.log('Cliente encontrado:', cliente)
   * });
   */
  getCliente(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  getCnpjInfo(cnpj: string): Observable<any> {
    return this.http.get<any>(`${this.cnpjApiUrl}/${cnpj}`);
  }


  /**
   * addCliente(cliente: Cliente)
   *
   * DESCRIÇÃO: Criar um NOVO cliente
   * MÉTODO HTTP: POST
   * URL: ${apiUrl}/cadastrar
   * EXEMPLO: POST http://localhost:8080/clientes/cadastrar
   *
   * PARÂMETRO:
   * - cliente: Cliente = objeto com dados do novo cliente
   *   Campos necessários: razaoSocial, nomeFantasia, cnpj, endereco, email, telefone
   *
   * RETORNO: Observable<Cliente>
   * - A API retorna o cliente criado (com ID gerado)
   *
   * EXEMPLO DE USO:
   * const novoCliente: Cliente = {
   *   id: '',
   *   razaoSocial: 'Empresa XYZ',
   *   nomeFantasia: 'XYZ',
   *   cnpj: '12345678000195',
   *   endereco: 'Rua A, 123',
   *   email: 'contato@xyz.com',
   *   telefone: '1133334444'
   * };
   * this.clienteService.addCliente(novoCliente).subscribe({
   *   next: (clienteCriado) => console.log('Cliente criado:', clienteCriado)
   * });
   */
  addCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}`, cliente);
  }

  /**
   * updateCliente(cliente: Cliente)
   *
   * DESCRIÇÃO: ATUALIZAR um cliente existente
   * MÉTODO HTTP: PUT
   * URL: ${apiUrl}/${cliente.id}
   * EXEMPLO: PUT http://localhost:8080/clientes/123e4567-e89b-12d3-a456-426614174000
   *
   * PARÂMETRO:
   * - cliente: Cliente = objeto com dados ATUALIZADOS (deve conter o ID)
   *
   * RETORNO: Observable<Cliente>
   * - A API retorna o cliente atualizado
   *
   * EXEMPLO DE USO:
   * const clienteAtualizado = {
   *   ...clienteOriginal,
   *   nomeFantasia: 'Novo Nome'
   * };
   * this.clienteService.updateCliente(clienteAtualizado).subscribe({
   *   next: (cliente) => console.log('Cliente atualizado:', cliente)
   * });
   */
  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente);
  }

  /**
   * removeCliente(id: string)
   *
   * DESCRIÇÃO: DELETAR um cliente
   * MÉTODO HTTP: DELETE
   * URL: ${apiUrl}/${id}
   * EXEMPLO: DELETE http://localhost:8080/clientes/123e4567-e89b-12d3-a456-426614174000
   *
   * PARÂMETRO:
   * - id: string = ID do cliente a deletar
   *
   * RETORNO: Observable<void>
   * - void = sem retorno de dados (só confirma sucesso)
   *
   * EXEMPLO DE USO:
   * this.clienteService.removeCliente('123e4567-e89b-12d3-a456-426614174000').subscribe({
   *   next: () => console.log('Cliente deletado com sucesso'),
   *   error: (err) => console.error('Erro ao deletar:', err)
   * });
   */
  removeCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
