import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NcmEstado } from '../interface/NcmEstado';

@Injectable({
  providedIn: 'root',
})
export class NcmEstadoService {
  private baseApiUrl = environment.baseApiUrl;
  private apiUrl = `${this.baseApiUrl}/ncms-estados`;

  constructor(private http: HttpClient) {}

  //lista ncms-estados
  listarNcmsEstados(id: string): Observable<NcmEstado[]> {
    return this.http.get<NcmEstado[]>(`${this.apiUrl}/listar/${id}`);
  }

  //busca ncm por id
  getNcmEstado(id: string): Observable<NcmEstado> {
    return this.http.get<NcmEstado>(`${this.apiUrl}/${id}`);
  }

  //adiciona ncm
  addNcmEstado(ncm: NcmEstado): Observable<NcmEstado> {
    return this.http.post<NcmEstado>(`${this.apiUrl}`, ncm);
  }

  //atualiza ncm
  updateNcmEstado(ncm: NcmEstado): Observable<NcmEstado> {
    return this.http.put<NcmEstado>(`${this.apiUrl}/${ncm.id}`, ncm);
  }

  //deleta ncm
  removeNcmEstado(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
