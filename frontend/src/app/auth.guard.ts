import { CanActivateFn } from '@angular/router';
import { LoginService } from './pages/login/login.service';
import { inject } from '@angular/core';
import { SharedService } from './shared/shared.service';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(SharedService).checkGuard()

};
