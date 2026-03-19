import { Component } from '@angular/core';

/**
 * ARQUIVO: about.ts
 * NOME DO COMPONENTE: About
 * DESCRIÇÃO: Componente da página "Sobre" da aplicação
 *
 * FUNCIONALIDADES:
 * 1. Exibir informações sobre a aplicação
 * 2. Histórico, missão, visão da empresa
 * 3. Informações de contato
 * 4. Links úteis (redes sociais, etc)
 *
 * ROTA: /about
 * IMPORTÂNCIA: Página informativa sobre a empresa
 *
 * EXEMPLO DE USO:
 * - URL: http://localhost:4200/about
 * - Exibe a página SOBRE
 */

@Component({
  selector: 'app-about',           // Nome da tag: <app-about>
  standalone: true,                // Standalone component (Angular 21+)
  imports: [],                     // Sem dependências de componentes
  templateUrl: './about.html',     // Arquivo HTML com conteúdo
  styleUrl: './about.css'          // Arquivo CSS com estilos
})
export class About {
  // Este componente não precisa lógica TypeScript
  // Apenas renderiza HTML estático com informações sobre a empresa
}
