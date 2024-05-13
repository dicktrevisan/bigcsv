import { Component,  inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { FloatLabelModule } from 'primeng/floatlabel';

import {

  FormsModule,

} from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AutoFocusModule } from 'primeng/autofocus';
import { LoginService } from './login.service';
import { Login } from './login.interface';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SharedService } from '../../shared/shared.service';

const primeModules = [
  InputTextModule,
  ButtonModule,
  PasswordModule,
  AutoFocusModule,InputMaskModule, FloatLabelModule
];
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...primeModules, FormsModule,  CommonModule, NgxMaskDirective, ],
  providers: [TitleCasePipe, LoginService, provideNgxMask(),
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  started1 = false;
  started = false;
  router = inject(Router);
  titleCasePipe = inject(TitleCasePipe);
  loginService = inject(LoginService);
  sharedService = inject(SharedService);
  documentoForm = '';
  senhaForm = '';
  validSenha = true;
  validDocumento = true;
  passwordType = true;
  shakeIt = false;


userLogin:Login={
  documento:'',
  senha:''
}
  ngOnInit() {
    this.userLogin={
      documento:'',
      senha:''
    }
  }

  showPassword() {
    this.passwordType = !this.passwordType;
  }


  postData() {
       return this.loginService.login(this.userLogin).subscribe({
      next: (result) => {
        console.log(result)
          localStorage.setItem('token', result.token);
          localStorage.setItem('documento', result.documento);
          this.sharedService.userSignal.set(result)
          this.loginService.abrirToast('success', `Usuário logado com sucesso`);
          this.router.navigate(['/alimentador', {replaceUrl:true}])
      },

      error: (error) => {
        this.shakeDialog();
        console.error(error);
      },
      complete: () => {},
    });
  }
  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('documento');
  }
  shakeDialog() {
    this.shakeIt = true;
    setTimeout((arg: any) => {
      this.shakeIt = false;
    }, 300);
  }
  esqueceuSenha() {
    this.router.navigate(['/redefinir-senha'], { replaceUrl: true });
  }
}
