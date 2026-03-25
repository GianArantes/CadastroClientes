import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Ncm } from '../../../interface/Ncm';
import { NcmService } from '../../../services/ncm-service';

@Component({
  selector: 'app-ncm-comp',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ncm-comp.html',
  styleUrl: './ncm-comp.css',
})
export class NcmComp implements OnInit {
  ncmLista: Ncm[] = [];
  ncmListaFiltrado: Ncm[] = [];
  searchTerm = '';

  constructor(private ncmService: NcmService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.carregarNcms();
  }
  carregarNcms(): void {
    this.ncmService.listarNcms().subscribe({
      next: (dados) => {
        // Sucesso: dados chegaram
        this.ncmLista = dados;              // Armazena dados brutos
        this.ncmListaFiltrado = dados;      // Inicialmente mostra todos
        console.log('Ncms carregadas:', dados); // Debug
        this.cdr.detectChanges(); // Força atualização da view
      },
      error: (err) => {
        // Erro: algo deu errado
        console.error('Erro ao carregar Ncms:', err);
      }
    });
  }
  search(e: Event): void {
    // Pega o elemento HTML (input) do evento
    const target = e.target as HTMLInputElement;
    // Pega o valor digitado e converte para minúscula
    const value = target.value.toLowerCase();
    // Armazena o termo de busca (não usado aqui, mas útil para debug)
    this.searchTerm = value;

    const ncms = this.ncmLista;    // Obtém lista completa
    const filtrados = ncms.filter((ncm) => {
      // Retorna true se o ncm atende aos critérios de busca
      return (
        ncm.codigo.toLowerCase().includes(value) ||
        ncm.descricao.toLowerCase().includes(value)
      );
    });
    // Atualiza a lista filtrada
    this.ncmListaFiltrado = filtrados;
    this.cdr.detectChanges(); // Força atualização da view
  }
  excluirNcm(id: string): void {
    if (confirm('Tem certeza que deseja excluir este NCM?')) {
      this.ncmService.removeNcm(id).subscribe({
        next: () => {
          // Sucesso: recarrega a lista
          this.carregarNcms();
        },
        error: (err) => {
          console.error('Erro ao excluir NCM:', err);
        }
      });
    }
  }
  trackById(index: number, item: any): string {
    return item.id;
  }
}
