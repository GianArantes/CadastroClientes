import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * ARQUIVO: header.ts
 * NOME DO COMPONENTE: Header
 * DESCRIÇÃO: Componente de navegação (barra no topo)
 *
 * FUNCIONALIDADES:
 * 1. Exibir menu de navegação
 * 2. Links para Home, Clientes, About
 * 3. Branding/logo da aplicação
 *
 * POSIÇÃO: No topo da aplicação (definido em app.html)
 * IMPORTÂNCIA: Elemento estrutural de layout
 */

@Component({
  selector: 'app-header',          // Nome da tag: <app-header>
  standalone: true,                // Standalone component (Angular 21+)
  imports: [RouterLink],           // Permite routerLink para navegação
  templateUrl: './header.html',    // Arquivo HTML com menu
  styleUrl: './header.css'         // Arquivo CSS com estilos
})
export class Header {
  // Este componente não precisa lógica TypeScript
  // Apenas renderiza o template HTML com links de navegação
  // RouterLink do Angular lida com navegação de forma eficiente
}
