import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProdutoLitragemService } from '../../../services/produto-litragem-service';


@Component({
  selector: 'app-categoria-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './litragem-form.html',
  styleUrl: './litragem-form.css',
})
export class LitragemForm implements OnInit {

  btnText = signal('Cadastrar');
  formSubmitted = signal(false);
  camposPreenchidos = signal(true);
  isLoading = signal(false);
  litragemForm!: FormGroup;
  mensagemErroGlobal = signal<string | null>(null);

  constructor(private litragemService: ProdutoLitragemService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarEdicao();
  }

  private inicializarFormulario(): void {
    this.litragemForm = new FormGroup({
      id: new FormControl(''),
      nome: new FormControl('', [Validators.required])
    });
  }
  private verificarEdicao(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];


      if (id && id !== 'novo') {

        this.btnText.set('Alterar');
        this.carregarLitragem(id);
      } else {
        // Modo NOVO
        this.btnText.set('Cadastrar');
      }
    });
  }
  private carregarLitragem(id: string): void {
    this.isLoading.set(true);
    this.litragemService.getLitragem(id).subscribe({
      next: (litragem) => {
        this.litragemForm.patchValue(litragem);
        this.isLoading.set(false);
        console.log('Litragem carregada:', litragem);
      },
      error: (err) => {
        // Erro: não conseguiu carregar
        console.error('Erro ao carregar litragem:', err);
        this.isLoading.set(false);
        alert('Erro ao carregar litragem');

        this.router.navigate(['/litragem']);
      }
    });
  }

  submit(): void {
    this.formSubmitted.set(true);
    if (!this.litragemForm.valid) {
      this.camposPreenchidos.set(false);
      console.log('Formulário inválido. Campos:', this.litragemForm.value);
      console.log('Erros de validação:', this.getFormValidationErrors());
      return;
    }

    const aberturaValue = this.litragemForm.get('abertura')?.value;
    console.log('Valor bruto do campo abertura:', aberturaValue, 'Tipo:', typeof aberturaValue);

    const dadosParaEnviar = this.litragemForm.value;

    this.isLoading.set(true);

    const isEdicao = !!dadosParaEnviar.id;

    const operacao = isEdicao
      ? this.litragemService.updateLitragem(dadosParaEnviar) // PUT
      : this.litragemService.addLitragem(dadosParaEnviar);    // POST

    operacao.subscribe({
      next: (res) => {

        console.log('Sucesso!', res);
        this.isLoading.set(false);

        alert(isEdicao ? 'Litragem alterada com sucesso!' : 'Litragem cadastrada com sucesso!');

        this.router.navigate(['/litragem']);
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
    Object.keys(this.litragemForm.controls).forEach(key => {
      const control = this.litragemForm.get(key);
      if (control && control.errors) {
        result[key] = control.errors;
      }
    });
    return result;
  }

   get nome() {
    return this.litragemForm.get('nome');
  }

}
