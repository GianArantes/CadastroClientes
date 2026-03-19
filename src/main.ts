/// <reference types="@angular/localize" />

/**
 * ARQUIVO: main.ts
 * DESCRIÇÃO: Ponto de entrada da aplicação Angular
 *
 * Este é o primeiro arquivo executado quando a aplicação inicia.
 * Aqui fazemos o bootstrap (inicialização) do componente raiz (App)
 * com as configurações definidas em app.config.ts
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment.prod';

/**
 * bootstrapApplication()
 * - Inicia a aplicação Angular de forma standalone (sem NgModule)
 * - Parâmetro 1: App = componente raiz que será renderizado
 * - Parâmetro 2: appConfig = configuração com providers (rotas, HTTP, etc)
 * - .catch() = captura erros durante a inicialização
 */
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
