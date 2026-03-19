import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Cliente } from '../../../interface/Cliente';
import { ClienteService } from '../../../services/cliente-service';

/**
 * ARQUIVO: cliente-form.ts
 * NOME DO COMPONENTE: ClienteForm
 * DESCRIÇÃO: Componente para CADASTRAR ou EDITAR clientes
 * 
 * FUNCIONALIDADES:
 * 1. Modo NOVO CLIENT: formulário vazio → POST (criar)
 * 2. Modo EDITAR: formulário preenchido → PUT (atualizar)
 * 3. Validação de campos obrigatórios
 * 4. Validação de email
 * 5. Indicador de carregamento durante requisição
 * 
 * DETECÇÃO DE MODO:
 * - URL /cliente/novo = NOVO cliente (formulário vazio)
 * - URL /cliente/{id} = EDITAR cliente (carrega dados da API)
 * 
 * FLUXO NOVO:
 * 1. Usuário clica "Cadastrar Novo Cliente"
 * 2. Vai para URL: /cliente/novo
 * 3. Componente detecta modo "novo"
 * 4. Formulário vazio é exibido
 * 5. Botão diz "Cadastrar"
 * 
 * FLUXO EDITAR:
 * 1. Usuário clica "Alterar" em uma linha da tabela
 * 2. Vai para URL: /cliente/{id}
 * 3. Componente detecta modo "edição" (tem ID)
 * 4. Carrega dados do cliente da API
 * 5. Formulário é preenchido com esses dados
 * 6. Botão diz "Alterar"
 * 7. Ao enviar, faz PUT em vez de POST
 */

@Component({
  selector: 'app-cliente-form',         // Nome da tag: <app-cliente-form>
  standalone: true,                     // Standalone component
  imports: [
    CommonModule,                       // *ngIf, etc
    ReactiveFormsModule,                // Reactive forms ([formGroup], formControlName)
    FormsModule                         // Forms módulos
  ],
  templateUrl: './cliente-form.html',   // Arquivo HTML
  styleUrl: './cliente-form.css'        // Arquivo CSS
})
export class ClienteForm implements OnInit {
  /**
   * btnText: Signal<string>
   * 
   * Propósito: Texto do botão muda conforme o modo
   * Valores: 'Cadastrar' (novo) ou 'Alterar' (edição)
   * Reatividade: Signal = re-renderiza quando muda
   */
  btnText = signal('Cadastrar');

  /**
   * formSubmitted: Signal<boolean>
   * 
   * Propósito: Rastrear se formulário foi submetido
   * Uso: Mostrar erros de validação APENAS após primera tentativa
   * Lógica:
   * - false = usuário ainda não clicou "Enviar"
   * - true = usuário clicou "Enviar" (mostra erros)
   */
  formSubmitted = signal(false);

  /**
   * camposPreenchidos: Signal<boolean>
   * 
   * Propósito: Controlar exibição de mensagem de erro geral
   * Usa-se: Quando formulário inteiro é inválido
   * Padrão: true = tudo certo, false = algo errado
   */
  camposPreenchidos = signal(true);

  /**
   * isLoading: Signal<boolean>
   * 
   * Propósito: Indicador de requisição em andamento
   * Estados:
   * - false = nada acontecendo (padrão)
   * - true = carregando dados ou salvando (requisição ativa)
   * 
   * Uso prático:
   * - Desabilita botão durante upload (evita cliques duplos)
   * - Exibe spinner/loading na interface
   * - Bloqueia alterações no formulário
   */
  isLoading = signal(false);

  /**
   * clienteForm: FormGroup
   * 
   * Propósito: Grupo de controles do formulário
   * Tipo: FormGroup = coleção de FormControl (campos)
   * 
   * Controles:
   * - id: ID do cliente (escondido, preenchido automaticamente)
   * - razaoSocial: texto (obrigatório)
   * - nomeFantasia: texto (obrigatório)
   * - cnpj: texto (obrigatório)
   * - endereco: texto (obrigatório)
   * - email: email (obrigatório + validação de email)
   * - telefone: texto (obrigatório)
   * 
   * Validação:
   * - Obrigatório (required) = campo não pode ser vazio
   * - Email = deve ser formato válido de email
   * 
   * Propriedade: FormGroup!
   * - ! = sinal de definição atrasada (será definido em ngOnInit)
   */
  clienteForm!: FormGroup;

