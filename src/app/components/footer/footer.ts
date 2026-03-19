import { Component } from '@angular/core';

/**
 * ARQUIVO: footer.ts
 * NOME DO COMPONENTE: Footer
 * DESCRIÇÃO: Componente de rodapé da aplicação
 *
 * FUNCIONALIDADES:
 * 1. Exibir informações de rodapé
 * 2. Copyright e informações da empresa
 * 3. Links úteis (opcional)
 *
 * POSIÇÃO: No rodapé da aplicação (definido em app.html)
 * IMPORTÂNCIA: Elemento estrutural de layout
 */

@Component({
  selector: 'app-footer',          // Nome da tag: <app-footer>
  standalone: true,                // Standalone component (Angular 21+)
  imports: [],                     // Sem dependências de componentes
  templateUrl: './footer.html',    // Arquivo HTML com conteúdo
  styleUrl: './footer.css'         // Arquivo CSS com estilos
})
export class Footer {
  // Este componente não precisa lógica TypeScript
  // Apenas renderiza conteúdo estático (copyright, informações)
}
