import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ncm } from '../interface/Ncm';

@Injectable({
  providedIn: 'root',
})
export class NcmService {
  private baseApiUrl = environment.baseApiUrl;
  private apiUrl = `${this.baseApiUrl}/ncms`;

  constructor(private http: HttpClient) {}

  //lista ncms
  listarNcms(): Observable<Ncm[]> {
    return this.http.get<Ncm[]>(`${this.apiUrl}/listar`);
  }

  //busca ncm por id
  getNcm(id: string): Observable<Ncm> {
    return this.http.get<Ncm>(`${this.apiUrl}/${id}`);
  }

  //adiciona ncm
  addNcm(ncm: Ncm): Observable<Ncm> {
    return this.http.post<Ncm>(`${this.apiUrl}`, ncm);
  }

  //atualiza ncm
  updateNcm(ncm: Ncm): Observable<Ncm> {
    return this.http.put<Ncm>(`${this.apiUrl}/${ncm.id}`, ncm);
  }

  //deleta ncm
  removeNcm(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
