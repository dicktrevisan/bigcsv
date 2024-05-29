import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competencia } from './competencia.interface';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  http = inject(HttpClient)

  enviarDimp(data:FormData, mes:string, ano:string){
    return this.http.post<File>(`http://localhost:3000/alimentador/${mes}/${ano}`, data, { headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },})

  }
  consultarCompetencias():Observable<Competencia[]>{
    return this.http.get<Competencia[]>('http://localhost:3000/alimentador/lista', { headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },})
  }
}
