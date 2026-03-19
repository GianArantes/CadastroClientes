# 📋 CADASTRO DE CLIENTES - ANGULAR 21

Aplicação web moderna para gerenciamento completo de clientes (CRUD) desenvolvida com **Angular 21**, **Signals** e **Standalone Components**.

---

## 🎯 Funcionalidades Principais

✅ **Listar Clientes** - Visualize todos os clientes em tabela responsiva  
✅ **Buscar/Filtrar** - Filtragem em tempo real sem recarregar  
✅ **Cadastrar** - Adicionar novo cliente com validação automática  
✅ **Editar** - Modificar dados existentes com pré-preenchimento  
✅ **Deletar** - Remover cliente com confirmação de segurança  
✅ **Validação** - Campos obrigatórios e validação de email  
✅ **Navegação** - Menu simples entre Home, Clientes e About  

---

## 🏗️ Arquitetura e Estrutura

```
src/
├── main.ts                          (Bootstrap da aplicação)
├── app/
│   ├── app.ts                       (Componente raiz)
│   ├── app.html                     (Layout principal)
│   ├── app.css                      (Estilos globais)
│   ├── app.routes.ts                (Definição de rotas)
│   ├── app.config.ts                (Providers e configuração)
│   │
│   ├── interface/
│   │   └── Cliente.ts               (Interface TypeScript)
│   │
│   ├── services/
│   │   └── cliente-service.ts       (API HTTP)
│   │
│   └── components/
│       ├── header/                  (Navegação)
│       ├── footer/                  (Rodapé)
│       ├── pages/
│       │   ├── home/                (Página inicial)
│       │   └── about/               (Sobre a empresa)
│       └── cliente/
│           ├── client-comp/         (Lista de clientes)
│           └── cliente-form/        (Novo/Editar cliente)
│
└── environments/
    ├── environment.ts               (Desenvolvimento)
    └── environment.prod.ts          (Produção)
```

---

## 🛣️ Sistema de Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | Home | Página inicial |
| `/about` | About | Informações sobre a empresa |
| `/cliente` | ClientComp | Lista de clientes |
| `/cliente/novo` | ClienteForm | Cadastrar novo cliente |
| `/cliente/:id` | ClienteForm | Editar cliente existente |

**Nota:** A rota `/cliente` é uma rota PAI com rotas FILHAS, permitindo reutilizar `<router-outlet>` e manter layout consistente.

---

## 💾 Fluxo de Dados

### 1️⃣ Listar Clientes
```
ClientComp ngOnInit()
    ↓
carregarClientes()
    ↓
ClienteService.getClientes()
    ↓
GET /clientes/listar
    ↓
Tabela preenchida com resposta
```

### 2️⃣ Filtrar Clientes (Local)
```
User digita no input "Buscar"
    ↓
search($event) é chamado
    ↓
Filtra señal clienteLista() localmente
    ↓
clienteListaFiltrado atualizado
    ↓
Tabela re-renderiza (sem HTTP)
```

### 3️⃣ Cadastrar Cliente
```
/cliente/novo
    ↓
ClienteForm detecta modo NOVO
    ↓
Formulário vazio
    ↓
User preenche e clica "Cadastrar"
    ↓
POST /clientes/cadastrar
    ↓
API cria cliente (retorna com ID)
    ↓
Navigate /cliente
    ↓
Lista atualizada automáticamente
```

### 4️⃣ Editar Cliente
```
Click "Alterar" na tabela
    ↓
/cliente/{id}
    ↓
ClienteForm detecta modo EDIÇÃO
    ↓
GET /clientes/{id}
    ↓
patchValue() preenche formulário
    ↓
User altera e clica "Alterar"
    ↓
PUT /clientes/{id}
    ↓
API atualiza
    ↓
Navigate /cliente
    ↓
Lista atualizada
```

