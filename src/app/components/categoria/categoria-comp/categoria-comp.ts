import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../interface/Categoria';
import { CategoriaService } from '../../../services/categoria-service';

@Component({
  selector: 'app-categoria-comp',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria-comp.html',
  styleUrl: './categoria-comp.css',
})
export class CategoriaComp implements OnInit {
  categoriaLista = signal<Categoria[]>([]);
  categoriaListaFiltrado = signal<Categoria[]>([]);
  searchTerm = signal('');

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.carregarCategorias();
  }
  carregarCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (dados) => {
        // Sucesso: dados chegaram
        this.categoriaLista.set(dados);              // Armazena dados brutos
        this.categoriaListaFiltrado.set(dados);      // Inicialmente mostra todos
        console.log('Categorias carregadas:', dados); // Debug
      },
      error: (err) => {
        // Erro: algo deu errado
        console.error('Erro ao carregar categorias:', err);
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
    const categorias = this.categoriaLista();    // Obtém lista completa
    const filtrados = categorias.filter((categoria) => {
      // Retorna true se a categoria atende aos critérios de busca
      return (
        categoria.nome.toLowerCase().includes(value)    // Busca por nome
      );
    });
    // Atualiza a tabela com resultado filtrado
    this.categoriaListaFiltrado.set(filtrados);
  }

excluirCategoria(id: string): void {
    // Confirmação: if true = usuário clicou OK, if false = cancelou
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      // Usuário confirmou: executa deleção
      this.categoriaService.removeCategoria(id).subscribe({
        next: () => {
          // Sucesso: categoria foi deletada
          console.log('Categoria excluída com sucesso');
          // Atualiza tabela recarregando lista
          this.carregarCategorias();
        },
        error: (err) => {
          // Erro: algo deu errado
          console.error('Erro ao excluir categoria:', err);
          alert('Erro ao excluir categoria');
        }
      });
    }
    // Se usuário clicou Cancelar, nada acontece
  }

}
