import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProdutoLitragem } from '../interface/ProdutoLitragem';

@Injectable({
  providedIn: 'root',
})
export class ProdutoLitragemService {
   private baseApiUrl = environment.baseApiUrl;
  private apiUrl = `${this.baseApiUrl}/litragem`;

  constructor(private http: HttpClient) {
  }

  //lista litragens
  listarLitragens(): Observable<ProdutoLitragem[]> {
    return this.http.get<ProdutoLitragem[]>(`${this.apiUrl}/listar`);
  }

  //busca litragem por id
  getProduto(id: string): Observable<ProdutoLitragem> {
    return this.http.get<ProdutoLitragem>(`${this.apiUrl}/${id}`);
  }

  //adiciona litragem
  addLitragem(litragem: ProdutoLitragem): Observable<ProdutoLitragem> {
    return this.http.post<ProdutoLitragem>(`${this.apiUrl}`, litragem);
  }

  //atualiza litragem
  updateLitragem(litragem: ProdutoLitragem): Observable<ProdutoLitragem> {
    return this.http.put<ProdutoLitragem>(`${this.apiUrl}/${litragem.id}`, litragem);
  }

  //deleta litragem
  removeProduto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