  /**
   * CONSTRUTOR
   * 
   * Injeta 3 dependências:
   * 1. clienteService = buscar/salvar dados
   * 2. route = obter parâmetros da rota (:id)
   * 3. router = navegar programaticamente
   */
  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * ngOnInit()
   * 
   * Ciclo de vida: executado UMA VEZ após componente inicializar
   * Propósito: Preparar formulário e dados iniciais
   * 
   * FLUXO:
   * 1. Chama inicializarFormulario() → cria FormGroup vazio
   * 2. Chama verificarEdicao() → detecta novo ou edição
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarEdicao();
  }

  /**
   * inicializarFormulario() [PRIVATE]
   * 
   * PROPÓSITO: Criar o FormGroup com todos os campos
   * 
   * Estrutura:
   * - Cada FormControl = um campo do formulário
   * - Parâmetro 1: valor inicial (vazio '')
   * - Parâmetro 2: validadores (requisitos do campo)
   * 
   * VALIDADORES:
   * - Validators.required = campo não pode estar vazio
   * - Validators.email = deve ser um email válido
   * 
   * Por que private?
   * - Só é chamado internamente pela classe
   * - Não deve ser acessado de fora
   */
  private inicializarFormulario(): void {
    this.clienteForm = new FormGroup({
      // ID do cliente (escondido no template)
      // Vazio no novo, preenchido na edição
      id: new FormControl(''),

      // Razão Social (denominação legal da empresa)
      razaoSocial: new FormControl('', [Validators.required]),

      // Nome Fantasia (nome comercial)
      nomeFantasia: new FormControl('', [Validators.required]),

      // CNPJ (cadastro fiscal)
      cnpj: new FormControl('', [Validators.required]),

      // Endereço completo
      endereco: new FormControl('', [Validators.required]),

      // Email da empresa
      email: new FormControl('', [Validators.required, Validators.email]),

      // Telefone de contato
      telefone: new FormControl('', [Validators.required]),
    });
  }

  /**
   * verificarEdicao() [PRIVATE]
   * 
   * PROPÓSITO: Detectar se é novo cliente ou edição
   * 
   * LÓGICA:
   * 1. this.route.params = Observable dos parâmetros da rota
   * 2. subscribe() = detecta mudanças na rota
   * 3. Verifica se existe parâmetro 'id' na URL
   * 
   * CASOS:
   * - URL: /cliente/novo → id = 'novo' → modo NOVO
   * - URL: /cliente/123 → id = '123' → modo EDIÇÃO
   * - URL: /cliente → sem :id → modo NOVO (não acontece)
   * 
   * AÇÕES:
   * - NOVO: btnText = 'Cadastrar'
   * - EDIÇÃO: btnText = 'Alterar', carrega dados
   */
  private verificarEdicao(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];

      // Se tem ID e não é a string 'novo' = é um UUID real
      if (id && id !== 'novo') {
        // Modo EDIÇÃO
        this.btnText.set('Alterar');
        this.carregarCliente(id);
      } else {
        // Modo NOVO
        this.btnText.set('Cadastrar');
      }
    });
  }

  /**
   * carregarCliente(id: string) [PRIVATE]
   * 
   * PROPÓSITO: Buscar dados do cliente na API e preencher formulário
   * 
   * PARÂMETRO:
   * - id: string = ID do cliente a carregar (UUID)
   * 
   * FLUXO DETALHADO:
   * 1. Ativa indicador de carregamento: isLoading = true
   * 2. Chama API: getCliente(id)
   * 3. Espera resposta:
   *    - SUCESSO:
   *      * patchValue() = preenche campos com dados
   *      * isLoading = false
   *      * Log de debug
   *    - ERRO:
   *      * Log de erro
   *      * isLoading = false
   *      * Alerta ao usuário
   *      * Redireciona para /cliente (voltar à lista)
   * 
   * Por que patchValue()?
   * - Preenche ALGUNS campos (não todos precisam ser obrigatórios)
   * - setValue() exigiria TODOS os campos (mais rígido)
   * 
   * EXEMPLO:
   * Cliente retornado: {
   *   id: '123',
   *   razaoSocial: 'Google LLC',
   *   nomeFantasia: 'Google',
   *   ...
   * }
   * Resultado: todos campos pré-preenchidos no formulário
   */
  private carregarCliente(id: string): void {
    this.isLoading.set(true);
    this.clienteService.getCliente(id).subscribe({
      next: (cliente) => {
        // Sucesso: preencheu os dados
        this.clienteForm.patchValue(cliente);
        this.isLoading.set(false);
        console.log('Cliente carregado:', cliente);
      },
      error: (err) => {
        // Erro: não conseguiu carregar
        console.error('Erro ao carregar cliente:', err);
        this.isLoading.set(false);
        alert('Erro ao carregar cliente');
        // Volta para lista de clientes
        this.router.navigate(['/cliente']);
      }
    });
  }

  /**
   * submit()
   * 
   * PROPÓSITO: Enviar formulário (criar ou atualizar cliente)
   * Trigger: Click no botão "Cadastrar" ou "Alterar"
   * 
   * FLUXO DETALHADO:
   * 
   * **PASSO 1: Marcar como submetido**
   * - formSubmitted = true
   * - Permite mostrar erros de validação no template
   * 
   * **PASSO 2: Validar formulário**
   * - if (!clienteForm.valid) = se algo está errado
   *   * camposPreenchidos = false
   *   * Mostra mensagem de erro
   *   * Retorna (cancela)
   * 
   * **PASSO 3: Preparar requisição**
   * - isLoading = true (desabilita botão)
   * - Detecta modo: tem ID preenchido = edição, senão = novo
   * - Escolhe operação: updateCliente() ou addCliente()
   * 
   * **PASSO 4: Enviar à API**
   * - Subscribe na resposta:
   *   * SUCESSO:
   *     - Log
   *     - isLoading = false
   *     - Alerta de sucesso
   *     - Redireciona para /cliente
   *   * ERRO:
   *     - Log de erro
   *     - isLoading = false
   *     - Alerta de erro
   * 
   * VALIDAÇÃO:
   * - Email: deve ter @ e domínio
   * - Obrigatórios: não pode ser vazio
   * - Composto: por 7 campos = deve validar cada um
   * 
   * EXEMPLO 1 - NOVO:
   * dados = { id: '', razaoSocial: 'Google', ... }
   * Vai para POST /clientes/cadastrar
   * 
   * EXEMPLO 2 - EDIÇÃO:
   * dados = { id: '123', razaoSocial: 'Google LLC', ... }
   * Vai para PUT /clientes/123
   */
  submit(): void {
    // PASSO 1: Marca que já tentou enviar
    this.formSubmitted.set(true);

    // PASSO 2: Valida formulário inteiro
    if (!this.clienteForm.valid) {
      // Formulário inválido
      this.camposPreenchidos.set(false);
      console.log('Formulário inválido');
      return; // Cancela
    }

    // PASSO 3: Está carregando (desabilita botão)
    this.isLoading.set(true);
    
    // Verifica se é edição ou novo
    // Se tem ID preenchido = edição, senão = novo
    const isEdicao = !!this.clienteForm.get('id')?.value;
    
    // Escolhe qual requisição fazer
    const operacao = isEdicao
      ? this.clienteService.updateCliente(this.clienteForm.value) // PUT
      : this.clienteService.addCliente(this.clienteForm.value);    // POST

    // PASSO 4: Envia à API
    operacao.subscribe({
      next: (res) => {
        // Sucesso!
        console.log('Sucesso!', res);
        this.isLoading.set(false);
        // Alerta personalizado conforme o modo
        alert(isEdicao ? 'Cliente alterado com sucesso!' : 'Cliente cadastrado com sucesso!');
        // Redireciona para lista de clientes
        this.router.navigate(['/cliente']);
      },
      error: (err) => {
        // Erro na requisição
        console.error('Erro ao salvar:', err);
        this.isLoading.set(false);
        alert('Erro ao salvar cliente');
      }
    });
  }

  /**
   * GETTERS PARA VALIDAÇÃO NO TEMPLATE
   * 
   * Esses getters facilitam acessar cada campo do formulário no template
   * Usados para:
   * - Verificar se campo é inválido
   * - Verificar se campo foi tocado
   * - Exibir mensagens de erro específicas
   * 
   * PADRÃO:
   * get nomeDoControle() {
   *   return this.clienteForm.get('nomeDoControle');
   * }
   * 
   * USO NO TEMPLATE:
   * @if (razaoSocial?.invalid && razaoSocial?.touched) {
   *   <p>Razão social é obrigatória.</p>
   * }
   * 
   * PROPRIEDADES DE FormControl:
   * - .invalid = se tem erro de validação
   * - .touched = se usuário já interagiu com o campo
   * - .hasError('required') = se erro específico é "obrigatório"
   * - .hasError('email') = se erro específico é "email inválido"
   */
  
  // Razão Social
  get razaoSocial() {
    return this.clienteForm.get('razaoSocial');
  }

  // Nome Fantasia
  get nomeFantasia() {
    return this.clienteForm.get('nomeFantasia');
  }

  // CNPJ
  get cnpj() {
    return this.clienteForm.get('cnpj');
  }

  // Endereço
  get endereco() {
    return this.clienteForm.get('endereco');
  }

  // Email
  get email() {
    return this.clienteForm.get('email');
  }

  // Telefone
  get telefone() {
    return this.clienteForm.get('telefone');
  }
}
