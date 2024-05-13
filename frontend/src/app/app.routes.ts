import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    path: 'alimentador',
    canActivate:[authGuard],
    loadComponent: () =>
      import('./resources/uploader/uploader.component').then(
        (m) => m.UploaderComponent
      ),
  }
];
