import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { NcmEstado } from '../../../interface/NcmEstado';
import { NcmEstadoService } from '../../../services/ncm-estado-service';
import { Ncm } from '../../../interface/Ncm';
import { NcmService } from '../../../services/ncm-service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ncm-estado-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ncm-estado-form.html',
  styleUrl: './ncm-estado-form.css',
})
export class NcmEstadoForm implements OnInit {
  ncmListaEstado = signal<NcmEstado[]>([]);
  searchTerm = signal('');
  ncm = signal<Ncm>({} as Ncm);
  ncmEstadoForm!: FormGroup;
  formSubmitted = signal(false);
  mensagemErroGlobal = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private ncmService: NcmService, private ncmEstadoService: NcmEstadoService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.carregarNcm(id!);
    this.carregarNcmEstados(id!);
    this.inicializarFormulario();
  }



  private inicializarFormulario(): void {
    this.ncmEstadoForm = new FormGroup({
      id: new FormControl(''),
      estado: new FormControl('', [Validators.required]),
      aliquota: new FormControl('', [Validators.required])
    });
  }

  carregarNcm(id: string): void {
    this.ncmService.getNcm(id).subscribe({
      next: (dados) => {
        // Sucesso: dados chegaram
        this.ncm.set(dados);              // Armazena dados brutos
        console.log('Ncm carregada:', dados); // Debug
      },
      error: (err) => {
        // Erro: algo deu errado
        console.error('Erro ao carregar Ncm:', err);
      }
    });
  }

  carregarNcmEstados(id: string): void {
    this.ncmEstadoService.listarNcmsEstados(id).subscribe({
      next: (dados) => {
        // Sucesso: dados chegaram
        this.ncmListaEstado.set(dados);              // Armazena dados brutos
        console.log('Ncms Estados carregadas:', dados); // Debug
      },
      error: (err) => {
        // Erro: algo deu errado
        console.error('Erro ao carregar Ncms Estados:', err);
      }
    });
  }


  excluirNcmEstado(id: string): void {
    // Confirmação: if true = usuário clicou OK, if false = cancelou
    if (confirm('Tem certeza que deseja excluir este NCM?')) {
      // Usuário confirmou: executa deleção
      this.ncmEstadoService.removeNcmEstado(id).subscribe({
        next: () => {
          // Sucesso: ncm foi deletada
          console.log('Ncm excluído com sucesso');
          // Atualiza tabela recarregando lista
          this.carregarNcmEstados(id);
        },
        error: (err) => {
          // Erro: algo deu errado
          console.error('Erro ao excluir ncm:', err);
          alert('Erro ao excluir ncm');
        }
      });
    }
    // Se usuário clicou Cancelar, nada acontece
  }

  cadastrar(): void {
    this.formSubmitted.set(true);
    if (!this.ncmEstadoForm.valid) {
      this.mensagemErroGlobal.set('Por favor, preencha todos os campos corretamente.');
      return;
    }
    const dadosParaEnviar = {
      ...this.ncmEstadoForm.value,
      ncmId: this.route.snapshot.paramMap.get('id')!
    };
    this.isLoading.set(true);
    this.ncmEstadoService.addNcmEstado(dadosParaEnviar).subscribe({
      next: (res) => {
        console.log('Sucesso!', res);
        this.isLoading.set(false);
        this.ncmEstadoForm.reset();
        this.carregarNcmEstados(this.route.snapshot.paramMap.get('id')!);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro ao salvar:', err);
        this.mensagemErroGlobal.set('Erro ao adicionar estado.');
      }
    });
  }

  editarEstado(estado: NcmEstado): void {
    this.ncmEstadoForm.patchValue({
      id: estado.id,
      estado: estado.estado,
      aliquota: estado.aliquota
    });
  }

  alterar(): void {
    this.formSubmitted.set(true);
    if (!this.ncmEstadoForm.valid) {
      this.mensagemErroGlobal.set('Por favor, preencha todos os campos corretamente.');
      return;
    }
    const dadosParaEnviar = this.ncmEstadoForm.value;
    this.isLoading.set(true);
    this.ncmEstadoService.updateNcmEstado(dadosParaEnviar).subscribe({
      next: (res) => {
        console.log('Sucesso!', res);
        this.isLoading.set(false);
        this.ncmEstadoForm.reset();
        this.carregarNcmEstados(this.route.snapshot.paramMap.get('id')!);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro ao alterar:', err);
        this.mensagemErroGlobal.set('Erro ao alterar estado.');
      }
    });
  }

  excluirEstado(id: string): void {
    if (confirm('Tem certeza que deseja excluir este estado?')) {
      this.ncmEstadoService.removeNcmEstado(id).subscribe({
        next: () => {
          this.carregarNcmEstados(this.route.snapshot.paramMap.get('id')!);
        },
        error: (err) => {
          console.error('Erro ao excluir:', err);
        }
      });
    }
  }


  get estado() {
    return this.ncmEstadoForm.get('estado');
  }
  get aliquota() {
    return this.ncmEstadoForm.get('aliquota');
  }

  get ncmId() {
    return this.ncmEstadoForm.get('ncmId');
  }
}
