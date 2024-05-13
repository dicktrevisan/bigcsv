import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.interface';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Login } from './login.interface';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);
  router = inject(Router);
sharedService = inject(SharedService)

  login(data: Login): Observable<User> {
    return this.http.post<User>(`http://localhost:3000/user/auth`, data);
  }
  logout() {
    this.sharedService.userSignal.set(this.sharedService.userNulo);
    localStorage.removeItem('token');
  }
  messageService = inject(MessageService);

  abrirToast(tipo: string, conteudo: string, titulo?: string | undefined) {
    this.messageService.add({
      severity: tipo,
      summary: titulo,
      detail: conteudo,
    });
  }

}
