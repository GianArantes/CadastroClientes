import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

/**
 * ARQUIVO: app.config.ts
 * DESCRIÇÃO: Configuração global da aplicação
 *
 * Este arquivo define todos os serviços e funcionalidades que a aplicação
 * precisa usar. Utiliza o padrão de "providers" do Angular 21+ (standalone).
 *
 * Equivalente ao NgModule de versões antigas do Angular.
 */

export const appConfig: ApplicationConfig = {
  /**
   * providers: Array de serviços e funcionalidades injetáveis
   *
   * Cada provedor aqui é registrado globalmente e pode ser injetado
   * em qualquer componente, serviço ou função da aplicação.
   */
  providers: [
    /**
     * provideBrowserGlobalErrorListeners()
     *
     * Propósito: Capturar erros globais não tratados
     * Benefícios:
     * - Evita que a aplicação quebre por erros inesperados
     * - Permite logging e tratamento centralizado de erros
     * - Melhora a experiência do usuário
     */
    provideBrowserGlobalErrorListeners(),

    /**
     * provideRouter(routes)
     *
     * Propósito: Registrar o sistema de roteamento
     * Parâmetro: routes = array de rotas definidas em app.routes.ts
     * Funcionalidades habilitadas:
     * - Navegação entre componentes
     * - Suporte a parâmetros de rota (:id)
     * - Lazy loading de rotas (quando configurado)
     * - Histórico de navegação (back/forward)
     */
    provideRouter(routes),

    /**
     * provideHttpClient()
     *
     * Propósito: Registrar o cliente HTTP para requisições
     * Funcionalidades habilitadas:
     * - Fazer requisições GET, POST, PUT, DELETE
     * - Suporte a interceptadores (autenticação, logging)
     * - Tratamento de erros HTTP
     *
     * Utilizado por: ClienteService para comunicação com a API
     */
    provideHttpClient(),
  ]
};
