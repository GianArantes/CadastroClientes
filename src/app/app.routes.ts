import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { About } from './components/pages/about/about';
import { ClienteForm } from './components/cliente/cliente-form/cliente-form';
import { ClientComp } from './components/cliente/client-comp/client-comp';
import { UsuarioComp } from './components/usuario/usuario-comp/usuario-comp';
import { UsuarioForm } from './components/usuario/usuario-form/usuario-form/usuario-form';

/**
 * ARQUIVO: app.routes.ts
 * DESCRIÇÃO: Definição de todas as rotas da aplicação (routing)
 *
 * Este arquivo define a estrutura de navegação da aplicação.
 * Cada rota mapeia uma URL para um componente específico.
 * Utiliza o sistema de roteamento standalone do Angular 21+
 */

export const routes: Routes = [
  /**
   * Rota raiz: '/'
   * Componente: Home (página inicial)
   * Características: Sem parâmetros
   */
  { path: '', component: Home },

  /**
   * Rota: '/about'
   * Componente: About (página sobre)
   * Características: Sem parâmetros
   */
  { path: 'about', component: About },

  /**
   * Rota: '/cliente'
   * Características: Rota PAI com ROTAS FILHAS (children routes)
   * Objetivo: Agrupar todas as funcionalidades relacionadas a clientes
   *
   * Esta é uma rota com subrotas (mudular routing):
   * - /cliente = lista de clientes
   * - /cliente/novo = formulário para novo cliente
   * - /cliente/:id = formulário para editar cliente existente
   */
  {
    path: 'cliente',
    children: [
      /**
       * Rota filha: '/cliente' (vazio)
       * Componente: ClientComp (lista de clientes)
       * Características: Exibe tabela com todos os clientes
       */
      { path: '', component: ClientComp },

      /**
       * Rota filha: '/cliente/novo'
       * Componente: ClienteForm (formulário vazio)
       * Características: Abre formulário para cadastro de novo cliente
       */
      { path: 'novo', component: ClienteForm },

      /**
       * Rota filha: '/cliente/:id'
       * Componente: ClienteForm (formulário preenchido)
       * Parâmetro: :id = ID único do cliente (UUID)
       * Características: Abre formulário para editar cliente existente
       * Exemplo: /cliente/123e4567-e89b-12d3-a456-426614174000
       */
      { path: ':id', component: ClienteForm }
    ]
  },
  {
    path: 'usuario',
    children: [
      { path: '', component: UsuarioComp },
      { path: 'novo', component: UsuarioForm },
      { path: ':id', component: UsuarioForm }
    ]
  }




];
