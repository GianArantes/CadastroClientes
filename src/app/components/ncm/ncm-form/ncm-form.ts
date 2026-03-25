import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NcmService } from '../../../services/ncm-service';


@Component({
  selector: 'app-categoria-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './ncm-form.html',
  styleUrl: './ncm-form.css',
})
export class NcmForm implements OnInit {

  btnText = signal('Cadastrar');
  formSubmitted = signal(false);
  camposPreenchidos = signal(true);
  isLoading = signal(false);
  ncmForm!: FormGroup;
  mensagemErroGlobal = signal<string | null>(null);

  constructor(private ncmService: NcmService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarEdicao();
  }

  private inicializarFormulario(): void {
    this.ncmForm = new FormGroup({
      id: new FormControl(''),
      codigo: new FormControl('', [Validators.required]),
      descricao: new FormControl('', [Validators.required])
    });
  }
  private verificarEdicao(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];


      if (id && id !== 'novo') {

        this.btnText.set('Alterar');
        this.carregarNcm(id);
      } else {
        // Modo NOVO
        this.btnText.set('Cadastrar');
      }
    });
  }
  private carregarNcm(id: string): void {
    this.isLoading.set(true);
    this.ncmService.getNcm(id).subscribe({
      next: (ncm) => {
        this.ncmForm.patchValue(ncm);
        this.isLoading.set(false);
        console.log('NCM carregado:', ncm);
      },
      error: (err) => {
        // Erro: não conseguiu carregar
        console.error('Erro ao carregar NCM:', err);
        this.isLoading.set(false);
        alert('Erro ao carregar NCM');

        this.router.navigate(['/ncms']);
      }
    });
  }

  submit(): void {
    this.formSubmitted.set(true);
    if (!this.ncmForm.valid) {
      this.camposPreenchidos.set(false);
      console.log('Formulário inválido. Campos:', this.ncmForm.value);
      console.log('Erros de validação:', this.getFormValidationErrors());
      return;
    }

    const dadosParaEnviar = this.ncmForm.value;

    this.isLoading.set(true);

    const isEdicao = !!dadosParaEnviar.id;

    const operacao = isEdicao
      ? this.ncmService.updateNcm(dadosParaEnviar) // PUT
      : this.ncmService.addNcm(dadosParaEnviar);    // POST
    console.log('Dados a serem enviados:', dadosParaEnviar);
    operacao.subscribe({
      next: (res) => {

        console.log('Sucesso!', res);
        this.isLoading.set(false);

        alert(isEdicao ? 'NCM alterada com sucesso!' : 'NCM cadastrada com sucesso!');

        this.router.navigate(['/ncms']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro ao salvar:', err);

        if (err.status === 409) {
          const detalheErro = err.error;

          this.mensagemErroGlobal.set(detalheErro.mensagem);

        } else if (err.status === 400) {

        } else {

          this.mensagemErroGlobal.set('Erro interno ao processar a requisição.');
        }
      }
    });
  }

  private getFormValidationErrors(): any {
    const result: any = {};
    Object.keys(this.ncmForm.controls).forEach(key => {
      const control = this.ncmForm.get(key);
      if (control && control.errors) {
        result[key] = control.errors;
      }
    });
    return result;
  }

  get codigo() {
    return this.ncmForm.get('codigo');
  }

  get descricao() {
    return this.ncmForm.get('descricao');
  }
}
