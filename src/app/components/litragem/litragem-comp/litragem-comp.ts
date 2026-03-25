import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoLitragem } from '../../../interface/ProdutoLitragem';
import { ProdutoLitragemService } from '../../../services/produto-litragem-service';

@Component({
  selector: 'app-litragem-comp',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './litragem-comp.html',
  styleUrl: './litragem-comp.css',
})
export class LitragemComp implements OnInit {
  litragemLista = signal<ProdutoLitragem[]>([]);
  litragemListaFiltrado = signal<ProdutoLitragem[]>([]);
  searchTerm = signal('');

  constructor(private litragemService: ProdutoLitragemService) { }

  ngOnInit(): void {
    this.carregarLitragens();
  }
  carregarLitragens(): void {
    this.litragemService.listarLitragens().subscribe({
      next: (dados) => {
        // Sucesso: dados chegaram
        this.litragemLista.set(dados);              // Armazena dados brutos
        this.litragemListaFiltrado.set(dados);      // Inicialmente mostra todos
        console.log('Litragens carregadas:', dados); // Debug
      },
      error: (err) => {
        // Erro: algo deu errado
        console.error('Erro ao carregar litragens:', err);
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

    const litragens = this.litragemLista();    // Obtém lista completa
    const filtrados = litragens.filter((litragem) => {
      // Retorna true se a litragem atende aos critérios de busca
      return (
        litragem.nome.toLowerCase().includes(value)    // Busca por nome
      );
    });
    // Atualiza a tabela com resultado filtrado
    this.litragemListaFiltrado.set(filtrados);
  }

excluirLitragem(id: string): void {
    // Confirmação: if true = usuário clicou OK, if false = cancelou
    if (confirm('Tem certeza que deseja excluir esta litragem?')) {
      // Usuário confirmou: executa deleção
      this.litragemService.removeLitragem(id).subscribe({
        next: () => {
          // Sucesso: litragem foi deletada
          console.log('Litragem excluída com sucesso');
          // Atualiza tabela recarregando lista
          this.carregarLitragens();
        },
        error: (err) => {
          // Erro: algo deu errado
          console.error('Erro ao excluir litragem:', err);
          alert('Erro ao excluir litragem');
        }
      });
    }
    // Se usuário clicou Cancelar, nada acontece
  }

}
