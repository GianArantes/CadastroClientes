import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../services/produto-service';


@Component({
  selector: 'app-produto-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css',
})
export class ProdutoForm implements OnInit {

  btnText = signal('Cadastrar');
  formSubmitted = signal(false);
  camposPreenchidos = signal(true);
  isLoading = signal(false);
  produtoForm!: FormGroup;
  mensagemErroGlobal = signal<string | null>(null);

  constructor(private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.produtoForm = new FormGroup({
      id: new FormControl(''),
      nome: new FormControl('', [Validators.required]),
      refNf: new FormControl('', [Validators.required]),
      ipi: new FormControl('', [Validators.required]),
      peso: new FormControl('', [Validators.required]),
      qtdadePorEmbalagem: new FormControl('', [Validators.required])
    });
  }
  private verificarEdicao(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];


      if (id && id !== 'novo') {

        this.btnText.set('Alterar');
        this.carregarProduto(id);
      } else {
        // Modo NOVO
        this.btnText.set('Cadastrar');
      }
    });
  }
  private carregarProduto(id: string): void {
    this.isLoading.set(true);
    this.produtoService.getProduto(id).subscribe({
      next: (produto) => {
        this.produtoForm.patchValue(produto);
        this.isLoading.set(false);
        console.log('Produto carregado:', produto);
      },
      error: (err) => {
        // Erro: não conseguiu carregar
        console.error('Erro ao carregar produto:', err);
        this.isLoading.set(false);
        alert('Erro ao carregar produto');

        this.router.navigate(['/produtos']);
      }
    });
  }

  submit(): void {
    this.formSubmitted.set(true);
    if (!this.produtoForm.valid) {
      this.camposPreenchidos.set(false);
      console.log('Formulário inválido. Campos:', this.produtoForm.value);
      console.log('Erros de validação:', this.getFormValidationErrors());
      return;
    }

    const aberturaValue = this.produtoForm.get('abertura')?.value;
    console.log('Valor bruto do campo abertura:', aberturaValue, 'Tipo:', typeof aberturaValue);

    const dadosParaEnviar = this.produtoForm.value;

    this.isLoading.set(true);

    const isEdicao = !!dadosParaEnviar.id;

    const operacao = isEdicao
      ? this.produtoService.updateProduto(dadosParaEnviar) // PUT
      : this.produtoService.addProduto(dadosParaEnviar);    // POST

    operacao.subscribe({
      next: (res) => {

        console.log('Sucesso!', res);
        this.isLoading.set(false);

        alert(isEdicao ? 'Produto alterado com sucesso!' : 'Produto cadastrado com sucesso!');

        this.router.navigate(['/produtos']);
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
    Object.keys(this.produtoForm.controls).forEach(key => {
      const control = this.produtoForm.get(key);
      if (control && control.errors) {
        result[key] = control.errors;
      }
    });
    return result;
  }

   get nome() {
    return this.produtoForm.get('nome');
  }

  get refNf() {
    return this.produtoForm.get('refNf');
  }

  get ipi() {
    return this.produtoForm.get('ipi');
  }
  get peso() {
    return this.produtoForm.get('peso');
  }

  get qtdadePorEmbalagem() {
    return this.produtoForm.get('qtdadePorEmbalagem');
  }
}