### 5️⃣ Deletar Cliente
```
Click "Excluir" na tabela
    ↓
Diálogo de confirmação
    ↓
Se OK:
  DELETE /clientes/{id}
    ↓
  carregarClientes() atualiza lista
```

---

## 🔧 Componentes Principais

### **App Component** (`app.ts`)
- Componente raiz da aplicação
- Renderiza Header, Footer e <router-outlet>
- Standalone: true

### **ClientComp** (`components/cliente/client-comp/`)
- Exibe tabela com TODOS os clientes
- Implementa filtro/busca em tempo real
- Botões: "Novo Cliente", "Alterar", "Excluir"
- **Signals:** clienteLista, clienteListaFiltrado, searchTerm
- **Métodos:**
  - `carregarClientes()`
  - `search(event)`
  - `excluirCliente(id)`

### **ClienteForm** (`components/cliente/cliente-form/`)
- Formulário REUTILIZÁVEL para novo e editar
- Detecta automaticamente modo (novo vs edição)
- **Signals:** btnText, formSubmitted, camposPreenchidos, isLoading
- **FormGroup:** 7 campos validados (Razão Social, Nome Fantasia, CNPJ, Endereço, Email, Telefone)
- **Métodos:**
  - `inicializarFormulario()`
  - `verificarEdicao()`
  - `carregarCliente(id)`
  - `submit()`

### **Header, Footer, Home, About**
- Componentes simples (templates apenas, pouca lógica)
- Reutilizáveis em qualquer projeto Angular

---

## 🔌 Serviço: ClienteService

Centraliza toda comunicação com API HTTP.

```typescript
// Métodos do serviço:

getClientes(): Observable<Cliente[]>
// GET /clientes/listar → retorna array de todos

getCliente(id: string): Observable<Cliente>
// GET /clientes/{id} → retorna um cliente

addCliente(cliente: Cliente): Observable<Cliente>
// POST /clientes/cadastrar → cria novo, retorna com ID

updateCliente(cliente: Cliente): Observable<Cliente>
// PUT /clientes/{id} → atualiza cliente existente

removeCliente(id: string): Observable<void>
// DELETE /clientes/{id} → deleta cliente
```

---

## 📊 Interface: Cliente

```typescript
export interface Cliente {
  id: string;              // UUID (ex: 550e8400-e29b-41d4-a716-446655440000)
  razaoSocial: string;     // Nome legal da empresa (obrigatório)
  nomeFantasia: string;    // Nome comercial (obrigatório)
  cnpj: string;            // CNPJ 14 dígitos (obrigatório)
  endereco: string;        // Endereço completo (obrigatório)
  email: string;           // Email válido (obrigatório, validado)
  telefone: string;        // Telefone de contato (obrigatório)
}
```

---

## ✔️ Validação de Formulário

| Campo | Validadores | Mensagem |
|-------|---------|----------|
| Razão Social | required | "Razão Social is required." |
| Nome Fantasia | required | "Nome Fantasia is required." |
| CNPJ | required | "CNPJ is required." |
| Endereço | required | "Endereço is required." |
| Email | required, email | "Email is required." / "Email inválido..." |
| Telefone | required | "Telefone is required." |

**Validação híbrida:**
- Campo individual: mostra erro quando `invalid && touched`
- Geral: desabilita botão quando `!camposPreenchidos()`

---

## 🎨 Padrões Angular 21 Utilizados

### 1. **Standalone Components**
Todos os componentes usam `standalone: true` - sem NgModules tradicionais, mais moderno e simples.

### 2. **Signals**
Reatividade moderna substituindo propriedades simples:
```typescript
clienteLista = signal<Cliente[]>([]);
searchTerm = signal('');
btnText = signal('Cadastrar');

// Leitura: clienteLista() ou {{ clienteLista() }}
// Escrita: clienteLista.set([...]) ou clienteLista.update(...)
```

