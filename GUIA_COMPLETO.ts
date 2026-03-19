/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GUIA COMPLETO: CADASTRO DE CLIENTES - ANGULAR 21
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * DESCRIÇÃO GERAL DO PROJETO:
 *
 * Aplicação web para gerenciamento de clientes (CRUD - Create, Read, Update, Delete).
 * Desenvolvida em Angular 21 com componentes standalone e signals para reatividade.
 *
 * FUNCIONALIDADES PRINCIPAIS:
 * ✓ Listar todos os clientes em tabela
 * ✓ Buscar/filtrar clientes em tempo real
 * ✓ Cadastrar novo cliente (POST)
 * ✓ Editar cliente existente (PUT)
 * ✓ Deletar cliente (DELETE)
 * ✓ Validação de formulário
 * ✓ Navegação entre páginas
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARQUITETURA DO PROJETO
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Estrutura de pastas:
 *
 * src/
 * ├─ main.ts                 → Arquivo de inicialização (bootstrap)
 * ├─ app/
 * │  ├─ app.ts              → Componente raiz
 * │  ├─ app.html            → Template do layout principal
 * │  ├─ app.css             → Estilos do layout
 * │  ├─ app.routes.ts       → Definição de rotas da aplicação
 * │  ├─ app.config.ts       → Configuração de providers globais
 * │  │
 * │  ├─ interface/
 * │  │  └─ Cliente.ts       → Interface TypeScript do Cliente
 * │  │
 * │  ├─ services/
 * │  │  └─ cliente-service.ts → Serviço para API de clientes
 * │  │
 * │  └─ components/
 * │     ├─ header/
 * │     │  ├─ header.ts     → Componente de navegação
 * │     │  └─ header.html
 * │     ├─ footer/
 * │     │  ├─ footer.ts     → Componente de rodapé
 * │     │  └─ footer.html
 * │     ├─ pages/
 * │     │  ├─ home/         → Página inicial
 * │     │  └─ about/        → Página sobre
 * │     └─ cliente/
 * │        ├─ client-comp/  → Lista de clientes
 * │        │  ├─ client-comp.ts
 * │        │  ├─ client-comp.html
 * │        │  └─ client-comp.css
 * │        └─ cliente-form/  → Formulário (novo/editar)
 * │           ├─ cliente-form.ts
 * │           ├─ cliente-form.html
 * │           └─ cliente-form.css
 * │
 * └─ environments/
 *    ├─ environment.ts       → Configuração desenvolvimento
 *    └─ environment.prod.ts  → Configuração produção
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * FLUXO DE USUÁRIO (Casos de Uso)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * CASO 1: LISTAR CLIENTES
 * ─────────────────────────
 * 1. Usuário acessa http://localhost:4200/cliente
 * 2. Componente ClientComp é renderizado
 * 3. ngOnInit() chamada → carregarClientes()
 * 4. Requisição GET /clientes/listar
 * 5. API retorna array de clientes
 * 6. Tabela é preenchida e exibida
 * 7. Usuário vê lista de todos os clientes
 *
 * CASO 2: FILTRAR CLIENTES
 * ──────────────────────────
 * 1. Usuário digita no campo "Buscar cliente"
 * 2. Evento (input)="search($event)" é disparo
 * 3. Método search() é executado
 * 4. Filtra clienteLista() pelo termo digitado
 * 5. Resultado salvo em clienteListaFiltrado
 * 6. Tabela re-renderiza mostrando apenas filtrados
 * 7. Zero código de chamadas HTTP (filtro é local)
 *
 * CASO 3: CADASTRAR NOVO CLIENTE
 * ──────────────────────────────────
 * 1. Usuário clica "Cadastrar Novo Cliente"
 * 2. Navega para /cliente/novo
 * 3. ClienteForm é renderizado
 * 4. verificarEdicao() detecta URL /novo
 * 5. Formulário inicializa vazio
 * 6. Botão exibe "Cadastrar"
 * 7. Usuário preenche formulário
 * 8. Clica "Cadastrar"
 * 9. submit() valida e envia POST /clientes/cadastrar
 * 10. API cria cliente e retorna com ID
 * 11. Mensagem de sucesso
 * 12. Redireciona para /cliente
 *
 * CASO 4: EDITAR CLIENTE EXISTENTE
 * ─────────────────────────────────────
 * 1. Usuário vê tabela de clientes
 * 2. Clica "Alterar" em uma linha
 * 3. Navega para /cliente/{id}
 * 4. ClienteForm é renderizado
 * 5. verificarEdicao() detecta ID = edição
 * 6. carregarCliente(id) busca dados
 * 7. API retorna cliente
 * 8. patchValue() preenche formulário
 * 9. Botão exibe "Alterar"
 * 10. Usuário altera dados
 * 11. Clica "Alterar"
 * 12. submit() envia PUT /clientes/{id}
 * 13. API atualiza cliente
 * 14. Mensagem de sucesso
 * 15. Redireciona para /cliente
 *
 * CASO 5: DELETAR CLIENTE
 * ──────────────────────────
 * 1. Usuário vê tabela
 * 2. Clica "Excluir" em uma linha
 * 3. Diálogo de confirmação: "Tem certeza?"
 * 4. Se OK:
 *    - excluirCliente(id) é executado
 *    - Requisição DELETE /clientes/{id}
 *    - API deleta cliente
 *    - carregarClientes() atualiza tabela
 * 5. Se Cancelar:
 *    - Nada acontece
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ROTAS E NAVEGAÇÃO
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * DEFINIDAS EM: src/app/app.routes.ts
 *
 * Rota             │ Componente      │ Propósito
 * ─────────────────┼─────────────────┼─────────────────────────────────────
 * /                │ Home            │ Página inicial
 * /about           │ About           │ Página sobre a empresa
 * /cliente         │ ClientComp      │ Lista de clientes
 * /cliente/novo    │ ClienteForm     │ Cadastrar novo cliente
 * /cliente/:id     │ ClienteForm     │ Editar cliente existente
 *
 * DETALHES:
 * - "/" = home page
 * - "/about" = página informativa
 * - "/cliente" = rota PAI com ROTAS FILHAS (children routes)
 *   └─ "" = lista de clientes (ClientComp)
 *   └─ "novo" = formulário vazio (ClienteForm)
 *   └─ ":id" = formulário para editar (ClienteForm)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPONENTES PRINCIPAIS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 1. APP (src/app/app.ts)
 *    ├─ Tipo: Componente raiz
 *    ├─ Seletor: <app-root>
 *    ├─ Responsabilidades:
 *    │  ├─ Layout geral da página
 *    │  ├─ Renderizar Header
 *    │  ├─ Renderizar Footer
 *    │  └─ Renderizar <router-outlet> (componentes das rotas)
 *    └─ Signals: title (nome da aplicação)
 *
 * 2. HEADER (src/app/components/header/header.ts)
 *    ├─ Tipo: Componente de navegação
 *    ├─ Seletor: <app-header>
 *    ├─ Responsabilidades:
 *    │  ├─ Menu de navegação
 *    │  ├─ Links para Home, Clientes, About
 *    │  └─ Branding/logo
 *    └─ Lógica: Nenhuma (apenas template)
 *
 * 3. FOOTER (src/app/components/footer/footer.ts)
 *    ├─ Tipo: Componente de rodapé
 *    ├─ Seletor: <app-footer>
 *    ├─ Responsabilidades:
 *    │  ├─ Informações de rodapé
 *    │  ├─ Copyright
 *    │  └─ Links úteis
 *    └─ Lógica: Nenhuma (apenas template estático)
 *
 * 4. HOME (src/app/components/pages/home/home.ts)
 *    ├─ Tipo: Componente de página
 *    ├─ Seletor: <app-home>
 *    ├─ Responsabilidades:
 *    │  ├─ Página inicial da aplicação
 *    │  └─ Boas-vindas
 *    └─ Lógica: Nenhuma (apenas template)
 *
 * 5. ABOUT (src/app/components/pages/about/about.ts)
 *    ├─ Tipo: Componente de página
 *    ├─ Seletor: <app-about>
 *    ├─ Responsabilidades:
 *    │  ├─ Página sobre a empresa
 *    │  ├─ Informações institucionais
 *    │  └─ Contato
 *    └─ Lógica: Nenhuma (apenas template)
 *
 * 6. ClientComp (src/app/components/cliente/client-comp/client-comp.ts)
 *    ├─ Tipo: Componente inteligente (Smart Component)
 *    ├─ Seletor: <app-client-comp>
 *    ├─ Responsabilidades:
 *    │  ├─ Exibir lista de clientes em tabela
 *    │  ├─ Buscar/filtrar clientes em tempo real
 *    │  ├─ Providenciar botão "Novo Cliente"
 *    │  ├─ Providenciar links "Alterar"
 *    │  ├─ Providenciar botão "Excluir" com confirmação
 *    │  └─ Gerenciar estado da lista
 *    ├─ Signals:
 *    │  ├─ clienteLista[] = todos os clientes (completo)
 *    │  ├─ clienteListaFiltrado[] = clientes após filtro
 *    │  └─ searchTerm = termo de busca digitado
 *    ├─ Métodos:
 *    │  ├─ carregarClientes() = GET /clientes/listar
 *    │  ├─ search(event) = filtrar localmente
 *    │  └─ excluirCliente(id) = DELETE /clientes/{id}
 *    └─ Ciclo de vida: ngOnInit → carregarClientes()
 *
 * 7. ClienteForm (src/app/components/cliente/cliente-form/cliente-form.ts)
 *    ├─ Tipo: Componente inteligente (Smart Component)
 *    ├─ Seletor: <app-cliente-form>
 *    ├─ Responsabilidades:
 *    │  ├─ Renderizar formulário
 *    │  ├─ Validar campos
 *    │  ├─ Novo vs Editar (detectar automaticamente)
 *    │  ├─ Carrega dados para edição
 *    │  └─ Enviar dados à API
 *    ├─ Signals:
 *    │  ├─ btnText = texto do botão (Cadastrar vs Alterar)
 *    │  ├─ formSubmitted = se formulário foi enviado
 *    │  ├─ camposPreenchidos = estado de validação
 *    │  └─ isLoading = se requisição está em andamento
 *    ├─ FormGroup: clienteForm (7 campos)
 *    ├─ Métodos:
 *    │  ├─ inicializarFormulario() = criar FormGroup
 *    │  ├─ verificarEdicao() = detectar novo ou edição
 *    │  ├─ carregarCliente(id) = GET /clientes/{id}
 *    │  └─ submit() = POST ou PUT conforme o modo
 *    ├─ Getters: Para acessar campos no template
 *    │  ├─ razaoSocial
 *    │  ├─ nomeFantasia
 *    │  ├─ cnpj
 *    │  ├─ endereco
 *    │  ├─ email
 *    │  └─ telefone
 *    └─ Ciclo de vida:
 *       ngOnInit → inicializarFormulario() + verificarEdicao()
 *       → detecta novo ou edição
 *       → se edição, carrega dados
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * SERVIÇO: ClienteService
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ARQUIVO: src/app/services/cliente-service.ts
 * TIPO: Service (Injectable)
 * PROPÓSITO: Centralizar comunicação com API
 *
 * PROPRIEDADES:
 * - baseApiUrl: URL da API (http://localhost:8080)
 * - apiUrl: Endpoint de clientes (http://localhost:8080/clientes)
 *
 * MÉTODOS:
 *
 * 1. getClientes(): Observable<Cliente[]>
 *    └─ GET /clientes/listar
 *    └─ Retorna: todos os clientes
 *    └─ Usado em: ClientComp.carregarClientes()
 *
 * 2. getCliente(id: string): Observable<Cliente>
 *    └─ GET /clientes/{id}
 *    └─ Parâmetro: ID único do cliente
 *    └─ Retorna: um cliente específico
 *    └─ Usado em: ClienteForm.carregarCliente()
 *
 * 3. addCliente(cliente: Cliente): Observable<Cliente>
 *    └─ POST /clientes/cadastrar
 *    └─ Parâmetro: objeto Cliente (sem ID)
 *    └─ Retorna: cliente criado (com ID)
 *    └─ Usado em: ClienteForm.submit() (modo novo)
 *
 * 4. updateCliente(cliente: Cliente): Observable<Cliente>
 *    └─ PUT /clientes/{id}
 *    └─ Parâmetro: objeto Cliente (com ID)
 *    └─ Retorna: cliente atualizado
 *    └─ Usado em: ClienteForm.submit() (modo edição)
 *
 * 5. removeCliente(id: string): Observable<void>
 *    └─ DELETE /clientes/{id}
 *    └─ Parâmetro: ID do cliente a deletar
 *    └─ Retorna: void
 *    └─ Usado em: ClientComp.excluirCliente()
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTERFACE: Cliente
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ARQUIVO: src/app/interface/Cliente.ts
 * DESCRIÇÃO: Tipagem TypeScript do objeto Cliente
 *
 * PROPRIEDADES:
 *
 * export interface Cliente {
 *   id: string;              ← UUID (ex: 550e8400-e29b-41d4-a716-446655440000)
 *   razaoSocial: string;     ← Denominação legal da empresa
 *   nomeFantasia: string;    ← Nome comercial
 *   cnpj: string;            ← Cadastro fiscal (14 dígitos)
 *   endereco: string;        ← Endereço completo
 *   email: string;           ← Email de contato
 *   telefone: string;        ← Telefone de contato
 * }
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * PADRÕES ANGULAR 21 USADOS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 1. STANDALONE COMPONENTS
 *    └─ Todos os componentes usam standalone: true
 *    └─ Sem NgModule tradicional
 *    └─ Mais moderno e simples
 *
 * 2. SIGNALS
 *    └─ Reatividade moderna do Angular 21
 *    └─ Substitui propriedades simples
 *    └─ Melhora performance com change detection automático
 *    └─ Syntax: signal<Tipo>(valor) → leitura com ()
 *
 * 3. REACTIVE FORMS
 *    └─ FormGroup, FormControl, Validators
 *    └─ [formGroup] no template
 *    └─ formControlName em inputs
 *    └─ Validação programática e reativa
 *
 * 4. ROUTING MODULAR
 *    └─ Routes com children (rotas aninhadas)
 *    └─ <router-outlet> para renderizar componentes
 *    └─ routerLink para navegação
 *
 * 5. NOVA SINTAXE DE TEMPLATES (@if, @for)
 *    └─ @if em vez de *ngIf
 *    └─ @for em vez de *ngFor
 *    └─ @empty para lista vazia
 *    └─ Mais  legível e performático
 *
 * 6. DEPENDENCY INJECTION
 *    └─ Injetar serviços via constructor
 *    └─ providedIn: 'root' para singletons globais
 *    └─ Desacoplamento e testabilidade
 *
 * 7. OBSERVABLES E PROMISES
 *    └─ RxJS Observables para requisições assíncronas
 *    └─ subscribe() para se inscrever em fluxos de dados
 *    └─ next, error para tratamento
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * VALIDAÇÃO DE FORMULÁRIO
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * VALIDADORES UTILIZADOS:
 *
 * 1. Validators.required
 *    └─ Campo não pode estar vazio
 *    └─ Aplicado em: todos os campos
 *    └─ Mensagem: "[campo] é obrigatório."
 *
 * 2. Validators.email
 *    └─ Email deve ter formato válido (contém @, domínio)
 *    └─ Aplicado em: email
 *    └─ Mensagem: "Email inválido. Use formato: user@example.com"
 *
 * TRATAMENTO DE ERROS NO TEMPLATE:
 *
 * @if (nomeDoControle?.invalid && nomeDoControle?.touched) {
 *   ├─ .invalid = tem erro de validação
 *   ├─ .touched = usuário interagiu com o campo
 *   └─ Mostrar erro APENAS depois que usuário interage
 *
 * @if (nomeDoControle?.hasError('required')) {
 *   └─ Verifica tipo específico de erro
 *
 * @if (!camposPreenchidos()) {
 *   └─ Mensagem geral quando formulário inteiro é inválido
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * EVENTOS E LIGAÇÕES DE DADOS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * EVENT BINDING:
 * (input)="search($event)"     ← Disparado a cada digitação
 * (click)="excluirCliente(id)" ← Disparado ao clicar
 * (ngSubmit)="submit()"        ← Disparado ao enviar formulário
 *
 * PROPERTY BINDING:
 * [formGroup]="clienteForm"    ← Vincula FormGroup
 * [value]="btnText()"          ← Valor dinâmico do sinal
 * [disabled]="isLoading()"     ← Desabilita durante requisição
 * [state]="obj"                ← Passa dados para navegação
 *
 * INTERPOLATION:
 * {{ cliente.razaoSocial }}    ← Mostra valor do sinal
 * {{ btnText() }}              ← Chama função sinal para reatividade
 *
 * TWO-WAY BINDING:
 * [(ngModel)]="var"            ← Não usado neste projeto
 *                              ← Reactive Forms é preferível
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * FLUXO DE DADOS (DATA FLOW)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * NOVO CLIENTE:
 * ─────────────
 * User Click "Cadastrar"
 *    ↓
 * /cliente/novo (ClienteForm)
 *    ↓
 * verificarEdicao() → modo NOVO
 *    ↓
 * Formulário vazio, "Cadastrar" button
 *    ↓
 * User preenche e clica "Cadastrar"
 *    ↓
 * submit() → validação OK
 *    ↓
 * POST /clientes/cadastrar
 *    ↓
 * API cria e retorna Cliente com ID
 *    ↓
 * Alerta "Cadastrado com sucesso"
 *    ↓
 * Navigate /cliente
 *    ↓
 * ClientComp carrega lista atualizada
 *
 * EDITAR CLIENTE:
 * ───────────────
 * User vê lista e clica "Alterar"
 *    ↓
 * /cliente/{id} (ClienteForm)
 *    ↓
 * verificarEdicao() → modo EDIÇÃO
 *    ↓
 * carregarCliente(id)
 *    ↓
 * GET /clientes/{id}
 *    ↓
 * API retorna Cliente
 *    ↓
 * patchValue() preenche formulário
 *    ↓
 * "Alterar" button
 *    ↓
 * User altera e clica "Alterar"
 *    ↓
 * submit() → validação OK
 *    ↓
 * PUT /clientes/{id}
 *    ↓
 * API atualiza
 *    ↓
 * Alerta "Alterado com sucesso"
 *    ↓
 * Navigate /cliente
 *    ↓
 * ClientComp carrega lista atualizada
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * DICAS PARA APRENDIZADO E REAPROVEITAMENTO
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * 1. ENTENDER SIGNALS
 *    └─ Leia: cliente-form.ts (usa sinal btnText, formSubmitted, etc)
 *    └─ Observe: como re-renderizam quando .set() é chamado
 *    └─ Experimente: adicionar novo sinal com signal<Tipo>()
 *
 * 2. ENTENDER REACTIVE FORMS
 *    └─ Leia: cliente-form.ts método submit()
 *    └─ Observe: FormGroup, FormControl, Validators
 *    └─ Experimente: adicionar novo validador customizado
 *
 * 3. ENTENDER ROUTING COM CHILDREN
 *    └─ Leia: app.routes.ts (rota 'cliente' com children)
 *    └─ Observe: como mesma rota pai com URLs filhas diferentes
 *    └─ Experimente: adicionar outra rota filha
 *
 * 4. ENTENDER OBSERVABLES
 *    └─ Leia: cliente-service.ts (métodos retornam Observable)
 *    └─ Observe: subscribe(next, error) nos componentes
 *    └─ Experimente: adicionar operador map() ou filter()
 *
 * 5. COPIAR/ADAPTAR PADRÕES
 *    └─ Novo formulário? Copie ClienteForm e adapte campos
 *    └─ Novo CRUD? Copie ClientComp + ClienteForm + Service
 *    └─ Nova página? Copie Home ou About como template
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */
