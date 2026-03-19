import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../../services/cliente-service';
import { Cliente } from '../../../interface/Cliente';

/**
 * ARQUIVO: client-comp.ts
 * NOME DO COMPONENTE: ClientComp
 * DESCRIÇÃO: Componente que exibe a lista de clientes
 *
 * FUNCIONALIDADES:
 * 1. Exibir tabela com todos os clientes
 * 2. Buscar/filtrar clientes por Razão Social, Nome Fantasia ou CNPJ
 * 3. Botão para cadastrar novo cliente
 * 4. Links para editar clientes
 * 5. Botão para deletar clientes (com confirmação)
 *
 * FLUXO:
 * 1. Componente inicializa (ngOnInit)
 * 2. Carrega lista de clientes da API
 * 3. Exibe na tabela (template)
 * 4. Usuário pode filtrar, editar ou deletar
 */

@Component({
  selector: 'app-client-comp',        // Nome da tag: <app-client-comp>
  standalone: true,                   // Standalone component (Angular 21+)
  imports: [
    CommonModule,                     // *ngFor, *ngIf, etc
    RouterLink                        // routerLink para navegação
  ],
  templateUrl: './client-comp.html',  // Arquivo HTML
  styleUrl: './client-comp.css'       // Arquivo CSS
})
export class ClientComp implements OnInit {
  /**
   * clienteLista: Signal<Cliente[]>
   *
   * Propósito: Armazenar TODOS os clientes carregados da API
   * Tipo: Signal = reatividade do Angular 21+
   * Valor inicial: Array vazio []
   *
   * Quando muda: Quando clientes são carregados ou deletados
   * Usada em: Filtros e exibição na tabela
   *
   * Como usar:
   * - Ler: this.clienteLista() = array
   * - Atualizar: this.clienteLista.set(novoArray)
   */
  clienteLista = signal<Cliente[]>([]);

  /**
   * clienteListaFiltrado: Signal<Cliente[]>
   *
   * Propósito: Armazenar clientes APÓS aplicar filtro de busca
   * Tipo: Signal = reatividade do Angular 21+
   * Valor inicial: Array vazio []
   *
   * Quando muda: Quando usuário digita no campo de busca
   * Usada em: Exibição na tabela (mostra resultado filtrado)
   *
   * Lógica:
   * 1. Usuário digita algo
   * 2. search() é chamada
   * 3. Filtra clienteLista() usando o termo
   * 4. Resultados salvos em clienteListaFiltrado
   * 5. Tabela re-renderiza mostrando apenas os filtrados
   */
  clienteListaFiltrado = signal<Cliente[]>([]);

  /**
   * searchTerm: Signal<string>
   *
   * Propósito: Armazenar o termo de busca digitado pelo usuário
   * Tipo: Signal = reatividade
   * Valor inicial: String vazia ''
   *
   * Exemplo: se usuário digita "Google", searchTerm() = "google" (minúscula)
   */
  searchTerm = signal('');

  /**
   * CONSTRUTOR
   *
   * Injeta o ClienteService para fazer requisições à API
   * Injeção de dependência = padrão Angular para reutilização de código
   */
  constructor(private clienteService: ClienteService) {}

  /**
   * ngOnInit()
   *
   * Ciclo de vida: Executado UMA VEZ após o componente ser iniciado
   * Propósito: Carregar dados iniciais
   *
   * Neste caso:
   * - Chama carregarClientes() para buscar lista de API
   */
  ngOnInit(): void {
    this.carregarClientes();
  }

