import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produto } from '../../../interface/Produto';
import { ProdutoService } from '../../../services/produto-service';

@Component({
  selector: 'app-produto-comp',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './produto-comp.html',
  styleUrl: './produto-comp.css',
})
export class ProdutoComp implements OnInit {
  produtoLista = signal<Produto[]>([]);
  produtoListaFiltrado = signal<Produto[]>([]);
  searchTerm = signal('');

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }
  carregarProdutos(): void {
    this.produtoService.listarProdutos().subscribe({
      next: (dados) => {
        // Sucesso: dados chegaram
        this.produtoLista.set(dados);              // Armazena dados brutos
        this.produtoListaFiltrado.set(dados);      // Inicialmente mostra todos
        console.log('Produtos carregados:', dados); // Debug
      },
      error: (err) => {
        // Erro: algo deu errado
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }
  search(e: Event): void {
    // Pega o elemento HTML (input) do evento
    const target = e.target as HTMLInputElement;
    // Pega o valor digitado e converte para minúscula
    const value = target.value.toLowerCase();
    // Armazena o termo de busca (não usado aqui, mas útil para debug)
    this.searchTerm.set(value);

    // Filtra a lista de clientes
    const produtos = this.produtoLista();    // Obtém lista completa
    const filtrados = produtos.filter((produto) => {
      // Retorna true se o produto atende aos critérios de busca
      return (
        produto.nome.toLowerCase().includes(value)    // Busca por nome
      );
    });
    // Atualiza a tabela com resultado filtrado
    this.produtoListaFiltrado.set(filtrados);
  }

excluirProduto(id: string): void {
    // Confirmação: if true = usuário clicou OK, if false = cancelou
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      // Usuário confirmou: executa deleção
      this.produtoService.removeProduto(id).subscribe({
        next: () => {
          // Sucesso: produto foi deletado
          console.log('Produto excluído com sucesso');
          // Atualiza tabela recarregando lista
          this.carregarProdutos();
        },
        error: (err) => {
          // Erro: algo deu errado
          console.error('Erro ao excluir produto:', err);
          alert('Erro ao excluir produto');
        }
      });
    }
    // Se usuário clicou Cancelar, nada acontece
  }

}
