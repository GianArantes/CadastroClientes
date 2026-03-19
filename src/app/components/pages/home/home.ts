import { Component } from '@angular/core';

/**
 * ARQUIVO: home.ts
 * NOME DO COMPONENTE: Home
 * DESCRIÇÃO: Componente da página inicial da aplicação
 *
 * FUNCIONALIDADES:
 * 1. Exibir conteúdo da HOME (boas-vindas, informações)
 * 2. Entry point da aplicação
 * 3. Prover links ou botões de navegação para seções principais
 *
 * ROTA: / (raiz da aplicação)
 * IMPORTÂNCIA: Página inicial - primeira coisa que usuário vê
 *
 * EXEMPLO DE USO:
 * - URL: http://localhost:4200/
 * - Exibe a página HOME
 */

@Component({
  selector: 'app-home',            // Nome da tag: <app-home>
  standalone: true,                // Standalone component (Angular 21+)
  imports: [],                     // Pode adicionar RouterLink se desejar links aqui
  templateUrl: './home.html',      // Arquivo HTML com conteúdo
  styleUrl: './home.css'           // Arquivo CSS com estilos
})
export class Home {
  // Este componente não precisa lógica TypeScript
  // Apenas renderiza HTML estático da página inicial
}
