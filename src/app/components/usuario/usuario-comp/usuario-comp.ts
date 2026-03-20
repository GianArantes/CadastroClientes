import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service';
import { Usuario } from '../../../interface/Usuario';

@Component({
  selector: 'app-usuario-comp',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuario-comp.html',
  styleUrl: './usuario-comp.css',
})
export class UsuarioComp implements OnInit {

  usuarioLista = signal<Usuario[]>([]);
  usuarioListaFiltrado = signal<Usuario[]>([]);
  searchTerm = signal('');

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (dados) => {
        // Sucesso: dados chegaram
        this.usuarioLista.set(dados);              // Armazena dados brutos
        this.usuarioListaFiltrado.set(dados);      // Inicialmente mostra todos
        console.log('Usuarios carregados:', dados); // Debug
      },
      error: (err) => {
        // Erro: algo deu errado
        console.error('Erro ao carregar', err);
      }
    });
  }
  search(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value.toLowerCase();
    this.searchTerm.set(value);
    const usuarios = this.usuarioLista();    // Obtém lista completa
    const filtrados = usuarios.filter((usuario) => {
      return (
        usuario.nomeCompleto.toLowerCase().includes(value) ||   // Busca por Nome
        usuario.apelido.includes(value) ||                        // Busca por CNPJ (exato)
        usuario.email.toLowerCase().includes(value)     // Busca por Nome Fantasia
      );
    });
    this.usuarioListaFiltrado.set(filtrados);
  }

excluirUsuario(id: string): void {

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      // Usuário confirmou: executa deleção
      this.usuarioService.removeUsuario(id).subscribe({
        next: () => {
          console.log('Usuário excluído com sucesso');
          // Atualiza tabela recarregando lista
          this.carregarUsuarios();
        },
        error: (err) => {
          // Erro: algo deu errado
          console.error('Erro ao excluir usuário:', err);
          alert('Erro ao excluir usuário');
        }
      });
    }
    // Se usuário clicou Cancelar, nada acontece
  }



}
