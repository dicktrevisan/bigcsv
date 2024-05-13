import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../pages/login/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  router = inject(Router)
  userNulo: User = {
    nome: '',
    documento: '',
    token: '',
    email: '',
    id:''
  };
  userSignal = signal<User>(this.userNulo);
  checkGuard(): boolean {
    if (this.userSignal().documento.length==11) {
      console.log(true)
      return true;
    }
    this.router.navigate(['/'], { replaceUrl: true });
    console.log(this.userSignal())

    return false;
  }
}
