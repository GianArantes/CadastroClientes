import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClienteService } from '../../../services/cliente-service';

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

  btnText = signal('Cadastrar');


  formSubmitted = signal(false);


  camposPreenchidos = signal(true);


  isLoading = signal(false);


  clienteForm!: FormGroup;
  mensagemErroGlobal = signal<string | null>(null);

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarEdicao();
  }


  private inicializarFormulario(): void {
    this.clienteForm = new FormGroup({

      id: new FormControl(''),
      razaoSocial: new FormControl('', [Validators.required]),
      nomeFantasia: new FormControl('', [Validators.required]),
      cnpj: new FormControl('', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]),
      ie: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      endereco: new FormControl('', [Validators.required]),
      abertura: new FormControl('', [Validators.required, this.dataValida]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telefone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
    });
  }

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


  private carregarCliente(id: string): void {
    this.isLoading.set(true);
    this.clienteService.getCliente(id).subscribe({
      next: (cliente) => {
        // Sucesso: preencheu os dados
        // Mapeia 'dataFundacao' da API para 'abertura' do formulário
        const clienteMapeado = {
          ...cliente,
          abertura: cliente.abertura || cliente.abertura
        };
        this.clienteForm.patchValue(clienteMapeado);
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


  submit(): void {

    this.formSubmitted.set(true);


    if (!this.clienteForm.valid) {
      this.camposPreenchidos.set(false);
      console.log('Formulário inválido. Campos:', this.clienteForm.value);
      console.log('Erros de validação:', this.getFormValidationErrors());
      return; // Cancela
    }


    const aberturaValue = this.clienteForm.get('abertura')?.value;
    console.log('Valor bruto do campo abertura:', aberturaValue, 'Tipo:', typeof aberturaValue);

    if (!aberturaValue || aberturaValue === '' || aberturaValue === null || aberturaValue === undefined) {
      console.log('Campo abertura está vazio, null ou undefined:', aberturaValue);
      this.camposPreenchidos.set(false);
      this.clienteForm.get('abertura')?.setErrors({ required: true });
      return;
    }

    const { abertura, ...rest } = this.clienteForm.value;
    const dadosParaEnviar = {
      ...rest,
      dataFundacao: aberturaValue
    };

    console.log('Dados preparados para envio:', dadosParaEnviar);

    this.isLoading.set(true);

    console.log('Dados a serem enviados:', dadosParaEnviar);

    const isEdicao = !!dadosParaEnviar.id;

    const operacao = isEdicao
      ? this.clienteService.updateCliente(dadosParaEnviar) // PUT
      : this.clienteService.addCliente(dadosParaEnviar);    // POST

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
        this.isLoading.set(false);
        console.error('Erro ao salvar:', err);

        // Se o erro for 409 (Conflito/Duplicata)
        if (err.status === 409) {
          const detalheErro = err.error; // { campo: 'geral', mensagem: 'CNPJ já cadastrado' }

          if (detalheErro.campo === 'geral' || detalheErro.campo === 'cnpj') {
            // Opção A: Marcar o campo CNPJ com o erro vindo do Java
            this.clienteForm.get('cnpj')?.setErrors({ serverError: detalheErro.mensagem });

            // Opção B: Mostrar no topo do formulário (usando o signal que criamos antes)
            this.mensagemErroGlobal.set(detalheErro.mensagem);
          }
        } else if (err.status === 400) {
          // ... lógica de erros de validação (lista) que já fizemos
        } else {
          this.mensagemErroGlobal.set('Erro interno ao processar a requisição.');
        }
      }
    });
  }

  private cnpjValido(cnpj: string): boolean {
    const apenasDigitos = cnpj.replace(/\D/g, '');
    return apenasDigitos.length === 14;
  }

  buscarCnpj(): void {
    const cnpjRaw = this.clienteForm.get('cnpj')?.value || '';
    const cnpj = cnpjRaw.replace(/\D/g, '');

    if (!this.cnpjValido(cnpj)) {
      alert('Digite um CNPJ válido com 14 dígitos numéricos.');
      this.clienteForm.get('cnpj')?.setErrors({ cnpjInvalid: true });
      return;
    }

    this.isLoading.set(true);

    this.clienteService.getCnpjInfo(cnpj).subscribe({
      next: (dados) => {
        this.isLoading.set(false);

        console.log('Dados retornados pela API:', dados); // Debug: ver todos os campos

        if (!dados || dados.status === 'ERROR') {
          alert('Não foi possível buscar informações do CNPJ.');
          return;
        }

        const endereco = [
          dados.logradouro || '',
          dados.numero || '',
          dados.complemento || '',
          dados.bairro || '',
          dados.municipio || '',
          dados.uf || ''
        ].filter((p: string) => !!p).join(', ');

        const dataFormatada = dados.abertura ?
          new Date(dados.abertura.split('/').reverse().join('-')).toISOString().split('T')[0] :
          this.clienteForm.get('abertura')?.value;

        console.log('Data da API:', dados.abertura, 'Data formatada:', dataFormatada);

        this.clienteForm.patchValue({
          razaoSocial: dados.nome || this.clienteForm.get('razaoSocial')?.value,
          nomeFantasia: dados.fantasia || this.clienteForm.get('nomeFantasia')?.value,
          endereco: endereco || this.clienteForm.get('endereco')?.value,
          abertura: dataFormatada || this.clienteForm.get('abertura')?.value
        });

        this.clienteForm.get('cnpj')?.setErrors(null);

      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro ao buscar CNPJ:', err);
        alert('Erro ao buscar informações do CNPJ. Verifique sua conexão e tente novamente.');
      }
    });
  }

  apenasNumeros(event: InputEvent): void {
    const data = event.data; // Pega o caractere que está tentando entrar

    // Se não for número, cancela o evento
    if (data && !/^\d+$/.test(data)) {
      event.preventDefault();
    }
  }
  tratarPaste(event: ClipboardEvent, campo: string): void {
    event.preventDefault();

    // Pega o texto da área de transferência
    const colarTexto = event.clipboardData?.getData('text') || '';

    // Limpa tudo que não é número
    const apenasNumeros = colarTexto.replace(/\D/g, '');

    // Atualiza o campo específico que chamou a função
    this.clienteForm.get(campo)?.patchValue(apenasNumeros);
  }

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

  // Inscrição Estadual
  get ie() {
    return this.clienteForm.get('ie');
  }

  get abertura() {
    return this.clienteForm.get('abertura');
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

  private getFormValidationErrors(): any {
    const result: any = {};
    Object.keys(this.clienteForm.controls).forEach(key => {
      const control = this.clienteForm.get(key);
      if (control && control.errors) {
        result[key] = control.errors;
      }
    });
    return result;
  }

  private dataValida(control: any): { [key: string]: any } | null {
    const value = control.value;
    if (!value || value.trim() === '') {
      return { required: true };
    }
    // Verificar se é uma data válida
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }
    return null;
  }



}
