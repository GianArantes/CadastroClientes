import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../services/categoria-service';


@Component({
  selector: 'app-categoria-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css',
})
export class CategoriaForm implements OnInit {

  btnText = signal('Cadastrar');
  formSubmitted = signal(false);
  camposPreenchidos = signal(true);
  isLoading = signal(false);
  categoriaForm!: FormGroup;
  mensagemErroGlobal = signal<string | null>(null);

  constructor(private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.categoriaForm = new FormGroup({
      id: new FormControl(''),
      nome: new FormControl('', [Validators.required])
    });
  }
  private verificarEdicao(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];


      if (id && id !== 'novo') {

        this.btnText.set('Alterar');
        this.carregarCategoria(id);
      } else {
        // Modo NOVO
        this.btnText.set('Cadastrar');
      }
    });
  }
  private carregarCategoria(id: string): void {
    this.isLoading.set(true);
    this.categoriaService.getCategoria(id).subscribe({
      next: (categoria) => {
        this.categoriaForm.patchValue(categoria);
        this.isLoading.set(false);
        console.log('Categoria carregada:', categoria);
      },
      error: (err) => {
        // Erro: não conseguiu carregar
        console.error('Erro ao carregar categoria:', err);
        this.isLoading.set(false);
        alert('Erro ao carregar categoria');

        this.router.navigate(['/categorias']);
      }
    });
  }

  submit(): void {
    this.formSubmitted.set(true);
    if (!this.categoriaForm.valid) {
      this.camposPreenchidos.set(false);
      console.log('Formulário inválido. Campos:', this.categoriaForm.value);
      console.log('Erros de validação:', this.getFormValidationErrors());
      return;
    }

    const aberturaValue = this.categoriaForm.get('abertura')?.value;
    console.log('Valor bruto do campo abertura:', aberturaValue, 'Tipo:', typeof aberturaValue);

    const dadosParaEnviar = this.categoriaForm.value;

    this.isLoading.set(true);

    const isEdicao = !!dadosParaEnviar.id;

    const operacao = isEdicao
      ? this.categoriaService.updateCategoria(dadosParaEnviar) // PUT
      : this.categoriaService.addCategoria(dadosParaEnviar);    // POST

    operacao.subscribe({
      next: (res) => {

        console.log('Sucesso!', res);
        this.isLoading.set(false);

        alert(isEdicao ? 'Categoria alterada com sucesso!' : 'Categoria cadastrada com sucesso!');

        this.router.navigate(['/categorias']);
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
    Object.keys(this.categoriaForm.controls).forEach(key => {
      const control = this.categoriaForm.get(key);
      if (control && control.errors) {
        result[key] = control.errors;
      }
    });
    return result;
  }

   get nome() {
    return this.categoriaForm.get('nome');
  }

}
