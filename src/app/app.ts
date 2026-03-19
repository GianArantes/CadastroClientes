import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

/**
 * ARQUIVO: app.ts
 * NOME DO COMPONENTE: App (Componente Raiz)
 * DESCRIÇÃO: Componente raiz da aplicação Angular
 *
 * Este é o primeiro componente a ser renderizado. Todos os outros
 * componentes são renderizados dentro dele. É como a "casca" da aplicação.
 *
 * ESTRUTURA:
 * ┌─────────────────────────────────────┐
 * │         Componente: App             │
 * ├─────────────────────────────────────┤
 * │  ┌─────────────────────────────────┐│
 * │  │   Header (navegação)            ││
 * │  └─────────────────────────────────┘│
 * │  ┌─────────────────────────────────┐│
 * │  │   <router-outlet>               ││
 * │  │   (componentes das rotas)       ││
 * │  └─────────────────────────────────┘│
 * │  ┌─────────────────────────────────┐│
 * │  │   Footer (rodapé)               ││
 * │  └─────────────────────────────────┘│
 * └─────────────────────────────────────┘
 */

@Component({
  selector: 'app-root',          // Nome da tag HTML que renderiza este componente
  standalone: true,              // Indica que este é um standalone component (Angular 21+)
  imports: [
    RouterOutlet,                // Permite usar <router-outlet> no template
    Header,                       // Importa componente Header
    Footer                        // Importa componente Footer
  ],
  templateUrl: './app.html',     // Arquivo HTML com a estrutura visual
  styleUrl: './app.css'          // Arquivo CSS com estilos
})
export class App {
  /**
   * title: Signal<string>
   *
   * Tipo: Signal (reatividade do Angular)
   * Valor: 'CadastroClientes'
   * Propósito: Armazenar o título da aplicação
   *
   * Signal = propriedade reativa que dispara re-renderização quando muda
   * protected readonly = só pode ser acessado dentro da classe e não pode ser alterado
   *
   * Exemplo de uso no template:
   * <title>{{ title() }}</title>
   */
  protected readonly title = signal('CadastroClientes');

  // Nota: Este componente não precisa lógica complexa.
  // Apenas renderiza a estrutura de layout com Header, Outlet e Footer.
}

