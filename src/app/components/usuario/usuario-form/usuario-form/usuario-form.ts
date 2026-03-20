import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario-service';



export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha');
  const confirmar = control.get('senhaConfirm');

  // Se os valores forem diferentes, retorna um erro chamado 'passwordMismatch'
  return senha && confirmar && senha.value !== confirmar.value
    ? { passwordMismatch: true }
    : null;
}


@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm {

  btnText = signal('Cadastrar');
  formSubmitted = signal(false);
  camposPreenchidos = signal(true);
  isLoading = signal(false);

  usuarioForm!: FormGroup;




  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarEdicao();
  }

  private inicializarFormulario(): void {
    this.usuarioForm = new FormGroup({
      id: new FormControl(''),
      nomeCompleto: new FormControl('', [Validators.required]),
      apelido: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]),
      senhaConfirm: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]),
      telefone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]),
    }, {
      // IMPORTANTE: O validador vai aqui, nas opções do grupo!
      validators: passwordMatchValidator
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
    this.usuarioForm.get(campo)?.patchValue(apenasNumeros);
  }

  private verificarEdicao(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];

      // Se tem ID e não é a string 'novo' = é um UUID real
      if (id && id !== 'novo') {
        // Modo EDIÇÃO
        this.btnText.set('Alterar');
        this.carregarUsuario(id);
      } else {
        // Modo NOVO
        this.btnText.set('Cadastrar');
      }
    });
  }
  private carregarUsuario(id: string): void {
    this.isLoading.set(true);
    this.usuarioService.getUsuario(id).subscribe({
      next: (usuario) => {
        // Sucesso: preencheu os dados
        this.usuarioForm.patchValue(usuario);
        this.isLoading.set(false);
        console.log('Usuario carregado:', usuario);
      },
      error: (err) => {
        // Erro: não conseguiu carregar
        console.error('Erro ao carregar usuário:', err);
        this.isLoading.set(false);
        alert('Erro ao carregar usuário');
        // Volta para lista de usuários
        this.router.navigate(['/usuarios']);
      }
    });
  }
  submit(): void {
    this.formSubmitted.set(true);
    if (!this.usuarioForm.valid) {
      this.camposPreenchidos.set(false);
      console.log('Formulário inválido');
      return; // Cancela
    }
    const { senhaConfirm, ...dadosUsuario } = this.usuarioForm.value;

    this.isLoading.set(true);
    const isEdicao = !!this.usuarioForm.get('id')?.value;
    const operacao = isEdicao
      ? this.usuarioService.updateUsuario(dadosUsuario) // PUT
      : this.usuarioService.addUsuario(dadosUsuario);    // POST
    operacao.subscribe({
      next: (res) => {
        console.log('Sucesso!', res);
        this.isLoading.set(false);
        // Alerta personalizado conforme o modo
        alert(isEdicao ? 'Usuario alterado com sucesso!' : 'Usuario cadastrado com sucesso!');
        // Redireciona para lista de usuarios
        this.router.navigate(['/usuario']);
      },
      // error: (err) => {
      //   // Erro na requisição
      //   console.error('Erro ao salvar:', err);
      //   this.isLoading.set(false);
      //   alert('Erro ao salvar usuário');
      // }
      error: (err) => {
        console.error('Erro ao salvar:', err);
        this.isLoading.set(false);

        if (err.status === 400) {
          // Aqui 'err.error' contém a lista de ErrorResponse do Java
          const validacoes = err.error;

          validacoes.forEach((erro: any) => {
            // Aplica o erro diretamente no campo do formulário correspondente
            this.usuarioForm.get(erro.field)?.setErrors({ serverError: erro.message });
          });
        } else {
          alert('Erro crítico no servidor.');
        }
      }
    });
  }


  get nomeCompleto() {
    return this.usuarioForm.get('nomeCompleto');
  }

  get apelido() {
    return this.usuarioForm.get('apelido');
  }

  get email() {
    return this.usuarioForm.get('email');
  }

  get senha() {
    return this.usuarioForm.get('senha');
  }

  get senhaConfirm() {
    return this.usuarioForm.get('senhaConfirm');
  }

  get telefone() {
    return this.usuarioForm.get('telefone');
  }
}