  /**
   * carregarClientes()
   *
   * PROPÓSITO: Buscar todos os clientes da API
   *
   * FLUXO DETALHADO:
   * 1. Chama this.clienteService.getClientes()
   * 2. API retorna Observable<Cliente[]>
   * 3. subscribe() se inscreve para receber os dados
   * 4. next: bloco executado quando dados chegam
   *    - Salva em clienteLista.set(dados)
   *    - Salva em clienteListaFiltrado.set(dados)
   *    - Log no console (para debug)
   * 5. error: bloco executado se houver erro
   *    - Log de erro no console
   */
  carregarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (dados) => {
        // Sucesso: dados chegaram
        this.clienteLista.set(dados);              // Armazena dados brutos
        this.clienteListaFiltrado.set(dados);      // Inicialmente mostra todos
        console.log('Clientes carregados:', dados); // Debug
      },
      error: (err) => {
        // Erro: algo deu errado
        console.error('Erro ao carregar', err);
      }
    });
  }

  /**
   * search(e: Event)
   *
   * PROPÓSITO: Filtrar clientes enquanto usuário digita
   *
   * PARÂMETRO:
   * - e: Event = objeto do evento (input do usuário)
   *
   * FLUXO DETALHADO:
   * 1. Valor digitado: 'Google'
   * 2. Converte para minúscula: 'google'
   * 3. Filtra clienteLista() verificando:
   *    - Se nome (razaoSocial) contém 'google' OU
   *    - Se nome fantasia (nomeFantasia) contém 'google' OU
   *    - Se CNPJ contém 'google'
   * 4. Salva resultado em clienteListaFiltrado
   * 5. Tabela re-renderiza mostrando apenas resultado filtrado
   *
   * EXEMPLO:
   * - Clientes: ['Google LLC', 'Facebook Inc', 'Google Brasil']
   * - Usuário digita: 'Google'
   * - Resultado: ['Google LLC', 'Google Brasil']
   */
  search(e: Event): void {
    // Pega o elemento HTML (input) do evento
    const target = e.target as HTMLInputElement;
    // Pega o valor digitado e converte para minúscula
    const value = target.value.toLowerCase();
    // Armazena o termo de busca (não usado aqui, mas útil para debug)
    this.searchTerm.set(value);

    // Filtra a lista de clientes
    const clientes = this.clienteLista();    // Obtém lista completa
    const filtrados = clientes.filter((cliente) => {
      // Retorna true se o cliente atende aos critérios de busca
      return (
        cliente.razaoSocial.toLowerCase().includes(value) ||   // Busca por Razão Social
        cliente.cnpj.includes(value) ||                        // Busca por CNPJ (exato)
        cliente.nomeFantasia.toLowerCase().includes(value)     // Busca por Nome Fantasia
      );
    });
    // Atualiza a tabela com resultado filtrado
    this.clienteListaFiltrado.set(filtrados);
  }

  /**
   * excluirCliente(id: string)
   *
   * PROPÓSITO: Deletar um cliente (com confirmação)
   *
   * PARÂMETRO:
   * - id: string = ID único do cliente a deletar
   *
   * FLUXO DETALHADO:
   * 1. Exibe diálogo de confirmação ao usuário
   *    "Tem certeza que deseja excluir este cliente?"
   * 2. Se usuário clicar "OK":
   *    - Chama this.clienteService.removeCliente(id)
   *    - API executa DELETE
   *    - Se sucesso: recarrega lista
   *    - Se erro: exibe alerta
   * 3. Se usuário clicar "Cancelar":
   *    - Nada acontece (condição if é false)
   *
   * FLUXO DO SUBSCRIBE:
   * - next: cliente foi deletado com sucesso
   *   - Log de sucesso
   *   - Chama carregarClientes() para atualizar tabela
   * - error: algo deu errado (permissões, rede, etc)
   *   - Log de erro
   *   - Exibe alerta HTML ao usuário
   */
  excluirCliente(id: string): void {
    // Confirmação: if true = usuário clicou OK, if false = cancelou
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      // Usuário confirmou: executa deleção
      this.clienteService.removeCliente(id).subscribe({
        next: () => {
          // Sucesso: cliente foi deletado
          console.log('Cliente excluído com sucesso');
          // Atualiza tabela recarregando lista
          this.carregarClientes();
        },
        error: (err) => {
          // Erro: algo deu errado
          console.error('Erro ao excluir cliente:', err);
          alert('Erro ao excluir cliente');
        }
      });
    }
    // Se usuário clicou Cancelar, nada acontece
  }
}