### 3. **Reactive Forms**
FormGroup + FormControl + Validators:
```typescript
clienteForm = new FormGroup({
  razaoSocial: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  // ...
});

// Template: [formGroup]="clienteForm", formControlName="razaoSocial"
```

### 4. **Nova Sintaxe de Control Flow**
Mais legível que `*ngIf` e `*ngFor`:
```html
@if (clienteLista().length > 0) {
  <table>
    @for (cliente of clienteListaFiltrado(); track cliente.id) {
      <tr>...{{ cliente.razaoSocial }}</tr>
    }
  </table>
}
@empty {
  <p>Nenhum cliente encontrado</p>
}
```

### 5. **Routing com Children (Rotas Aninhadas)**
Rota pai `/cliente` com filhas `novo` e `:id` para máxima reutilização.

### 6. **Dependency Injection**
Serviços injetados no constructor com `providedIn: 'root'`.

### 7. **Observables (RxJS)**
Para requisições HTTP assíncronas:
```typescript
this.service.getClientes().subscribe({
  next: (clientes) => { /* sucesso */ },
  error: (err) => { /* erro */ }
});
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- npm 9+
- Angular CLI 21+
- API backend rodando em `http://localhost:8080`

### Instalação e Execução
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Executar testes
npm test

# Build para produção
npm run build
```

Acesse: `http://localhost:4200`

---

## 🔗 Configuração da API

A URL base da API está definida em:
- **Desenvolvimento:** `src/environments/environment.ts`
- **Produção:** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  baseApiUrl: 'http://localhost:8080'
};
```

Se sua API está em outro endereço, atualize esses arquivos antes do build.

---

## 💡 Dicas para Aprendizado e Reaproveitamento

### 📚 Estudar Signals
Leia `cliente-form.ts` para ver signals em ação:
- `btnText`, `formSubmitted`, `camposPreenchidos`, `isLoading`
- Como usar `.set()` para atualizar
- Como chamar com `()` no template para reatividade

### 📚 Copiar Padrão de Formulário
Para criar outro formulário:
1. Copie `ClienteForm`
2. Adapte os campo e validadores
3. Mantenha a mesma estrutura ngOnInit/submit

### 📚 Copiar Padrão de Lista
Para criar outra lista:
1. Copie `ClientComp`
2. Adapte nomes de signals
3. Mude o endpoint do service

### 📚 Entender Reactive Forms
Estude:
- FormGroup + FormControl (no `.ts`)
- [formGroup], formControlName (no `.html`)
- Validadores customizados com Validators

### 📚 Entender Routing com Children
Estude `app.routes.ts`:
- Rota pai `/cliente` com children: novo, :id
- Como ` <router-outlet>` renderiza filha

---

## 🐛 Debugging e Testes

### Console Logs
Todos os componentes e serviços têm `console.log()` estratégicos:
```typescript
// ClienteService
console.log('Requisição:', 'GET /clientes/listar');
console.log('Resposta:', clientes);

// ClientComp
console.log('Clientes carregados:', this.clienteLista());

// ClienteForm
console.log('Modo:', this.mode); // 'novo' ou 'edição'
```

### Verificar State da Navegação
```typescript
// No cliente-form.ts:
console.log(window.history.state); // Ver dados passados
```

### Verificar FormGroup
```typescript
console.log(this.clienteForm.value); // Ver valores
console.log(this.clienteForm.status); // 'VALID' ou 'INVALID'
```

---

## 📝 Licença e Créditos

Projeto educacional desenvolvido com Angular 21.2.0, @angular/forms, @angular/router, @angular/common/http.

Bootstrap 5.3.8 para estilos.

---

## ✉️ Suporte

Para dúvidas sobre o código:
1. Consulte os comentários detalhados em cada arquivo
2. Revise `GUIA_COMPLETO.ts` para overview
3. Procure exemplos de código em arquivos similares

---

**Última atualização:** 2024  
**Versão Angular:** 21.2.0  
**Status:** ✅ Totalmente comentado e documentado
